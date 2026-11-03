# Chatbot Link Sharing Strategy

**Purpose:** Define how the AI chatbot intelligently shares links to case studies and website content
**Last Updated:** October 28, 2025

---

## Overview

The chatbot should act as a helpful guide that:
1. Answers questions with relevant information from RAG context
2. Proactively shares direct links to deeper content when appropriate
3. Enhances user experience by connecting conversation to site navigation

---

## Link Sharing Principles

### When to Share Links

**ALWAYS share a link when:**
- User explicitly asks about a specific project (e.g., "Tell me about Virgin America")
- User asks for more details after initial answer
- User wants to "learn more" or "see examples"
- Topic has a dedicated page with visual content, metrics, or detailed case study

**SOMETIMES share a link when:**
- Answer mentions a project that has a case study
- Topic relates to multiple projects (offer "You might also like...")
- User seems to be exploring generally (suggest relevant sections)

**RARELY/NEVER share links when:**
- Answering general questions about Michael's background
- Discussing opinions or philosophy
- User is asking about availability/contact (just provide info)
- Question is off-topic

### Link Format Guidelines

**Natural Language Integration:**
```
✅ GOOD: "The Virgin America project was Michael's most technically challenging work.
         You can read the full case study here: [Virgin America Case Study](/case-studies/virgin-america)"

✅ GOOD: "Michael built several AI projects including PostPal and Care Tracker.
         Check out the AI Showcase to see them all: [AI Projects](/ai-showcase)"

❌ BAD: "Click here: /case-studies/virgin-america"
❌ BAD: "Link: https://michael-evans-port.vercel.app/case-studies/virgin-america"
```

**Markdown Format:**
- Use descriptive link text: `[Virgin America Case Study](/path)`
- Use relative paths (not full URLs)
- Place links at natural conversation points (not mid-sentence)

---

## Site Map for Link Sharing

### Case Studies
```
/case-studies/virgin-america
  Keywords: Virgin America, airline, responsive design, Angular, conversion, awards
  When: User asks about Virgin America, airline projects, responsive design, awards

/case-studies/casa-bonita
  Keywords: Casa Bonita, restaurant, reservation system, Matt and Trey, South Park
  When: User asks about Casa Bonita, restaurant tech, large-scale launches

/case-studies/before-launcher
  Keywords: Before Launcher, Android, launcher, minimalism, app, startup, entrepreneurship
  When: User asks about Before Launcher, Android projects, entrepreneurship, startups

/case-studies/peddle
  Keywords: Peddle, car selling, marketplace, e-commerce
  When: User asks about Peddle, e-commerce, marketplace projects
```

### AI Projects
```
/ai-showcase
  Keywords: AI projects, machine learning, AI portfolio, PostPal, Care Tracker
  When: User asks about AI work generally, wants to see all AI projects

/ai-showcase/[project-slug]
  Individual AI project pages (when available)
  When: User asks about specific AI project in detail
```

### About & Information
```
/about
  Keywords: background, experience, career history, bio
  When: User asks "who is Michael" after initial answer, wants full background

/capabilities
  Keywords: skills, services, what can you do, expertise
  When: User asks about specific capabilities, services offered

/ai-research
  Keywords: AI research, interviews, findings, mevans212.com
  When: User asks about AI research project, user interviews
```

---

## Implementation Strategy

### Phase 1: System Prompt Enhancement

**Add to system prompt:**

```markdown
# Link Sharing Guidelines

You have access to the following site content. When answering questions, naturally include links when they add value:

## Case Studies
- Virgin America: /case-studies/virgin-america (airline website, responsive design, 15% conversion lift)
- Casa Bonita: /case-studies/casa-bonita (restaurant tech, 300k+ members)
- Before Launcher: /case-studies/before-launcher (Android launcher, 100k+ users)
- Peddle: /case-studies/peddle (car marketplace)

## Main Sections
- AI Projects: /ai-showcase (all AI/ML projects)
- Background: /about (full career history)
- Skills & Services: /capabilities (what Michael offers)
- AI Research: /ai-research (Spring 2024 research project)

## Link Format Rules
1. Use markdown: [Link Text](/path)
2. Use relative paths (not full URLs)
3. Integrate naturally into conversation
4. Provide context before the link
5. One link per response unless user explicitly wants multiple

## When to Share Links
- User asks about specific project → Share that project's link
- User wants "more details" → Share relevant case study
- Topic has visual/detailed content → Mention link is available
- User exploring → Suggest relevant section to browse

## Example Response with Link
"The Virgin America website was one of Michael's most challenging projects - the first responsive airline site built with Angular and IBM mainframes. The project won ~20 industry awards and improved conversion by 15% over 3 years. You can read the full case study with technical details and outcomes here: [Virgin America Case Study](/case-studies/virgin-america)"
```

