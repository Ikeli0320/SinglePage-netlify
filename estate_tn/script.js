// 美樂地產 - 地理故事導向房地產平台 JavaScript

class TerraNarrativa {
    constructor() {
        this.map = null;
        this.currentLayer = 'historical';
        this.activeMarkers = [];
        this.storyData = {};
        this.propertyData = {};
        this.isLoading = true;

        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.initializeMap();
            this.setupEventListeners();
            this.hideLoadingScreen();
            this.showWelcomeMessage();
        } catch (error) {
            console.error('初始化失敗:', error);
            this.showError('載入失敗，請重新整理頁面');
        }
    }

    async loadData() {
        // 模擬載入資料
        this.storyData = {
            historical: [
                {
                    id: 'taipei-101',
                    name: '台北101',
                    position: [25.0330, 121.5654],
                    title: '台北101的歷史故事',
                    content: '台北101於1999年開始興建，2004年完工，曾是全球最高的建築物。這座摩天大樓不僅是台北的地標，更代表了台灣經濟發展的里程碑。',
                    timeline: [
                        { year: 1999, event: '開始興建' },
                        { year: 2004, event: '完工啟用' },
                        { year: 2010, event: '成為台北地標' }
                    ],
                    relatedPlaces: ['信義商圈', '象山', '市政府']
                },
                {
                    id: 'ximen',
                    name: '西門町',
                    position: [25.0419, 121.5078],
                    title: '西門町的演變',
                    content: '西門町從日治時期的娛樂區，演變為現代的年輕人聚集地。這裡見證了台北市區的發展歷程，是了解台北文化的重要窗口。',
                    timeline: [
                        { year: 1900, event: '日治時期開發' },
                        { year: 1950, event: '戰後重建' },
                        { year: 2000, event: '現代化改造' }
                    ],
                    relatedPlaces: ['紅樓', '中華路', '萬華區']
                }
            ],
            lifestyle: [
                {
                    id: 'yongkang',
                    name: '永康街',
                    position: [25.0330, 121.5300],
                    title: '永康街的生活美學',
                    content: '永康街以其獨特的小店文化和美食聞名，是台北最具生活氣息的地區之一。這裡的每一家店都有其獨特的故事。',
                    timeline: [
                        { year: 1980, event: '小店開始聚集' },
                        { year: 2000, event: '文化特色形成' },
                        { year: 2020, event: '國際知名度提升' }
                    ],
                    relatedPlaces: ['大安森林公園', '師大夜市', '東門市場']
                }
            ],
            utility: [
                {
                    id: 'taipei-main-station',
                    name: '台北車站',
                    position: [25.0478, 121.5170],
                    title: '台北交通樞紐',
                    content: '台北車站是台灣最重要的交通樞紐，連接高鐵、台鐵、捷運等各種交通工具，是台北市的心臟地帶。',
                    timeline: [
                        { year: 1891, event: '第一代車站啟用' },
                        { year: 1989, event: '現址重建' },
                        { year: 2007, event: '高鐵加入營運' }
                    ],
                    relatedPlaces: ['京站', '北門', '華山文創園區']
                }
            ],
            future: [
                {
                    id: 'dongmen',
                    name: '東門',
                    position: [25.0330, 121.5200],
                    title: '東門的未來發展',
                    content: '東門地區正在進行大規模的都市更新計劃，未來將成為台北市的新興商業區，結合傳統與現代的城市規劃。',
                    timeline: [
                        { year: 2020, event: '都市更新計劃啟動' },
                        { year: 2025, event: '第一期工程完工' },
                        { year: 2030, event: '全面完工啟用' }
                    ],
                    relatedPlaces: ['信義區', '大安區', '中正區']
                }
            ]
        };

        this.propertyData = [
            {
                id: 'prop-1',
                title: '信義區精緻套房',
                price: 28000000,
                area: 25,
                bedrooms: 2,
                bathrooms: 1,
                position: [25.0330, 121.5654],
                description: '位於信義區的精緻套房，鄰近台北101，交通便利，生活機能完善。',
                images: ['https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400'],
                distance: 5
            },
            {
                id: 'prop-2',
                title: '大安區溫馨公寓',
                price: 35000000,
                area: 35,
                bedrooms: 3,
                bathrooms: 2,
                position: [25.0330, 121.5300],
                description: '大安區的溫馨公寓，鄰近永康街，環境優雅，適合家庭居住。',
                images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'],
                distance: 8
            },
            {
                id: 'prop-3',
                title: '中正區現代住宅',
                price: 42000000,
                area: 40,
                bedrooms: 3,
                bathrooms: 2,
                position: [25.0478, 121.5170],
                description: '中正區的現代住宅，鄰近台北車站，投資自住兩相宜。',
                images: ['https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=400'],
                distance: 3
            }
        ];
    }

    initializeMap() {
        // 初始化地圖
        this.map = L.map('map-container').setView([25.0330, 121.5654], 13);

        // 添加 OpenStreetMap 圖層
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            subdomains: ['a', 'b', 'c']
        }).addTo(this.map);

        // 載入初始圖層
        this.loadLayer(this.currentLayer);

        // 地圖事件監聽
        this.map.on('moveend', () => {
            this.updateLocationInfo();
        });

        this.map.on('click', (e) => {
            this.hidePropertyPopup();
        });
    }

    setupEventListeners() {
        // 圖層切換
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = e.currentTarget.dataset.layer;
                this.switchLayer(layer);
            });
        });

        // 地圖控制
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.map.zoomIn();
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.map.zoomOut();
        });

        document.getElementById('locate-me').addEventListener('click', () => {
            this.locateUser();
        });

        // 面板控制
        document.getElementById('close-story').addEventListener('click', () => {
            this.closeStoryPanel();
        });

        document.getElementById('close-property').addEventListener('click', () => {
            this.closePropertyPanel();
        });

        // 時間軸
        document.getElementById('timeline').addEventListener('input', (e) => {
            this.updateTimeline(e.target.value);
        });

        // 搜尋
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // 幫助按鈕
        document.getElementById('help-btn').addEventListener('click', () => {
            this.showHelpModal();
        });

        document.getElementById('close-help').addEventListener('click', () => {
            this.hideHelpModal();
        });

        // 設定按鈕
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });
    }

    switchLayer(layerName) {
        // 更新按鈕狀態
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-layer="${layerName}"]`).classList.add('active');

        // 清除現有標記
        this.clearMarkers();

        // 載入新圖層
        this.currentLayer = layerName;
        this.loadLayer(layerName);

        // 更新故事面板
        this.updateStoryPanel();
    }

    loadLayer(layerName) {
        const layerData = this.storyData[layerName] || [];

        layerData.forEach(item => {
            const marker = this.createStoryMarker(item, layerName);
            this.activeMarkers.push(marker);
            marker.addTo(this.map);
        });

        // 湧現式房源發現
        this.discoverProperties(layerName);
    }

    createStoryMarker(item, layerName) {
        const icon = this.getLayerIcon(layerName);

        const marker = L.marker(item.position, { icon })
            .bindPopup(this.createStoryPopup(item), {
                maxWidth: 300,
                className: 'story-popup'
            });

        marker.on('click', () => {
            this.showStoryPanel(item);
        });

        return marker;
    }

    getLayerIcon(layerName) {
        const iconColors = {
            historical: '#D2691E',
            lifestyle: '#FF69B4',
            utility: '#4169E1',
            future: '#9370DB'
        };

        return L.divIcon({
            className: 'custom-story-marker',
            html: `<div style="
                width: 30px;
                height: 30px;
                background: ${iconColors[layerName]};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${this.getLayerIconText(layerName)}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    getLayerIconText(layerName) {
        const icons = {
            historical: '🏛️',
            lifestyle: '☕',
            utility: '🏥',
            future: '🔮'
        };
        return icons[layerName] || '📍';
    }

    createStoryPopup(item) {
        return `
            <div class="story-popup-content">
                <h3>${item.title}</h3>
                <p>${item.content.substring(0, 100)}...</p>
                <button onclick="terraNarrativa.showStoryPanel('${item.id}')" class="popup-button">
                    了解更多
                </button>
            </div>
        `;
    }

    showStoryPanel(item) {
        const panel = document.getElementById('story-panel');
        const title = document.getElementById('story-title');
        const content = document.getElementById('narrative-content');
        const placesList = document.getElementById('places-list');

        if (typeof item === 'string') {
            item = this.findStoryItem(item);
        }

        if (!item) return;

        title.textContent = item.title;
        content.innerHTML = `
            <p>${item.content}</p>
            <div class="story-highlights">
                <h4>重點特色</h4>
                <ul>
                    ${item.timeline.map(event => `<li><strong>${event.year}</strong>: ${event.event}</li>`).join('')}
                </ul>
            </div>
        `;

        placesList.innerHTML = item.relatedPlaces.map(place =>
            `<div class="place-item">${place}</div>`
        ).join('');

        panel.classList.add('open');
    }

    findStoryItem(id) {
        for (const layer of Object.values(this.storyData)) {
            const item = layer.find(item => item.id === id);
            if (item) return item;
        }
        return null;
    }

    closeStoryPanel() {
        document.getElementById('story-panel').classList.remove('open');
    }

    discoverProperties(layerName) {
        // 根據圖層類型發現相關房源
        const relevantProperties = this.propertyData.filter(property => {
            // 簡單的匹配邏輯，實際應用中會使用更複雜的 AI 算法
            return Math.random() > 0.5; // 隨機顯示一些房源
        });

        // 延遲顯示房源，模擬湧現效果
        setTimeout(() => {
            this.showPropertyPanel(relevantProperties);
        }, 1000 + Math.random() * 2000);
    }

    showPropertyPanel(properties) {
        const panel = document.getElementById('property-panel');
        const content = document.getElementById('property-content');

        content.innerHTML = properties.map(property => `
            <div class="property-card" onclick="terraNarrativa.showPropertyPopup('${property.id}')">
                <h4>${property.title}</h4>
                <div class="property-price">NT$ ${property.price.toLocaleString()}</div>
                <div class="property-details">
                    <span>🛏️ ${property.bedrooms}房</span>
                    <span>🚿 ${property.bathrooms}衛</span>
                    <span>📍 ${property.distance}分鐘</span>
                </div>
            </div>
        `).join('');

        panel.classList.add('open');
    }

    closePropertyPanel() {
        document.getElementById('property-panel').classList.remove('open');
    }

    showPropertyPopup(propertyId) {
        const property = this.propertyData.find(p => p.id === propertyId);
        if (!property) return;

        const popup = document.getElementById('property-popup');
        popup.innerHTML = `
            <div class="popup-image">
                <img src="${property.images[0]}" alt="${property.title}">
            </div>
            <div class="popup-content">
                <h3 class="popup-title">${property.title}</h3>
                <div class="popup-price">NT$ ${property.price.toLocaleString()}</div>
                <div class="popup-details">
                    <span>🛏️ ${property.bedrooms}房</span>
                    <span>🚿 ${property.bathrooms}衛</span>
                    <span>📏 ${property.area}坪</span>
                </div>
                <p class="popup-description">${property.description}</p>
                <button class="popup-button" onclick="terraNarrativa.exploreProperty('${property.id}')">
                    深入了解
                </button>
            </div>
        `;

        // 定位彈窗到地圖中心
        const mapCenter = this.map.getCenter();
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.classList.add('show');
    }

    hidePropertyPopup() {
        document.getElementById('property-popup').classList.remove('show');
    }

    exploreProperty(propertyId) {
        // 模擬跳轉到房源詳情頁
        alert(`正在跳轉到房源 ${propertyId} 的詳情頁面...`);
    }

    updateLocationInfo() {
        const center = this.map.getCenter();
        const locationInfo = document.getElementById('location-info');
        const coordinates = document.getElementById('coordinates');

        // 這裡可以整合地理編碼 API 來獲取實際地址
        locationInfo.textContent = '台北市';
        coordinates.textContent = `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`;
    }

    locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.map.setView([latitude, longitude], 15);
                    this.showMessage('已定位到您的位置');
                },
                (error) => {
                    this.showMessage('無法獲取位置資訊', 'error');
                }
            );
        } else {
            this.showMessage('您的瀏覽器不支援地理定位', 'error');
        }
    }

    updateTimeline(year) {
        const yearDisplay = document.querySelector('.timeline-slider span:last-child');
        if (yearDisplay) {
            yearDisplay.textContent = year;
        }

        // 根據時間軸更新故事內容
        this.updateStoryContent(year);
    }

    updateStoryContent(year) {
        // 這裡可以根據年份動態更新故事內容
        console.log(`更新到 ${year} 年的故事內容`);
    }

    handleSearch(query) {
        if (query.length < 2) return;

        // 搜尋故事和房源
        const results = this.searchStories(query);
        this.displaySearchResults(results);
    }

    searchStories(query) {
        const results = [];

        Object.entries(this.storyData).forEach(([layer, items]) => {
            items.forEach(item => {
                if (item.name.includes(query) || item.content.includes(query)) {
                    results.push({ ...item, layer });
                }
            });
        });

        return results;
    }

    displaySearchResults(results) {
        // 在地圖上高亮顯示搜尋結果
        this.clearMarkers();

        results.forEach(item => {
            const marker = this.createStoryMarker(item, item.layer);
            this.activeMarkers.push(marker);
            marker.addTo(this.map);
        });

        if (results.length > 0) {
            this.showMessage(`找到 ${results.length} 個相關地點`);
        }
    }

    clearMarkers() {
        this.activeMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.activeMarkers = [];
    }

    showHelpModal() {
        document.getElementById('help-modal').classList.add('show');
    }

    hideHelpModal() {
        document.getElementById('help-modal').classList.remove('show');
    }

    showSettings() {
        this.showMessage('設定功能開發中...', 'info');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            this.isLoading = false;
        }, 500);
    }

    showWelcomeMessage() {
        this.showMessage('歡迎來到 美樂地產！開始探索台北的地理故事吧', 'success');
    }

    showMessage(message, type = 'info') {
        // 創建訊息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // 根據類型設定背景色
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        messageEl.style.background = colors[type] || colors.info;

        document.body.appendChild(messageEl);

        // 顯示動畫
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // 自動隱藏
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

// 全域變數
let terraNarrativa;

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    terraNarrativa = new TerraNarrativa();
});

// 鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        terraNarrativa.closeStoryPanel();
        terraNarrativa.closePropertyPanel();
        terraNarrativa.hidePropertyPopup();
        terraNarrativa.hideHelpModal();
    }
});

// 防止右鍵選單
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}); 