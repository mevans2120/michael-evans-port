# Sanity CMS Migration Guide - PostPal & Marketing Sites
**Date:** November 2, 2025
**Task:** Migrate editorial content for PostPal and Marketing Sites AI showcases

---

## Migration Overview

We're updating the PostPal and Marketing Sites AI showcase articles from verbose, section-heavy formats to condensed editorial narratives (3-4 minute reads) matching the AI Workflow format.

**Source Specs:**
- `/docs/content-specs/detailed-specs/postpal-showcase-editorial.md`
- `/docs/content-specs/detailed-specs/marketing-sites-showcase-editorial.md`

---

## Access Sanity Studio

1. **Open Sanity Studio:** http://localhost:3000/studio
2. **Navigate to:** Content → AI Showcase
3. **Find documents:**
   - PostPal (slug: `postpal`)
   - Marketing Sites (slug: `marketing-sites`)

---

## Decision: Update or Replace?

**Option A: Update existing documents** (Recommended)
- Preserves document IDs and URLs
- Maintains any existing references
- Sanity has revision history (can revert if needed)

**Option B: Create new documents**
- Start fresh with clean slate
- Keep old documents as backup
- Requires updating slugs or deleting old ones

**Recommendation:** Option A - Update existing documents

---

## PostPal Migration

### Hero Section

**Update these fields:**

**Title:**
```
PostPal: When Paper Pamphlets Meet AI
```

**Subtitle:**
```
How an AI-powered recovery timeline transforms healthcare's most frustrating patient experience
```

**Summary (Lede):**
```
Watch a patient leave any medical facility after a procedure. They're handed a paper pamphlet containing critical recovery instructions—when they can shower, which medications to take, how long to avoid certain activities. These instructions are time-sensitive, complex, and essential for safe recovery. They're also paper documents that get lost, water-damaged, or simply misunderstood. The realization hit me clearly: this isn't a digitization problem where we just make the pamphlet a PDF. This is fundamentally a guidance problem. Patients don't need a digital pamphlet—they need an intelligent timeline that tells them exactly what they can do today.
```

**Badge:**
```
Healthcare AI
```

---

### Content Slides

**Consolidate existing slides into 4 flowing sections:**

#### Slide 1: The Paper Pamphlet Problem

**Section Label:**
```
The Problem
```

**Heading:**
```
The Paper Pamphlet Problem
```

**Content (PortableText):**
```
The healthcare discharge instruction system is broken in a way that's so ubiquitous we barely notice it anymore. After colonoscopies, surgeries, dental procedures—any medical intervention requiring recovery—patients receive paper pamphlets with complex care instructions. "No shower for 72 hours." "Keep cast dry for 3 months." "Physical therapy daily for 6 weeks." "Take medication X, avoid medication Y."

These restrictions gradually phase out over time, and the dos eventually become optional. A patient recovering from surgery might have a dozen time-bound instructions that change week by week, day by day, even hour by hour. But all of this complexity lives on paper—documents that get water-damaged in the bathroom, lost in the shuffle of daily life, or simply sit on the counter while the patient wonders: "Can I shower yet? When can I drive? What restrictions still apply?"

The human cost is substantial. Patients experience anxiety wondering whether they're following instructions correctly. They miss medications or physical therapy sessions because they forgot or couldn't interpret the timeline. Providers face an endless stream of repetitive phone calls—"Can I shower yet?" asked forty times a day across a practice—consuming staff time without adding clinical value. Most critically, preventable complications occur when patients miss care steps, leading to readmissions that could have been avoided with better guidance.

The business case is equally clear. A colonoscopy center performing hundreds of procedures weekly spends significant staff hours answering the same questions repeatedly. An orthopedic practice managing dozens of surgical recoveries simultaneously has no visibility into patient compliance until problems surface. The paper pamphlet system doesn't just frustrate patients—it creates operational inefficiency at scale.

I'm interested in a startup called PostPal that's tackling this problem head-on. The insight driving the solution is that discharge instructions need to transform from static paper into intelligent, personalized timelines that actively guide patients through recovery.
```

