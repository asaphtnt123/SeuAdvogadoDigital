// === CONFIGURAÇÃO === //
console.log('🚀 Dr. Lex IA - Frontend carregado!');

const MONETIZATION_SYSTEM = {
    plans: {
        free: { name: "Grátis", dailyQueries: 10, price: 0 },
        premium: { name: "Premium", dailyQueries: 100, price: 49.90 },
        enterprise: { name: "Empresarial", dailyQueries: 1000, price: 299.90 }
    }
};

const AI_API_CONFIG = {
    endpoint: '/.netlify/functions/chat',
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
        console.log('✅ Chatbox aberto com sucesso');
        
        setTimeout(() => {
            const messageInput = document.getElementById('messageInput');
            if (messageInput) messageInput.focus();
        }, 300);
        
        updateRemainingQueries();
    }
}

function closeChat() {
    console.log('Fechando chatbox...');
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.classList.remove('active');
        saveChatHistory();
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput ? messageInput.value.trim() : '';

    if (!message) {
        console.log('Mensagem vazia');
        return;
    }

    console.log('Enviando mensagem:', message);

    // Verifica limite de uso
    if (userState.dailyUsage >= MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries) {
        showUpgradePrompt("Limite diário atingido!");
        return;
    }

    // Incrementa uso
    userState.dailyUsage++;
    saveUserData();
    updateRemainingQueries();

    // Adiciona mensagem do usuário
    addMessageToChat('user', message);
    if (messageInput) {
        messageInput.value = '';
    }

    // Mostra digitando
    showTypingIndicator();

    try {
        // Processa resposta via Netlify Function
        const response = await callNetlifyFunction(message);
        hideTypingIndicator();
        addMessageToChat('ai', response);
        
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('ai', 'Desculpe, estou com dificuldades técnicas. Por favor, tente novamente em alguns instantes.');
        console.error('Erro no chat:', error);
    }
}

// === CHAMADA PARA NETLIFY FUNCTION === //
async function callNetlifyFunction(userMessage) {
    try {
        console.log('📡 Chamando Netlify Function...');
        
        const response = await fetch(AI_API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        console.log('📊 Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Resposta:', data);
        
        if (data.success) {
            return data.response;
        } else {
            throw new Error('Resposta inválida da function');
        }
        
    } catch (error) {
        console.error('❌ Erro na function:', error);
        throw error;
    }
}

// === FUNÇÕES AUXILIARES === //
function addMessageToChat(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('Elemento chatMessages não encontrado!');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatarIcon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    const avatarClass = sender === 'user' ? 'user-avatar' : 'ai-avatar';

    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">
            <i class="${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessage(text)}</div>
            <small class="message-time">${getCurrentTime()}</small>
        </div>
    `;

    // Para mensagens do usuário, inverte a ordem
    if (sender === 'user') {
        const avatar = messageDiv.querySelector('.message-avatar');
        const content = messageDiv.querySelector('.message-content');
        messageDiv.innerHTML = '';
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    }

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Salva no histórico
    chatHistory.push({ sender, text, time: new Date().toISOString() });
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'block';
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

function formatMessage(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function updateRemainingQueries() {
    const remaining = MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries - userState.dailyUsage;
    const element = document.getElementById('remainingQueries');
    if (element) {
        element.textContent = remaining;
    }
}

function showUpgradePrompt(message) {
    alert(`⚠️ ${message}\n\nFaça upgrade para consultas ilimitadas!`);
}

// === INICIALIZAÇÃO === //
function initializeUserState() {
    const saved = localStorage.getItem('drLexUserState');
    if (saved) {
        userState = JSON.parse(saved);
    } else {
        // Estado inicial
        userState = {
            plan: 'free',
            dailyUsage: 0,
            totalSpent: 0
        };
    }
    console.log('User state inicializado:', userState);
}

function initializeChat() {
    const savedHistory = localStorage.getItem('drLexChatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        // Opcional: restaurar histórico visual se quiser
    }
    console.log('Chat inicializado');
}

function saveUserData() {
    localStorage.setItem('drLexUserState', JSON.stringify(userState));
}

function saveChatHistory() {
    localStorage.setItem('drLexChatHistory', JSON.stringify(chatHistory));
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - inicializando Dr. Lex IA...');
    initializeUserState();
    initializeChat();
    updateRemainingQueries();
});

// Função de teste
window.testConnection = async function() {
    try {
        console.log('🧪 Testando conexão...');
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: "Teste de conexão"})
        });
        const data = await response.json();
        console.log('✅ Conexão funcionando:', data);
        return data;
    } catch (error) {
        console.log('❌ Erro:', error);
        return {error: error.message};
    }
};