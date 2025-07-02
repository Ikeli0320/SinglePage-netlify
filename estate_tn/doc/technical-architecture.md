# 美樂地產 技術架構設計

## 1. 系統概覽

### 1.1 架構目標
基於「地理故事導向」的核心理念，建立一個以地圖為中心、AI驅動的房地產探索平台。系統將實現三大核心支柱：
- **地圖即介面**：全螢幕互動式地圖作為主要介面
- **分層式敘事**：多層次故事圖層的動態切換
- **湧現式發現**：基於上下文的智慧房源推薦

### 1.2 技術棧選擇
- **前端**：React + TypeScript + Leaflet.js (OpenStreetMap)
- **後端**：Node.js + Express + TypeScript
- **資料庫**：PostgreSQL + PostGIS (空間資料)
- **AI/ML**：Python + TensorFlow/PyTorch
- **快取**：Redis
- **搜尋引擎**：Elasticsearch
- **雲端服務**：AWS/Azure
- **地圖服務**：OpenStreetMap + Leaflet.js

## 2. 前端架構

### 2.1 核心組件結構
```
src/
├── components/
│   ├── Map/
│   │   ├── InteractiveMap.tsx          # 主要地圖組件
│   │   ├── MapControls.tsx             # 地圖控制項
│   │   └── MapLayers/
│   │       ├── HistoricalLayer.tsx     # 歷史圖層
│   │       ├── LifestyleLayer.tsx      # 生活圖層
│   │       ├── UtilityLayer.tsx        # 機能圖層
│   │       └── FutureLayer.tsx         # 未來圖層
│   ├── Story/
│   │   ├── StoryPanel.tsx              # 故事面板
│   │   ├── TimelineSlider.tsx          # 時間軸控制
│   │   └── NarrativeCard.tsx           # 敘事卡片
│   ├── Property/
│   │   ├── PropertyPopup.tsx           # 房源彈出視窗
│   │   ├── PropertyCard.tsx            # 房源卡片
│   │   └── PropertyDetail.tsx          # 房源詳情
│   └── UI/
│       ├── LayerToggle.tsx             # 圖層切換器
│       ├── SearchBar.tsx               # 搜尋欄（次要）
│       └── Navigation.tsx              # 導航組件
├── hooks/
│   ├── useMapInteraction.ts            # 地圖互動邏輯
│   ├── useStoryLayers.ts               # 故事圖層管理
│   └── usePropertyDiscovery.ts         # 房源發現邏輯
├── services/
│   ├── mapService.ts                   # 地圖服務
│   ├── storyService.ts                 # 故事資料服務
│   └── propertyService.ts              # 房源服務
└── types/
    ├── map.types.ts                    # 地圖相關類型
    ├── story.types.ts                  # 故事相關類型
    └── property.types.ts               # 房源相關類型
```

### 2.2 地圖即介面實現
```typescript
// InteractiveMap.tsx 核心架構
interface InteractiveMapProps {
  initialViewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  activeLayers: StoryLayer[];
  onPropertyDiscover: (properties: Property[]) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialViewport,
  onViewportChange,
  activeLayers,
  onPropertyDiscover
}) => {
  const mapRef = useRef<L.Map>();
  const [currentViewport, setCurrentViewport] = useState(initialViewport);
  
  // 地圖初始化
  useEffect(() => {
    mapRef.current = L.map('map-container').setView(
      [initialViewport.latitude, initialViewport.longitude], 
      initialViewport.zoom
    );
    
    // 添加 OpenStreetMap 圖層
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapRef.current);
    
    // 註冊互動事件
    setupMapInteractions();
  }, []);
  
  // 圖層管理
  useEffect(() => {
    updateActiveLayers(activeLayers);
  }, [activeLayers]);
  
  return (
    <div id="map-container" className="fullscreen-map">
      <MapControls />
      <LayerToggle layers={activeLayers} />
    </div>
  );
};
```

## 3. 後端架構

