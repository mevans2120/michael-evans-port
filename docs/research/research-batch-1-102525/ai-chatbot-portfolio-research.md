# AI Chatbot for Portfolio Website - Research & Recommendations

**Date:** 2025-10-25
**Research Focus:** AI agents/chatbots for portfolio websites, oliverdore.com analysis, implementation approaches
**Status:** Complete

## Executive Summary

Portfolio websites are increasingly incorporating AI-powered chatbots to provide interactive, personalized experiences for visitors. This research explores current implementations, analyzes oliverdore.com's approach, and provides comprehensive recommendations for implementing an AI chatbot on Michael Evans' portfolio that can answer questions about his life, experience, and work.

**Key Findings:**
- **Modern portfolios use RAG (Retrieval Augmented Generation)** to create context-aware chatbots that can accurately answer questions about the portfolio owner
- **Multiple cost-effective implementation paths exist**, from fully free (Gemini + Supabase) to premium ($20/month OpenAI/Anthropic subscriptions)
- **Vercel AI SDK with Next.js** provides the most streamlined implementation for modern portfolios with streaming responses
- **Vector databases enable semantic search**, allowing chatbots to find relevant information from your resume, projects, and content
- **UI patterns favor floating chat bubbles** that expand into modal interfaces, minimizing disruption to portfolio browsing

## Objectives

This research aimed to answer:
1. What types of AI agents/chatbots are professionals using on portfolio websites?
2. How does the oliverdore.com chatbot work technically?
3. What implementation approaches exist for building a chatbot about someone's life and experience?
4. What are the cost implications and technology trade-offs?

## Methodology

- **Competitive analysis** of portfolio chatbot implementations
- **Technical analysis** of oliverdore.com's chatbot
- **Technology stack research** for RAG implementations with LangChain, Vercel AI SDK
- **Cost comparison** of OpenAI, Anthropic Claude, and Google Gemini APIs
- **UI/UX pattern research** for chatbot interfaces

## Findings

### 1. Current Portfolio Chatbot Landscape

#### Popular Implementations

**medevs/smart-portfolio (GitHub)**
- Next.js 15 with TypeScript
- LangChain + OpenAI for chatbot logic
- Supabase pgvector for vector embeddings (1536-dimensional vectors)
- Semantic search using distance operators for relevance matching
- Interactive drag-and-drop tech stack visualization
- Dark/light mode support
- **Key Innovation:** Uses `match_documents()` function for similarity searches

**Ask Bruno (andrewfryckowski.com)**
- Playful approach: chatbot persona is the developer's dog
- Informative and conversational tone
- Allows visitors to explore experience and projects through natural conversation

**Portfolio Chatbots with Free Stack**
- React + Framer Motion for animations
- Supabase for data persistence and sessions
- Google Gemini API (free tier)
- Vite for build tooling
- Session management with localStorage
- Context system in dedicated files (e.g., `resumeContext.js`)

#### Common Features Across Implementations

1. **Session Persistence**: Conversations saved across page refreshes
2. **Context-Aware Responses**: Trained on portfolio owner's resume, projects, and experience
3. **Natural Language Processing**: Understands varied question formats
4. **Responsive Design**: Works across desktop and mobile
5. **Floating UI**: Non-intrusive button that expands to chat interface

### 2. oliverdore.com Technical Analysis

**Architecture:**
- React with Next.js framework
- Component named "DoreAIAssistant"
- Uses React Suspense with async loading (non-blocking)
- Server-side rendering with client-side hydration
- Seamlessly integrated into portfolio layout

**User Experience:**
- Subtle integration without disrupting primary content
- Interactive alternative to reading static portfolio content
- Likely answers questions about Oliver's experience, projects, and technical expertise

**Probable Technologies:**
- Next.js frontend
- OpenAI API or similar LLM backend
- Modern React patterns (hooks, composition)

### 3. Implementation Technologies & Approaches

#### Approach A: RAG with Vector Database (Recommended for Accuracy)

**Technology Stack:**
```
Frontend: Next.js 15 + TypeScript + Tailwind CSS
AI Framework: Vercel AI SDK or LangChain
LLM Provider: OpenAI GPT-4o-mini / Anthropic Claude Haiku / Google Gemini Pro
Vector Database: Supabase pgvector / Pinecone / ChromaDB
Embeddings: OpenAI text-embedding-3-small or Cohere embeddings
UI: Floating chat bubble with modal (Framer Motion for animations)
```

