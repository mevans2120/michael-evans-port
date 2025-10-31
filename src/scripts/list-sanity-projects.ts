import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function listProjects() {
  const projects = await client.fetch(`
    *[_type == "project"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      category,
      featured,
      order
    }
  `);

  console.log('\n📋 Current Projects in Sanity:\n');
  console.log('Title'.padEnd(55) + 'Slug'.padEnd(25) + 'Featured'.padEnd(15) + 'ID');
  console.log('='.repeat(120));

  projects.forEach((p: any) => {
    const featuredStr = p.featured ? `Yes (${p.order || '?'})` : 'No';
    console.log(
      (p.title || 'Untitled').substring(0, 54).padEnd(55) +
      (p.slug || 'no-slug').substring(0, 24).padEnd(25) +
      featuredStr.padEnd(15) +
      p._id
    );
  });

  console.log('\n📊 Total projects: ' + projects.length);

  // Check for potential duplicates
  const slugs = projects.map((p: any) => p.slug).filter(Boolean);
  const duplicateSlugs = slugs.filter((slug: string, index: number) => slugs.indexOf(slug) !== index);

  if (duplicateSlugs.length > 0) {
    console.log('\n⚠️  Potential duplicate slugs found:');
    duplicateSlugs.forEach((slug: string) => console.log(`   - ${slug}`));
  }
}

listProjects().catch(console.error);
