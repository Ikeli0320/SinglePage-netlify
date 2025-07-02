# Vibe-Centric Living UI/UX 設計架構

## 1. 設計哲學

### 1.1 核心設計原則
- **情感優先**: 每個互動都應該喚起情感回應
- **故事驅動**: 介面設計應該講述故事，而不只是展示資訊
- **探索導向**: 鼓勵使用者發現和探索，而非線性操作
- **社群感**: 讓使用者感受到與社群的連結

### 1.2 視覺語言
- **色彩系統**: 溫暖、自然的色調，反映不同社群氛圍
- **字體層級**: 清晰易讀的層級結構，支援故事敘事
- **圖像風格**: 真實、有溫度的攝影風格，避免過度修飾
- **動畫效果**: 流暢、自然的過渡，增強情感體驗

## 2. 設計系統 (Design System)

### 2.1 色彩系統
```scss
// 主要色彩
$primary-vibe: #2D5A27;      // 寧靜綠意
$secondary-vibe: #8B4513;    // 溫暖木質
$accent-vibe: #D4AF37;       // 活力金黃

// 氛圍色彩
$vibe-colors: (
  'creative': #9B59B6,       // 文創紫
  'lively': #E74C3C,         // 熱鬧紅
  'peaceful': #3498DB,       // 寧靜藍
  'natural': #27AE60,        // 自然綠
  'cozy': #E67E22,           // 溫馨橙
  'elegant': #34495E         // 優雅灰
);

// 中性色彩
$neutral-50: #FAFAFA;
$neutral-100: #F5F5F5;
$neutral-200: #EEEEEE;
$neutral-300: #E0E0E0;
$neutral-400: #BDBDBD;
$neutral-500: #9E9E9E;
$neutral-600: #757575;
$neutral-700: #616161;
$neutral-800: #424242;
$neutral-900: #212121;
```

### 2.2 字體系統
```scss
// 字體家族
$font-family-primary: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
$font-family-display: 'Noto Serif TC', Georgia, serif;
$font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

// 字體大小
$font-sizes: (
  'xs': 0.75rem,    // 12px
  'sm': 0.875rem,   // 14px
  'base': 1rem,     // 16px
  'lg': 1.125rem,   // 18px
  'xl': 1.25rem,    // 20px
  '2xl': 1.5rem,    // 24px
  '3xl': 1.875rem,  // 30px
  '4xl': 2.25rem,   // 36px
  '5xl': 3rem,      // 48px
  '6xl': 3.75rem    // 60px
);

// 行高
$line-heights: (
  'tight': 1.25,
  'normal': 1.5,
  'relaxed': 1.75
);
```

### 2.3 間距系統
```scss
$spacing: (
  'xs': 0.25rem,    // 4px
  'sm': 0.5rem,     // 8px
  'md': 1rem,       // 16px
  'lg': 1.5rem,     // 24px
  'xl': 2rem,       // 32px
  '2xl': 3rem,      // 48px
  '3xl': 4rem,      // 64px
  '4xl': 6rem,      // 96px
  '5xl': 8rem       // 128px
);
```

### 2.4 陰影系統
```scss
$shadows: (
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  'vibe': '0 25px 50px -12px rgba(45, 90, 39, 0.25)'  // 特殊氛圍陰影
);
```

## 3. 組件庫 (Component Library)

### 3.1 基礎組件

