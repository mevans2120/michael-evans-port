/**
 * Test Supabase Connection and Database Content
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Count documents
    console.log('\n1. Counting documents...');
    const { count, error: countError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting documents:', countError);
      return false;
    }

    console.log(`✓ Total documents: ${count}`);

    // Test 2: Fetch sample documents
    console.log('\n2. Fetching sample documents...');
    const { data, error: fetchError } = await supabase
      .from('documents')
      .select('id, content, metadata')
      .limit(5);

    if (fetchError) {
      console.error('❌ Error fetching documents:', fetchError);
      return false;
    }

    console.log(`✓ Fetched ${data.length} documents:`);
    data.forEach((doc, i) => {
      console.log(`\n  Document ${i + 1}:`);
      console.log(`    ID: ${doc.id}`);
      console.log(`    Source: ${doc.metadata?.source || 'unknown'}`);
      console.log(`    Content preview: ${doc.content.substring(0, 100)}...`);
    });

    // Test 3: Test the match_documents function
    console.log('\n3. Testing match_documents RPC function...');

    // Create a dummy embedding (768 dimensions for text-embedding-004)
    const dummyEmbedding = Array(768).fill(0.1);

    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: dummyEmbedding,
      match_count: 3,
      match_threshold: 0.1,
    });

    if (matchError) {
      console.error('❌ Error testing match_documents:', matchError);
      return false;
    }

    console.log(`✓ match_documents returned ${matchData?.length || 0} results`);
    if (matchData && matchData.length > 0) {
      console.log(`  First match: ${matchData[0].content?.substring(0, 100) || 'N/A'}...`);
    }

    console.log('\n✅ All Supabase tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    return false;
  }
}

testConnection()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
