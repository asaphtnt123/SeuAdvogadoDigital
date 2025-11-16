// Sistema de Monetização
const MONETIZATION_SYSTEM = {
    plans: {
        free: {
            name: "Grátis",
            dailyQueries: 10,  // Aumentei de 3 para 10
            price: 0
        },
        basic: {
            name: "Consultor Básico",
            price: 29,
            dailyQueries: 999,
            features: [
                "Consultas ilimitadas",
                "Histórico de 6 meses",
                "5 modelos de documentos",
                "Suporte por email"
            ]
        },
        pro: {
            name: "Advogado Digital Pro",
            price: 97,
            dailyQueries: 9999,
            features: [
                "Tudo do plano Básico",
                "Análise de documentos",
                "20 modelos de petições",
                "Prioridade no atendimento",
                "Histórico ilimitado"
            ]
        },
        enterprise: {
            name: "Jurídico Empresarial",
            price: 297,
            dailyQueries: 99999,
            features: [
                "Tudo do plano Pro",
                "5 usuários simultâneos",
                "Contratos empresariais",
                "Suporte dedicado",
                "Relatórios mensais"
            ]
        }
    },

    lawyers: [
        {
            id: 1,
            name: "Dr. Carlos Silva",
            specialty: "Trabalhista",
            rating: 4.9,
            reviews: 127,
            price: 150,
            verified: true,
            experience: "12 anos",
            description: "Especialista em direito trabalhista e previdenciário"
        },
        {
            id: 2,
            name: "Dra. Maria Santos",
            specialty: "Consumerista", 
            rating: 4.8,
            reviews: 89,
            price: 120,
            verified: true,
            experience: "8 anos",
            description: "Atua em defesa do consumidor e relações de consumo"
        },
        {
            id: 3,
            name: "Dr. Roberto Lima",
            specialty: "Civil",
            rating: 4.7,
            reviews: 156,
            price: 180,
            verified: true,
            experience: "15 anos",
            description: "Especialista em contratos e direito civil"
        }
    ],

    products: [
        {
            id: 1,
            name: "Kit Contratos Empresariais",
            price: 87,
            category: "documentos",
            description: "10 modelos de contratos prontos para uso",
            features: ["Contrato Social", "Prestação de Serviços", "Confidencialidade", "Trabalho Remoto"],
            bestSeller: true
        },
        {
            id: 2, 
            name: "Pack Trabalhista Completo",
            price: 67,
            category: "documentos",
            description: "Modelos para questões trabalhistas",
            features: ["Reclamação Trabalhista", "Cálculo de Rescisão", "Notificação Extrajudicial"],
            bestSeller: false
        },
        {
            id: 3,
            name: "Curso Direito do Consumidor",
            price: 197,
            category: "cursos",
            description: "Aprenda a defender seus direitos consumeristas",
            features: ["6 horas de videoaulas", "Material complementar", "Certificado digital"],
            bestSeller: true
        }
    ],

    affiliate: {
        commission: {
            subscription: 0.3,  // 30% das assinaturas
            product: 0.2,       // 20% dos produtos
            lawyer: 0.15        // 15% das indicações
        }
    }
};


// Estado do usuário
let userState = {
    plan: 'free',
    dailyUsage: 0,
    totalSpent: 0,
    joined: new Date().toISOString(),
    usageHistory: []
};

// Histórico do chat
let chatHistory = [];



// Carrega dados do usuário
function loadUserData() {
    const saved = localStorage.getItem('drLexUserData');
    if (saved) {
        userState = {...userState, ...JSON.parse(saved)};
    }
    updateUserInterface();
}

// Salva dados do usuário
function saveUserData() {
    localStorage.setItem('drLexUserData', JSON.stringify(userState));
    updateUserInterface();
}

