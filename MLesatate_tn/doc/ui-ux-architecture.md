# Terra Narrativa UI/UX 設計架構

## 1. 設計哲學

### 1.1 核心理念
「地圖即介面，探索即搜尋」的設計哲學，將傳統的搜尋導向介面轉變為故事導向的探索體驗。

### 1.2 設計原則
- **沉浸式體驗**：全螢幕地圖作為主要介面，減少 UI 元素的干擾
- **直觀互動**：基於地理空間的自然互動方式
- **故事驅動**：每個 UI 元素都服務於講述地理故事
- **漸進式披露**：資訊按需呈現，避免認知負載過重

## 2. 視覺設計系統

### 2.1 色彩系統
```css
/* 主要色彩調色板 */
:root {
  /* 基礎色彩 */
  --primary-earth: #8B4513;      /* 大地色 - 代表地理故事 */
  --primary-sky: #87CEEB;        /* 天空藍 - 代表探索與自由 */
  --primary-forest: #228B22;     /* 森林綠 - 代表生命力 */
  
  /* 圖層色彩 */
  --layer-historical: #D2691E;   /* 歷史圖層 - 復古橙 */
  --layer-lifestyle: #FF69B4;    /* 生活圖層 - 活力粉 */
  --layer-utility: #4169E1;      /* 機能圖層 - 實用藍 */
  --layer-future: #9370DB;       /* 未來圖層 - 神秘紫 */
  
  /* 中性色彩 */
  --neutral-white: #FFFFFF;
  --neutral-light: #F5F5F5;
  --neutral-medium: #CCCCCC;
  --neutral-dark: #333333;
  
  /* 語義色彩 */
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;
  --info: #2196F3;
}
```

### 2.2 字體系統
```css
/* 字體階層 */
:root {
  /* 主要字體 */
  --font-primary: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Noto Serif TC', Georgia, serif;
  
  /* 字體大小 */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* 字體權重 */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 2.3 間距系統
```css
/* 8px 基礎間距系統 */
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

## 3. 組件設計系統

### 3.1 地圖組件 (Map Components)

#### 3.1.1 互動式地圖容器
```typescript
// InteractiveMap.tsx
interface InteractiveMapProps {
  className?: string;
  children?: React.ReactNode;
  onViewportChange?: (viewport: Viewport) => void;
  onLayerToggle?: (layer: StoryLayer) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  className = '',
  children,
  onViewportChange,
  onLayerToggle
}) => {
  return (
    <div 
      className={`
        relative w-full h-screen
        bg-gradient-to-br from-sky-50 to-earth-50
        overflow-hidden
        ${className}
      `}
    >
      {/* 地圖容器 */}
      <div id="map-container" className="absolute inset-0" />
      
      {/* 覆蓋層組件 */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
      
      {/* 地圖控制項 */}
      <MapControls 
        className="absolute top-4 right-4 pointer-events-auto"
        onViewportChange={onViewportChange}
      />
    </div>
  );
};
```

#### 3.1.2 圖層切換器
```typescript
// LayerToggle.tsx
interface LayerToggleProps {
  activeLayers: StoryLayer[];
  onLayerToggle: (layer: StoryLayer) => void;
  className?: string;
}

const LayerToggle: React.FC<LayerToggleProps> = ({
  activeLayers,
  onLayerToggle,
  className = ''
}) => {
  const layers = [
    { id: 'historical', name: '歷史', icon: '🏛️', color: 'var(--layer-historical)' },
    { id: 'lifestyle', name: '生活', icon: '☕', color: 'var(--layer-lifestyle)' },
    { id: 'utility', name: '機能', icon: '🏥', color: 'var(--layer-utility)' },
    { id: 'future', name: '未來', icon: '🔮', color: 'var(--layer-future)' }
  ];

  return (
    <div className={`
      absolute top-4 left-4 
      bg-white/90 backdrop-blur-sm
      rounded-xl shadow-lg
      p-2 pointer-events-auto
      ${className}
    `}>
      <div className="flex flex-col gap-2">
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => onLayerToggle(layer as StoryLayer)}
            className={`
              flex items-center gap-3 px-4 py-3
              rounded-lg transition-all duration-200
              ${activeLayers.includes(layer as StoryLayer)
                ? 'bg-opacity-20 shadow-md'
                : 'hover:bg-gray-50'
              }
            `}
            style={{
              backgroundColor: activeLayers.includes(layer as StoryLayer) 
                ? layer.color 
                : 'transparent'
            }}
          >
            <span className="text-xl">{layer.icon}</span>
            <span className="font-medium text-gray-700">{layer.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 3.2 故事組件 (Story Components)

#### 3.2.1 敘事面板
```typescript
// StoryPanel.tsx
interface StoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  narrative: Narrative;
  className?: string;
}

