
export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  startDate: string;
  endDate?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  commission: number;
  price: number;
  rating: number;
  sales: number;
  imageUrl: string;
}

export interface Analytics {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  averageConversionRate: number;
  topPerformingCampaign: string;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'click' | 'conversion' | 'commission';
  description: string;
  timestamp: string;
  amount?: number;
}

export interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  conversions?: number;
}
