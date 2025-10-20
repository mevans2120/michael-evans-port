# CMS Feature Analysis: Frontend UI vs Sanity CMS Schemas

**Analysis Date:** 2025-10-14  
**Portfolio:** Michael Evans Portfolio  
**Tech Stack:** React, TypeScript, Sanity CMS  

---

## Executive Summary

### Critical Findings

- **Missing CMS Features:** 47 distinct UI elements lack CMS schema support
- **Unused CMS Features:** 8 schema fields have no UI implementation
- **Schema Gap:** AI Project schema exists in `/sanity/schemas/` but NOT registered in main config
- **Data Source:** All content is currently **hardcoded** - no CMS integration active

### Priority Overview

| Priority | Missing Features | Unused Features | Recommended Action |
|----------|-----------------|-----------------|-------------------|
| **High** | 28 | 3 | Implement immediately |
| **Medium** | 12 | 3 | Plan for next phase |
| **Low** | 7 | 2 | Consider for future |

### Key Recommendations

1. **Register AI Project Schema** - The `aiProject.ts` schema exists but is NOT imported in `sanity.config.ts`
2. **Add Homepage Hero Schema** - 4 hero options with complex data structures need CMS support
3. **Create SEO Metadata Schema** - Critical gap for all pages
4. **Implement Profile/About Page Integration** - Profile schema exists but UI shows hardcoded text
5. **Add Contact Information Schema** - Contact component has placeholder data

---

## 1. Page-by-Page Analysis

### 1.1 Homepage (HomeMinimal.tsx)

**Route:** `/`

#### UI Elements Displayed

**Hero Section:**
- Name: "Michael Evans" (static)
- Rotating hero options (4 variations):
  - Prefix text (e.g., "shipped the first responsive")
  - Dropdown text (e.g., "airline website")
  - Target link
  - Full label
  - Description
  - Image URL
  - Tags array
  - Gradient color
- Interactive modal with project grid

**About Preview Section:**
- Profile photo (placeholder)
- Professional title: "Product Strategist & Creative Technologist"
- Bio paragraph
- "Learn more" CTA link

**Featured Work Section:**
- Section title: "Selected Work"
- Section subtitle: "Case studies and product launches"
- 3 case study cards with:
  - Title
  - Description
  - Metric
  - Link
  - Tag/category

**AI Projects Section:**
- Uses `BentoImageBehind` component
- Section title: "AI Projects"
- Section subtitle: "Production apps and experiments"
- 4 AI project cards (hardcoded from `/src/data/aiProjects.ts`)

**Capabilities (unused in current UI):**
- Hardcoded array: Product Strategy (20yr), UX/UI Design (15yr), etc.
- NOT displayed on homepage

#### CMS Schema Coverage

**NONE** - Homepage has zero CMS integration

#### Missing CMS Fields

**HIGH PRIORITY:**
1. `homepage.heroName` (string) - Name display
2. `homepage.heroOptions` (array of objects):
   - `prefix` (string)
   - `dropdown` (string)
   - `link` (string)
   - `label` (string)
   - `description` (text)
   - `image` (image)
   - `tags` (array of strings)
   - `colorGradient` (string)
3. `homepage.aboutTitle` (string)
4. `homepage.aboutBio` (text)
5. `homepage.aboutImage` (image)
6. `homepage.aboutCtaText` (string)
7. `homepage.aboutCtaLink` (string)
8. `homepage.featuredWorkTitle` (string)
9. `homepage.featuredWorkSubtitle` (string)
10. `homepage.featuredProjects` (array - reference to projects)
11. `homepage.aiProjectsTitle` (string)
12. `homepage.aiProjectsSubtitle` (string)
13. `homepage.featuredAIProjects` (array - reference to AI projects)

**MEDIUM PRIORITY:**
14. `homepage.seoTitle` (string)
15. `homepage.seoDescription` (text)
16. `homepage.ogImage` (image)

#### Unused CMS Fields

None (no CMS integration exists)

---

### 1.2 About Page (About.tsx)

**Route:** `/about`

#### UI Elements Displayed

- Page title: "About Michael"
- Profile photo (placeholder with gradient)
- 6 paragraphs of biographical content (all hardcoded):
  1. Introduction and experience summary
  2. "Purple house" origin story
  3. Industries worked in
  4. Product philosophy
  5. AI perspective
  6. Personal interests
- Contact component (see section 2.4)

#### CMS Schema Coverage

**Profile Schema EXISTS** (`profile.ts`) with fields:
- `name` - ✅ Could be used
- `title` - ✅ Could be used
- `tagline` - ❌ Not displayed
- `bio` (rich text blocks) - ✅ Could be used
- `profileImage` - ✅ Could be used
- `skills` - ❌ Not displayed on About page
- `experience` - ❌ Not displayed on About page
- `social` - ❌ Not displayed on About page

**Integration Status:** Schema exists but NO UI integration

#### Missing CMS Fields

**HIGH PRIORITY:**
1. `about.pageTitle` (string) - Currently "About Michael"
2. Integration with existing `profile.bio` field
3. Integration with existing `profile.profileImage` field

**MEDIUM PRIORITY:**
4. `about.seoTitle` (string)
5. `about.seoDescription` (text)
6. `about.ogImage` (image)

#### Unused CMS Fields

**FROM PROFILE SCHEMA:**
1. `profile.tagline` - No UI display
2. `profile.skills` - Not shown on About page (could be added)
3. `profile.experience` - Not shown on About page (could be added)
4. `profile.social` - Not shown on About page (links exist in Contact)

