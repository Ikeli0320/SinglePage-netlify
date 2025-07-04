# HomeOS 原型設計架構

## 1. 原型概述

### 1.1 設計目標
基於「全生命週期管家」的核心理念，建立一個能感知使用者生命週期階段、提供個人化服務的房地產平台原型。原型將實現三大核心支柱：
- **生命週期導航**：以使用者真實居住階段為核心的導航系統
- **動態家庭儀表板**：AI驅動的個人化首頁
- **一站式服務生態系**：整合居住相關服務的市集平台

### 1.2 原型範圍
- 前端：React + TypeScript + Tailwind CSS
- 後端：Node.js + Express + TypeScript
- 資料庫：SQLite（原型階段）
- AI：OpenAI API 整合
- 地圖：OpenStreetMap + Leaflet.js

## 2. 生命週期導航架構

### 2.1 導航結構設計
```typescript
// types/lifecycle.types.ts
export type LifecycleStage = 
  | 'finding'      // 尋找
  | 'financing'    // 融資
  | 'moving'       // 搬遷
  | 'settling'     // 安居
  | 'managing'     // 管理
  | 'selling';     // 出售

export interface LifecycleNavigation {
  stage: LifecycleStage;
  title: string;
  icon: string;
  description: string;
  features: string[];
  isActive: boolean;
}

// 導航配置
export const LIFECYCLE_NAVIGATION: LifecycleNavigation[] = [
  {
    stage: 'finding',
    title: '尋找理想的家',
    icon: '🔍',
    description: '探索房源、預約看房、比較選擇',
    features: ['智慧搜尋', '虛擬看房', '鄰里分析'],
    isActive: true
  },
  {
    stage: 'financing',
    title: '財務規劃',
    icon: '💰',
    description: '房貸申請、預先批准、貸款比較',
    features: ['房貸計算器', '預先批准', '利率比較'],
    isActive: false
  },
  {
    stage: 'moving',
    title: '順利搬遷',
    icon: '📦',
    description: '搬家服務、地址變更、水電開通',
    features: ['搬家公司', '地址變更', '水電開通'],
    isActive: false
  },
  {
    stage: 'settling',
    title: '打造理想的家',
    icon: '🏠',
    description: '室內設計、傢俱購買、智慧家庭',
    features: ['設計師匹配', '傢俱推薦', '智慧設備'],
    isActive: false
  },
  {
    stage: 'managing',
    title: '日常管理',
    icon: '⚙️',
    description: '維護提醒、維修服務、資產追蹤',
    features: ['維護日曆', '維修預約', '資產追蹤'],
    isActive: false
  },
  {
    stage: 'selling',
    title: '出售轉換',
    icon: '📈',
    description: '市場分析、房產估價、經紀人匹配',
    features: ['市場分析', '房產估價', '經紀人匹配'],
    isActive: false
  }
];
```

### 2.2 導航組件實現
```typescript
// components/LifecycleNavigation.tsx
import React from 'react';
import { LifecycleStage, LIFECYCLE_NAVIGATION } from '../types/lifecycle.types';

interface LifecycleNavigationProps {
  currentStage: LifecycleStage;
  onStageChange: (stage: LifecycleStage) => void;
}

const LifecycleNavigation: React.FC<LifecycleNavigationProps> = ({
  currentStage,
  onStageChange
}) => {
  return (
    <nav className="bg-white shadow-lg rounded-xl p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {LIFECYCLE_NAVIGATION.map((item) => (
          <button
            key={item.stage}
            onClick={() => onStageChange(item.stage)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200 font-medium
              ${currentStage === item.stage
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs opacity-80">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default LifecycleNavigation;
```

## 3. 動態家庭儀表板架構