// Atualiza interface do usuário
function updateUserInterface() {
    // Atualiza indicador de plano
    document.getElementById('userPlan').textContent = MONETIZATION_SYSTEM.plans[userState.plan].name;
    document.getElementById('menuUserPlan').textContent = MONETIZATION_SYSTEM.plans[userState.plan].name;
    document.getElementById('chatPlanInfo').textContent = `Plano: ${MONETIZATION_SYSTEM.plans[userState.plan].name} • ${userState.dailyUsage}/${MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries} consultas hoje`;
    
    // Atualiza uso
    updateUsageDisplay();
}

// Atualiza display de uso
function updateUsageDisplay() {
    const progress = (userState.dailyUsage / MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries) * 100;
    document.getElementById('usageCount').textContent = userState.dailyUsage;
    document.getElementById('usageProgress').style.width = `${progress}%`;
    document.getElementById('remainingQueries').textContent = MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries - userState.dailyUsage;
    
    // Altera cor baseada no uso
    const progressBar = document.getElementById('usageProgress');
    if (progress > 80) {
        progressBar.className = 'progress-bar bg-danger';
    } else if (progress > 60) {
        progressBar.className = 'progress-bar bg-warning';
    } else {
        progressBar.classBar = 'progress-bar';
    }
}

// Configura listeners
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu-dropdown') && !e.target.closest('#userPlan')) {
            hideUserMenu();
        }
    });
}

// Menu do usuário
function showUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
}

function hideUserMenu() {
    document.getElementById('userMenu').classList.remove('show');
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
    console.log('DOM carregado - inicializando...');
    initializeUserState();
    initializeChat();
    updateRemainingQueries();
});

function startConsultation() {
    console.log('Abrindo chatbox...');
    
    const chatInterface = document.getElementById('chatInterface');
    
    if (chatInterface) {
        // Adiciona a classe active que deve controlar a visibilidade via CSS
        chatInterface.classList.add('active');
        
        console.log('✅ Chatbox aberto com sucesso');
        
    } else {
        console.error('Elemento chatInterface não encontrado!');
        return;
    }

    // Verifica limite de uso
    if (userState.dailyUsage >= MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries) {
        showUpgradePrompt("Limite diário atingido!");
        return;
    }

    // Foca no input após abrir
    setTimeout(() => {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }, 300);
    
    // Atualiza contador
    updateRemainingQueries();
}

function closeChat() {
    console.log('Fechando chatbox...');
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.classList.remove('active');
        saveChatHistory();
    }
}
function updateRemainingQueries() {
    const remaining = MONETIZATION_SYSTEM.plans[userState.plan].dailyQueries - userState.dailyUsage;
    const element = document.getElementById('remainingQueries');
    if (element) {
        element.textContent = remaining;
        console.log('📊 Consultas restantes:', remaining);
    }
}
// === CONFIGURAÇÃO SEGURA === //
const AI_API_CONFIG = {
    endpoint: 'https://asaphtnt123.github.io/SeuAdvogadoDigital/api-proxy',
    free: true
};

async function callHuggingFaceAPI(userMessage) {
    try {
        console.log('📡 Chamando API via GitHub Pages...');
        
        // Para GitHub Pages estático, vamos usar uma solução diferente
        // já que não podemos executar server-side code
        return await callHuggingFaceViaProxy(userMessage);
        
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Solução usando proxy público
async function callHuggingFaceViaProxy(userMessage) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
    
    const response = await fetch(proxyUrl + apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer SUA_CHAVE_AQUI', // ← Você vai colocar manualmente
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            inputs: userMessage,
            parameters: {
                max_length: 300,
                temperature: 0.7,
                do_sample: true
            }
        })
    });
    
    const data = await response.json();
    return data[0]?.generated_text || "Resposta da IA";
}

