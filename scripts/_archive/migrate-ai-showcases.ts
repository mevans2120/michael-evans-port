/**
 * Migration script to update PostPal and Marketing Sites AI showcases
 * with editorial content following the AI Workflow format
 */

import { client } from '../src/lib/sanity/client'

// PostPal Editorial Content
const postpalContent = {
  heroSection: {
    badge: 'Healthcare AI',
    title: 'PostPal: When Paper Pamphlets Meet AI',
    subtitle: "How an AI-powered recovery timeline transforms healthcare's most frustrating patient experience",
    summary: `Watch a patient leave any medical facility after a procedure. They're handed a paper pamphlet containing critical recovery instructions—when they can shower, which medications to take, how long to avoid certain activities. These instructions are time-sensitive, complex, and essential for safe recovery. They're also paper documents that get lost, water-damaged, or simply misunderstood. The realization hit me clearly: this isn't a digitization problem where we just make the pamphlet a PDF. This is fundamentally a guidance problem. Patients don't need a digital pamphlet—they need an intelligent timeline that tells them exactly what they can do today.`,
  },
  slides: [
    {
      _type: 'contentSlide',
      sectionLabel: 'The Problem',
      heading: 'The Paper Pamphlet Problem',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The healthcare discharge instruction system is broken in a way that's so ubiquitous we barely notice it anymore. After colonoscopies, surgeries, dental procedures—any medical intervention requiring recovery—patients receive paper pamphlets with complex care instructions. \"No shower for 72 hours.\" \"Keep cast dry for 3 months.\" \"Physical therapy daily for 6 weeks.\" \"Take medication X, avoid medication Y.\"",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'These restrictions gradually phase out over time, and the dos eventually become optional. A patient recovering from surgery might have a dozen time-bound instructions that change week by week, day by day, even hour by hour. But all of this complexity lives on paper—documents that get water-damaged in the bathroom, lost in the shuffle of daily life, or simply sit on the counter while the patient wonders: "Can I shower yet? When can I drive? What restrictions still apply?"',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The human cost is substantial. Patients experience anxiety wondering whether they're following instructions correctly. They miss medications or physical therapy sessions because they forgot or couldn't interpret the timeline. Providers face an endless stream of repetitive phone calls—\"Can I shower yet?\" asked forty times a day across a practice—consuming staff time without adding clinical value. Most critically, preventable complications occur when patients miss care steps, leading to readmissions that could have been avoided with better guidance.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The business case is equally clear. A colonoscopy center performing hundreds of procedures weekly spends significant staff hours answering the same questions repeatedly. An orthopedic practice managing dozens of surgical recoveries simultaneously has no visibility into patient compliance until problems surface. The paper pamphlet system doesn't just frustrate patients—it creates operational inefficiency at scale.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "I'm interested in a startup called PostPal that's tackling this problem head-on. The insight driving the solution is that discharge instructions need to transform from static paper into intelligent, personalized timelines that actively guide patients through recovery.",
            },
          ],
        },
      ],
      techPills: [
        'Claude',
        'Mistral',
        'Next.js',
        'React Native',
        'PostgreSQL',
        'Prisma',
        'Supabase',
        'TypeScript',
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'The Solution',
      heading: 'Building the Intelligent Timeline',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'PostPal addresses this through a two-platform architecture that bridges the provider-patient gap. The web application serves both as the provider portal for managing discharge instructions and the patient dashboard for tracking progress. The mobile application—built with React Native for cross-platform iOS and Android coverage—extends this experience to where patients actually live: on their phones.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The AI-powered workflow solves a subtle but critical UX problem. Traditional patient portals require patients to create accounts, verify email, enter medical information, and navigate complex setup flows—all while recovering from medical procedures and possibly under medication effects. PostPal inverts this model entirely.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Providers upload the PDF discharge instructions and generate a QR code or URL with pre-filled patient data. The patient scans the code or clicks the link, and they're immediately viewing their personalized recovery timeline with zero manual data entry. This friction elimination dramatically improves adoption rates because the setup burden falls on the provider who already has the patient's information, not on the patient who's least equipped to handle administrative tasks.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The intelligence layer uses a hybrid approach to content extraction. Mistral AI handles OCR to pull text from PDFs of varying quality—some crisp and clear, others faded photocopies of photocopies. Claude analyzes the medical instructions for context and meaning. This isn't simple text extraction. The AI understands procedure types, identifies medications and their schedules, recognizes activity restrictions and their durations, and converts unstructured medical language into structured, actionable tasks.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Task generation happens automatically based on this extracted content. The AI creates a personalized recovery timeline organized by day, week, and month, with automatic scheduling relative to the procedure date. The tasks aren\'t generic—they\'re context-aware. "No shower for 72 hours" means something different when the procedure happened yesterday versus last week. The timeline adapts to the specific procedure, the specific patient\'s instructions, and the natural progression of recovery.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Patient engagement happens through multiple channels designed for reliability. The mobile app delivers daily reminders. Patients check off completed tasks to build engagement and accountability. Progress tracking provides visual feedback with milestone achievements. The notification system spans in-app alerts, email, SMS, and push notifications to ensure critical reminders reach patients regardless of their preferred communication channel. Healthcare can't assume patients will check the app daily—redundancy isn't excessive, it's necessary.",
            },
          ],
        },
      ],
      quoteBox: {
        quote:
          "This isn't about digitizing a pamphlet. It's about fundamentally rethinking how healthcare information reaches patients during their most vulnerable moments—when they're recovering at home without direct medical supervision.",
        attribution: '— On building PostPal',
      },
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'The Impact',
      heading: 'Impact on Both Sides of Healthcare',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'For patients, PostPal transforms the post-procedure experience from anxious uncertainty to informed confidence. The intelligent recovery timeline answers the fundamental question patients ask themselves every morning: "What can I do today?" Instead of interpreting complex medical language from a paper pamphlet, they see clear, time-specific guidance organized exactly as they need it.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Automatic reminders eliminate the cognitive burden of remembering medication schedules or physical therapy sessions. Patients struggling with recovery pain or medication side effects don't need to also manage complex mental tracking of care instructions. The app handles that burden, delivering timely prompts exactly when needed.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Progress tracking provides both practical utility and psychological support. Visual milestones show the recovery journey in concrete terms—week one complete, medication schedule 85 percent adherent, physical therapy streak maintained for seven days. This isn't frivolous gamification. It leverages proven behavioral psychology to improve compliance with medical instructions that directly impact recovery outcomes.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'From the provider perspective, PostPal addresses a persistent operational problem: the flood of repetitive patient questions that consume staff time without adding clinical value. "When can I drive?" "Can I shower yet?" "Which medication should I take first?" These questions, asked dozens of times daily across a practice, represent staff hours spent answering information that was already provided at discharge.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The provider portal streamlines discharge instruction delivery dramatically. QR code onboarding takes seconds—scan the patient\'s information, upload their discharge PDF, generate the code, and hand it to them. The AI handles instruction extraction automatically, converting PDFs into structured timelines without provider review unless desired. This works for any procedure type, from routine colonoscopies to complex surgical recoveries.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Visibility into patient compliance transforms provider-patient communication. Instead of waiting for patients to call with questions or problems, providers see real-time data on who's completing tasks, who's falling behind, and who might need intervention before minor issues become serious complications. This proactive approach catches problems early when they're easiest and least expensive to address.",
            },
          ],
        },
      ],
      comparisonBoxes: [
        {
          label: 'The Problem',
          title: 'Paper Pamphlets Get Lost',
          text: 'Instructions get lost, water-damaged, or misunderstood. Patients feel anxious about recovery steps. Providers field endless repetitive calls asking "Can I shower yet?"',
          stat: '$$$',
          icon: '📄',
        },
        {
          label: 'The Solution',
          title: 'AI-Powered Guidance',
          text: "Always accessible on patient's phone. Context-aware guidance shows what applies today. Automatic reminders and progress tracking improve compliance by 20-40%.",
          stat: '90%+',
          icon: '📱',
        },
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'The Technology',
      heading: 'The Technical Achievement',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Building healthcare software demands different engineering priorities than typical consumer applications. Security isn't optional, reliability isn't negotiable, and complexity is unavoidable when dealing with medical information, regulatory compliance, and real-world recovery scenarios.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The technical foundation starts with a comprehensive database architecture spanning over 30 Prisma models that cover Users, Tasks, Procedures, Providers, Doctors, and the complex relationships between them. This isn't over-engineering—healthcare data is inherently relational and nuanced. A task belongs to a procedure, which was performed by a doctor, at a provider facility, for a patient who might have multiple concurrent procedures. Comprehensive audit logging tracks every change for compliance purposes. Scheduled notifications require template management. Patient invite systems need secure token-based authentication. Each of these concerns requires thoughtful schema design to maintain data integrity while supporting complex queries.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The mobile architecture prioritizes offline reliability through a custom dependency injection system that manages platform-specific service implementations. MMKV provides fast, encrypted local storage that's ten times faster than AsyncStorage, with synchronous access eliminating async overhead. Background synchronization handles network restoration gracefully, using optimistic updates for instant UI feedback while queuing changes for later sync.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Biometric security integrates Face ID, Touch ID, and fingerprint authentication as primary access methods, storing credentials securely in the system keychain rather than application storage. JWT token management includes automatic refresh logic and session management with background renewal to prevent unexpected logouts during active use. This security-first approach meets HIPAA compliance requirements while maintaining user-friendly authentication flows.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Type safety throughout the codebase prevents entire categories of errors. TypeScript with strict type checking catches mistakes at development time. Zod validation schemas enforce runtime type checking on API boundaries. Shared type definitions between web and mobile ensure contract consistency. In healthcare software, where mistakes can literally harm patients, this multiple-layer validation isn't excessive—it's necessary.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The result is production-ready software handling real patient data with real medical implications. Web application load times under 2 seconds. Mobile app cold starts under 3 seconds. Real-time task synchronization with optimistic updates. PDF processing completing in 5 to 30 seconds depending on document complexity. These aren't just engineering achievements—they're necessary baselines for healthcare software that patients must trust and rely on during recovery.",
            },
          ],
        },
      ],
    },
  ],
  metrics: [
    {
      value: '30-50%',
      label: 'Reduction in patient calls',
      description: 'Fewer repetitive questions to providers',
    },
    {
      value: '20-40%',
      label: 'Improved compliance',
      description: 'Better adherence to care instructions',
    },
    {
      value: '15-25%',
      label: 'Fewer complications',
      description: 'Reduction in preventable issues',
    },
    {
      value: '<2s',
      label: 'Web app load time',
      description: 'Fast, responsive performance',
    },
    {
      value: '<3s',
      label: 'Mobile app cold start',
      description: 'Quick access when needed',
    },
    {
      value: '5-30s',
      label: 'PDF processing',
      description: 'Automatic instruction extraction',
    },
    {
      value: '30+',
      label: 'Database models',
      description: 'Comprehensive data architecture',
    },
    {
      value: '13',
      label: 'Notification endpoints',
      description: 'Multi-channel communication',
    },
    {
      value: '90%+',
      label: 'Patient satisfaction',
      description: 'Digital timeline vs paper pamphlets',
    },
  ],
}

