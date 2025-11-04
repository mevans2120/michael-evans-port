# Testing Strategy Research & Recommendations

**Date**: November 4, 2025
**Project**: Michael Evans Portfolio
**Purpose**: Research and recommend a comprehensive testing strategy prioritizing quality over quantity

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Testing Infrastructure](#current-testing-infrastructure)
3. [Testing Philosophy & Best Practices](#testing-philosophy--best-practices)
4. [Feature-Specific Testing Strategy](#feature-specific-testing-strategy)
5. [When and Why to Use Mocks](#when-and-why-to-use-mocks)
6. [Recommendations](#recommendations)
7. [Implementation Priorities](#implementation-priorities)

---

## Executive Summary

### Current State
The project has a **solid foundation** with:
- Vitest configured for unit/integration testing
- Playwright configured for E2E testing
- 7 existing test files (4 unit, 3 E2E)
- Visual regression testing setup
- Computed styles validation

### Key Findings
1. **Testing infrastructure is production-ready** but coverage is sparse
2. **Chicago-style approach** (state-based testing) aligns well with the project architecture
3. **Critical gaps** in chatbot, CMS integration, and design system testing
4. **Quality-focused approach** needed: prioritize high-value tests over comprehensive coverage

### Strategic Recommendations
- **Adopt hybrid Chicago/London approach**: Primarily state-based with strategic mocking for external dependencies
- **Focus on integration tests** for critical user flows (chatbot, navigation, CMS sync)
- **Leverage existing visual regression** for design system validation
- **Mock sparingly**: Database, external APIs, and expensive operations only

---

## Current Testing Infrastructure

### Test Configuration

#### Unit/Integration Testing (Vitest)
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',        // Browser DOM simulation
    setupFiles: './vitest.setup.ts',
    exclude: ['/e2e/']
  }
})
```

**Current coverage:**
- `useMediaQuery.test.ts` - Media query hook (mocked matchMedia)
- `utils.test.ts` - Utility functions (pure functions)
- `logger.test.ts` - Logging utilities
- `admin-auth.test.ts` - Admin authentication

#### E2E Testing (Playwright)
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e/',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure'
  }
})
```

**Current coverage:**
- `visual-regression.spec.ts` - Screenshot comparisons (desktop/tablet/mobile)
- `computed-styles.spec.ts` - CSS property validation
- `chat-navigation.spec.ts` - Chat integration tests

### Test Commands
```bash
npm run test                   # Unit tests (Vitest)
npm run test:e2e              # E2E tests (Playwright)
npm run test:visual           # Visual regression
npm run test:styles           # CSS validation
npm run test:refactor         # Full suite (build + all tests)
```

### Strengths
✅ Modern tooling (Vitest + Playwright)
✅ Visual regression infrastructure
✅ CSS validation system
✅ Separation of unit vs E2E tests
✅ CI-ready configuration

### Gaps
❌ No chatbot RAG pipeline testing
❌ No CMS webhook/sync testing
❌ No design system rule validation
❌ Limited component integration tests
❌ No vector database testing

---

## Testing Philosophy & Best Practices

### Chicago School vs London School

#### Chicago School (Classic/Detroit) - **PRIMARY APPROACH**
- **Focus**: State-based verification and outcomes
- **Mocking**: Minimal - only for external dependencies
- **Approach**: Bottom-up, inside-out testing
- **Benefits**:
  - Higher confidence in full code paths
  - Enables ruthless refactoring
  - More realistic tests
  - Fewer brittle tests

**Example (Chicago style):**
```typescript
test('chatbot returns relevant answer', async () => {
  const response = await sendChatMessage('What is agentic engineering?');

  // Assert on STATE/OUTCOME
  expect(response.content).toContain('autonomous agents');
  expect(response.followUpQuestions).toHaveLength(2);
  expect(response.sessionId).toBeDefined();
});
```

#### London School (Mockist) - **SELECTIVE USE**
- **Focus**: Interaction-based verification
- **Mocking**: Heavy use of mocks/stubs
- **Approach**: Top-down, outside-in testing
- **Benefits**:
  - Isolated unit testing
  - Fast test execution
  - Useful for 3rd party integrations

**Example (London style):**
```typescript
test('chatbot calls vector database', async () => {
  const mockSearch = vi.fn().mockResolvedValue([/* results */]);

  await sendChatMessage('question', { search: mockSearch });

  // Assert on INTERACTION
  expect(mockSearch).toHaveBeenCalledWith(
    expect.objectContaining({ query: 'question' })
  );
});
```

### Hybrid Approach - **RECOMMENDED**

**Use Chicago (state-based) for:**
- Domain logic (pure functions, business rules)
- Component behavior (user interactions, state changes)
- Integration flows (multi-step processes)
- End-to-end user journeys

**Use London (interaction-based) for:**
- External API integrations (Anthropic, Supabase)
- Database operations (vector DB, Sanity)
- File system operations
- Network requests

### 2025 Testing Best Practices

#### Quality Over Quantity
> "Effective testing is not about achieving 100% code coverage, but about building a reliable safety net that enables rapid development and confident releases."

**Prioritization Framework:**
1. **Critical user flows** (80% of value) - Test first
2. **Core business logic** (15% of value) - Test thoroughly
3. **Edge cases and error handling** (5% of value) - Test selectively

#### Test Pyramid (Next.js 15)
```
        E2E (10%)
       /         \
    Integration (30%)
   /               \
  Unit (60%)
```

**Unit Tests (60%)**
- Pure functions
- Utilities
- Hooks
- Component logic

**Integration Tests (30%)**
- API routes
- Database operations
- Component interactions
- Multi-step flows

**E2E Tests (10%)**
- Critical user journeys
- Cross-browser validation
- Visual regression

#### Best Practices Summary
1. **Keep tests focused and independent** - One flow per test
2. **Use descriptive test names** - Clearly state what's being tested
3. **Leverage parallel testing** - Reduce CI time
4. **Integrate with CI/CD** - Catch issues early
5. **Mock external dependencies** - Not internal code
6. **Test behavior, not implementation** - Avoid brittle tests

---

## Feature-Specific Testing Strategy

### 1. Chatbot Testing

#### Architecture Overview
```
User Query
    ↓
API Route (/api/chat)
    ↓
Query Preprocessor (entity extraction, keyword expansion)
    ↓
Embedding Generation (768-dimensional vectors)
    ↓
Hybrid Search (semantic + keyword)
    ↓
Result Reranking (relevance scoring)
    ↓
LLM Synthesis (Claude Haiku)
    ↓
Streamed Response
```

#### Testing Layers

##### Layer 1: Unit Tests (Pure Functions)
**Test without mocks:**
```typescript
// query-preprocessor.test.ts
describe('Query Preprocessor', () => {
  test('extracts project names from query', () => {
    const result = preprocessQuery('Tell me about the Meta campaign');
    expect(result.entities).toContain('Meta');
  });

  test('expands semantic variations', () => {
    const result = preprocessQuery('agentic engineering');
    expect(result.expandedKeywords).toContain('autonomous agents');
  });
});

// hybrid-search.test.ts
describe('Hybrid Search Scoring', () => {
  test('combines semantic and keyword scores', () => {
    const semanticResults = [{ id: '1', score: 0.9 }];
    const keywordResults = [{ id: '1', score: 0.8 }];

    const combined = combineResults(semanticResults, keywordResults);
    expect(combined[0].finalScore).toBeGreaterThan(0.8);
  });
});
```

##### Layer 2: Integration Tests (With Mocks)
**Mock external dependencies only:**
```typescript
// chat-route.integration.test.ts
describe('Chat API Route', () => {
  let mockVectorDB: MockInstance;
  let mockLLM: MockInstance;

  beforeEach(() => {
    // Mock external services (Supabase, Anthropic)
    mockVectorDB = vi.spyOn(supabase, 'searchSimilarDocuments')
      .mockResolvedValue([mockDocuments]);

    mockLLM = vi.spyOn(anthropic, 'messages.stream')
      .mockResolvedValue(mockStream);
  });

  test('returns relevant answer from RAG pipeline', async () => {
    const response = await POST({
      messages: [{ role: 'user', content: 'What is agentic engineering?' }]
    });

    // Verify vector search was called
    expect(mockVectorDB).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining('agentic')
      })
    );

    // Verify LLM received context
    expect(mockLLM).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining('portfolio content')
      })
    );

    // Assert on response
    const reader = response.body?.getReader();
    const { value } = await reader?.read();
    expect(new TextDecoder().decode(value)).toBeTruthy();
  });

  test('handles praise messages with ASCII art', async () => {
    const response = await POST({
      messages: [{ role: 'user', content: 'you are awesome!' }]
    });

    const text = await streamToString(response.body);
    expect(text).toMatch(/[*╔╗╚╝]/); // ASCII art characters
    expect(mockVectorDB).not.toHaveBeenCalled(); // No search needed
  });
});
```

##### Layer 3: E2E Tests (Real System)
**Test critical user flows:**
```typescript
// chatbot.e2e.spec.ts
test.describe('Chatbot User Experience', () => {
  test('answers questions about experience', async ({ page }) => {
    await page.goto('/');

    // Open chat
    await page.click('[aria-label="Open chat"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Send message
    await page.fill('[placeholder="Ask me anything"]', 'What is your experience with AI?');
    await page.click('[aria-label="Send message"]');

    // Verify response
    await expect(page.locator('.chat-message-assistant')).toContainText('AI', { timeout: 10000 });

    // Verify follow-up questions
    const followUps = page.locator('.follow-up-question');
    await expect(followUps).toHaveCount(2);
  });

  test('maintains conversation context', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Open chat"]');

    // First message
    await page.fill('[placeholder="Ask me anything"]', 'Tell me about the Meta campaign');
    await page.click('[aria-label="Send message"]');
    await page.waitForSelector('.chat-message-assistant');

    // Follow-up (referencing previous context)
    await page.fill('[placeholder="Ask me anything"]', 'What were the results?');
    await page.click('[aria-label="Send message"]');

    // Verify contextual response
    const response = page.locator('.chat-message-assistant').last();
    await expect(response).toContainText(/Meta|campaign|results/i, { timeout: 10000 });
  });
});
```

#### Mock Strategy for Chatbot

**MOCK (External Dependencies):**
- ✅ Supabase vector database client
- ✅ Anthropic API calls
- ✅ Embedding generation (for unit tests)

**DO NOT MOCK (Internal Logic):**
- ❌ Query preprocessing
- ❌ Hybrid search scoring
- ❌ Result reranking
- ❌ Response formatting

**Rationale**: We want to test the full RAG pipeline logic while isolating external API costs and network variability.

#### Content Sync Testing

**Test the two content paths:**
```typescript
// content-sync.integration.test.ts
describe('Content Synchronization', () => {
  test('Sanity webhook triggers vector DB update', async () => {
    // Mock Supabase upsert
    const mockUpsert = vi.spyOn(supabase, 'upsertDocument');

    // Simulate Sanity webhook
    await POST('/api/admin/sanity-webhook', {
      body: JSON.stringify({
        _type: 'project',
        _id: 'project-123',
        title: 'New Project'
      })
    });

    // Verify vector DB was updated
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source_id: 'sanity:project:project-123'
      })
    );
  });

  test('Manual ingestion processes transcript files', async () => {
    // Create test transcript
    const testTranscript = '/tmp/test-transcript.md';
    await writeFile(testTranscript, '# Test Content\nAgentic engineering...');

    // Run ingestion
    await runIngest([testTranscript]);

    // Verify document was added
    const docs = await supabase.findDocumentsBySourceId('transcript:test-transcript');
    expect(docs).toHaveLength(1);
    expect(docs[0].content).toContain('Agentic engineering');
  });
});
```

---

### 2. UI Navigation Testing

#### Navigation Architecture
```
NavigationPanel (desktop sidebar / mobile header)
  ↓
NavigationMenu (routes)
  ↓
ChatSection (expandable panel)
  ↓
Footer
```

#### Testing Strategy

##### Component Unit Tests
```typescript
// NavigationPanel.test.tsx
describe('NavigationPanel', () => {
  test('renders mobile navigation on small screens', () => {
    // Mock useMediaQuery
    vi.mocked(useMediaQuery).mockReturnValue(false);

    render(<NavigationPanel />);

    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  test('toggles chat panel on button click', async () => {
    const user = userEvent.setup();
    render(<NavigationPanel />);

    const chatButton = screen.getByLabelText('Open chat');
    await user.click(chatButton);

    expect(screen.getByRole('dialog')).toBeVisible();
  });
});
```

##### E2E Navigation Tests
```typescript
// navigation.e2e.spec.ts
test.describe('Navigation Flow', () => {
  test('navigates between main sections', async ({ page }) => {
    await page.goto('/');

    // Homepage
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText(/Michael Evans|Portfolio/i);

    // Navigate to About
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');

    // Navigate to Case Studies
    await page.click('a[href="/case-studies"]');
    await expect(page).toHaveURL('/case-studies');
    await expect(page.locator('h1')).toContainText('Case Studies');
  });

  test('mobile navigation toggles correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify menu is hidden
    await expect(page.locator('nav')).not.toBeVisible();

    // Open menu
    await page.click('[aria-label="Open menu"]');
    await expect(page.locator('nav')).toBeVisible();

    // Click link and verify menu closes
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('nav')).not.toBeVisible();
  });
});
```

##### Responsive Behavior Tests
```typescript
// responsive-navigation.e2e.spec.ts
test.describe('Responsive Navigation', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 }
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} navigation behavior`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      if (viewport.width < 768) {
        // Mobile: hamburger menu
        await expect(page.locator('[aria-label="Open menu"]')).toBeVisible();
      } else {
        // Desktop: persistent sidebar
        await expect(page.locator('nav')).toBeVisible();
      }
    });
  }
});
```

**Mock Strategy**: Minimal - only mock `useMediaQuery` hook in component unit tests. E2E tests use real viewport sizes.

---

### 3. Design System Testing

#### Design System Architecture
```
globals.css (utility classes, design tokens)
  ↓