**Recommendation:** Either integrate these fields into About page UI or document that they're for future use.

---

### 1.3 Case Study Pages

**Routes:** 
- `/case-studies/virgin-america`
- `/case-studies/casa-bonita`
- `/case-studies/before-launcher`
- `/case-studies/peddle`

#### UI Elements Displayed (Consistent Pattern)

- Page title
- Subtitle/tagline
- "Back to Portfolio" link
- Project Overview section:
  - Overview paragraph
  - 3 key metrics (label + value)
  - Key achievements list (5 items)
- "View More Projects" CTA button

**Specific Example (Virgin America):**
- Title: "Virgin America Digital"
- Subtitle: "Award-winning website and mobile app achieving 15% conversion lift"
- Metrics: "15%", "3 Years", "Multiple"
- 5 achievement bullet points

#### CMS Schema Coverage

**General Project Schema EXISTS** (`project.ts`) with fields:
- `title` - ✅ USED
- `slug` - ✅ USED (for routing)
- `category` - ❌ NOT displayed on case study pages
- `heroImage` - ❌ NOT displayed on case study pages
- `summary` - ❌ NOT displayed (subtitle is hardcoded)
- `description` - ❌ NOT displayed (overview is hardcoded)
- `metrics` - ✅ Could be used (structure matches)
- `achievements` - ✅ Could be used
- `content` (rich text) - ❌ NOT displayed
- `technologies` - ❌ NOT displayed
- `liveUrl` - ❌ NOT displayed
- `githubUrl` - ❌ NOT displayed
- `publishedAt` - ❌ NOT displayed
- `featured` - ❌ NOT used in UI
- `order` - ❌ NOT used in UI

**Integration Status:** Schema exists but NO UI integration (all hardcoded)

#### Missing CMS Fields

**HIGH PRIORITY:**
1. `project.subtitle` or use existing `summary` field
2. `project.overviewText` or use existing `description` field
3. Integration with existing `metrics` array
4. Integration with existing `achievements` array

**MEDIUM PRIORITY:**
5. `project.backButtonText` (string) - Currently "← Back to Portfolio"
6. `project.ctaText` (string) - Currently "View More Projects"
7. `project.ctaLink` (string)

**LOW PRIORITY:**
8. Display heroImage in case study pages
9. Display technologies used
10. Display live/github links

#### Unused CMS Fields

**FROM PROJECT SCHEMA:**
1. `project.category` - Defined in schema but not displayed on case study pages
2. `project.heroImage` - Not displayed on case study pages
3. `project.content` (rich text) - Not displayed (could add detailed content sections)
4. `project.technologies` - Not displayed
5. `project.liveUrl` - Not displayed
6. `project.githubUrl` - Not displayed
7. `project.publishedAt` - Not displayed
8. `project.featured` - Not used (could be used for homepage)
9. `project.order` - Not used (could be used for sorting)

**Recommendation:** These fields suggest the original schema was designed for more detailed case studies. Either enhance UI to use them or remove if not needed.

---

### 1.4 AI Project Detail Pages

**Routes:**
- `/ai-projects/post-pal`
- `/ai-projects/karuna-gatton`
- `/ai-projects/ai-research-agent`
- `/ai-projects/department-of-art`

#### UI Elements Displayed (PostPal.tsx pattern - all follow same structure)

**Data Source:** Currently reads from `/src/data/aiProjects.ts` (hardcoded)

**Page Structure:**
1. Title
2. Subtitle
3. Links (Live Site, GitHub)
4. Project Overview section:
   - Problem statement
   - Solution description
   - Role
   - Timeline
   - Key Metrics (4 metric cards)
   - Key Achievements list
5. Technical Architecture section:
   - Tech Stack (badges)
   - AI Components (detailed list with name, description, technology)
6. Development Process section:
   - Multiple phases with descriptions and outcomes
7. Key Learnings section:
   - List of learning points
8. "View More Projects" CTA

#### CMS Schema Coverage

**AI Project Schema EXISTS** (`/sanity/schemas/aiProject.ts`) with comprehensive fields:

✅ **EXCELLENT MATCH** - Schema mirrors the data structure in `/src/data/aiProjects.ts`:
- `title` - ✅ Matches UI
- `slug` - ✅ Matches UI
- `subtitle` - ✅ Matches UI
- `description` - ✅ Matches UI
- `category` - ✅ Matches UI
- `status` (Live/In Progress/Coming Soon) - ✅ Matches UI
- `heroImage` - ✅ Matches UI
- `liveUrl` - ✅ Matches UI (as `links.live`)
- `githubUrl` - ✅ Matches UI (as `links.github`)
- `overview` object (problem, solution, role, timeline) - ✅ Matches UI
- `metrics` array - ✅ Matches UI
- `techStack` array - ✅ Matches UI
- `aiComponents` array - ✅ Matches UI
- `developmentProcess` array - ✅ Matches UI
- `learnings` array - ✅ Matches UI
- `achievements` array - ✅ Matches UI
- `images` array - ⚠️ NOT displayed in UI
- `featured` boolean - ⚠️ NOT used in UI
- `order` number - ⚠️ NOT used in UI
- `publishedAt` datetime - ⚠️ NOT displayed in UI

#### CRITICAL ISSUE

**AI Project Schema is NOT registered in Sanity config!**

Location: `/src/sanity.config.ts`

