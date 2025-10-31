# AI Workflow & Developer Tools - Content Specification

## Metadata

**Title:** My AI Workflow: Building Production Software with Claude Code
**Slug:** `ai-workflow`
**Category:** AI Showcase
**Featured:** Yes
**Order:** 1
**Type:** Detailed Page

---

## Hero Section

### Title
My AI Workflow: Building Production Software with Claude Code

### Tagline
From product manager to full-stack developer: How AI-assisted development changed everything about building software

### Summary
The "oh shit" moment came while building a D&D tracker with my 11-year-old son—we created a functional app in under an hour. That breakthrough crystallized a fundamental shift: what once took a year to build could now be accomplished in days or weeks with AI assistance. This is the story of discovering, refining, and productionizing an AI-powered development workflow that's shipped 30+ projects and generated 1000+ commits since March 2024.

---

## Content Sections

### Section 1: The "Oh Shit" Moment

**Heading:** When Everything Changed

**Content:**

Traditional software development timelines were fundamentally changing, and I almost missed it. For years, I'd said it took about a year to build anything complex for clients—research, strategy, design, prototyping, and full development. That timeline felt immutable, grounded in reality from dozens of projects. But in early 2024, something shifted.

The catalyst was deceptively simple: I wanted to build a voice-activated kitchen timer that didn't connect to the internet. I loved my Alexa for cooking timers—you can set multiple timers hands-free when your hands are dirty—but I was increasingly uncomfortable with an internet-connected listening device in my house. With AI's growing capabilities, I realized Amazon could do far more with that data than I'd previously considered.

I built a prototype in Replit in about an hour. It wasn't quite usable—it needed more work—but it was surprisingly close to functional. That got my attention, but I didn't fully grasp the implications yet.

The real revelation came when working with my 11-year-old son, who loves Dungeons & Dragons. I serve as dungeon master for some of his campaigns, and one aspect of D&D I appreciate is that everyone tracks everything on paper—no screens involved, which I think is valuable for kids. However, as the DM, I needed to track initiative (who goes first in combat) and hit points digitally. I thought we could build an app for this together.

Within an hour, we had something genuinely useful—something I could actually use in our games. It's called Dungeon Tracker and is available on my GitHub. This was my "oh shit" moment. Seeing how fast AI could produce not just a prototype but actually usable software made me realize that the year-long timeline I'd always quoted was about to change dramatically.

But the real question emerged: Is agentic engineering at the beginning of the Innovator's Dilemma? Will it move upmarket and swallow the world? It seems likely. Could a product manager without deep coding expertise build world-class software? The evidence was right in front of me. It seemed not just possible, but inevitable.

---

### Section 2: The Evolution of My Workflow

**Heading:** From Experimentation to Production

**Content:**

**Phase 1: Experimentation (Early 2024)**

After completing the Casa Bonita project, I finally had time to pay attention to AI beyond just following the news. I started with Replit for rapid prototyping—it was accessible and required minimal setup. The kitchen timer experiment proved AI could build functional software quickly, but Replit's limitations became apparent. I needed more control over local files and better integration with professional development tools.

**Phase 2: Tool Discovery**

I moved to Cursor after hearing it was a significant step up from Replit. Cursor offered much more flexibility by working with local files, which made it faster and more straightforward to verify work quality. It also expanded my technical capabilities beyond what I could accomplish with browser-based tools. During this phase, I explored various AI coding assistants, testing their strengths and limitations. I even tried Lovable for visual design-first work, which was interesting for prototyping but lacked the reliability I needed for production applications.

Eventually, I discovered that for design work, I could use the design-concept skill in Claude itself, which proved more reliable and better integrated with my overall workflow than separate design tools.

**Phase 3: Production-Ready Development**

The breakthrough came when I adopted Claude Code as my primary development environment. Unlike other tools, Claude Code runs in the terminal inside VS Code, giving it access to all files and CLI tools while maintaining the power and speed I needed. This wasn't just an incremental improvement—it fundamentally changed what was possible.

I developed a comprehensive workflow built around Claude Code's skills system, creating three complete skill suites: Design, Project Management, and Development. These weren't just scripts or shortcuts—they were specialized AI agents that could handle complex, multi-step tasks autonomously while maintaining context and following established patterns.

The elegance of Claude Code's plugin and skills system became apparent immediately. You put plain English instructions in files in a folder, and the invisible `.claude` configuration file contains all your settings, which can be rewritten as needed. This system proved incredibly powerful for maintaining consistency across projects while adapting to specific needs.

---

