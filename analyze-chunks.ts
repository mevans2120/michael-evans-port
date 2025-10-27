/**
 * Analyze chunks in the vector database
 * Identify which chunks are not associated with specific projects
 */

import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Project keywords to look for
const projectKeywords = [
  'Virgin America',
  'Before Launcher',
  'Beforelab',
  'Casa Bonita',
  'Target',
  'Pedal',
  'PostPal',
  'MLB',
  'Major League Baseball',
  'Alaska Airlines',
  'Huge',
  'Work & Co',
  'Work and Co',
  'Broadway.com',
  'House Logic',
  'NAR',
  'National Association of Realtors',
  'Aesop',
  'Isop',
  'HBO Go',
  'Fox',
  'Lyft',
  'Odopod',
  'Sony',
  'Leapfrog'
];

async function analyzeChunks() {
  console.log('🔍 Analyzing chunks in vector database...\n');

  // Fetch all documents
  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, content, metadata');

  if (error) {
    console.error('Error fetching documents:', error);
    return;
  }

  console.log(`📊 Total chunks: ${documents?.length || 0}\n`);

  // Categorize chunks
  const unassociated: typeof documents = [];
  const associated: typeof documents = [];
  const projectCounts: Record<string, number> = {};

  documents?.forEach(doc => {
    const content = doc.content.toLowerCase();
    let hasProject = false;

    for (const keyword of projectKeywords) {
      if (content.includes(keyword.toLowerCase())) {
        hasProject = true;
        projectCounts[keyword] = (projectCounts[keyword] || 0) + 1;
      }
    }

    if (hasProject) {
      associated.push(doc);
    } else {
      unassociated.push(doc);
    }
  });

  console.log('📈 Chunks by Category:\n');
  console.log(`  ✅ Associated with projects: ${associated.length}`);
  console.log(`  ⚠️  Not associated with projects: ${unassociated.length}\n`);

  console.log('📊 Chunks by Project:\n');
  Object.entries(projectCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([project, count]) => {
      console.log(`  - ${project}: ${count} chunks`);
    });

  console.log('\n🔍 Sample Unassociated Chunks:\n');
  unassociated.slice(0, 10).forEach((doc, index) => {
    console.log(`${index + 1}. Source: ${doc.metadata.source}`);
    console.log(`   Content preview: ${doc.content.substring(0, 150)}...`);
    console.log('');
  });

  // Breakdown by source
  console.log('\n📂 Unassociated Chunks by Source:\n');
  const sourceBreakdown: Record<string, number> = {};
  unassociated.forEach(doc => {
    const source = doc.metadata.source || 'unknown';
    sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
  });

  Object.entries(sourceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .forEach(([source, count]) => {
      console.log(`  - ${source}: ${count} chunks`);
    });

  // Summary
  console.log('\n📋 Summary:\n');
  const percentAssociated = ((associated.length / (documents?.length || 1)) * 100).toFixed(1);
  console.log(`  ${percentAssociated}% of chunks are associated with specific projects`);
  console.log(`  ${unassociated.length} chunks need project association review\n`);

  return {
    total: documents?.length || 0,
    associated: associated.length,
    unassociated: unassociated.length,
    unassociatedChunks: unassociated,
  };
}

analyzeChunks().catch(console.error);
