// netlify/functions/chat.js
exports.handler = async function(event, context) {
    // Headers para CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body);
        
        console.log('📨 Mensagem recebida:', message);

        // SIMULA uma resposta de IA por enquanto
        // Depois podemos conectar com Hugging Face
        const respostasSimuladas = [
            `Como assistente jurídico, posso explicar que o Direito Civil brasileiro regula as relações entre particulares, incluindo contratos, propriedade, família e obrigações. É baseado no Código Civil de 2002.`,
            
            `O Direito Civil é o ramo do direito que trata das relações entre pessoas físicas e jurídicas. Inclui direitos das coisas, direitos das obrigações, direito de família e direitos sucessórios.`,
            
            `No ordenamento jurídico brasileiro, o Direito Civil está disciplinado principalmente no Código Civil (Lei 10.406/02), abrangendo pessoa natural, pessoa jurídica, bens, fatos jurídicos, negócios jurídicos e prescrição.`
        ];
        
        const resposta = respostasSimuladas[Math.floor(Math.random() * respostasSimuladas.length)];
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: resposta,
                source: 'IA Simulada'
            })
        };
        
    } catch (error) {
        console.error('💥 Erro:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: error.message,
                response: "Erro temporário no sistema."
            })
        };
    }
};