### Section 3: The Methodology

**Heading:** How AI-Assisted Development Actually Works

**Content:**

**Tech Stack Optimization**

The foundation of reliable AI-assisted development starts with technology choices. TypeScript has become essential in my workflow—not optional, but fundamental. The forced typing prevents an entire category of AI-generated errors. When AI doesn't keep everything in memory, it might use incorrect variable names when building new features. Without types, these mistakes only surface when production builds fail. Type errors force corrections before moving forward, and critically, you can ensure AI fixes them properly without resorting to "any" type hacks that defeat the purpose.

Single-page applications work better for AI development because they're easier for AI to maintain context. When everything lives in one coherent structure rather than scattered across multiple pages with different contexts, AI makes fewer mistakes and requires less guidance. Next.js and React have proven ideal—they're modern, well-documented frameworks that AI understands deeply because they're widely used and discussed extensively in AI training data.

**Prompt Engineering Principles**

The most important lesson I've learned about prompting isn't about specific phrases or templates—it's about process. When you have a problem, have the AI research the problem first, then plan the execution with clear success criteria and a phased approach, then have it execute the phases one at a time. Smoke test between phases if possible, then run your comprehensive evaluation when the project completes. Improve based on testing results, then repeat: Research, Plan, Build, Test.

Specificity wins every time. When writing prompts, ask yourself: could any word have other meanings? Find more specific words. This simple practice dramatically improves AI output quality. Consistency matters too—reuse established terms and names throughout the project so AI doesn't get confused by synonyms or similar concepts with different names.

Don't be afraid to ask AI for advice. When you're unsure about an approach, explain the situation and ask for recommendations. AI often suggests solutions you wouldn't have considered. Similarly, leave space for AI to ask questions. Don't pack every possible detail into initial prompts—give AI room to ask clarifying questions, which often surface assumptions you didn't realize you were making.

Surprisingly, you don't need to worry much about grammar when prompting. Focus on clarity and specificity instead. AI parses intent remarkably well, even from grammatically imperfect instructions, as long as the meaning is clear and specific.

**Memory Bank System**

The memory bank system addresses one of AI's fundamental limitations: it doesn't retain context like humans do. I built a hybrid approach combining automated JSON storage with human documentation. Git-tracked documentation preserves decisions, patterns, and progress across sessions, creating continuity that would otherwise be lost.

The principle is straightforward: AI should maintain its own memory of what it's done, what decisions were made, and why. But humans need to verify and supplement that memory, catching gaps and adding context that AI might miss. This dual-memory architecture has proven essential for maintaining project coherence across weeks or months of development.

I believe Claude will eventually solve this natively without requiring plugins, but the underlying principle will remain: systematic documentation and context management aren't optional luxuries—they're necessary infrastructure for complex AI-assisted projects.

**Verification & Quality Control**

AI can work autonomously for extended periods, but human verification is non-negotiable. I read everything AI produces, scrolling through changes to catch mistakes before they compound. When AI starts working on something incorrect or rewrites existing features, you can spot it quickly if you're paying attention. AI writes in specific patterns—if it's writing as though a feature doesn't exist when you know it does, it probably doesn't know about that feature.

With Claude Code, redirection is fast: "Stop working on that. Here's why. Work on something else instead." I often have multiple VS Code windows or terminals open, working on different tasks simultaneously. Even when AI works autonomously, I review what it did to ensure nothing problematic occurred. If it did, I revert immediately. Git makes this trivial.

TypeScript catches errors before production builds fail, which is crucial. When AI generates code with type errors, you fix them immediately rather than discovering runtime errors in production. This front-loaded error detection saves enormous time and prevents entire categories of bugs from ever reaching users.

---

### Section 4: The Tools

**Heading:** Claude Code and the Skills Ecosystem

**Content:**

**Primary Development Environment**

Claude Code emerged as the most powerful, fastest, and most reliable AI coding assistant after extensive testing. It runs in the terminal, providing access to all files and CLI tools, which proves faster than VS Code plugins and more flexible than browser-based solutions. The terminal's power becomes apparent quickly—you can access everything: files, databases, deployment tools, testing frameworks, Git operations, and countless other CLIs that professional developers rely on.

What sets Claude Code apart isn't just raw capability—it's autonomous reliability. Claude Code makes fewer mistakes than alternatives and works best when given complex, multi-step tasks to complete independently. The skills system provides elegant extension points, allowing customization through plain English instructions in configuration files rather than complex programming.

**Custom Skills Built**

Over months of development, I've built comprehensive skill suites that transform Claude Code into a specialized development environment:

