# 感知型房地產網站 UI/UX 設計指南

## 🎨 設計哲學

### 核心原則
1. **以對話為中心**：所有互動都圍繞自然對話展開
2. **個人化優先**：每個用戶看到的是為其量身定制的介面
3. **透明信任**：AI決策過程完全透明，建立用戶信任
4. **智慧預測**：主動預測用戶需求，減少認知負擔

## 🎯 視覺設計系統

### 色彩策略
```css
/* 主色調 - 專業信任 */
--primary-blue: #1E3A8A;
--primary-blue-light: #3B82F6;
--primary-blue-dark: #1E40AF;

/* 輔助色 - 中性平衡 */
--neutral-gray: #6B7280;
--neutral-gray-light: #9CA3AF;
--neutral-gray-dark: #374151;

/* 強調色 - 活力行動 */
--accent-orange: #F59E0B;
--accent-orange-light: #FBBF24;
--accent-orange-dark: #D97706;

/* 語義色彩 */
--success-green: #10B981;
--warning-red: #EF4444;
--info-blue: #3B82F6;
```

### 字體層級
```css
/* 標題系統 */
--font-size-h1: 2.5rem; /* 40px */
--font-size-h2: 2rem;   /* 32px */
--font-size-h3: 1.5rem; /* 24px */
--font-size-h4: 1.25rem; /* 20px */

/* 內文系統 */
--font-size-body-large: 1.125rem; /* 18px */
--font-size-body: 1rem;           /* 16px */
--font-size-body-small: 0.875rem; /* 14px */
--font-size-caption: 0.75rem;     /* 12px */

/* 字重 */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 間距系統
```css
/* 基礎間距單位 */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
--spacing-3xl: 4rem;    /* 64px */
```

## 🧩 核心組件設計

### 1. 對話核心組件 (Conversational Core)

#### AI助手對話框
```css
.conversation-core {
  background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.ai-message {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-area {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}

.voice-button {
  background: #F59E0B;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.text-input {
  flex: 1;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  backdrop-filter: blur(10px);
}
```

#### 語音輸入動畫
```css
.voice-animation {
  position: relative;
}

.voice-animation::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 2px solid #F59E0B;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}
```

### 2. 動態洞察模組 (Dynamic Insight Module)

#### 洞察卡片設計
```css
.insight-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.insight-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
}

.insight-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1E3A8A;
  margin-bottom: 0.5rem;
}

.insight-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.trend-up {
  color: #10B981;
}

.trend-down {
  color: #EF4444;
}
```

#### 數據視覺化組件
```css
.chart-container {
  background: #F9FAFB;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #34D399 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}
```

### 3. 策展式房源流 (Curated Property Stream)

#### 房源卡片設計
```css
.property-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #E5E7EB;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.property-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .property-image img {
  transform: scale(1.05);
}

.ai-recommendation {
  background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border-radius: 8px;
  margin: 1rem;
  position: relative;
}

.ai-recommendation::before {
  content: '🤖 AI推薦';
  font-weight: 600;
  margin-right: 0.5rem;
}

.property-info {
  padding: 1.5rem;
}

.property-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E3A8A;
  margin-bottom: 0.5rem;
}

.property-details {
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.property-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag {
  background: #F3F4F6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}
```

## 📱 響應式設計策略

### 斷點系統
```css
/* 移動優先設計 */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### 移動端適配
```css
/* 對話核心在移動端的表現 */
@media (max-width: 768px) {
  .conversation-core {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .input-area {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .voice-button {
    width: 56px;
    height: 56px;
  }
}

/* 洞察模組在移動端的網格 */
@media (max-width: 768px) {
  .insights-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* 房源卡片在移動端的佈局 */
@media (max-width: 768px) {
  .properties-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .property-card {
    margin: 0 1rem;
  }
}
```

## 🎭 互動設計模式

### 1. 微互動設計

#### 載入動畫
```css
.loading-skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

#### 按鈕狀態變化
```css
.primary-button {
  background: #1E3A8A;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.primary-button:hover {
  background: #1E40AF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
}

.primary-button:active {
  transform: translateY(0);
}

.primary-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.primary-button:hover::before {
  left: 100%;
}
```

### 2. 手勢支援

#### 滑動手勢
```css
.swipeable-card {
  touch-action: pan-y;
  user-select: none;
}

.swipe-indicator {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.swipe-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.3s ease;
}

.swipe-dot.active {
  background: white;
}
```

## 🎨 主題系統

### 深色模式支援
```css
/* 深色模式變數 */
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --border-color: #374151;
  --card-bg: #1F2937;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

/* 深色模式組件適配 */
[data-theme="dark"] .property-card {
  background: var(--card-bg);
  border-color: var(--border-color);
  color: var(--text-primary);
}

[data-theme="dark"] .insight-card {
  background: var(--card-bg);
  border-color: var(--border-color);
}
```

### 高對比模式
```css
/* 高對比模式 */
[data-contrast="high"] {
  --primary-blue: #000080;
  --accent-orange: #FF8C00;
  --success-green: #008000;
  --warning-red: #FF0000;
}

[data-contrast="high"] .primary-button {
  border: 2px solid currentColor;
}
```

## ♿ 可訪問性設計

### 鍵盤導航
```css
/* 焦點指示器 */
.focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* 跳過連結 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #1E3A8A;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### 螢幕閱讀器支援
```css
/* 語義化標籤 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ARIA 標籤 */
[aria-label] {
  position: relative;
}

[aria-label]::after {
  content: attr(aria-label);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #374151;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

[aria-label]:hover::after {
  opacity: 1;
}
```

## 📊 數據視覺化設計

### 圖表組件
```css
.chart-wrapper {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6B7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
```

### 進度指示器
```css
.progress-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #34D399 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-label {
  font-size: 0.875rem;
  color: #6B7280;
  min-width: 60px;
  text-align: right;
}
```

## 🎯 性能優化設計

### 懶載入設計
```css
.lazy-load {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.lazy-load.loaded {
  opacity: 1;
  transform: translateY(0);
}

/* 骨架屏 */
.skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### 圖片優化
```css
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 漸進式載入 */
.progressive-image {
  filter: blur(10px);
  transition: filter 0.3s ease;
}

.progressive-image.loaded {
  filter: blur(0);
}
```

這個設計指南提供了完整的UI/UX設計框架，確保感知型房地產網站能夠提供卓越的用戶體驗，同時保持視覺一致性和技術可行性。 