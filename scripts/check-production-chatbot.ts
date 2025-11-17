import { createClient } from '@supabase/supabase-js';

// Production Supabase credentials from .env.local
const supabaseUrl = 'https://kbppccutslxshkmaaagf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticHBjY3V0c2x4c2hrbWFhYWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM5NjU0MCwiZXhwIjoyMDc2OTcyNTQwfQ.Dq0PvruC7QUWSWCAK-bTBu7nTwQP_ooMgSg9XAy5z_4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductionContent() {
  console.log('🔍 Checking Production Chatbot Content...\n');
  console.log('===============================================\n');

  // Get total document count
  const { count: totalDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Total chunks in production database: ${totalDocs}`);

  // Get unique source IDs and metadata
  const { data: sources, error } = await supabase
    .from('documents')
    .select('source_id, metadata')
    .not('source_id', 'is', null);

  if (error) {
    console.error('Error fetching sources:', error);
    return;
  }

  // Count unique sources
  const uniqueSources = new Set(sources?.map(s => s.source_id) || []);
  console.log(`📄 Unique source documents: ${uniqueSources.size}`);

  // Count by category
  const categories: Record<string, number> = {};
  sources?.forEach(s => {
    const category = s.metadata?.category || 'unknown';
    categories[category] = (categories[category] || 0) + 1;
  });

  console.log('\n📂 Production chunks by category:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} chunks`);
    });

  // Check for Sanity content specifically
  const sanitySources = Array.from(uniqueSources).filter(id =>
    id.startsWith('sanity-') || id.includes('project-') || id.includes('profile-') || id.includes('aiProject-')
  );

  console.log(`\n🎨 Sanity CMS documents in production: ${sanitySources.length}`);
  if (sanitySources.length > 0) {
    console.log('   ✅ Sanity content IS present in production');
  } else {
    console.log('   ❌ No Sanity content found - may need webhook setup');
  }

  // Check for transcript content
  const transcriptSources = Array.from(uniqueSources).filter(id =>
    id.includes('transcript-') || id.includes('.md')
  );

  console.log(`📝 Transcript documents in production: ${transcriptSources.length}`);

  // Get last sync time
  const { data: latest } = await supabase
    .from('documents')
    .select('last_synced')
    .not('last_synced', 'is', null)
    .order('last_synced', { ascending: false })
    .limit(1);

  if (latest && latest[0]) {
    const lastSync = new Date(latest[0].last_synced);
    console.log(`\n⏰ Last sync: ${lastSync.toISOString()}`);

    const hoursSince = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      console.log(`   ✅ Sync is current (${hoursSince.toFixed(1)} hours ago)`);
    } else {
      console.log(`   ⚠️  Last sync was ${hoursSince.toFixed(1)} hours ago`);
    }
  } else {
    console.log('\n⚠️  No sync timestamp found');
  }

  // Compare with local
  console.log('\n===============================================');
  console.log('📊 Comparison:');
  console.log(`   Local (just synced): 242 chunks`);
  console.log(`   Production: ${totalDocs} chunks`);

  if (totalDocs && totalDocs < 200) {
    console.log('\n⚠️  Production appears to be missing content!');
    console.log('   Possible issues:');
    console.log('   - Sanity webhooks not configured');
    console.log('   - Initial ingestion never ran in production');
    console.log('   - Environment variables not set in Vercel');
  } else if (totalDocs && totalDocs >= 240) {
    console.log('\n✅ Production content looks complete!');
  }

  console.log('\n===============================================');
}

checkProductionContent().catch(console.error);