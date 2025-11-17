// netlify/functions/chat.js - DR. LEX IA (REESCRITO: PROFISSIONAL, JURÍDICO, HUMANIZADO)
// Node 14+ compatible Netlify Function

const fetch = require('node-fetch');

// ==========================
// CONFIGURAÇÕES
// ==========================
const REQUEST_DELAY_MS = 1000; // intervalo mínimo entre chamadas ao OpenAI por função (proteção básica)
const OPENAI_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"]; // fallback order
const OPENAI_TIMEOUT_MS = 15000; // timeout para chamadas externas

// Prompt system robusto e jurídico (humanizado)
const DR_LEX_PROMPT = `Você é o Dr. Lex IA — Assistente Jurídico Inteligente, especialista em direito brasileiro.

Tom: profissional, humano, empático e direto. Use linguagem acessível, mas tecnicamente correta.
Objetivo: fornecer orientação jurídica educativa inicial, apontando direitos, prazos, riscos e próximos passos.

Regras importantes:
- Sempre inclua aviso que isto é orientação educativa e não substitui um advogado.
- Seja preciso: quando houver incerteza explique como o usuário pode obter prova documental ou laudo.
- Para cada resposta entregue esta estrutura quando aplicável:\n 1) Resumo rápido\n 2) Direitos aplicáveis\n 3) Passos imediatos (passo-a-passo)\n 4) Prazos legais relevantes\n 5) Riscos e recomendações\n 6) Quando procurar advogado\n- Mantenha a resposta concisa, com linguagem humana; se o usuário pedir, ofereça versão técnica mais longa.

Especialidades: Trabalhista, Consumidor, Família, Civil, Contratual, Imobiliário, Empresarial e penal (orientação inicial apenas).
`;

// ==========================
// HANDLER Netlify
// ==========================
exports.handler = async function(event, context) {
    // CORS headers para responder corretamente
    const CORS_HEADERS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    // Parse body
    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (err) {
        return sendError(400, 'JSON inválido no corpo da requisição', CORS_HEADERS);
    }

    const userMessage = (body.message || '').toString().trim();
    if (!userMessage) return sendError(400, 'Campo "message" é obrigatório', CORS_HEADERS);

    // Rate-limit simples por execução (proteção contra flood síncrono)
    const now = Date.now();
    if (exports.__lastRequestAt && (now - exports.__lastRequestAt) < REQUEST_DELAY_MS) {
        console.log('Rate limit interno ativado, usando fallback local');
        const fallback = generateSmartLocalResponse(userMessage);
        return sendSuccess(fallback, 'Sistema Local (Rate Limit)', null, CORS_HEADERS);
    }
    exports.__lastRequestAt = now;

    // Chave da OpenAI
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
        console.warn('OPENAI_API_KEY não configurada. Usando sistema local');
        const fallback = generateSmartLocalResponse(userMessage);
        return sendSuccess(fallback, 'Sistema (API Key ausente)', null, CORS_HEADERS);
    }

    // Detectar área e montar prompt adicional
    const area = detectArea(userMessage);
    const personalizedSystem = DR_LEX_PROMPT + "\nAssunto detectado: " + area + ".\nResponda com exemplos práticos e referências de procedimentos quando aplicável.";

    // Tenta modelos em fallback order
    let lastError = null;
    for (const model of OPENAI_MODELS) {
        try {
            console.log(`Tentando OpenAI modelo=${model}`);
            const aiResponse = await callOpenAIResponsesAPI({
                apiKey: OPENAI_KEY,
                model,
                systemPrompt: personalizedSystem,
                userMessage: userMessage,
                timeoutMs: OPENAI_TIMEOUT_MS
            });

            // Se veio texto válido
            if (aiResponse && aiResponse.trim()) {
                return sendSuccess(aiResponse, model, null, CORS_HEADERS);
            }

        } catch (err) {
            console.error('Erro OpenAI modelo=', model, err.message || err);
            lastError = err;
            // se for insufficent_quota falha rápido para fallback local
            if (String(err.message || '').toLowerCase().includes('insufficient_quota')) {
                break; // não testar outros modelos
            }
            // senão, tenta próximo modelo
        }
    }

    // Se todos falharam, usar sistema local
    console.log('Todos modelos falharam. Retornando fallback local. Último erro:', lastError && lastError.message);
    const fallback = generateSmartLocalResponse(userMessage);
    return sendSuccess(fallback, 'Sistema Local Inteligente', lastError && lastError.message, CORS_HEADERS);
};

