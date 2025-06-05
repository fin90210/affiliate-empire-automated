
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, url, category, description, active } = await request.json()
    const { id } = params

    const updatedLink = await prisma.affiliateLink.update({
      where: { id },
      data: {
        name,
        url,
        category,
        description,
        active,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Affiliate link updated successfully',
      affiliateLink: updatedLink
    })

  } catch (error) {
    console.error('Error updating affiliate link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.affiliateLink.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Affiliate link deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting affiliate link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
