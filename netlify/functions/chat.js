// netlify/functions/chat.js - SISTEMA HÍBRIDO INTELIGENTE
const fetch = require('node-fetch');

// Cache simples para evitar rate limit
let lastRequestTime = 0;
const REQUEST_DELAY = 2000; // 2 segundos entre requests

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { message } = JSON.parse(event.body);
        console.log('📨 Pergunta:', message);

        // ⏰ Controle de rate limit manual
        const now = Date.now();
        if (now - lastRequestTime < REQUEST_DELAY) {
            console.log('⏰ Rate limit manual - usando sistema local');
            const respostaLocal = generateSmartLocalResponse(message);
            return sendSuccess(respostaLocal, 'Sistema Local (Rate Limit)');
        }
        lastRequestTime = now;

        // 🔑 Verifica chave OpenAI
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!openaiKey || openaiKey === 'sua-chave-openai-aqui') {
            console.log('🔑 Chave OpenAI não configurada');
            return sendSuccess(
                "**Dr. Lex IA** ⚖️\n\n*Sistema em configuração final.*\n\n⚖️ *Em breve com IA completa!*",
                'Sistema'
            );
        }

        // 🚀 Tenta OpenAI com timeout
        try {
            console.log('🔄 Tentando OpenAI...');
            const respostaOpenAI = await callOpenAIWithTimeout(message, openaiKey);
            console.log('✅ OpenAI respondeu com sucesso');
            return sendSuccess(respostaOpenAI, 'OpenAI GPT-3.5 Turbo');
            
        } catch (openaiError) {
            console.log('🔄 OpenAI falhou:', openaiError.message);
            
            // Sistema Local Inteligente como fallback
            const respostaLocal = generateSmartLocalResponse(message);
            return sendSuccess(respostaLocal, 'Sistema Local Inteligente', openaiError.message);
        }
        
    } catch (error) {
        console.error('💥 Erro geral:', error);
        const respostaLocal = generateSmartLocalResponse(message);
        return sendSuccess(respostaLocal, 'Sistema', error.message);
    }
};
async function callOpenAIWithTimeout(message, apiKey) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                input: [
                    { 
                        role: "system", 
                        content: `Você é o Dr. Lex IA, especialista em orientação jurídica brasileira.  
Responda com clareza, objetividade e sempre enfatize que NÃO substitui advogado.` 
                    },
                    { role: "user", content: message }
                ],
                max_output_tokens: 600,
                temperature: 0.6
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.output[0].content[0].text;

    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

// === SISTEMA LOCAL INTELIGENTE ===
function generateSmartLocalResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // SAUDAÇÕES
    if (containsAny(lowerMessage, ['oi', 'olá', 'ola', 'hello', 'iniciar', 'start'])) {
        return `**Dr. Lex IA** ⚖️\n\n*Saudações! Sou seu assistente jurídico digital.*\n\n🎯 **Posso ajudá-lo com:**\n• 🏢 **Direito Trabalhista** (demissão, férias, verbas)\n• 🛒 **Direito do Consumidor** (produtos, serviços, garantias)\n• 👨‍👩‍👧‍👦 **Direito de Família** (divórcio, pensão, guarda)\n• 📝 **Direito Civil** (contratos, obrigações)\n\n💡 *Descreva sua situação para orientação jurídica educativa.*`;
    }
    
    if (containsAny(lowerMessage, ['bom dia', 'boa tarde', 'boa noite'])) {
        return `**Dr. Lex IA** ⚖️\n\n*${lowerMessage.includes('bom dia') ? 'Bom dia' : lowerMessage.includes('boa tarde') ? 'Boa tarde' : 'Boa noite'}! Em que posso auxiliá-lo com questões jurídicas?*`;
    }
    
    if (containsAny(lowerMessage, ['obrigado', 'obrigada', 'valeu'])) {
        return `**Dr. Lex IA** ⚖️\n\n*De nada! Fico feliz em poder orientá-lo.*\n\n📞 **Lembre-se:** Esta é uma orientação educativa inicial. Para casos específicos, consulte sempre um advogado.`;
    }
    
    // DIREITO TRABALHISTA
    if (containsAny(lowerMessage, ['demissão', 'demissao', 'demitido', 'demitida', 'rescisão'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🏢 Demissão - Direitos Trabalhistas\n\n**Sem Justa Causa:**\n• Aviso prévio (30 dias + 3/ano)\n• 13º salário proporcional\n• Férias vencidas + proporcionais\n• FGTS + multa de 40%\n• Saldo de salário\n\n**Ações Recomendadas:**\n1. Revise cuidadosamente a rescisão\n2. Documente todas as comunicações\n3. Consulte advogado trabalhista\n\n⏳ *Prazo prescricional: 2 anos*`;
    }
    
    if (containsAny(lowerMessage, ['férias', 'ferias', 'descanso'])) {
        return `**Dr. Lex IA** ⚖️\n\n## ⛱️ Férias - CLT\n\n**Direitos Adquiridos:**\n• 12 meses de trabalho = direito adquirido\n• 30 dias corridos de descanso\n• + 1/3 constitucional (33,33%)\n• Concessão em até 12 meses após aquisição\n\n💰 *Para cálculo específico, consulte contador ou advogado*`;
    }
    
    // DIREITO DO CONSUMIDOR
    if (containsAny(lowerMessage, ['produto', 'defeito', 'quebrou', 'não funciona', 'garantia'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🛒 Produto com Defeito - CDC\n\n**Prazos Legais:**\n• 30 dias - produtos não duráveis\n• 90 dias - produtos duráveis\n\n**Seus Direitos:**\n1. Reparo gratuito\n2. Troca do produto\n3. Devolução do valor pago\n4. Abatimento proporcional\n\n**Ações:** Notificação → PROCON → Juizado Especial`;
    }
    
    if (containsAny(lowerMessage, ['carro', 'veículo', 'veiculo']) && containsAny(lowerMessage, ['defeito', 'quebrou'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🚗 Veículo com Defeito\n\n**CDC - Artigo 26:**\n• 90 dias para vícios ocultos\n• Direito à substituição ou restituição\n\n**Procedimento Recomendado:**\n1. Notificação extrajudicial formal\n2. Laudo técnico independente\n3. PROCON para mediação\n4. Juizado Especial (até 40 salários)\n\n⚖️ *Documente todas as etapas!*`;
    }
    
    // RESPOSTA INTELIGENTE GENÉRICA
    return `**Dr. Lex IA** ⚖️\n\n🔍 **Consulta Recebida**\n\nPara **"${message}"**, recomendo:\n\n📋 **Para orientação mais precisa:**\n• Descreva os fatos em ordem cronológica\n• Informe documentos relevantes\n• Especifique o resultado esperado\n\n💡 **Exemplo de descrição clara:**\n"Trabalhei na empresa X de jan/2020 a dez/2022. Fui demitido sem justa causa e não recebi minhas férias de 2021."\n\n⚖️ *Orientação educativa inicial - Para análise jurídica completa, consulte advogado.*`;
}

// === FUNÇÕES AUXILIARES ===
function sendSuccess(response, source, error = null) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            success: true, 
            response: response,
            source: source,
            error: error
        })
    };
}

function containsAny(text, terms) {
    return terms.some(term => text.includes(term));
}