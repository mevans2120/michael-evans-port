/**
 * Detailed analysis of "projects" source chunks
 * Identify which chunks mention projects but don't use explicit names
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

// Indicators that content is about a project
const projectIndicators = [
  'worked on',
  'worked with',
  'project',
  'client',
  'website',
  'app',
  'application',
  'product',
  'built',
  'designed',
  'launched',
  'shipped',
  'developed',
  'team',
  'booking',
  'e-commerce',
  'platform',
  'dashboard',
  'interface',
  'airline',
  'restaurant',
  'launcher',
  'mobile',
  'streaming',
  'reservation',
];

async function analyzeProjectChunks() {
  console.log('🔍 Detailed Analysis of "Projects" Source Chunks\n');

  // Fetch all documents with source = "projects"
  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, content, metadata')
    .eq('metadata->>source', 'projects');

  if (error) {
    console.error('Error fetching documents:', error);
    return;
  }

  console.log(`📊 Total "projects" chunks: ${documents?.length || 0}\n`);

  // Categorize chunks
  const withExplicitProject: typeof documents = [];
  const withoutExplicitProject: typeof documents = [];
  const suspiciousChunks: Array<{ doc: typeof documents[0], indicators: string[] }> = [];

  documents?.forEach(doc => {
    const content = doc.content.toLowerCase();
    let hasExplicitProject = false;

    // Check for explicit project names
    for (const keyword of projectKeywords) {
      if (content.includes(keyword.toLowerCase())) {
        hasExplicitProject = true;
        withExplicitProject.push(doc);
        break;
      }
    }

    if (!hasExplicitProject) {
      withoutExplicitProject.push(doc);

      // Check for project indicators
      const foundIndicators: string[] = [];
      for (const indicator of projectIndicators) {
        if (content.includes(indicator)) {
          foundIndicators.push(indicator);
        }
      }

      if (foundIndicators.length > 0) {
        suspiciousChunks.push({ doc, indicators: foundIndicators });
      }
    }
  });

  console.log('📈 Categorization:\n');
  console.log(`  ✅ With explicit project names: ${withExplicitProject.length}`);
  console.log(`  ⚠️  Without explicit project names: ${withoutExplicitProject.length}\n`);

  console.log('🚨 Suspicious Chunks (likely about projects but missing names):\n');
  console.log(`Found ${suspiciousChunks.length} chunks that seem to be about projects\n`);

  suspiciousChunks.forEach((item, index) => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Chunk ${index + 1}/${suspiciousChunks.length}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📍 Chunk ID: ${item.doc.id}`);
    console.log(`📝 Metadata:`, JSON.stringify(item.doc.metadata, null, 2));
    console.log(`🔑 Project indicators found: ${item.indicators.join(', ')}`);
    console.log(`\n📄 Full Content:\n`);
    console.log(item.doc.content);
    console.log('');
  });

  // Also show chunks without ANY indicators (might be pure filler)
  const noIndicators = withoutExplicitProject.filter(doc => {
    const content = doc.content.toLowerCase();
    return !projectIndicators.some(indicator => content.includes(indicator));
  });

  if (noIndicators.length > 0) {
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Chunks with NO project indicators (might be filler):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    noIndicators.forEach((doc, index) => {
      console.log(`${index + 1}. Chunk ID: ${doc.id}`);
      console.log(`   Content preview: ${doc.content.substring(0, 200)}...`);
      console.log('');
    });
  }

  console.log('\n\n📊 Summary:\n');
  console.log(`  Total "projects" chunks: ${documents?.length || 0}`);
  console.log(`  With explicit project names: ${withExplicitProject.length}`);
  console.log(`  Likely about projects (but missing names): ${suspiciousChunks.length}`);
  console.log(`  Pure filler/transition text: ${noIndicators.length}`);
  console.log('');

  return {
    total: documents?.length || 0,
    withExplicitProject: withExplicitProject.length,
    suspiciousChunks: suspiciousChunks.length,
    noIndicators: noIndicators.length,
    details: suspiciousChunks,
  };
}

analyzeProjectChunks().catch(console.error);
