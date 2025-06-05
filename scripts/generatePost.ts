
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  keywords: string[];
  metaDescription: string;
}

// SEO keyword research function
async function generateKeywords(topic: string): Promise<string[]> {
  const prompt = `Generate 10 high-value SEO keywords for the topic "${topic}" in affiliate marketing. Focus on long-tail keywords with commercial intent. Return only the keywords, one per line.`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const keywords = response.choices[0].message.content
    ?.split('\n')
    .filter(k => k.trim())
    .map(k => k.replace(/^\d+\.\s*/, '').trim()) || [];
  
  return keywords.slice(0, 10);
}

// Generate blog post content
async function generateBlogPost(topic: string, keywords: string[]): Promise<BlogPost> {
  const keywordList = keywords.join(', ');
  
  const prompt = `Write a comprehensive, SEO-optimized blog post about "${topic}" for an affiliate marketing website. 

Requirements:
- Target keywords: ${keywordList}
- 1500-2000 words
- Include H2 and H3 headings
- Natural keyword integration
- Include affiliate product recommendations
- Add call-to-action sections
- Write in markdown format
- Include meta description (150-160 characters)
- Create compelling excerpt (100-150 words)

Structure:
1. Introduction with hook
2. Main content with subheadings
3. Product recommendations with affiliate potential
4. Conclusion with CTA

Return in this JSON format:
{
  "title": "SEO-optimized title",
  "content": "Full markdown content",
  "excerpt": "Compelling excerpt",
  "metaDescription": "Meta description"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  
  // Generate slug from title
  const slug = result.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return {
    title: result.title,
    content: result.content,
    excerpt: result.excerpt,
    slug,
    keywords,
    metaDescription: result.metaDescription,
  };
}

// Insert affiliate links into content
function insertAffiliateLinks(content: string): string {
  // Common affiliate product patterns to replace
  const affiliateReplacements = [
    {
      pattern: /\b(Amazon|amazon)\b/g,
      replacement: '[Amazon](https://amzn.to/affiliate-link)',
    },
    {
      pattern: /\b(ClickBank|clickbank)\b/g,
      replacement: '[ClickBank](https://clickbank.com/affiliate-link)',
    },
    {
      pattern: /\b(Shopify|shopify)\b/g,
      replacement: '[Shopify](https://shopify.com/affiliate-link)',
    },
  ];

  let updatedContent = content;
  affiliateReplacements.forEach(({ pattern, replacement }) => {
    updatedContent = updatedContent.replace(pattern, replacement);
  });

  return updatedContent;
}

// Save blog post to database and file system
async function saveBlogPost(post: BlogPost): Promise<void> {
  try {
    // Save to database
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Save to file system for backup
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    await fs.mkdir(postsDir, { recursive: true });
    
    const fileName = `${new Date().toISOString().split('T')[0]}-${post.slug}.md`;
    const filePath = path.join(postsDir, fileName);
    
    const frontMatter = `---
title: "${post.title}"
excerpt: "${post.excerpt}"
slug: "${post.slug}"
keywords: [${post.keywords.map(k => `"${k}"`).join(', ')}]
metaDescription: "${post.metaDescription}"
publishedAt: "${new Date().toISOString()}"
---

${post.content}`;

    await fs.writeFile(filePath, frontMatter);
    console.log(`✅ Blog post saved: ${post.title}`);
    console.log(`📁 File: ${fileName}`);
    console.log(`🔗 Slug: ${post.slug}`);
  } catch (error) {
    console.error('❌ Error saving blog post:', error);
    throw error;
  }
}

// Main function
async function generateDailyPost(): Promise<void> {
  try {
    console.log('🚀 Starting daily blog post generation...');
    
    // Topics for affiliate marketing content
    const topics = [
      'Best Affiliate Marketing Tools for Beginners',
      'High-Converting Landing Page Strategies',
      'Email Marketing for Affiliate Success',
      'Social Media Affiliate Marketing Tips',
      'Passive Income Through Affiliate Marketing',
      'Affiliate Marketing Niches That Pay Well',
      'Building Trust in Affiliate Marketing',
      'Mobile Optimization for Affiliate Sites',
      'Content Marketing for Affiliates',
      'Affiliate Marketing Analytics and Tracking',
    ];

    // Select random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`📝 Topic: ${topic}`);

    // Generate keywords
    console.log('🔍 Generating SEO keywords...');
    const keywords = await generateKeywords(topic);
    console.log(`🎯 Keywords: ${keywords.join(', ')}`);

    // Generate blog post
    console.log('✍️ Generating blog post content...');
    const post = await generateBlogPost(topic, keywords);

    // Insert affiliate links
    post.content = insertAffiliateLinks(post.content);

    // Save blog post
    await saveBlogPost(post);

    console.log('✅ Daily blog post generation completed successfully!');
  } catch (error) {
    console.error('❌ Error in daily post generation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  generateDailyPost();
}

export { generateDailyPost };
