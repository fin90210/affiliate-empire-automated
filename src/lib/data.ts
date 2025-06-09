
import { Campaign, Product, Analytics, ActivityItem } from '@/types';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Tech Sale',
    status: 'active',
    clicks: 15420,
    conversions: 892,
    revenue: 12450.80,
    conversionRate: 5.78,
    startDate: '2024-06-01',
  },
  {
    id: '2',
    name: 'Back to School',
    status: 'active',
    clicks: 8930,
    conversions: 445,
    revenue: 7890.50,
    conversionRate: 4.98,
    startDate: '2024-08-15',
  },
  {
    id: '3',
    name: 'Holiday Electronics',
    status: 'paused',
    clicks: 22100,
    conversions: 1205,
    revenue: 18750.25,
    conversionRate: 5.45,
    startDate: '2024-11-01',
    endDate: '2024-12-31',
  },
  {
    id: '4',
    name: 'Fitness New Year',
    status: 'completed',
    clicks: 12800,
    conversions: 640,
    revenue: 9600.00,
    conversionRate: 5.00,
    startDate: '2024-01-01',
    endDate: '2024-02-29',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    commission: 15.50,
    price: 129.99,
    rating: 4.5,
    sales: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker',
    category: 'Health & Fitness',
    commission: 22.75,
    price: 199.99,
    rating: 4.3,
    sales: 890,
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Portable Phone Charger',
    category: 'Electronics',
    commission: 8.25,
    price: 39.99,
    rating: 4.7,
    sales: 2100,
    imageUrl: 'https://vitessehome.com/cdn/shop/products/ofika-ergonomic-office-chair-high-back-mesh-desk-chair-with-adjustable-headrest-538904_800x.webp?v=1689841095',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    commission: 45.00,
    price: 299.99,
    rating: 4.2,
    sales: 340,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Coffee Maker Machine',
    category: 'Kitchen',
    commission: 18.90,
    price: 149.99,
    rating: 4.6,
    sales: 750,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Gaming Mechanical Keyboard',
    category: 'Electronics',
    commission: 25.50,
    price: 159.99,
    rating: 4.4,
    sales: 620,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
  },
];

export const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'conversion',
    description: 'New conversion from Summer Tech Sale campaign',
    timestamp: '2024-12-09T10:30:00Z',
    amount: 15.50,
  },
  {
    id: '2',
    type: 'click',
    description: 'Click on Wireless Bluetooth Headphones',
    timestamp: '2024-12-09T09:45:00Z',
  },
  {
    id: '3',
    type: 'commission',
    description: 'Commission earned from Smart Fitness Tracker',
    timestamp: '2024-12-09T08:20:00Z',
    amount: 22.75,
  },
  {
    id: '4',
    type: 'conversion',
    description: 'New conversion from Back to School campaign',
    timestamp: '2024-12-08T16:15:00Z',
    amount: 18.90,
  },
  {
    id: '5',
    type: 'click',
    description: 'Click on Coffee Maker Machine',
    timestamp: '2024-12-08T14:30:00Z',
  },
];

export const mockAnalytics: Analytics = {
  totalClicks: 59250,
  totalConversions: 3182,
  totalRevenue: 48691.55,
  averageConversionRate: 5.37,
  topPerformingCampaign: 'Holiday Electronics',
  recentActivity: mockRecentActivity,
};

export const chartData = [
  { name: 'Jan', revenue: 8500, conversions: 420 },
  { name: 'Feb', revenue: 9200, conversions: 485 },
  { name: 'Mar', revenue: 7800, conversions: 390 },
  { name: 'Apr', revenue: 10500, conversions: 525 },
  { name: 'May', revenue: 11200, conversions: 580 },
  { name: 'Jun', revenue: 12450, conversions: 625 },
];
