# OpenStreetMap 整合指南

## 1. 概述

本文件詳細說明如何在 Terra Narrativa 平台中整合 OpenStreetMap，提供免費且可自訂的地圖服務。

### 1.1 為什麼選擇 OpenStreetMap
- **免費使用**：無需付費授權費用
- **開源開放**：可自由修改和自訂
- **全球覆蓋**：完整的全球地圖資料
- **社群驅動**：持續更新的地圖資料
- **無使用限制**：無 API 呼叫次數限制

### 1.2 技術優勢
- **Leaflet.js 整合**：輕量級且易於使用
- **自訂樣式**：可透過 CSS 和自訂圖層調整外觀
- **效能優化**：支援瓦片快取和延遲載入
- **擴展性**：可整合多種地圖服務

## 2. 技術實現

### 2.1 基礎設置

#### 2.1.1 安裝依賴
```bash
# 安裝 Leaflet.js
npm install leaflet @types/leaflet

# 安裝 React Leaflet (可選)
npm install react-leaflet
```

#### 2.1.2 CSS 引入
```html
<!-- 在 HTML 中引入 Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

### 2.2 地圖初始化

#### 2.2.1 基本地圖設置
```typescript
// MapInitializer.ts
import L from 'leaflet';

export class MapInitializer {
  private map: L.Map | null = null;
  
  initializeMap(containerId: string, options: MapOptions): L.Map {
    this.map = L.map(containerId, {
      center: [25.0330, 121.5654], // 台北市中心
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
      ...options
    });
    
    // 添加 OpenStreetMap 基礎圖層
    this.addBaseLayer();
    
    return this.map;
  }
  
  private addBaseLayer(): void {
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    });
    
    osmLayer.addTo(this.map!);
  }
}
```

#### 2.2.2 React 組件整合
```typescript
// InteractiveMap.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapInitializer } from './MapInitializer';

interface InteractiveMapProps {
  className?: string;
  onMapReady?: (map: L.Map) => void;
  onViewportChange?: (viewport: Viewport) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  className = '',
  onMapReady,
  onViewportChange
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      const initializer = new MapInitializer();
      mapRef.current = initializer.initializeMap('map-container', {
        center: [25.0330, 121.5654],
        zoom: 13
      });
      
      // 註冊事件監聽器
      setupMapEvents();
      
      if (onMapReady) {
        onMapReady(mapRef.current);
      }
    }
  }, []);
  
  const setupMapEvents = () => {
    if (!mapRef.current) return;
    
    mapRef.current.on('moveend', () => {
      const center = mapRef.current!.getCenter();
      const zoom = mapRef.current!.getZoom();
      
      if (onViewportChange) {
        onViewportChange({
          latitude: center.lat,
          longitude: center.lng,
          zoom: zoom
        });
      }
    });
  };
  
  return (
    <div className={`relative w-full h-screen ${className}`}>
      <div 
        ref={containerRef}
        id="map-container" 
        className="absolute inset-0"
      />
      
      {/* OpenStreetMap 版權資訊 */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  );
};

export default InteractiveMap;
```

### 2.3 自訂圖層實現

#### 2.3.1 故事圖層管理
```typescript
// StoryLayerManager.ts
import L from 'leaflet';

export class StoryLayerManager {
  private map: L.Map;
  private layers: Map<string, L.Layer> = new Map();
  
  constructor(map: L.Map) {
    this.map = map;
  }
  
  // 歷史圖層
  addHistoricalLayer(): void {
    const historicalLayer = L.layerGroup();
    
    // 添加歷史標記
    const historicalMarkers = this.createHistoricalMarkers();
    historicalMarkers.forEach(marker => {
      historicalLayer.addLayer(marker);
    });
    
    this.layers.set('historical', historicalLayer);
    historicalLayer.addTo(this.map);
  }
  
  // 生活圖層
  addLifestyleLayer(): void {
    const lifestyleLayer = L.layerGroup();
    
    // 添加生活機能標記
    const lifestyleMarkers = this.createLifestyleMarkers();
    lifestyleMarkers.forEach(marker => {
      lifestyleLayer.addLayer(marker);
    });
    
    this.layers.set('lifestyle', lifestyleLayer);
    lifestyleLayer.addTo(this.map);
  }
  
  // 未來圖層
  addFutureLayer(): void {
    const futureLayer = L.layerGroup();
    
    // 添加未來發展預測
    const futurePredictions = this.createFuturePredictions();
    futurePredictions.forEach(prediction => {
      futureLayer.addLayer(prediction);
    });
    
    this.layers.set('future', futureLayer);
    futureLayer.addTo(this.map);
  }
  