**Current config:**
```typescript
import project from './sanity-schemas/project'
import profile from './sanity-schemas/profile'
import capability from './sanity-schemas/capability'

export const schemaTypes = [project, profile, capability]
```

**Missing import:**
```typescript
// ❌ NOT IMPORTED
import aiProject from './sanity-schemas/aiProject'
```

The AI Project schema was created but never added to the Sanity configuration, so it's not available in Sanity Studio.

#### Missing CMS Fields

**HIGH PRIORITY:**
1. **REGISTER AI PROJECT SCHEMA** in `sanity.config.ts` (blocking issue)
2. Create UI integration to fetch from Sanity instead of `/src/data/aiProjects.ts`

**MEDIUM PRIORITY:**
3. `aiProject.seoTitle` (string)
4. `aiProject.seoDescription` (text)
5. `aiProject.ogImage` (image)

#### Unused CMS Fields

**FROM AI PROJECT SCHEMA:**
1. `aiProject.images` array - Schema has it, but UI doesn't display project screenshots
2. `aiProject.featured` - Not used in UI
3. `aiProject.order` - Not used for sorting
4. `aiProject.publishedAt` - Not displayed

**Recommendation:** The images field should be used to add visual richness to AI project pages.

---

### 1.5 AI Showcase Page (AIShowcase.tsx)

**Route:** `/ai-showcase`

#### UI Elements Displayed

- Page title: "AI App Showcase"
- Page description paragraph
- Grid of 4 AI project cards (hardcoded):
  - Title
  - Status badge (Live/In Progress/Coming Soon)
  - Description
  - "View Project" button with external link
- "Back to Home" button
- Contact component

#### CMS Schema Coverage

**NONE** - Hardcoded array of projects

Should reference AI Project schema (once registered)

#### Missing CMS Fields

**HIGH PRIORITY:**
1. `aiShowcase.pageTitle` (string)
2. `aiShowcase.pageDescription` (text)
3. `aiShowcase.featuredProjects` (array - reference to aiProject documents)

**MEDIUM PRIORITY:**
4. `aiShowcase.seoTitle` (string)
5. `aiShowcase.seoDescription` (text)
6. `aiShowcase.ogImage` (image)

#### Unused CMS Fields

None

---

### 1.6 Navigation Component (Navigation.tsx)

**Component:** Global navigation

#### UI Elements Displayed

- Logo/brand: "MEvans"
- Menu button
- Navigation menu items:
  - Home
  - About
  - Case Studies section (4 links)
  - AI Projects section (4 links)
  - AI Research section (2 links)
  - Contact (email link)

#### CMS Schema Coverage

**NONE** - All hardcoded

#### Missing CMS Fields

**MEDIUM PRIORITY:**
1. `siteSettings.brandName` (string)
2. `siteSettings.logoImage` (image)
3. `navigation.menuItems` (array of objects):
   - `label` (string)
   - `link` (string)
   - `type` (string: link/section/email)
   - `children` (array for nested items)
   - `order` (number)

**LOW PRIORITY:**
4. `siteSettings.menuButtonText` (string) - Currently "Menu"

#### Unused CMS Fields

None

---

### 1.7 Contact Component (Contact.tsx)

**Component:** Used on About and AI Showcase pages

#### UI Elements Displayed

- Heading: "Let's Create Something Exceptional"
- Description paragraph
- 2 CTA buttons: "Start a Project", "Schedule a Call"
- 3 contact info sections:
  - Email: "hello@yourconsulting.com" (placeholder)
  - LinkedIn: "Connect with me"
  - Location: "Available Worldwide"

#### CMS Schema Coverage

**Profile schema has `social` object** but NOT used in Contact component

#### Missing CMS Fields

**HIGH PRIORITY:**
1. `contact.heading` (string)
2. `contact.description` (text)
3. `contact.primaryCtaText` (string)
4. `contact.primaryCtaLink` (string)
5. `contact.secondaryCtaText` (string)
6. `contact.secondaryCtaLink` (string)
7. `contact.email` (email) - or use `profile.social.email`
8. `contact.linkedinUrl` (url) - or use `profile.social.linkedin`
9. `contact.linkedinText` (string)
10. `contact.locationText` (string)

**MEDIUM PRIORITY:**
11. `contact.showEmail` (boolean)
12. `contact.showLinkedIn` (boolean)
13. `contact.showLocation` (boolean)

#### Unused CMS Fields

**FROM PROFILE SCHEMA:**
1. `profile.social.github` - Not displayed in Contact
2. `profile.social.twitter` - Not displayed in Contact
3. `profile.social.email` - Exists but not integrated
4. `profile.social.linkedin` - Exists but not integrated

---

### 1.8 BentoImageBehind Component (AI Projects Showcase)

**Component:** AI projects bento grid on homepage

#### UI Elements Displayed

- Section title: "AI Projects"
- Section subtitle: "Production apps and experiments"
- 4 AI project cards from hardcoded data:
  - Title
  - Description
  - Category badge
  - Background image
  - Gradient accent
  - Tags
  - "View Project" button

#### CMS Schema Coverage

**NONE** - Reads from hardcoded `/src/data/aiProjects.ts`

Should reference AI Project schema

#### Missing CMS Fields

Should use AI Project schema references (once registered)

#### Unused CMS Fields

None

---

## 2. Schema-by-Schema Analysis

### 2.1 Project Schema (`/src/sanity-schemas/project.ts`)

**Status:** ✅ Registered in config | ❌ NOT integrated in UI

#### Fields Defined