**Tech Pills:**
```
Claude, Mistral, Next.js, React Native, PostgreSQL, Prisma, Supabase, TypeScript
```

---

#### Slide 2: Building the Intelligent Timeline

**Section Label:**
```
The Solution
```

**Heading:**
```
Building the Intelligent Timeline
```

**Content (PortableText):**
```
PostPal addresses this through a two-platform architecture that bridges the provider-patient gap. The web application serves both as the provider portal for managing discharge instructions and the patient dashboard for tracking progress. The mobile application—built with React Native for cross-platform iOS and Android coverage—extends this experience to where patients actually live: on their phones.

The AI-powered workflow solves a subtle but critical UX problem. Traditional patient portals require patients to create accounts, verify email, enter medical information, and navigate complex setup flows—all while recovering from medical procedures and possibly under medication effects. PostPal inverts this model entirely.

Providers upload the PDF discharge instructions and generate a QR code or URL with pre-filled patient data. The patient scans the code or clicks the link, and they're immediately viewing their personalized recovery timeline with zero manual data entry. This friction elimination dramatically improves adoption rates because the setup burden falls on the provider who already has the patient's information, not on the patient who's least equipped to handle administrative tasks.

The intelligence layer uses a hybrid approach to content extraction. Mistral AI handles OCR to pull text from PDFs of varying quality—some crisp and clear, others faded photocopies of photocopies. Claude analyzes the medical instructions for context and meaning. This isn't simple text extraction. The AI understands procedure types, identifies medications and their schedules, recognizes activity restrictions and their durations, and converts unstructured medical language into structured, actionable tasks.

Task generation happens automatically based on this extracted content. The AI creates a personalized recovery timeline organized by day, week, and month, with automatic scheduling relative to the procedure date. The tasks aren't generic—they're context-aware. "No shower for 72 hours" means something different when the procedure happened yesterday versus last week. The timeline adapts to the specific procedure, the specific patient's instructions, and the natural progression of recovery.

Patient engagement happens through multiple channels designed for reliability. The mobile app delivers daily reminders. Patients check off completed tasks to build engagement and accountability. Progress tracking provides visual feedback with milestone achievements. The notification system spans in-app alerts, email, SMS, and push notifications to ensure critical reminders reach patients regardless of their preferred communication channel. Healthcare can't assume patients will check the app daily—redundancy isn't excessive, it's necessary.
```

**Quote Box:**
```
Quote: "This isn't about digitizing a pamphlet. It's about fundamentally rethinking how healthcare information reaches patients during their most vulnerable moments—when they're recovering at home without direct medical supervision."

Attribution: — On building PostPal
```

---

#### Slide 3: Impact on Both Sides of Healthcare

**Section Label:**
```
The Impact
```

**Heading:**
```
Impact on Both Sides of Healthcare
```