const StoryPanel: React.FC<StoryPanelProps> = ({
  isOpen,
  onClose,
  narrative,
  className = ''
}) => {
  return (
    <div className={`
      fixed inset-y-0 right-0 w-96
      bg-white shadow-2xl
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      ${className}
    `}>
      {/* 標題欄 */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {narrative.title}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* 內容區域 */}
      <div className="p-6 overflow-y-auto h-full">
        <div className="space-y-6">
          {/* 時間軸 */}
          <TimelineSlider 
            timeline={narrative.timeline}
            onTimeChange={(time) => console.log('Time changed:', time)}
          />
          
          {/* 敘事內容 */}
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: narrative.content }} />
          </div>
          
          {/* 相關地點 */}
          <RelatedPlaces places={narrative.relatedPlaces} />
        </div>
      </div>
    </div>
  );
};
```

#### 3.2.2 時間軸控制
```typescript
// TimelineSlider.tsx
interface TimelineSliderProps {
  timeline: TimelineEvent[];
  onTimeChange: (time: number) => void;
  className?: string;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  timeline,
  onTimeChange,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(2024);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">時間軸</span>
        <span className="text-lg font-bold text-gray-800">{currentTime}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1900"
          max="2030"
          value={currentTime}
          onChange={(e) => {
            const time = parseInt(e.target.value);
            setCurrentTime(time);
            onTimeChange(time);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        {/* 時間標記 */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>1900</span>
          <span>1950</span>
          <span>2000</span>
          <span>2030</span>
        </div>
      </div>
      
      {/* 當前時間點的事件 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">當時發生的事</h4>
        <p className="text-sm text-blue-700">
          {timeline.find(event => event.year === currentTime)?.description || '無相關事件'}
        </p>
      </div>
    </div>
  );
};
```

### 3.3 房源組件 (Property Components)

#### 3.3.1 湧現式房源彈窗
```typescript
// PropertyPopup.tsx
interface PropertyPopupProps {
  property: Property;
  isVisible: boolean;
  onClose: () => void;
  onInterest: () => void;
  className?: string;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({
  property,
  isVisible,
  onClose,
  onInterest,
  className = ''
}) => {
  if (!isVisible) return null;
  
  return (
    <div className={`
      absolute bg-white rounded-xl shadow-xl
      border border-gray-200
      w-80 pointer-events-auto
      transform transition-all duration-200
      ${className}
    `}>
      {/* 圖片區域 */}
      <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-white/80 rounded-full"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* 內容區域 */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-800 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-earth">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {property.area}坪
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>🛏️ {property.bedrooms}房</span>
          <span>🚿 {property.bathrooms}衛</span>
          <span>📍 {property.distance}分鐘</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {property.description}
        </p>
        
        <button
          onClick={onInterest}
          className="w-full bg-primary-earth text-white py-2 px-4 rounded-lg
                     hover:bg-primary-earth/90 transition-colors"
        >
          深入了解
        </button>
      </div>
    </div>
  );
};
```

## 4. 響應式設計

### 4.1 斷點系統
```css
/* Tailwind CSS 斷點 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 4.2 移動端適配
```typescript
// MobileMapView.tsx
const MobileMapView: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* 地圖區域 */}
      <div className="flex-1 relative">
        <InteractiveMap />
      </div>
      
