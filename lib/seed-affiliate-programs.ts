
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export async function seedAffiliatePrograms() {
  console.log('🌱 Seeding affiliate programs...');
  
  try {
    // Load affiliate programs data
    const dataPath = path.join(__dirname, '../top_affiliate_programs_2025.json');
    const affiliatePrograms = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Clear existing affiliate links
    await prisma.affiliateLink.deleteMany();
    
    // Insert affiliate programs from research data
    for (const program of affiliatePrograms.programs) {
      await prisma.affiliateLink.create({
        data: {
          name: program.program,
          url: `https://affiliate.${program.program.toLowerCase().replace(/\s+/g, '')}.com`, // Placeholder URL
          category: program.niche,
          description: `${program.why_performing_well} - Commission: ${program.commission_rate}`,
          active: true,
        },
      });
    }
    
    console.log(`✅ Successfully seeded ${affiliatePrograms.programs.length} affiliate programs`);
  } catch (error) {
    console.error('❌ Error seeding affiliate programs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedAffiliatePrograms()
    .then(() => {
      console.log('🎉 Affiliate programs seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
