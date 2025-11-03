# AI-Built Marketing Sites - Editorial Content Specification
## Article/Essay Structure

**Last Updated:** November 2, 2025
**Status:** Condensed editorial format (3-4 minute read)
**Style:** First-person narrative essay

---

## Metadata

**Title:** AI-Built Marketing Sites: The $50K Question
**Slug:** `marketing-sites`
**Category:** AI Showcase
**Featured:** Yes
**Order:** 3
**Type:** Detailed Page

---

## Article Content

### Hero Section

**Title:**
AI-Built Marketing Sites: The $50K Question

**Subtitle:**
Can AI deliver agency-quality websites at freelancer prices with startup speed? Three clients became the test cases.

**Lede:**
Small businesses seeking professional websites face a frustrating trifecta of bad options. DIY website builders like Wix or Squarespace offer affordability but deliver generic templates that often undermine rather than enhance brand credibility. Traditional agencies provide genuinely professional results but require budgets of $20K to $50K and timelines stretching three to six months—resources most small businesses simply don't have. Freelancers occupy the middle ground with variable quality, communication challenges, and timeline uncertainty. The hypothesis seemed clear: what if AI-powered development could deliver agency-quality websites at freelancer prices with startup-level speed? Three clients—a film production company, an enterprise consulting firm, and a shamanic healing practitioner—became deliberate test cases designed to prove or disprove whether AI could genuinely compete with traditional approaches on quality while dramatically outperforming on speed and cost.

---

### Body

**Section 1: The Hypothesis** (~350 words)

These three projects weren't just client work. They were experiments designed to answer a fundamental question about what's possible with AI-assisted development. Department of Art brought the challenge of visual storytelling for a film and TV set construction company in Portland. Their portfolio work is inherently visual—directors and production designers hire based on seeing previous set construction projects. The challenge was delivering a professional site that showcased high-resolution imagery beautifully while maintaining fast loading times across devices and network conditions.

Opal Creek presented entirely different constraints as an enterprise consulting company specializing in NetSuite ERP implementations. Their needs centered on professional B2B credibility with security-first architecture appropriate for a business consulting brand serving enterprise clients. Six-figure consulting engagements require vendors with solid security posture—generic templates wouldn't establish the trust necessary for that level of business relationship.

Karuna Gatton required authenticity and approachability for shamanic healing services in Eugene. The challenge wasn't technical complexity but conveying trust and professionalism for alternative medicine—a domain where many websites veer into unprofessional mysticism or sterile clinical presentations that miss the warmth essential to holistic healing practices.

The common thread across these dramatically different businesses was testing whether AI-assisted development could deliver professional marketing sites that genuinely help clients grow their businesses. As I reflected after completing them, "The apps aren't super technical, but getting the design right and the marketing right was the more challenging and fun thing to do." This insight proved central to understanding the value proposition. AI's contribution wasn't replacing human design judgment but accelerating implementation while humans focused on the harder problems of brand alignment and messaging.

The business case was compelling. If this approach worked, it could democratize access to professional web presence for small businesses that couldn't afford traditional agency budgets but deserved better than template-based DIY solutions.

**Comparison Grid:**
- **Traditional Agency:** $20K-$50K budget, 3-6 month timeline, professional results
- **AI-Assisted Development:** 60-80% cost reduction, 2-4 weeks, agency-quality maintained

---

**Section 2: How AI Changes Web Development** (~400 words)

After experimenting with various approaches, React combined with Sanity CMS emerged as the optimal stack for AI-assisted marketing site development. This wasn't a theoretical choice but one validated through real projects, starting with Peddle where Sanity was first introduced to my workflow. The combination works because React's component-based architecture is something AI understands exceptionally well. Next.js provides server-side rendering critical for SEO. Deployment to Vercel requires zero configuration. And Sanity CMS proved particularly valuable for client empowerment—non-technical clients can edit content through an intuitive interface without ongoing developer dependency.

Understanding what AI handles well versus what requires human expertise proved critical for efficient development. AI excels at component scaffolding and boilerplate code, eliminating the tedious setup work that consumes early project hours. Tailwind CSS styling and responsive design become significantly faster when AI generates initial utility class combinations that humans refine. TypeScript type definitions maintain consistency across growing codebases. Sanity schema structure and queries benefit from AI's ability to quickly generate working configurations. SEO meta tags, structured data, and basic accessibility features get built in automatically rather than added as afterthoughts.