| Field | Type | Used in UI? | Where? | Notes |
|-------|------|-------------|--------|-------|
| `title` | string | ❌ | N/A | Hardcoded in case study pages |
| `slug` | slug | ❌ | N/A | Routes hardcoded in App.tsx |
| `category` | string | ❌ | N/A | Not displayed anywhere |
| `heroImage` | image | ❌ | N/A | Not displayed on case study pages |
| `summary` | text | ❌ | N/A | Subtitle is hardcoded |
| `description` | text | ❌ | N/A | Overview is hardcoded |
| `metrics` | array | ❌ | N/A | Hardcoded in case study pages |
| `achievements` | array | ❌ | N/A | Hardcoded in case study pages |
| `content` | rich text | ❌ | N/A | Not displayed |
| `technologies` | array | ❌ | N/A | Not displayed |
| `liveUrl` | url | ❌ | N/A | Not displayed |
| `githubUrl` | url | ❌ | N/A | Not displayed |
| `publishedAt` | datetime | ❌ | N/A | Not displayed |
| `featured` | boolean | ❌ | N/A | Could be used for homepage |
| `order` | number | ❌ | N/A | Could be used for sorting |

**Usage Status:** 0% - Schema exists but completely unused

**Recommendation:** Either integrate this schema into case study pages OR create a separate `caseStudy` schema since the data structure differs from what's in the UI.

---

### 2.2 Profile Schema (`/src/sanity-schemas/profile.ts`)

**Status:** ✅ Registered in config | ⚠️ Partially could be used

#### Fields Defined

| Field | Type | Used in UI? | Where? | Notes |
|-------|------|-------------|--------|-------|
| `name` | string | ❌ | About page | Hardcoded as "About Michael" |
| `title` | string | ❌ | About/Homepage | Hardcoded as "Product Strategist..." |
| `tagline` | string | ❌ | N/A | Not displayed anywhere |
| `bio` | rich text | ❌ | About page | About page has hardcoded paragraphs |
| `profileImage` | image | ❌ | About/Homepage | Both use placeholders |
| `skills` | array | ❌ | N/A | Not displayed (homepage has hardcoded capabilities) |
| `experience` | array | ❌ | N/A | Not displayed anywhere |
| `social.github` | url | ❌ | N/A | Not displayed |
| `social.linkedin` | url | ❌ | Contact | Contact has placeholder text |
| `social.twitter` | url | ❌ | N/A | Not displayed |
| `social.email` | email | ❌ | Contact | Contact has placeholder email |

**Usage Status:** 0% - Schema exists but completely unused

**Recommendation:** Integrate profile schema into About page and homepage hero section.

---

### 2.3 Capability Schema (`/src/sanity-schemas/capability.ts`)

**Status:** ✅ Registered in config | ❌ NOT used in UI

#### Fields Defined

| Field | Type | Used in UI? | Where? | Notes |
|-------|------|-------------|--------|-------|
| `title` | string | ❌ | N/A | Homepage has hardcoded capabilities array |
| `category` | string | ❌ | N/A | Not displayed |
| `icon` | string | ❌ | N/A | Not displayed |
| `description` | text | ❌ | N/A | Not displayed |
| `skills` | array | ❌ | N/A | Not displayed |
| `order` | number | ❌ | N/A | Not used |

**Usage Status:** 0% - Schema exists but completely unused

**Note:** Homepage has a hardcoded `capabilities` array but it's commented out in the UI.

**Recommendation:** Either create a capabilities section in the UI or remove this schema if not needed.

---

### 2.4 AI Project Schema (`/sanity/schemas/aiProject.ts`)

**Status:** ❌ NOT registered in config | ✅ Perfect structure match

#### Fields Defined

| Field | Type | Matches UI? | Data Source | Notes |
|-------|------|-------------|-------------|-------|
| `title` | string | ✅ | `/src/data/aiProjects.ts` | Perfect match |
| `slug` | slug | ✅ | Data file | Perfect match |
| `subtitle` | string | ✅ | Data file | Perfect match |
| `description` | text | ✅ | Data file | Perfect match |
| `category` | string | ✅ | Data file | Perfect match |
| `status` | string | ✅ | Data file | Perfect match |
| `heroImage` | image | ✅ | Data file (as URL) | Perfect match |
| `liveUrl` | url | ✅ | Data file | Perfect match |
| `githubUrl` | url | ✅ | Data file | Perfect match |
| `overview` | object | ✅ | Data file | Perfect match |
| `metrics` | array | ✅ | Data file | Perfect match |
| `techStack` | array | ✅ | Data file | Perfect match |
| `aiComponents` | array | ✅ | Data file | Perfect match |
| `developmentProcess` | array | ✅ | Data file | Perfect match |
| `learnings` | array | ✅ | Data file | Perfect match |
| `achievements` | array | ✅ | Data file | Perfect match |
| `images` | array | ⚠️ | Data file | In schema, not in UI |
| `featured` | boolean | ⚠️ | N/A | In schema, not in UI |
| `order` | number | ⚠️ | N/A | In schema, not in UI |
| `publishedAt` | datetime | ⚠️ | N/A | In schema, not in UI |

**Usage Status:** 100% structure match but 0% integration

**CRITICAL:** Schema exists and perfectly matches the hardcoded data structure, but:
1. NOT registered in `sanity.config.ts`
2. UI reads from `/src/data/aiProjects.ts` instead of Sanity

**Recommendation:** This is the easiest win - register the schema and migrate data to Sanity.