**Content (PortableText):**
```
For patients, PostPal transforms the post-procedure experience from anxious uncertainty to informed confidence. The intelligent recovery timeline answers the fundamental question patients ask themselves every morning: "What can I do today?" Instead of interpreting complex medical language from a paper pamphlet, they see clear, time-specific guidance organized exactly as they need it.

Automatic reminders eliminate the cognitive burden of remembering medication schedules or physical therapy sessions. Patients struggling with recovery pain or medication side effects don't need to also manage complex mental tracking of care instructions. The app handles that burden, delivering timely prompts exactly when needed.

Progress tracking provides both practical utility and psychological support. Visual milestones show the recovery journey in concrete terms—week one complete, medication schedule 85 percent adherent, physical therapy streak maintained for seven days. This isn't frivolous gamification. It leverages proven behavioral psychology to improve compliance with medical instructions that directly impact recovery outcomes.

From the provider perspective, PostPal addresses a persistent operational problem: the flood of repetitive patient questions that consume staff time without adding clinical value. "When can I drive?" "Can I shower yet?" "Which medication should I take first?" These questions, asked dozens of times daily across a practice, represent staff hours spent answering information that was already provided at discharge.

The provider portal streamlines discharge instruction delivery dramatically. QR code onboarding takes seconds—scan the patient's information, upload their discharge PDF, generate the code, and hand it to them. The AI handles instruction extraction automatically, converting PDFs into structured timelines without provider review unless desired. This works for any procedure type, from routine colonoscopies to complex surgical recoveries.

Visibility into patient compliance transforms provider-patient communication. Instead of waiting for patients to call with questions or problems, providers see real-time data on who's completing tasks, who's falling behind, and who might need intervention before minor issues become serious complications. This proactive approach catches problems early when they're easiest and least expensive to address.
```

**Comparison Boxes:**
```
Box 1:
Label: The Problem
Title: Paper Pamphlets Get Lost
Text: Instructions get lost, water-damaged, or misunderstood. Patients feel anxious about recovery steps. Providers field endless repetitive calls asking "Can I shower yet?"
Stat: $$$
Icon: 📄

Box 2:
Label: The Solution
Title: AI-Powered Guidance
Text: Always accessible on patient's phone. Context-aware guidance shows what applies today. Automatic reminders and progress tracking improve compliance by 20-40%.
Stat: 90%+
Icon: 📱
```

---

#### Slide 4: The Technical Achievement

**Section Label:**
```
The Technology
```

**Heading:**
```
The Technical Achievement
```

**Content (PortableText):**
```
Building healthcare software demands different engineering priorities than typical consumer applications. Security isn't optional, reliability isn't negotiable, and complexity is unavoidable when dealing with medical information, regulatory compliance, and real-world recovery scenarios.

The technical foundation starts with a comprehensive database architecture spanning over 30 Prisma models that cover Users, Tasks, Procedures, Providers, Doctors, and the complex relationships between them. This isn't over-engineering—healthcare data is inherently relational and nuanced. A task belongs to a procedure, which was performed by a doctor, at a provider facility, for a patient who might have multiple concurrent procedures. Comprehensive audit logging tracks every change for compliance purposes. Scheduled notifications require template management. Patient invite systems need secure token-based authentication. Each of these concerns requires thoughtful schema design to maintain data integrity while supporting complex queries.

The mobile architecture prioritizes offline reliability through a custom dependency injection system that manages platform-specific service implementations. MMKV provides fast, encrypted local storage that's ten times faster than AsyncStorage, with synchronous access eliminating async overhead. Background synchronization handles network restoration gracefully, using optimistic updates for instant UI feedback while queuing changes for later sync.

Biometric security integrates Face ID, Touch ID, and fingerprint authentication as primary access methods, storing credentials securely in the system keychain rather than application storage. JWT token management includes automatic refresh logic and session management with background renewal to prevent unexpected logouts during active use. This security-first approach meets HIPAA compliance requirements while maintaining user-friendly authentication flows.

Type safety throughout the codebase prevents entire categories of errors. TypeScript with strict type checking catches mistakes at development time. Zod validation schemas enforce runtime type checking on API boundaries. Shared type definitions between web and mobile ensure contract consistency. In healthcare software, where mistakes can literally harm patients, this multiple-layer validation isn't excessive—it's necessary.

The result is production-ready software handling real patient data with real medical implications. Web application load times under 2 seconds. Mobile app cold starts under 3 seconds. Real-time task synchronization with optimistic updates. PDF processing completing in 5 to 30 seconds depending on document complexity. These aren't just engineering achievements—they're necessary baselines for healthcare software that patients must trust and rely on during recovery.
```

---

### Metrics Section

**Add metrics array:**