Human expertise remains irreplaceable for design decisions and brand alignment. AI can generate visually acceptable layouts, but understanding whether those layouts communicate the right brand personality and meet specific business positioning needs requires human judgment informed by client conversations and market context. Content strategy and messaging demand understanding of target audiences, competitive positioning, and business objectives that extend far beyond what can be specified in prompts. Visual hierarchy and user flow decisions determine whether sites guide visitors toward conversion or lose them in confusion. Photography selection and art direction shape emotional responses and brand perception in ways that resist algorithmic optimization.

The collaboration model in practice looks like iteration between human strategic decisions and AI implementation. I request a hero section with specific elements. AI generates the component with proper structure, semantic HTML, responsive breakpoints, and accessibility attributes. I review the output, adjusting spacing to match brand guidelines, refining copy for tone and clarity, and optimizing imagery for emotional impact. AI implements these refinements while handling the responsive behavior across device sizes. I test across actual devices and verify accessibility. AI fixes discovered issues and adds polish like hover states and micro-interactions.

This division of labor accelerates development not by replacing human expertise but by letting humans focus their time on high-value decisions rather than implementation mechanics.

> "Getting the design right and the marketing right was the more challenging and fun thing to do. AI handles the technical implementation—humans solve the genuinely difficult problems of brand positioning and messaging."

**Tech Stack Tags:** React • Next.js • Sanity CMS • Tailwind • shadcn/ui • TypeScript • Vercel

---

**Section 3: Three Different Solutions** (~400 words)

Department of Art required a solution to a common creative industry problem: showcasing high-resolution visual work without destroying page performance. Film and TV set construction is inherently visual—production designers and directors hire based on portfolio work, making image quality non-negotiable. But large image files crush page load times, particularly on mobile devices over cellular connections. The solution combined Next.js Image component optimization for automatic format conversion and responsive sizing, lazy loading to defer off-screen images until needed, and Sanity's CDN for global image delivery with automatic optimization. The unique feature was a filterable project showcase that let visitors browse by project type while maintaining fast loading through progressive image loading and intelligent prefetching.

Opal Creek's requirements centered on credibility and security appropriate for enterprise consulting. NetSuite implementations are six-figure engagements for mid-market and enterprise clients—companies that scrutinize vendor security posture carefully. The solution implemented comprehensive Content Security Policy headers preventing XSS attacks, HSTS enforcing HTTPS connections, security headers controlling iframe embedding and content type sniffing, token rotation procedures for API credentials, and pre-commit hooks preventing accidental secret exposure. The professional design conveyed enterprise credibility through clean layouts, strategic white space, and typography choices that communicated competence without flashiness. The unique feature was a NetSuite expertise showcase with case study templates that established thought leadership.

Karuna Gatton needed warmth and authenticity to convey trustworthiness for shamanic healing services. Alternative medicine faces particular challenges establishing credibility—many potential clients are skeptical, while those open to shamanic healing still need assurance they're working with a legitimate, professional practitioner. The solution used a soft color palette with earth tones and gentle gradients, personal storytelling that introduced Karuna and her journey to shamanic practice, clear service descriptions that demystified offerings without excessive jargon, and testimonial showcases providing social proof. The unique feature was service booking integration allowing interested clients to schedule consultations directly from the website, reducing friction in the conversion funnel.

What struck me most was how the same fundamental approach—AI-assisted React development with Sanity CMS—adapted successfully to three wildly different industries and brand personalities. A film production company's bold visual portfolio, an enterprise consulting firm's professional B2B presence, and a shamanic healer's warm wellness brand all emerged from the same technology stack and development methodology, differentiated entirely by human design decisions and brand strategy rather than technical architecture.

> "Different industries, different audiences, different technical needs—but the same approach delivered professional results in all three cases. The flexibility proved the concept wasn't industry-specific but genuinely transferable."

---

**Section 4: What Actually Worked** (~350 words)

The development speed improvements weren't incremental—they represented order-of-magnitude changes from traditional approaches. Traditional agency timelines of three to six months with budgets of $20K to $50K compressed to two to four weeks with significantly lower costs. This represented a three to six times speed increase compared to traditional development while maintaining professional quality standards throughout. The economics weren't about cutting corners but about fundamentally different efficiency from AI-assisted development focused on high-value human decisions rather than implementation mechanics.

Technology decisions validated through production use provided clear guidance for future projects. React combined with Sanity "works super well" for marketing sites, handling everything from simple landing pages to complex portfolio showcases. TypeScript's type safety prevented entire categories of errors, catching mistakes at development time rather than in production. Sanity CMS enabled clients to update content confidently, with structured content models preventing the formatting mistakes common in traditional CMS platforms. Vercel deployment provided zero-config hosting with automatic scaling and edge caching.

