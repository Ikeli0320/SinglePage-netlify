// Vibe-Centric Living JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有功能
    initEmotionTags();
    initStoryCarousel();
    initVibeMap();
    initVibeSearch();
    initVibeMode();
    initFloatingButton();
});

// 情感標籤功能
function initEmotionTags() {
    const emotionTags = document.querySelectorAll('.emotion-tag');
    const emotionInput = document.getElementById('emotionInput');

    emotionTags.forEach(tag => {
        tag.addEventListener('click', function () {
            const emotion = this.getAttribute('data-emotion');
            const text = this.textContent;

            // 切換選中狀態
            emotionTags.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');

            // 填入搜尋欄
            if (emotionInput) {
                emotionInput.value = text;
                emotionInput.focus();
            }

            // 觸發搜尋建議
            triggerSearchSuggestions(emotion);
        });
    });
}

// 故事輪播功能
function initStoryCarousel() {
    const storyCards = document.querySelectorAll('.story-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;

    function showStory(index) {
        // 隱藏所有故事
        storyCards.forEach(card => card.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 顯示當前故事
        storyCards[index].classList.add('active');
        indicators[index].classList.add('active');

        currentIndex = index;
    }

    // 下一張
    function nextStory() {
        const nextIndex = (currentIndex + 1) % storyCards.length;
        showStory(nextIndex);
    }

    // 上一張
    function prevStory() {
        const prevIndex = (currentIndex - 1 + storyCards.length) % storyCards.length;
        showStory(prevIndex);
    }

    // 綁定按鈕事件
    if (nextBtn) nextBtn.addEventListener('click', nextStory);
    if (prevBtn) prevBtn.addEventListener('click', prevStory);

    // 綁定指示器事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showStory(index));
    });

    // 自動播放
    setInterval(nextStory, 5000);
}

// 氛圍地圖功能
function initVibeMap() {
    // 模擬地圖數據
    const mapData = {
        'lifestyle': {
            '信義區': { lat: 25.0330, lng: 121.5654, vibe: 'creative', score: 8.5, properties: 156 },
            '大安區': { lat: 25.0260, lng: 121.5440, vibe: 'peaceful', score: 9.2, properties: 203 },
            '內湖區': { lat: 25.0830, lng: 121.5654, vibe: 'natural', score: 7.8, properties: 89 }
        },
        'vibe': {
            '信義區': { intensity: 85, color: '#9B59B6' },
            '大安區': { intensity: 92, color: '#3498DB' },
            '內湖區': { intensity: 78, color: '#27AE60' }
        }
    };

    const layerBtns = document.querySelectorAll('.layer-btn');
    const poiCard = document.getElementById('poiCard');
    const poiTitle = document.getElementById('poiTitle');
    const poiDescription = document.getElementById('poiDescription');
    const poiVibeScore = document.getElementById('poiVibeScore');
    const poiPropertyCount = document.getElementById('poiPropertyCount');
    const poiClose = document.getElementById('poiClose');

    // 模擬地圖點擊
    const mapArea = document.getElementById('vibeMap');
    if (mapArea) {
        mapArea.addEventListener('click', function (e) {
            // 模擬點擊不同區域
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 根據點擊位置顯示不同區域信息
            let area, data;
            if (x < rect.width / 3) {
                area = '信義區';
                data = mapData.lifestyle['信義區'];
            } else if (x < (rect.width * 2) / 3) {
                area = '大安區';
                data = mapData.lifestyle['大安區'];
            } else {
                area = '內湖區';
                data = mapData.lifestyle['內湖區'];
            }

            // 更新POI卡片
            poiTitle.textContent = area;
            poiDescription.textContent = getAreaDescription(area, data.vibe);
            poiVibeScore.textContent = data.score;
            poiPropertyCount.textContent = data.properties;

            // 顯示POI卡片
            poiCard.style.display = 'block';
        });
    }

    // 關閉POI卡片
    if (poiClose) {
        poiClose.addEventListener('click', function () {
            poiCard.style.display = 'none';
        });
    }

    // 圖層切換
    layerBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const layer = this.getAttribute('data-layer');

            // 更新按鈕狀態
            layerBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 更新地圖樣式
            updateMapLayer(layer);
        });
    });
}

// 氛圍搜尋功能
function initVibeSearch() {
    const exploreButton = document.getElementById('exploreButton');
    const emotionInput = document.getElementById('emotionInput');
    const lifestyleInput = document.getElementById('lifestyleInput');

    if (exploreButton) {
        exploreButton.addEventListener('click', function () {
            const emotion = emotionInput ? emotionInput.value : '';
            const lifestyle = lifestyleInput ? lifestyleInput.value : '';

            if (emotion || lifestyle) {
                performVibeSearch(emotion, lifestyle);
            } else {
                showNotification('請輸入您想要的生活氛圍或生活方式', 'warning');
            }
        });
    }

    // 輸入框回車搜尋
    [emotionInput, lifestyleInput].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    exploreButton.click();
                }
            });
        }
    });
}

