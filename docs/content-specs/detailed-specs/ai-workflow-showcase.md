# AI Workflow & Developer Tools - Content Specification
## Article/Essay Structure

**Last Updated:** November 1, 2025
**Status:** Condensed article format (3-4 minute read)
**Style:** First-person narrative essay

---

## Metadata

**Title:** My AI Workflow: Building Production Software with Claude Code
**Slug:** `ai-workflow`
**Category:** AI Showcase
**Featured:** Yes
**Order:** 1
**Type:** Detailed Page

---

## Article Content

### Hero Section

**Title:**
My AI Workflow: Building Production Software with Claude Code

**Subtitle:**
From product manager to full-stack developer: How AI-assisted development changed everything about building software

**Lede:**
The "oh shit" moment came while building a D&D tracker with my 11-year-old son—we created a functional app in under an hour. That breakthrough crystallized a fundamental shift: what once took a year to build could now be accomplished in days or weeks with AI assistance. This is the story of discovering, refining, and productionizing an AI-powered development workflow that's shipped 30+ projects and generated 1000+ commits since March 2024.

---

### Body

For years, I quoted the same timeline to clients: complex software takes about a year to build. That estimate reflected research, strategy, design, prototyping, and full development—tested across dozens of projects. The timeline felt immutable, grounded in reality.

In early 2024, that certainty began to crack. I built a voice-activated kitchen timer prototype in Replit in about an hour. It wasn't quite usable—it needed more work—but it was surprisingly close to functional. That got my attention, but I didn't fully grasp the implications yet.

The real revelation came when working with my 11-year-old son, who loves Dungeons & Dragons. Within an hour, we had something genuinely useful—something I could actually use in our games. It's called Dungeon Tracker and is available on my GitHub.

> "This was my 'oh shit' moment. Seeing how fast AI could produce not just a prototype but actually usable software made me realize that the year-long timeline I'd always quoted was about to change dramatically."

What took a year now takes six weeks. What took six weeks now takes two. The improvement isn't linear across all task types, but it's substantial across virtually everything.

The foundation of reliable AI-assisted development starts with technology choices. TypeScript has become essential—not optional, but fundamental. The forced typing prevents an entire category of AI-generated errors. When AI doesn't keep everything in memory, it might use incorrect variable names. Without types, these mistakes only surface when production builds fail.

Single-page applications work better for AI development because they're easier for AI to maintain context. Next.js and React have proven ideal—they're modern, well-documented frameworks that AI understands deeply because they're widely used in training data.

Claude Code emerged as the most powerful, fastest, and most reliable AI coding assistant after extensive testing. It runs in the terminal, providing access to all files and CLI tools, which proves faster than VS Code plugins and more flexible than browser-based solutions. What sets Claude Code apart isn't just raw capability—it's autonomous reliability. Claude Code makes fewer mistakes than alternatives and works best when given complex, multi-step tasks to complete independently.

Over months of development, I've built comprehensive skill suites that transform Claude Code into a specialized development environment. The Project Analyzer scans TODOs with 90%+ confidence. The Project Manager handles GitHub integration with screenshots. I've built complete Design and Development suites that essentially replace what would traditionally require separate teams.

**Tech Stack:** Claude Code • TypeScript • Next.js • React • Git • Playwright • VS Code • Custom Skills • Memory Bank

The speed improvements are difficult to overstate. Implementing Sanity CMS—a task that previously took a month with multiple developers—now takes less than a week. A reasonable prototype of a functional app now takes less than an hour. Full production applications still take weeks, but what took a year now takes six weeks.

Since March 2024, I've generated over 1,000 GitHub commits across 30+ projects. The variety is remarkable: AI-powered specialized agents, autonomous analyzers, RAG-powered retrieval systems, full-stack applications, mobile apps, marketing websites, and developer tools.

**Metrics at a glance:**
- **1,000+** GitHub commits
- **30+** shipped projects
- **10x** faster implementations (Sanity CMS: 1 month → 1 week)
- **Hour** to functional prototype
- **6 weeks** for full production apps (was 1 year)

