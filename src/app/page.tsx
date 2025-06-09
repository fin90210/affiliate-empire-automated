
'use client';

import React, { useState } from 'react';
import { DollarSign, MousePointer, TrendingUp, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { ProductGrid } from '@/components/dashboard/ProductGrid';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { mockCampaigns, mockProducts, mockAnalytics, chartData } from '@/lib/data';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(mockAnalytics.totalRevenue)}
                change="+12.5% from last month"
                changeType="positive"
                icon={DollarSign}
              />
              <StatsCard
                title="Total Clicks"
                value={formatNumber(mockAnalytics.totalClicks)}
                change="+8.2% from last month"
                changeType="positive"
                icon={MousePointer}
              />
              <StatsCard
                title="Conversions"
                value={formatNumber(mockAnalytics.totalConversions)}
                change="+15.3% from last month"
                changeType="positive"
                icon={TrendingUp}
              />
              <StatsCard
                title="Conversion Rate"
                value={formatPercentage(mockAnalytics.averageConversionRate)}
                change="+2.1% from last month"
                changeType="positive"
                icon={Users}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart data={chartData} />
              </div>
              <div>
                <ActivityFeed activities={mockAnalytics.recentActivity} />
              </div>
            </div>
            
            <CampaignTable campaigns={mockCampaigns.slice(0, 3)} />
          </div>
        );
      
      case 'campaigns':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Create Campaign
              </button>
            </div>
            <CampaignTable campaigns={mockCampaigns} />
          </div>
        );
      
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Add Product
              </button>
            </div>
            <ProductGrid products={mockProducts} />
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(mockAnalytics.totalRevenue)}
                change="+12.5% from last month"
                changeType="positive"
                icon={DollarSign}
              />
              <StatsCard
                title="Total Clicks"
                value={formatNumber(mockAnalytics.totalClicks)}
                change="+8.2% from last month"
                changeType="positive"
                icon={MousePointer}
              />
              <StatsCard
                title="Conversions"
                value={formatNumber(mockAnalytics.totalConversions)}
                change="+15.3% from last month"
                changeType="positive"
                icon={TrendingUp}
              />
              <StatsCard
                title="Conversion Rate"
                value={formatPercentage(mockAnalytics.averageConversionRate)}
                change="+2.1% from last month"
                changeType="positive"
                icon={Users}
              />
            </div>
            <RevenueChart data={chartData} />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Content for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
