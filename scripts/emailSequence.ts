
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

interface EmailTemplate {
  subject: string;
  content: string;
  delay: number; // days
}

// Generate personalized email content
async function generateEmailContent(
  type: 'welcome' | 'nurture' | 'promotion' | 'educational',
  userInterests?: string[]
): Promise<{ subject: string; content: string }> {
  const prompts = {
    welcome: `Create a warm welcome email for new affiliate marketing newsletter subscribers. Include:
    - Friendly greeting
    - What they can expect
    - Free resource offer
    - Call to action to engage
    Keep it under 300 words, professional but friendly tone.`,
    
    nurture: `Create a nurturing email for affiliate marketing subscribers focusing on building trust and providing value. Include:
    - Helpful tip or insight
    - Personal story or case study
    - Soft product recommendation
    - Engagement question
    Keep it under 400 words.`,
    
    promotion: `Create a promotional email for affiliate marketing products. Include:
    - Compelling subject line
    - Problem/solution approach
    - Product benefits
    - Strong call to action
    - Urgency or scarcity element
    Keep it under 350 words.`,
    
    educational: `Create an educational email about affiliate marketing strategies. Include:
    - Actionable tip or strategy
    - Step-by-step guidance
    - Real-world example
    - Next steps
    Keep it under 450 words.`
  };

  const prompt = prompts[type] + (userInterests ? `\nUser interests: ${userInterests.join(', ')}` : '');

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '';
  
  // Extract subject line (assuming it's in the first line or marked)
  const lines = content.split('\n');
  const subjectLine = lines.find(line => 
    line.toLowerCase().includes('subject:') || 
    line.toLowerCase().includes('subject line:')
  );
  
  const subject = subjectLine 
    ? subjectLine.replace(/subject:?\s*/i, '').trim()
    : `${type.charAt(0).toUpperCase() + type.slice(1)} - Affiliate Marketing Insights`;

  return { subject, content };
}

// Email sequence templates
const emailSequences = {
  onboarding: [
    { type: 'welcome', delay: 0 },
    { type: 'educational', delay: 2 },
    { type: 'nurture', delay: 5 },
    { type: 'educational', delay: 8 },
    { type: 'promotion', delay: 12 },
    { type: 'nurture', delay: 16 },
    { type: 'educational', delay: 21 },
  ],
  
  nurture: [
    { type: 'educational', delay: 0 },
    { type: 'nurture', delay: 3 },
    { type: 'educational', delay: 7 },
    { type: 'promotion', delay: 10 },
  ],
  
  reengagement: [
    { type: 'nurture', delay: 0 },
    { type: 'educational', delay: 2 },
    { type: 'promotion', delay: 5 },
  ],
};

// Send individual email
async function sendEmail(
  to: string,
  subject: string,
  content: string,
  from: string = 'noreply@affiliateempire.com'
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Affiliate Empire</h1>
          </div>
          <div style="padding: 30px 20px;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              You're receiving this because you subscribed to Affiliate Empire.<br>
              <a href="{{unsubscribe_url}}" style="color: #6c757d;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Email send error:', error);
      return false;
    }

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return false;
  }
}

// Process email sequences
async function processEmailSequences(): Promise<void> {
  try {
    console.log('📧 Processing email sequences...');

    // Get subscribers who need emails
    const subscribers = await prisma.subscriber.findMany({
      where: {
        active: true,
        unsubscribed: false,
      },
    });

    console.log(`👥 Found ${subscribers.length} active subscribers`);

    for (const subscriber of subscribers) {
      const subscriptionDate = new Date(subscriber.createdAt);
      const daysSinceSubscription = Math.floor(
        (Date.now() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine which sequence to use
      let sequence = emailSequences.onboarding;
      if (daysSinceSubscription > 30) {
        sequence = emailSequences.nurture;
      }

      // Find the next email to send
      const nextEmail = sequence.find(email => 
        email.delay === daysSinceSubscription ||
        (email.delay < daysSinceSubscription && 
         !sequence.some(e => e.delay > email.delay && e.delay <= daysSinceSubscription))
      );

      if (nextEmail) {
        console.log(`📬 Sending ${nextEmail.type} email to ${subscriber.email}`);
        
        const { subject, content } = await generateEmailContent(
          nextEmail.type as any,
          subscriber.interests ? JSON.parse(subscriber.interests) : undefined
        );

        const success = await sendEmail(subscriber.email, subject, content);
        
        if (success) {
          // Log email sent
          await prisma.emailLog.create({
            data: {
              subscriberId: subscriber.id,
              subject,
              content,
              sentAt: new Date(),
              type: nextEmail.type,
            },
          });
        }

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('✅ Email sequence processing completed');
  } catch (error) {
    console.error('❌ Error processing email sequences:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Send broadcast email to all subscribers
async function sendBroadcast(subject: string, content: string): Promise<void> {
  try {
    console.log('📢 Sending broadcast email...');

    const subscribers = await prisma.subscriber.findMany({
      where: {
        active: true,
        unsubscribed: false,
      },
    });

    console.log(`👥 Sending to ${subscribers.length} subscribers`);

    for (const subscriber of subscribers) {
      await sendEmail(subscriber.email, subject, content);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    console.log('✅ Broadcast email completed');
  } catch (error) {
    console.error('❌ Error sending broadcast:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Generate and send weekly newsletter
async function sendWeeklyNewsletter(): Promise<void> {
  try {
    console.log('📰 Generating weekly newsletter...');

    // Get recent blog posts
    const recentPosts = await prisma.post.findMany({
      where: {
        published: true,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const { subject, content } = await generateEmailContent('educational');
    
    let newsletterContent = content;
    
    if (recentPosts.length > 0) {
      newsletterContent += '\n\n**This Week\'s Latest Posts:**\n\n';
      recentPosts.forEach(post => {
        newsletterContent += `• [${post.title}](https://affiliateempire.com/blog/${post.slug})\n`;
      });
    }

    await sendBroadcast(`Weekly Newsletter: ${subject}`, newsletterContent);
    
    console.log('✅ Weekly newsletter sent');
  } catch (error) {
    console.error('❌ Error sending newsletter:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'sequences':
      processEmailSequences();
      break;
    case 'newsletter':
      sendWeeklyNewsletter();
      break;
    case 'broadcast':
      const subject = process.argv[3];
      const content = process.argv[4];
      if (subject && content) {
        sendBroadcast(subject, content);
      } else {
        console.error('Usage: npm run email broadcast "Subject" "Content"');
      }
      break;
    default:
      processEmailSequences();
  }
}

export { processEmailSequences, sendBroadcast, sendWeeklyNewsletter };
