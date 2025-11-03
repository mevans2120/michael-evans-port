# AI-Built Marketing Sites - Content Specification
## DOA, Opal Creek, and Karuna Gatton

## Metadata

**Title:** AI-Built Marketing Sites: Agency Quality at Startup Speed
**Slug:** `marketing-sites`
**Category:** AI Showcase
**Featured:** Yes
**Order:** 3
**Type:** Detailed Page

---

## Hero Section

### Title
AI-Built Marketing Sites: Proving the Concept

### Tagline
Could AI-assisted development deliver high-quality marketing websites faster and more affordably than traditional agencies while maintaining professional standards?

### Summary
Small businesses and independent professionals face a harsh choice when building their web presence: cheap but generic DIY website builders, expensive traditional agencies charging $20K-$50K with 3-6 month timelines, or variable-quality freelancers with uncertain communication and delivery. Three diverse clients—a film production company, an enterprise consulting firm, and a shamanic healing practitioner—became test cases for a different approach. Could AI-powered development deliver agency-quality websites at freelancer prices with startup-level speed? The results speak clearly: professional marketing sites completed in 2-4 weeks, 60-80% cost reduction from traditional agencies, and clients empowered to manage their own content confidently.

---

## Content Sections

### Section 1: The Hypothesis

**Heading:** Why These Three Projects Matter

**Content:**

The business reality for small businesses seeking professional websites hasn't changed much in decades. DIY website builders like Wix or Squarespace offer affordability but deliver generic templates with limited customization and often unprofessional results that undermine rather than enhance brand credibility. Traditional agencies provide truly professional outcomes but require budgets of $20K to $50K and timelines stretching 3 to 6 months—resources most small businesses simply don't have. Freelancers occupy the middle ground with variable quality, communication challenges that can derail projects, and timeline uncertainty that makes planning difficult.

The opportunity seemed clear: what if AI-powered development could deliver agency-quality websites at freelancer prices with startup-level speed? But opportunities that seem clear often prove more complicated in execution. These three projects—Department of Art, Opal Creek, and Karuna Gatton—weren't just client work. They were deliberate test cases designed to prove or disprove the fundamental hypothesis that AI-assisted development could genuinely compete with traditional approaches on quality while dramatically outperforming on speed and cost.

Department of Art brought the challenge of visual storytelling for a film and TV set construction company in Portland. Their portfolio work is inherently visual, requiring high-resolution imagery that typically sacrifices page performance. The challenge was delivering a professional site that showcased their set construction work beautifully while maintaining fast loading times across devices and network conditions.

Opal Creek presented entirely different constraints as an enterprise consulting company specializing in NetSuite ERP implementations. Their needs centered on professional B2B credibility with security-first architecture appropriate for a business consulting brand serving enterprise clients. Generic templates wouldn't establish the trust necessary for six-figure consulting engagements.

Karuna Gatton required authenticity and approachability for shamanic healing services in Eugene. The challenge wasn't technical complexity but conveying trust and professionalism for alternative medicine—a domain where many websites veer into unprofessional mysticism or sterile clinical presentations that miss the warmth essential to holistic healing practices.

The common thread across these dramatically different businesses was the fundamental question: could AI-assisted development deliver professional marketing sites that genuinely help clients grow their businesses? As one reflection noted, "The apps aren't super technical, but getting the design right and the marketing right was the more challenging and fun thing to do." This insight proved central—AI's value wasn't replacing human design judgment but accelerating implementation while humans focused on the harder problems of brand alignment and messaging.

---

### Section 2: The AI-Powered Development Process

**Heading:** How AI Changes Marketing Site Development

**Content:**

After experimenting with various approaches, React combined with Sanity CMS emerged as the optimal stack for AI-assisted marketing site development. This wasn't a theoretical choice but one validated through real projects, starting with Peddle where Sanity was first introduced to the workflow. The combination works because React's component-based architecture is something AI understands exceptionally well, Next.js provides server-side rendering critical for SEO, modern UX patterns deliver fast page loads, and deployment to Vercel requires zero configuration.

Sanity CMS proved particularly valuable for client empowerment. Non-technical clients can edit content through an intuitive interface with real-time collaboration support, powerful querying capabilities provide developer flexibility, structured content modeling prevents formatting mistakes, and the developer-friendly API integrates cleanly with React. The result is clients who confidently update their own content without ongoing developer dependency—a significant operational advantage for small businesses with limited budgets for recurring development costs.