tailwind.config.ts (custom durations, colors, easings)
  ↓
Component implementations (Tailwind classes)
```

#### Testing Strategy

##### Approach 1: Visual Regression (Current)
**Best for**: Detecting unintended visual changes

```typescript
// visual-regression.spec.ts (existing)
test('homepage matches baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-desktop.png', {
    maxDiffPixels: 100
  });
});
```

**Pros**: Catches all visual changes
**Cons**: Can be brittle, requires baseline updates

##### Approach 2: Computed Styles Validation (Current)
**Best for**: Validating specific CSS properties

```typescript
// computed-styles.spec.ts (existing)
test('accent color uses semantic token', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('button.accent');

  const bgColor = await button.evaluate(el =>
    getComputedStyle(el).backgroundColor
  );

  expect(bgColor).toBe('rgb(139, 92, 246)'); // --accent light mode
});
```

##### Approach 3: Design Rule Validation (NEW)
**Best for**: Enforcing design system rules

```typescript
// design-system-rules.e2e.spec.ts
describe('Design System Compliance', () => {
  test('all purple elements have dark mode variants', async ({ page }) => {
    await page.goto('/');

    // Find all elements with purple text
    const purpleElements = await page.locator('[class*="text-purple"]').all();

    for (const el of purpleElements) {
      const classes = await el.getAttribute('class');

      // Verify dark mode variant exists
      expect(classes).toMatch(/dark:text-purple-\d+/);
    }
  });

  test('all transitions use semantic durations', async ({ page }) => {
    await page.goto('/');

    const transitionElements = await page.locator('[class*="transition"]').all();

    for (const el of transitionElements) {
      const classes = await el.getAttribute('class');

      // Verify semantic duration (fast, normal, slow, slower)
      const hasSemanticDuration = /duration-(fast|normal|slow|slower)/.test(classes || '');
      const hasMagicNumber = /duration-\d+/.test(classes || '');

      expect(hasSemanticDuration || !hasMagicNumber).toBe(true);
    }
  });

  test('no inline styles except documented exceptions', async ({ page }) => {
    await page.goto('/');

    const elementsWithStyles = await page.locator('[style]').all();

    for (const el of elementsWithStyles) {
      const style = await el.getAttribute('style');
      const dataException = await el.getAttribute('data-style-exception');

      // If inline style exists, must have exception attribute
      if (style && !dataException) {
        const html = await el.innerHTML();
        throw new Error(`Inline style without exception: ${html.slice(0, 100)}`);
      }
    }
  });
});
```

##### Approach 4: Unit Tests for Utilities
```typescript
// cn-utility.test.ts
describe('cn() utility', () => {
  test('combines class names', () => {
    const result = cn('base-class', 'additional-class');
    expect(result).toBe('base-class additional-class');
  });

  test('handles conditional classes', () => {
    const result = cn('base', { 'active': true, 'hidden': false });
    expect(result).toBe('base active');
  });

  test('merges Tailwind conflicts correctly', () => {
    const result = cn('text-purple-400', 'text-purple-500');
    expect(result).toBe('text-purple-500'); // Later class wins
  });
});
```

#### Recommended Approach: Multi-Layered

**Layer 1: Unit tests** for utilities (`cn()`, color helpers)
**Layer 2: Computed styles tests** for critical design tokens
**Layer 3: Visual regression** for major pages (homepage, about, case studies)
**Layer 4: Design rule validation** for style guide compliance

**Mock Strategy**: None - all tests run against real styles

---

### 4. CMS Testing

#### CMS Architecture
```
Sanity Studio (content editing)
  ↓