### Phase 2: Content Metadata in Vector DB

**Enhance embedding chunks with metadata:**

When ingesting content, tag each chunk with:
```json
{
  "content": "Virgin America case study text...",
  "metadata": {
    "source": "case-studies/virgin-america",
    "type": "case_study",
    "title": "Virgin America",
    "url": "/case-studies/virgin-america",
    "keywords": ["airline", "responsive", "angular", "awards"],
    "has_visuals": true,
    "has_metrics": true
  }
}
```

**Use metadata in RAG responses:**
- When RAG returns chunks with URLs, include those URLs in context
- Format: "Based on: [Source Title](url)"
- LLM can then naturally reference the source

### Phase 3: Structured Link Injection

**Create a link reference file:**

```typescript
// src/lib/chatbot/link-map.ts
export const SITE_LINKS = {
  caseStudies: {
    virginAmerica: {
      path: '/case-studies/virgin-america',
      title: 'Virgin America Case Study',
      keywords: ['virgin america', 'airline', 'responsive design', 'angular', 'conversion'],
      description: 'First responsive airline website, 15% conversion lift, ~20 awards'
    },
    casaBonita: {
      path: '/case-studies/casa-bonita',
      title: 'Casa Bonita Case Study',
      keywords: ['casa bonita', 'restaurant', 'reservation', 'matt trey', 'south park'],
      description: 'Restaurant tech platform, 300k+ members, high-traffic launch'
    },
    beforeLauncher: {
      path: '/case-studies/before-launcher',
      title: 'Before Launcher Case Study',
      keywords: ['before launcher', 'android', 'launcher', 'app', 'startup'],
      description: 'Minimalist Android launcher, 100k+ users, Fast Company award'
    }
  },
  sections: {
    aiShowcase: {
      path: '/ai-showcase',
      title: 'AI Projects',
      keywords: ['ai', 'machine learning', 'ai projects', 'postpal', 'care tracker'],
      description: 'All AI/ML projects and applications'
    },
    about: {
      path: '/about',
      title: 'About Michael Evans',
      keywords: ['background', 'bio', 'experience', 'career', 'history'],
      description: 'Full professional background and career history'
    },
    capabilities: {
      path: '/capabilities',
      title: 'Capabilities & Services',
      keywords: ['skills', 'services', 'expertise', 'what can you do'],
      description: 'Skills, services, and areas of expertise'
    }
  }
}
```

**Inject into system prompt dynamically:**

```typescript
// Generate system prompt with current site links
function generateSystemPrompt(): string {
  const linkReferences = Object.entries(SITE_LINKS.caseStudies)
    .map(([key, link]) => `- ${link.title}: ${link.path}`)
    .join('\n')

  return `You are a helpful assistant...

Available content links:
${linkReferences}

When answering questions, naturally include relevant links...`
}
```

---

## Response Templates

### Template 1: Project-Specific Question

**User:** "Tell me about Virgin America"

**Response Structure:**
```
[Brief answer with key details]
→ 2-3 sentences covering main points
→ Include 1-2 impressive metrics

[Link with context]
→ "You can read the full case study here: [Link]"
→ Optional: Mention what else is in the case study
```

**Example:**
```
Virgin America was Michael's most technically challenging project - the first responsive
airline website. Built with Angular on IBM mainframe backends, it won approximately 20
industry awards and improved conversion by 15% over 3 years. The project proved that
single-page applications could scale for complex e-commerce flows.

Read the full case study with technical details and project outcomes:
[Virgin America Case Study](/case-studies/virgin-america)
```

### Template 2: Multiple Relevant Projects

**User:** "What are Michael's best projects?"

**Response Structure:**
```
[Brief overview of top projects]
→ 1-2 sentences per project
→ Key differentiator for each

[Multiple links organized]
→ "Case studies available:"
→ Bulleted list with links
```

**Example:**
```
Michael has several notable projects:

Virgin America - First responsive airline website, 15% conversion improvement, ~20 awards
Casa Bonita - Restaurant tech platform serving 300k+ members with complex reservation system
Before Launcher - Android app with 100k+ users, Fast Company's Best App of 2019

You can explore the full case studies here:
- [Virgin America](/case-studies/virgin-america)
- [Casa Bonita](/case-studies/casa-bonita)
- [Before Launcher](/case-studies/before-launcher)
```

### Template 3: Topic with Related Content

**User:** "What's Michael's experience with AI?"