Tailwind CSS with shadcn/ui components completed the stack by enabling rapid styling through utility classes, consistent design systems without heavy custom CSS, pre-built accessible components that work out of the box, and easy customization for brand identity specific to each client. This isn't about templates—it's about starting with solid foundations that adapt to each brand's unique requirements.

The development workflow progressed through four distinct phases. Discovery and strategy began with client interviews to understand business goals, target audience, and brand positioning. Competitive analysis revealed what similar businesses were doing, identifying both opportunities and table-stakes requirements. Content strategy defined necessary pages, messaging hierarchy, and calls-to-action aligned with business objectives. Visual direction emerged through mood boards, style references, and color palette development that captured each brand's essence.

Design-first development leveraged AI-generated wireframes for quick mockups that clients could react to before significant development investment. Building reusable component libraries created consistency while accelerating development of subsequent pages. Responsive design started mobile-first, with testing across devices ensuring reliability regardless of how customers accessed the site. Brand integration ensured colors, typography, and imagery aligned perfectly with each client's existing brand identity or helped establish new brand direction where needed.

Content and functionality implementation designed flexible Sanity schemas that enabled client content editing without breaking layouts. Initial content population seeded sites with client-provided materials, establishing patterns clients could follow when adding future content. SEO optimization implemented proper meta tags, structured data, and sitemaps from the beginning rather than bolting them on later. Performance tuning through image optimization, lazy loading, and caching ensured fast experiences even with heavy visual content.

Security and launch couldn't be afterthoughts, especially for business sites handling client inquiries and potentially sensitive information. Comprehensive security headers including CSP, HSTS, and X-Frame-Options were built in from day one. Token rotation procedures protected API credentials from exposure. Pre-commit hooks prevented accidental secret leakage to version control. Analytics integration with Google Analytics and Vercel Analytics provided clients visibility into site performance. Client training on Sanity ensured smooth content management handoff without creating ongoing support burdens.

---

### Section 3: What AI Handles Well vs. Human Expertise

**Heading:** The Collaboration Model

**Content:**

Understanding what AI handles well versus what requires human expertise proves critical for efficient AI-assisted development. AI excels at component scaffolding and boilerplate code, eliminating the tedious setup work that consumes early project hours. Tailwind CSS styling and responsive design become significantly faster when AI generates initial utility class combinations that humans refine. TypeScript type definitions and interfaces maintain consistency across growing codebases without manual tracking. Sanity schema structure and queries benefit from AI's ability to quickly generate working configurations based on content requirements. SEO meta tags and structured data follow established patterns that AI implements reliably. Basic accessibility features like ARIA labels and semantic HTML get built in automatically rather than added as afterthoughts.

Human expertise remains irreplaceable for design decisions and brand alignment. AI can generate visually acceptable layouts, but understanding whether those layouts communicate the right brand personality and meet specific business positioning needs requires human judgment informed by client conversations and market context. Content strategy and messaging demand understanding of target audiences, competitive positioning, and business objectives that extend far beyond what can be specified in prompts. Visual hierarchy and user flow decisions determine whether sites guide visitors toward conversion or lose them in confusion—choices that require holistic understanding of business goals and user psychology. Photography selection and art direction shape emotional responses and brand perception in ways that resist algorithmic optimization. Client communication and feedback integration require empathy, interpretation of sometimes unclear client desires, and translation of subjective preferences into concrete implementation decisions. Security architecture and best practices demand understanding of threat models, compliance requirements, and defense-in-depth strategies that AI tools don't inherently possess.

The collaboration model in practice looks like this: a human requests "Build a hero section with a bold headline, subtext, and CTA button." AI generates a component with proper structure and styling, implementing semantic HTML, responsive breakpoints, and accessibility attributes. The human reviews the output, adjusting spacing to match brand guidelines, refining copy for tone and clarity, and optimizing imagery for emotional impact and brand alignment. AI implements these refinements while handling responsive breakpoints across device sizes. The human tests across devices and verifies accessibility with screen readers and keyboard navigation. AI fixes discovered issues and adds polish like hover states, loading behaviors, and micro-interactions.