Sanity API (GROQ queries)
  ↓
Next.js pages (data fetching)
  ↓
Components (rendering)
  ↓
[Webhook] → Vector DB (chatbot sync)
```

#### Testing Layers

##### Layer 1: Schema Validation Tests
```typescript
// sanity-schemas.test.ts
import { profileSchema, projectSchema } from '@/sanity/schemas';

describe('Sanity Schemas', () => {
  test('profile schema defines required fields', () => {
    const requiredFields = ['name', 'headline', 'intro'];

    for (const field of requiredFields) {
      const fieldDef = profileSchema.fields.find(f => f.name === field);
      expect(fieldDef).toBeDefined();
      expect(fieldDef?.validation).toBeDefined();
    }
  });

  test('project schema includes SEO fields', () => {
    const seoFields = ['title', 'slug', 'summary', 'heroImage'];

    for (const field of seoFields) {
      const fieldDef = projectSchema.fields.find(f => f.name === field);
      expect(fieldDef).toBeDefined();
    }
  });
});
```

##### Layer 2: GROQ Query Tests
```typescript
// sanity-queries.test.ts
import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery, profileQuery } from '@/lib/sanity/queries';

describe('Sanity Queries', () => {
  test('projects query returns expected structure', async () => {
    const projects = await sanityClient.fetch(projectsQuery);

    expect(Array.isArray(projects)).toBe(true);
    expect(projects[0]).toMatchObject({
      _id: expect.any(String),
      title: expect.any(String),
      slug: expect.objectContaining({ current: expect.any(String) }),
      category: expect.any(String)
    });
  });

  test('profile query returns singleton document', async () => {
    const profile = await sanityClient.fetch(profileQuery);

    expect(profile).toBeDefined();
    expect(profile).toMatchObject({
      name: expect.any(String),
      headline: expect.any(String),
      capabilities: expect.any(Array)
    });
  });
});
```

**Mock Strategy for GROQ tests**:
- **Local development**: Use real Sanity client (test dataset)
- **CI**: Mock `sanityClient.fetch()` with fixture data

##### Layer 3: Data Fetching Integration Tests
```typescript
// sanity-integration.test.ts
import { fetchProjects, fetchProfile } from '@/lib/sanity/fetchers';