**Response Structure:**
```
[Answer the question directly]
→ Timeline and key milestones
→ Specific technologies/projects

[Related content link]
→ "For more: [Link]"
→ What they'll find there
```

**Example:**
```
Michael has been working extensively with AI since early 2024. After his "oh shit" moment
building a D&D app in an hour with his son, he dove deep into AI development. He built
several production AI applications including PostPal (social media assistant), Care Tracker
(healthcare management), and multiple Claude skills for developers. He works primarily with
OpenAI, Anthropic Claude, and Google Gemini models, implementing RAG systems and custom
agent workflows.

You can see all his AI projects here: [AI Projects Showcase](/ai-showcase)

He also conducted user research on AI's impact in Spring 2024, interviewing 13 professionals:
[AI Research Project](/ai-research)
```

### Template 4: Follow-up Request

**User:** "Tell me more about that"

**Response Structure:**
```
[Deeper details on the topic]
→ Additional context
→ Technical details or outcomes

[Link to detailed page]
→ "The full story with visuals and metrics: [Link]"
```

**Example:**
```
The Casa Bonita project was particularly complex because they needed to handle extreme
traffic - 250,000 people signed up for the membership club in the first 6 hours. Michael
architected a system integrating SevenRooms for reservations with custom queueing and
membership management. The site now serves 300k+ members with an 80% booking rate and
85% table utilization.

The full case study includes the technical architecture, challenges, and Matt & Trey's
vision for the restaurant: [Casa Bonita Case Study](/case-studies/casa-bonita)
```

### Template 5: Exploratory Question

**User:** "What has Michael worked on?"

**Response Structure:**
```
[High-level categories]
→ Types of work
→ Notable clients or outcomes

[Multiple exploration paths]
→ "You might be interested in:"
→ Links to different sections
```

**Example:**
```
Michael has worked on a diverse range of projects over his 20+ year career:

**Digital Products**: Airline websites (Virgin America), e-commerce (Target, Peddle),
entertainment (Casa Bonita)
**AI/ML Projects**: Production AI applications, RAG systems, AI agents
**Startups**: Founded Beforelab, built Before Launcher (100k+ users)
**Consulting**: Work with major brands like Target, Virgin America, HBO

Depending on what interests you:
- [Case Studies](/case-studies) - Detailed project breakdowns
- [AI Projects](/ai-showcase) - AI/ML applications
- [Full Background](/about) - Complete career history
```

---

## Link Sharing Decision Tree

```
User Question
    |
    ├─ Asks about SPECIFIC project?
    │   └─ YES → Share case study link immediately
    │   └─ NO → Continue
    |
    ├─ Answer requires VISUAL/DETAILED content?
    │   └─ YES → Suggest relevant page
    │   └─ NO → Continue
    |
    ├─ User wants "MORE" or "DETAILS"?
    │   └─ YES → Share detailed page link
    │   └─ NO → Continue
    |
    ├─ Topic has DEDICATED PAGE?
    │   └─ YES → Mention link availability
    │   └─ NO → No link needed
    |
    └─ General conversation?
        └─ Answer without link (or suggest exploration)
```

---

## Testing Scenarios

### Scenario 1: Direct Project Question
**Input:** "Tell me about Virgin America"
**Expected:** Answer + link to case study
**Verify:** Link is formatted correctly, context explains what's in the case study

### Scenario 2: Comparative Question
**Input:** "What are Michael's best projects?"
**Expected:** Brief overview + multiple links
**Verify:** Links are organized (bulleted list), each has context

### Scenario 3: Topic Question
**Input:** "What's Michael's AI experience?"
**Expected:** Answer with examples + link to AI showcase
**Verify:** Answer addresses question fully before suggesting link

### Scenario 4: Follow-up
**Input:** "Tell me more" (after Casa Bonita mention)
**Expected:** Deeper info + case study link
**Verify:** Remembers context, provides additional details

### Scenario 5: Off-topic
**Input:** "What's the weather?"
**Expected:** Polite redirect, no links
**Verify:** No irrelevant links to portfolio content

### Scenario 6: General Background
**Input:** "Who is Michael Evans?"
**Expected:** Summary + optional link to /about for full story
**Verify:** Link is optional, not forced

---

## Implementation Checklist

### Phase 1: Basic Link Sharing (Week 1)
- [ ] Update system prompt with available links
- [ ] Define link sharing rules in prompt
- [ ] Test with common questions
- [ ] Verify link format (markdown, relative paths)
- [ ] Ensure natural language integration

### Phase 2: Enhanced Context (Week 2)
- [ ] Add metadata to embedding chunks
- [ ] Include source URLs in RAG context
- [ ] Create link map file
- [ ] Inject links dynamically into prompt
- [ ] Test with edge cases

