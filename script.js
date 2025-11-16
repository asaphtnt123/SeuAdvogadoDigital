// netlify/functions/chat.js - ASSISTENTE JURÍDICO PROFISSIONAL
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
        return { statusStatus: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { message } = JSON.parse(event.body);
        console.log('📨 Consulta jurídica:', message);

        // SISTEMA JURÍDICO PROFISSIONAL
        const resposta = generateLegalResponse(message);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: resposta,
                source: 'Dr. Lex IA - Assistente Jurídico'
            })
        };
        
    } catch (error) {
        console.error('💥 Erro:', error);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                response: "🔧 **Dr. Lex IA**\n\nEstamos com instabilidade técnica momentânea. Por favor, reformule sua pergunta jurídica.",
                source: 'Sistema'
            })
        };
    }
};

// SISTEMA JURÍDICO PROFISSIONAL ROBUSTO
function generateLegalResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // === SAUDAÇÕES PROFISSIONAIS ===
    if (containsAny(lowerMessage, ['oi', 'olá', 'ola', 'hello', 'iniciar', 'start'])) {
        return `**Dr. Lex IA** ⚖️\n\n*Saudações! Sou seu assistente jurídico digital.*\n\n🎯 **Como posso ajudá-lo hoje?**\n\n📋 **Áreas de atuação:**\n• 🏢 **Direito Trabalhista**\n• 🛒 **Direito do Consumidor**  \n• 👨‍👩‍👧‍👦 **Direito de Família**\n• 📝 **Direito Civil e Contratos**\n• 🏠 **Direito Imobiliário**\n• 💼 **Direito Empresarial**\n\n💡 *Descreva sua situação para uma orientação jurídica educativa.*`;
    }
    
    if (containsAny(lowerMessage, ['bom dia', 'boa tarde', 'boa noite'])) {
        return `**Dr. Lex IA** ⚖️\n\n*${lowerMessage.includes('bom dia') ? 'Bom dia' : lowerMessage.includes('boa tarde') ? 'Boa tarde' : 'Boa noite'}! Em que posso auxiliá-lo com questões jurídicas?*`;
    }
    
    if (containsAny(lowerMessage, ['obrigado', 'obrigada', 'valeu', 'agradeço'])) {
        return `**Dr. Lex IA** ⚖️\n\n*De nada! Fico feliz em poder orientá-lo.*\n\n📞 **Lembre-se:** Esta é uma orientação educativa inicial. Para casos específicos, consulte sempre um advogado.`;
    }
    
    if (containsAny(lowerMessage, ['tchau', 'adeus', 'até logo', 'encerrar'])) {
        return `**Dr. Lex IA** ⚖️\n\n*Até logo! Espero tê-lo ajudado.*\n\n⚖️ **Importante:** Para análise jurídica completa de seu caso, busque assistência de um profissional qualificado.`;
    }

    // === DIREITO DO CONSUMIDOR ===
    if (containsAny(lowerMessage, ['carro', 'veículo', 'veiculo', 'automóvel', 'automovel']) && 
        containsAny(lowerMessage, ['defeito', 'quebrou', 'problema', 'avaria', 'garantia'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🚗 Veículo com Defeito - Orientações Jurídicas\n\n### 📅 **Prazos Legais (CDC Art. 26):**\n• **90 dias** para produtos duráveis (vícios aparentes e ocultos)\n• **30 dias** para produtos não duráveis\n\n### 🎯 **Seus Direitos:**\n1. **Substituição** por outro produto\n2. **Restituição** do valor pago\n3. **Abatimento** proporcional do preço\n4. **Reparo** gratuito do produto\n\n### 📋 **Procedimento Recomendado:**\n1. **Notificação Extrajudicial** formal\n2. **Laudo Técnico** independente\n3. **PROCON** para mediação\n4. **Juizado Especial** (até 40 salários mínimos)\n\n⚖️ *Artigo 18 do CDC - Prazo máximo de 30 dias para o reparo*`;
    }
    
    if (containsAny(lowerMessage, ['produto', 'eletrodoméstico', 'eletroeletrônico', 'celular', 'tv', 'geladeira']) && 
        containsAny(lowerMessage, ['defeito', 'quebrou', 'não funciona', 'garantia'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🛒 Produto com Defeito - Direito do Consumidor\n\n### ⚡ **Direitos Imediatos (CDC Art. 18):**\n• Reparo gratuito\n• Troca do produto\n• Devolução do valor\n• Abatimento no preço\n\n### ⏰ **Prazos para Reclamação:**\n• **30 dias** - produtos não duráveis\n• **90 dias** - produtos duráveis\n\n### 📝 **Ação Recomendada:**\n1. **Notifique por escrito** a empresa\n2. **Documente** o defeito (fotos/vídeos)\n3. **Exija solução** em 30 dias\n4. **Procure o PROCON** se não resolver\n\n🔍 *Vícios de qualidade podem caracterizar descumprimento contratual*`;
    }

    // === DIREITO TRABALHISTA ===
    if (containsAny(lowerMessage, ['demissão', 'demissao', 'demitido', 'demitida', 'rescisão', 'rescisao'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🏢 Demissão - Direitos Trabalhistas\n\n### 📊 **Demissão Sem Justa Causa:**\n• Saldo de salário\n• Férias vencidas + proporcionais\n• 13º salário proporcional\n• Aviso prévio trabalhado/indenizado\n• FGTS + multa de 40%\n\n### ⚠️ **Demissão Por Justa Causa:**\n• Apenas saldo de salário\n• Férias vencidas (se houver)\n\n### 📋 **Procedimentos:**\n1. **Revise a rescisão** cuidadosamente\n2. **Verifique cálculos** com sindicato\n3. **Documente** todas as comunicações\n4. **Consulte** advogado trabalhista\n\n⏳ *Prazo prescricional: 2 anos da rescisão*`;
    }
    
    if (containsAny(lowerMessage, ['férias', 'ferias', 'descanso', 'período aquisitivo'])) {
        return `**Dr. Lex IA** ⚖️\n\n## ⛱️ Férias - Direito Trabalhista\n\n### 📅 **Período Aquisitivo (CLT Art. 130):**\n• **12 meses** de trabalho para adquirir direito\n• **30 dias** corridos de descanso\n\n### 💰 **Remuneração (Art. 142):**\n• Salário integral\n• **+ 1/3 constitucional** (adicional de 33,33%)\n\n### ⚠️ **Direitos Importantes:**\n• Concessão em até 12 meses após aquisição\n• Proibição de fracionamento inferior a 10 dias\n• Indenização em dobro se não concedidas\n\n📞 *Para cálculo específico, consulte contador ou advogado*`;
    }
    
    if (containsAny(lowerMessage, ['hora extra', 'hora extraordinária', 'hextra'])) {
        return `**Dr. Lex IA** ⚖️\n\n## ⏰ Horas Extras - CLT\n\n### 💰 **Valor da Hora Extra (Art. 59):**\n• **Mínimo 50%** sobre o valor da hora normal\n• Acordos coletivos podem estabelecer percentual maior\n\n### 📊 **Limites Legais:**\n• Máximo **2 horas** extras por dia\n• **Acordo** pode ampliar para até 4 horas\n\n### 🏦 **Banco de Horas:**\n• Compensação em folga em 6 meses\n• Requer acordo individual/coletivo\n\n⚖️ *Controle de jornada é obrigação do empregador*`;
    }

    // === DIREITO DE FAMÍLIA ===
    if (containsAny(lowerMessage, ['divórcio', 'divorcio', 'separação', 'separacao'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 💔 Divórcio - Direito de Família\n\n### 📝 **Modalidades:**\n• **Consensual** - acordo entre as partes\n• **Litigioso** - judicial com discordâncias\n• **Extrajudicial** - cartório (sem filhos menores)\n\n### 👨‍👩‍👧‍👦 **Tópicos Essenciais:**\n• **Guarda dos filhos** - compartilhada preferencial\n• **Pensão alimentícia** - necessidade × possibilidade\n• **Partilha de bens** - conforme regime de casamento\n• **Visitação** - direito de convivência\n\n🕊️ *Mediação familiar pode ser alternativa menos conflituosa*`;
    }
    
    if (containsAny(lowerMessage, ['pensão', 'pensao', 'alimentos', 'alimentícia'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 💰 Pensão Alimentícia\n\n### ⚖️ **Princípios Legais:**\n• **Necessidade** de quem recebe\n• **Possibilidade** de quem paga\n• **Proporcionalidade** entre as partes\n• **Reciprocidade** familiar\n\n### 📊 **Itens Incluídos:**\n• Alimentação, moradia, saúde\n• Educação, vestuário, lazer\n• Despesas médicas e medicamentos\n\n### 🔄 **Revisão:**\n• Possível a qualquer tempo\n• Baseada em mudança de situação\n• Judicial ou extrajudicial\n\n👨‍⚖️ *Valor deve atender necessidades básicas e padrão de vida*`;
    }

    // === DIREITO CIVIL ===
    if (containsAny(lowerMessage, ['contrato', 'cláusula', 'clausula', 'termo'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 📝 Contratos - Direito Civil\n\n### ⚖️ **Princípios Fundamentais:**\n• **Boa-fé objetiva** (Art. 113 CC)\n• **Função social** do contrato\n• **Equilíbrio contratual**\n• **Revisão por onerosidade excessiva**\n\n### ⚠️ **Cláusulas Abusivas (CDC Art. 51):**\n• São nulas de pleno direito\n• Podem ser anuladas judicialmente\n• Exemplo: limitação excessiva de direitos\n\n### 📋 **Recomendações:**\n• Leia atentamente antes de assinar\n• Busque esclarecimentos sobre dúvidas\n• Consulte advogado para contratos complexos\n\n🔍 *Contratos de adesão têm interpretação favorável ao consumidor*`;
    }
    
    if (containsAny(lowerMessage, ['aluguel', 'locação', 'locacao', 'inquilino', 'proprietário', 'proprietario'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🏠 Contrato de Aluguel - Lei do Inquilinato\n\n### 📅 **Prazo Mínimo:**\n• **30 meses** para imóveis residenciais\n• Renovação automática por 30 meses\n\n### 💰 **Valores e Reajustes:**\n• **Caução**: máximo 3 meses de aluguel\n• **Reajuste**: por índice contratual (IGPM, IPCA)\n• **Multa rescisória**: geralmente 3 meses\n\n### 🛠️ **Reparos e Manutenção:**\n• **Inquilino**: pequenos reparos e limpeza\n• **Proprietário**: reformas e grandes reparos\n\n📞 *Problemas devem ser comunicados por escrito*`;
    }

    // === DIREITO EMPRESARIAL ===
    if (containsAny(lowerMessage, ['empresa', 'sociedade', 'sócio', 'socio', 'empresário'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 💼 Direito Empresarial\n\n### 🏢 **Tipos Societários:**\n• **MEI** - Microempreendedor Individual\n• **LTDA** - Sociedade Limitada\n• **SA** - Sociedade Anônima\n• **EI** - Empresário Individual\n\n### 📋 **Aspectos Importantes:**\n• **Contrato social** - fundamento da sociedade\n• **Responsabilidade** - limitada ou ilimitada\n• **Tributação** - regime adequado\n• **Compliance** - conformidade legal\n\n💡 *Planejamento jurídico empresarial evita problemas futuros*`;
    }

    // === PERGUNTAS FREQUENTES ===
    if (containsAny(lowerMessage, ['advogado', 'escritório', 'consultoria', 'honorários'])) {
        return `**Dr. Lex IA** ⚖️\n\n## 🎯 Como Escolher um Advogado\n\n### ✅ **Critérios Importantes:**\n• **Especialização** na área do seu caso\n• **Experiência** e histórico profissional\n• **Referências** e indicações\n• **Transparência** em honorários\n• **Comunicação** clara e acessível\n\n### 💼 **Primeira Consulta:**\n• Leve todos os documentos relevantes\n• Descreva os fatos cronologicamente\n• Esclareça todas as dúvidas\n• Discuta valores e prazos\n\n📞 *A OAB oferece serviço de indicação de advogados*`;
    }

    // === RESPOSTA PADRÃO PARA CONSULTAS GERAIS ===
    return `**Dr. Lex IA** ⚖️\n\n## 🎯 Orientação Jurídica Educativa\n\nObrigado por sua consulta sobre **"${message}"**.\n\n### 📋 **Para uma orientação mais precisa:**\n\n• **Descreva os fatos** em ordem cronológica\n• **Informe prazos** e datas relevantes\n• **Mencione documentos** envolvidos\n• **Especifique** o resultado esperado\n\n### 💡 **Exemplo de Descrição Clara:**\n*"Trabalhei na empresa X de jan/2020 a dez/2022. Fui demitido sem justa causa e não recebi minhas férias de 2021. Gostaria de saber meus direitos."*\n\n⚖️ *Esta é uma orientação educativa inicial. Para análise jurídica completa, consulte um advogado.*\n\n📞 **Áreas de Atuação:** Trabalhista | Consumerista | Família | Civil | Empresarial`;
}

// Função auxiliar
function containsAny(text, terms) {
    return terms.some(term => text.includes(term));
}