describe('Sanity Data Fetching', () => {
  test('fetchProjects returns processed data', async () => {
    const projects = await fetchProjects();

    expect(projects).toBeDefined();
    expect(projects[0]).toMatchObject({
      title: expect.any(String),
      imageUrl: expect.stringMatching(/^https:\/\/cdn\.sanity\.io/),
      technologies: expect.any(Array)
    });
  });

  test('fetchProfile includes computed fields', async () => {
    const profile = await fetchProfile();

    // Verify image URLs are resolved
    expect(profile.profileImageUrl).toMatch(/^https:\/\/cdn\.sanity\.io/);

    // Verify technologies are grouped by category
    expect(profile.technologiesByCategory).toHaveProperty('frontend');
    expect(profile.technologiesByCategory).toHaveProperty('backend');
  });
});
```

##### Layer 4: Webhook Integration Tests
```typescript
// sanity-webhook.integration.test.ts
describe('Sanity → Vector DB Sync', () => {
  test('project update triggers vector DB sync', async () => {
    const mockUpsert = vi.spyOn(supabase, 'upsertDocument');

    // Simulate Sanity webhook
    const webhookPayload = {
      _type: 'project',
      _id: 'project-123',
      title: 'Updated Project',
      summary: 'New summary text',
      description: 'Full description...'
    };

    await POST('/api/admin/sanity-webhook', {
      body: JSON.stringify(webhookPayload)
    });

    // Verify vector DB received update
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source_id: 'sanity:project:project-123',
        content: expect.stringContaining('Updated Project'),
        metadata: expect.objectContaining({
          source: 'project',
          title: 'Updated Project'
        })
      })
    );
  });
});
```

##### Layer 5: E2E Page Rendering Tests
```typescript
// cms-rendering.e2e.spec.ts
test.describe('CMS Content Rendering', () => {
  test('homepage displays Sanity content', async ({ page }) => {
    await page.goto('/');

    // Verify hero content from Sanity
    await expect(page.locator('h1')).toBeVisible();

    // Verify featured projects
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toHaveCount.greaterThanOrEqual(1);
  });

  test('case study detail renders portable text', async ({ page }) => {
    await page.goto('/case-studies/meta-campaign');

    // Verify title
    await expect(page.locator('h1')).toContainText('Meta');

    // Verify hero image loads
    const heroImage = page.locator('[data-testid="hero-image"]');
    await expect(heroImage).toBeVisible();

    // Verify content sections
    const sections = page.locator('[data-testid="case-study-section"]');
    await expect(sections).toHaveCount.greaterThanOrEqual(1);
  });

  test('live preview updates reflect in UI', async ({ page }) => {
    // This requires Sanity Studio preview mode
    await page.goto('/case-studies/meta-campaign?preview=true');

    // TODO: Interact with Sanity Studio to make changes
    // Verify changes appear without page reload
  });
});
```

#### Mock Strategy for CMS

**MOCK:**
- ✅ Sanity API client in unit tests
- ✅ Webhook calls in integration tests
- ✅ Image URL builder for fast tests

**DO NOT MOCK:**
- ❌ GROQ query syntax validation (use test dataset)
- ❌ Portable text rendering
- ❌ E2E page rendering (use real API in development dataset)

**Best Practice**: Maintain a `test` dataset in Sanity with known fixture data.

---

## When and Why to Use Mocks

### Decision Framework

```
Should I mock this dependency?
    ↓
