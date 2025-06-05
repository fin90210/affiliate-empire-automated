
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Update click count
    const updatedLink = await prisma.affiliateLink.update({
      where: { id },
      data: {
        clicks: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      message: 'Click tracked successfully',
      redirectUrl: updatedLink.url
    })

  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