---

## 3. Detailed Gap Analysis

### 3.1 Missing CMS Features (High Priority)

**Total: 28 high-priority missing features**

#### Homepage (13 fields)

1. `homepage.heroName` - Static "Michael Evans" text
2. `homepage.heroOptions` array - 4 rotating hero variations
3. `homepage.aboutTitle` - "Product Strategist & Creative Technologist"
4. `homepage.aboutBio` - Bio paragraph
5. `homepage.aboutImage` - Profile photo
6. `homepage.aboutCtaText` - "Learn more about my background"
7. `homepage.aboutCtaLink` - "/about"
8. `homepage.featuredWorkTitle` - "Selected Work"
9. `homepage.featuredWorkSubtitle` - "Case studies and product launches"
10. `homepage.featuredProjects` - Reference array
11. `homepage.aiProjectsTitle` - "AI Projects"
12. `homepage.aiProjectsSubtitle` - "Production apps and experiments"
13. `homepage.featuredAIProjects` - Reference array

**Impact:** Homepage is the primary landing page - all content is hardcoded

**Effort:** Medium-High (complex data structures)

---

#### About Page (3 fields)

1. `about.pageTitle` - "About Michael"
2. Integration with `profile.bio` - 6 hardcoded paragraphs
3. Integration with `profile.profileImage` - Placeholder gradient

**Impact:** High - About page tells Michael's story, should be editable

**Effort:** Low (schema exists, just needs integration)

---

#### Contact Component (10 fields)

1. `contact.heading` - "Let's Create Something Exceptional"
2. `contact.description` - Description paragraph
3. `contact.primaryCtaText` - "Start a Project"
4. `contact.primaryCtaLink` - Button URL
5. `contact.secondaryCtaText` - "Schedule a Call"
6. `contact.secondaryCtaLink` - Button URL
7. `contact.email` - "hello@yourconsulting.com" (placeholder)
8. `contact.linkedinUrl` - LinkedIn profile
9. `contact.linkedinText` - "Connect with me"
10. `contact.locationText` - "Available Worldwide"

**Impact:** High - Contact info is placeholder/incorrect

**Effort:** Low (straightforward fields)

---

#### AI Project Registration (1 field)

1. **Register AI Project schema** in `sanity.config.ts`

**Impact:** CRITICAL - Blocks all AI project CMS functionality

**Effort:** 1 minute (add one import line)

---

#### AI Showcase Page (3 fields)

1. `aiShowcase.pageTitle` - "AI App Showcase"
2. `aiShowcase.pageDescription` - Page description
3. `aiShowcase.featuredProjects` - Reference to AI projects

**Impact:** Medium - Page is functional but hardcoded

**Effort:** Low (once AI Project schema is registered)

---

### 3.2 Missing CMS Features (Medium Priority)

**Total: 12 medium-priority missing features**

#### SEO Metadata (All Pages)

Every page needs:
1. `seoTitle` (string)
2. `seoDescription` (text)
3. `ogImage` (image)

**Affected pages:**
- Homepage (3 fields)
- About (3 fields)
- AI Showcase (3 fields)
- AI Project detail pages (3 fields - already in schema)

**Impact:** Medium - Important for discoverability

**Effort:** Low (repeatable pattern)

---

#### Navigation (3 fields)

1. `siteSettings.brandName` - "MEvans"
2. `siteSettings.logoImage` - Optional logo
3. `navigation.menuItems` - Menu structure

**Impact:** Medium - Navigation changes require code changes

**Effort:** Medium (nested structure)

---

### 3.3 Missing CMS Features (Low Priority)

**Total: 7 low-priority missing features**

#### Case Studies

1. Display `heroImage` on case study pages
2. Display `technologies` used
3. Display `liveUrl` / `githubUrl` links
4. Use `project.content` for detailed content sections

**Impact:** Low - Pages are functional without these

**Effort:** Low-Medium

---

#### General

1. `siteSettings.menuButtonText` - "Menu" text
2. 404 page content
3. Site footer content (if exists)

---

### 3.4 Unused CMS Features

**Total: 8 unused schema fields**

#### Profile Schema (4 unused fields)

1. `profile.tagline` - Defined but not displayed
2. `profile.skills` - Defined but not displayed (homepage has separate hardcoded capabilities)
3. `profile.experience` - Defined but not displayed
4. `profile.social` - Defined but not integrated with Contact component

**Recommendation:** 
- Integrate `social` with Contact component
- Consider adding an Experience section to About page
- Use `skills` instead of hardcoded capabilities array

---

#### Project Schema (4 unused fields)

1. `project.content` (rich text) - Not displayed on case study pages
2. `project.category` - Not displayed
3. `project.featured` - Not used for homepage filtering
4. `project.order` - Not used for sorting

**Recommendation:**
- Add detailed content sections to case studies using `content` field
- Use `featured` flag to determine which projects show on homepage
- Use `order` for controlling display sequence

---

## 4. Schema Recommendations

### 4.1 Add New Schemas

#### 4.1.1 Homepage Schema

**Create:** `/src/sanity-schemas/homepage.ts`