Is it an external service? (API, database, file system)
    ├─ YES → Mock it
    └─ NO → Keep it real
        ↓
    Is it expensive? (cost, time, rate limits)
        ├─ YES → Mock it
        └─ NO → Keep it real
            ↓
        Is it non-deterministic? (time, random, network)
            ├─ YES → Mock it
            └─ NO → Keep it real (Chicago style!)
```

### When to Mock

#### 1. External APIs
**Why**: Cost, rate limits, network reliability

```typescript
// ✅ MOCK: Anthropic API calls
const mockAnthropic = vi.spyOn(anthropic, 'messages.stream')
  .mockResolvedValue(mockStream);

// ✅ MOCK: Embedding generation
const mockEmbedding = vi.spyOn(embeddings, 'generate')
  .mockResolvedValue(Array(768).fill(0));
```

**Rationale**:
- Anthropic API costs money per token
- Rate limits can cause test failures
- Network variability affects test reliability

#### 2. Database Operations
**Why**: Test isolation, speed, setup complexity

```typescript
// ✅ MOCK: Supabase vector search
const mockSearch = vi.spyOn(supabase, 'searchSimilarDocuments')
  .mockResolvedValue([
    { id: '1', content: 'Agentic engineering...', similarity: 0.92 }
  ]);

// ✅ MOCK: Sanity CMS queries (in unit tests)
const mockFetch = vi.spyOn(sanityClient, 'fetch')
  .mockResolvedValue(mockProjects);