// Marketing Sites Editorial Content
const marketingSitesContent = {
  heroSection: {
    badge: 'AI Showcase',
    title: 'AI-Built Marketing Sites: The $50K Question',
    subtitle:
      'Can AI deliver agency-quality websites at freelancer prices with startup speed? Three clients became the test cases.',
    summary: `Small businesses seeking professional websites face a frustrating trifecta of bad options. DIY website builders like Wix or Squarespace offer affordability but deliver generic templates that often undermine rather than enhance brand credibility. Traditional agencies provide genuinely professional results but require budgets of $20K to $50K and timelines stretching three to six months—resources most small businesses simply don't have. Freelancers occupy the middle ground with variable quality, communication challenges, and timeline uncertainty. The hypothesis seemed clear: what if AI-powered development could deliver agency-quality websites at freelancer prices with startup-level speed? Three clients—a film production company, an enterprise consulting firm, and a shamanic healing practitioner—became deliberate test cases designed to prove or disprove whether AI could genuinely compete with traditional approaches on quality while dramatically outperforming on speed and cost.`,
  },
  slides: [
    {
      _type: 'contentSlide',
      sectionLabel: 'The Hypothesis',
      heading: 'The Hypothesis',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "These three projects weren't just client work. They were experiments designed to answer a fundamental question about what's possible with AI-assisted development. Department of Art brought the challenge of visual storytelling for a film and TV set construction company in Portland. Their portfolio work is inherently visual—directors and production designers hire based on seeing previous set construction projects. The challenge was delivering a professional site that showcased high-resolution imagery beautifully while maintaining fast loading times across devices and network conditions.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Opal Creek presented entirely different constraints as an enterprise consulting company specializing in NetSuite ERP implementations. Their needs centered on professional B2B credibility with security-first architecture appropriate for a business consulting brand serving enterprise clients. Six-figure consulting engagements require vendors with solid security posture—generic templates wouldn't establish the trust necessary for that level of business relationship.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Karuna Gatton required authenticity and approachability for shamanic healing services in Eugene. The challenge wasn\'t technical complexity but conveying trust and professionalism for alternative medicine—a domain where many websites veer into unprofessional mysticism or sterile clinical presentations that miss the warmth essential to holistic healing practices.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The common thread across these dramatically different businesses was testing whether AI-assisted development could deliver professional marketing sites that genuinely help clients grow their businesses. As I reflected after completing them, "The apps aren\'t super technical, but getting the design right and the marketing right was the more challenging and fun thing to do." This insight proved central to understanding the value proposition. AI\'s contribution wasn\'t replacing human design judgment but accelerating implementation while humans focused on the harder problems of brand alignment and messaging.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The business case was compelling. If this approach worked, it could democratize access to professional web presence for small businesses that couldn't afford traditional agency budgets but deserved better than template-based DIY solutions.",
            },
          ],
        },
      ],
      comparisonBoxes: [
        {
          label: 'Traditional Approach',
          title: 'Agency Development',
          text: 'Professional results with $20K-$50K budgets and 3-6 month timelines. High quality but inaccessible to most small businesses.',
          stat: '$20K-50K',
          icon: '🏢',
        },
        {
          label: 'New Approach',
          title: 'AI-Powered Speed',
          text: 'Same professional quality with 60-80% cost reduction and 2-4 week timelines. Makes agency-quality accessible to small businesses.',
          stat: '3-6x faster',
          icon: '⚡',
        },
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'The Process',
      heading: 'How AI Changes Web Development',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "After experimenting with various approaches, React combined with Sanity CMS emerged as the optimal stack for AI-assisted marketing site development. This wasn't a theoretical choice but one validated through real projects, starting with Peddle where Sanity was first introduced to my workflow. The combination works because React's component-based architecture is something AI understands exceptionally well. Next.js provides server-side rendering critical for SEO. Deployment to Vercel requires zero configuration. And Sanity CMS proved particularly valuable for client empowerment—non-technical clients can edit content through an intuitive interface without ongoing developer dependency.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Understanding what AI handles well versus what requires human expertise proved critical for efficient development. AI excels at component scaffolding and boilerplate code, eliminating the tedious setup work that consumes early project hours. Tailwind CSS styling and responsive design become significantly faster when AI generates initial utility class combinations that humans refine. TypeScript type definitions maintain consistency across growing codebases. Sanity schema structure and queries benefit from AI\'s ability to quickly generate working configurations. SEO meta tags, structured data, and basic accessibility features get built in automatically rather than added as afterthoughts.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Human expertise remains irreplaceable for design decisions and brand alignment. AI can generate visually acceptable layouts, but understanding whether those layouts communicate the right brand personality and meet specific business positioning needs requires human judgment informed by client conversations and market context. Content strategy and messaging demand understanding of target audiences, competitive positioning, and business objectives that extend far beyond what can be specified in prompts. Visual hierarchy and user flow decisions determine whether sites guide visitors toward conversion or lose them in confusion. Photography selection and art direction shape emotional responses and brand perception in ways that resist algorithmic optimization.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The collaboration model in practice looks like iteration between human strategic decisions and AI implementation. I request a hero section with specific elements. AI generates the component with proper structure, semantic HTML, responsive breakpoints, and accessibility attributes. I review the output, adjusting spacing to match brand guidelines, refining copy for tone and clarity, and optimizing imagery for emotional impact. AI implements these refinements while handling the responsive behavior across device sizes. I test across actual devices and verify accessibility. AI fixes discovered issues and adds polish like hover states and micro-interactions.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'This division of labor accelerates development not by replacing human expertise but by letting humans focus their time on high-value decisions rather than implementation mechanics.',
            },
          ],
        },
      ],
      quoteBox: {
        quote:
          'Getting the design right and the marketing right was the more challenging and fun thing to do. AI handles the technical implementation—humans solve the genuinely difficult problems of brand positioning and messaging.',
        attribution: '— On AI-assisted development',
      },
      techPills: [
        'React',
        'Next.js',
        'Sanity CMS',
        'Tailwind',
        'shadcn/ui',
        'TypeScript',
        'Vercel',
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'The Evidence',
      heading: 'Three Different Solutions',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Department of Art required a solution to a common creative industry problem: showcasing high-resolution visual work without destroying page performance. Film and TV set construction is inherently visual—production designers and directors hire based on portfolio work, making image quality non-negotiable. But large image files crush page load times, particularly on mobile devices over cellular connections. The solution combined Next.js Image component optimization for automatic format conversion and responsive sizing, lazy loading to defer off-screen images until needed, and Sanity's CDN for global image delivery with automatic optimization. The unique feature was a filterable project showcase that let visitors browse by project type while maintaining fast loading through progressive image loading and intelligent prefetching.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Opal Creek's requirements centered on credibility and security appropriate for enterprise consulting. NetSuite implementations are six-figure engagements for mid-market and enterprise clients—companies that scrutinize vendor security posture carefully. The solution implemented comprehensive Content Security Policy headers preventing XSS attacks, HSTS enforcing HTTPS connections, security headers controlling iframe embedding and content type sniffing, token rotation procedures for API credentials, and pre-commit hooks preventing accidental secret exposure. The professional design conveyed enterprise credibility through clean layouts, strategic white space, and typography choices that communicated competence without flashiness. The unique feature was a NetSuite expertise showcase with case study templates that established thought leadership.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Karuna Gatton needed warmth and authenticity to convey trustworthiness for shamanic healing services. Alternative medicine faces particular challenges establishing credibility—many potential clients are skeptical, while those open to shamanic healing still need assurance they're working with a legitimate, professional practitioner. The solution used a soft color palette with earth tones and gentle gradients, personal storytelling that introduced Karuna and her journey to shamanic practice, clear service descriptions that demystified offerings without excessive jargon, and testimonial showcases providing social proof. The unique feature was service booking integration allowing interested clients to schedule consultations directly from the website, reducing friction in the conversion funnel.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "What struck me most was how the same fundamental approach—AI-assisted React development with Sanity CMS—adapted successfully to three wildly different industries and brand personalities. A film production company's bold visual portfolio, an enterprise consulting firm's professional B2B presence, and a shamanic healer's warm wellness brand all emerged from the same technology stack and development methodology, differentiated entirely by human design decisions and brand strategy rather than technical architecture.",
            },
          ],
        },
      ],
      quoteBox: {
        quote:
          "Different industries, different audiences, different technical needs—but the same approach delivered professional results in all three cases. The flexibility proved the concept wasn't industry-specific but genuinely transferable.",
        attribution: '— On validating the approach',
      },
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'The Results',
      heading: 'What Actually Worked',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The development speed improvements weren't incremental—they represented order-of-magnitude changes from traditional approaches. Traditional agency timelines of three to six months with budgets of $20K to $50K compressed to two to four weeks with significantly lower costs. This represented a three to six times speed increase compared to traditional development while maintaining professional quality standards throughout. The economics weren't about cutting corners but about fundamentally different efficiency from AI-assisted development focused on high-value human decisions rather than implementation mechanics.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Technology decisions validated through production use provided clear guidance for future projects. React combined with Sanity "works super well" for marketing sites, handling everything from simple landing pages to complex portfolio showcases. TypeScript\'s type safety prevented entire categories of errors, catching mistakes at development time rather than in production. Sanity CMS enabled clients to update content confidently, with structured content models preventing the formatting mistakes common in traditional CMS platforms. Vercel deployment provided zero-config hosting with automatic scaling and edge caching.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Performance metrics demonstrated that speed improvements didn't sacrifice quality. Page loads under two seconds met Core Web Vitals standards critical for SEO and user experience. Lighthouse scores above 90 for performance, accessibility, and SEO across all three sites. Mobile performance tested across ten-plus device types. SEO readiness came built-in through proper structured data and sitemaps rather than requiring expensive post-launch remediation.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The lessons learned shaped my understanding of AI-assisted development significantly. Design remains fundamentally human work—AI accelerates implementation dramatically, but human judgment drives the design decisions that determine whether sites achieve business objectives or simply look professional while failing to convert. Client communication matters more than technical capability. Understanding the client's audience and business objectives trumps technical sophistication every time. Sanity proved excellent for clients, enabling non-technical business owners to confidently update content without developer assistance. Security couldn't be an afterthought—CSP, HSTS, token rotation, and pre-commit hooks needed to be built in from day one. Performance is a feature, not an optimization task to defer. Fast sites convert better, making image optimization and edge caching competitive advantages.",
            },
          ],
        },
      ],
      quoteBox: {
        quote:
          'The challenge is marketing, not code. AI handles implementation beautifully, but understanding what to build and how to position it requires human expertise.',
        attribution: '— On the human-AI division of labor',
      },
    },
  ],
  metrics: [
    {
      value: '3-6x',
      label: 'Faster development',
      description: 'Compared to traditional agencies',
    },
    {
      value: '60-80%',
      label: 'Cost reduction',
      description: 'From agency pricing',
    },
    {
      value: '<2s',
      label: 'Page load times',
      description: 'Core Web Vitals optimized',
    },
    {
      value: '90+',
      label: 'Lighthouse scores',
      description: 'Performance, accessibility, SEO',
    },
    {
      value: '<30s',
      label: 'Build times',
      description: 'Fast iteration during development',
    },
    {
      value: '3 sites',
      label: 'Shipped projects',
      description: 'Across diverse industries',
    },
  ],
}

