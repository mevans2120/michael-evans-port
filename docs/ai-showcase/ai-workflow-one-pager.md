# AI Workflow & Developer Tools - One-Pager

## The "Oh Shit" Moment

### The Problem
Traditional software development timelines were fundamentally changing. What once took a year to build—research, strategy, design, prototyping, and development—could now be accomplished in hours or days with AI assistance.

### The Catalyst
**The Dungeon Tracker breakthrough**: Built a functional D&D initiative tracker with an 11-year-old in under an hour. This wasn't just a prototype—it was actually usable in real games. That moment crystallized the magnitude of the shift happening in software development.

### The Question
Is Agentic Engineering at the begining of the Innovators Dillema. Will is move upmarket and swallow the world. Seems likely. Could a product manager without deep coding expertise build world-class software? Seems likely.

---



## The Journey

**Phase 1: Experimentation (Early 2024)**
- Started with Replit for rapid prototyping
- Built kitchen timer experiment in ~1 hour
- Realized the potential but needed more control

**Phase 2: Tool Discovery**
- Moved to Cursor for local file access and faster iteration
- Explored various AI coding assistants
- Tested Lovable for visual design-first work
- Now use the design-concept skill in Claude for design

**Phase 3: Production-Ready Development**
- Adopted Claude Code in terminal, inside VS Code as primary tool
- Developed comprehensive workflow with skills system
- Built three skill suites: Design, Project Management, and Development

## The Methodology

**1. Tech Stack Optimization**
- **TypeScript everywhere**: Forced typing prevents AI from making variable name mistakes
- **Single-page applications**: Easier for AI to maintain context
- **Next.js + React**: Modern, well-documented frameworks AI understands well

**2. Prompt Engineering Principles**
- When you have a problem, have the AI research the problem, then plan the execution with success criteria and a phased approach, then have it execute the phases. Smoke test if possible between phases, than run your evaluation when the project completes... Improve based on testing... And repeat: Research, Plan, Build Test. 
- Specificity over everything: Could a word have other meanings? Find a more specific words
- Consistency: Reuse established terms and names throughout the project
- Ask AI for advice: 
- Leave space for AI to ask questions. 
- Don't worry about grammar, focus on clarity and specificity

**3. Memory Bank System**
-Paragraph about the memory bank system, and how you think this is something that claude will solve in the future without a plugin... But do discuss the preinciple. 

**4. Verification & Quality Control**
- Read everything AI produces: Scroll through changes to catch mistakes

- Revert problematic changes immediately
- TypeScript catches errors before production builds fail

## The Tools

**Primary Development Environment**
- **Claude Code**: Terminal-based AI assistant
  - Most powerful, fastest, fewest mistakes
  - Works best autonomously
  - Elegant plugins and skills system
  - Access to all files and CLI tools

**Custom Skills Built**
1. **Project Analyzer**: TODO scanning, completion detection, production verification
2. **Project Manager**: GitHub issue creation, visual testing, screenshot capture
3. **Project Planner**: Feature discovery from code, roadmap generation
4... Add the skills from the design and dev suite.
5... Need to add my subagents to Github 
6.  Add the memory bank feature

**Supporting Tools**
- Git for version control and reverting changes
- Multiple terminals for parallel workstreams
- Browser automation (Playwright) for testing
- Unit Testing
- AI Evaluations


### How they help, and what I'm still learning'

- Paragraph or two about a few features of the skills and 

---



## Quantifiable Impact

**Development Speed**
- Paragraph about listing examples of speed: implementing the Sanity CMS went from a month to less than a week, with far fewer resources woring on it. A reasonable prototype of an app in less than an hour. 

**Code Quality**
- Paragraph about code quality, and the things we do to ensure quality: either TDD, or comprehensive tests added later (depending on the feature certainty). Periodic audits and refactors (which often cost far less to implement than a typical )

**Productivity Metrics**
- Paragraph about the # of commits since March, the number of projects and variety of projects AI powered specialized agents, analyzers and retrievers. Consitently has at least two agents working on tasks at a time. 


## The Philosophy

**AI-First Design**
Every software project should leverage AI to enhance capabilities—not as an afterthought, but as a core architectural decision.

**Verification is Essential**
AI can work autonomously for extended periods, but you must read and verify its work. The time saved far exceeds verification overhead.

**Embrace the Limitations**
- Memory issues exist—work with them
- Hallucinations happen—catch them early
- Adherence is imperfect—provide clear instructions
- These challenges exist on every project—plan for them

**The English Major Advantage**
Surprisingly, an English degree pays dividends in AI-assisted development. Specificity in language, understanding of context, and clear communication directly improve AI output quality.

---



---

## PHOTOGRAPHY & VISUALS

### Hero Images
1. **Side-by-side terminals**: Multiple VS Code windows showing parallel AI development
2. **Claude Code in action**: Terminal showing AI building features autonomously
3. **Before/After screenshot**: Traditional IDE vs AI-assisted workflow


### Tool Screenshots
7. **Project Analyzer output**: TODO scanning and completion detection results
8. **GitHub issue creation**: Automatically generated issue with screenshots
9. **Visual regression testing**: Multi-viewport screenshot comparison

### Workflow Visualization
10. **Development timeline**: Hour-by-hour breakdown of building Dungeon Tracker
11. **Memory Bank system**: Dual-memory architecture diagram
12. **Verification process**: Flow chart showing read → verify → iterate cycle



---


---

## NEXT STEPS

For those interested in adopting this workflow:

1. **Start Small**: Build a simple tool for your own use (like the kitchen timer or Dungeon Tracker)
2. **Choose TypeScript**: The type safety is worth the learning curve
3. **Read Everything**: Don't trust AI blindly—verify its work
4. **Document Decisions**: Build your own memory bank system
5. **Embrace Iteration**: First drafts from AI are starting points, not endings
6. **Please connect**: 

---

**The Bottom Line**: AI-assisted development is no longer experimental—it's production-ready, measurably faster, and accessible to anyone willing to learn the workflow. The question isn't whether to adopt it, but how quickly you can adapt.
