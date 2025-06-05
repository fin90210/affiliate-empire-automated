
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  keywords: string[];
  category: string;
  commission: number;
}

// Predefined affiliate links database
const affiliateLinks: AffiliateLink[] = [
  {
    id: 'amazon-associates',
    name: 'Amazon Associates',
    url: 'https://amzn.to/affiliate-link',
    keywords: ['amazon', 'book', 'product', 'buy', 'purchase', 'shop'],
    category: 'ecommerce',
    commission: 4,
  },
  {
    id: 'clickbank',
    name: 'ClickBank',
    url: 'https://clickbank.com/affiliate-link',
    keywords: ['clickbank', 'digital product', 'course', 'ebook', 'software'],
    category: 'digital',
    commission: 50,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    url: 'https://shopify.com/affiliate-link',
    keywords: ['shopify', 'ecommerce', 'store', 'online shop', 'website builder'],
    category: 'tools',
    commission: 200,
  },
  {
    id: 'hostgator',
    name: 'HostGator',
    url: 'https://hostgator.com/affiliate-link',
    keywords: ['hosting', 'web hosting', 'hostgator', 'domain', 'website'],
    category: 'hosting',
    commission: 65,
  },
  {
    id: 'bluehost',
    name: 'Bluehost',
    url: 'https://bluehost.com/affiliate-link',
    keywords: ['bluehost', 'hosting', 'wordpress', 'website hosting'],
    category: 'hosting',
    commission: 65,
  },
  {
    id: 'semrush',
    name: 'SEMrush',
    url: 'https://semrush.com/affiliate-link',
    keywords: ['semrush', 'seo', 'keyword research', 'analytics', 'marketing tool'],
    category: 'seo',
    commission: 200,
  },
  {
    id: 'convertkit',
    name: 'ConvertKit',
    url: 'https://convertkit.com/affiliate-link',
    keywords: ['convertkit', 'email marketing', 'newsletter', 'email automation'],
    category: 'email',
    commission: 30,
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    url: 'https://canva.com/affiliate-link',
    keywords: ['canva', 'design', 'graphics', 'logo', 'visual content'],
    category: 'design',
    commission: 36,
  },
];

// Smart affiliate link insertion
function insertAffiliateLinks(content: string): string {
  let updatedContent = content;
  
  affiliateLinks.forEach(affiliate => {
    affiliate.keywords.forEach(keyword => {
      // Create regex pattern for keyword matching
      const pattern = new RegExp(`\\b(${keyword})\\b(?![^<]*>)(?![^\\[]*\\])`, 'gi');
      
      // Replace first occurrence of keyword with affiliate link
      let replaced = false;
      updatedContent = updatedContent.replace(pattern, (match) => {
        if (!replaced && !match.includes('http') && !match.includes('[')) {
          replaced = true;
          return `[${match}](${affiliate.url} "${affiliate.name} - Affiliate Link")`;
        }
        return match;
      });
    });
  });

  return updatedContent;
}

// Add contextual affiliate recommendations
function addAffiliateRecommendations(content: string, category?: string): string {
  const recommendations = affiliateLinks
    .filter(link => !category || link.category === category)
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 3);

  if (recommendations.length === 0) return content;

  const recommendationSection = `

## Recommended Tools & Resources

Based on the content above, here are some tools that can help you succeed:

${recommendations.map(link => 
  `- **[${link.name}](${link.url})** - Perfect for ${link.category} needs`
).join('\n')}

*Note: These are affiliate links. We may earn a commission if you make a purchase, at no extra cost to you.*

`;

  // Insert before conclusion or at the end
  const conclusionIndex = content.toLowerCase().indexOf('## conclusion');
  if (conclusionIndex !== -1) {
    return content.slice(0, conclusionIndex) + recommendationSection + content.slice(conclusionIndex);
  }
  
  return content + recommendationSection;
}

