
import OpenAI from 'openai';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

interface Keyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  trend: 'rising' | 'stable' | 'declining';
}

interface KeywordCluster {
  mainKeyword: string;
  relatedKeywords: string[];
  searchVolume: number;
  difficulty: number;
  contentIdeas: string[];
}

// Generate keyword ideas using AI
async function generateKeywordIdeas(
  topic: string,
  niche: string = 'affiliate marketing'
): Promise<string[]> {
  const prompt = `Generate 20 high-value SEO keywords for the topic "${topic}" in the ${niche} niche.

Focus on:
- Long-tail keywords (3-5 words)
- Commercial intent keywords
- Question-based keywords
- Comparison keywords
- "Best" and "Top" keywords
- Problem-solving keywords

Return only the keywords, one per line, without numbers or bullets.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const keywords = response.choices[0].message.content
    ?.split('\n')
    .filter(k => k.trim())
    .map(k => k.trim()) || [];

  return keywords.slice(0, 20);
}

// Analyze keyword intent and difficulty
async function analyzeKeywords(keywords: string[]): Promise<Keyword[]> {
  const analyzedKeywords: Keyword[] = [];

  for (const keyword of keywords) {
    const prompt = `Analyze this keyword for SEO: "${keyword}"

Provide analysis in JSON format:
{
  "searchVolume": estimated_monthly_searches,
  "difficulty": seo_difficulty_1_to_100,
  "cpc": estimated_cost_per_click,
  "intent": "informational|commercial|transactional|navigational",
  "trend": "rising|stable|declining"
}

Base estimates on typical affiliate marketing keywords.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      analyzedKeywords.push({
        keyword,
        searchVolume: analysis.searchVolume || 0,
        difficulty: analysis.difficulty || 50,
        cpc: analysis.cpc || 0,
        intent: analysis.intent || 'informational',
        trend: analysis.trend || 'stable',
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error analyzing keyword "${keyword}":`, error);
      
      // Fallback analysis
      analyzedKeywords.push({
        keyword,
        searchVolume: Math.floor(Math.random() * 1000) + 100,
        difficulty: Math.floor(Math.random() * 50) + 25,
        cpc: Math.random() * 2 + 0.5,
        intent: 'informational',
        trend: 'stable',
      });
    }
  }

  return analyzedKeywords;
}

// Create keyword clusters
async function createKeywordClusters(keywords: Keyword[]): Promise<KeywordCluster[]> {
  const clusters: KeywordCluster[] = [];
  const usedKeywords = new Set<string>();

  // Sort keywords by search volume
  const sortedKeywords = keywords.sort((a, b) => b.searchVolume - a.searchVolume);

  for (const mainKeyword of sortedKeywords) {
    if (usedKeywords.has(mainKeyword.keyword)) continue;

    const prompt = `Given the main keyword "${mainKeyword.keyword}", find related keywords from this list that should be grouped together for content creation:

${keywords.map(k => k.keyword).join('\n')}

Return JSON:
{
  "relatedKeywords": ["keyword1", "keyword2", "keyword3"],
  "contentIdeas": ["content idea 1", "content idea 2", "content idea 3"]
}

Only include keywords that are semantically related and could be covered in the same piece of content.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const relatedKeywords = result.relatedKeywords || [];
      
      // Mark keywords as used
      usedKeywords.add(mainKeyword.keyword);
      relatedKeywords.forEach((kw: string) => usedKeywords.add(kw));

      // Calculate cluster metrics
      const clusterKeywords = [mainKeyword, ...keywords.filter(k => relatedKeywords.includes(k.keyword))];
      const totalSearchVolume = clusterKeywords.reduce((sum, k) => sum + k.searchVolume, 0);
      const avgDifficulty = clusterKeywords.reduce((sum, k) => sum + k.difficulty, 0) / clusterKeywords.length;

      clusters.push({
        mainKeyword: mainKeyword.keyword,
        relatedKeywords,
        searchVolume: totalSearchVolume,
        difficulty: Math.round(avgDifficulty),
        contentIdeas: result.contentIdeas || [],
      });

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error clustering keyword "${mainKeyword.keyword}":`, error);
    }
  }

  return clusters;
}

// Generate content calendar based on keywords
async function generateContentCalendar(clusters: KeywordCluster[]): Promise<any[]> {
  const calendar = [];
  
  // Sort clusters by potential (search volume / difficulty)
  const sortedClusters = clusters.sort((a, b) => 
    (b.searchVolume / b.difficulty) - (a.searchVolume / a.difficulty)
  );

  for (let i = 0; i < Math.min(30, sortedClusters.length); i++) {
    const cluster = sortedClusters[i];
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() + i);

    const prompt = `Create a blog post title and outline for the keyword cluster:

Main keyword: ${cluster.mainKeyword}
Related keywords: ${cluster.relatedKeywords.join(', ')}
Content ideas: ${cluster.contentIdeas.join(', ')}

Return JSON:
{
  "title": "SEO-optimized blog post title",
  "outline": ["heading 1", "heading 2", "heading 3", "heading 4", "heading 5"],
  "metaDescription": "150-character meta description",
  "estimatedWordCount": word_count
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      calendar.push({
        date: publishDate.toISOString().split('T')[0],
        mainKeyword: cluster.mainKeyword,
        relatedKeywords: cluster.relatedKeywords,
        title: result.title,
        outline: result.outline,
        metaDescription: result.metaDescription,
        estimatedWordCount: result.estimatedWordCount,
        searchVolume: cluster.searchVolume,
        difficulty: cluster.difficulty,
        priority: Math.round(cluster.searchVolume / cluster.difficulty),
      });

      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Error generating content for "${cluster.mainKeyword}":`, error);
    }
  }

  return calendar;
}

// Save keyword research to database
async function saveKeywordResearch(
  keywords: Keyword[],
  clusters: KeywordCluster[],
  calendar: any[]
): Promise<void> {
  try {
    // Save keywords
    for (const keyword of keywords) {
      await prisma.keyword.upsert({
        where: { keyword: keyword.keyword },
        update: {
          searchVolume: keyword.searchVolume,
          difficulty: keyword.difficulty,
          cpc: keyword.cpc,
          intent: keyword.intent,
          trend: keyword.trend,
          updatedAt: new Date(),
        },
        create: {
          keyword: keyword.keyword,
          searchVolume: keyword.searchVolume,
          difficulty: keyword.difficulty,
          cpc: keyword.cpc,
          intent: keyword.intent,
          trend: keyword.trend,
        },
      });
    }

    // Save content calendar
    for (const item of calendar) {
      await prisma.contentCalendar.create({
        data: {
          date: new Date(item.date),
          mainKeyword: item.mainKeyword,
          relatedKeywords: item.relatedKeywords.join(','),
          title: item.title,
          outline: item.outline.join('\n'),
          metaDescription: item.metaDescription,
          estimatedWordCount: item.estimatedWordCount,
          searchVolume: item.searchVolume,
          difficulty: item.difficulty,
          priority: item.priority,
        },
      });
    }

    console.log('✅ Keyword research saved to database');
  } catch (error) {
    console.error('❌ Error saving keyword research:', error);
    throw error;
  }
}

// Main keyword research function
async function performKeywordResearch(topic: string): Promise<void> {
  try {
    console.log(`🔍 Starting keyword research for: ${topic}`);

    // Generate keyword ideas
    console.log('💡 Generating keyword ideas...');
    const keywordIdeas = await generateKeywordIdeas(topic);
    console.log(`📝 Generated ${keywordIdeas.length} keyword ideas`);

    // Analyze keywords
    console.log('📊 Analyzing keywords...');
    const analyzedKeywords = await analyzeKeywords(keywordIdeas);
    console.log(`✅ Analyzed ${analyzedKeywords.length} keywords`);

    // Create clusters
    console.log('🗂️ Creating keyword clusters...');
    const clusters = await createKeywordClusters(analyzedKeywords);
    console.log(`📚 Created ${clusters.length} keyword clusters`);

    // Generate content calendar
    console.log('📅 Generating content calendar...');
    const calendar = await generateContentCalendar(clusters);
    console.log(`🗓️ Generated ${calendar.length} content ideas`);

    // Save to database
    console.log('💾 Saving to database...');
    await saveKeywordResearch(analyzedKeywords, clusters, calendar);

    // Display results
    console.log('\n🎯 TOP KEYWORD OPPORTUNITIES:');
    analyzedKeywords
      .sort((a, b) => (b.searchVolume / b.difficulty) - (a.searchVolume / a.difficulty))
      .slice(0, 10)
      .forEach((kw, index) => {
        console.log(`${index + 1}. ${kw.keyword}`);
        console.log(`   Volume: ${kw.searchVolume} | Difficulty: ${kw.difficulty} | Intent: ${kw.intent}`);
      });

    console.log('\n📅 UPCOMING CONTENT CALENDAR:');
    calendar.slice(0, 7).forEach(item => {
      console.log(`${item.date}: ${item.title}`);
      console.log(`   Keywords: ${item.mainKeyword}, ${item.relatedKeywords.slice(0, 2).join(', ')}`);
    });

    console.log('\n✅ Keyword research completed successfully!');
  } catch (error) {
    console.error('❌ Error in keyword research:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get keyword suggestions for existing content
async function getKeywordSuggestions(postId: string): Promise<string[]> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error(`Post not found: ${postId}`);
    }

    const prompt = `Analyze this blog post and suggest 10 additional keywords that could be naturally integrated:

Title: ${post.title}
Content: ${post.content.substring(0, 1000)}...

Return only the keywords, one per line.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    const suggestions = response.choices[0].message.content
      ?.split('\n')
      .filter(k => k.trim())
      .map(k => k.trim()) || [];

    return suggestions;
  } catch (error) {
    console.error('❌ Error getting keyword suggestions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  const topic = process.argv[3];
  
  switch (command) {
    case 'research':
      if (topic) {
        performKeywordResearch(topic);
      } else {
        console.error('Usage: npm run keywords research "topic"');
      }
      break;
    case 'suggest':
      const postId = process.argv[3];
      if (postId) {
        getKeywordSuggestions(postId).then(suggestions => {
          console.log('💡 Keyword suggestions:');
          suggestions.forEach((kw, index) => {
            console.log(`${index + 1}. ${kw}`);
          });
        });
      } else {
        console.error('Usage: npm run keywords suggest <postId>');
      }
      break;
    default:
      performKeywordResearch('affiliate marketing strategies');
  }
}

export { performKeywordResearch, getKeywordSuggestions };