      {/* 底部控制面板 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <LayerToggle />
          <SearchButton />
          <MenuButton />
        </div>
      </div>
    </div>
  );
};
```

## 5. 動畫與過渡

### 5.1 湧現動畫
```css
/* 房源湧現動畫 */
@keyframes emerge {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.property-emerge {
  animation: emerge 0.3s ease-out;
}

/* 圖層切換動畫 */
.layer-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.layer-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 5.2 微互動
```typescript
// 懸停效果
const hoverEffects = {
  'hover:scale-105': 'transform scale-105 transition-transform',
  'hover:shadow-lg': 'shadow-lg transition-shadow',
  'hover:bg-opacity-80': 'bg-opacity-80 transition-all'
};

// 點擊反饋
const clickFeedback = {
  'active:scale-95': 'transform scale-95 transition-transform',
  'focus:ring-2': 'ring-2 ring-primary-earth ring-opacity-50'
};
```

## 6. 無障礙設計

### 6.1 鍵盤導航
```typescript
// 鍵盤可訪問的地圖控制
const KeyboardAccessibleMap: React.FC = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        // 向上平移地圖
        break;
      case 'ArrowDown':
        // 向下平移地圖
        break;
      case 'ArrowLeft':
        // 向左平移地圖
        break;
      case 'ArrowRight':
        // 向右平移地圖
        break;
      case '+':
        // 放大
        break;
      case '-':
        // 縮小
        break;
    }
  };
  
  return (
    <div 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="互動式地圖"
    >
      {/* 地圖內容 */}
    </div>
  );
};
```

### 6.2 螢幕閱讀器支援
```typescript
// 語義化標籤
const SemanticMap: React.FC = () => {
  return (
    <main role="main" aria-label="房地產探索平台">
      <section aria-label="地圖區域">
        <InteractiveMap />
      </section>
      
      <aside aria-label="故事面板">
        <StoryPanel />
      </aside>
      
      <nav aria-label="圖層控制">
        <LayerToggle />
      </nav>
    </main>
  );
};
```

## 7. 效能優化

### 7.1 虛擬化渲染
```typescript
// 虛擬化房源列表
const VirtualizedPropertyList: React.FC<{properties: Property[]}> = ({
  properties
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  const visibleProperties = properties.slice(
    visibleRange.start, 
    visibleRange.end
  );
  
  return (
    <div className="space-y-2">
      {visibleProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
```

### 7.2 懶加載
```typescript
// 圖片懶加載
const LazyImage: React.FC<{src: string; alt: string}> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting)
    );
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      src={isInView ? src : ''}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      onLoad={() => setIsLoaded(true)}
    />
  );
};
```

## 8. 設計系統文檔

### 8.1 組件庫結構
```
design-system/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Icon/
│   ├── molecules/
│   │   ├── PropertyCard/
│   │   ├── LayerToggle/
│   │   └── TimelineSlider/
│   └── organisms/
│       ├── InteractiveMap/
│       ├── StoryPanel/
│       └── PropertyPopup/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── stories/
    ├── Map.stories.tsx
    ├── Story.stories.tsx
    └── Property.stories.tsx
```

### 8.2 設計標記
```typescript
// 設計標記系統
interface DesignToken {
  name: string;
  value: string | number;
  category: 'color' | 'typography' | 'spacing' | 'animation';
  description?: string;
}

const designTokens: DesignToken[] = [
  {
    name: 'primary-earth',
    value: '#8B4513',
    category: 'color',
    description: '代表地理故事的大地色'
  },
  // ... 更多標記
];
```

這個 UI/UX 設計架構確保了 Terra Narrativa 平台能夠提供直觀、美觀且功能強大的使用者體驗，同時保持設計的一致性和可維護性。 