// ==========================
// FUNÇÕES AUXILIARES - CHAMADA OPENAI (Responses API robusta)
// ==========================
async function callOpenAIResponsesAPI({ apiKey, model, systemPrompt, userMessage, timeoutMs = 15000 }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const payload = {
            model: model,
            input: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_output_tokens: 900,
            temperature: 0.25
        };

        const res = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`OpenAI API error: ${res.status} - ${txt}`);
        }

        const data = await res.json();

        // Vários formatos possíveis: output_text, output[].content[].text, output[].content[].parts
        if (data.output_text) return data.output_text.trim();

        if (Array.isArray(data.output) && data.output.length) {
            // concat content blocks
            const parts = [];
            data.output.forEach(block => {
                if (Array.isArray(block.content)) {
                    block.content.forEach(c => {
                        if (typeof c.text === 'string') parts.push(c.text);
                        else if (Array.isArray(c.parts)) parts.push(c.parts.join(''));
                    });
                }
            });
            const joined = parts.join('\n').trim();
            if (joined) return joined;
        }

        // Fallback: se as choices exist (compatibilidade com chat.completions)
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }

        // Se nada acima, retornar null para sinalizar falha
        return null;

    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

// ==========================
// FUNÇÃO DE DETECÇÃO DE ÁREA (rápida e extensível)
// ==========================
function detectArea(text) {
    const m = (text || '').toLowerCase();
    if (/demiss|demit|rescis/i.test(m)) return 'Trabalhista';
    if (/férias|ferias|contrato de trabalho|fgts|inss|e social/i.test(m)) return 'Trabalhista';
    if (/produto|garantia|compra|venda|reclamação|procon/i.test(m)) return 'Consumidor';
    if (/divórcio|guarda|pensão|filho|casamento/i.test(m)) return 'Família';
    if (/contrato|inadimpl|cobrança|dívida|divida|acordo/i.test(m)) return 'Contratual/Civil';
    if (/aluguel|locação|imóvel|inquilino|iptu/i.test(m)) return 'Imobiliário';
    if (/empresa|sócio|contrato social|cota/i.test(m)) return 'Empresarial';
    if (/crime|delegacia|prisão|boletim de ocorrência|bo/i.test(m)) return 'Penal';
    return 'Geral';
}

// ==========================
// SISTEMA LOCAL INTELIGENTE (fallback enriquecido)
// ==========================
function generateSmartLocalResponse(message) {
    const lower = (message || '').toLowerCase();

    // respostas rápidas e humanizadas por categoria
    if (containsAny(lower, ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite'])) {
        return `**Dr. Lex IA** ⚖️\n\n*Saudações! Sou seu assistente jurídico digital.*\n\n🎯 **Posso ajudá-lo com:**\n• Direito Trabalhista\n• Direito do Consumidor\n• Direito de Família\n• Direito Civil\n\n💡 *Descreva sua situação com detalhes (datas, valores e documentos) para orientação mais precisa.*`;
    }

    if (containsAny(lower, ['demissão', 'demitido', 'demitida', 'rescisão'])) {
        return `**Dr. Lex IA** ⚖️\n\n## Demissão - Orientação inicial\n\n**Passos imediatos:**\n1) Reúna contrato, holerites e termo de rescisão.\n2) Verifique verbas pagas: férias, 13º, saldo de salário e FGTS.\n3) Procure sindicato/advogado para cálculo e eventual ação trabalhista.\n\n**Prazos:** Ação trabalhista: até 2 anos após a data de saída da empresa (observe as regras específicas).\n\n⚠️ *Esta é orientação educativa. Procure advogado para análise completa.*`;
    }

    if (containsAny(lower, ['produto', 'defeito', 'garantia', 'troca'])) {
        return `**Dr. Lex IA** ⚖️\n\n## Produto com defeito - orientação prática\n\n**Direitos:** Prazo de 30 dias para não duráveis e 90 dias para duráveis.\n**O que fazer:** Notifique o fornecedor por escrito, guarde comprovantes e peça conserto ou troca.\n**Se não resolver:** Registre reclamação no PROCON / juizado especial.\n\n⚠️ *Orientação educativa. Para medidas judiciais, procure advogado.*`;
    }

    // resposta genérica
    return `**Dr. Lex IA** ⚖️\n\n🔍 **Recebi sua consulta:** \nPara "${escapeForTemplate(message)}".\n\n**Recomendo:** descreva os fatos em ordem cronológica, informe valores, datas e envie documentos.\n\n⚠️ *Orientação educativa. Consulte advogado para análise jurídica completa.*`;
}

// ==========================
// UTILIDADES
// ==========================
function containsAny(text, keywords) {
    return keywords.some(k => text.indexOf(k) !== -1);
}

function escapeForTemplate(s) {
    return (s || '').replace(/[`$]/g, "");
}

function sendSuccess(responseText, source, error = null, headers = {}) {
    const body = {
        success: true,
        response: responseText,
        source,
        error
    };
    return { statusCode: 200, headers: Object.assign({ 'Content-Type': 'application/json' }, headers), body: JSON.stringify(body) };
}

function sendError(code, message, headers = {}) {
    const body = { success: false, error: message };
    return { statusCode: code, headers: Object.assign({ 'Content-Type': 'application/json' }, headers), body: JSON.stringify(body) };
}