Performance metrics demonstrated that speed improvements didn't sacrifice quality. Page loads under two seconds met Core Web Vitals standards critical for SEO and user experience. Lighthouse scores above 90 for performance, accessibility, and SEO across all three sites. Mobile performance tested across ten-plus device types. SEO readiness came built-in through proper structured data and sitemaps rather than requiring expensive post-launch remediation.

The lessons learned shaped my understanding of AI-assisted development significantly. Design remains fundamentally human work—AI accelerates implementation dramatically, but human judgment drives the design decisions that determine whether sites achieve business objectives or simply look professional while failing to convert. Client communication matters more than technical capability. Understanding the client's audience and business objectives trumps technical sophistication every time. Sanity proved excellent for clients, enabling non-technical business owners to confidently update content without developer assistance. Security couldn't be an afterthought—CSP, HSTS, token rotation, and pre-commit hooks needed to be built in from day one. Performance is a feature, not an optimization task to defer. Fast sites convert better, making image optimization and edge caching competitive advantages.

**Metrics at a glance:**
- **3-6x** faster development than traditional agencies
- **60-80%** cost reduction from agency pricing
- **<2 seconds** page load times
- **90+** Lighthouse scores (performance, accessibility, SEO)
- **<30 seconds** production build times
- **3 sites** shipped across diverse industries

---

### Closing

The broader impact of this work extends beyond three successful client projects to validate a fundamentally different approach to marketing site development. AI democratizes quality by making professional marketing sites accessible to businesses that couldn't afford traditional agencies. This isn't about barely-sufficient budget options—it's about genuinely professional results at price points small businesses can afford.

React plus Sanity emerged as the optimal stack for AI-assisted marketing site development through real-world validation rather than theoretical analysis. This combination handles the full spectrum from simple service sites to complex portfolio showcases while enabling both rapid AI-assisted development and long-term client content management independence.

Design still requires humans despite AI's implementation capabilities. This insight shaped the entire development philosophy: AI excels at translating design decisions into code, but human judgment remains essential for design itself, messaging strategy, and brand alignment. The most challenging and valuable work is inherently human—understanding business objectives, target audiences, competitive positioning, and brand personality that must shape every design decision.

Client empowerment through Sanity CMS created sustainable business relationships where clients could manage content confidently without ongoing developer dependency. This operational independence proved valuable beyond initial cost savings, enabling clients to respond quickly to market changes, seasonal promotions, or new service offerings without waiting for developer availability or incurring ongoing fees.

Speed without sacrificing quality validated that the traditional agency timeline wasn't fundamental to quality but rather reflected traditional development processes. Three to six times faster development didn't mean cutting corners on security, performance, or accessibility—it meant spending human effort on high-value decisions rather than low-value implementation mechanics that AI handles reliably.

The proof of concept validation across three diverse clients—film production, enterprise consulting, and alternative medicine—demonstrated that this approach works across industries rather than succeeding only in narrow niches. The challenge is marketing, not code. AI handles technical implementation beautifully, but understanding what to build, why to build it, and how to position it for specific audiences requires human expertise in marketing, strategy, and business development.

Peddle set the foundation as the first Sanity project, teaching workflows that benefited all subsequent marketing sites. This learning curve investment in one project created reusable patterns, component libraries, and development workflows that accelerated future projects—demonstrating how AI-assisted development improves iteratively as patterns and best practices accumulate.

---

## Pull Quotes

**Quote 1:**
"Getting the design right and the marketing right was the more challenging and fun thing to do. AI handles the technical implementation—humans solve the genuinely difficult problems of brand positioning and messaging."

**Quote 2:**
"Different industries, different audiences, different technical needs—but the same approach delivered professional results in all three cases. The flexibility proved the concept wasn't industry-specific but genuinely transferable."

**Quote 3:**
"The challenge is marketing, not code. AI handles implementation beautifully, but understanding what to build and how to position it requires human expertise."

---

## Comparison Grid

**Traditional Agency**
- **Label:** Traditional Approach
- **Title:** Agency Development
- **Text:** Professional results with $20K-$50K budgets and 3-6 month timelines. High quality but inaccessible to most small businesses.
- **Stat:** $20K-50K
- **Icon:** 🏢

**AI-Assisted Development**
- **Label:** New Approach
- **Title:** AI-Powered Speed
- **Text:** Same professional quality with 60-80% cost reduction and 2-4 week timelines. Makes agency-quality accessible to small businesses.
- **Stat:** 3-6x faster
- **Icon:** ⚡

---