```

**Rationale**:
- No need to seed test database
- Fast test execution
- Predictable test data

#### 3. Time-Dependent Logic
**Why**: Non-deterministic behavior

```typescript
// ✅ MOCK: Date/time
vi.useFakeTimers();
vi.setSystemTime(new Date('2025-11-04'));

// Run test
const result = getTimeAgo('2025-11-01');
expect(result).toBe('3 days ago');

vi.useRealTimers();
```

#### 4. File System Operations
**Why**: Test isolation, cleanup

```typescript
// ✅ MOCK: File reading (in unit tests)
vi.mock('fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue('transcript content...'),
  writeFile: vi.fn().mockResolvedValue(undefined)
}));
```

### When NOT to Mock

#### 1. Internal Business Logic
**Why**: We want to test the real behavior

```typescript
// ❌ DON'T MOCK: Query preprocessing
const result = preprocessQuery('What is agentic engineering?');
expect(result.entities).toContain('agentic');

// ❌ DON'T MOCK: Hybrid search scoring
const scored = scoreResults(semanticResults, keywordResults);
expect(scored[0].finalScore).toBeGreaterThan(0.8);
```

**Rationale**: These are the core features we're building - we need to test them for real.

#### 2. Pure Functions
**Why**: Fast, deterministic, no side effects

```typescript
// ❌ DON'T MOCK: Utility functions
expect(cn('base', { active: true })).toBe('base active');