// Função generateResponse atualizada
async function generateResponse(userMessage) {
    console.log('🎯 Gerando resposta com SEU proxy...');
    
    try {
        const response = await callHuggingFaceAPI(userMessage);
        return `**Dr. Lex IA** 🤖\n\n${response}\n\n---\n*Resposta gerada por IA através do seu proxy*`;
        
    } catch (error) {
        console.error('❌ Proxy falhou, usando fallback local:', error);
        return generateLocalResponse(userMessage);
    }
}
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput ? messageInput.value.trim() : '';

    if (!message) {
        console.log('Mensagem vazia');
        return;
    }

    console.log('Enviando mensagem:', message.substring(0, 50));

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
        // Processa resposta
        const response = await generateResponse(message);
        hideTypingIndicator();
        addMessageToChat('ai', response);
        
        // Sugere upgrade após algumas mensagens
        if (userState.dailyUsage >= 2 && userState.plan === 'free') {
            setTimeout(() => {
                showUpgradePrompt("Quer respostas mais precisas? Faça upgrade para Premium!");
            }, 1000);
        }
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('ai', 'Desculpe, estou com dificuldades técnicas. Por favor, tente novamente em alguns instantes.');
        console.error('Erro no chat:', error);
    }
}

// === FUNÇÕES AUXILIARES DO CHAT === //
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

// === FUNÇÕES DE UPGRADE === //
function showUpgradePrompt(message) {
    alert(`⚠️ ${message}\n\nFaça upgrade para consultas ilimitadas!`);
    // Ou implemente um modal mais elaborado
}

function showPremiumPlans() {
    // Role até a seção de planos ou abra modal
    const pricingSection = document.querySelector('#pricing, .pricing-section');
    if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeChat();
}
// Funções auxiliares
function saveUserData() {
    localStorage.setItem('drLexUserState', JSON.stringify(userState));
}