This division of labor accelerates development not by replacing human expertise but by letting humans focus their time on high-value decisions rather than implementation mechanics. The "getting the design right and the marketing right was the more challenging and fun thing to do" insight captures this perfectly—AI handles the technical implementation, freeing humans to solve the genuinely difficult problems of brand positioning, messaging, and user experience.

---

### Section 4: Project-Specific Approaches

**Heading:** Three Different Businesses, Three Different Solutions

**Content:**

Department of Art required a solution to a common creative industry problem: showcasing high-resolution visual work without destroying page performance. Film and TV set construction is inherently visual—clients hire based on portfolio work, making image quality non-negotiable. But large image files crush page load times, particularly on mobile devices over cellular connections. The solution combined Next.js Image component optimization for automatic format conversion and responsive sizing, lazy loading to defer off-screen images until needed, and Sanity's CDN for global image delivery with automatic optimization. The unique feature was a filterable project showcase that let visitors browse by project type while maintaining fast loading through progressive image loading and intelligent prefetching.

The tech stack used Next.js with TypeScript for type safety throughout, Sanity for content management that let DOA update their portfolio as new projects completed, Tailwind for rapid styling iteration during design refinement, and comprehensive testing with Jest for unit tests and Playwright for end-to-end testing covering critical user paths. This testing investment paid dividends when adding new features or refactoring components, catching regressions before they reached production.

Opal Creek's requirements centered on credibility and security appropriate for enterprise consulting. NetSuite implementations are six-figure engagements for mid-market and enterprise clients—companies that scrutinize vendor security posture carefully. The solution implemented comprehensive Content Security Policy headers preventing XSS attacks, HSTS enforcing HTTPS connections, security headers controlling iframe embedding and content type sniffing, token rotation procedures for API credentials, and pre-commit hooks preventing accidental secret exposure. The professional design conveyed enterprise credibility through clean layouts, strategic white space, and typography choices that communicated competence without flashiness.

The unique feature was a NetSuite expertise showcase with case study templates that established thought leadership and demonstrated specific implementation experience relevant to prospective clients. The tech stack chose Vite over Next.js for faster build times during development, React with TypeScript for component reliability, Sanity for content management enabling Opal Creek to publish case studies and resources independently, and shadcn/ui for pre-built accessible components that accelerated development while maintaining professional appearance.

Karuna Gatton needed warmth and authenticity to convey trustworthiness for shamanic healing services. Alternative medicine faces particular challenges establishing credibility—many potential clients are skeptical, while those open to shamanic healing still need assurance they're working with a legitimate, professional practitioner. The solution used a soft color palette with earth tones and gentle gradients, personal storytelling that introduced Karuna and her journey to shamanic practice, clear service descriptions that demystified offerings without excessive jargon, and testimonial showcases providing social proof from previous clients.

The unique feature was service booking integration allowing interested clients to schedule consultations directly from the website, reducing friction in the conversion funnel. The tech stack used Next.js with TypeScript for full-stack capabilities including form handling and scheduling logic, Tailwind for design system flexibility enabling the warm, organic aesthetic needed, and Core Web Vitals optimization ensuring the site loaded quickly and felt responsive—critical for establishing professional credibility that alternative medicine practitioners must work harder to achieve.

---

### Section 5: Technical Achievements and Lessons Learned

**Heading:** What Actually Worked

**Content:**

The development speed improvements weren't incremental—they represented order-of-magnitude changes from traditional approaches. Traditional agency timelines of 3 to 6 months with budgets of $20K to $50K compressed to 2 to 4 weeks with significantly lower costs. This represented a 3 to 6 times speed increase compared to traditional development while maintaining professional quality standards throughout. The economics weren't about cutting corners but about fundamentally different efficiency from AI-assisted development focused on high-value human decisions rather than implementation mechanics.

Technology decisions validated through production use provided clear guidance for future projects. React combined with Sanity "works super well" for marketing sites, handling everything from simple landing pages to complex portfolio showcases. TypeScript's type safety prevented entire categories of errors, catching mistakes at development time rather than in production. Sanity CMS enabled clients to update content confidently, with structured content models preventing the formatting mistakes common in traditional CMS platforms. Vercel deployment provided zero-config hosting with automatic scaling and edge caching that would require significant DevOps effort with traditional hosting.