// 氛圍模式切換
function initVibeMode() {
    const vibeModeToggle = document.getElementById('vibeModeToggle');

    if (vibeModeToggle) {
        vibeModeToggle.addEventListener('click', function () {
            const isActive = this.classList.contains('active');

            if (isActive) {
                this.classList.remove('active');
                this.innerHTML = '<i class="fas fa-magic"></i><span>氛圍模式</span>';
                disableVibeMode();
            } else {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-sparkles"></i><span>氛圍模式</span>';
                enableVibeMode();
            }
        });
    }
}

// 浮動按鈕功能
function initFloatingButton() {
    const vibeFab = document.getElementById('vibeFab');

    if (vibeFab) {
        vibeFab.addEventListener('click', function () {
            // 滾動到搜尋區域
            const exploreSection = document.getElementById('explore');
            if (exploreSection) {
                exploreSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// 輔助函數
function triggerSearchSuggestions(emotion) {
    const suggestions = {
        'peaceful': ['寧靜清幽', '靜謐祥和', '遠離塵囂'],
        'creative': ['文創藝術', '充滿創意', '藝術氣息'],
        'lively': ['熱鬧繁華', '活力四射', '充滿活力'],
        'natural': ['綠意盎然', '親近自然', '生態環境'],
        'cozy': ['溫馨舒適', '溫暖如家', '舒適愜意'],
        'elegant': ['優雅精緻', '品味生活', '精緻優雅'],
        'energetic': ['活力四射', '充滿能量', '動感十足'],
        'tranquil': ['靜謐祥和', '寧靜致遠', '心靈平靜']
    };

    console.log('搜尋建議:', suggestions[emotion] || []);
}

function performVibeSearch(emotion, lifestyle) {
    // 模擬搜尋結果
    const results = [
        {
            area: '信義區',
            matchScore: 92,
            description: '符合您對文創藝術氛圍的追求',
            properties: 15
        },
        {
            area: '大安區',
            matchScore: 88,
            description: '寧靜優雅的環境適合您的生活方式',
            properties: 23
        },
        {
            area: '內湖區',
            matchScore: 85,
            description: '自然環境與創新氛圍的完美結合',
            properties: 12
        }
    ];

    showSearchResults(results);
    showNotification(`找到 ${results.length} 個符合您需求的社區`, 'success');
}

function showSearchResults(results) {
    // 這裡可以實現搜尋結果的顯示邏輯
    console.log('搜尋結果:', results);

    // 滾動到地圖區域
    const mapSection = document.getElementById('map');
    if (mapSection) {
        mapSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function getAreaDescription(area, vibe) {
    const descriptions = {
        '信義區': {
            'creative': '充滿活力的商業區，擁有豐富的夜生活和購物選擇。',
            'peaceful': '高樓林立中的寧靜角落，適合追求品質生活的你。',
            'natural': '都市中的綠洲，公園綠地環繞，親近自然。'
        },
        '大安區': {
            'creative': '文藝氣息濃厚，書店咖啡廳林立，適合文青生活。',
            'peaceful': '寧靜優雅的住宅區，學區優質，生活品質高。',
            'natural': '綠樹成蔭的街道，公園眾多，環境優美。'
        },
        '內湖區': {
            'creative': '科技創新氛圍濃厚，適合創業者和科技工作者。',
            'peaceful': '遠離市區喧囂，環境清幽，適合家庭生活。',
            'natural': '鄰近山區，自然環境優美，空氣清新。'
        }
    };

    return descriptions[area]?.[vibe] || '充滿特色的社區，值得您深入了解。';
}

function updateMapLayer(layer) {
    // 這裡可以實現地圖圖層的切換邏輯
    console.log('切換到圖層:', layer);

    // 模擬地圖更新
    const mapArea = document.getElementById('vibeMap');
    if (mapArea) {
        const colors = {
            'lifestyle': 'linear-gradient(45deg, #667eea, #764ba2)',
            'vibe': 'linear-gradient(45deg, #f093fb, #f5576c)',
            'future': 'linear-gradient(45deg, #4facfe, #00f2fe)'
        };

        mapArea.style.background = colors[layer] || colors['lifestyle'];
    }
}

function enableVibeMode() {
    // 啟用氛圍模式
    document.body.classList.add('vibe-mode-active');

    // 添加動畫效果
    const elements = document.querySelectorAll('.emotion-tag, .story-card, .dna-card, .property-card');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = 'pulse 2s infinite';
        }, index * 100);
    });

    showNotification('氛圍模式已啟用，體驗更豐富的情感互動', 'success');
}

function disableVibeMode() {
    // 停用氛圍模式
    document.body.classList.remove('vibe-mode-active');

    // 移除動畫效果
    const elements = document.querySelectorAll('.emotion-tag, .story-card, .dna-card, .property-card');
    elements.forEach(el => {
        el.style.animation = '';
    });

    showNotification('氛圍模式已停用', 'info');
}

function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // 添加樣式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // 添加到頁面
    document.body.appendChild(notification);

    // 顯示動畫
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自動隱藏
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27AE60',
        'warning': '#F39C12',
        'error': '#E74C3C',
        'info': '#3498DB'
    };
    return colors[type] || '#3498DB';
}

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滾動動畫
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 觀察需要動畫的元素
document.querySelectorAll('.story-card, .dna-card, .property-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
}); 