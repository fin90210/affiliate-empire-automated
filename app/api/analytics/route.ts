
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json()

    if (!page) {
      return NextResponse.json(
        { error: 'Page is required' },
        { status: 400 }
      )
    }

    // Check if analytics entry exists for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingEntry = await prisma.analytics.findFirst({
      where: {
        page,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (existingEntry) {
      // Update existing entry
      const updatedEntry = await prisma.analytics.update({
        where: { id: existingEntry.id },
        data: { views: existingEntry.views + 1 }
      })
      return NextResponse.json({ analytics: updatedEntry })
    }

    // Create new entry
    const newEntry = await prisma.analytics.create({
      data: {
        page,
        views: 1,
        date: today
      }
    })

    return NextResponse.json({ analytics: newEntry }, { status: 201 })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await prisma.analytics.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      orderBy: { date: 'desc' }
    })

    // Aggregate data by page
    const pageViews = analytics.reduce((acc, entry) => {
      acc[entry.page] = (acc[entry.page] || 0) + entry.views
      return acc
    }, {} as Record<string, number>)

    // Daily views
    const dailyViews = analytics.reduce((acc, entry) => {
      const dateKey = entry.date.toISOString().split('T')[0]
      acc[dateKey] = (acc[dateKey] || 0) + entry.views
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      pageViews,
      dailyViews,
      totalViews: Object.values(pageViews).reduce((sum, views) => sum + views, 0)
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