**How It Works:**
1. **Preparation Phase:**
   - Convert resume, project descriptions, case studies into text chunks
   - Generate embeddings (1536-dimensional vectors) for each chunk
   - Store embeddings in vector database with metadata

2. **Runtime Phase:**
   - User asks question: "What experience does Michael have with AI?"
   - System generates embedding for the question
   - Vector database finds semantically similar content chunks
   - LLM receives question + relevant context chunks
   - Streams response back to user in real-time

3. **Benefits:**
   - Accurate, grounded responses (not hallucinated)
   - Can cite specific projects or experiences
   - Scalable to large amounts of content
   - Easy to update knowledge base

**Implementation Complexity:** Medium
**Ongoing Cost:** $10-30/month (depending on traffic)
**Setup Time:** 8-12 hours

#### Approach B: Context-Stuffing (Simpler, Lower Cost)

**Technology Stack:**
```
Frontend: Next.js + TypeScript + Tailwind CSS
AI Framework: Vercel AI SDK
LLM Provider: Google Gemini 1.5 Pro (free tier)
Context Storage: JSON file or Supabase table
UI: Floating chat bubble with modal
```

**How It Works:**
1. Create a comprehensive context file with all biographical information
2. Include context in every API call to LLM
3. LLM uses context to answer questions
4. Stream responses to UI

**Benefits:**
- Simpler implementation
- Can be completely free (Gemini free tier)
- No vector database complexity
- Easy to update content

**Limitations:**
- Limited by LLM context window
- Less precise retrieval for large knowledge bases
- Higher token costs if using paid APIs

**Implementation Complexity:** Low
**Ongoing Cost:** $0-10/month
**Setup Time:** 4-6 hours

#### Approach C: Hybrid with Tool Calling

**Technology Stack:**
```
Frontend: Next.js + Vercel AI SDK
LLM: OpenAI GPT-4o with function calling
Data Sources: Sanity CMS API + static context file
UI: Floating chat bubble with modal
```

**How It Works:**
1. LLM has access to "tools" (functions)
2. Tools can fetch real-time data from Sanity CMS
3. For general questions, uses static context
4. For specific projects, calls Sanity API to get latest info

**Benefits:**
- Always up-to-date with CMS content
- Flexible architecture
- Can extend with additional tools (GitHub API, etc.)

**Implementation Complexity:** Medium-High
**Ongoing Cost:** $15-40/month
**Setup Time:** 12-16 hours

### 4. UI/UX Design Patterns

#### Best Practices from Research

**Floating Button Pattern:**
- Fixed position (bottom-right corner typical)
- Persistent across all pages
- Clear icon (chat bubble or AI symbol)
- Smooth animation on hover
- Badge for notifications (optional)

**Modal Chat Interface:**
- Slides up from bottom or expands from button
- 400-500px width on desktop
- Full screen on mobile
- Header with title and close button
- Scrollable message history
- Input at bottom with send button
- Loading states with typing indicators

**Message Design:**
- User messages: Right-aligned, distinct color
- Bot messages: Left-aligned, with avatar
- Markdown support for formatted responses
- Code syntax highlighting
- Link preview cards

**Interaction States:**
- Typing indicator (animated dots)
- Error states with retry option
- Empty state with suggested questions
- Rate limiting feedback
- Token/message limit warnings

#### Example Suggested Questions

To guide users, display these on first load:
- "What's Michael's experience with AI and ML?"
- "Tell me about the Kroger Precision Marketing project"
- "What technologies does Michael work with?"
- "What's Michael's background and education?"

### 5. Cost Analysis

#### API Pricing Comparison (Per Million Tokens)

| Provider | Model | Input Tokens | Output Tokens | Best For |
|----------|-------|-------------|---------------|----------|
| **Google Gemini** | 1.5 Pro | $7 | $21 | Free tier available, great for starting |
| **Anthropic** | Claude Haiku | $0.25 | $1.25 | High-volume, cost-effective |
| **Anthropic** | Claude Sonnet | $3 | $15 | Balanced quality/cost |
| **OpenAI** | GPT-4o-mini | $0.15 | $0.60 | Excellent value, fast |
| **OpenAI** | GPT-4o | $2.50 | $10 | Premium quality |

#### Estimated Monthly Costs by Traffic

**Low Traffic (100 conversations/month, ~10 messages each):**
- Gemini Free Tier: $0
- GPT-4o-mini: $2-5
- Claude Haiku: $1-3

**Medium Traffic (1,000 conversations/month):**
- Gemini: $5-10
- GPT-4o-mini: $15-25
- Claude Haiku: $10-20