#### 3.1.1 按鈕組件
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'vibe' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  emotion?: string;  // 情感標籤
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  emotion,
  children,
  onClick
}) => {
  // 根據情感標籤動態調整樣式
  const getVibeStyle = (emotion: string) => {
    const vibeStyles = {
      'peaceful': 'bg-blue-500 hover:bg-blue-600',
      'lively': 'bg-red-500 hover:bg-red-600',
      'creative': 'bg-purple-500 hover:bg-purple-600',
      'natural': 'bg-green-500 hover:bg-green-600'
    };
    return vibeStyles[emotion] || '';
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${getVibeStyle(emotion)}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### 3.1.2 卡片組件
```typescript
// components/ui/Card.tsx
interface CardProps {
  type: 'community' | 'story' | 'property' | 'vibe';
  title: string;
  description?: string;
  image?: string;
  emotion?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  type,
  title,
  description,
  image,
  emotion,
  children
}) => {
  return (
    <div className={`card card-${type} ${emotion ? `vibe-${emotion}` : ''}`}>
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
        {children}
      </div>
    </div>
  );
};
```

### 3.2 氛圍組件

#### 3.2.1 情感標籤雲
```typescript
// components/vibe/EmotionTagCloud.tsx
interface EmotionTag {
  id: string;
  name: string;
  category: 'emotion' | 'lifestyle' | 'environment';
  weight: number;
  color: string;
}

interface EmotionTagCloudProps {
  tags: EmotionTag[];
  onTagClick: (tag: EmotionTag) => void;
  selectedTags: string[];
}

const EmotionTagCloud: React.FC<EmotionTagCloudProps> = ({
  tags,
  onTagClick,
  selectedTags
}) => {
  return (
    <div className="emotion-tag-cloud">
      {tags.map(tag => (
        <button
          key={tag.id}
          className={`emotion-tag ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
          style={{
            fontSize: `${Math.max(0.8, tag.weight) * 1.2}rem`,
            color: tag.color,
            opacity: selectedTags.includes(tag.id) ? 1 : 0.7
          }}
          onClick={() => onTagClick(tag)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};
```

#### 3.2.2 氛圍搜尋欄
```typescript
// components/vibe/VibeSearchBar.tsx
interface VibeSearchBarProps {
  onSearch: (query: VibeSearchQuery) => void;
  suggestions: string[];
}

const VibeSearchBar: React.FC<VibeSearchBarProps> = ({
  onSearch,
  suggestions
}) => {
  const [emotion, setEmotion] = useState('');
  const [lifestyle, setLifestyle] = useState('');

  return (
    <div className="vibe-search-bar">
      <div className="search-inputs">
        <div className="input-group">
          <label>我想尋找一個感覺</label>
          <input
            type="text"
            placeholder="寧靜清幽、文創藝術、熱鬧繁華..."
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>且適合</label>
          <input
            type="text"
            placeholder="遛狗散步、深夜食堂、週末登山..."
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value)}
          />
        </div>
      </div>
      <button
        className="search-button"
        onClick={() => onSearch({ emotion, lifestyle })}
      >
        探索我的理想生活
      </button>
    </div>
  );
};
```

### 3.3 地圖組件

#### 3.3.1 互動式故事地圖
```typescript
// components/map/StoryMap.tsx
interface StoryMapProps {
  center: [number, number];
  zoom: number;
  layers: MapLayer[];
  onLayerChange: (layer: MapLayer) => void;
  onPOIClick: (poi: POI) => void;
}

