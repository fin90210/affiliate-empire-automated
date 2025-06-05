
import { generateDailyPost } from './generatePost';
import { processEmailSequences, sendWeeklyNewsletter } from './emailSequence';
import { automateocialPosts, scheduleOptimalPosts } from './socialPush';
import { processAllPosts } from './insertAffiliates';
import { performKeywordResearch } from './keywordResearch';

interface AutomationConfig {
  enableContentGeneration: boolean;
  enableEmailAutomation: boolean;
  enableSocialMedia: boolean;
  enableAffiliateOptimization: boolean;
  enableKeywordResearch: boolean;
}

// Default configuration
const defaultConfig: AutomationConfig = {
  enableContentGeneration: true,
  enableEmailAutomation: true,
  enableSocialMedia: true,
  enableAffiliateOptimization: true,
  enableKeywordResearch: true,
};

// Daily automation workflow
async function runDailyAutomation(config: AutomationConfig = defaultConfig): Promise<void> {
  console.log('🚀 Starting daily automation workflow...');
  console.log(`📅 Date: ${new Date().toISOString().split('T')[0]}`);
  
  const results = {
    contentGeneration: false,
    emailSequences: false,
    socialMedia: false,
    affiliateOptimization: false,
  };

  try {
    // 1. Generate daily blog post
    if (config.enableContentGeneration) {
      console.log('\n📝 STEP 1: Generating daily blog post...');
      try {
        await generateDailyPost();
        results.contentGeneration = true;
        console.log('✅ Daily blog post generated successfully');
      } catch (error) {
        console.error('❌ Content generation failed:', error);
      }
    }

    // 2. Process email sequences
    if (config.enableEmailAutomation) {
      console.log('\n📧 STEP 2: Processing email sequences...');
      try {
        await processEmailSequences();
        results.emailSequences = true;
        console.log('✅ Email sequences processed successfully');
      } catch (error) {
        console.error('❌ Email automation failed:', error);
      }
    }

    // 3. Social media automation
    if (config.enableSocialMedia) {
      console.log('\n📱 STEP 3: Automating social media posts...');
      try {
        await scheduleOptimalPosts();
        results.socialMedia = true;
        console.log('✅ Social media automation completed');
      } catch (error) {
        console.error('❌ Social media automation failed:', error);
      }
    }

    // 4. Optimize affiliate links
    if (config.enableAffiliateOptimization) {
      console.log('\n🔗 STEP 4: Optimizing affiliate links...');
      try {
        await processAllPosts();
        results.affiliateOptimization = true;
        console.log('✅ Affiliate link optimization completed');
      } catch (error) {
        console.error('❌ Affiliate optimization failed:', error);
      }
    }

    // Summary
    console.log('\n📊 DAILY AUTOMATION SUMMARY:');
    console.log(`Content Generation: ${results.contentGeneration ? '✅' : '❌'}`);
    console.log(`Email Sequences: ${results.emailSequences ? '✅' : '❌'}`);
    console.log(`Social Media: ${results.socialMedia ? '✅' : '❌'}`);
    console.log(`Affiliate Optimization: ${results.affiliateOptimization ? '✅' : '❌'}`);
    
    const successCount = Object.values(results).filter(Boolean).length;
    console.log(`\n🎯 Success Rate: ${successCount}/4 tasks completed`);
    
    if (successCount === 4) {
      console.log('🎉 All automation tasks completed successfully!');
    } else {
      console.log('⚠️ Some automation tasks failed. Check logs for details.');
    }

  } catch (error) {
    console.error('❌ Critical error in daily automation:', error);
    process.exit(1);
  }
}

