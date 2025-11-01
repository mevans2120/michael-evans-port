import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

// Helper function to convert plain text to Sanity block content
function textToBlocks(text: string) {
  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  return paragraphs.map(paragraph => ({
    _type: 'block',
    _key: Math.random().toString(36).substring(7),
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substring(7),
        text: paragraph.trim(),
        marks: [],
      },
    ],
    markDefs: [],
  }));
}

// Content from profile-about-content-spec-v2-narrative.md
const profileData = {
  name: 'Michael Evans',
  heroHeadline: 'Product Manager • UX Designer • AI Builder',
  heroSubheadline: '20 years solving complex problems. Now building with AI.',
  heroIntro: `I'm a product manager based in Portland, Oregon, who specializes in taking products from 0 to 1. From leading Virgin America's award-winning website redesign to building AI-powered healthcare apps, I combine deep technical knowledge with big-picture business thinking—and now build software directly with Claude Code.`,

  quickFacts: [
    { label: 'Location', value: 'Portland, Oregon' },
    { label: 'Experience', value: '20 Years in Software' },
    { label: 'Approach', value: '0-to-1 \'Army of One\'' },
    { label: 'Current Focus', value: 'AI/ML-Powered Products' },
    { label: 'Work Style', value: 'Remote (love on-site too)' },
    { label: 'Availability', value: 'Open to Opportunities' },
  ],

  sections: [
    {
      heading: 'The 50,000-Foot View',
      slug: { current: 'who-i-am', _type: 'slug' },
      content: textToBlocks(`I'm a product manager who lives in Portland, Oregon—technology enthusiast, AI enthusiast, father of two boys, lifelong learner, and kind of an "army of one" when it comes to capabilities across software.

What makes me different from a typical product manager is the breadth of what I can do. I can define strategy and determine what to build and why. I can create the interface and user experience through UX design. I can conduct research to understand users and validate ideas, then make sense of data and metrics through analysis. I handle project management to ship things on time, tackle prioritization for backlogs and roadmaps, and manage feature lists. And here's the new part: I can build and test the software with Claude Code.

That last capability is transformative. Working with AI has changed how I operate—I can now take projects from strategy through to working code, all while maintaining the product thinking that's been at the core of my career for 20 years.`),
      subsections: [],
      visible: true,
    },
    {
      heading: 'From Yurts to Gigahertz',
      slug: { current: 'background-journey', _type: 'slug' },
      content: textToBlocks(`I was raised by hippies in a purple house in Eugene, Oregon. I fell in love with computers and software as a kid and learned to program a bit when I was 11. But I also loved to read and write, so I studied English at the University of Colorado—proof that you don't need a CS degree to have a successful career in software.

I've been doing product management for much of my career, though sometimes my role was called "project manager" or "solutions architect" or "business analyst." The titles changed, but the work remained consistent: understand the problem, design the solution, ship the product, measure the results, iterate.

My career has taken me from Work & Co, where I led the Virgin America and Alaska Airlines redesigns, to Huge, where I managed Target's massive e-commerce transformation across 20+ concurrent work streams. I founded Before Labs and created Before Launcher, a focus app that helped thousands of people reduce their phone time. More recently, I've been doing independent consulting through Raw Materials, working on projects like Casa Bonita's queue management system, Peddle's car marketplace, and PostPal's healthcare recovery app.

Whether it was helping leisure travelers book airline tickets, helping people focus by filtering notifications, or managing 40,000 people in a queue for a restaurant, the work has always been about making complex things simple and delightful.`),
      subsections: [],
      visible: true,
    },
    {
      heading: 'What I Bring',
      slug: { current: 'what-makes-me-special', _type: 'slug' },
      content: [],
      subsections: [
        {
          heading: 'Deep Technical Knowledge',
          content: textToBlocks(`I'm as technical as you can get without being much of a coder. I coded in middle school, know HTML and CSS, and understand how software applications are architected. I can go deep technically in any stripe of software—whether it's Salesforce, NetSuite, SaaS products, or complete custom builds.

This technical depth means I can have meaningful conversations with engineers about architecture decisions, understand constraints and trade-offs, design solutions that are technically feasible, and work effectively with Claude Code to build production software. When I'm in a meeting with developers, I'm not just nodding along—I genuinely understand what they're talking about and can contribute meaningfully to technical discussions.`),
        },
        {
          heading: 'Big Picture Business View',
          content: textToBlocks(`I'm really good at seeing what's important for a business and their customers at the 50,000-foot level. I understand that technology exists to serve business goals, and business goals exist to serve customers. This strategic perspective allows me to align product decisions with business objectives, prioritize ruthlessly based on impact, and communicate value to stakeholders.

I think beyond features to outcomes. Before asking "how do we build this?" I ask "should we build this?" This business mindset, combined with technical capability, is rare—I can sit in the boardroom discussing strategy with executives and then sit in a technical sprint planning session reviewing API contracts with engineers.`),
        },
        {
          heading: 'Range',
          content: textToBlocks(`I can go from true 50,000 feet all the way down to deep in the weeds—wherever is needed for the project. One day I'm defining product strategy with executives. The next I'm reviewing button padding with designers. Then I'm debugging API responses with engineers. This range is rare and valuable.

The details matter. I think the details are what separate great products from good products—the little things. There are plenty of good ideas, but not as many great executions. Being able to zoom in and obsess over those details while maintaining the big picture is what makes products truly exceptional.`),
        },
      ],
      visible: true,
    },
    {
      heading: 'Why AI Changes Many Things',
      slug: { current: 'ai-new-way-building', _type: 'slug' },
      content: textToBlocks(`People are talking about an AI bubble. Maybe they're right about the valuations. But I think they're underselling how useful AI is right now—not in some hypothetical future, but today.

Here's what I believe: most new software projects should have parts that powered by AI or are created more expediently with AI. Even in its current non-AGI state, it's fantastically useful. AI speeds up work, reduces costs, and improves quality. For people who love to learn, it's going to be a boon. For people who don't like to learn, there might be unfortunate consequences.

I'm really interested in the 0-to-1 "army of one" approach, where I do product strategy, design, and development working directly with the client and with AI. Since switching to Claude Code, I've shipped PostPal (a medical procedure recovery app built with React Native and Next.js), multiple marketing websites including DOA, Opal Creek, and Karuna Gatton (all React with Sanity CMS), and created custom memory banks and three complete skill suites for Design, Project Management, and Development. I've generated over 1,000 GitHub commits working this way.

Working with Claude Code and processes I learned from agentic engineering and vibe coding folks has taught me a lot about building full-stack applications with AI. The mobile app and web app architecture, the iteration speed, the ability to explore ideas quickly—it's fundamentally changed how I work.

My 20 years of product management translates perfectly to working with AI. You treat Claude as a team member. Giving Claude context, keeping things organized, and making it clear why you're doing things really helps the output. All those years of defining requirements, breaking down problems, and communicating clearly—that's exactly what AI needs to be effective.`),
      subsections: [],
      visible: true,
    },
    {
      heading: 'The Work I Want',
      slug: { current: 'what-interests-me', _type: 'slug' },
      content: textToBlocks(`I'm interested in challenging work—challenging opportunities and problems to solve. I love working with amazing teams and people. I really enjoy meeting goals and solving problems. Whether it's helping people buy an airline ticket more easily, showing what kind of work a company does, making a brand better on the internet, building tools that help people focus, or managing massive queues for restaurants—if it's challenging and helps people, I'm interested.`),
      subsections: [],
      visible: true,
    },
    {
      heading: 'The Process',
      slug: { current: 'how-i-work', _type: 'slug' },
      content: textToBlocks(`I love product strategy, research, and testing. One thing I've learned about myself is that the process for building, testing, shipping, and taking products to market is one that I enjoy. It's completely changing now with AI, but I still enjoy it.

I work across the full spectrum: defining what we should build through strategy, understanding what users actually need through research, designing how it should work, building it with Claude Code, testing whether it works and whether users love it, shipping it to market, measuring what happened and what we should do next, then iterating to make it better. This end-to-end involvement means nothing gets lost in handoffs—I'm there from concept to launch and beyond.

Typically I work on front-end and back-ends that support user interfaces for consumer and B2B apps. I'm fairly technology agnostic and can work across a variety of technologies—React, Next.js, and Vite for modern web apps; Sanity CMS which I've used extensively; Supabase and Firebase for back-end services; enterprise systems like Salesforce and NetSuite; React Native for mobile; and of course AI/ML integration with Claude, OpenAI, and Google.`),
      subsections: [],
      visible: true,
    },
  ],

  capabilities: [], // Not displayed on page per v2 spec
  selectedProjects: [], // Not included in v2 spec

  availabilityText: 'Currently available for consulting and 0-to-1 product opportunities. Especially interested in AI-powered products and conversion optimization.',
  ctaText: 'Interested in working together? Let\'s talk about your product challenges and how I can help.',
  ctaButtonText: 'Get in Touch',
  availability: true,
};

async function migrateContent() {
  console.log('🚀 Starting migration of About page content v2...\n');

  try {
    // First, check if a profile document exists
    const existingProfile = await client.fetch(`*[_type == "profile"][0]`);

    if (existingProfile) {
      console.log(`✅ Found existing profile: ${existingProfile._id}\n`);
      console.log('📝 Updating profile with v2 narrative content...\n');

      await client
        .patch(existingProfile._id)
        .set(profileData)
        .commit();

      console.log('✨ Successfully updated profile!\n');
    } else {
      console.log('⚠️  No existing profile found. Creating new profile...\n');

      await client.create({
        _type: 'profile',
        ...profileData,
      });

      console.log('✨ Successfully created new profile!\n');
    }

    console.log('📊 Migration Summary:');
    console.log(`   - Hero section: ✓`);
    console.log(`   - Quick Facts: ${profileData.quickFacts.length} items`);
    console.log(`   - Content Sections: ${profileData.sections.length} sections`);
    console.log(`   - Capabilities: Removed (not displayed on page)`);
    console.log(`   - Selected Projects: Removed (not in v2 spec)`);
    console.log(`   - Availability & CTA: ✓\n`);

    console.log('✅ Migration complete! Check Sanity Studio to review the content.\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateContent();