function saveChatHistory() {
    localStorage.setItem('drLexChatHistory', JSON.stringify(chatHistory));
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = `
        <div class="message-avatar bg-secondary">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function formatMessage(text) {
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
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// === FUNÇÃO DE FALLBACK LOCAL === //
function generateLocalResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (containsAny(lowerMessage, ['trabalho', 'emprego', 'patrão', 'demissão', 'salário'])) {
        return generateTrabalhistaResponse();
    } else if (containsAny(lowerMessage, ['consumidor', 'compra', 'produto', 'loja', 'garantia'])) {
        return generateConsumeristaResponse();
    } else if (containsAny(lowerMessage, ['divórcio', 'casamento', 'pensão', 'guarda', 'filho'])) {
        return generateFamiliaResponse();
    } else if (containsAny(lowerMessage, ['contrato', 'aluguel', 'compra', 'venda', 'imóvel'])) {
        return generateCivilResponse();
    } else {
        return generateGenericResponse();
    }
}

// === FUNÇÃO AUXILIAR === //
function containsAny(text, terms) {
    return terms.some(term => text.includes(term));
}


function generateCivilResponse() {
    return `**Direito Civil - Orientação Educativa**...`;
}

function generateFamiliaResponse() {
    return `**Direito de Família - Orientação Educativa**...`;
}


// SUAS FUNÇÕES ORIGINAIS (mantenha como estão)
function generateTrabalhistaResponse() {
    return `**Direito Trabalhista - Orientação Educativa**

Com base na sua descrição, aqui estão algumas informações sobre direitos trabalhistas:

**Direitos Fundamentais:**
• Jornada máxima de 8h/dia e 44h/semana
• Horas extras com acréscimo mínimo de 50%
• Férias remuneradas + 1/3 constitucional
• FGTS e multa de 40% em demissões sem justa causa

**Próximos Passos Sugeridos:**
1. **Documente tudo:** Salve contracheques, e-mails, comprovantes
2. **Busque orientação:** Sindicato ou advogado trabalhista
3. **Considere:** Reclamação trabalhista ou acordo extrajudicial

💡 **Dica:** Use nosso marketplace para conectar com advogados especializados em direito trabalhista.

*Esta é uma orientação educativa. Para análise jurídica completa, consulte um advogado.*`;
}

function generateConsumeristaResponse() {
    return `**Direito do Consumidor - Orientação Educativa**

Entendo sua situação consumerista. Algumas informações relevantes:

**Seus Direitos (CDC - Lei 8.078/90):**
• Produtos devem ser seguros e duráveis
• Prazo de 30 dias para conserto de produtos duráveis
• Direito à troca ou devolução do dinheiro
• Proteção contra publicidade enganosa

**Ações Recomendadas:**
1. **Notificação extrajudicial:** Formalize sua reclamação
2. **PROCON:** Gratuito e eficaz para muitos casos
3. **Juizado Especial:** Até 40 salários mínimos sem advogado

📝 **Recurso Premium:** Assinantes PRO têm acesso a modelos de notificação extrajudicial prontos.

*Orientação educativa. Casos complexos exigem assessoria jurídica profissional.*`;
}





// Sistema de monetização - Planos
function showPremiumPlans() {
    document.getElementById('premium').scrollIntoView({ behavior: 'smooth' });
}

function selectPlan(planId) {
    const plan = MONETIZATION_SYSTEM.plans[planId];
    
    if (planId === 'enterprise') {
        showEnterpriseContact();
        return;
    }

    showPaymentModal(plan);
}

function showPaymentModal(plan) {
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const modalTitle = document.getElementById('paymentModalTitle');
    const modalBody = document.getElementById('paymentModalBody');

    modalTitle.textContent = `Assinar ${plan.name}`;
    
    modalBody.innerHTML = `
        <div class="text-center mb-4">
            <h4>${plan.name}</h4>
            <div class="price display-4 text-primary fw-bold">
                R$ ${plan.price}<small class="fs-6 text-muted">/mês</small>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-12">
                <h6>Recursos incluídos:</h6>
                <ul class="list-unstyled">
                    ${plan.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="payment-methods mb-4">
            <div class="payment-method selected" onclick="selectPaymentMethod('pix')">
                <i class="fas fa-qrcode fa-2x mb-2"></i>
                <div>PIX</div>
                <small class="text-muted">10% off</small>
            </div>
            <div class="payment-method" onclick="selectPaymentMethod('credit')">
                <i class="fas fa-credit-card fa-2x mb-2"></i>
                <div>Cartão</div>
                <small class="text-muted">Parcele</small>
            </div>
            <div class="payment-method" onclick="selectPaymentMethod('boleto')">
                <i class="fas fa-barcode fa-2x mb-2"></i>
                <div>Boleto</div>
                <small class="text-muted">5% off</small>
            </div>
        </div>

        <div class="d-grid gap-2">
            <button class="btn btn-primary btn-lg" onclick="processPayment('${Object.keys(MONETIZATION_SYSTEM.plans).find(key => MONETIZATION_SYSTEM.plans[key] === plan)}')">
                <i class="fas fa-lock me-2"></i>Pagar R$ ${plan.price}
            </button>
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancelar
            </button>
        </div>
    `;

    modal.show();
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.closest('.payment-method').classList.add('selected');
}

function processPayment(planId) {
    // Simulação de pagamento
    const plan = MONETIZATION_SYSTEM.plans[planId];
    
    userState.plan = planId;
    userState.dailyUsage = 0;
    userState.totalSpent += plan.price;
    
    saveUserData();
    
    // Fecha modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    modal.hide();
    
    // Mostra confirmação
    showMessage('success', `Plano ${plan.name} ativado com sucesso!`);
    
    // Atualiza interface
    updateUserInterface();
}

// Marketplace de Advogados
function loadMarketplace() {
    const grid = document.getElementById('lawyersGrid');
    
    grid.innerHTML = MONETIZATION_SYSTEM.lawyers.map(lawyer => `
        <div class="col-md-4">
            <div class="lawyer-card">
                <div class="lawyer-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h5 class="text-center">${lawyer.name}</h5>
                <div class="text-center mb-2">
                    <span class="badge bg-primary">${lawyer.specialty}</span>
                </div>
                <div class="text-center mb-2">
                    <span class="lawyer-rating">⭐ ${lawyer.rating}</span>
                    <small class="text-muted"> (${lawyer.reviews} avaliações)</small>
                </div>
                <p class="text-center text-muted small">${lawyer.description}</p>
                <div class="text-center mb-3">
                    <strong class="lawyer-price">R$ ${lawyer.price}/consulta</strong>
                </div>
                <button class="btn btn-outline-primary w-100" onclick="connectToLawyer(${lawyer.id})">
                    <i class="fas fa-phone me-1"></i>Falar com Advogado
                </button>
            </div>
        </div>
    `).join('');
}

function connectToLawyer(lawyerId) {
    const lawyer = MONETIZATION_SYSTEM.lawyers.find(l => l.id === lawyerId);
    
    // Comissão de 15% por indicação
    const commission = lawyer.price * MONETIZATION_SYSTEM.affiliate.commission.lawyer;
    userState.totalSpent += commission;
    saveUserData();
    
    showMessage('info', `Conectando você com ${lawyer.name}... (Comissão: R$ ${commission.toFixed(2)})`);
}

// Produtos Digitais
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    
    grid.innerHTML = MONETIZATION_SYSTEM.products.map(product => `
        <div class="col-md-4">
            <div class="product-card">
                ${product.bestSeller ? '<div class="popular-badge">MAIS VENDIDO</div>' : ''}
                <div class="product-icon">
                    <i class="fas fa-${product.category === 'cursos' ? 'graduation-cap' : 'file-contract'}"></i>
                </div>
                <h5 class="text-center">${product.name}</h5>
                <p class="text-center text-muted">${product.description}</p>
                <ul class="product-features">
                    ${product.features.map(feature => `<li><i class="fas fa-check text-success me-1"></i>${feature}</li>`).join('')}
                </ul>
                <div class="text-center mb-3">
                    <strong class="product-price">R$ ${product.price}</strong>
                </div>
                <button class="btn btn-primary w-100" onclick="buyProduct(${product.id})">
                    <i class="fas fa-shopping-cart me-1"></i>Comprar Agora
                </button>
            </div>
        </div>
    `).join('');
}

function buyProduct(productId) {
    const product = MONETIZATION_SYSTEM.products.find(p => p.id === productId);
    
    // Comissão de 20% por venda
    const commission = product.price * MONETIZATION_SYSTEM.affiliate.commission.product;
    userState.totalSpent += commission;
    saveUserData();
    
    showMessage('success', `Produto "${product.name}" comprado! (Comissão: R$ ${commission.toFixed(2)})`);
}

// Funções auxiliares
function showUpgradePrompt(message) {
    const chatMessages = document.getElementById('chatMessages');
    
    const promptDiv = document.createElement('div');
    promptDiv.className = 'message ai-message';
    promptDiv.innerHTML = `
        <div class="message-avatar bg-secondary">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="upgrade-prompt">
                <strong>${message}</strong>
                <p class="mb-2">Faça upgrade para consultas ilimitadas e recursos exclusivos!</p>
                <button class="btn btn-light btn-sm me-2" onclick="showPremiumPlans()">
                    <i class="fas fa-crown me-1"></i>Ver Planos
                </button>
                <button class="btn btn-outline-light btn-sm" onclick="closeChat()">
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(promptDiv);
    scrollToBottom();
}

function showMessage(type, text) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${text}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'block';
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatMessage(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\n/g, '<br>');
}


// === SISTEMA DE RESET AUTOMÁTICO === //
function checkAndResetDailyUsage() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('drLexLastReset');
    
    if (lastReset !== today) {
        userState.dailyUsage = 0;
        localStorage.setItem('drLexUserState', JSON.stringify(userState));
        localStorage.setItem('drLexLastReset', today);
        console.log('🔄 Uso diário resetado para:', userState.dailyUsage);
    }
}

// Atualize a inicialização:
function initializeUserState() {
    const saved = localStorage.getItem('drLexUserState');
    if (saved) {
        userState = JSON.parse(saved);
    } else {
        userState = {
            plan: 'free',
            dailyUsage: 0,
            totalSpent: 0
        };
    }
    
    // VERIFICA E RESETA USO DIÁRIO
    checkAndResetDailyUsage();
    
    console.log('User state inicializado:', userState);
}