### 3.1 AI 生命週期預測引擎
```typescript
// services/lifecycleAI.ts
export interface UserBehavior {
  userId: string;
  interactions: {
    type: 'search' | 'calculator' | 'design' | 'maintenance' | 'valuation';
    timestamp: Date;
    data: any;
  }[];
  currentStage: LifecycleStage;
  confidence: number;
}

export class LifecyclePredictionEngine {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async predictUserStage(userBehavior: UserBehavior): Promise<LifecycleStage> {
    const behaviorSummary = this.analyzeBehavior(userBehavior);
    
    const prompt = `
    基於以下使用者行為分析，預測使用者目前處於哪個居住生命週期階段：
    
    行為摘要：${behaviorSummary}
    
    可能的階段：
    - finding: 尋找房源
    - financing: 財務規劃
    - moving: 搬遷準備
    - settling: 安居裝潢
    - managing: 日常管理
    - selling: 出售準備
    
    請回傳最符合的階段代碼。
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10
    });

    return response.choices[0].message.content as LifecycleStage;
  }

  private analyzeBehavior(userBehavior: UserBehavior): string {
    // 分析使用者行為模式
    const recentInteractions = userBehavior.interactions
      .filter(i => i.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .map(i => i.type);

    return `最近30天內的主要活動：${recentInteractions.join(', ')}`;
  }
}
```

### 3.2 動態儀表板組件
```typescript
// components/DynamicDashboard.tsx
import React, { useEffect, useState } from 'react';
import { LifecycleStage } from '../types/lifecycle.types';
import FindingDashboard from './dashboards/FindingDashboard';
import FinancingDashboard from './dashboards/FinancingDashboard';
import MovingDashboard from './dashboards/MovingDashboard';
import SettlingDashboard from './dashboards/SettlingDashboard';
import ManagingDashboard from './dashboards/ManagingDashboard';
import SellingDashboard from './dashboards/SellingDashboard';

interface DynamicDashboardProps {
  userId: string;
  userBehavior: any;
}