// ❌ DON'T MOCK: Data transformations
const grouped = groupByCategory(technologies);
expect(grouped.frontend).toHaveLength(5);
```

#### 3. Component Interactions (Integration Tests)
**Why**: We want to test how components work together

```typescript
// ❌ DON'T MOCK: Child components
render(
  <NavigationPanel>
    <NavigationMenu />
    <ChatSection />
  </NavigationPanel>
);

// Test real interaction
await userEvent.click(screen.getByLabelText('Open chat'));
expect(screen.getByRole('dialog')).toBeVisible();
```

#### 4. In-Memory Operations
**Why**: Fast and deterministic

```typescript
// ❌ DON'T MOCK: Array/object operations
const filtered = projects.filter(p => p.category === 'AI');
expect(filtered).toHaveLength(3);
```

### Mock Strategy Summary

| Dependency | Mock? | Why |
|------------|-------|-----|
| Anthropic API | ✅ Yes | Cost, rate limits |
| Supabase vector DB | ✅ Yes | Setup complexity, speed |
| Sanity CMS API | ⚠️ Conditional | Mock in unit tests, real in E2E |
| Query preprocessing | ❌ No | Core business logic |
| Hybrid search | ❌ No | Core feature |
| Component rendering | ❌ No | Integration testing |
| Pure functions | ❌ No | Fast, deterministic |
| File system (ingest) | ⚠️ Conditional | Mock in unit tests, real in integration tests |

---

## Recommendations

### High-Level Strategy

1. **Adopt Chicago-first approach** with strategic London-style mocking for external dependencies
2. **Focus on integration tests** for critical user flows (chatbot, CMS sync, navigation)
3. **Leverage existing visual regression** for design system validation
4. **Maintain test pyramid**: 60% unit, 30% integration, 10% E2E

### Specific Recommendations

#### 1. Chatbot Testing (HIGHEST PRIORITY)
- [ ] **Unit tests** for query preprocessing, hybrid search, reranking
- [ ] **Integration tests** for chat API route with mocked external services
- [ ] **E2E tests** for user conversation flows
- [ ] **Sync tests** for Sanity webhook → vector DB and manual ingestion

**Expected coverage**: 80% of chatbot logic
**Mock**: Anthropic API, Supabase client
**Real**: Query processing, search scoring, response formatting

#### 2. Design System Testing (MEDIUM PRIORITY)
- [ ] **Expand computed styles tests** for semantic color tokens
- [ ] **Add design rule validation** for dark mode variants, semantic durations
- [ ] **Keep visual regression** for major pages
- [ ] **Add unit tests** for `cn()` utility

**Expected coverage**: Design system compliance > brittle snapshot tests
**Mock**: None
**Real**: All styles, computed properties

#### 3. CMS Testing (MEDIUM PRIORITY)
- [ ] **Schema validation tests** to catch breaking changes
- [ ] **GROQ query tests** against test dataset
- [ ] **Webhook integration tests** with mocked vector DB
- [ ] **E2E rendering tests** for case studies and about page

**Expected coverage**: All schemas, critical queries
**Mock**: Sanity client in unit tests, vector DB in webhook tests
**Real**: GROQ queries (test dataset), page rendering (E2E)

#### 4. Navigation Testing (LOWER PRIORITY)
- [ ] **Component unit tests** for navigation panel, menu
- [ ] **Responsive behavior tests** across viewports
- [ ] **E2E navigation flow tests** for critical paths

**Expected coverage**: Core navigation behavior
**Mock**: `useMediaQuery` in unit tests
**Real**: Viewport sizes in E2E tests

### Quality Metrics

**Prioritize these metrics:**
1. **Critical flow coverage** > Line coverage percentage
2. **Test reliability** (zero flaky tests) > Test quantity
3. **Test speed** (< 30s for unit suite) > Comprehensive E2E

**Target metrics:**
- Unit tests: < 5 seconds total
- Integration tests: < 30 seconds total
- E2E tests: < 2 minutes total
- **TOTAL**: < 3 minutes (CI-friendly)

### Implementation Guidelines

#### Test Organization
```
/src/
  /lib/
    /chatbot/
      query-preprocessor.ts
      __tests__/
        query-preprocessor.test.ts     # Unit
        chat-integration.test.ts       # Integration
  /components/
    NavigationPanel.tsx
    __tests__/
      NavigationPanel.test.tsx         # Component unit