The **Project Analyzer** skill scans TODOs, detects completion status with 90%+ confidence, and verifies production deployments through a three-tier system: URL validation, functionality testing, and API verification. It's become indispensable for managing complex projects with dozens of concurrent work items.

The **Project Manager** skill handles GitHub issue creation with SHA256 deduplication to prevent duplicates, captures screenshots for visual documentation, and performs visual regression testing across multiple viewports. This automation saves hours of manual project management work while maintaining better documentation than humans typically produce.

The **Project Planner** skill discovers features from code by analyzing React Router configurations, Express endpoints, and component structures. It generates roadmaps, tracks dependencies, and helps maintain architectural coherence as projects grow. This bird's-eye view prevents the accumulation of technical debt that typically creeps into fast-moving projects.

Beyond the project management suite, I've built comprehensive design and development skill suites. The design suite includes skills for creating conceptual designs, production-ready specifications, and design QA reviews—essentially replacing what would traditionally require a separate design team. The development suite covers software development best practices, quality engineering with test coverage analysis, and technical architecture recommendations.

I need to document these skills publicly and add the specialized subagents I've developed to GitHub so others can benefit from this work. The memory bank feature also deserves its own proper documentation—it's proven too valuable to keep private.

**Supporting Tools**

Git provides version control and instant reverts when AI makes mistakes. Multiple terminals enable parallel workstreams—I consistently run at least two AI agents working on different tasks simultaneously, which dramatically accelerates development. Browser automation through Playwright handles testing and visual regression detection. Unit testing frameworks catch regressions, and AI evaluations verify that systems still work as expected after changes.

**How They Help and What I'm Still Learning**

The skills ecosystem transforms development from writing code to orchestrating specialized agents. Instead of implementing features directly, I assign work to purpose-built skills that understand context, follow established patterns, and maintain consistency automatically. The Project Analyzer, for example, doesn't just find TODOs—it understands project structure, recognizes completion patterns, and provides confidence scores for its assessments.

What I'm still learning is how to balance autonomy with oversight. Skills work best when given broad objectives and freedom to execute, but they occasionally pursue incorrect approaches or make assumptions that need correction. Finding the right level of guidance—specific enough to prevent major mistakes, but general enough to leverage AI's creative problem-solving—remains an evolving art rather than a solved science.

---

### Section 5: Quantifiable Impact

**Heading:** The Numbers Behind the Transformation

**Content:**

**Development Speed**

The speed improvements are difficult to overstate without sounding like exaggeration, but the evidence is clear. Implementing Sanity CMS—a task that previously took a month with multiple developers—now takes less than a week with far fewer resources working on it. That's not cutting corners or reducing scope—it's achieving the same functionality with better code quality in a fraction of the time.

A reasonable prototype of a functional app now takes less than an hour. Not a mockup or wireframe, but an actually usable application. The Dungeon Tracker is the canonical example, but I've repeated this speed across dozens of smaller projects. Kitchen timers, research tools, data analyzers—projects that would have been weekend endeavors now take an hour or two.

Full production applications still take weeks rather than days—there's no magic eliminating complexity—but the timeline compression is real. What took a year now takes six weeks. What took six weeks now takes two. The improvement isn't linear across all task types, but it's substantial across virtually everything.

**Code Quality**

Speed without quality is worthless, which is why I've developed rigorous quality assurance practices for AI-generated code. The approach depends on feature certainty: for well-defined features with clear requirements, I practice test-driven development, writing tests first and having AI implement code that passes them. For exploratory features where requirements will evolve, I have AI build the feature first, then we add comprehensive tests afterward.

This flexibility—TDD when appropriate, tests-after when exploratory—prevents the common trap of either skipping tests entirely (dangerous) or forcing TDD for features whose requirements aren't yet clear (wasteful). Both approaches maintain high test coverage while respecting the realities of product development.

Periodic audits and refactors are critical. Every few weeks, I have AI review the codebase for architectural issues, code smells, and technical debt accumulation. These refactors typically cost far less to implement than waiting until problems compound. AI excels at these systematic improvements—it can scan thousands of lines looking for patterns and inconsistencies faster and more thoroughly than humans, then fix them while maintaining test coverage.

**Productivity Metrics**

Since March 2024, I've generated over 1,000 GitHub commits across 30+ projects. The variety is remarkable: AI-powered specialized agents, autonomous analyzers, RAG-powered retrieval systems, full-stack applications, mobile apps, marketing websites, and developer tools. This isn't just quantity—it's production code shipping to real users.

