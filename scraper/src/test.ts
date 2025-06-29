import { scrapeTwitterProfile } from './lib/scraper';

async function test() {
  console.log('🧪 Testing Twitter scraper...');
  
  try {
    const result = await scrapeTwitterProfile('elonmusk');
    
    if (result) {
      console.log('✅ Scraping successful:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Scraping failed');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