/e2e/
  chatbot.e2e.spec.ts                  # E2E
  navigation.e2e.spec.ts
  design-system-rules.e2e.spec.ts
  visual-regression.spec.ts            # Existing
```

#### Test Naming Convention
```typescript
// Unit tests: describe behavior
test('extracts entities from query', ...)
test('combines semantic and keyword scores', ...)

// Integration tests: describe flow
test('chat API returns relevant answer from RAG pipeline', ...)
test('Sanity webhook triggers vector DB update', ...)

// E2E tests: describe user action
test('user can ask questions and receive answers', ...)
test('user navigates from homepage to case study', ...)
```

#### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      # Unit + Integration (fast)
      - run: npm test

      # Build (catches type errors)
      - run: npm run build

      # E2E (slower, run in parallel if possible)
      - run: npm run test:e2e

      # Visual regression (optional, only on main)
      - if: github.ref == 'refs/heads/main'
        run: npm run test:visual
```

---

## Implementation Priorities

### Phase 1: Foundation (Week 1)
**Goal**: Test the most critical user flow

- [ ] Chatbot unit tests (query preprocessing, hybrid search)
- [ ] Chat API integration tests (mocked external services)
- [ ] E2E chatbot conversation tests
- [ ] CI/CD integration

**Outcome**: Confidence in chatbot functionality

### Phase 2: Content Integrity (Week 2)
**Goal**: Ensure CMS and sync reliability

- [ ] Sanity schema validation tests
- [ ] GROQ query tests (test dataset)
- [ ] Webhook integration tests
- [ ] Content ingestion tests

**Outcome**: Confidence in content pipeline

### Phase 3: Design System (Week 3)
**Goal**: Enforce design system compliance

- [ ] Design rule validation tests
- [ ] Computed styles tests (expand existing)
- [ ] `cn()` utility unit tests
- [ ] Visual regression (maintain existing)

**Outcome**: Automated style guide enforcement

### Phase 4: Navigation & UI (Week 4)
**Goal**: Complete test coverage

- [ ] Navigation component tests
- [ ] Responsive behavior tests
- [ ] E2E navigation flow tests
- [ ] Accessibility tests (bonus)

**Outcome**: Full confidence in UI behavior

---

## Conclusion

### Key Takeaways

1. **Chicago-first approach**: Test real behavior, mock external dependencies only
2. **Quality over quantity**: Focus on critical flows, not 100% coverage
3. **Strategic mocking**: Mock external APIs, databases, and non-deterministic behavior
4. **Test pyramid**: 60% unit, 30% integration, 10% E2E
5. **Fast feedback**: Keep test suite under 3 minutes for CI

### Success Criteria

- ✅ All critical user flows covered (chatbot, navigation, CMS sync)
- ✅ Test suite runs in < 3 minutes
- ✅ Zero flaky tests
- ✅ Design system compliance automated
- ✅ Mocking strategy clearly documented

### Next Steps

1. **Review this research** with team
2. **Create detailed implementation plan** based on priorities
3. **Set up test infrastructure** (fixtures, mocks, test datasets)
4. **Implement Phase 1** (chatbot tests)
5. **Iterate** based on learnings

---

**References:**
- Chicago School TDD: [Stack Exchange](https://softwareengineering.stackexchange.com/questions/123627/what-are-the-london-and-chicago-schools-of-tdd)
- Next.js Testing Guide: [Official Docs](https://nextjs.org/docs/app/guides/testing)
- Testing Best Practices 2025: [BrowserStack Guide](https://www.browserstack.com/guide/qa-best-practices)
- Fullstack Testing: [Talent500 Article](https://talent500.com/blog/fullstack-app-testing-unit-integration-e2e-2025/)