**High Traffic (5,000+ conversations/month):**
- Gemini: $30-50
- GPT-4o-mini: $75-100
- Claude Haiku: $50-80

**Vector Database Costs:**
- Supabase pgvector: Free tier (500MB), then $25/month
- Pinecone: Free tier (1 index), then $70/month
- ChromaDB: Free (self-hosted)

#### Recommended Starting Point

**Phase 1 (Free Tier):**
- Google Gemini 1.5 Pro (free)
- Context-stuffing approach
- No vector database
- Total: $0/month

**Phase 2 (Production Ready):**
- OpenAI GPT-4o-mini ($15-25/month)
- Supabase pgvector (free tier)
- RAG implementation
- Total: $15-25/month

**Phase 3 (Optimized):**
- Claude Haiku for chat ($10-20/month)
- Supabase pgvector ($25/month)
- OpenAI embeddings ($5-10/month)
- Total: $40-55/month

### 6. Content & Personality Strategy

#### What to Include in Knowledge Base

**Professional Experience:**
- Detailed role descriptions
- Key achievements and metrics
- Technologies used in each role
- Team sizes and leadership experience

**Projects & Case Studies:**
- Project objectives and outcomes
- Technical stack and architecture decisions
- Challenges and solutions
- Measurable impact

**Skills & Expertise:**
- Technical skills by category
- Proficiency levels
- Certifications and training
- Years of experience per skill

**Personal Background:**
- Education and degrees
- Career journey narrative
- Professional interests
- Outside interests (relevant to tech/creativity)

**Conversational Knowledge:**
- How you approach problems
- Your work philosophy
- What excites you about technology
- Types of opportunities you're interested in

#### Personality & Tone Guidelines

**Recommended Persona:**
- Professional but approachable
- Knowledgeable without being arrogant
- Enthusiastic about technology
- Clear and concise communicator
- Uses analogies to explain complex concepts
- Occasionally mentions specific project examples

**Example Responses:**

**Q:** "What's Michael's experience with machine learning?"

**A:** "Michael has extensive experience with machine learning, particularly in production environments. At Kroger, he led the development of the Precision Marketing platform, which uses ML models to personalize promotions for millions of customers. He's worked with TensorFlow, PyTorch, and scikit-learn, and has experience deploying models to production at scale.

He's particularly passionate about making AI accessible and practical for business use cases—not just academic exercises. Want to hear about a specific project or technology?"

**Q:** "Can Michael help with my startup?"

**A:** "Michael is interested in consulting opportunities, especially for projects involving AI/ML, creative technology, or complex product development. He's worked with startups before and enjoys the fast-paced, innovative environment.

If you'd like to discuss a potential collaboration, you can reach him through the contact form or connect on LinkedIn. Would you like to know more about his consulting approach or see examples of past work?"

## Competitive Analysis

| Feature | oliverdore.com | medevs/smart-portfolio | Ask Bruno | Recommended for Michael |
|---------|---------------|----------------------|-----------|----------------------|
| **Architecture** | Next.js + React | Next.js 15 + TypeScript | Not specified | Next.js 15 + TypeScript |
| **AI Provider** | Likely OpenAI | OpenAI | Varied | Start: Gemini, Scale: Claude |
| **Vector DB** | Unknown | Supabase pgvector | No | Supabase pgvector |
| **RAG System** | Likely | Yes | Probably not | Yes (Phase 2) |
| **UI Pattern** | Integrated | Floating + Modal | Floating + Modal | Floating + Modal |
| **Streaming** | Unknown | Yes | Unknown | Yes (Vercel AI SDK) |
| **Session Persistence** | Unknown | Yes | Yes | Yes |
| **Mobile Optimized** | Yes | Yes | Yes | Yes |
| **Open Source** | No | Yes | No | Yes (own code) |

## Recommendations

### Immediate Recommendation: Start with Vercel AI SDK + Gemini (Free)

**Why This Approach:**
1. **Zero cost to start** - Validate concept before investing
2. **Modern stack** - Next.js 15 already in use in your portfolio
3. **Fast implementation** - 4-6 hours to MVP
4. **Easy to upgrade** - Can add vector DB later without major refactor
5. **Great documentation** - Vercel AI SDK is well-documented

**Implementation Roadmap:**

#### Phase 1: MVP (Week 1) - Free Tier
- [ ] Create comprehensive context document with biographical info
- [ ] Implement floating chat button UI component
- [ ] Set up Vercel AI SDK with Gemini API
- [ ] Create chat API route in Next.js
- [ ] Implement basic chat interface with streaming
- [ ] Add session persistence (localStorage)
- [ ] Test with common questions
- **Cost:** $0
- **Time:** 4-6 hours

