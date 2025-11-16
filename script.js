// === SCRIPT v5.0 - NETLIFY FUNCTION CORRIGIDO === //
console.log('🚀 Dr. Lex IA - Script v5.0 carregado!');

// === CONFIGURAÇÃO CORRIGIDA === //
const MONETIZATION_SYSTEM = {
    plans: {
        free: { name: "Grátis", dailyQueries: 100, price: 0 },
        premium: { name: "Premium", dailyQueries: 100, price: 49.90 },
        enterprise: { name: "Empresarial", dailyQueries: 1000, price: 299.90 }
    }
};

// ⚠️ CONFIGURAÇÃO NETLIFY CORRETA
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
        addMessageToChat('ai', '🔧 Modo local ativo - Sistema em otimização');
        console.error('Erro no chat:', error);
    }
}
async function generateResponse(userMessage) {
    console.log('🎯 Gerando resposta para:', userMessage);
    
    // Para mensagens muito curtas, usa local
    if (userMessage.length < 3) {
        return generateLocalResponse(userMessage);
    }
    
    try {
        console.log('🤖 Tentando IA real...');
        const response = await callNetlifyFunction(userMessage);
        return response;
    } catch (error) {
        console.log('🔄 IA real falhou, usando local');
        return generateLocalResponse(userMessage);
    }
}

async function callNetlifyFunction(userMessage) {
    try {
        console.log('📡 Conectando com Netlify Function...');
        
        const response = await fetch('/.netlify/functions/chat', {
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
        console.log('✅ Resposta IA:', data);
        
        if (data.success && data.response) {
            return `**Dr. Lex IA** 🤖\n\n${data.response}\n\n---\n*Resposta gerada por IA*`;
        } else {
            throw new Error('Resposta inválida');
        }
        
    } catch (error) {
        console.error('❌ Erro IA real:', error);
        throw error;
    }
}

// === RESPOSTAS LOCAIS MELHORADAS === //
function generateLocalResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (containsAny(lowerMessage, ['oi', 'olá', 'ola', 'hello', 'hi', 'hey'])) {
        return `**Dr. Lex IA** 🤖\n\nOlá! Sou sua assistente jurídica digital. \n\n💡 *Sistema otimizado - v5.0*\n\nPosso ajudar com:\n⚖️ Direito Trabalhista\n🛒 Direito do Consumidor  \n👨‍👩‍👧‍👦 Direito de Família\n📝 Direito Civil\n\nComo posso ajudar?`;
    }
    else if (containsAny(lowerMessage, ['trabalho', 'emprego', 'patrão', 'demissão', 'salário', 'clt', 'horas'])) {
        return `**Direito Trabalhista** ⚖️\n\nCom base na CLT:\n\n• Jornada: 8h/dia, 44h/semana\n• Horas extras: +50% (mínimo)\n• Férias: 30 dias + 1/3\n• FGTS: 8% + multa 40%\n\n📋 **Ações:** Documente tudo e consulte advogado.\n\n*Orientação educativa*`;
    } 
    else if (containsAny(lowerMessage, ['consumidor', 'compra', 'produto', 'loja', 'garantia', 'defeito', 'devolução'])) {
        return `**Direito do Consumidor** 🛒\n\nSeus direitos (CDC):\n\n• Produtos devem durar razoavelmente\n• 30 dias para conserto de duráveis\n• Direito à troca ou devolução\n• Proteção contra propaganda enganosa\n\n📋 **Ações:** Notificação → PROCON → Juizado\n\n*Orientação educativa*`;
    }
    else if (containsAny(lowerMessage, ['divórcio', 'casamento', 'pensão', 'guarda', 'filho', 'separação'])) {
        return `**Direito de Família** 👨‍👩‍👧‍👦\n\nAspectos relevantes:\n\n• Divórcio: consensual ou litigioso\n• Guarda compartilhada: preferencial\n• Pensão: necessidade × possibilidade\n• Partilha: conforme regime de bens\n\n📋 **Ações:** Mediação → Advogado especializado\n\n*Consulte profissional para caso específico*`;
    }
    else if (containsAny(lowerMessage, ['contrato', 'aluguel', 'compra', 'venda', 'imóvel', 'locação'])) {
        return `**Direito Civil** 📝\n\nPrincípios importantes:\n\n• Contratos: boa-fé objetiva\n• Responsabilidade civil por danos\n• Prazos prescricionais variáveis\n• Arrependimento: 7 dias (compras online)\n\n📋 **Ações:** Revisão cuidadosa → Notificação\n\n*Orientação educativa*`;
    }
    else {
        return `**Dr. Lex IA** 🤖\n\nObrigado pela sua mensagem!\n\nPara que eu possa ajudar melhor:\n\n📋 **Descreva com detalhes:**\n• O que aconteceu?\n• Quando ocorreu?\n• Qual resultado espera?\n\n💡 **Exemplo:** "Comprei um celular com defeito após 15 dias. A loja não quer trocar."\n\n⚖️ *Sua assistente jurídica educativa*`;
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
    console.log('🚀 Dr. Lex IA v5.0 - Sistema Estável');
    initializeUserState();
    initializeChat();
    updateRemainingQueries();
});

// === VERIFICAÇÃO === //
console.log('✅ AI_API_CONFIG:', AI_API_CONFIG);
console.log('✅ Sistema carregado e pronto!');