# Michael Evans - Technical Architecture & AI Projects

## Overview

Michael Evans has built a diverse portfolio of AI-powered applications and developer tools, demonstrating expertise in modern full-stack development, AI integration, mobile development, and developer productivity tools. His recent projects showcase a sophisticated understanding of AI orchestration, real-time systems, and developer experience optimization.

## Major AI Projects & Technical Architecture

### 1. AI Research Agent - Autonomous Multi-Query Research System

**Overview**: A comprehensive AI-powered research tool that breaks down complex questions into sub-questions, searches the web, scrapes content, and synthesizes findings into coherent research reports.

**Technical Architecture**:
- **Three-Stage Research Process**:
  1. Query Analyzer (GPT-4) - Decomposes complex questions into 3-5 specific sub-questions
  2. Information Gatherer - Combines web search (SerpAPI), content scraping (Cheerio), and AI analysis (Claude-3 Sonnet)
  3. Synthesizer (GPT-4) - Combines all findings into comprehensive, actionable insights

- **Tech Stack**:
  - Backend: Next.js API Routes with TypeScript
  - AI Models: OpenAI GPT-4 (analysis & synthesis), Anthropic Claude-3 Sonnet (information processing)
  - Web Search: SerpAPI integration for real-time Google searches
  - Content Scraping: Cheerio for HTML parsing with fallback handling
  - Streaming: Server-Sent Events (SSE) for real-time progress updates
  - Frontend: React with TypeScript, CSS modules, interactive markdown rendering

**Technical Innovations**:
- **Relevance Filtering System**: Configurable thresholds (0-100) with intelligent filtering of search results
- **Context-Aware Follow-ups**: Session-based conversation threading maintaining research context
- **Real-time Streaming**: Live progress updates with detailed activity logging and timestamps
- **Graceful Degradation**: Comprehensive error handling with fallbacks for web search and scraping failures
- **Memory Bank System**: Maintains project context including decisions, patterns, and progress

**Performance Characteristics**:
- Research completion: 30-60 seconds for comprehensive queries
- Handles 100+ searches/month on free tier
- Processes multiple data sources in parallel
- Automatic timeout protection for slow websites

### 2. Care Tracker Mobile AKA Post Pal - Post-Procedure Recovery App

**Overview**: React Native mobile application for post-procedure recovery tracking with AI-powered guidance, replacing traditional paper instructions with intelligent, personalized care plans.

**Technical Architecture**:
- **Mobile Stack**:
  - Framework: React Native 0.81.4 with TypeScript 5.8
  - Navigation: React Navigation v7 with stack and tab navigators
  - UI: React Native Paper (Material Design 3)
  - State Management: Zustand with MMKV persistence for fast, encrypted storage
  - Server State: TanStack Query (React Query) for caching and synchronization

- **Security & Authentication**:
  - Biometric authentication (Face ID/Touch ID/Fingerprint)
  - Secure credential storage with Keychain
  - JWT token management with automatic refresh
  - Encrypted storage using MMKV
  - Session management with background refresh

- **SDK Architecture**:
  - Custom Mobile SDK for backend operations
  - Service-oriented architecture with dependency injection
  - Adapter pattern for platform-specific implementations
  - Token management with refresh service
  - Network monitoring and offline support

**Technical Innovations**:
- **Dependency Injection System**: Custom DI container for service management
- **Biometric Security**: Integrated biometric authentication with fallback options
- **Offline-First Architecture**: MMKV for fast local storage with background sync
- **Type-Safe API Layer**: Zod validation with TypeScript interfaces
- **Modular Service Layer**: Separated concerns for auth, storage, network, and SDK

### 3. Project Suite Claude Skills - AI-Powered Development Automation

**Overview**: Production-ready Claude Code skills for automated project management, including TODO analysis, feature extraction, production verification, and GitHub issue creation.

**Technical Architecture**:
- **Three Integrated Skills**:
  1. **Project Analyzer**: TODO scanning, completion detection, design analysis, production verification
  2. **Project Manager**: GitHub issue creation, visual testing, screenshot capture, reporting
  3. **Project Planner**: Feature discovery from code, roadmap generation, dependency tracking