#### Phase 2: RAG Implementation (Week 2-3)
- [ ] Set up Supabase project with pgvector extension
- [ ] Create embeddings from portfolio content
- [ ] Implement semantic search function
- [ ] Upgrade to OpenAI GPT-4o-mini or Claude Haiku
- [ ] Add context retrieval to chat flow
- [ ] Improve response accuracy with examples
- **Cost:** $15-25/month
- **Time:** 8-12 hours

#### Phase 3: Enhancement (Week 4+)
- [ ] Add tool calling for Sanity CMS integration
- [ ] Implement suggested questions UI
- [ ] Add analytics (conversation tracking)
- [ ] Optimize prompts for brand voice
- [ ] Add rate limiting
- [ ] Implement conversation export
- **Cost:** $25-40/month
- **Time:** 8-10 hours

### Alternative Recommendation: Full RAG from Start

If budget isn't a constraint and you want the highest quality from day one:

**Stack:**
- Next.js 15 + TypeScript
- Vercel AI SDK
- Anthropic Claude Haiku (best value for quality)
- Supabase pgvector
- OpenAI text-embedding-3-small

**Benefits:**
- Production-ready from launch
- Accurate, grounded responses
- Scales to any content volume
- Professional quality

**Trade-offs:**
- Higher initial time investment (12-16 hours)
- Ongoing costs ($40-55/month)
- More complex architecture to maintain

### Content Preparation Checklist

Before implementing, prepare these materials:

- [ ] **Resume/CV**: Structured text with dates, roles, achievements
- [ ] **Project Descriptions**: For each major project, 2-3 paragraphs
- [ ] **Skills Inventory**: Categorized list with proficiency levels
- [ ] **Educational Background**: Degrees, certifications, notable courses
- [ ] **Professional Philosophy**: How you approach problems, work values
- [ ] **Career Narrative**: Story of your journey into tech
- [ ] **Interests**: Technical interests and relevant hobbies
- [ ] **Availability**: What types of opportunities you're open to
- [ ] **Personality Guidelines**: Tone, humor level, communication style
- [ ] **Example Q&As**: 20-30 question/answer pairs as training examples

### Technical Architecture for Recommended Approach

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │        Floating Chat Button (Always Visible)      │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Chat Modal (Slides Up on Click)                 │   │
│  │   ┌────────────────────────────────────────┐     │   │
│  │   │  Message History (Scrollable)          │     │   │
│  │   │  - User messages (right-aligned)       │     │   │
│  │   │  - Bot messages (left-aligned)         │     │   │
│  │   │  - Typing indicator                    │     │   │
│  │   └────────────────────────────────────────┘     │   │
│  │   ┌────────────────────────────────────────┐     │   │
│  │   │  Input Box + Send Button               │     │   │
│  │   └────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTP Request
┌─────────────────────────────────────────────────────────┐
│                  Next.js App (Vercel)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  app/api/chat/route.ts                           │   │
│  │  - Receives user message                          │   │
│  │  - (Phase 2: Queries vector DB for context)      │   │
│  │  - Calls LLM with context + question             │   │
│  │  - Streams response back                          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ API Call
┌─────────────────────────────────────────────────────────┐
│              LLM Provider (Gemini/Claude/OpenAI)         │
│  - Receives: System prompt + Context + User question    │
│  - Generates: Streaming response                        │
│  - Returns: Text chunks                                 │
└─────────────────────────────────────────────────────────┘
                         ↑ (Phase 2 only)
┌─────────────────────────────────────────────────────────┐
│           Vector Database (Supabase pgvector)            │
│  - Stores: Embeddings of portfolio content              │
│  - Query: Semantic similarity search                    │
│  - Returns: Top 3-5 relevant content chunks             │
└─────────────────────────────────────────────────────────┘
```

### Sample Code Structure

```typescript
// app/api/chat/route.ts (Phase 1: Simple)
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { portfolioContext } from '@/lib/chatbot/context';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro'),
    system: `You are an AI assistant representing Michael Evans, an AI/ML expert and creative technologist.

    Context about Michael:
    ${portfolioContext}

    Answer questions about Michael's experience, skills, and projects in a professional yet approachable tone.`,
    messages,
  });

  return result.toDataStreamResponse();
}
```

```typescript
// components/ChatbotButton.tsx
'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40"
          >
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="font-semibold">Ask me about Michael</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

## Risks & Considerations

