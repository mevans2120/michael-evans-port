# Chatbot Content Questionnaire Summary

**Last Updated:** October 27, 2025

---

## Overview

You have two complementary questionnaires to improve your chatbot's ability to answer questions:

1. **General Chatbot Questionnaire** (existing) - Covers your background, career, and major projects
2. **AI Projects Questionnaire** (NEW) - Deep dive into your AI/ML technical projects and GitHub repos

---

## Current Status

### ✅ What You've Already Completed

**From `chatbot-questionnaire_Answers_1.md` & `chatbot-questionnaire_Answers_2.md`:**
- ✅ Early education and background (Eugene, OR, hippie upbringing, purple house!)
- ✅ First love of technology (Mac Plus, BBSs, HyperCard)
- ✅ College years (University of Colorado, University of Sussex AI friend)
- ✅ Complete career timeline from data entry to Work & Co to Beforelab
- ✅ Detailed stories about:
  - Broadway.com failure (Django architecture disaster)
  - HouseLogic.com (NAR, product-market fit)
  - Target (strategy, "Future of Retail", QR codes)
  - Virgin America (first responsive airline site, ~20 awards)
  - Work & Co Portland (opening the office, leadership)
  - Before Launcher (awards, business model challenges)
  - Casa Bonita (mentioned but not detailed yet)
- ✅ Technologies you've worked with (and ones you didn't like - Drupal!)
- ✅ "Oh shit" moment with AI (March 2024, D&D app in an hour)
- ✅ AI Research Project summary (13 interviews, "vibe coding", findings)

**Supporting Documents:**
- ✅ Resume (Michael_Evans_Resume_8_2025.pdf)
- ✅ AI Research Summary (comprehensive)
- ✅ CHATBOT-SETUP-GUIDE.md
- ✅ Full chatbot infrastructure (built and ready)

### 🎯 What's Still Needed for General Chatbot

**From `NEXT-QUESTIONS-TO-ANSWER.md`:**

**Priority 1 (Must Have - ~60 minutes):**
1. Current work status (3 questions, 5 min)
   - What are you doing NOW professionally?
   - What types of work are you interested in?
   - What are you NOT interested in?

2. Casa Bonita deep dive (10-15 min)
   - Full technical details
   - 250k club signups story
   - Architecture decisions
   - Metrics and impact

3. Example Q&A pairs in your voice (20 min)
   - "Who is Michael Evans?"
   - "What do you do?"
   - "Are you available for work?"
   - "What's your experience with AI?"
   - Plus edge case handling

**Priority 2 (Nice to Have - ~40 minutes):**
4. Before Launcher deep dive
5. 1-2 more project deep dives (Peddle, Target eCommerce)
6. Chatbot personality guide

---

## 🆕 What I Just Created: AI Projects Questionnaire

**File:** `ai-projects-questionnaire.md`

**Purpose:** Specifically covers your AI/ML projects so the chatbot can answer detailed technical questions about your GitHub repos and AI work.

### Projects It Covers:

Based on your GitHub (github.com/mevans2120):
- Claude Skills Suites (design, dev, project)
- Hybrid Memory Bank Plugin
- PostPal (AI social media assistant)
- Post-op PDF Collector
- Research Agent
- Spotify Song Logger (if ML components)
- Any other AI projects

### What It Asks (Per Project):

**Section 1: Project Overview**
- What is it? What problem does it solve?
- Who's it for? Current status?
- Why did you build it?

**Section 2: Technical Implementation**
- Complete tech stack
- Architecture and data flow
- AI/ML models used (specific versions)
- Hardest technical challenges
- Trade-offs made

**Section 3: AI/ML Specifics**
- Model selection and why
- Prompt engineering (show actual prompts!)
- Data and context handling
- Embeddings/vector search
- Quality testing approach

**Section 4: Results & Impact**
- Key metrics
- User feedback
- What's working well
- Known limitations

**Section 5: Learnings**
- Technical insights
- What you'd do differently
- Advice for others
- AI product design philosophy

**Section 6: Project-Specific Deep Dives**
- Custom questions for Claude Skills
- Custom questions for Hybrid Memory Bank
- Custom questions for PostPal
- Custom questions for Post-op PDF Collector
- Custom questions for Research Agent

**Sections 7-10:**
- Portfolio integration questions
- Code examples & demos
- Comparative analysis
- Future vision

---

## How They Work Together

### General Chatbot Questionnaire → Professional Story
Answers questions like:
- "Tell me about Michael's background"
- "What's Michael's experience with Virgin America?"
- "How did Michael get into AI?"
- "What companies has Michael worked for?"

### AI Projects Questionnaire → Technical Deep Dives
Answers questions like:
- "Tell me about the Claude Skills project"
- "How does the Hybrid Memory Bank work?"
- "What AI models does Michael use?"
- "Show me code examples from Michael's projects"
- "What's the difference between design-suite and dev-suite?"
- "How much does it cost to build a RAG system?"