```
Value: 30-50%
Label: Reduction in patient calls
Description: Fewer repetitive questions to providers

Value: 20-40%
Label: Improved compliance
Description: Better adherence to care instructions

Value: 15-25%
Label: Fewer complications
Description: Reduction in preventable issues

Value: <2s
Label: Web app load time
Description: Fast, responsive performance

Value: <3s
Label: Mobile app cold start
Description: Quick access when needed

Value: 5-30s
Label: PDF processing
Description: Automatic instruction extraction

Value: 30+
Label: Database models
Description: Comprehensive data architecture

Value: 13
Label: Notification endpoints
Description: Multi-channel communication

Value: 90%+
Label: Patient satisfaction
Description: Digital timeline vs paper pamphlets
```

---

## Marketing Sites Migration

### Hero Section

**Update these fields:**

**Title:**
```
AI-Built Marketing Sites: The $50K Question
```

**Subtitle:**
```
Can AI deliver agency-quality websites at freelancer prices with startup speed? Three clients became the test cases.
```

**Summary (Lede):**
```
Small businesses seeking professional websites face a frustrating trifecta of bad options. DIY website builders like Wix or Squarespace offer affordability but deliver generic templates that often undermine rather than enhance brand credibility. Traditional agencies provide genuinely professional results but require budgets of $20K to $50K and timelines stretching three to six months—resources most small businesses simply don't have. Freelancers occupy the middle ground with variable quality, communication challenges, and timeline uncertainty. The hypothesis seemed clear: what if AI-powered development could deliver agency-quality websites at freelancer prices with startup-level speed? Three clients—a film production company, an enterprise consulting firm, and a shamanic healing practitioner—became deliberate test cases designed to prove or disprove whether AI could genuinely compete with traditional approaches on quality while dramatically outperforming on speed and cost.
```

**Badge:**
```
AI Showcase
```

---

### Content Slides

**Consolidate existing slides into 4 flowing sections:**

#### Slide 1: The Hypothesis

**Section Label:**
```
The Hypothesis
```

**Heading:**
```
The Hypothesis
```

**Content (PortableText):**
```
These three projects weren't just client work. They were experiments designed to answer a fundamental question about what's possible with AI-assisted development. Department of Art brought the challenge of visual storytelling for a film and TV set construction company in Portland. Their portfolio work is inherently visual—directors and production designers hire based on seeing previous set construction projects. The challenge was delivering a professional site that showcased high-resolution imagery beautifully while maintaining fast loading times across devices and network conditions.

Opal Creek presented entirely different constraints as an enterprise consulting company specializing in NetSuite ERP implementations. Their needs centered on professional B2B credibility with security-first architecture appropriate for a business consulting brand serving enterprise clients. Six-figure consulting engagements require vendors with solid security posture—generic templates wouldn't establish the trust necessary for that level of business relationship.

Karuna Gatton required authenticity and approachability for shamanic healing services in Eugene. The challenge wasn't technical complexity but conveying trust and professionalism for alternative medicine—a domain where many websites veer into unprofessional mysticism or sterile clinical presentations that miss the warmth essential to holistic healing practices.

The common thread across these dramatically different businesses was testing whether AI-assisted development could deliver professional marketing sites that genuinely help clients grow their businesses. As I reflected after completing them, "The apps aren't super technical, but getting the design right and the marketing right was the more challenging and fun thing to do." This insight proved central to understanding the value proposition. AI's contribution wasn't replacing human design judgment but accelerating implementation while humans focused on the harder problems of brand alignment and messaging.

The business case was compelling. If this approach worked, it could democratize access to professional web presence for small businesses that couldn't afford traditional agency budgets but deserved better than template-based DIY solutions.
```