### Phase 3: Smart Matching (Week 3)
- [ ] Implement keyword matching for link suggestions
- [ ] Add confidence scoring for link relevance
- [ ] Handle multiple matching links
- [ ] Test comparative and exploratory questions
- [ ] Optimize response templates

### Phase 4: Analytics & Refinement (Ongoing)
- [ ] Track which links are shared most
- [ ] Monitor user clicks on suggested links
- [ ] Identify missing links or broken patterns
- [ ] Refine based on user feedback
- [ ] A/B test different link formats

---

## Metrics for Success

**Link Sharing Rate:**
- Target: 40-60% of responses include a link when appropriate
- Measure: % of project-related questions that get links

**Link Accuracy:**
- Target: 95%+ links are relevant to user question
- Measure: Manual review of conversations

**User Engagement:**
- Target: 20%+ click-through rate on suggested links
- Measure: Analytics on link clicks from chatbot

**Natural Integration:**
- Target: Links feel natural, not forced
- Measure: User feedback, conversation flow analysis

---

## Future Enhancements

### Dynamic Link Discovery
- Automatically detect new case studies/projects
- Generate link metadata from Sanity CMS
- Keep link map in sync with site content

### Personalized Link Suggestions
- Track user interests in conversation
- Suggest progressively deeper content
- "Since you asked about X, you might also like Y"

### Link Previews
- Show preview card when link is shared
- Include thumbnail, title, brief description
- Make links more visually engaging

### Smart Follow-ups
- "Would you like to learn more about [X]?"
- Offer related content after answering
- Guide user journey through site

---

## Example Conversations

### Conversation 1: Project Discovery

**User:** "What has Michael built?"

**Assistant:** Michael has built a wide range of digital products over his career:

**Major Projects:**
- Virgin America - First responsive airline website (15% conversion lift, ~20 awards)
- Casa Bonita - Restaurant platform serving 300k+ members
- Before Launcher - Android launcher with 100k+ users

**AI Projects:**
- PostPal - AI-powered social media assistant
- Care Tracker - Healthcare management app
- Multiple Claude skills for developers

You can explore these in detail:
- [Case Studies](/case-studies) for full project breakdowns
- [AI Projects](/ai-showcase) for AI/ML work

**User:** "Tell me more about Casa Bonita"

**Assistant:** Casa Bonita is a unique restaurant project with Matt Stone and Trey Parker (South Park creators). Michael built the complete digital platform including:

- Reservation system handling 250k club signups in 6 hours
- Custom queueing for walk-in management
- Membership platform (300k+ members)
- Integration with SevenRooms POS

The system maintains 80% booking rates and 85% table utilization. It was a high-pressure launch that had to work perfectly from day one.

Full case study with architecture details and outcomes: [Casa Bonita](/case-studies/casa-bonita)

---

### Conversation 2: Technical Question

**User:** "What programming languages does Michael use?"

**Assistant:** Michael works primarily with:

**Frontend:** JavaScript/TypeScript, React, Next.js, Angular
**Backend:** Node.js, Python
**AI/ML:** Python (for AI projects), experience with OpenAI, Anthropic, Google Gemini APIs
**Mobile:** React Native, Android (Kotlin/Java)

He's platform agnostic and chooses tools based on project needs. His recent work focuses heavily on TypeScript and React for web applications, with Python for AI/ML projects.

You can see his tech stack in action across his projects: [AI Showcase](/ai-showcase)

---

### Conversation 3: Career Question

**User:** "Where has Michael worked?"

**Assistant:** Michael has worked with notable companies throughout his career:

**Work & Co** (Founding employee, 2013-2018): Led projects for Virgin America, Target, Aesop, Alaska Airlines. Opened the Portland office.

**Huge** (2008-2013): Worked on Broadway.com, Target e-commerce, HBO Go, National Association of Realtors.

**Beforelab** (Founder, 2018-2020): Built Before Launcher, won Fast Company's Best App of 2019.

**Recent** (2020-2024): Consulting with Huge/Elephant, Raw Materials, independent projects like Casa Bonita.

For his complete career history and stories: [About Michael](/about)

---

## Summary

This strategy ensures the chatbot:
1. ✅ Answers questions comprehensively first
2. ✅ Naturally suggests relevant links when helpful
3. ✅ Enhances user experience by connecting chat to site content
4. ✅ Balances information delivery with exploration
5. ✅ Maintains conversational flow without being pushy

**Key Principle:** Links should feel like helpful suggestions from a knowledgeable guide, not forced navigation prompts.