// Optimize affiliate link placement
function optimizeAffiliatePlacement(content: string): string {
  let optimizedContent = content;
  
  // Insert affiliate links in strategic locations
  const strategicPlacements = [
    {
      pattern: /\b(tools?|software|platform|service)\b/gi,
      category: 'tools',
    },
    {
      pattern: /\b(hosting|domain|website)\b/gi,
      category: 'hosting',
    },
    {
      pattern: /\b(email|newsletter|marketing)\b/gi,
      category: 'email',
    },
    {
      pattern: /\b(seo|keyword|analytics)\b/gi,
      category: 'seo',
    },
  ];

  strategicPlacements.forEach(placement => {
    const relevantLinks = affiliateLinks.filter(link => link.category === placement.category);
    if (relevantLinks.length > 0) {
      const bestLink = relevantLinks.sort((a, b) => b.commission - a.commission)[0];
      
      // Replace first occurrence with affiliate link
      let replaced = false;
      optimizedContent = optimizedContent.replace(placement.pattern, (match) => {
        if (!replaced && !match.includes('http') && !match.includes('[')) {
          replaced = true;
          return `[${match}](${bestLink.url} "${bestLink.name}")`;
        }
        return match;
      });
    }
  });

  return optimizedContent;
}

// Process all blog posts and insert affiliate links
async function processAllPosts(): Promise<void> {
  try {
    console.log('🔗 Processing all posts for affiliate link insertion...');

    const posts = await prisma.post.findMany({
      where: { published: true },
    });

    console.log(`📝 Found ${posts.length} posts to process`);

    for (const post of posts) {
      let updatedContent = post.content;
      
      // Insert affiliate links
      updatedContent = insertAffiliateLinks(updatedContent);
      
      // Optimize placement
      updatedContent = optimizeAffiliatePlacement(updatedContent);
      
      // Add recommendations
      updatedContent = addAffiliateRecommendations(updatedContent);

      // Update post if content changed
      if (updatedContent !== post.content) {
        await prisma.post.update({
          where: { id: post.id },
          data: { content: updatedContent },
        });
        
        console.log(`✅ Updated post: ${post.title}`);
      }
    }

    console.log('✅ Affiliate link processing completed');
  } catch (error) {
    console.error('❌ Error processing affiliate links:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Process specific post
async function processPost(postId: string): Promise<void> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.error(`❌ Post not found: ${postId}`);
      return;
    }

    let updatedContent = post.content;
    
    // Insert affiliate links
    updatedContent = insertAffiliateLinks(updatedContent);
    
    // Optimize placement
    updatedContent = optimizeAffiliatePlacement(updatedContent);
    
    // Add recommendations
    updatedContent = addAffiliateRecommendations(updatedContent);

    // Update post
    await prisma.post.update({
      where: { id: postId },
      data: { content: updatedContent },
    });

    console.log(`✅ Updated post: ${post.title}`);
  } catch (error) {
    console.error('❌ Error processing post:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Track affiliate link performance
async function trackAffiliatePerformance(): Promise<void> {
  try {
    console.log('📊 Tracking affiliate link performance...');

    // Get click data from database
    const clickData = await prisma.affiliateClick.groupBy({
      by: ['linkId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    console.log('🔗 Top performing affiliate links:');
    clickData.forEach((data, index) => {
      const link = affiliateLinks.find(l => l.id === data.linkId);
      console.log(`${index + 1}. ${link?.name || data.linkId}: ${data._count.id} clicks`);
    });

    // Calculate conversion rates and revenue
    const totalClicks = clickData.reduce((sum, data) => sum + data._count.id, 0);
    console.log(`📈 Total clicks: ${totalClicks}`);

  } catch (error) {
    console.error('❌ Error tracking performance:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  const postId = process.argv[3];
  
  switch (command) {
    case 'all':
      processAllPosts();
      break;
    case 'post':
      if (postId) {
        processPost(postId);
      } else {
        console.error('Usage: npm run affiliates post <postId>');
      }
      break;
    case 'track':
      trackAffiliatePerformance();
      break;
    default:
      processAllPosts();
  }
}

export { processAllPosts, processPost, trackAffiliatePerformance, insertAffiliateLinks };