Performance metrics demonstrated that speed improvements didn't sacrifice quality. Page loads under 2 seconds met Core Web Vitals standards critical for SEO and user experience. Build times under 30 seconds enabled rapid iteration during development. Content sync provided real-time preview in Sanity, letting clients see changes before publishing. Mobile performance achieved Lighthouse scores above 90 for performance, accessibility, and SEO across all three sites. SEO readiness came built-in through proper structured data and sitemaps rather than requiring expensive post-launch remediation.

The lessons learned shaped future project approaches significantly. Design remains fundamentally human work—"getting the design right and the marketing right was the more challenging and fun thing to do." AI accelerates implementation dramatically, but human judgment drives the design decisions that determine whether sites achieve business objectives or simply look professional while failing to convert.

Client communication matters more than technical capability. Understanding the client's audience and business objectives trumps technical sophistication every time. A technically perfect site that doesn't serve business goals represents failure regardless of code quality. This insight reinforced the importance of discovery and strategy phases before any implementation begins.

Sanity proved excellent for clients, enabling non-technical business owners to confidently update content without developer assistance. Structured content prevented formatting mistakes while real-time preview built confidence that changes would appear as intended. This client empowerment had business model implications—sites could be delivered at lower price points because they didn't require ongoing developer retainer relationships for routine content updates.

Security couldn't be an afterthought, particularly for business sites handling customer inquiries and building professional credibility. CSP, HSTS, token rotation, and pre-commit hooks needed to be built in from day one, especially for business sites where security breaches could destroy client trust and expose sensitive business or customer information.

Performance is a feature, not an optimization task to defer. Fast sites convert better—this isn't subjective preference but measurable reality. Image optimization, lazy loading, and edge caching aren't optional enhancements but competitive advantages that directly impact business results through improved SEO rankings and reduced bounce rates.

---

### Section 6: Impact and Future Direction

**Heading:** Democratizing Professional Web Presence

**Content:**

The broader impact of this work extends beyond three successful client projects to validate a fundamentally different approach to marketing site development. AI democratizes quality by making professional marketing sites accessible to businesses that couldn't afford traditional agencies. This isn't about barely-sufficient budget options—it's about genuinely professional results at price points small businesses can afford.

React plus Sanity emerged as the optimal stack for AI-assisted marketing site development through real-world validation rather than theoretical analysis. This combination handles the full spectrum from simple service sites to complex portfolio showcases while enabling both rapid AI-assisted development and long-term client content management independence.

Design still requires humans despite AI's implementation capabilities. This insight shaped the entire development philosophy: AI excels at translating design decisions into code, but human judgment remains essential for design itself, messaging strategy, and brand alignment. The most challenging and valuable work is inherently human—understanding business objectives, target audiences, competitive positioning, and brand personality that must shape every design decision.

Client empowerment through Sanity CMS created sustainable business relationships where clients could manage content confidently without ongoing developer dependency. This operational independence proved valuable beyond initial cost savings, enabling clients to respond quickly to market changes, seasonal promotions, or new service offerings without waiting for developer availability or incurring ongoing fees.

Speed without sacrificing quality validated that the traditional agency timeline wasn't fundamental to quality but rather reflected traditional development processes. Three to six times faster development didn't mean cutting corners on security, performance, or accessibility—it meant spending human effort on high-value decisions rather than low-value implementation mechanics that AI handles reliably.

The proof of concept validation across three diverse clients—film production, enterprise consulting, and alternative medicine—demonstrated that this approach works across industries rather than succeeding only in narrow niches with specific requirements. Different industries, different audiences, different technical needs, but the same fundamental approach delivered professional results in all three cases.

The challenge is marketing, not code. This insight captured a profound truth: AI handles technical implementation beautifully, but understanding what to build, why to build it, and how to position it for specific audiences requires human expertise in marketing, strategy, and business development. The technical problem has been solved; the harder problems remain fundamentally human.

Peddle set the foundation as the first Sanity project, teaching workflows that benefited all subsequent marketing sites. This learning curve investment in one project created reusable patterns, component libraries, and development workflows that accelerated future projects—demonstrating how AI-assisted development improves iteratively as patterns and best practices accumulate.

The next evolution involves systematizing these learnings into reusable templates for common industries like professional services, creative agencies, health and wellness practices, and local service businesses. Enhanced features including booking integration, e-commerce capabilities, multilingual support, and advanced SEO optimization will expand addressable use cases. A client dashboard providing analytics summaries, lead tracking, content suggestions, and performance monitoring could transform one-time website projects into ongoing value-add relationships. Productized service offerings with standardized pricing tiers, defined deliverables, timeline commitments, and support packages would make this approach scalable beyond individual client engagements.

