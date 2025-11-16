// netlify/functions/chat.js - OPENAI COMPLETA
const fetch = require('node-fetch');

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
        console.log('📨 Pergunta recebida:', message);

        // ⚠️ CONFIGURE SUA CHAVE OPENAI NO NETLIFY
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!openaiKey || openaiKey === 'sua-chave-openai-aqui') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    response: "🔧 **Dr. Lex IA** ⚖️\n\n*Sistema em configuração final.*\n\nPor favor, configure a chave OpenAI nas variáveis de ambiente do Netlify.\n\n⚖️ *Em breve com IA completa!*",
                    source: 'Sistema'
                })
            };
        }

        // PROMPT PROFISSIONAL PARA DR. LEX IA
        const prompt = `Você é o "Dr. Lex IA", um assistente jurídico brasileiro especializado. 

# DIRETRIZES PRINCIPAIS:
1. **Foco Jurídico**: Priorize orientações sobre direito brasileiro
2. **Linguagem**: Clara, acessível mas profissional
3. **Formatação**: Use **negrito** para tópicos importantes e quebras de linha
4. **Postura**: Educado, empático mas objetivo
5. **Limitações**: Sempre destaque que é orientação inicial educativa

# ÁREAS DE ATUAÇÃO:
⚖️ **Direito Trabalhista** (CLT, demissão, férias, verbas)
🛒 **Direito do Consumidor** (CDC, produtos, serviços, garantias)
👨‍👩‍👧‍👦 **Direito de Família** (divórcio, pensão, guarda, herança)
📝 **Direito Civil** (contratos, obrigações, responsabilidade)
🏠 **Direito Imobiliário** (aluguel, compra/venda, condomínio)
💼 **Direito Empresarial** (sociedades, contratos empresariais)

# FORMATO DE RESPOSTA:
- Comece com "**Dr. Lex IA** ⚖️"
- Use emojis moderadamente
- Estruture com tópicos claros
- Finalize com observação educativa

Para perguntas não jurídicas, responda de forma educada mas mantenha o foco jurídico quando possível.

PERGUNTA DO USUÁRIO: "${message}"

RESPOSTA:`;

        // CHAMADA PARA OPENAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: prompt
                    }
                ],
                max_tokens: 800,
                temperature: 0.7,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro OpenAI:', response.status, errorText);
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const respostaIA = data.choices[0].message.content;

        console.log('✅ Resposta gerada:', respostaIA.substring(0, 100) + '...');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: respostaIA,
                source: 'OpenAI GPT-3.5 Turbo',
                tokens: data.usage?.total_tokens
            })
        };
        
    } catch (error) {
        console.error('💥 Erro na function:', error);
        
        // Fallback inteligente
        const fallbackResponse = `**Dr. Lex IA** ⚖️\n\n🔧 *Instabilidade técnica momentânea*\n\nSobre sua pergunta, recomendo:\n\n📋 **Para orientação jurídica:**\n• Descreva os fatos detalhadamente\n• Informe prazos e documentos\n• Consulte um advogado para análise específica\n\n⚖️ *Estamos melhorando nosso sistema para atendê-lo melhor!*`;
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: fallbackResponse,
                source: 'Sistema',
                error: error.message
            })
        };
    }
};