- **Tech Stack**:
  - Core: Node.js with TypeScript
  - Browser Automation: Playwright for visual testing and web analysis
  - GitHub Integration: Octokit for issue management
  - CLI: Commander.js for command-line interface
  - Testing: Comprehensive test suite (90/90 tests passing)

**Technical Innovations**:
- **3-Tier Production Verification**: URL validation, functionality testing, API verification
- **SHA256 Deduplication**: Prevents duplicate GitHub issues
- **Confidence Scoring**: 90%+ accuracy in detecting completed TODOs
- **Visual Regression Testing**: Multi-viewport screenshots with before/after comparison
- **Code Discovery Engine**: Analyzes React Router, Express endpoints, component structures

**Performance Metrics**:
- Code scanning: ~1000 files/second
- TODO detection: ~100 items/second
- Website analysis: 2-5 seconds per page
- Feature extraction: ~500 files/second

### 4. Post Pal - AI-Powered Post-Procedure Recovery Platform

**Overview**: Comprehensive post-procedure recovery platform consisting of both web application and mobile app, transforming complex discharge instructions into intuitive, timeline-based care plans with AI-powered personalization.

**A. Web Application & API (codymd-hacknback-main)**

**Technical Architecture**:
- **Frontend Stack**:
  - Framework: Next.js 14.2.15 with App Router architecture
  - UI Library: React 18.3 with TypeScript 5.6
  - Styling: Tailwind CSS 3.4 with shadcn/ui components
  - State Management: Zustand 5.0 with localStorage/sessionStorage persistence
  - Data Fetching: SWR 2.3 for server state synchronization
  - Charts: Chart.js 4.5 with react-chartjs-2

- **Backend Stack**:
  - Database: PostgreSQL with Prisma ORM 6.13
  - Cloud Database: Supabase (managed PostgreSQL)
  - Authentication: NextAuth.js 4.24 with JWT tokens
  - Email: SendGrid for transactional emails
  - Push Notifications: Firebase Cloud Messaging
  - File Storage: Firebase Storage for PDFs and uploads

- **AI Integration**:
  - PDF Processing: Hybrid approach using Mistral AI for OCR
  - Content Extraction: Claude for analyzing medical instructions
  - Task Generation: AI-powered conversion of instructions to actionable tasks
  - Personalization: Context-aware recommendations based on procedure type

- **Security Features**:
  - Password hashing with bcryptjs
  - JWT token management with jose library
  - Session management with secure cookies
  - Role-based access control (PATIENT, PROVIDER, ADMIN)
  - HIPAA-compliant data handling

**Technical Innovations**:
- **Provider-Initiated Onboarding**: QR code/URL-based patient registration with pre-filled data
- **Hybrid Memory System**: Combines human documentation with automated context management
- **Smart Task Scheduling**: AI-powered task generation based on procedure type and recovery timeline
- **Real-time Progress Tracking**: Live updates with milestone achievements and streak tracking
- **Multi-Channel Notifications**: In-app, email, SMS, and push notification support

**Database Architecture** (Prisma/PostgreSQL):
- 30+ models including User, Task, Procedure, Provider, Doctor
- Comprehensive audit logging and activity tracking
- Scheduled notification system with template management
- Patient invite system with secure token-based authentication
- PDF upload processing with extracted task storage

**API Endpoints**:
- Authentication: `/api/auth/*` (signup, login, reset password)
- User Management: `/api/user/*` (profile, preferences)
- Tasks: `/api/tasks/*` (CRUD, bulk operations, completion tracking)
- Procedures: `/api/procedures/*` (templates, schedules)
- Notifications: `/api/notifications/*` (13 endpoints for comprehensive notification management)
- Provider Portal: `/api/providers/*`, `/api/doctors/*`
- Admin: `/api/admin/*` (10 endpoints for system management)

**B. Mobile Application (care-tracker-mobile)**

**Technical Architecture**:
- Framework: React Native 0.81.4 with TypeScript 5.8
- Navigation: React Navigation v7 with stack and tab navigators
- UI: React Native Paper (Material Design 3)
- State Management: Zustand with MMKV persistence
- Server State: TanStack Query for caching and synchronization
- Security: Biometric authentication, encrypted storage, secure key management

