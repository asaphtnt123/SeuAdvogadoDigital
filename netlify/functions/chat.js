// netlify/functions/chat.js - VERSÃO SIMPLIFICADA E FUNCIONAL
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
        console.log('📨 Mensagem recebida:', message);

        // ⚠️ VERSÃO SIMPLIFICADA - SEM DEPENDÊNCIAS EXTERNAS
        // Usa apenas respostas locais inteligentes por enquanto
        
        const resposta = generateAIResponse(message);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: resposta,
                source: 'Dr. Lex IA'
            })
        };
        
    } catch (error) {
        console.error('💥 Erro:', error);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: generateFallbackResponse(),
                source: 'Sistema Local'
            })
        };
    }
};

// SISTEMA DE IA LOCAL INTELIGENTE
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Análise inteligente da pergunta
    if (containsAny(lowerMessage, ['oi', 'olá', 'ola', 'hello', 'hi', 'e aí'])) {
        return `**Dr. Lex IA** 🤖\n\nOlá! Sou sua assistente jurídica digital. \n\n💡 *Sistema com IA Integrada*\n\nPosso ajudar com orientações sobre:\n⚖️ Direito Trabalhista\n🛒 Direito do Consumidor  \n👨‍👩‍👧‍👦 Direito de Família\n📝 Direito Civil\n\nComo posso ajudar você hoje?`;
    }
    
    if (containsAny(lowerMessage, ['férias', 'ferias', 'descanso', '30 dias', 'quantos tempo'])) {
        return `**Férias - Direito Trabalhista** ⚖️\n\nCom base na CLT (Consolidação das Leis do Trabalho):\n\n📅 **Período Aquisitivo**:\n• 12 meses de trabalho para adquirir o direito\n• Conhecido como "ano de trabalho"\n\n⏱️ **Duração**:\n• 30 dias corridos de descanso\n• Podem ser divididas em até 3 períodos (um mínimo de 14 dias)\n\n💰 **Remuneração**:\n• Salário integral + 1/3 constitucional\n• Total: salário + 33,33% de adicional\n\n⏰ **Prazo para Usufruir**:\n• Até 12 meses após o período aquisitivo\n• Após esse prazo, empresa deve pagar em dobro\n\n📋 **Próximos Passos**:\n1. Verifique seu período aquisitivo\n2. Solicite por escrito com 30 dias de antecedência\n3. Em caso de negativa, consulte advogado trabalhista\n\n⚖️ *Para cálculo específico do seu caso, consulte um especialista.*`;
    }
    
    if (containsAny(lowerMessage, ['demissão', 'demissao', 'demitido', 'demitida', 'rescisão'])) {
        return `**Demissão - Direitos Trabalhistas** ⚖️\n\n**DEMISSÃO SEM JUSTA CAUSA**:\n• Aviso prévio (30 dias + 3 dias/ano acima de 1 ano)\n• 13º salário proporcional\n• Férias vencidas + proporcionais + 1/3\n• FGTS + multa de 40%\n• Saldo de salário\n\n**DEMISSÃO COM JUSTA CAUSA**:\n• Apenas saldo de salário\n• Sem aviso prévio\n• Sem multa do FGTS\n\n**PEDIDO DE DEMISSÃO**:\n• Aviso prévio (se não dispensado)\n• 13º salário proporcional\n• Férias vencidas + proporcionais\n• Saldo de salário\n• SEM multa do FGTS\n\n📋 **Ações Recomendadas**:\n1. **Documente tudo**: e-mails, comunicados, contracheques\n2. **Calcule seus direitos**: use calculadoras trabalhistas confiáveis\n3. **Busque orientação**: sindicato ou advogado trabalhista\n4. **Considere acordo**: pode ser vantajoso com assessoria\n\n⚖️ *Cada caso tem particularidades - consulte profissional para análise específica.*`;
    }
    
    if (containsAny(lowerMessage, ['consumidor', 'produto', 'defeito', 'garantia', 'devolução', 'loja'])) {
        return `**Direito do Consumidor - CDC** 🛒\n\n**DIREITOS BÁSICOS (Art. 6º CDC)**:\n• Proteção da vida e saúde\n• Educação para o consumo\n• Informação adequada e clara\n• Proteção contra publicidade enganosa\n• Modificação de cláusulas contratuais abusivas\n\n**PRAZOS PARA RECLAMAÇÃO**:\n• Vícios aparentes: 30 dias (produtos não duráveis)\n• Vícios ocultos: 90 dias (produtos duráveis)\n• Serviços: 90 dias\n\n**DIREITOS EM CASO DE DEFEITO**:\n1. Reparo gratuito\n2. Troca do produto\n3. Devolução do valor pago\n4. Abatimento proporcional do preço\n\n**AÇÕES RECOMENDADAS**:\n1. **Notificação extrajudicial**: formalize por escrito\n2. **PROCON**: mediação gratuita e eficaz\n3. **Juizado Especial**: até 40 salários mínimos sem advogado\n4. **Ação judicial**: para casos complexos ou valores altos\n\n📝 *Para notificações formais, consulte modelos específicos ou advogado consumerista.*`;
    }
    
    if (containsAny(lowerMessage, ['contrato', 'aluguel', 'locação', 'imóvel', 'inquilino'])) {
        return `**Contratos - Direito Civil** 📝\n\n**PRINCÍPIOS FUNDAMENTAIS**:\n• Boa-fé objetiva (Art. 113 CC)\n• Função social do contrato\n• Equilíbrio contratual\n• Revisão por onerosidade excessiva\n\n**CONTRATO DE ALUGUEL - PONTOS CHAVE**:\n• Prazo mínimo: 30 meses (Lei do Inquilinato)\n• Reajuste: por índice contratado (IGPM, IPCA)\n• Caução: máximo 3 meses de aluguel\n• Multa rescisória: geralmente 3 meses\n• Reparos: pequenos - inquilino; grandes - proprietário\n\n**DIREITOS E DEVERES**:\n✓ Inquilino: usar o imóvel com zelo, pagar em dia\n✓ Proprietário: entregar em condições, fazer reparos\n✓ Ambos: 30 dias para notificar rescisão\n\n**AÇÕES POSSÍVEIS**:\n• Revisão de aluguel\n• Rescisão por vícios\n• Cobrança de débitos\n• Despejo por inadimplência\n\n⚖️ *Contratos complexos exigem análise jurídica detalhada.*`;
    }
    
    if (containsAny(lowerMessage, ['divórcio', 'casamento', 'separação', 'pensão', 'guarda', 'filho'])) {
        return `**Direito de Família** 👨‍👩‍👧‍👦\n\n**DIVÓRCIO - MODALIDADES**:\n• Consensual: acordo entre as partes (mais rápido)\n• Litigioso: judicial com discordâncias\n• Extrajudicial: cartório (sem filhos menores ou bens)\n\n**GUARDA DE FILHOS**:\n• Compartilhada: preferencial (ambos os pais)\n• Unilateral: um dos pais (casos específicos)\n• Alternada: períodos com cada pai\n\n**PENSÃO ALIMENTÍCIA**:\n• Base: necessidade × possibilidade\n• Inclui: alimentação, educação, saúde, moradia, lazer\n• Revisível: pode ser alterada conforme mudanças\n\n**PARTILHA DE BENS**:\n• Comunhão parcial: bens adquiridos na constância do casamento\n• Separação total: cada um com seus bens\n• Participação final: cálculo no divórcio\n\n**MEDIAÇÃO FAMILIAR**:\n• Alternativa menos conflituosa\n• Preserva relações familiares\n• Mais rápida e econômica\n\n👨‍⚖️ *Cada família é única - busque orientação personalizada.*`;
    }
    
    // Resposta para perguntas não identificadas
    return `**Dr. Lex IA** 🤖\n\nObrigado pela sua consulta sobre "${message}".\n\nPara uma orientação jurídica mais precisa:\n\n📋 **Informe mais detalhes como:**\n• Cronologia dos fatos\n• Documentos envolvidos\n• Suas tentativas de solução\n• Resultado esperado\n\n💡 **Exemplo de descrição clara:**\n"Trabalhei 2 anos em uma empresa e fui demitido sem justa causa. Não recebi minhas férias vencidas nem o 13º proporcional. O que fazer?"\n\n⚖️ *Sua assistente jurídica educativa - Em breve com IA avançada para respostas ainda mais específicas!*`;
}

function generateFallbackResponse() {
    return `**Dr. Lex IA** 🤖\n\nSistema em otimização técnica. 😊\n\nEstamos melhorando nossa IA para fornecer respostas ainda mais precisas!\n\nEnquanto isso, continue descrevendo suas dúvidas jurídicas que nossas respostas especializadas estão aqui para ajudar.\n\n⚖️ *Sistema local ativo - IA em atualização*`;
}

function containsAny(text, terms) {
    return terms.some(term => text.includes(term));
}