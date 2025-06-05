
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Header from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  Eye, 
  TrendingUp, 
  Mail, 
  Link as LinkIcon,
  BarChart3,
  PlusCircle
} from 'lucide-react'

// Dynamic import for charts to avoid SSR issues
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted rounded animate-pulse"></div>
})

const BarChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted rounded animate-pulse"></div>
})

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface DashboardStats {
  totalSubscribers: number
  totalEarnings: number
  totalViews: number
  totalClicks: number
  recentSubscribers: any[]
  affiliateLinks: any[]
  analytics: any
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [subscribersRes, linksRes, analyticsRes] = await Promise.all([
        fetch('/api/subscribe'),
        fetch('/api/affiliate-links'),
        fetch('/api/analytics')
      ])

      const [subscribersData, linksData, analyticsData] = await Promise.all([
        subscribersRes.json(),
        linksRes.json(),
        analyticsRes.json()
      ])

      const totalEarnings = linksData.affiliateLinks?.reduce((sum: number, link: any) => sum + link.earnings, 0) || 0
      const totalClicks = linksData.affiliateLinks?.reduce((sum: number, link: any) => sum + link.clicks, 0) || 0

      setStats({
        totalSubscribers: subscribersData.subscribers?.length || 0,
        totalEarnings,
        totalViews: analyticsData.totalViews || 0,
        totalClicks,
        recentSubscribers: subscribersData.subscribers?.slice(0, 5) || [],
        affiliateLinks: linksData.affiliateLinks || [],
        analytics: analyticsData
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = {
    labels: stats?.analytics?.dailyViews ? Object.keys(stats.analytics.dailyViews).slice(-7) : [],
    datasets: [
      {
        label: 'Daily Views',
        data: stats?.analytics?.dailyViews ? Object.values(stats.analytics.dailyViews).slice(-7) : [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const affiliateChartData = {
    labels: stats?.affiliateLinks?.slice(0, 5).map(link => link.name) || [],
    datasets: [
      {
        label: 'Clicks',
        data: stats?.affiliateLinks?.slice(0, 5).map(link => link.clicks) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Earnings ($)',
        data: stats?.affiliateLinks?.slice(0, 5).map(link => link.earnings) || [],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor your affiliate empire's performance</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Subscribers',
              value: stats?.totalSubscribers || 0,
              icon: Users,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50'
            },
            {
              title: 'Total Earnings',
              value: `$${(stats?.totalEarnings || 0).toFixed(2)}`,
              icon: DollarSign,
              color: 'text-green-600',
              bgColor: 'bg-green-50'
            },
            {
              title: 'Total Views',
              value: stats?.totalViews || 0,
              icon: Eye,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50'
            },
            {
              title: 'Affiliate Clicks',
              value: stats?.totalClicks || 0,
              icon: TrendingUp,
              color: 'text-orange-600',
              bgColor: 'bg-orange-50'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts and Data */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Daily Traffic
                </CardTitle>
                <CardDescription>Website views over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Chart data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Affiliate Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5" />
                  Top Affiliate Links
                </CardTitle>
                <CardDescription>Performance of your best affiliate links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BarChart data={affiliateChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Subscribers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Recent Subscribers
                  </div>
                  <Button size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentSubscribers?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No subscribers yet</p>
                  ) : (
                    stats?.recentSubscribers?.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{subscriber.firstName || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{subscriber.source}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Affiliate Links Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LinkIcon className="mr-2 h-5 w-5" />
                    Affiliate Links
                  </div>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.affiliateLinks?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No affiliate links yet</p>
                  ) : (
                    stats?.affiliateLinks?.slice(0, 5).map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{link.name}</p>
                          <p className="text-sm text-muted-foreground">{link.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{link.clicks} clicks</p>
                          <p className="text-sm text-green-600">${link.earnings.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
