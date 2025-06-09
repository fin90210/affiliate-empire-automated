
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Campaign } from '@/types';
import { formatCurrency, formatNumber, formatPercentage, getStatusColor } from '@/utils/formatters';

interface CampaignTableProps {
  campaigns: Campaign[];
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Clicks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Conversions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Conv. Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">ID: {campaign.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={campaign.status === 'active' ? 'success' : campaign.status === 'paused' ? 'warning' : 'default'}
                    >
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{formatNumber(campaign.clicks)}</td>
                  <td className="py-3 px-4 text-gray-900">{formatNumber(campaign.conversions)}</td>
                  <td className="py-3 px-4 text-gray-900">{formatCurrency(campaign.revenue)}</td>
                  <td className="py-3 px-4 text-gray-900">{formatPercentage(campaign.conversionRate)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