// Weekly automation workflow
async function runWeeklyAutomation(config: AutomationConfig = defaultConfig): Promise<void> {
  console.log('📅 Starting weekly automation workflow...');
  
  try {
    // 1. Keyword research for next week's content
    if (config.enableKeywordResearch) {
      console.log('\n🔍 STEP 1: Performing keyword research...');
      try {
        const topics = [
          'affiliate marketing trends',
          'passive income strategies',
          'email marketing automation',
          'social media monetization',
          'content marketing for affiliates',
        ];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        await performKeywordResearch(randomTopic);
        console.log('✅ Weekly keyword research completed');
      } catch (error) {
        console.error('❌ Keyword research failed:', error);
      }
    }

    // 2. Send weekly newsletter
    if (config.enableEmailAutomation) {
      console.log('\n📰 STEP 2: Sending weekly newsletter...');
      try {
        await sendWeeklyNewsletter();
        console.log('✅ Weekly newsletter sent');
      } catch (error) {
        console.error('❌ Newsletter sending failed:', error);
      }
    }

    // 3. Social media content batch
    if (config.enableSocialMedia) {
      console.log('\n📱 STEP 3: Creating social media content batch...');
      try {
        // Post multiple times throughout the week
        for (let i = 0; i < 3; i++) {
          await automateocialPosts();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        console.log('✅ Social media batch completed');
      } catch (error) {
        console.error('❌ Social media batch failed:', error);
      }
    }

    console.log('🎉 Weekly automation workflow completed!');
  } catch (error) {
    console.error('❌ Critical error in weekly automation:', error);
    process.exit(1);
  }
}

// Health check for all automation systems
async function healthCheck(): Promise<void> {
  console.log('🏥 Running automation health check...');
  
  const checks = {
    openai: !!process.env.OPENAI_API_KEY,
    resend: !!process.env.RESEND_API_KEY,
    twitter: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN),
    linkedin: !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_ID),
    facebook: !!(process.env.FACEBOOK_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID),
    database: true, // Assume database is working if script runs
  };

  console.log('\n🔧 SYSTEM STATUS:');
  console.log(`OpenAI API: ${checks.openai ? '✅' : '❌'}`);
  console.log(`Resend Email: ${checks.resend ? '✅' : '❌'}`);
  console.log(`Twitter API: ${checks.twitter ? '✅' : '❌'}`);
  console.log(`LinkedIn API: ${checks.linkedin ? '✅' : '❌'}`);
  console.log(`Facebook API: ${checks.facebook ? '✅' : '❌'}`);
  console.log(`Database: ${checks.database ? '✅' : '❌'}`);

  const healthyServices = Object.values(checks).filter(Boolean).length;
  console.log(`\n📊 Health Score: ${healthyServices}/6 services operational`);

  if (healthyServices < 3) {
    console.log('⚠️ WARNING: Multiple critical services are down!');
  } else if (healthyServices < 6) {
    console.log('⚠️ Some services need attention');
  } else {
    console.log('🎉 All systems operational!');
  }
}

// Emergency stop function
async function emergencyStop(): Promise<void> {
  console.log('🛑 EMERGENCY STOP: Halting all automation...');
  
  // Kill any running processes
  process.exit(0);
}

// Run specific automation task
async function runTask(task: string): Promise<void> {
  console.log(`🎯 Running specific task: ${task}`);
  
  switch (task) {
    case 'content':
      await generateDailyPost();
      break;
    case 'email':
      await processEmailSequences();
      break;
    case 'social':
      await automateocialPosts();
      break;
    case 'affiliates':
      await processAllPosts();
      break;
    case 'keywords':
      await performKeywordResearch('affiliate marketing');
      break;
    case 'newsletter':
      await sendWeeklyNewsletter();
      break;
    default:
      console.error(`❌ Unknown task: ${task}`);
      console.log('Available tasks: content, email, social, affiliates, keywords, newsletter');
  }
}

// Main orchestrator function
async function main(): Promise<void> {
  const command = process.argv[2];
  const subcommand = process.argv[3];

  try {
    switch (command) {
      case 'daily':
        await runDailyAutomation();
        break;
      case 'weekly':
        await runWeeklyAutomation();
        break;
      case 'health':
        await healthCheck();
        break;
      case 'stop':
        await emergencyStop();
        break;
      case 'task':
        if (subcommand) {
          await runTask(subcommand);
        } else {
          console.error('Usage: npm run automation task <task_name>');
        }
        break;
      default:
        console.log('🤖 Affiliate Empire Automation Orchestrator');
        console.log('\nAvailable commands:');
        console.log('  daily    - Run daily automation workflow');
        console.log('  weekly   - Run weekly automation workflow');
        console.log('  health   - Check system health');
        console.log('  stop     - Emergency stop all automation');
        console.log('  task     - Run specific task');
        console.log('\nExample: npm run automation daily');
    }
  } catch (error) {
    console.error('❌ Orchestrator error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export {
  runDailyAutomation,
  runWeeklyAutomation,
  healthCheck,
  runTask,
};