## Tech Stack

React • Next.js • Sanity CMS • Tailwind CSS • shadcn/ui • TypeScript • Vercel • Vite • Jest • Playwright

---

## Photography Specifications

### Photo 1: Three Sites Showcase
**Subject:** Triptych showing homepage hero sections from DOA, Opal Creek, and Karuna Gatton sites displayed side-by-side
**Purpose:** Demonstrate the visual diversity and professional quality across three completely different industries
**Requirements:** Each site should be recognizably different in brand personality (DOA: bold/visual, Opal Creek: corporate/professional, Karuna Gatton: warm/welcoming)

### Photo 2: Sanity CMS Client Experience
**Subject:** Over-the-shoulder shot of client using Sanity Studio to edit content with real-time preview visible
**Purpose:** Illustrate client empowerment and ease of content management
**Requirements:** Clear view of Sanity's editor interface showing structured content fields, real-time preview pane, professional but approachable setting

### Photo 3: Development Timeline Comparison
**Subject:** Visual comparison showing traditional agency timeline (3-6 months) versus AI-assisted timeline (2-4 weeks)
**Purpose:** Quantify the speed advantage in immediately understandable visual format
**Requirements:** Timeline graphic showing key milestones (discovery, design, development, launch) for both approaches with cost indicators

### Photo 4: Mobile Responsiveness Showcase
**Subject:** One of the three sites (suggest DOA for visual impact) displayed across multiple device types simultaneously
**Purpose:** Demonstrate responsive design and cross-device compatibility
**Requirements:** Same content/page visible on desktop monitor, tablet, and smartphone with proper rendering at each screen size

---

## Related Content

**Related Showcase Items:**
- AI Workflow & Developer Tools (demonstrates the development methodology used to build these sites)
- PostPal (contrasting simple marketing sites with complex healthcare application development)

**Related Case Studies:**
- Peddle (first Sanity CMS project that established the workflow)
- Other client projects demonstrating full-stack capabilities

**Related Clients:**
- Department of Art (film/TV set construction, Portland)
- Opal Creek (NetSuite consulting, Portland)
- Karuna Gatton (shamanic healing, Eugene)

---

## Call to Action

This proven approach to AI-assisted marketing site development is available for businesses seeking professional web presence at accessible price points and timelines. The methodology continues to evolve with each project, incorporating new patterns and capabilities.

Interested in exploring AI-assisted development for marketing sites or curious about how this approach might work for specific business types? Let's discuss how these validated patterns could accelerate your web presence goals.

---

## Source Material

**Primary:**
- `/docs/content-specs/one-pagers/marketing-sites-one-pager.md` (comprehensive overview)
- `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` (DOA, Opal Creek, Karuna Gatton descriptions)

**Vector DB Chunks:** Chunks tagged with "marketing sites," "DOA," "Opal Creek," "Karuna Gatton," "Sanity CMS," "React," and "client projects"

---

## Editorial Notes

**Tone:** Professional but accessible—this should communicate to both potential clients (demonstrating capability) and technical audiences (demonstrating methodology)

**Technical Depth:** Balance specificity about technical choices (React, Sanity, TypeScript) with accessibility for non-technical readers who care more about outcomes than implementation

**Emphasis:** Focus on the proof-of-concept validation and lessons learned rather than just project descriptions. This is about demonstrating that AI-assisted development works across diverse industries.

**Authenticity:** Include the learning curve (Peddle was the first Sanity project), the challenges (getting design and marketing right), and the human-AI collaboration model. This wasn't perfect from day one—it was progressive refinement.

**Reading Time:** 3-4 minutes (approximately 1,500 words)

---

## Content Structure Summary

**Word Count Breakdown:**
- Hero (Title + Subtitle + Lede): ~150 words
- Section 1 (The Hypothesis): ~350 words
- Section 2 (How AI Changes Development): ~400 words
- Section 3 (Three Different Solutions): ~400 words
- Section 4 (What Actually Worked): ~350 words
- Closing: ~300 words
- **Total Body:** ~1,950 words (slightly over target, can trim in editing)

**Narrative Arc:**
1. **Hook:** The $50K question—can AI compete with agencies?
2. **Setup:** Three test cases with different industries and challenges
3. **Process:** How AI-human collaboration actually works
4. **Evidence:** Three specific solutions demonstrating flexibility
5. **Results:** Speed, cost, and quality metrics proving the concept
6. **Lessons:** What this means for future marketing site development

**Voice:** First-person where appropriate ("I reflected," "my workflow"), professional yet conversational, balancing technical credibility with business accessibility
