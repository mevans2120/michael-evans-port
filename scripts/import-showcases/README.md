# AI Showcase Content Import Scripts

Scripts for importing AI Showcase content from markdown specs into Sanity CMS.

## Prerequisites

Before running these scripts, you need:

1. **Sanity Write Token**: Get a write token from your Sanity project
   - Go to https://www.sanity.io/manage
   - Select your project (5n331bys)
   - Go to API → Tokens
   - Create a new token with Editor or Admin permissions
   - Copy the token

2. **Environment Variable**: Add the token to your `.env.local` file:
   ```bash
   SANITY_WRITE_TOKEN=your_token_here
   ```

## Available Scripts

### Import All Showcases
Imports all three AI Showcase pages at once:
```bash
npm run import:showcases
```

### Import Individual Showcases
Import one showcase at a time:

```bash
# AI Workflow showcase
npm run import:ai-workflow

# PostPal showcase
npm run import:postpal

# Marketing Sites showcase
npm run import:marketing-sites
```

## What Gets Imported

### AI Workflow Showcase
- **6 Timeline Phases**: Experimentation, Tool Discovery, Production-Ready Development, Skills Ecosystem, Production Projects, Continuous Evolution
- **Main Showcase**: Hero, content slides, horizontal timeline, metrics

### PostPal Showcase
- **4 Workflow Steps**: Provider Upload, AI Content Extraction, Timeline Generation, Patient Engagement
- **Main Showcase**: Hero, content slides, horizontal workflow, metrics

### Marketing Sites Showcase
- **3 Project Cards**: Department of Art, Opal Creek, Karuna Gatton
- **Main Showcase**: Hero, content slides, horizontal project showcase, metrics

## Document IDs

All documents use predictable IDs for easy updates:

**AI Workflow:**
- `aiShowcase-ai-workflow`
- `timelinePhase-experimentation`
- `timelinePhase-tool-discovery`
- `timelinePhase-production-ready`
- `timelinePhase-skills-ecosystem`
- `timelinePhase-production-projects`
- `timelinePhase-continuous-evolution`

**PostPal:**
- `aiShowcase-postpal`
- `workflowStep-provider-upload`
- `workflowStep-ai-extraction`
- `workflowStep-timeline-generation`
- `workflowStep-patient-engagement`

**Marketing Sites:**
- `aiShowcase-marketing-sites`
- `projectCard-doa`
- `projectCard-opal-creek`
- `projectCard-karuna-gatton`

## Re-running Imports

These scripts use `createOrReplace`, so you can safely re-run them to update content. Existing documents with the same ID will be replaced.

## Troubleshooting

### "Write token missing" error
- Make sure `SANITY_WRITE_TOKEN` is set in `.env.local`
- Verify the token has Editor or Admin permissions
- Restart your terminal after adding the token

### "Document not found" errors
- The schemas must be deployed to Sanity first
- Run `npm run build` to ensure schemas are registered
- Check Sanity Studio to verify schemas are available

### "Reference not found" errors
- Run the full import (`npm run import:showcases`) instead of individual imports
- This ensures referenced documents (timeline phases, workflow steps, project cards) exist before creating the main showcase

## Source Content

The import scripts are based on content specs in:
- `/docs/content-specs/ai-workflow-showcase.md`
- `/docs/content-specs/postpal-showcase.md`
- `/docs/content-specs/marketing-sites-showcase.md`

## Next Steps

After importing:
1. Visit Sanity Studio at `http://localhost:3000/studio`
2. Verify the documents were created
3. Edit content as needed
4. Publish the changes
5. View the showcase pages at `/ai-showcase/[slug]`