**Comparison Boxes:**
```
Box 1:
Label: Traditional Approach
Title: Agency Development
Text: Professional results with $20K-$50K budgets and 3-6 month timelines. High quality but inaccessible to most small businesses.
Stat: $20K-50K
Icon: 🏢

Box 2:
Label: New Approach
Title: AI-Powered Speed
Text: Same professional quality with 60-80% cost reduction and 2-4 week timelines. Makes agency-quality accessible to small businesses.
Stat: 3-6x faster
Icon: ⚡
```

---

#### Slide 2: How AI Changes Web Development

**Section Label:**
```
The Process
```

**Heading:**
```
How AI Changes Web Development
```

**Content (PortableText):**
```
After experimenting with various approaches, React combined with Sanity CMS emerged as the optimal stack for AI-assisted marketing site development. This wasn't a theoretical choice but one validated through real projects, starting with Peddle where Sanity was first introduced to my workflow. The combination works because React's component-based architecture is something AI understands exceptionally well. Next.js provides server-side rendering critical for SEO. Deployment to Vercel requires zero configuration. And Sanity CMS proved particularly valuable for client empowerment—non-technical clients can edit content through an intuitive interface without ongoing developer dependency.

Understanding what AI handles well versus what requires human expertise proved critical for efficient development. AI excels at component scaffolding and boilerplate code, eliminating the tedious setup work that consumes early project hours. Tailwind CSS styling and responsive design become significantly faster when AI generates initial utility class combinations that humans refine. TypeScript type definitions maintain consistency across growing codebases. Sanity schema structure and queries benefit from AI's ability to quickly generate working configurations. SEO meta tags, structured data, and basic accessibility features get built in automatically rather than added as afterthoughts.

Human expertise remains irreplaceable for design decisions and brand alignment. AI can generate visually acceptable layouts, but understanding whether those layouts communicate the right brand personality and meet specific business positioning needs requires human judgment informed by client conversations and market context. Content strategy and messaging demand understanding of target audiences, competitive positioning, and business objectives that extend far beyond what can be specified in prompts. Visual hierarchy and user flow decisions determine whether sites guide visitors toward conversion or lose them in confusion. Photography selection and art direction shape emotional responses and brand perception in ways that resist algorithmic optimization.

The collaboration model in practice looks like iteration between human strategic decisions and AI implementation. I request a hero section with specific elements. AI generates the component with proper structure, semantic HTML, responsive breakpoints, and accessibility attributes. I review the output, adjusting spacing to match brand guidelines, refining copy for tone and clarity, and optimizing imagery for emotional impact. AI implements these refinements while handling the responsive behavior across device sizes. I test across actual devices and verify accessibility. AI fixes discovered issues and adds polish like hover states and micro-interactions.

This division of labor accelerates development not by replacing human expertise but by letting humans focus their time on high-value decisions rather than implementation mechanics.
```

**Quote Box:**
```
Quote: "Getting the design right and the marketing right was the more challenging and fun thing to do. AI handles the technical implementation—humans solve the genuinely difficult problems of brand positioning and messaging."

Attribution: — On AI-assisted development
```

**Tech Pills:**
```
React, Next.js, Sanity CMS, Tailwind, shadcn/ui, TypeScript, Vercel
```

---

#### Slide 3: Three Different Solutions

**Section Label:**
```
The Evidence
```

**Heading:**
```
Three Different Solutions
```

