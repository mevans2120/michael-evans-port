/**
 * Check what content is actually in Sanity sections
 */
import { client } from '@/lib/sanity/client';

async function checkSections() {
  const profile = await client.fetch(`
    *[_type == "profile"][0] {
      sections[] {
        _key,
        heading,
        "contentLength": length(content),
        "contentBlocks": length(content),
        "firstBlock": content[0],
        "hasContent": defined(content) && length(content) > 0
      }
    }
  `);

  console.log('\n📊 Section Content Analysis:\n');
  console.log('================================\n');

  if (profile?.sections) {
    profile.sections.forEach((section: any, index: number) => {
      console.log(`Section ${index + 1}: ${section.heading}`);
      console.log(`  Has content: ${section.hasContent}`);
      console.log(`  Content blocks: ${section.contentBlocks || 0}`);
      if (section.firstBlock) {
        console.log(`  First block type: ${section.firstBlock._type}`);
        if (section.firstBlock.children) {
          const text = section.firstBlock.children[0]?.text || '';
          console.log(`  Text preview: ${text.substring(0, 100)}...`);
        }
      }
      console.log('');
    });
  } else {
    console.log('No sections found!');
  }
}

checkSections().catch(console.error);
