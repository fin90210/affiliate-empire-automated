
import { TwitterApi } from 'twitter-api-v2';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

// Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

interface SocialPost {
  platform: string;
  content: string;
  hashtags: string[];
  url?: string;
}

// Generate social media content
async function generateSocialContent(
  blogPost: any,
  platform: 'twitter' | 'linkedin' | 'facebook'
): Promise<SocialPost> {
  const characterLimits = {
    twitter: 280,
    linkedin: 3000,
    facebook: 2000,
  };

  const prompt = `Create a ${platform} post to promote this blog post:

Title: ${blogPost.title}
Excerpt: ${blogPost.excerpt}
URL: https://affiliateempire.com/blog/${blogPost.slug}

Requirements for ${platform}:
- ${platform === 'twitter' ? 'Under 280 characters' : 'Engaging and professional'}
- Include relevant hashtags
- Call to action
- ${platform === 'linkedin' ? 'Professional tone' : platform === 'twitter' ? 'Concise and punchy' : 'Engaging and friendly'}

Return in JSON format:
{
  "content": "Post content without hashtags",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    platform,
    content: result.content,
    hashtags: result.hashtags || [],
    url: `https://affiliateempire.com/blog/${blogPost.slug}`,
  };
}

// Post to Twitter
async function postToTwitter(socialPost: SocialPost): Promise<boolean> {
  try {
    const hashtags = socialPost.hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ');
    const fullContent = `${socialPost.content}\n\n${hashtags}\n\n${socialPost.url}`;
    
    // Ensure content fits Twitter's character limit
    const truncatedContent = fullContent.length > 280 
      ? fullContent.substring(0, 277) + '...'
      : fullContent;

    const tweet = await twitterClient.v2.tweet(truncatedContent);
    
    console.log(`✅ Posted to Twitter: ${tweet.data.id}`);
    return true;
  } catch (error) {
    console.error('❌ Twitter posting failed:', error);
    return false;
  }
}

// Post to LinkedIn (using LinkedIn API)
async function postToLinkedIn(socialPost: SocialPost): Promise<boolean> {
  try {
    if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_PERSON_ID) {
      console.log('⚠️ LinkedIn credentials not configured, skipping...');
      return false;
    }

    const hashtags = socialPost.hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ');
    const content = `${socialPost.content}\n\n${hashtags}\n\nRead more: ${socialPost.url}`;

    const postData = {
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              description: {
                text: socialPost.content,
              },
              originalUrl: socialPost.url,
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    console.log(`✅ Posted to LinkedIn: ${response.data.id}`);
    return true;
  } catch (error) {
    console.error('❌ LinkedIn posting failed:', error);
    return false;
  }
}

// Post to Facebook (using Facebook Graph API)
async function postToFacebook(socialPost: SocialPost): Promise<boolean> {
  try {
    if (!process.env.FACEBOOK_ACCESS_TOKEN || !process.env.FACEBOOK_PAGE_ID) {
      console.log('⚠️ Facebook credentials not configured, skipping...');
      return false;
    }

    const hashtags = socialPost.hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ');
    const message = `${socialPost.content}\n\n${hashtags}\n\nRead more: ${socialPost.url}`;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
      {
        message,
        link: socialPost.url,
        access_token: process.env.FACEBOOK_ACCESS_TOKEN,
      }
    );

    console.log(`✅ Posted to Facebook: ${response.data.id}`);
    return true;
  } catch (error) {
    console.error('❌ Facebook posting failed:', error);
    return false;
  }
}

// Generate motivational/educational posts
async function generateStandalonePost(
  platform: 'twitter' | 'linkedin' | 'facebook',
  type: 'tip' | 'motivation' | 'question' | 'fact'
): Promise<SocialPost> {
  const prompts = {
    tip: `Create a helpful affiliate marketing tip for ${platform}. Make it actionable and valuable.`,
    motivation: `Create a motivational post about affiliate marketing success for ${platform}. Include inspiration and encouragement.`,
    question: `Create an engaging question about affiliate marketing for ${platform} to spark discussion.`,
    fact: `Share an interesting fact or statistic about affiliate marketing for ${platform}.`,
  };

  const prompt = `${prompts[type]}

Requirements:
- ${platform === 'twitter' ? 'Under 280 characters' : 'Engaging content'}
- Include relevant hashtags
- Professional but approachable tone

Return in JSON format:
{
  "content": "Post content without hashtags",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    platform,
    content: result.content,
    hashtags: result.hashtags || [],
  };
}

// Main social media automation function
async function automateocialPosts(): Promise<void> {
  try {
    console.log('📱 Starting social media automation...');

    // Get recent blog posts to promote
    const recentPosts = await prisma.post.findMany({
      where: {
        published: true,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    // If we have a recent post, promote it
    if (recentPosts.length > 0) {
      const post = recentPosts[0];
      console.log(`📝 Promoting blog post: ${post.title}`);

      // Generate and post to each platform
      const platforms: ('twitter' | 'linkedin' | 'facebook')[] = ['twitter', 'linkedin', 'facebook'];
      
      for (const platform of platforms) {
        try {
          const socialPost = await generateSocialContent(post, platform);
          
          let success = false;
          switch (platform) {
            case 'twitter':
              success = await postToTwitter(socialPost);
              break;
            case 'linkedin':
              success = await postToLinkedIn(socialPost);
              break;
            case 'facebook':
              success = await postToFacebook(socialPost);
              break;
          }

          if (success) {
            // Log the social post
            await prisma.socialPost.create({
              data: {
                platform,
                content: socialPost.content,
                hashtags: socialPost.hashtags.join(','),
                url: socialPost.url,
                postId: post.id,
                postedAt: new Date(),
              },
            });
          }

          // Delay between posts
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ Error posting to ${platform}:`, error);
        }
      }
    } else {
      // No recent posts, create standalone content
      console.log('📝 No recent posts, creating standalone content...');
      
      const contentTypes: ('tip' | 'motivation' | 'question' | 'fact')[] = ['tip', 'motivation', 'question', 'fact'];
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      // Post to Twitter (most frequent)
      const twitterPost = await generateStandalonePost('twitter', randomType);
      await postToTwitter(twitterPost);
      
      // Occasionally post to other platforms
      if (Math.random() > 0.7) {
        const linkedinPost = await generateStandalonePost('linkedin', randomType);
        await postToLinkedIn(linkedinPost);
      }
      
      if (Math.random() > 0.8) {
        const facebookPost = await generateStandalonePost('facebook', randomType);
        await postToFacebook(facebookPost);
      }
    }

    console.log('✅ Social media automation completed');
  } catch (error) {
    console.error('❌ Error in social media automation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Schedule posts for optimal times
async function scheduleOptimalPosts(): Promise<void> {
  const now = new Date();
  const hour = now.getHours();
  
  // Optimal posting times (EST)
  const optimalTimes = {
    twitter: [9, 12, 15, 18], // 9am, 12pm, 3pm, 6pm
    linkedin: [8, 12, 17], // 8am, 12pm, 5pm
    facebook: [9, 13, 15], // 9am, 1pm, 3pm
  };

  // Check if current time is optimal for any platform
  const shouldPost = Object.values(optimalTimes).some(times => times.includes(hour));
  
  if (shouldPost) {
    await automateocialPosts();
  } else {
    console.log(`⏰ Not an optimal posting time (${hour}:00). Skipping...`);
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'post':
      automateocialPosts();
      break;
    case 'schedule':
      scheduleOptimalPosts();
      break;
    default:
      automateocialPosts();
  }
}

export { automateocialPosts, scheduleOptimalPosts };
