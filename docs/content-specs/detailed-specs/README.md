# Content Specifications - Overview

This directory contains detailed content specifications for the portfolio website, created from the vector database source material.

## Purpose

These specifications serve as comprehensive blueprints before implementing content in Sanity CMS. Each spec includes:
- Structured metadata
- Complete content sections with prose
- Key metrics and achievements in JSON format
- SEO optimization details
- Images needed lists
- Source material references

## Files Created

### Case Studies

1. **virgin-america-case-study.md**
   - Order: 1 (flagship project)
   - Focus: First responsive airline website, 15-20% conversion improvement
   - Key Innovation: Decisions vs. clicks philosophy
   - Awards: Webbies, UX Awards, Cannes Lions
   - Sections: 8 detailed content sections

2. **before-launcher-case-study.md**
   - Order: 2
   - Focus: Phone distraction reduction, Fast Company Best App 2019
   - Impact: 30-40% fewer phone opens for thousands of users
   - Key Features: Notification filtering, minimalist launcher design
   - Sections: 9 detailed content sections including business lessons

3. **casa-bonita-case-study.md**
   - Order: 3
   - Focus: Restaurant reservation system, queue management
   - Impact: 40,000-person queue, 100% capacity, 25% more covers
   - Tech: Next.js, Supabase, Vercel
   - Sections: 9 sections emphasizing technical excellence and handoff

4. **target-case-study.md**
   - Order: 4
   - Focus: Enterprise e-commerce transformation
   - Scale: 20+ work streams, Huge's largest client
   - Strategic Focus: Amazon → proprietary platform, future of retail
   - Sections: 8 sections covering enterprise program management

5. **pedal-case-study.md**
   - Order: 5
   - Focus: Conversion optimization for junk car buying
   - Impact: 15% more cars purchased, 5% homepage conversion lift
   - Tech: React, Next.js, Sanity, Snowflake, Snowplow
   - Sections: 9 sections including data infrastructure

### Profile Content

6. **profile-about-content-spec.md**
   - Comprehensive About page specification
   - 10 major sections covering background, philosophy, capabilities
   - Capabilities organized by category (Product, UX, Technical, AI/ML, Data, Business)
   - Technologies and tools arrays
   - Current work and availability section
   - Personal background and personality

## Content Structure

Each case study follows a consistent pattern:

### Metadata
- Title, slug, category, featured status, order
- Role, company, timeline
- Publication date

### Hero Section
- Title
- Tagline (compelling one-liner)
- Summary (2-3 sentences)

### Key Metrics (JSON)
- 4 primary metrics
- Formatted for easy Sanity import

### Key Achievements (JSON)
- 6-8 bullet points
- Array format for Sanity

### Technologies Used (JSON)
- Array of technologies
- Ready for Sanity schema

### Content Sections
- 8-9 detailed sections
- Each with heading and full prose content
- Structured narratives with lessons learned

### SEO Metadata
- Meta title
- Meta description
- Keywords

### Images Needed
- Specific list for each project
- 6-7 images per case study

### Related Projects
- Cross-linking opportunities

### Source Material
- References to transcript files
- Vector DB chunk counts

## Priority & Implementation Order

Based on the content and strategic importance:

### P0 (Immediate Priority)
1. **Virgin America** - Flagship project, most awards, industry-defining
2. **Before Launcher** - Product story, Fast Company award, unique narrative
3. **Profile/About** - Essential for site visitors to understand who you are

### P1 (High Priority)
4. **Casa Bonita** - Recent, technical excellence, compelling story
5. **Target** - Enterprise credibility, strategic depth

### P2 (Standard Priority)
6. **Pedal** - Strong metrics, good Sanity/Next.js story

## Vector Database Coverage

Content was created from rich vector database material:
- Virgin America: 28 chunks
- Before Launcher: 24 chunks
- Casa Bonita: 10 chunks
- Target: 23 chunks
- Pedal: Chunks with project context
- Profile: Comprehensive transcript coverage

## Next Steps

1. **Review Specifications** - Read through each spec, suggest any additions/changes
2. **Source Images** - Gather hero images, screenshots, awards, etc.
3. **Implement in Sanity** - Create project documents based on specs
4. **Build Page Templates** - Create case study detail page components
5. **SEO Optimization** - Implement meta tags, structured data
6. **Cross-linking** - Connect related projects

## Implementation Notes

### Sanity Schema Alignment

The specifications are structured to align with `/sanity/schemas/project.ts`:
- Metadata maps to top-level fields (title, slug, category, etc.)
- Key metrics → metrics array
- Key achievements → achievements array
- Technologies → technologies array
- Content sections → content array (portable text)

### Content Quality

All content is:
- Written in your voice (based on transcript material)
- Includes specific metrics and outcomes
- Tells a story with lessons learned
- Balances technical detail with accessibility
- Shows both successes and honest reflections

### Tone & Voice

Consistent across all specs:
- Professional but approachable
- Confident without arrogance
- Technical but accessible
- Honest about challenges and learnings
- First-person narrative where appropriate

## Source Material References

All specifications reference:
- Primary source: `/docs/research/research-batch-1-102525/source-materials/transcripts/chatbot-questionnaire_Answers_2.md`
- Vector DB chunks with specific project tags
- Line number ranges for traceability

## Questions or Feedback

These specs are comprehensive blueprints ready for implementation. If you'd like to:
- Adjust any content
- Change the order or priority
- Add additional sections
- Modify the tone or emphasis

Just let me know and I can update the specifications accordingly.

---

**Created:** 2025-10-27
**Source:** Vector database analysis and transcript material
**Total Specs:** 6 (5 case studies + 1 profile)
**Ready for:** Sanity CMS implementation
