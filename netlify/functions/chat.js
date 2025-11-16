// No seu script.js - adicione estas funções:

// Sistema de memória de conversa
let conversationHistory = [];

async function generateResponse(userMessage) {
    console.log('🎯 Gerando resposta para:', userMessage);
    
    // Adiciona à história da conversa
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // Mantém apenas as últimas 10 mensagens
    if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
    }

    try {
        console.log('🤖 Consultando IA especializada...');
        const response = await callNetlifyFunction(userMessage);
        
        // Adiciona resposta à história
        conversationHistory.push({ role: 'assistant', content: response });
        
        return response;
    } catch (error) {
        console.log('🔄 Usando sistema local inteligente');
        const localResponse = generateLocalResponse(userMessage);
        
        // Adiciona resposta local à história
        conversationHistory.push({ role: 'assistant', content: localResponse });
        
        return localResponse;
    }
}

// Função melhorada para respostas locais
function generateLocalResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas contextuais baseadas na história
    const lastUserMessage = conversationHistory
        .filter(msg => msg.role === 'user')
        .slice(-1)[0]?.content || '';

    // Lógica contextual mais inteligente
    if (containsAny(lowerMessage, ['obrigado', 'obrigada', 'valeu', 'agradeço'])) {
        return `**Dr. Lex IA** 🤖\n\nDe nada! Fico feliz em ajudar. 😊\n\nSe tiver mais dúvidas jurídicas, estou aqui para orientá-lo.\n\n💎 *Lembrete: Para casos específicos, consulte sempre um advogado.*`;
    }
    
    if (containsAny(lowerMessage, ['tchau', 'bye', 'até logo', 'encerrar'])) {
        return `**Dr. Lex IA** 🤖\n\nAté logo! 👋\n\nSe surgirem mais dúvidas jurídicas, estarei aqui para ajudar.\n\n⚖️ *Orientação educativa - Consulte profissional para casos concretos.*`;
    }
    
    // Respostas jurídicas contextuais
    if (containsAny(lowerMessage + lastUserMessage, ['demissão', 'demitido', 'demitida', 'rescisão'])) {
        return generateTrabalhistaResponse('demissão');
    }
    
    if (containsAny(lowerMessage + lastUserMessage, ['férias', 'ferias', 'descanso', '30 dias'])) {
        return generateTrabalhistaResponse('férias');
    }
    
    // ... outras respostas específicas
    
    return `**Dr. Lex IA** 🤖\n\nEntendi sua consulta sobre "${userMessage}".\n\nPara uma orientação jurídica mais precisa, poderia me contar:\n\n📋 **Detalhes importantes:**\n• Quando isso aconteceu?\n• Há documentos ou contratos envolvidos?\n• Já tomou alguma medida?\n\n💡 **Exemplo claro:**\n"Fui demitido após 3 anos de empresa sem receber minhas férias vencidas. O que fazer?"\n\n⚖️ *Sua assistente jurídica educativa*`;
}