### 3.1 API 設計
```
/api/
├── map/
│   ├── GET /viewport                    # 獲取當前視窗資料
│   ├── POST /viewport/update           # 更新視窗狀態
│   └── GET /layers/:layerId/data       # 獲取圖層資料
├── story/
│   ├── GET /narratives/:locationId     # 獲取地點敘事
│   ├── GET /timeline/:locationId       # 獲取時間軸資料
│   └── POST /narratives/generate       # AI生成敘事
├── property/
│   ├── GET /discover                   # 湧現式房源發現
│   ├── GET /:propertyId                # 房源詳情
│   └── POST /:propertyId/interest      # 表達興趣
└── ai/
    ├── POST /analyze/context           # 上下文分析
    ├── POST /predict/future            # 未來預測
    └── POST /recommend/properties      # 智慧推薦
```

### 3.2 資料庫設計
```sql
-- 空間資料表
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    geometry GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 故事圖層表
CREATE TABLE story_layers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- historical, lifestyle, utility, future
    data JSONB NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 房源表
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    geometry GEOMETRY(POINT, 4326) NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 使用者互動記錄
CREATE TABLE user_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_id VARCHAR(255),
    interaction_type VARCHAR(50), -- view, click, explore
    location_id INTEGER REFERENCES locations(id),
    layer_id INTEGER REFERENCES story_layers(id),
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## 4. AI/ML 架構

### 4.1 分層式敘事 AI 系統
```python
# story_ai/models.py
class NarrativeGenerator:
    def __init__(self):
        self.historical_model = HistoricalNarrativeModel()
        self.lifestyle_model = LifestyleAnalysisModel()
        self.future_model = FuturePredictionModel()
    
    def generate_historical_narrative(self, location_data):
        """生成歷史敘事"""
        return self.historical_model.generate(location_data)
    
    def analyze_lifestyle(self, poi_data, reviews):
        """分析生活氛圍"""
        return self.lifestyle_model.analyze(poi_data, reviews)
    
    def predict_future_development(self, urban_planning_data):
        """預測未來發展"""
        return self.future_model.predict(urban_planning_data)

# story_ai/layers/
class HistoricalLayer:
    def __init__(self):
        self.ocr_model = OCRModel()  # 歷史文件辨識
        self.image_analysis = ImageAnalysisModel()  # 歷史照片分析
    
    def process_historical_data(self, documents, images):
        """處理歷史資料"""
        text_data = self.ocr_model.extract_text(documents)
        visual_data = self.image_analysis.analyze(images)
        return self.synthesize_narrative(text_data, visual_data)

class FutureLayer:
    def __ent__(self):
        self.urban_planning_analyzer = UrbanPlanningAnalyzer()
        self.market_predictor = MarketPredictor()
        self.gentrification_detector = GentrificationDetector()
    
    def predict_development(self, location):
        """預測區域發展"""
        urban_plans = self.urban_planning_analyzer.get_plans(location)
        market_trends = self.market_predictor.predict(location)
        gentrification_risk = self.gentrification_detector.assess(location)
        
        return {
            'new_infrastructure': urban_plans,
            'price_potential': market_trends,
            'gentrification_risk': gentrification_risk
        }
```

### 4.2 湧現式發現推薦系統
```python
# recommendation/context_aware_recommender.py
class ContextAwareRecommender:
    def __init__(self):
        self.user_behavior_analyzer = UserBehaviorAnalyzer()
        self.context_analyzer = ContextAnalyzer()
        self.property_matcher = PropertyMatcher()
    
    def discover_properties(self, user_context, current_layer, location):
        """基於上下文的房源發現"""
        # 分析使用者行為模式
        user_preferences = self.user_behavior_analyzer.analyze(user_context)
        
        # 分析當前探索上下文
        layer_context = self.context_analyzer.analyze_layer(current_layer, location)
        
        # 匹配最相關的房源
        relevant_properties = self.property_matcher.find_matches(
            user_preferences, layer_context, location
        )
        
        return self.rank_by_relevance(relevant_properties, user_context)