```typescript
{
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    {
      name: 'heroName',
      title: 'Hero Name',
      type: 'string',
    },
    {
      name: 'heroOptions',
      title: 'Hero Options',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'prefix', type: 'string', title: 'Prefix Text' },
          { name: 'dropdown', type: 'string', title: 'Dropdown Text' },
          { name: 'link', type: 'string', title: 'Link URL' },
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'image', type: 'image', title: 'Background Image' },
          { name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' },
          { name: 'colorGradient', type: 'string', title: 'Gradient (Tailwind classes)' },
        ],
      }],
    },
    {
      name: 'aboutSection',
      title: 'About Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'bio', type: 'text' },
        { name: 'image', type: 'image' },
        { name: 'ctaText', type: 'string' },
        { name: 'ctaLink', type: 'string' },
      ],
    },
    {
      name: 'featuredWork',
      title: 'Featured Work Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string' },
        {
          name: 'projects',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'project' }] }],
        },
      ],
    },
    {
      name: 'aiProjects',
      title: 'AI Projects Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string' },
        {
          name: 'projects',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'aiProject' }] }],
        },
      ],
    },
  ],
}
```

**Impact:** Enables full homepage content management

---

#### 4.1.2 Contact Schema

**Create:** `/src/sanity-schemas/contact.ts`

```typescript
{
  name: 'contact',
  title: 'Contact Settings',
  type: 'document',
  fields: [
    { name: 'heading', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'primaryCtaText', type: 'string' },
    { name: 'primaryCtaLink', type: 'string' },
    { name: 'secondaryCtaText', type: 'string' },
    { name: 'secondaryCtaLink', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'linkedinUrl', type: 'url' },
    { name: 'linkedinText', type: 'string' },
    { name: 'locationText', type: 'string' },
  ],
}
```

**Impact:** Fixes placeholder contact information

---

#### 4.1.3 Site Settings Schema

**Create:** `/src/sanity-schemas/siteSettings.ts`

```typescript
{
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'siteName', type: 'string' },
    { name: 'brandName', type: 'string' },
    { name: 'logoImage', type: 'image' },
    { name: 'seoDefaultTitle', type: 'string' },
    { name: 'seoDefaultDescription', type: 'text' },
    { name: 'ogDefaultImage', type: 'image' },
    {
      name: 'navigation',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'link', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'order', type: 'number' },
        ],
      }],
    },
  ],
}
```

**Impact:** Centralized site configuration

---

#### 4.1.4 Page SEO Schema (reusable)

**Create:** `/src/sanity-schemas/pageSeo.ts`

```typescript
// Reusable object type
{
  name: 'seoFields',
  type: 'object',
  title: 'SEO Settings',
  fields: [
    { name: 'seoTitle', type: 'string', title: 'SEO Title' },
    { name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 3 },
    { name: 'ogImage', type: 'image', title: 'Open Graph Image' },
  ],
}
```

Then add to existing schemas:
```typescript
{
  name: 'seo',
  type: 'seoFields',
}
```

**Impact:** Improves SEO across all pages

---

### 4.2 Modify Existing Schemas

#### 4.2.1 Project Schema

**Changes:**
1. Add `subtitle` field (currently missing)
2. Add `overviewText` field or rename `description` to be clearer
3. Consider adding `seo` object

---

#### 4.2.2 Profile Schema

**Changes:**
1. Already comprehensive - just needs UI integration
2. Consider adding `seo` object for About page

---

#### 4.2.3 Register AI Project Schema

**File:** `/src/sanity.config.ts`

**Add:**
```typescript
import aiProject from './sanity-schemas/aiProject'

export const schemaTypes = [
  project, 
  profile, 
  capability,
  aiProject  // ADD THIS
]
```

---

### 4.3 Remove or Repurpose

#### Option 1: Remove Capability Schema

If capabilities aren't going to be displayed, remove the schema.

#### Option 2: Integrate Capability Schema

Create a capabilities section on About or Homepage using the existing schema.

---

## 5. Implementation Priority

### Phase 1: Quick Wins (Week 1)

**Effort:** 1-2 days | **Impact:** High

1. ✅ Register AI Project schema in config (1 minute)
2. ✅ Migrate AI project data from `/src/data/aiProjects.ts` to Sanity
3. ✅ Integrate AI project pages with Sanity
4. ✅ Create Contact schema
5. ✅ Create Contact component integration
6. ✅ Fix placeholder contact information

**Result:** AI projects and Contact info become CMS-managed

---

### Phase 2: Core Content (Week 2)

**Effort:** 3-4 days | **Impact:** High

1. ✅ Create Homepage schema
2. ✅ Integrate homepage with Sanity
3. ✅ Integrate About page with existing Profile schema
4. ✅ Add profile image upload

**Result:** Homepage and About page become fully CMS-managed

---

### Phase 3: Case Studies (Week 3)

**Effort:** 2-3 days | **Impact:** Medium

1. ✅ Decide: modify Project schema or create CaseStudy schema
2. ✅ Migrate case study content to Sanity
3. ✅ Integrate case study pages with Sanity
4. ✅ Use `featured` and `order` fields for homepage

**Result:** All projects become CMS-managed

---

### Phase 4: SEO & Settings (Week 4)

**Effort:** 2-3 days | **Impact:** Medium

1. ✅ Create Site Settings schema
2. ✅ Create SEO object type
3. ✅ Add SEO fields to all schemas
4. ✅ Integrate SEO meta tags in page components
5. ✅ Make navigation CMS-managed

**Result:** Site-wide settings and SEO become CMS-managed

---

### Phase 5: Enhancements (Week 5+)

**Effort:** Variable | **Impact:** Low-Medium

1. ⚠️ Add project images to AI project pages
2. ⚠️ Add hero images to case study pages
3. ⚠️ Create capabilities/skills section UI
4. ⚠️ Add experience timeline to About page
5. ⚠️ Add rich content sections to case studies