const StoryMap: React.FC<StoryMapProps> = ({
  center,
  zoom,
  layers,
  onLayerChange,
  onPOIClick
}) => {
  return (
    <div className="story-map">
      <div className="map-container">
        <Map
          center={center}
          zoom={zoom}
          style={{ width: '100%', height: '100%' }}
        >
          {layers.map(layer => (
            <Layer
              key={layer.id}
              type={layer.type}
              data={layer.data}
              visible={layer.visible}
              onClick={onPOIClick}
            />
          ))}
        </Map>
      </div>
      <div className="layer-controls">
        {layers.map(layer => (
          <button
            key={layer.id}
            className={`layer-toggle ${layer.visible ? 'active' : ''}`}
            onClick={() => onLayerChange(layer)}
          >
            {layer.name}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## 4. 頁面設計

### 4.1 首頁設計
```typescript
// pages/index.tsx
const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* 英雄區域 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            找到屬於你的
            <span className="highlight">生活氛圍</span>
          </h1>
          <p className="hero-subtitle">
            透過情感和生活方式，探索最適合你的社區
          </p>
          <VibeSearchBar onSearch={handleSearch} suggestions={suggestions} />
        </div>
        <div className="hero-visual">
          <EmotionTagCloud tags={featuredTags} onTagClick={handleTagClick} />
        </div>
      </section>

      {/* 社群故事輪播 */}
      <section className="community-stories">
        <h2>探索社群故事</h2>
        <StoryCarousel stories={featuredStories} />
      </section>

      {/* 氛圍地圖預覽 */}
      <section className="vibe-map-preview">
        <h2>感受城市脈動</h2>
        <StoryMap
          center={[25.0330, 121.5654]} // 台北市中心
          zoom={12}
          layers={previewLayers}
          onLayerChange={handleLayerChange}
          onPOIClick={handlePOIClick}
        />
      </section>
    </div>
  );
};
```

### 4.2 社群詳情頁
```typescript
// pages/communities/[id].tsx
const CommunityDetailPage: React.FC = () => {
  return (
    <div className="community-detail-page">
      {/* 社群概覽 */}
      <section className="community-hero">
        <div className="community-info">
          <h1>{community.name}</h1>
          <div className="vibe-tags">
            {community.vibeTags.map(tag => (
              <span key={tag.id} className="vibe-tag">{tag.name}</span>
            ))}
          </div>
          <p className="community-description">{community.description}</p>
        </div>
        <div className="community-stats">
          <div className="stat">
            <span className="stat-value">{community.propertyCount}</span>
            <span className="stat-label">可售物件</span>
          </div>
          <div className="stat">
            <span className="stat-value">{community.vibeScore}</span>
            <span className="stat-label">氛圍評分</span>
          </div>
        </div>
      </section>

      {/* 社群故事 */}
      <section className="community-stories">
        <h2>社群故事</h2>
        <div className="stories-grid">
          {community.stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* 在地商家 */}
      <section className="local-businesses">
        <h2>在地商家</h2>
        <BusinessCarousel businesses={community.businesses} />
      </section>

      {/* 房產列表 */}
      <section className="properties">
        <h2>推薦房產</h2>
        <PropertyGrid properties={community.properties} />
      </section>
    </div>
  );
};
```

## 5. 響應式設計

### 5.1 斷點系統
```scss
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

// 響應式混入
@mixin responsive($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

### 5.2 移動端優化
```scss
// 移動端特殊樣式
.mobile-optimized {
  @media (max-width: 768px) {
    .vibe-search-bar {
      flex-direction: column;
      gap: 1rem;
    }
    
    .emotion-tag-cloud {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    
    .story-map {
      height: 300px;
    }
  }
}
```

## 6. 動畫與互動

### 6.1 微互動
```scss
// 按鈕懸停效果
.btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}

// 卡片懸停效果
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: $shadow-vibe;
  }
}

// 情感標籤動畫
.emotion-tag {
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }
  
  &.selected {
    animation: pulse 2s infinite;
  }
}
```

### 6.2 頁面轉場
```typescript
// 使用 Framer Motion 實現流暢轉場
import { motion, AnimatePresence } from 'framer-motion';

const PageTransition: React.FC = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

## 7. 無障礙設計

### 7.1 可訪問性標準
- **WCAG 2.1 AA 級別** 合規
- **鍵盤導航** 支援
- **螢幕閱讀器** 優化
- **色彩對比度** 符合標準
- **焦點指示器** 清晰可見

### 7.2 無障礙組件
```typescript
// 無障礙按鈕組件
const AccessibleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
```

## 8. 效能優化

### 8.1 圖片優化
```typescript
// 響應式圖片組件
const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  sizes,
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      sizes={sizes}
      {...props}
    />
  );
};
```

### 8.2 程式碼分割
```typescript
// 動態載入組件
const LazyStoryMap = lazy(() => import('../components/map/StoryMap'));
const LazyVibeSearch = lazy(() => import('../components/vibe/VibeSearchBar'));

// 使用 Suspense 包裝
<Suspense fallback={<LoadingSpinner />}>
  <LazyStoryMap />
</Suspense>
```

這個UI/UX設計架構完全體現了「情感化探索」、「社群即內容」、「地圖即故事」的設計理念，為使用者提供一個溫暖、有故事性且易於探索的房地產平台體驗。 