  // 切換圖層
  toggleLayer(layerName: string, visible: boolean): void {
    const layer = this.layers.get(layerName);
    if (layer) {
      if (visible) {
        layer.addTo(this.map);
      } else {
        layer.removeFrom(this.map);
      }
    }
  }
  
  private createHistoricalMarkers(): L.Marker[] {
    // 實現歷史標記創建邏輯
    return [];
  }
  
  private createLifestyleMarkers(): L.Marker[] {
    // 實現生活機能標記創建邏輯
    return [];
  }
  
  private createFuturePredictions(): L.Layer[] {
    // 實現未來預測圖層創建邏輯
    return [];
  }
}
```

#### 2.3.2 自訂圖標和樣式
```typescript
// CustomIcons.ts
import L from 'leaflet';

export const CustomIcons = {
  // 歷史圖標
  historical: L.divIcon({
    className: 'custom-icon historical-icon',
    html: '<i class="fas fa-landmark"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  }),
  
  // 生活圖標
  lifestyle: L.divIcon({
    className: 'custom-icon lifestyle-icon',
    html: '<i class="fas fa-coffee"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  }),
  
  // 未來圖標
  future: L.divIcon({
    className: 'custom-icon future-icon',
    html: '<i class="fas fa-rocket"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  }),
  
  // 房源圖標
  property: L.divIcon({
    className: 'custom-icon property-icon',
    html: '<i class="fas fa-home"></i>',
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  })
};
```

### 2.4 湧現式發現實現

#### 2.4.1 房源發現系統
```typescript
// PropertyDiscovery.ts
import L from 'leaflet';

export class PropertyDiscovery {
  private map: L.Map;
  private propertyMarkers: L.Marker[] = [];
  private discoveryLayer: L.LayerGroup;
  
  constructor(map: L.Map) {
    this.map = map;
    this.discoveryLayer = L.layerGroup().addTo(map);
  }
  
  // 基於上下文發現房源
  discoverProperties(context: DiscoveryContext): void {
    // 清除現有標記
    this.clearPropertyMarkers();
    
    // 根據上下文獲取相關房源
    const properties = this.getRelevantProperties(context);
    
    // 創建房源標記
    properties.forEach(property => {
      const marker = this.createPropertyMarker(property);
      this.propertyMarkers.push(marker);
      this.discoveryLayer.addLayer(marker);
    });
  }
  
  // 創建房源標記
  private createPropertyMarker(property: Property): L.Marker {
    const marker = L.marker([property.latitude, property.longitude], {
      icon: CustomIcons.property
    });
    
    // 添加彈窗
    const popup = this.createPropertyPopup(property);
    marker.bindPopup(popup);
    
    // 添加湧現動畫
    marker.on('add', () => {
      this.addEmergenceAnimation(marker);
    });
    
    return marker;
  }
  
  // 創建房源彈窗
  private createPropertyPopup(property: Property): HTMLElement {
    const popup = document.createElement('div');
    popup.className = 'property-popup';
    popup.innerHTML = `
      <div class="popup-header">
        <h4>${property.title}</h4>
        <span class="price">${property.price}</span>
      </div>
      <div class="popup-content">
        <p>${property.description}</p>
        <div class="property-details">
          <span>${property.bedrooms}房</span>
          <span>${property.area}坪</span>
        </div>
      </div>
      <button class="explore-property">深入了解</button>
    `;
    
    return popup;
  }
  
  // 湧現動畫
  private addEmergenceAnimation(marker: L.Marker): void {
    const element = marker.getElement();
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8) translateY(20px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.3s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'scale(1) translateY(0)';
      }, 100);
    }
  }
  
  private clearPropertyMarkers(): void {
    this.propertyMarkers.forEach(marker => {
      this.discoveryLayer.removeLayer(marker);
    });
    this.propertyMarkers = [];
  }
  
  private getRelevantProperties(context: DiscoveryContext): Property[] {
    // 實現基於上下文的房源推薦邏輯
    return [];
  }
}
```

## 3. 效能優化

### 3.1 瓦片快取策略
```typescript
// TileCacheManager.ts
export class TileCacheManager {
  private cache: Map<string, any> = new Map();
  
  // 快取瓦片資料
  cacheTile(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  // 獲取快取的瓦片
  getCachedTile(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5分鐘快取
      return cached.data;
    }
    return null;
  }
  
  // 清理過期快取
  cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > 300000) {
        this.cache.delete(key);
      }
    }
  }
}
```

### 3.2 延遲載入
```typescript
// LazyLoadingManager.ts
export class LazyLoadingManager {
  private map: L.Map;
  private loadedTiles: Set<string> = new Set();
  