### Technical Risks
- **Hallucination**: LLMs may invent facts without proper context/RAG
  - *Mitigation*: Implement RAG in Phase 2, provide comprehensive context
- **Rate Limiting**: Free tiers have limits
  - *Mitigation*: Implement rate limiting on frontend, upgrade when needed
- **API Costs**: Can grow unexpectedly with traffic
  - *Mitigation*: Set up billing alerts, implement usage monitoring
- **Latency**: Streaming responses can be slow on poor connections
  - *Mitigation*: Show typing indicators, optimize chunk sizes

### Content Risks
- **Outdated Information**: Portfolio changes won't be reflected
  - *Mitigation*: Phase 3 Sanity integration, quarterly content reviews
- **Inappropriate Responses**: LLM may respond poorly to edge cases
  - *Mitigation*: Strong system prompts, content filters, testing
- **Privacy**: May expose information you don't want public
  - *Mitigation*: Careful content curation, review all training data

### User Experience Risks
- **Expectation Mismatch**: Users expect perfect answers
  - *Mitigation*: Set expectations in UI ("AI assistant trained on portfolio")
- **Mobile Experience**: Chat interfaces can be awkward on mobile
  - *Mitigation*: Full-screen mobile design, test thoroughly
- **Accessibility**: Screen readers may struggle with chat UI
  - *Mitigation*: Proper ARIA labels, keyboard navigation

## Success Metrics

### Primary Metrics
- **Engagement Rate**: % of visitors who open the chatbot
  - Target: 15-25% (industry standard for portfolio sites)
- **Conversation Completion**: % who send more than one message
  - Target: 60%+ (indicates useful responses)
- **Average Messages per Conversation**:
  - Target: 4-6 messages (meaningful engagement)

### Secondary Metrics
- **Response Quality**: Manual review of sample conversations
  - Target: 90%+ accurate responses
- **Response Time**: Time to first token
  - Target: <2 seconds
- **Error Rate**: % of conversations with errors
  - Target: <5%

### Business Impact Metrics
- **Contact Form Submissions**: Does chatbot increase conversions?
  - Track before/after implementation
- **Bounce Rate**: Does engagement tool reduce bounce?
  - Compare against pre-chatbot baseline
- **Time on Site**: Do chatbot users spend more time?
  - Segment chatbot users vs. non-users

## Next Steps

### Immediate Actions (This Week)
1. **Decide on approach**: Free tier MVP vs. full RAG implementation
2. **Prepare content**: Create comprehensive biographical context document
3. **Set up accounts**:
   - Gemini API key (free) or OpenAI API key
   - Supabase account (if doing Phase 2 RAG)
4. **Review examples**: Explore medevs/smart-portfolio on GitHub

### Development Phase (Week 1-2)
1. **Build floating chat button component**
2. **Implement chat modal UI**
3. **Create API route with Vercel AI SDK**
4. **Test with various questions**
5. **Deploy to staging environment**
6. **User testing with 3-5 people**

### Refinement Phase (Week 3-4)
1. **Iterate on personality/tone based on feedback**
2. **Add suggested questions**
3. **Implement analytics**
4. **Optimize for mobile**
5. **Production deployment**

### Future Enhancements (Month 2+)
1. **Upgrade to RAG with vector database** (if started simple)
2. **Add Sanity CMS integration** for real-time content
3. **Implement conversation export** (for lead generation)
4. **Multi-language support** (if relevant)
5. **Voice input/output** (experimental)

## References

### Documentation
- [Vercel AI SDK](https://ai-sdk.dev/docs/introduction)
- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/)
- [Supabase pgvector Guide](https://supabase.com/docs/guides/ai/vector-embeddings)

### Example Projects
- [medevs/smart-portfolio](https://github.com/medevs/smart-portfolio) - Next.js 15 with RAG
- [Vercel AI Chatbot Template](https://vercel.com/templates/next.js/ai-chatbot-telemetry)
- [Free Portfolio Chatbot Tutorial](https://dev.to/melvinprince/develop-a-free-chatbot-for-your-portfolio-website-a-step-by-step-guide-with-code-examples-2np6)

### API Documentation
- [Google Gemini API](https://ai.google.dev/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [OpenAI API](https://platform.openai.com/docs)

### UI/UX Resources
- [30 Chatbot UI Examples](https://www.eleken.co/blog-posts/chatbot-ui-examples)
- [Chatbot Design Best Practices](https://www.botpress.com/blog/chatbot-design)

---

**Next Conversation:**
- Review this document together
- Decide on implementation approach (free MVP vs. full RAG)
- Begin content preparation
- Set up development environment