**Content (PortableText):**
```
Department of Art required a solution to a common creative industry problem: showcasing high-resolution visual work without destroying page performance. Film and TV set construction is inherently visual—production designers and directors hire based on portfolio work, making image quality non-negotiable. But large image files crush page load times, particularly on mobile devices over cellular connections. The solution combined Next.js Image component optimization for automatic format conversion and responsive sizing, lazy loading to defer off-screen images until needed, and Sanity's CDN for global image delivery with automatic optimization. The unique feature was a filterable project showcase that let visitors browse by project type while maintaining fast loading through progressive image loading and intelligent prefetching.

Opal Creek's requirements centered on credibility and security appropriate for enterprise consulting. NetSuite implementations are six-figure engagements for mid-market and enterprise clients—companies that scrutinize vendor security posture carefully. The solution implemented comprehensive Content Security Policy headers preventing XSS attacks, HSTS enforcing HTTPS connections, security headers controlling iframe embedding and content type sniffing, token rotation procedures for API credentials, and pre-commit hooks preventing accidental secret exposure. The professional design conveyed enterprise credibility through clean layouts, strategic white space, and typography choices that communicated competence without flashiness. The unique feature was a NetSuite expertise showcase with case study templates that established thought leadership.

Karuna Gatton needed warmth and authenticity to convey trustworthiness for shamanic healing services. Alternative medicine faces particular challenges establishing credibility—many potential clients are skeptical, while those open to shamanic healing still need assurance they're working with a legitimate, professional practitioner. The solution used a soft color palette with earth tones and gentle gradients, personal storytelling that introduced Karuna and her journey to shamanic practice, clear service descriptions that demystified offerings without excessive jargon, and testimonial showcases providing social proof. The unique feature was service booking integration allowing interested clients to schedule consultations directly from the website, reducing friction in the conversion funnel.

What struck me most was how the same fundamental approach—AI-assisted React development with Sanity CMS—adapted successfully to three wildly different industries and brand personalities. A film production company's bold visual portfolio, an enterprise consulting firm's professional B2B presence, and a shamanic healer's warm wellness brand all emerged from the same technology stack and development methodology, differentiated entirely by human design decisions and brand strategy rather than technical architecture.
```

**Quote Box:**
```
Quote: "Different industries, different audiences, different technical needs—but the same approach delivered professional results in all three cases. The flexibility proved the concept wasn't industry-specific but genuinely transferable."

Attribution: — On validating the approach
```

---

#### Slide 4: What Actually Worked

**Section Label:**
```
The Results
```

**Heading:**
```
What Actually Worked
```

**Content (PortableText):**
```
The development speed improvements weren't incremental—they represented order-of-magnitude changes from traditional approaches. Traditional agency timelines of three to six months with budgets of $20K to $50K compressed to two to four weeks with significantly lower costs. This represented a three to six times speed increase compared to traditional development while maintaining professional quality standards throughout. The economics weren't about cutting corners but about fundamentally different efficiency from AI-assisted development focused on high-value human decisions rather than implementation mechanics.

Technology decisions validated through production use provided clear guidance for future projects. React combined with Sanity "works super well" for marketing sites, handling everything from simple landing pages to complex portfolio showcases. TypeScript's type safety prevented entire categories of errors, catching mistakes at development time rather than in production. Sanity CMS enabled clients to update content confidently, with structured content models preventing the formatting mistakes common in traditional CMS platforms. Vercel deployment provided zero-config hosting with automatic scaling and edge caching.

Performance metrics demonstrated that speed improvements didn't sacrifice quality. Page loads under two seconds met Core Web Vitals standards critical for SEO and user experience. Lighthouse scores above 90 for performance, accessibility, and SEO across all three sites. Mobile performance tested across ten-plus device types. SEO readiness came built-in through proper structured data and sitemaps rather than requiring expensive post-launch remediation.

The lessons learned shaped my understanding of AI-assisted development significantly. Design remains fundamentally human work—AI accelerates implementation dramatically, but human judgment drives the design decisions that determine whether sites achieve business objectives or simply look professional while failing to convert. Client communication matters more than technical capability. Understanding the client's audience and business objectives trumps technical sophistication every time. Sanity proved excellent for clients, enabling non-technical business owners to confidently update content without developer assistance. Security couldn't be an afterthought—CSP, HSTS, token rotation, and pre-commit hooks needed to be built in from day one. Performance is a feature, not an optimization task to defer. Fast sites convert better, making image optimization and edge caching competitive advantages.
```

**Quote Box:**
```
Quote: "The challenge is marketing, not code. AI handles implementation beautifully, but understanding what to build and how to position it requires human expertise."

Attribution: — On the human-AI division of labor
```

