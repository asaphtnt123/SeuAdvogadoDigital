// === SOLUÇÃO COM BACKEND SIMPLES === //

// Use este serviço GRATUITO como proxy:
const AI_API_CONFIG = {
    endpoint: 'https://your-username.github.io/your-repo/api-proxy',
apiKey: 'SUA_CHAVE_AQUI' , // Você vai configurar depois
    free: true
};

async function callHuggingFaceAPI(userMessage) {
    try {
        console.log('📡 Usando proxy próprio...');
        
        const response = await fetch('/api/chat', {  // URL relativa para seu proxy
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                apiKey: AI_API_CONFIG.apiKey
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.response;
        
    } catch (error) {
        console.error('❌ Erro no proxy:', error);
        throw error;
    }
}