const DynamicDashboard: React.FC<DynamicDashboardProps> = ({
  userId,
  userBehavior
}) => {
  const [currentStage, setCurrentStage] = useState<LifecycleStage>('finding');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    predictAndUpdateStage();
  }, [userBehavior]);

  const predictAndUpdateStage = async () => {
    setIsLoading(true);
    try {
      const predictionEngine = new LifecyclePredictionEngine();
      const predictedStage = await predictionEngine.predictUserStage(userBehavior);
      setCurrentStage(predictedStage);
    } catch (error) {
      console.error('預測階段失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDashboard = () => {
    switch (currentStage) {
      case 'finding':
        return <FindingDashboard userId={userId} />;
      case 'financing':
        return <FinancingDashboard userId={userId} />;
      case 'moving':
        return <MovingDashboard userId={userId} />;
      case 'settling':
        return <SettlingDashboard userId={userId} />;
      case 'managing':
        return <ManagingDashboard userId={userId} />;
      case 'selling':
        return <SellingDashboard userId={userId} />;
      default:
        return <FindingDashboard userId={userId} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">
          歡迎回來！您的個人化儀表板
        </h2>
        <p className="opacity-90">
          我們檢測到您目前處於「{LIFECYCLE_NAVIGATION.find(n => n.stage === currentStage)?.title}」階段
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default DynamicDashboard;
```

### 3.3 階段專用儀表板範例
```typescript
// components/dashboards/ManagingDashboard.tsx
import React from 'react';

interface ManagingDashboardProps {
  userId: string;
}

const ManagingDashboard: React.FC<ManagingDashboardProps> = ({ userId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 資產追蹤卡片 */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          資產追蹤
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">當前估值</span>
            <span className="font-semibold text-green-600">$2,850,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">月漲幅</span>
            <span className="font-semibold text-green-600">+2.3%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>

      {/* 維護提醒卡片 */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          維護提醒
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <div className="font-medium">冷氣濾網更換</div>
              <div className="text-sm text-gray-600">已超過3個月</div>
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
              預約
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium">熱水器檢查</div>
              <div className="text-sm text-gray-600">還有15天</div>
            </div>
            <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
              提醒
            </button>
          </div>
        </div>
      </div>

      {/* 節能建議卡片 */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          節能建議
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-800">安裝智慧恆溫器</div>
            <div className="text-sm text-blue-600">預計年省電費 $1,200</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-medium text-green-800">更換LED燈泡</div>
            <div className="text-sm text-green-600">預計年省電費 $300</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingDashboard;
```

## 4. 一站式服務生態系架構

### 4.1 服務分類與整合
```typescript
// types/services.types.ts
export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  priceRange: string;
  availability: string;
  description: string;
  features: string[];
  verified: boolean;
}

export type ServiceCategory = 
  | 'finance'      // 金融服務
  | 'moving'       // 搬家服務
  | 'design'       // 設計裝潢
  | 'furniture'    // 傢俱零售
  | 'maintenance'  // 維修服務
  | 'cleaning'     // 清潔服務
  | 'smart_home'   // 智慧家庭
  | 'insurance';   // 保險服務

export interface ServiceMarketplace {
  category: ServiceCategory;
  title: string;
  icon: string;
  description: string;
  providers: ServiceProvider[];
}
```

### 4.2 服務市集組件
```typescript
// components/ServiceMarketplace.tsx
import React, { useState } from 'react';
import { ServiceCategory, ServiceProvider } from '../types/services.types';

interface ServiceMarketplaceProps {
  currentStage: LifecycleStage;
}

const ServiceMarketplace: React.FC<ServiceMarketplaceProps> = ({ currentStage }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  // 根據生命週期階段推薦服務類別
  const getRecommendedServices = (stage: LifecycleStage): ServiceCategory[] => {
    const recommendations = {
      finding: ['finance'],
      financing: ['finance', 'insurance'],
      moving: ['moving', 'cleaning'],
      settling: ['design', 'furniture', 'smart_home'],
      managing: ['maintenance', 'cleaning', 'smart_home'],
      selling: ['finance', 'maintenance']
    };
    return recommendations[stage] || [];
  };

  const recommendedCategories = getRecommendedServices(currentStage);

  return (
    <div className="space-y-6">
      {/* 推薦服務 */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">為您推薦的服務</h3>
        <div className="flex flex-wrap gap-3">
          {recommendedCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* 服務提供者列表 */}
      {selectedCategory && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">{getCategoryDisplayName(selectedCategory)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getServiceProviders(selectedCategory).map(provider => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceProviderCard: React.FC<{ provider: ServiceProvider }> = ({ provider }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{provider.name}</h4>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>⭐ {provider.rating}</span>
            <span>({provider.reviewCount})</span>
          </div>
        </div>
        {provider.verified && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">已認證</span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{provider.priceRange}</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
          立即預約
        </button>
      </div>
    </div>
  );
};

export default ServiceMarketplace;
```

## 5. 原型實現計劃

### 5.1 開發階段
1. **第一階段（1-2週）**：基礎架構與生命週期導航
   - 建立 React 專案結構
   - 實現生命週期導航組件
   - 建立基本路由系統

2. **第二階段（2-3週）**：動態儀表板
   - 整合 OpenAI API
   - 實現生命週期預測引擎
   - 建立各階段專用儀表板

3. **第三階段（1-2週）**：服務生態系
   - 建立服務提供者資料結構
   - 實現服務市集組件
   - 整合預約系統

### 5.2 技術依賴
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "typescript": "^4.9.0",
    "tailwindcss": "^3.2.0",
    "openai": "^4.0.0",
    "leaflet": "^1.9.0",
    "react-leaflet": "^4.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/leaflet": "^1.9.0",
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0"
  }
}
```

### 5.3 原型驗證重點
- **生命週期預測準確性**：AI 是否能正確識別使用者階段
- **個人化體驗**：儀表板內容是否符合使用者當前需求
- **服務整合流暢度**：從發現到預約的流程是否順暢
- **使用者黏著度**：是否能建立長期使用習慣

這個原型架構將為 HomeOS 的完整實現奠定基礎，驗證「全生命週期管家」概念的可行性。 