**Result:** Enhanced content display

---

## 6. Migration Considerations

### 6.1 Data Migration

**Current State:**
- All content is hardcoded in React components
- AI projects have structured data in `/src/data/aiProjects.ts`

**Migration Path:**

1. **AI Projects** (easiest):
   - Data is already structured
   - Can write a script to import from JSON
   - File: `/src/data/aiProjects.ts` → Sanity

2. **Case Studies** (medium):
   - Extract hardcoded data from component files
   - Create JSON or CSV
   - Import to Sanity

3. **Homepage/About** (harder):
   - Text is embedded in JSX
   - Manual copy-paste to Sanity Studio
   - Or write extraction script

---

### 6.2 Code Changes

**Components to Update:**

1. `HomeMinimal.tsx` - Fetch from Sanity
2. `About.tsx` - Fetch from Sanity
3. `Navigation.tsx` - Fetch from Sanity
4. `Contact.tsx` - Fetch from Sanity
5. `BentoImageBehind.tsx` - Reference AI projects
6. Case study pages - Fetch from Sanity
7. AI project pages - Fetch from Sanity

**New Files Needed:**

1. Sanity query utilities (`/src/lib/sanity/queries.ts`)
2. Data fetching hooks or functions
3. Type definitions for Sanity data

---

### 6.3 Deployment Strategy

**Recommended Approach:**

1. ✅ Register schemas first (no breaking changes)
2. ✅ Add data to Sanity Studio
3. ✅ Create UI integration in parallel
4. ✅ Test on development
5. ✅ Deploy with feature flag (optional)
6. ✅ Switch to Sanity data source
7. ✅ Monitor for issues
8. ✅ Remove hardcoded data after validation

---

## 7. Comparison Matrix

### Project Schema vs Case Study UI

| Feature | Project Schema | Case Study UI | Match? |
|---------|---------------|---------------|--------|
| Title | ✅ | ✅ | ✅ |
| Subtitle | ❌ | ✅ | ❌ |
| Overview | description field | ✅ | ⚠️ Rename needed |
| Metrics | ✅ | ✅ | ✅ |
| Achievements | ✅ | ✅ | ✅ |
| Hero Image | ✅ | ❌ | ⚠️ Not displayed |
| Technologies | ✅ | ❌ | ⚠️ Not displayed |
| Rich Content | ✅ | ❌ | ⚠️ Not displayed |
| Links | ✅ | ❌ | ⚠️ Not displayed |

---

### AI Project Schema vs AI Project UI

| Feature | Schema | UI | Match? |
|---------|--------|-----|--------|
| Title | ✅ | ✅ | ✅ |
| Subtitle | ✅ | ✅ | ✅ |
| Description | ✅ | ✅ | ✅ |
| Status | ✅ | ✅ | ✅ |
| Links | ✅ | ✅ | ✅ |
| Overview | ✅ | ✅ | ✅ |
| Metrics | ✅ | ✅ | ✅ |
| Tech Stack | ✅ | ✅ | ✅ |
| AI Components | ✅ | ✅ | ✅ |
| Process | ✅ | ✅ | ✅ |
| Learnings | ✅ | ✅ | ✅ |
| Achievements | ✅ | ✅ | ✅ |
| Images | ✅ | ❌ | ⚠️ Not displayed |

**Result:** 92% match (best in codebase)

---

### Profile Schema vs About Page

| Feature | Schema | UI | Match? |
|---------|--------|-----|--------|
| Name | ✅ | ✅ | ⚠️ Not integrated |
| Title | ✅ | ✅ | ⚠️ Not integrated |
| Bio | ✅ | ✅ | ⚠️ Not integrated |
| Image | ✅ | ✅ | ⚠️ Not integrated |
| Tagline | ✅ | ❌ | ❌ |
| Skills | ✅ | ❌ | ❌ |
| Experience | ✅ | ❌ | ❌ |
| Social | ✅ | ⚠️ | ⚠️ Partial (Contact) |

---

## 8. Technical Debt Summary

### Current Issues

1. **Schema-Config Mismatch**: AI Project schema exists but not registered
2. **Duplicated Data Structures**: AI project data exists in both `/sanity/schemas/` and `/src/data/`
3. **Hardcoded Content**: All page content is hardcoded in components
4. **Unused Schemas**: Profile, Capability, and Project schemas have no UI integration
5. **Placeholder Data**: Contact component has fake email and placeholders
6. **No SEO Management**: No meta tags or OG images managed through CMS
7. **Manual Navigation**: Menu structure requires code changes

### Risks

1. **Content Updates Require Deploys**: Any content change needs developer + deployment
2. **No Content Preview**: Can't preview changes before publishing
3. **No Content History**: No versioning or rollback capability
4. **Collaboration Barriers**: Non-technical stakeholders can't update content
5. **SEO Gaps**: Missing critical SEO metadata for all pages

---

## 9. Success Metrics

### Post-Implementation Goals

**Content Management:**
- ✅ 100% of homepage content is CMS-managed
- ✅ 100% of About page content is CMS-managed
- ✅ 100% of project/case study content is CMS-managed
- ✅ Contact information is accurate and CMS-managed

**Technical:**
- ✅ All Sanity schemas are registered and used
- ✅ No hardcoded content in components
- ✅ SEO metadata for all pages
- ✅ Proper TypeScript types for Sanity data