  constructor(map: L.Map) {
    this.map = map;
    this.setupLazyLoading();
  }
  
  private setupLazyLoading(): void {
    this.map.on('moveend', () => {
      this.loadVisibleTiles();
    });
  }
  
  private loadVisibleTiles(): void {
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    
    // 計算可見範圍內的瓦片
    const tiles = this.getTilesInBounds(bounds, zoom);
    
    tiles.forEach(tileKey => {
      if (!this.loadedTiles.has(tileKey)) {
        this.loadTile(tileKey);
        this.loadedTiles.add(tileKey);
      }
    });
  }
  
  private getTilesInBounds(bounds: L.LatLngBounds, zoom: number): string[] {
    // 實現瓦片計算邏輯
    return [];
  }
  
  private loadTile(tileKey: string): void {
    // 實現瓦片載入邏輯
  }
}
```

## 4. 自訂樣式

### 4.1 CSS 樣式定義
```css
/* map-styles.css */
.custom-icon {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.custom-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.historical-icon {
  color: #D2691E;
  border: 2px solid #D2691E;
}

.lifestyle-icon {
  color: #FF69B4;
  border: 2px solid #FF69B4;
}

.future-icon {
  color: #9370DB;
  border: 2px solid #9370DB;
}

.property-icon {
  color: #8B4513;
  border: 2px solid #8B4513;
}

/* 彈窗樣式 */
.property-popup {
  min-width: 250px;
  padding: 0;
}

.popup-header {
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
}

.popup-content {
  padding: 16px;
}

.explore-property {
  width: 100%;
  background: #8B4513;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.explore-property:hover {
  background: #A0522D;
}
```

### 4.2 響應式設計
```css
/* 響應式地圖樣式 */
@media (max-width: 768px) {
  .custom-icon {
    width: 24px !important;
    height: 24px !important;
  }
  
  .property-popup {
    min-width: 200px;
  }
  
  .popup-header {
    padding: 8px 12px;
  }
  
  .popup-content {
    padding: 12px;
  }
}
```

## 5. 部署考量

### 5.1 環境變數配置
```bash
# .env
OPENSTREETMAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
OPENSTREETMAP_ATTRIBUTION=© OpenStreetMap contributors
MAP_CACHE_DURATION=300000
MAP_MAX_ZOOM=19
```

### 5.2 容器化配置
```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    environment:
      - REACT_APP_MAP_TILES_URL=${OPENSTREETMAP_TILES_URL}
      - REACT_APP_MAP_ATTRIBUTION=${OPENSTREETMAP_ATTRIBUTION}
```

## 6. 監控和分析

### 6.1 地圖效能監控
```typescript
// MapPerformanceMonitor.ts
export class MapPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  // 監控地圖載入時間
  trackMapLoadTime(): void {
    const startTime = performance.now();
    
    // 監聽地圖載入完成事件
    this.map.on('load', () => {
      const loadTime = performance.now() - startTime;
      this.recordMetric('map_load_time', loadTime);
    });
  }
  
  // 監控瓦片載入效能
  trackTileLoadPerformance(): void {
    this.map.on('tileloadstart', (e) => {
      const tileKey = `${e.coords.x}-${e.coords.y}-${e.coords.z}`;
      this.recordMetric(`tile_load_${tileKey}`, performance.now());
    });
    
    this.map.on('tileload', (e) => {
      const tileKey = `${e.coords.x}-${e.coords.y}-${e.coords.z}`;
      const loadTime = performance.now() - this.metrics.get(`tile_load_${tileKey}`)[0];
      this.recordMetric('tile_load_time', loadTime);
    });
  }
  
  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }
  
  // 獲取效能報告
  getPerformanceReport(): PerformanceReport {
    const report: PerformanceReport = {
      averageMapLoadTime: this.calculateAverage('map_load_time'),
      averageTileLoadTime: this.calculateAverage('tile_load_time'),
      totalTilesLoaded: this.metrics.get('tile_load_time')?.length || 0
    };
    
    return report;
  }
  
  private calculateAverage(metricName: string): number {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}
```

這個 OpenStreetMap 整合指南提供了完整的技術實現方案，確保 Terra Narrativa 平台能夠充分利用免費的地圖服務，同時保持良好的效能和使用者體驗。 