Every software project should leverage AI to enhance capabilities—not as an afterthought, but as a core architectural decision from day one. This means choosing TypeScript for better AI error detection, favoring single-page applications for easier AI context management, and building skills that encode best practices.

AI can work autonomously for extended periods, but human verification remains absolutely necessary. I read every significant change AI makes, scrolling through code to understand what it did and catch mistakes before they compound. This verification isn't busywork—it's where human judgment adds irreplaceable value.

Surprisingly, my English degree pays dividends in AI-assisted development. Specificity in language matters enormously—the ability to choose precise words, understand context, and communicate clearly makes AI dramatically more effective. Technical knowledge is learnable; clarity of communication is harder to develop but more valuable when working with AI.

The evolution from experimentation to production happened in four phases. After completing the Casa Bonita project in early 2024, I finally had time to pay attention to AI. I started with Replit for rapid prototyping—it was accessible and required minimal setup. The kitchen timer experiment proved AI could build functional software quickly, but Replit's limitations became apparent.

I moved to Cursor after hearing it was a significant step up from Replit. Eventually, I discovered Claude Code. Unlike other tools, Claude Code runs in the terminal inside VS Code, giving it access to all files and CLI tools while maintaining the power and speed I needed.

The first client projects tested the workflow under real-world pressure during summer 2024. I developed comprehensive custom skills and refined principles that sounded good in theory but needed adjustment in practice.

By fall 2024, thirty projects had shipped. One thousand commits deployed. The workflow stopped being experimental—it became simply how I build software now.

This workflow is actively evolving. The skills and tools described are available on GitHub, and I'm documenting the complete methodology for others to adopt and adapt. Interested in AI-assisted development or curious about specific techniques? Let's talk about how these approaches might work for your projects.

---

## Photography Specifications

### Photo 1: Claude Code in Action
**Subject:** Multiple VS Code windows side-by-side showing Claude Code actively building features
**Purpose:** Demonstrate the parallel development workflow
**Requirements:** Clean terminal output, visible file changes, multiple agents working simultaneously

### Photo 2: Before/After Development Timeline
**Subject:** Visual comparison showing traditional development timeline vs AI-assisted timeline
**Purpose:** Illustrate the dramatic speed improvement quantifiably
**Requirements:** Clear time markers, specific project examples

### Photo 3: Skills Ecosystem Overview
**Subject:** Visual representation of the complete skills suite (Project, Design, Development)
**Purpose:** Show the breadth and organization of custom tools built
**Requirements:** Clear labeling of each skill, connections showing how they work together

### Photo 4: The Dungeon Tracker Moment
**Subject:** The actual Dungeon Tracker app in use during a D&D game
**Purpose:** Connect the abstract "oh shit moment" to concrete reality
**Requirements:** App running on device, D&D gameplay visible in background

---

## Related Content

**Related Showcase Items:**
- PostPal (AI-powered healthcare recovery platform)
- Marketing Sites (DOA, Opal Creek, Karuna Gatton)

**Related Skills:**
- Project Suite (Analyzer, Manager, Planner)
- Design Suite (Concepts, Production, QA)
- Development Suite (Software Development, Quality Engineering, Technical Architecture)

---

## Source Material

**Primary:**
- `/public/chatbot-content/transcripts/agentic_engineering.md`
- `/public/chatbot-content/transcripts/technical-architecture-ai-projects.md`
- `/docs/ai-showcase/ai-workflow-one-pager.md` (working draft with user edits)

**Vector DB Chunks:** Chunks tagged with "agentic engineering," "Claude Code," "workflow," "tools," and "methodology"

---

## Editorial Notes

**Tone:** Professional but personal—this is a first-person account of transformation, not a detached tutorial

**Technical Depth:** Balance accessibility for non-developers with sufficient technical detail for experienced engineers to understand the architecture

**Emphasis:** Focus on the "why" and "what changed" rather than just "how to" instructions. This is a story of paradigm shift, not just a tool review.

**Structure:** Flowing narrative essay—no section breaks, natural progression from breakthrough to methodology to results to principles to journey

**Reading Time:** 3-4 minutes (condensed from 8-10 minutes)