**Technical Innovations**:
- Custom Mobile SDK with dependency injection architecture
- Offline-first with MMKV for fast local storage
- Biometric authentication with fallback options
- Type-safe API layer with Zod validation

**Performance Metrics**:
- Web app loads in < 2 seconds
- Mobile app cold start: < 3 seconds
- Task sync: Real-time with optimistic updates
- PDF processing: 5-30 seconds depending on complexity
- Database queries optimized with proper indexing

### 5. Portfolio Website with AI Chatbot

**Overview**: Personal portfolio site with integrated AI chatbot that can answer questions about Michael's experience, projects, and expertise.

**Technical Architecture**:
- **Frontend**: Next.js 15.5 with React 18.3 and TypeScript
- **CMS**: Sanity with real-time content sync to vector database
- **AI Chatbot**:
  - RAG (Retrieval-Augmented Generation) using Claude Haiku
  - Vector database (Supabase) for semantic search
  - Query preprocessing with entity extraction and expansion
  - Hybrid search combining vector similarity and keyword matching
  - Re-ranking algorithms for relevance scoring

**Technical Innovations**:
- **Content Pipeline**: Automated sync from Sanity CMS to vector database via webhooks
- **Query Optimization**: Custom preprocessor for entity recognition and query expansion
- **Dual Content System**: Parallel ingestion from CMS and transcript files
- **Smart System Prompts**: Context-aware responses with partial information handling

## Technical Expertise Demonstrated

### AI & Machine Learning
- **Multi-Model Orchestration**: Combining GPT-4 and Claude-3 for different strengths
- **RAG Implementation**: Built custom retrieval-augmented generation systems
- **Vector Databases**: Semantic search with Supabase and pgvector
- **Prompt Engineering**: Sophisticated system prompts for context-aware responses
- **Real-time Streaming**: Server-Sent Events for live AI responses

### Mobile Development
- **React Native**: Cross-platform mobile apps with native performance
- **Security**: Biometric authentication, encrypted storage, secure key management
- **State Management**: Zustand with persistence, React Query for server state
- **Offline Support**: MMKV for fast local storage with background sync
- **SDK Development**: Custom mobile SDKs with dependency injection

### Full-Stack Development
- **Modern Frameworks**: Next.js, React Native, Node.js, TypeScript
- **API Design**: RESTful APIs, real-time streaming, webhook integration
- **Database**: PostgreSQL, vector databases, content management systems
- **DevOps**: Vercel deployments, GitHub Actions, automated testing

### Developer Tools & Automation
- **Claude Code Skills**: Building AI-powered developer productivity tools
- **Browser Automation**: Playwright for testing and web scraping
- **CLI Tools**: Command-line interfaces with Commander.js
- **GitHub Integration**: Automated issue creation and project management

## Architecture Patterns & Best Practices

### Design Patterns Used
- **Dependency Injection**: Service management in mobile apps
- **Adapter Pattern**: Platform-specific implementations
- **Repository Pattern**: Data access abstraction
- **Observer Pattern**: State management with Zustand
- **Strategy Pattern**: Multiple AI models for different tasks

### Performance Optimizations
- **Parallel Processing**: Concurrent API calls and data processing
- **Caching Strategies**: React Query, MMKV, vector database caching
- **Lazy Loading**: Code splitting and dynamic imports
- **Stream Processing**: Real-time data handling with SSE

### Security Practices
- **Zero Trust**: JWT validation, automatic token refresh
- **Defense in Depth**: Multiple security layers (biometric, encryption, secure storage)
- **Input Validation**: Zod schemas, TypeScript strict mode
- **Error Handling**: Graceful degradation, comprehensive error boundaries

## Innovation & Problem Solving

### Complex Technical Challenges Solved

1. **Multi-Source Research Synthesis**: Built system that intelligently combines web search, content scraping, and AI analysis into coherent research reports

2. **Offline-First Mobile Architecture**: Implemented fast, encrypted local storage with automatic background synchronization