# recommendation/models/
class UserBehaviorAnalyzer:
    def analyze(self, user_context):
        """分析使用者行為模式"""
        return {
            'exploration_pattern': self.extract_exploration_pattern(user_context),
            'interest_areas': self.identify_interest_areas(user_context),
            'interaction_style': self.analyze_interaction_style(user_context)
        }

class ContextAnalyzer:
    def analyze_layer(self, layer_type, location):
        """分析圖層上下文"""
        if layer_type == 'historical':
            return self.analyze_historical_context(location)
        elif layer_type == 'lifestyle':
            return self.analyze_lifestyle_context(location)
        elif layer_type == 'utility':
            return self.analyze_utility_context(location)
        elif layer_type == 'future':
            return self.analyze_future_context(location)
```

## 5. 資料流程架構

### 5.1 即時資料處理流程
```
使用者互動 → 前端事件 → API Gateway → 微服務 → 資料庫
                ↓
            快取層 (Redis)
                ↓
            AI 分析服務
                ↓
            推薦引擎
                ↓
            前端更新
```

### 5.2 資料聚合管道
```python
# data_pipeline/aggregator.py
class DataAggregator:
    def __init__(self):
        self.gis_processor = GISDataProcessor()
        self.text_processor = TextDataProcessor()
        self.image_processor = ImageDataProcessor()
    
    def aggregate_location_data(self, location_id):
        """聚合地點相關的所有資料"""
        # 空間資料
        spatial_data = self.gis_processor.get_spatial_data(location_id)
        
        # 文字資料（新聞、評論、歷史文獻）
        text_data = self.text_processor.get_text_data(location_id)
        
        # 圖像資料（歷史照片、衛星圖）
        image_data = self.image_processor.get_image_data(location_id)
        
        # 整合並標準化
        return self.integrate_data(spatial_data, text_data, image_data)
```

## 6. 效能優化架構

### 6.1 前端效能優化
- **虛擬化渲染**：只渲染視窗內可見的地圖元素
- **懶加載**：按需載入圖層資料
- **快取策略**：本地快取常用資料
- **Web Workers**：背景處理複雜計算

### 6.2 後端效能優化
- **CDN**：靜態資源分發
- **資料庫索引**：空間索引優化地理查詢
- **快取層**：Redis 快取熱門資料
- **負載平衡**：微服務架構分散負載

## 7. 部署架構

### 7.1 容器化部署
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://api:8000
      - REACT_APP_MAPBOX_TOKEN=${MAPBOX_TOKEN}
  
  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - OPENSTREETMAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    depends_on:
      - postgres
      - redis
  
  ai-service:
    build: ./ai-service
    ports:
      - "8001:8001"
    environment:
      - MODEL_PATH=/models
    volumes:
      - ./models:/models
  
  postgres:
    image: postgis/postgis:13-3.1
    environment:
      - POSTGRES_DB=terranarrativa
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
```

### 7.2 雲端部署
- **AWS/Azure**：雲端基礎設施
- **Kubernetes**：容器編排
- **CI/CD**：自動化部署流程
- **監控**：APM 和日誌管理

## 8. 安全性架構

### 8.1 資料安全
- **加密傳輸**：HTTPS/TLS
- **資料加密**：敏感資料加密儲存
- **存取控制**：RBAC 權限管理
- **API 安全**：JWT 認證

### 8.2 隱私保護
- **GDPR 合規**：使用者資料保護
- **匿名化**：個人資料匿名處理
- **同意管理**：使用者同意追蹤

## 9. 擴展性設計

### 9.1 水平擴展
- **微服務架構**：服務獨立擴展
- **資料庫分片**：地理分片策略
- **CDN 分發**：全球內容分發

### 9.2 功能擴展
- **插件系統**：第三方圖層支援
- **API 開放**：開發者平台
- **多語言支援**：國際化架構

這個技術架構將 Terra Narrativa 的設計理念轉化為可實現的技術方案，確保系統能夠支援「地理故事導向」的創新使用者體驗。 