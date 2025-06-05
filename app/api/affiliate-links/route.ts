
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const affiliateLinks = await prisma.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ affiliateLinks })
  } catch (error) {
    console.error('Error fetching affiliate links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, url, category, description } = await request.json()

    if (!name || !url || !category) {
      return NextResponse.json(
        { error: 'Name, URL, and category are required' },
        { status: 400 }
      )
    }

    const newLink = await prisma.affiliateLink.create({
      data: {
        name,
        url,
        category,
        description: description || null,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        active: true
      }
    })

    return NextResponse.json({
      message: 'Affiliate link created successfully',
      affiliateLink: newLink
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating affiliate link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