The bottom line is clear: these three marketing sites prove that AI-assisted development can deliver professional, performant, secure websites at a fraction of traditional agency costs and timelines. The challenge isn't the code—AI handles that beautifully. The challenge is design, messaging, and brand alignment, which still require human expertise. React plus Sanity emerged as optimal, enabling both fast development and client empowerment through easy content management.

---

## Photography Specifications

### Photo 1: Three Sites Showcase
**Subject:** Triptych showing homepage hero sections from DOA, Opal Creek, and Karuna Gatton sites displayed side-by-side
**Purpose:** Demonstrate the visual diversity and professional quality across three completely different industries
**Requirements:** Each site should be recognizably different in brand personality (DOA: bold/visual, Opal Creek: corporate/professional, Karuna Gatton: warm/welcoming), all three should demonstrate responsive design and professional polish, displayed on desktop or tablet screens
**Context:** This single image communicates that the approach works across industries, not just for one specific type of business

### Photo 2: Sanity CMS Client Experience
**Subject:** Over-the-shoulder shot of client using Sanity Studio to edit content with real-time preview visible
**Purpose:** Illustrate client empowerment and ease of content management
**Requirements:** Clear view of Sanity's editor interface showing structured content fields, real-time preview pane displaying changes, client's hands on keyboard/mouse (showing this is actual use, not a demo), professional but approachable setting suggesting small business owner managing their own content
**Details:** Should communicate confidence and ease—this isn't intimidating technical work but straightforward content management

### Photo 3: Development Timeline Comparison
**Subject:** Visual comparison showing traditional agency timeline (3-6 months) versus AI-assisted timeline (2-4 weeks)
**Purpose:** Quantify the speed advantage in immediately understandable visual format
**Requirements:** Timeline graphic or calendar-based visualization showing key milestones (discovery, design, development, launch) for both approaches, clear labeling of time periods, cost indicators showing 60-80% reduction, quality indicators showing professional standards maintained
**Format:** Could be infographic, Gantt chart comparison, or calendar overlay—whatever communicates the dramatic time and cost compression most effectively

### Photo 4: Mobile Responsiveness Showcase
**Subject:** One of the three sites (suggest DOA for visual impact) displayed across multiple device types simultaneously
**Purpose:** Demonstrate responsive design and cross-device compatibility
**Requirements:** Same content/page visible on desktop monitor, tablet (iPad), and smartphone (iPhone/Android), proper rendering at each screen size showing adaptation rather than simple scaling, all devices visible in single shot to show simultaneous testing approach
**Context:** Professional marketing sites must work flawlessly across devices—this demonstrates the technical rigor behind the fast development speed

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

**Note:** This proven approach to AI-assisted marketing site development is available for businesses seeking professional web presence at accessible price points and timelines. The methodology continues to evolve with each project, incorporating new patterns and capabilities.

**Connect:** Interested in exploring AI-assisted development for marketing sites or curious about how this approach might work for specific business types? Let's discuss how these validated patterns could accelerate your web presence goals.

---

## Source Material

**Primary:**
- `/docs/ai-showcase/marketing-sites-one-pager.md` (comprehensive overview)
- `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` (DOA, Opal Creek, Karuna Gatton descriptions)

**Vector DB Chunks:** Chunks tagged with "marketing sites," "DOA," "Opal Creek," "Karuna Gatton," "Sanity CMS," "React," and "client projects"

---

## Editorial Notes

**Tone:** Professional but accessible—this should communicate to both potential clients (demonstrating capability) and technical audiences (demonstrating methodology)

**Technical Depth:** Balance specificity about technical choices (React, Sanity, TypeScript) with accessibility for non-technical readers who care more about outcomes than implementation

**Emphasis:** Focus on the proof-of-concept validation and lessons learned rather than just project descriptions. This is about demonstrating that AI-assisted development works across diverse industries, not just showcasing three websites.

**Authenticity:** Include the learning curve (Peddle was the first Sanity project), the challenges (getting design and marketing right), and the human-AI collaboration model. This wasn't perfect from day one—it was progressive refinement of an approach through real client work.
