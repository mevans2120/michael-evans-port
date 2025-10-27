/**
 * Test Vector Search Functionality
 * Checks what's in the database and tests similarity search
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

// Load .env.local explicitly
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVectorSearch() {
  console.log('\n🔍 Testing Vector Database\n');

  // 1. Count total documents
  console.log('1. Checking database contents...');
  const { data: allDocs, error: countError } = await supabase
    .from('documents')
    .select('id, content, metadata', { count: 'exact' });

  if (countError) {
    console.error('❌ Error querying database:', countError);
    return;
  }

  console.log(`   ✅ Total documents in database: ${allDocs.length}`);

  // 2. Show sample documents
  if (allDocs.length > 0) {
    console.log('\n2. Sample documents:');
    allDocs.slice(0, 5).forEach((doc, idx) => {
      console.log(`\n   Document ${idx + 1}:`);
      console.log(`   - ID: ${doc.id}`);
      console.log(`   - Source: ${doc.metadata?.source || 'Unknown'}`);
      console.log(`   - Content preview: ${doc.content.substring(0, 100)}...`);
    });
  }

  // 3. Search for documents containing "Casa Bonita"
  console.log('\n3. Searching for "Casa Bonita" in content...');
  const { data: casaBonitaDocs, error: searchError } = await supabase
    .from('documents')
    .select('id, content, metadata')
    .ilike('content', '%Casa Bonita%');

  if (searchError) {
    console.error('❌ Error searching:', searchError);
  } else {
    console.log(`   Found ${casaBonitaDocs.length} documents mentioning "Casa Bonita"`);
    casaBonitaDocs.forEach((doc, idx) => {
      console.log(`\n   Match ${idx + 1}:`);
      console.log(`   - Source: ${doc.metadata?.source || 'Unknown'}`);
      console.log(`   - Content: ${doc.content.substring(0, 200)}...`);
    });
  }

  // 4. Test embedding generation and vector search
  console.log('\n4. Testing vector similarity search...');
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: 'Tell me about the Casa Bonita project'
    });

    console.log(`   ✅ Generated embedding (${embedding.length} dimensions)`);

    // Search using the embedding
    const { data: similarDocs, error: vectorError } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_threshold: 0.5, // Lower threshold for testing
        match_count: 5
      }
    );

    if (vectorError) {
      console.error('   ❌ Vector search error:', vectorError);
    } else {
      console.log(`   ✅ Vector search returned ${similarDocs.length} results`);
      similarDocs.forEach((doc, idx) => {
        console.log(`\n   Result ${idx + 1} (similarity: ${doc.similarity.toFixed(3)}):`);
        console.log(`   - Source: ${doc.metadata?.source || 'Unknown'}`);
        console.log(`   - Content: ${doc.content.substring(0, 150)}...`);
      });
    }
  } catch (error) {
    console.error('   ❌ Embedding generation error:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

testVectorSearch().catch(console.error);
