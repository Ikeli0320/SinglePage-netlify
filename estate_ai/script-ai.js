// 感知型房地產網站 AI 互動功能

class AIRealEstateAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.conversationHistory = [];
        this.userPreferences = {};

        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.bindEvents();
        this.loadUserPreferences();
        this.startWelcomeSequence();
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'zh-TW';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('語音識別錯誤:', event.error);
                this.stopListening();
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        }
    }

    bindEvents() {
        // 語音按鈕
        const voiceButton = document.getElementById('voiceButton');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        }

        // 發送按鈕
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.handleTextInput());
        }

        // 文字輸入框
        const conversationInput = document.getElementById('conversationInput');
        if (conversationInput) {
            conversationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleTextInput();
                }
            });
        }

        // 快速建議按鈕
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const suggestion = chip.dataset.suggestion;
                this.processUserInput(suggestion);
            });
        });

        // AI浮動按鈕
        const aiFab = document.getElementById('aiFab');
        if (aiFab) {
            aiFab.addEventListener('click', () => this.openChatModal());
        }

        // 模態框控制
        const aiModal = document.getElementById('aiModal');
        const closeModal = document.getElementById('closeModal');
        const sendChat = document.getElementById('sendChat');
        const chatInput = document.getElementById('chatInput');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeChatModal());
        }

        if (sendChat && chatInput) {
            sendChat.addEventListener('click', () => this.handleChatInput());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleChatInput();
                }
            });
        }

        // 點擊模態框外部關閉
        if (aiModal) {
            aiModal.addEventListener('click', (e) => {
                if (e.target === aiModal) {
                    this.closeChatModal();
                }
            });
        }

        // 查看詳情按鈕
        const viewDetailsButtons = document.querySelectorAll('.view-details');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPropertyDetails(e.target.closest('.property-card'));
            });
        });

        // AI模式切換
        const aiModeToggle = document.getElementById('aiModeToggle');
        if (aiModeToggle) {
            aiModeToggle.addEventListener('click', () => this.toggleAIMode());
        }
    }

    toggleVoiceInput() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (this.recognition) {
            this.isListening = true;
            this.recognition.start();

            const voiceButton = document.getElementById('voiceButton');
            if (voiceButton) {
                voiceButton.classList.add('listening');
                voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
            }

            this.speak('請說出您的需求');
        }
    }

    stopListening() {
        if (this.recognition) {
            this.isListening = false;
            this.recognition.stop();

            const voiceButton = document.getElementById('voiceButton');
            if (voiceButton) {
                voiceButton.classList.remove('listening');
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i><div class="voice-animation"></div>';
            }
        }
    }

    handleVoiceInput(transcript) {
        this.stopListening();
        this.processUserInput(transcript);
    }

    handleTextInput() {
        const input = document.getElementById('conversationInput');
        if (input && input.value.trim()) {
            const text = input.value.trim();
            input.value = '';
            this.processUserInput(text);
        }
    }

    handleChatInput() {
        const input = document.getElementById('chatInput');
        if (input && input.value.trim()) {
            const text = input.value.trim();
            input.value = '';
            this.addChatMessage(text, 'user');
            this.processUserInput(text);
        }
    }

    processUserInput(input) {
        // 模擬AI處理用戶輸入
        this.addChatMessage(input, 'user');

        // 分析用戶意圖
        const intent = this.analyzeIntent(input);

        // 生成回應
        setTimeout(() => {
            const response = this.generateResponse(intent, input);
            this.addChatMessage(response, 'ai');
            this.updateUI(intent);
        }, 1000);
    }

    analyzeIntent(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('找') || lowerInput.includes('搜尋') || lowerInput.includes('房子')) {
            return 'SEARCH_PROPERTY';
        } else if (lowerInput.includes('分析') || lowerInput.includes('趨勢') || lowerInput.includes('市場')) {
            return 'MARKET_ANALYSIS';
        } else if (lowerInput.includes('比較') || lowerInput.includes('對比')) {
            return 'COMPARE_PROPERTIES';
        } else if (lowerInput.includes('投資') || lowerInput.includes('收益')) {
            return 'INVESTMENT_ADVICE';
        } else if (lowerInput.includes('安靜') || lowerInput.includes('家庭') || lowerInput.includes('學區')) {
            return 'LIFESTYLE_PREFERENCE';
        } else {
            return 'GENERAL_INQUIRY';
        }
    }

    generateResponse(intent, userInput) {
        const responses = {
            'SEARCH_PROPERTY': `我了解您想找房子。根據您的需求，我已經為您篩選了最適合的物件。您可以在下方看到我推薦的房源，每個都有詳細的AI分析說明。`,
            'MARKET_ANALYSIS': `根據最新的市場數據分析，台北市房價呈現穩健上漲趨勢。信義區和大安區表現最為亮眼，平均漲幅達8.3%。建議您關注這些區域的投資機會。`,
            'COMPARE_PROPERTIES': `我可以幫您比較不同區域的房價趨勢。目前內湖科技園區周邊租金收益率最高，達4.2%，而信義區則以增值潛力見長。您想了解哪個區域的詳細資訊？`,
            'INVESTMENT_ADVICE': `基於當前市場分析，我建議您關注內湖科技園區周邊物件。這裡租金收益率穩定，且未來增值潛力大。平均年化收益率約3.8%。`,
            'LIFESTYLE_PREFERENCE': `我注意到您重視生活品質。我已經更新了推薦算法，為您篩選出符合安靜、家庭友善、學區優質條件的物件。`,
            'GENERAL_INQUIRY': `我是您的AI房地產顧問，可以幫您分析市場趨勢、推薦合適物件，並提供專業建議。請告訴我您的具體需求。`
        };

        return responses[intent] || responses['GENERAL_INQUIRY'];
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${message}</p>`;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        // 滾動到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 儲存對話歷史
        this.conversationHistory.push({ sender, message, timestamp: new Date() });
    }

    updateUI(intent) {
        // 根據意圖更新UI
        switch (intent) {
            case 'SEARCH_PROPERTY':
                this.highlightProperties();
                break;
            case 'MARKET_ANALYSIS':
                this.updateInsights();
                break;
            case 'INVESTMENT_ADVICE':
                this.updateAnalysis();
                break;
        }
    }

    highlightProperties() {
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';

                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }, 1000);
            }, index * 200);
        });
    }

    updateInsights() {
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }, index * 300);
        });
    }

    updateAnalysis() {
        const analysisCards = document.querySelectorAll('.analysis-card');
        analysisCards.forEach(card => {
            card.style.borderColor = '#F59E0B';
            setTimeout(() => {
                card.style.borderColor = '';
            }, 2000);
        });
    }

    openChatModal() {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeChatModal() {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    showPropertyDetails(propertyCard) {
        // 模擬顯示物件詳情
        const propertyTitle = propertyCard.querySelector('h4').textContent;
        const propertyPrice = propertyCard.querySelector('.property-price').textContent;

        this.addChatMessage(`您點擊了 ${propertyTitle}，價格為 ${propertyPrice}。我可以為您提供更詳細的分析，包括投資潛力、市場比較和鄰里分析。`, 'ai');

        // 滾動到對話區域
        propertyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    toggleAIMode() {
        const toggle = document.getElementById('aiModeToggle');
        if (toggle) {
            const isActive = toggle.classList.contains('active');
            if (isActive) {
                toggle.classList.remove('active');
                toggle.innerHTML = '<i class="fas fa-magic"></i><span>AI模式</span>';
                this.disableAIFeatures();
            } else {
                toggle.classList.add('active');
                toggle.innerHTML = '<i class="fas fa-magic"></i><span>AI模式開啟</span>';
                this.enableAIFeatures();
            }
        }
    }

    enableAIFeatures() {
        // 啟用AI功能
        document.body.classList.add('ai-mode-active');
        this.speak('AI模式已開啟，我將為您提供更個人化的服務');
    }

    disableAIFeatures() {
        // 停用AI功能
        document.body.classList.remove('ai-mode-active');
        this.speak('AI模式已關閉');
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-TW';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            this.synthesis.speak(utterance);
        }
    }

    startWelcomeSequence() {
        setTimeout(() => {
            this.speak('歡迎使用美樂智能不動產，我是您的智慧房地產顧問');
        }, 1000);
    }

    loadUserPreferences() {
        // 從localStorage載入用戶偏好
        const saved = localStorage.getItem('mlestate_preferences');
        if (saved) {
            this.userPreferences = JSON.parse(saved);
        }
    }

    saveUserPreferences() {
        // 儲存用戶偏好到localStorage
        localStorage.setItem('mlestate_preferences', JSON.stringify(this.userPreferences));
    }

    // 模擬AI推薦算法
    updateRecommendations() {
        const recommendations = document.querySelectorAll('.ai-recommendation');
        const reasons = [
            '因為您偏好安靜環境且需要在家工作，推薦此物件',
            '符合您的預算範圍，且鄰近科技園區，投資潛力佳',
            '基於您對品質的要求，推薦此高級住宅區物件',
            '考慮到您的家庭需求，此物件學區優質且生活機能完善',
            '根據市場分析，此區域未來增值潛力大，適合投資'
        ];

        recommendations.forEach((rec, index) => {
            const reason = reasons[index % reasons.length];
            rec.innerHTML = `🤖 ${reason}`;
        });
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    const aiAssistant = new AIRealEstateAssistant();

    // 模擬即時數據更新
    setInterval(() => {
        aiAssistant.updateRecommendations();
    }, 30000); // 每30秒更新一次

    // 添加載入動畫
    const loadingElements = document.querySelectorAll('.insight-card, .property-card, .analysis-card');
    loadingElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 性能優化：懶載入圖片
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
});

// 鍵盤快捷鍵支援
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 開啟AI對話
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const aiFab = document.getElementById('aiFab');
        if (aiFab) {
            aiFab.click();
        }
    }

    // ESC 關閉模態框
    if (e.key === 'Escape') {
        const modal = document.getElementById('aiModal');
        if (modal && modal.style.display === 'block') {
            const closeButton = document.getElementById('closeModal');
            if (closeButton) {
                closeButton.click();
            }
        }
    }
}); 