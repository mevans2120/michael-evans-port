# Changelog

All notable changes to the Michael Evans Portfolio Site will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (October 29, 2025)
- **Chatbot Content Enhancement**
  - Fixed critical misinformation (Target, Before Launcher, company names)
  - Created comprehensive technical architecture document
  - Added 3 new transcripts (agentic engineering, case studies, leadership)
  - Documented 12 projects with full technical details
  - Improved test evaluation scripts for partial answers
  - Enhanced system prompt for better partial information handling
  - Test success rate improved from 7.3% to 30%
  - Ingested 215 chunks into vector database

### Added (October 28, 2025)
- **AI Chatbot Maintainable Content System - Complete Implementation**
  - **Sanity CMS Integration**: Fetch and transform content from Sanity (projects, profile, AI projects)
  - **Smart Incremental Updates**: SHA-256 content fingerprinting with change detection (98% API cost savings)
  - **Webhook Auto-Sync**: Automated content synchronization with < 30 second updates
  - **Admin Dashboard**: Monitoring and manual sync controls at `/admin/chatbot-content`
  - **Database Migration**: Added content_hash, source_id, last_synced columns and helper functions
  - **Dual Content Sources**: Supports both Sanity CMS and transcript files
  - **New Files**:
    - `/src/lib/chatbot/sanity-fetcher.ts` - Sanity content fetching and transformation
    - `/src/lib/chatbot/content-hash.ts` - Content fingerprinting utilities
    - `/src/lib/chatbot/smart-sync.ts` - Intelligent sync engine
    - `/src/app/api/webhooks/sanity/route.ts` - Webhook endpoint with signature verification
    - `/src/app/api/admin/chatbot-sync/route.ts` - Admin API for sync operations
    - `/src/app/(admin)/admin/chatbot-content/page.tsx` - Admin dashboard UI
    - `/supabase/migrations/20251028_add_content_tracking.sql` - Database schema updates
    - `/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md` - Comprehensive documentation
  - **Updated Files**:
    - `/src/lib/chatbot/supabase.ts` - Added upsert, findBySourceId, deleteBySourceId, getSyncStatus
    - `/src/lib/chatbot/ingest-content.ts` - Dual source support
    - `/src/lib/chatbot/README.md` - Updated feature documentation
    - `/src/lib/supabase/database.types.ts` - New columns and function types
    - `.env.example` - Added SANITY_WEBHOOK_SECRET
- **About Page - Complete Implementation**
  - Expanded Sanity profile schema with comprehensive about page fields
  - Hero section with profile photo (heroHeadline, heroSubheadline, heroIntro)
  - Quick facts grid (6 configurable label/value pairs)
  - Capabilities list (7 items with "new" badge support)
  - Dynamic content sections with subsections and visibility toggles
  - Selected projects showcase (4 projects with metrics)
  - Technologies taxonomy (8 categories)
  - Availability and CTA fields
- **Content Migration System**
  - Automated migration script (`scripts/migrate-about-content.ts`)
  - Dotenv integration for environment variable loading
  - `npm run migrate:about` command
  - Migration documentation in `scripts/README.md`
- **Design Concepts**
  - Five design concept explorations in `/docs/design/concepts-batch-1-102825/`
  - Mood board, minimal, bold, current, and dark-refined variations
  - Design comparison and recommendations
- **Documentation**
  - About page implementation plan (`docs/implementation-plans/about-page-implementation-plan.md`)
  - Migration script documentation

### Added (October 27, 2025)
- **Content Specifications**
  - Virgin America case study content spec
  - Before Launcher case study content spec
  - Casa Bonita case study content spec
  - Target case study content spec
  - Pedal case study content spec
  - Profile/About content specification
  - Content specs README with implementation guide
- Comprehensive ARCHITECTURE.md documentation
- Memory Bank system for development continuity
- Detailed coding standards and guidelines
- Session management workflow

### Changed (October 28, 2025)
- Logo typography now uses DM Sans (`font-serif` class)
- Profile schema significantly expanded with about page fields
- Package.json scripts include `migrate:about`

### Changed (Previous)
- Enhanced project documentation structure
- Layout simplified (NavigationProvider removed by user)

### Planned
- Case study page templates implementation
- Performance monitoring integration
- Testing framework setup
- CI/CD pipeline configuration
- SEO optimization
- Additional about page sections (AI work, philosophy)

## [1.0.0] - 2025-09-15

### Initial Portfolio Site Features

#### Pages
- **Home** - Dynamic hero with introduction
- **About** - Personal and professional background
- **Capabilities** - Skills and services offered
- **AI Showcase** - Artificial intelligence projects
- **AI Research** - Research work and publications
- **Case Studies**:
  - Casa Bonita
  - Before Launcher
  - Virgin America
  - Peddle

#### Technical Stack
- React 18.3 with TypeScript 5.8
- Vite 5.4 build system
- React Router DOM for navigation
- TanStack Query for data management
- Tailwind CSS with shadcn/ui components
- Radix UI primitives
- React Hook Form with Zod validation

#### Components
- Responsive navigation with mobile menu
- Dynamic hero sections
- Contact forms
- UI component library (30+ components)
- Custom hooks for reusability

#### Development Tools
- ESLint configuration
- TypeScript strict mode
- Hot module replacement
- Development server with Vite

### Infrastructure
- Single-page application architecture
- Client-side routing
- Static asset optimization
- Component-based structure

---

## Version History Format

### [Version] - Date
### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security updates

---

*For development progress between releases, see [PROGRESS.md](./PROGRESS.md)*