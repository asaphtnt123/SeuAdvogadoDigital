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
        console.log('📨 Mensagem:', message);

        // ⚠️ CHAVE SEGURA - via environment variable
        const hfToken = process.env.HUGGING_FACE_TOKEN;
        
        if (!hfToken || hfToken === 'SUA_CHAVE_AQUI') {
            console.log('🔑 Token não configurado, usando modo local');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    response: generateLocalResponse(message),
                    source: 'Sistema Local'
                })
            };
        }

        const prompt = `Você é o Dr. Lex IA, assistente jurídico brasileiro. Forneça orientação educativa inicial sobre: "${message}". Seja claro, cite leis quando relevante, mas sempre destaque que esta é uma orientação inicial e não substitui consulta com advogado.`;

        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 400,
                    temperature: 0.7,
                    do_sample: true,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const respostaIA = data[0]?.generated_text || generateLocalResponse(message);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: respostaIA,
                source: 'IA Especializada'
            })
        };
        
    } catch (error) {
        console.error('Erro:', error);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: generateLocalResponse(message),
                source: 'Sistema Local',
                error: error.message
            })
        };
    }
};

// Sistema de respostas locais robusto
function generateLocalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const respostas = {
        'trabalho': `**Direito Trabalhista** ⚖️\n\nPara questões trabalhistas como "${message}":\n\n• **Documentação**: preserve contracheques, e-mails, comunicados\n• **Orientações**: sindicato ou advogado trabalhista\n• **Prazos**: até 2 anos para ações trabalhistas\n\n📋 *Consulte profissional para análise específica*`,
        
        'consumidor': `**Direito do Consumidor** 🛒\n\nSobre "${message}":\n\n• **CDC**: Lei 8.078/90 protege relações de consumo\n• **Direitos**: produtos duráveis, serviços adequados\n• **Ações**: notificação → PROCON → Juizado Especial\n\n🛒 *Orientações educativas iniciais*`,
        
        'família': `**Direito de Família** 👨‍👩‍👧‍👦\n\nPara questões familiares:\n\n• **Divórcio**: consensual ou litigioso\n• **Guarda**: compartilhada preferencialmente\n• **Pensão**: necessidade × possibilidade\n• **Bens**: partilha conforme regime\n\n⚖️ *Cada caso exige análise personalizada*`,
        
        'contrato': `**Direito Civil** 📝\n\nSobre contratos e "${message}":\n\n• **Boa-fé**: deve guiar relações contratuais\n• **Cláusulas**: abusivas podem ser anuladas\n• **Vícios**: direito à rescindir por defeitos\n• **Revisão**: sempre leia antes de assinar\n\n📄 *Contratos complexos exigem análise jurídica*`
    };

    // Encontra resposta por palavra-chave
    for (const [key, resposta] of Object.entries(respostas)) {
        if (lowerMessage.includes(key)) {
            return resposta;
        }
    }

    // Resposta genérica inteligente
    return `**Dr. Lex IA** 🤖\n\nObrigado pela sua consulta sobre "${message}".\n\nPara uma orientação jurídica mais precisa:\n\n📋 **Informe detalhes como:**\n• Quando os fatos ocorreram\n• Documentos envolvidos\n• Resultado esperado\n\n💡 **Exemplo claro:**\n"Assinei contrato de aluguel em janeiro e agora há infiltração. O locador não conserta."\n\n⚖️ *Sua assistente jurídica educativa*`;
}