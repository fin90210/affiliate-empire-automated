
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get affiliate links stats
    const affiliateLinks = await prisma.affiliateLink.findMany({
      where: { active: true }
    });

    // Get blog posts count
    const blogPostsCount = await prisma.blogPost.count({
      where: { published: true }
    });

    // Get email subscribers count
    const emailSubscribersCount = await prisma.emailSubscriber.count({
      where: { active: true }
    });

    // Get social posts count
    const socialPostsCount = await prisma.socialPost.count({
      where: { posted: true }
    });

    // Calculate totals
    const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
    const totalEarnings = affiliateLinks.reduce((sum, link) => sum + link.earnings, 0);
    const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0);
    
    // Calculate conversion rate
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100) : 0;

    // Mock monthly earnings (in a real app, you'd calculate this from earnings records)
    const monthlyEarnings = totalEarnings * 0.3; // Assume 30% of total earnings are from this month

    const dashboardData = {
      totalEarnings: Math.round(totalEarnings),
      monthlyEarnings: Math.round(monthlyEarnings),
      totalClicks,
      conversionRate: Math.round(conversionRate * 100) / 100,
      activePrograms: affiliateLinks.length,
      emailSubscribers: emailSubscribersCount,
      blogPosts: blogPostsCount,
      socialPosts: socialPostsCount
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
