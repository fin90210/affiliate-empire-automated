
import { prisma } from './db'

export async function seedDatabase() {
  try {
    // Create sample blog posts
    const samplePosts = [
      {
        title: "5 Morning Habits That Will Transform Your Health",
        slug: "5-morning-habits-transform-health",
        content: `
          <h2>Start Your Day Right</h2>
          <p>Your morning routine sets the tone for your entire day. These five scientifically-backed habits can dramatically improve your physical and mental well-being.</p>
          
          <h3>1. Hydrate Immediately</h3>
          <p>Drink 16-20 ounces of water as soon as you wake up. Your body has been fasting for 6-8 hours and needs hydration to kickstart your metabolism.</p>
          
          <h3>2. Practice Gratitude</h3>
          <p>Spend 5 minutes writing down three things you're grateful for. This simple practice rewires your brain for positivity and reduces stress hormones.</p>
          
          <h3>3. Move Your Body</h3>
          <p>Even 10 minutes of light exercise or stretching increases blood flow, releases endorphins, and boosts energy levels for the day.</p>
          
          <h3>4. Eat Protein First</h3>
          <p>Start with 20-30 grams of protein to stabilize blood sugar, reduce cravings, and maintain steady energy throughout the morning.</p>
          
          <h3>5. Avoid Your Phone</h3>
          <p>Keep your phone away for the first hour. This protects your mental clarity and prevents reactive thinking patterns.</p>
          
          <p>Implement these habits gradually, one at a time, for lasting transformation.</p>
        `,
        excerpt: "Discover the five scientifically-backed morning habits that successful people use to transform their health and energy levels.",
        category: "health",
        tags: ["morning routine", "health", "wellness", "habits"],
        published: true
      },
      {
        title: "The Millionaire Mindset: 7 Wealth-Building Principles",
        slug: "millionaire-mindset-wealth-building-principles",
        content: `
          <h2>Think Like the Wealthy</h2>
          <p>Building wealth isn't just about money—it's about developing the right mindset. Here are the core principles that separate the wealthy from everyone else.</p>
          
          <h3>1. Pay Yourself First</h3>
          <p>Before paying any bills, save and invest at least 20% of your income. This forces you to live below your means and builds wealth automatically.</p>
          
          <h3>2. Focus on Assets, Not Liabilities</h3>
          <p>Rich people buy assets that generate income. Poor people buy liabilities they think are assets. Learn the difference.</p>
          
          <h3>3. Multiple Income Streams</h3>
          <p>The average millionaire has 7 income streams. Diversify your income to reduce risk and accelerate wealth building.</p>
          
          <h3>4. Invest in Yourself</h3>
          <p>Your earning ability is your greatest asset. Continuously invest in education, skills, and personal development.</p>
          
          <h3>5. Think Long-Term</h3>
          <p>Wealth building is a marathon, not a sprint. Make decisions based on 10-year outcomes, not immediate gratification.</p>
          
          <h3>6. Surround Yourself with Success</h3>
          <p>Your network determines your net worth. Associate with people who challenge and inspire you to grow.</p>
          
          <h3>7. Take Calculated Risks</h3>
          <p>Playing it safe is the riskiest thing you can do. Learn to evaluate and take intelligent risks for exponential returns.</p>
        `,
        excerpt: "Learn the 7 fundamental principles that millionaires use to build and maintain wealth, regardless of their starting point.",
        category: "wealth",
        tags: ["wealth building", "mindset", "investing", "financial freedom"],
        published: true
      },
      {
        title: "The Art of Deep Connection: Building Meaningful Relationships",
        slug: "art-deep-connection-meaningful-relationships",
        content: `
          <h2>Beyond Surface-Level Interactions</h2>
          <p>In our digital age, genuine human connection has become rare. Here's how to build relationships that truly matter.</p>
          
          <h3>Listen to Understand, Not to Reply</h3>
          <p>Most people listen with the intent to respond. Instead, listen to truly understand the other person's perspective and emotions.</p>
          
          <h3>Be Vulnerable First</h3>
          <p>Vulnerability creates connection. Share your authentic self, including struggles and fears, to invite others to do the same.</p>
          
          <h3>Ask Better Questions</h3>
          <p>Move beyond "How was your day?" Ask questions that reveal values, dreams, and what truly matters to the person.</p>
          
          <h3>Practice Emotional Intelligence</h3>
          <p>Recognize and respond to emotions—both yours and others'. This skill is crucial for deep, lasting relationships.</p>
          
          <h3>Show Up Consistently</h3>
          <p>Relationships require consistent investment. Small, regular gestures matter more than grand, infrequent ones.</p>
          
          <h3>Create Shared Experiences</h3>
          <p>Bond through activities, challenges, and adventures. Shared experiences create lasting memories and stronger connections.</p>
          
          <p>Remember: Quality over quantity. A few deep relationships are worth more than hundreds of shallow ones.</p>
        `,
        excerpt: "Master the art of building deep, meaningful relationships that enrich your life and create lasting connections.",
        category: "relationships",
        tags: ["relationships", "communication", "emotional intelligence", "connection"],
        published: true
      }
    ]

    // Create sample affiliate links
    const sampleAffiliateLinks = [
      {
        name: "Premium Fitness Program",
        url: "https://example.com/fitness-program",
        category: "health",
        description: "Complete 12-week transformation program with nutrition and workout plans",
        clicks: 45,
        conversions: 8,
        earnings: 320.00
      },
      {
        name: "Investment Masterclass",
        url: "https://example.com/investment-course",
        category: "wealth",
        description: "Learn to invest like a pro with this comprehensive course",
        clicks: 78,
        conversions: 12,
        earnings: 840.00
      },
      {
        name: "Communication Skills Course",
        url: "https://example.com/communication-course",
        category: "relationships",
        description: "Master the art of effective communication in all relationships",
        clicks: 32,
        conversions: 6,
        earnings: 180.00
      },
      {
        name: "Meditation App Premium",
        url: "https://example.com/meditation-app",
        category: "health",
        description: "Premium meditation app with guided sessions and sleep stories",
        clicks: 67,
        conversions: 15,
        earnings: 225.00
      },
      {
        name: "Real Estate Investment Guide",
        url: "https://example.com/real-estate-guide",
        category: "wealth",
        description: "Complete guide to real estate investing for beginners",
        clicks: 89,
        conversions: 18,
        earnings: 720.00
      }
    ]

    // Seed blog posts
    for (const post of samplePosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: post,
        create: post
      })
    }

    // Seed affiliate links
    for (const link of sampleAffiliateLinks) {
      await prisma.affiliateLink.create({
        data: link
      })
    }

    // Create sample analytics data
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      await prisma.analytics.create({
        data: {
          page: '/',
          views: Math.floor(Math.random() * 100) + 50,
          date
        }
      })

      await prisma.analytics.create({
        data: {
          page: '/blog',
          views: Math.floor(Math.random() * 50) + 20,
          date
        }
      })
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