async function migrateShowcase(slug: string, content: any) {
  console.log(`\n🔄 Migrating ${slug}...`)

  try {
    // Fetch existing document
    const query = `*[_type == "aiShowcase" && slug.current == $slug][0]`
    const existing = await client.fetch(query, { slug })

    if (!existing) {
      console.error(`❌ Showcase "${slug}" not found in Sanity`)
      return false
    }

    console.log(`✓ Found existing document: ${existing._id}`)

    // Update the document
    await client
      .patch(existing._id)
      .set({
        heroSection: content.heroSection,
        slides: content.slides,
        metrics: content.metrics,
      })
      .commit()

    console.log(`✅ Successfully migrated ${slug}`)
    return true
  } catch (error) {
    console.error(`❌ Error migrating ${slug}:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting AI Showcase Editorial Migration')
  console.log('=' .repeat(50))

  const results = {
    postpal: await migrateShowcase('postpal', postpalContent),
    marketingSites: await migrateShowcase('marketing-sites', marketingSitesContent),
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary:')
  console.log(`PostPal: ${results.postpal ? '✅ Success' : '❌ Failed'}`)
  console.log(`Marketing Sites: ${results.marketingSites ? '✅ Success' : '❌ Failed'}`)

  if (results.postpal && results.marketingSites) {
    console.log('\n🎉 All showcases migrated successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Open http://localhost:3000/ai-showcase/postpal')
    console.log('2. Open http://localhost:3000/ai-showcase/marketing-sites')
    console.log('3. Test responsive design and dark mode')
    console.log('4. Verify all content displays correctly')
  } else {
    console.log('\n⚠️  Some migrations failed. Check errors above.')
  }
}

main()
