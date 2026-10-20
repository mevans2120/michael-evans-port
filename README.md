# Michael Evans Portfolio

A modern, responsive portfolio website showcasing AI/ML expertise, creative technology solutions, and professional case studies.

🚀 **Live Site**: [https://michael-evans-port.vercel.app](https://michael-evans-port.vercel.app)

## 🎯 Overview

This portfolio site is built with Next.js 15 and features a clean, minimalist design that highlights professional work in AI, software development, and product management. The site includes comprehensive case studies, an AI-powered chatbot assistant, and detailed project documentation.

## ✨ Key Features

- **AI Chatbot Assistant**: Interactive chatbot powered by Claude Haiku 4.5 that answers from the whole prompt-cached knowledge base, with no retrieval step
- **Live Content**: Sanity edits reach the chatbot on the next request through webhook cache invalidation
- **Dynamic Case Studies**: 7 comprehensive case studies with detailed metrics and results
- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Performance Optimized**: Next.js 15 with zero TypeScript errors/warnings
- **Modern UI**: Clean, professional design with Tailwind CSS and shadcn/ui components
- **Type Safe**: Full TypeScript implementation for robust code
- **SEO Ready**: Optimized for search engines with metadata and structured data
- **CMS Integrated**: Sanity CMS for dynamic content management

## 🛠️ Technology Stack

### Core Technologies
- **Framework**: Next.js 15.5 (App Router)
- **React**: 19.0
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui with Radix UI primitives
- **CMS**: Sanity Studio (embedded at `/studio`)

### AI & Chatbot
- **LLM**: Claude Haiku 4.5 via the Vercel AI SDK and `@ai-sdk/anthropic`
- **Design**: The whole knowledge base (about 50k tokens) is sent as one prompt-cached system block on every request; there is no database
- **Knowledge Base**: 12 transcript files + Sanity CMS content (case studies, blog posts, profile, AI projects)

### Development Tools
- **Build Tool**: Next.js with Turbopack
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git & GitHub
- **Deployment**: Vercel

## 📁 Project Structure

```
michael-evans-port/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public pages (home, about, case studies)
│   │   ├── (admin)/           # Embedded Sanity Studio
│   │   └── api/               # API routes (chat, webhooks)
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components (50+)
│   │   ├── chatbot/          # AI chatbot components
│   │   ├── navigation/       # Navigation components
│   │   └── ai-showcase/      # AI project showcase components
│   ├── lib/
│   │   ├── sanity/           # Sanity client & queries
│   │   └── chatbot/          # Chatbot corpus, prompt, follow-ups, logging
│   └── hooks/                # Custom React hooks
├── sanity/
│   └── schemas/              # Sanity CMS schemas (project, profile, aiProject, etc.)
├── docs/
│   ├── content-specs/        # Case study content specifications (7 files)
│   ├── plans/               # Implementation plans, including the chatbot remediation
│   └── design/              # Design concepts and explorations
├── memory-bank/             # Development documentation
│   ├── CURRENT.md           # Active work tracking
│   ├── PROGRESS.md          # Development log
│   └── ...                  # Additional docs
└── content/
    └── chatbot/
        └── transcripts/     # Source of truth for chatbot knowledge (12 markdown files)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Sanity account (for CMS)
- Anthropic API key (for the chatbot)

### Environment Variables

Create a `.env.local` file with the following:

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=your_token
SANITY_WEBHOOK_SECRET=your_webhook_secret

# Anthropic (chatbot)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mevans2120/michael-evans-port.git
cd michael-evans-port
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run build:corpus  # Compile chatbot transcripts to JSON (also runs via prebuild and pretest)
npm run validate:prompts  # Check every CMS suggested prompt is answerable by the chatbot
npm run memory:start  # View current development status
```

## 📋 Pages & Routes

- **Home** (`/`) - Dynamic hero with introduction
- **About** (`/about`) - Professional background and experience
- **AI Showcase** (`/ai-showcase`) - AI/ML project demonstrations
  - `/ai-showcase/[slug]` - Individual AI project pages
- **Case Studies** (`/case-studies/[slug]`):
  - Virgin America - First responsive airline website
  - Before Launcher - Helping thousands focus (40,000+ downloads)
  - Casa Bonita - 40,000-person queue, 100% capacity
  - Target - Enterprise e-commerce transformation
  - Peddle - 15% conversion increase
  - Lyft - 8% driver acquisition improvement
  - Aesop - 12% conversion improvement (luxury e-commerce)
- **Sanity Studio** (`/studio`) - Embedded CMS

## 🤖 AI Chatbot Features

### Intelligent Assistant
- Answers questions about Michael's background, projects, and expertise
- Grounded responses: the whole knowledge base is in the prompt, and the model refuses anything it does not cover
- Follow-up question suggestions drawn from editor-written question lists
- Streaming responses for better UX

### Live Content
- **Transcripts**: Markdown files in `content/chatbot/transcripts/`, compiled into a JSON module by `npm run build:corpus` before every build
- **Sanity CMS**: Fetched at request time and cached; the Sanity webhook invalidates that cache, so edits appear on the next chat request
- **Suggested Prompts**: Managed in the `chatPrompts` Sanity document and checked by `npm run validate:prompts`
- **Prompt Caching**: The corpus is cached by Anthropic for an hour, so most requests read it at a tenth of the input price

### Knowledge Base
- 12 transcript files (about 50k tokens together with the Sanity content)
- Sanity CMS content (case studies, blog posts, profile, AI projects)
- Technical architecture documentation
- Career history and achievements

## 🏗️ Architecture

### Content Architecture
- **Single Source of Truth**: `content/chatbot/transcripts/` (12 markdown files)
- **Flat Structure**: Preserves narrative flow of comprehensive transcripts
- **Whole-Corpus Prompt**: Transcripts and Sanity content go to the model together as one prompt-cached system block; there is no database
- **Live Sanity Content**: Webhook-driven cache invalidation, with no sync step

### Component Architecture
- **Atomic Design**: Reusable, composable components
- **Server Components**: Next.js App Router with RSC
- **Client Components**: Interactive elements with 'use client'
- **shadcn/ui Pattern**: Components copied into codebase for customization

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [src/lib/chatbot/README.md](./src/lib/chatbot/README.md).

## 📝 Memory Bank System

This project uses a Memory Bank system for maintaining development continuity:

- **CURRENT.md**: Active sprint tracking with detailed accomplishments
- **PROGRESS.md**: Historical development log
- **TECHNICAL_DECISIONS.md**: Architecture decisions and rationale
- **CHANGELOG.md**: Version history

Learn more in [memory-bank/README.md](./memory-bank/README.md).

## 🎨 Design System

- **Typography**:
  - Headings: DM Sans (sans-serif)
  - Body: Crimson Pro (serif)
- **Colors**: Dark theme with purple gradients (#c084fc, #a855f7)
- **Spacing**: Tailwind's default spacing scale
- **Components**: 50+ shadcn/ui components
- **Responsive**: Mobile-first design approach

## 📊 Case Studies

### Featured Projects with Metrics

1. **Virgin America** - First responsive airline website (20+ awards)
2. **Before Launcher** - Focus app with 40,000+ downloads
3. **Casa Bonita** - Queue system handling 40,000 people at 100% capacity
4. **Target** - 20+ concurrent work streams for enterprise e-commerce
5. **Peddle** - 15% conversion increase for car marketplace
6. **Lyft** - 8% conversion improvement on driver acquisition
7. **Aesop** - 12% conversion improvement for luxury e-commerce

All case studies include:
- Detailed problem/solution narratives
- Measurable results and metrics
- Technical architecture
- Key learnings and insights

## 🚢 Deployment

The site is deployed on Vercel with automatic deployments from the main branch.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mevans2120/michael-evans-port)

### Environment Setup for Production

1. Configure environment variables in Vercel
2. Set up Sanity webhook:
   - Go to Sanity dashboard → API → Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/sanity`
   - Set secret: Use your `SANITY_WEBHOOK_SECRET`
   - Trigger on: Create, Update, Delete
3. Confirm the chatbot answers its suggested prompts:
   ```bash
   CHAT_BASE=https://your-domain.com npm run validate:prompts
   ```

## 🔄 Content Management

### Adding/Updating Content

1. **Via Sanity Studio** (`/studio`):
   - Edit case studies, blog posts, profile, AI projects
   - The webhook invalidates the chatbot's cached content, so the next chat request sees the change

2. **Via Transcript Files** (`content/chatbot/transcripts/`):
   - Add or edit markdown files, with a `questions:` frontmatter block listing the follow-up questions the file answers
   - Production builds recompile the corpus automatically; while `next dev` is running, run `npm run build:corpus` after editing

### Creating New Case Studies

1. Create content spec in `docs/content-specs/`
2. Use export script: `npx tsx src/scripts/export-case-studies-ndjson.ts [slug]`
3. Import to Sanity: `sanity dataset import case-studies.ndjson production`
4. Add images in Sanity Studio
5. The chatbot sees the new case study on its next request

## 🐛 Troubleshooting

### Chatbot Issues
- Read the runtime logs: `vercel logs <deployment> | grep '"event":"chat.'`
- Verify `ANTHROPIC_API_KEY` is set
- Run `npm run validate:prompts` to confirm every suggested prompt is answerable
- If a transcript edit is missing locally, run `npm run build:corpus`

### Build Issues
- Run `npm run lint` to check for errors
- Clear `.next` folder and rebuild
- Verify all environment variables are set

### Sanity Issues
- Check webhook configuration in Sanity dashboard
- Verify `SANITY_WEBHOOK_SECRET` matches
- Test webhook with Sanity's webhook testing tool

## 📊 Performance

- **Build**: Zero TypeScript errors, zero warnings
- **Lighthouse Score**: 90+ (target)
- **Production Build**: All 21 routes optimized
- **API Costs**: Prompt caching serves the corpus at a tenth of the input price on all but the first request each hour

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome!

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📧 Contact

**Michael Evans**
- GitHub: [@mevans2120](https://github.com/mevans2120)
- Email: mevans212@gmail.com
- Website: [https://michael-evans-port.vercel.app](https://michael-evans-port.vercel.app)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Sanity](https://www.sanity.io/), and [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Claude](https://www.anthropic.com/claude) through the [Vercel AI SDK](https://ai-sdk.dev/)
- Deployed on [Vercel](https://vercel.com)
- Icons by [Lucide](https://lucide.dev)

---

*Last Updated: October 20, 2026*