I consistently run at least two agents working on tasks simultaneously—one might be implementing a feature while another runs tests or performs an audit. This parallel execution was impossible with traditional development but feels natural with AI assistance. The terminal makes it seamless: multiple Claude Code instances in different VS Code windows, each working independently on related but separate concerns.

The project diversity proves the workflow's flexibility. Healthcare apps require different patterns than marketing sites, which differ from developer tools, which differ from data analysis systems. Yet the same fundamental approach—AI-assisted development with human oversight and verification—works across all of them.

---

### Section 6: The Philosophy

**Heading:** Principles That Guide the Work

**Content:**

**AI-First Design**

Every software project should leverage AI to enhance capabilities—not as an afterthought, but as a core architectural decision from day one. This isn't about using AI as a code completion tool or occasional assistant. It's about designing systems with the assumption that AI will handle implementation details, freeing humans to focus on architecture, strategy, and user experience.

This philosophy shapes every decision: choosing TypeScript for better AI error detection, favoring single-page applications for easier AI context management, building skills that encode best practices so AI doesn't have to rediscover them each time. AI-first doesn't mean AI-only—it means optimizing the entire development environment for human-AI collaboration rather than human-only work.

**Verification is Essential**

AI can work autonomously for extended periods, but human verification remains absolutely necessary. The time saved through AI acceleration far exceeds verification overhead, but cutting corners on verification is false economy. I read every significant change AI makes, scrolling through code to understand what it did and catch mistakes before they compound.

This verification isn't busywork—it's where human judgment adds irreplaceable value. AI might write technically correct code that solves the wrong problem, or optimize the wrong metric, or introduce subtle bugs that tests don't catch. Human verification catches these issues early when they're trivial to fix rather than late when they're expensive to untangle.

**Embrace the Limitations**

Memory issues exist—AI doesn't retain context like humans do. Work with this limitation through systematic documentation, clear communication, and memory bank systems rather than fighting it or pretending it doesn't matter. Hallucinations happen—AI occasionally makes things up completely. Catch them early through verification rather than assuming everything AI says is accurate.

Adherence is imperfect—AI sometimes ignores guidelines in `Claude.md`, skills, or subagent instructions. Provide clear instructions, but also check that AI actually followed them. These challenges exist on every project without exception. They're not bugs to be eliminated but characteristics of current AI systems to plan around.

**The English Major Advantage**

Surprisingly, my English degree pays dividends in AI-assisted development that my technical knowledge never predicted. Specificity in language matters enormously—the ability to choose precise words, understand context and implication, and communicate clearly makes AI dramatically more effective. Technical knowledge is learnable; clarity of communication is harder to develop but more valuable when working with AI.

---

## Photography Specifications

### Photo 1: Claude Code in Action
**Subject:** Multiple VS Code windows side-by-side showing Claude Code actively building features
**Purpose:** Demonstrate the parallel development workflow
**Requirements:** Clean terminal output, visible file changes, multiple agents working simultaneously
**Location Suggestion:** Development workspace with 2-3 VS Code instances visible

### Photo 2: Before/After Development Timeline
**Subject:** Visual comparison showing traditional development timeline vs AI-assisted timeline
**Purpose:** Illustrate the dramatic speed improvement quantifiably
**Requirements:** Clear time markers, specific project examples (Sanity CMS: 1 month → 1 week, Dungeon Tracker: weeks → 1 hour)
**Format Suggestion:** Timeline infographic or split-screen comparison

### Photo 3: Skills Ecosystem Overview
**Subject:** Visual representation of the complete skills suite (Project, Design, Development)
**Purpose:** Show the breadth and organization of custom tools built
**Requirements:** Clear labeling of each skill, connections showing how they work together
**Format Suggestion:** Architectural diagram or flowchart showing skill interactions

### Photo 4: The Dungeon Tracker Moment
**Subject:** The actual Dungeon Tracker app in use during a D&D game
**Purpose:** Connect the abstract "oh shit moment" to concrete reality
**Requirements:** App running on device, D&D gameplay visible in background
**Context:** The breakthrough project that crystallized the paradigm shift

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

## Call to Action

**Note:** This workflow is actively evolving. The skills and tools described are available on GitHub, and I'm documenting the complete methodology for others to adopt and adapt.

**Connect:** Interested in AI-assisted development or curious about specific techniques? Let's talk about how these approaches might work for your projects.

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

**Authenticity:** Include the learning process, mistakes, and evolution. This wasn't instant mastery—it was progressive discovery and refinement.