**Business:**
- ✅ Content updates don't require code changes
- ✅ Non-technical users can update content
- ✅ Content preview works before publishing
- ✅ Faster content iteration cycle

---

## 10. Next Steps

### Immediate Actions (This Week)

1. ⚠️ **CRITICAL**: Add AI Project schema to `sanity.config.ts`
   ```bash
   File: /src/sanity.config.ts
   Line 8: import aiProject from './sanity-schemas/aiProject'
   Line 10: export const schemaTypes = [project, profile, capability, aiProject]
   ```

2. ⚠️ Start Sanity Studio and verify schema appears
   ```bash
   npm run sanity
   ```

3. ⚠️ Create test AI project in Sanity Studio

4. ⚠️ Write Sanity query function for AI projects

5. ⚠️ Test fetching AI project data in one component

### Week 1 Sprint

- [ ] Register AI Project schema (1 min)
- [ ] Create Contact schema (30 min)
- [ ] Create Homepage schema (2 hours)
- [ ] Migrate AI project data to Sanity (2 hours)
- [ ] Integrate AI project pages with Sanity (4 hours)
- [ ] Integrate Contact component with Sanity (2 hours)

### Planning

- [ ] Schedule schema review meeting
- [ ] Document Sanity Studio access
- [ ] Create content migration checklist
- [ ] Set up Sanity preview URLs
- [ ] Configure Sanity webhooks (optional)

---

## Appendix A: File Locations

### Frontend Files Analyzed

```
/src/pages/
├── HomeMinimal.tsx          ✅ Homepage (hardcoded)
├── About.tsx                ✅ About page (hardcoded)
├── VirginAmerica.tsx        ✅ Case study (hardcoded)
├── CasaBonita.tsx           ✅ Case study (hardcoded)
├── BeforeLauncher.tsx       ✅ Case study (hardcoded)
├── Peddle.tsx               ✅ Case study (hardcoded)
├── AIShowcase.tsx           ✅ AI showcase listing (hardcoded)
└── ai-projects/
    ├── PostPal.tsx          ✅ AI project detail (hardcoded)
    ├── KarunaGatton.tsx     ✅ AI project detail (hardcoded)
    ├── AIResearchAgent.tsx  ✅ AI project detail (hardcoded)
    └── DepartmentOfArt.tsx  ✅ AI project detail (hardcoded)

/src/components/
├── Navigation.tsx           ✅ Global nav (hardcoded)
├── Contact.tsx              ✅ Contact section (hardcoded)
└── ai-showcase-variations/
    └── BentoImageBehind.tsx ✅ AI project grid (hardcoded)

/src/data/
└── aiProjects.ts            ✅ AI project data source
```

### CMS Schema Files

```
/src/sanity-schemas/
├── project.ts               ✅ Registered, not used
├── profile.ts               ✅ Registered, not used
├── capability.ts            ✅ Registered, not used
└── [aiProject.ts missing]   ❌ NOT in this location

/sanity/schemas/
└── aiProject.ts             ✅ Exists but not registered

/src/sanity.config.ts        ⚠️ Missing aiProject import
```

---

## Appendix B: Sanity Configuration Issue

### Current Config

**File:** `/src/sanity.config.ts`

```typescript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// Import schemas
import project from './sanity-schemas/project'
import profile from './sanity-schemas/profile'
import capability from './sanity-schemas/capability'

export const schemaTypes = [project, profile, capability]
// ❌ AI Project schema is missing!
```

### Fixed Config

```typescript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// Import schemas
import project from './sanity-schemas/project'
import profile from './sanity-schemas/profile'
import capability from './sanity-schemas/capability'
import aiProject from '../sanity/schemas/aiProject'  // ADD THIS

export const schemaTypes = [
  project, 
  profile, 
  capability,
  aiProject  // ADD THIS
]
```

**OR** move `/sanity/schemas/aiProject.ts` to `/src/sanity-schemas/aiProject.ts` and import locally.

---

## Appendix C: Data Structure Comparison

### AI Project Data Structure

**Hardcoded Source** (`/src/data/aiProjects.ts`):
```typescript
{
  slug: 'post-pal',
  title: 'Post Pal',
  subtitle: 'AI-Powered Social Media Content Assistant',
  description: '...',
  heroImage: 'https://...',
  category: 'Medical Mobile & Web',
  status: 'Live',
  links: { live: '...', github: '...' },
  overview: { problem: '...', solution: '...', role: '...', timeline: '...' },
  metrics: [{ label: '...', value: '...' }],
  techStack: ['React', 'TypeScript', ...],
  aiComponents: [{ name: '...', description: '...', technology: '...' }],
  developmentProcess: [{ phase: '...', description: '...', outcomes: [...] }],
  learnings: ['...'],
  achievements: ['...'],
  images: [{ url: '...', caption: '...' }]
}
```

**Sanity Schema** (`/sanity/schemas/aiProject.ts`):
- ✅ Perfect 1:1 match with data structure
- ✅ All fields present
- ✅ Validation rules included
- ✅ Preview configuration
- ⚠️ Just needs to be registered

---

**End of Report**

---

## Summary

This portfolio site has excellent schema design (especially for AI projects) but **zero CMS integration**. The AI Project schema is the easiest win - it's already built and matches the data perfectly, but it's not registered in the config. Starting with that registration and migrating AI project data would provide immediate value and establish the pattern for integrating the rest of the site.

**Estimated Total Implementation Time:** 3-4 weeks  
**Highest ROI:** Phase 1 (AI Projects + Contact) - 1-2 days for significant impact
