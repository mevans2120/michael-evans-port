/**
 * Content Ingestion Script
 * Processes portfolio content and loads it into the vector database
 *
 * Run this script after you have:
 * 1. Set up Supabase and API keys
 * 2. Created transcripts from your recordings
 * 3. Gathered supporting documents
 *
 * Usage: npm run ingest
 * Or with clear: npm run ingest:clear
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { processDocuments } from './embeddings';
import { insertDocuments, deleteAllDocuments } from './supabase';
import { fetchAllSanityContent, SanityContentDocument } from './sanity-fetcher';
import * as fs from 'fs';

interface ContentFile {
  filePath: string;
  source: string; // 'background', 'skills', 'project', etc.
  category?: string;
  title?: string;
}

/**
 * Load content from transcript files
 */
async function loadContentFiles(baseDir: string): Promise<ContentFile[]> {
  const contentFiles: ContentFile[] = [];
  const transcriptsDir = path.join(baseDir, 'transcripts');

  if (!fs.existsSync(transcriptsDir)) {
    console.warn(`Transcripts directory not found: ${transcriptsDir}`);
    return contentFiles;
  }

  const files = fs.readdirSync(transcriptsDir);

  for (const file of files) {
    // Skip raw transcript files - we have cleaned versions
    if (file.includes('_Raw')) {
      console.log(`  ⏭️  Skipping raw transcript: ${file}`);
      continue;
    }

    if (file.endsWith('.md') || file.endsWith('.txt')) {
      const filePath = path.join(transcriptsDir, file);

      // Infer source from filename
      let source = 'general';
      let category = undefined;

      // Handle specific transcript files
      if (file.includes('Answers_1')) {
        source = 'background';
        category = 'Professional Background & Career History';
      } else if (file.includes('Answers_2')) {
        source = 'projects';
        category = 'Current Work, Projects & Example Q&A';
      } else if (file.includes('ai-research')) {
        source = 'research';
        category = 'AI Research & Findings';
      }
      // Generic fallbacks
      else if (file.includes('background')) source = 'background';
      else if (file.includes('skills')) source = 'skills';
      else if (file.includes('project')) source = 'project';
      else if (file.includes('philosophy')) source = 'philosophy';
      else if (file.includes('industry')) source = 'industry';
      else if (file.includes('personal')) source = 'personal';
      else if (file.includes('practical')) source = 'practical';
      else if (file.includes('examples')) source = 'examples';

      contentFiles.push({
        filePath,
        source,
        category,
        title: file.replace(/\.(md|txt)$/, ''),
      });
    }
  }

  return contentFiles;
}

/**
 * Main ingestion function
 */
async function ingestContent() {
  console.log('🚀 Starting content ingestion...\n');

  try {
    // Configuration
    const baseDir = path.join(process.cwd(), 'public/chatbot-content');
    const clearExisting = process.argv.includes('--clear');

    // Step 1: Clear existing documents if requested
    if (clearExisting) {
      console.log('🗑️  Clearing existing documents...');
      await deleteAllDocuments();
      console.log('✅ Cleared existing documents\n');
    }

    // Step 2: Load content from both Sanity and transcript files
    console.log('📂 Loading content from sources...\n');

    // Load transcript files
    console.log('  📄 Loading transcript files...');
    const contentFiles = await loadContentFiles(baseDir);
    console.log(`  ✅ Found ${contentFiles.length} transcript files`);

    // Load Sanity content
    console.log('  🗄️  Loading Sanity CMS content...');
    let sanityDocuments: SanityContentDocument[] = [];
    try {
      sanityDocuments = await fetchAllSanityContent();
      console.log(`  ✅ Loaded ${sanityDocuments.length} Sanity documents\n`);
    } catch (error) {
      console.warn('  ⚠️  Warning: Could not fetch Sanity content:', error instanceof Error ? error.message : 'Unknown error');
      console.log('  → Continuing with transcript files only\n');
    }

    if (contentFiles.length === 0 && sanityDocuments.length === 0) {
      console.error('❌ No content found from any source!');
      console.log('\nPlease either:');
      console.log('  1. Add transcript files to:');
      console.log(`     ${baseDir}/transcripts/\n`);
      console.log('  2. Ensure Sanity CMS has content and credentials are set\n');
      process.exit(1);
    }

    // Step 3: Read and combine all content
    console.log('📖 Processing content...');

    // Process transcript files
    const transcriptDocuments = contentFiles.map(file => {
      const content = fs.readFileSync(file.filePath, 'utf-8');
      return {
        content,
        metadata: {
          source: file.source,
          title: file.title,
          category: file.category,
        },
      };
    });

    // Combine all documents
    const documents = [
      ...transcriptDocuments,
      ...sanityDocuments.map(doc => ({
        content: doc.content,
        metadata: doc.metadata,
      })),
    ];

    console.log(`✅ Total documents to process: ${documents.length}`);
    console.log(`   - Transcript files: ${transcriptDocuments.length}`);
    console.log(`   - Sanity CMS: ${sanityDocuments.length}\n`);

    // Step 4: Process documents (chunk + embed)
    console.log('🔄 Processing documents (chunking and generating embeddings)...');
    console.log('   This may take a few minutes depending on content size...');
    const chunks = await processDocuments(documents);
    console.log(`✅ Generated ${chunks.length} chunks with embeddings\n`);

    // Step 5: Insert into database
    console.log('💾 Inserting chunks into Supabase...');
    const inserted = await insertDocuments(
      chunks.map(chunk => ({
        content: chunk.content,
        embedding: chunk.embedding,
        metadata: chunk.metadata,
      }))
    );
    console.log(`✅ Inserted ${inserted.length} chunks\n`);

    // Step 6: Summary
    console.log('📊 Ingestion Summary:');
    console.log(`   Documents processed: ${documents.length}`);
    console.log(`     - Transcript files: ${transcriptDocuments.length}`);
    console.log(`     - Sanity CMS documents: ${sanityDocuments.length}`);
    console.log(`   Chunks created: ${chunks.length}`);
    console.log(`   Database records: ${inserted.length}`);
    console.log(`   Avg chunks per document: ${(chunks.length / documents.length).toFixed(1)}`);

    // Group by source
    const bySource = chunks.reduce((acc, chunk) => {
      const source = chunk.metadata.source;
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n   Chunks by source:');
    Object.entries(bySource)
      .sort(([, a], [, b]) => b - a)
      .forEach(([source, count]) => {
        console.log(`     - ${source}: ${count} chunks`);
      });

    console.log('\n✅ Content ingestion complete!');
    console.log('\n🎉 Your chatbot now has access to:');
    console.log('   ✓ Transcript content (background, projects, experience)');
    console.log('   ✓ Sanity CMS content (case studies, profile, AI projects)');
    console.log('   ✓ Total knowledge base ready for questions!\n');
  } catch (error) {
    console.error('\n❌ Error during ingestion:', error);
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

// Run ingestion
ingestContent();