3. **Production Verification System**: Created 3-tier verification system for detecting completed features in production environments

4. **Real-time Content Sync**: Automated pipeline from CMS to vector database with webhook integration

5. **Visual Regression Testing**: Multi-viewport screenshot system with intelligent difference detection

### Technical Innovation Philosophy

Michael's approach to technical architecture emphasizes:
- **AI-First Design**: Every project should leverage AI for enhanced capabilities
- **Developer Experience**: Tools should be intuitive and save time
- **Performance at Scale**: Architecture decisions that scale from prototype to production
- **Security by Default**: Built-in security rather than bolted-on
- **Graceful Degradation**: Systems that fail gracefully and recover automatically

## Current Technical Focus

Michael is currently focused on:
- **AI Agent Development**: Building autonomous agents that can perform complex multi-step tasks
- **Mobile AI Integration**: Bringing AI capabilities to mobile applications
- **Developer Productivity**: Creating tools that accelerate development workflows
- **Healthcare Tech**: Applying AI to improve patient care and recovery

## Technical Leadership & Collaboration

Michael demonstrates technical leadership through:
- **Architecture Design**: Making critical decisions about tech stacks and patterns
- **Code Quality**: Comprehensive testing, TypeScript strict mode, ESLint configuration
- **Documentation**: Clear READMEs, inline documentation, architecture guides
- **Open Source**: Contributing tools and skills back to the developer community

## Additional Projects & Technical Exploration

### 6. Opal Creek - NetSuite ERP Consulting Website

**Overview**: Professional consulting website for NetSuite ERP services, built with modern web technologies and headless CMS.

**Technical Stack**:
- Framework: Vite + React 18 + TypeScript
- CMS: Sanity v4 (headless CMS)
- Styling: Tailwind CSS + shadcn/ui components
- Data Fetching: TanStack Query (React Query)
- Routing: React Router v6
- Hosting: Vercel with analytics

**Security Features**:
- Comprehensive Content Security Policy (CSP)
- Security headers (HSTS, X-Frame-Options, etc.)
- Token rotation procedures
- Pre-commit hooks for secret protection

### 7. DungeonTracker - D&D Campaign Management

**Overview**: Full-stack application for managing Dungeons & Dragons campaigns with character tracking and game management.

**Technical Stack**:
- Backend: Express.js with TypeScript
- Database: Drizzle ORM with Neon (PostgreSQL)
- Frontend: Vite build system
- Deployment: Vercel serverless functions

### 8. PostOp PDF Collector - Medical Document Analysis

**Overview**: Python package for automated collection and analysis of post-operative instruction PDFs from medical sources.

**Technical Features**:
- Automated PDF discovery and web crawling
- Multiple text extraction methods (pdfplumber, PyPDF2, OCR)
- Content relevance scoring with AI analysis
- Procedure type classification
- Medication instruction parsing
- Docker containerization for deployment

### 9. Karunagatton.com - Business Website

**Overview**: Professional website built with Next.js for business services.

**Technical Stack**:
- Framework: Next.js with TypeScript
- Styling: Tailwind CSS
- Security auditing and optimization
- Performance optimizations for Core Web Vitals

### 10. DOA Set Construction - Film Industry Website

**Overview**: High-performance website for film and TV set construction company.

**Technical Stack**:
- Framework: Next.js with TypeScript
- CMS: Sanity for content management
- Testing: Jest, Playwright for E2E
- Custom image loading optimization
- Component consolidation architecture

### 11. Hybrid Memory Bank Plugin - Claude Code Extension

**Overview**: Plugin for Claude Code that implements a hybrid memory system combining automated JSON storage with human documentation.

**Technical Innovation**:
- Dual-memory architecture (automated vs manual)
- Session state management
- Context preservation across conversations
- Git-tracked documentation system

## Conclusion

Michael Evans' technical portfolio demonstrates mastery of modern AI integration, full-stack development, and developer tool creation. His projects show a consistent pattern of solving complex problems with innovative technical solutions, always with a focus on user experience and developer productivity. The combination of AI expertise, mobile development skills, and automation tooling positions him uniquely in the intersection of AI and practical software development.