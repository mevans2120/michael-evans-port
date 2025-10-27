/**
 * Test Casa Bonita Query with Updated Threshold
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testCasaBonita() {
  console.log('\n🔍 Testing Casa Bonita Context Retrieval\n');

  const query = 'Tell me about the Casa Bonita project';

  // Generate embedding
  const { embedding } = await embed({
    model: google.textEmbeddingModel('text-embedding-004'),
    value: query
  });

  console.log('Query:', query);
  console.log('Embedding dimensions:', embedding.length);

  // Search with lower threshold
  const { data: results, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5
  });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\n✅ Found ${results.length} relevant documents:\n`);

  results.forEach((doc, idx) => {
    console.log(`--- Document ${idx + 1} (similarity: ${doc.similarity.toFixed(3)}) ---`);
    console.log(`Source: ${doc.metadata?.source || 'Unknown'}`);
    console.log(`Content:\n${doc.content}\n`);
  });

  console.log('='.repeat(60));
}

testCasaBonita();