---

### Metrics Section

**Add metrics array:**

```
Value: 3-6x
Label: Faster development
Description: Compared to traditional agencies

Value: 60-80%
Label: Cost reduction
Description: From agency pricing

Value: <2s
Label: Page load times
Description: Core Web Vitals optimized

Value: 90+
Label: Lighthouse scores
Description: Performance, accessibility, SEO

Value: <30s
Label: Build times
Description: Fast iteration during development

Value: 3 sites
Label: Shipped projects
Description: Across diverse industries
```

---

## Testing Checklist

After migration, test both showcases:

### PostPal Testing
- [ ] Open http://localhost:3000/ai-showcase/postpal
- [ ] Hero renders correctly with new title/subtitle/lede
- [ ] Lede has accent border (left side, purple)
- [ ] 4 sections flow naturally (no discrete slide feel)
- [ ] Pull quotes stand out with proper styling
- [ ] Comparison grid displays 2 columns (paper vs AI)
- [ ] Metrics grid shows inverted colors (dark background)
- [ ] Tech stack pills are interactive (hover effects)
- [ ] Separators provide visual rhythm between sections
- [ ] Test responsive on mobile (375px, 768px, 1024px)
- [ ] Test dark mode (all colors work correctly)
- [ ] Fonts: DM Sans for headers, Newsreader for body

### Marketing Sites Testing
- [ ] Open http://localhost:3000/ai-showcase/marketing-sites
- [ ] Hero renders correctly with "$50K Question" title
- [ ] Lede has accent border
- [ ] 4 sections flow naturally
- [ ] Pull quotes emphasize human-AI collaboration
- [ ] Comparison grid (agency vs AI-assisted)
- [ ] Metrics grid displays correctly
- [ ] Tech stack pills interactive
- [ ] Separators between sections
- [ ] Test responsive on mobile
- [ ] Test dark mode
- [ ] Fonts correct (DM Sans + Newsreader)

---

## Common Issues & Solutions

### Issue: PortableText not rendering
**Solution:** Make sure content is properly formatted as Portable Text blocks in Sanity

### Issue: Pull quotes not appearing
**Solution:** Check that quoteBox field is filled with both quote and attribution

### Issue: Comparison grid layout broken
**Solution:** Verify comparisonBoxes array has exactly 2 items for proper 2-column layout

### Issue: Metrics not inverting colors
**Solution:** Magazine components should handle this automatically - check MagazineMetrics component

### Issue: Separators missing
**Solution:** These are added by AIShowcasePageMagazine component between sections automatically

---

## Backup & Rollback

**Sanity has revision history!**
- If something goes wrong, click "Revision history" in Sanity Studio
- Restore previous version
- Changes are non-destructive

**Local backups:**
- Original specs preserved at:
  - `/docs/content-specs/detailed-specs/postpal-showcase.md`
  - `/docs/content-specs/detailed-specs/marketing-sites-showcase.md`

---

## Notes

- **Magazine layout already works:** AIShowcasePageMagazine.tsx handles all rendering
- **No code changes needed:** This is purely content migration
- **Schema unchanged:** Existing Sanity schema supports all new content
- **URLs stay the same:** Slugs remain `postpal` and `marketing-sites`

---

## Completion Checklist

- [ ] PostPal hero section updated
- [ ] PostPal 4 content slides migrated
- [ ] PostPal metrics added
- [ ] PostPal tested (responsive + dark mode)
- [ ] Marketing Sites hero section updated
- [ ] Marketing Sites 4 content slides migrated
- [ ] Marketing Sites metrics added
- [ ] Marketing Sites tested (responsive + dark mode)
- [ ] Both articles match AI Workflow editorial quality
- [ ] Both articles read in 3-4 minutes

---

**Ready to proceed!** Open Sanity Studio and start with PostPal migration following this guide.
