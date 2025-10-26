/**
 * Database Setup Script
 * Creates the necessary tables and functions in Supabase
 *
 * Usage: npm run setup-db
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { getSupabaseAdmin } from './supabase';
import pg from 'pg';
const { Client } = pg;

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error('❌ Supabase admin client not initialized.');
    console.error('   Please check your .env.local file for:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY\n');
    process.exit(1);
  }

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

    // Get the Supabase URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    }

    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

    // Check if DATABASE_URL is provided
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      console.log('📝 Executing SQL schema via direct Postgres connection...\n');

      const client = new Client({ connectionString: databaseUrl });

      try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Execute the full SQL schema
        await client.query(sqlContent);

        console.log('\n✅ Database setup complete!\n');
        console.log('You can now run: npm run ingest\n');

        await client.end();
        return;
      } catch (err) {
        console.error('❌ Error executing SQL:', err);
        await client.end();
        throw err;
      }
    }

    // If no DATABASE_URL, provide manual instructions
    console.log('⚠️  DATABASE_URL not found in environment variables.\n');
    console.log('📋 Please set up the database manually:\n');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log(`   2. Select project: ${projectRef}`);
    console.log('   3. Navigate to: SQL Editor');
    console.log('   4. Create a new query');
    console.log('   5. Copy and paste the entire contents of:');
    console.log('      src/lib/chatbot/database-schema.sql');
    console.log('   6. Click "Run" or press Ctrl+Enter\n');
    console.log('   Alternative: Add DATABASE_URL to .env.local:');
    console.log('   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.kbppccutslxshkmaaagf.supabase.co:6543/postgres\n');
    console.log('   (Find the connection string in Supabase Dashboard > Project Settings > Database)\n');
    console.log('   Once complete, run: npm run ingest\n');
    process.exit(0);
  } catch (error) {
    console.log('⚠️  Could not set up database automatically.\n');
    console.log('📋 Please set up the database manually:\n');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Navigate to: SQL Editor');
    console.log('   4. Create a new query');
    console.log('   5. Copy and paste the entire contents of:');
    console.log('      src/lib/chatbot/database-schema.sql');
    console.log('   6. Click "Run" or press Ctrl+Enter\n');
    console.log('   Once complete, run: npm run ingest\n');
    process.exit(0);
  }
}

// Run setup
setupDatabase();