---

## Recommended Next Steps

### Option 1: Complete General Chatbot First (Recommended)
**Time:** ~60-90 minutes
**Why:** Gets your chatbot working well for professional background questions

1. Record answers to "Current State" questions (5 min)
2. Do Casa Bonita deep dive (15 min)
3. Record Example Q&A pairs (20 min)
4. Test chatbot with these additions
5. **THEN** move to AI Projects questionnaire

### Option 2: Focus on AI Projects (If Time is Limited)
**Time:** ~90-120 minutes total
**Why:** If your main goal is answering AI project questions

Priority order:
1. Claude Skills Suites (30 min) - Most unique
2. Hybrid Memory Bank (20 min) - Shows deep understanding
3. PostPal (20 min) - Commercial product
4. Research Agent (15 min)
5. Post-op PDF Collector (15 min)

### Option 3: Do Everything (Best Results)
**Time:** ~3-4 hours total
**Result:** Comprehensive chatbot that can answer almost any question

1. Complete general chatbot (60 min)
2. Do top 3 AI projects in detail (70 min)
3. Do remaining AI projects (60 min)
4. Test and refine (30 min)

---

## How to Use These Questionnaires

### For Voice Recordings:

**File naming:**
```
General Chatbot:
- chatbot-questionnaire_Answers_3.md (Current state + Casa Bonita)
- chatbot-questionnaire_Answers_4.md (Q&A pairs + personality)

AI Projects:
- ai-projects-claude-skills.m4a + .md transcript
- ai-projects-hybrid-memory.m4a + .md transcript
- ai-projects-postpal.m4a + .md transcript
- ai-projects-research-agent.m4a + .md transcript
```

### For Written Responses:

**Create files in:**
```
/docs/research/research-batch-1-102525/ai-projects/
├── claude-skills-suites.md
├── hybrid-memory-bank.md
├── postpal.md
├── postop-pdf-collector.md
├── research-agent.md
└── code-examples/
    ├── claude-skills-snippet.ts
    ├── postpal-prompts.md
    └── architecture-diagrams/
```

---

## Expected Results

### After Completing General Questionnaire Gaps:
Your chatbot will be able to:
- ✅ Explain your current availability and interests
- ✅ Tell the Casa Bonita story with metrics
- ✅ Answer "Are you available?" questions
- ✅ Handle edge cases gracefully
- ✅ Sound like you (tone and personality)

### After Completing AI Projects Questionnaire:
Your chatbot will be able to:
- ✅ Explain each AI project in detail
- ✅ Show technical architecture and code examples
- ✅ Compare different projects ("Which Claude skill should I use?")
- ✅ Answer technical questions ("How does RAG work?")
- ✅ Discuss specific AI models and why you chose them
- ✅ Provide cost and timeline estimates for AI projects
- ✅ Reference your GitHub repos accurately

---

## Files You Now Have

### Questionnaires:
1. `/docs/research/research-batch-1-102525/chatbot-content-questionnaire.md` (General, original)
2. `/docs/research/research-batch-1-102525/NEXT-QUESTIONS-TO-ANSWER.md` (What's missing from general)
3. `/docs/research/research-batch-1-102525/ai-projects-questionnaire.md` (NEW - AI projects)

### Your Answers So Far:
1. `/docs/research/research-batch-1-102525/source-materials/transcripts/chatbot-questionnaire_Answers_1.md`
2. `/docs/research/research-batch-1-102525/source-materials/transcripts/chatbot-questionnaire_Answers_2.md`
3. `/docs/research/research-batch-1-102525/source-materials/transcripts/ai-research-summary.md`

### Supporting Documentation:
- Resume, AI research, setup guides, test reports

---

## Quick Decision Guide

**"I want my chatbot to handle basic questions ASAP"**
→ Follow `NEXT-QUESTIONS-TO-ANSWER.md` first (60 min)

**"I want my chatbot to explain my AI projects"**
→ Use new `ai-projects-questionnaire.md` (2-3 hours)

**"I want the best possible chatbot"**
→ Do both (3-4 hours total)

**"I'm overwhelmed, what's the absolute minimum?"**
→ Just do:
1. Current state (5 min)
2. Casa Bonita (15 min)
3. Top 2 AI projects (40 min)
**Total: 60 minutes**

---

## Questions?

The AI Projects Questionnaire is comprehensive because it needs to cover:
- Multiple complex projects
- Deep technical details
- Code examples
- Architecture decisions
- Comparative analysis

Don't feel like you need to answer everything at once. Even covering your top 2-3 AI projects in detail will dramatically improve your chatbot's ability to discuss your technical work.

**Remember:** The chatbot can only answer questions about what it knows. The more detailed your answers, the better it can represent you!

---

**Next:** Choose your approach above and start recording/writing answers. Even 30-60 minutes of focused content will make a huge difference in chatbot quality.
