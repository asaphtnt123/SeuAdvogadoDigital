// === SCRIPT v4.0 - NETLIFY FUNCTION === //
console.log('🚀 Dr. Lex IA - Script v4.0 carregado!');

// === CONFIGURAÇÃO === //
const MONETIZATION_SYSTEM = {
    plans: {
        free: { name: "Grátis", dailyQueries: 5, price: 0 },
        premium: { name: "Premium", dailyQueries: 100, price: 49.90 },
        enterprise: { name: "Empresarial", dailyQueries: 1000, price: 299.90 }
    }
};

// ⚠️ IMPORTANTE: Esta é a configuração CORRETA para Netlify
const AI_API_CONFIG = {
    endpoint: '/.netlify/functions/chat', // URL relativa para Netlify Functions
    free: true
};

let chatHistory = [];
let userState = { plan: 'free', dailyUsage: 0, totalSpent: 0 };

// === FUNÇÕES DO CHAT === //
function startConsultation() {
    console.log('Abrindo chatbox...');
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.classList.add('active');
        setTimeout(() => {
            const messageInput = document.getElementById('messageInput');
            if (messageInput) messageInput.focus();
        }, 300);
        updateRemainingQueries();
    }
}

function closeChat() {
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.classList.remove('active');
        saveChatHistory();
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput ? messageInput.value.trim() : '';
    if (!message) return;

    console.log('📤 Enviando mensagem:', message);

    // Verifica limite
    if (userState.dailyUsage >= MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries) {
        showUpgradePrompt("Limite diário atingido!");
        return;
    }

    userState.dailyUsage++;
    saveUserData();
    updateRemainingQueries();
    addMessageToChat('user', message);
    if (messageInput) messageInput.value = '';
    showTypingIndicator();

    try {
        const response = await generateResponse(message);
        hideTypingIndicator();
        addMessageToChat('ai', response);
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('ai', '🔧 Estamos com instabilidade técnica. Use respostas locais por enquanto.');
        console.error('Erro no chat:', error);
    }
}

// === SISTEMA DE IA - NETLIFY FUNCTION === //
async function generateResponse(userMessage) {
    console.log('🎯 Gerando resposta para:', userMessage);
    
    if (userMessage.length < 2) {
        return generateGenericResponse();
    }
    
    try {
        console.log('📡 Tentando Netlify Function...');
        const response = await callNetlifyFunction(userMessage);
        return response;
    } catch (error) {
        console.log('🔄 Usando fallback local');
        return generateLocalResponse(userMessage);
    }
}

// ⚠️ FUNÇÃO CORRIGIDA - Netlify Function
async function callNetlifyFunction(userMessage) {
    try {
        console.log('🔗 Conectando com:', AI_API_CONFIG.endpoint);
        
        const response = await fetch(AI_API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        console.log('📊 Status da resposta:', response.status);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        
        if (data.success && data.response) {
            return `**Dr. Lex IA** 🤖\n\n${data.response}\n\n---\n*Resposta gerada por IA*`;
        } else {
            throw new Error('Resposta inválida da function');
        }
        
    } catch (error) {
        console.error('❌ Erro na Netlify Function:', error);
        throw error;
    }
}

// === RESPOSTAS LOCAIS (FALLBACK) === //
function generateLocalResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (containsAny(lowerMessage, ['oi', 'olá', 'ola', 'hello', 'hi', 'hey'])) {
        return `**Dr. Lex IA** 🤖\n\nOlá! Sou sua assistente jurídica digital. \n\n💡 *Modo local ativo - Netlify Function em configuração*\n\nPosso ajudar com orientações sobre direito trabalhista, consumerista, família e civil.`;
    }
    else if (containsAny(lowerMessage, ['trabalho', 'emprego', 'patrão', 'demissão', 'salário'])) {
        return `**Direito Trabalhista** ⚖️\n\nPara questões trabalhistas:\n• Documente tudo (e-mails, contracheques)\n• Consulte um advogado trabalhista\n• Considere mediação ou acordo\n\n*Orientacao educativa*`;
    } else if (containsAny(lowerMessage, ['consumidor', 'compra', 'produto', 'loja', 'garantia'])) {
        return `**Direito do Consumidor** 🛒\n\nPara questões consumeristas:\n• Notifique a empresa por escrito\n• Procure o PROCON\n• Juizado Especial para valores menores\n\n*Orientação educativa*`;
    } else {
        return `**Dr. Lex IA** 🤖\n\nObrigado pela sua mensagem!\n\n🔧 *Sistema em atualização*\n\nEm breve teremos respostas de IA em tempo real!\n\nEnquanto isso, descreva sua situação jurídica para eu poder ajudar melhor.`;
    }
}

function containsAny(text, terms) {
    return terms.some(term => text.includes(term));
}

// === FUNÇÕES AUXILIARES === //
function addMessageToChat(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    messageDiv.innerHTML = `
        <div class="message-avatar ${sender === 'user' ? 'user-avatar' : 'ai-avatar'}">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessage(text)}</div>
            <small class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
    `;

    if (sender === 'user') {
        const avatar = messageDiv.querySelector('.message-avatar');
        const content = messageDiv.querySelector('.message-content');
        messageDiv.innerHTML = '';
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    }

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    chatHistory.push({ sender, text, time: new Date().toISOString() });
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) typingIndicator.style.display = 'block';
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) typingIndicator.style.display = 'none';
}

function formatMessage(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateRemainingQueries() {
    const remaining = MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries - userState.dailyUsage;
    const element = document.getElementById('remainingQueries');
    if (element) element.textContent = remaining;
}

function showUpgradePrompt(message) {
    alert(`⚠️ ${message}`);
}

// === INICIALIZAÇÃO === //
function initializeUserState() {
    const saved = localStorage.getItem('drLexUserState');
    if (saved) userState = JSON.parse(saved);
    console.log('👤 User state:', userState);
}

function initializeChat() {
    const savedHistory = localStorage.getItem('drLexChatHistory');
    if (savedHistory) chatHistory = JSON.parse(savedHistory);
    console.log('💬 Chat inicializado');
}

function saveUserData() {
    localStorage.setItem('drLexUserState', JSON.stringify(userState));
}

function saveChatHistory() {
    localStorage.setItem('drLexChatHistory', JSON.stringify(chatHistory));
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dr. Lex IA v4.0 - Netlify Function');
    initializeUserState();
    initializeChat();
    updateRemainingQueries();
});

// === FUNÇÃO DE TESTE === //
window.testNetlifyFunction = async function() {
    console.log('🧪 TESTE: Netlify Function');
    console.log('🔗 Endpoint:', AI_API_CONFIG.endpoint);
    
    try {
        const response = await fetch(AI_API_CONFIG.endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: "Teste de conexão"})
        });
        
        console.log('📊 Status:', response.status);
        const data = await response.json();
        console.log('✅ Sucesso:', data);
        return data;
        
    } catch (error) {
        console.log('❌ Erro:', error);
        return {error: error.message};
    }
};

// Verificação automática
console.log('✅ callNetlifyFunction definida:', typeof callNetlifyFunction);
console.log('✅ AI_API_CONFIG:', AI_API_CONFIG);