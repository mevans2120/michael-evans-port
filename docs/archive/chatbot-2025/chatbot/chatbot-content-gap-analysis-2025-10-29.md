# Chatbot Content Gap Analysis & Model Recommendations
**Date**: October 29, 2025
**Purpose**: Identify genuine content gaps vs retrieval issues, and recommend solutions

## Executive Summary

The chatbot has a **mixed problem**:
1. **Retrieval Issues (60%)**: Information exists but isn't being retrieved consistently
2. **Content Gaps (40%)**: Some information genuinely missing from transcripts

Current configuration uses **Haiku 4.5** with aggressive retrieval (20 results, 0.3 similarity threshold). Upgrading to **Sonnet 4.5** could significantly improve response quality.

## Content Analysis

### ✅ SHOULD BE ANSWERABLE (Information exists in vector DB)

These questions failed but the information IS in the transcripts:

#### Background & Education
1. **Q1: "Where did Michael Evans grow up?"**
   - **In DB**: "I grew up in Eugene, Oregon" (chatbot-questionnaire_Answers_1.md:5)
   - **Problem**: Direct question fails, but broader questions succeed
   - **Type**: RETRIEVAL ISSUE

2. **Q2: "What did Michael study in college?"**
   - **In DB**: "University of Colorado in Boulder and studied English and political science" (chatbot-questionnaire_Answers_1.md:21)
   - **Problem**: Same info appears in Q1's response but not Q2
   - **Type**: RETRIEVAL ISSUE

3. **Q3: "How did Michael get into technology?"**
   - **In DB**: Mac Plus story, learned Basic/Pascal in middle school (Transcript_1_Raw.txt)
   - **Problem**: Not retrieving early tech exposure content
   - **Type**: RETRIEVAL ISSUE

#### Career Journey
4. **Q7: "What was Michael's first job in tech?"**
   - **In DB**: "data entry at Semantec... promoted to data analyst" (chatbot-questionnaire_Answers_1.md:37)
   - **Problem**: Clear answer exists but not retrieved
   - **Type**: RETRIEVAL ISSUE

#### Projects
5. **Q17: "What did Michael build for HBO?"**
   - **In DB**: "HBO Go (Canadian version for Astral)" (chatbot-questionnaire_Answers_1.md:75)
   - **Problem**: Project mentioned but not retrieved
   - **Type**: RETRIEVAL ISSUE

6. **Q18: "Describe the Lyft project"**
   - **In DB**: Listed as project in Portland (chatbot-questionnaire_Answers_1.md:112)
   - **Problem**: Minimal detail, but it IS mentioned
   - **Type**: PARTIAL CONTENT (needs more detail)

7. **Q29: "Tell me about Michael opening the Portland office"**
   - **In DB**: "opened the Work & Co Portland office with Joe Stewart" (chatbot-questionnaire_Answers_1.md:105)
   - **Problem**: Information exists but not retrieved
   - **Type**: RETRIEVAL ISSUE

### ❌ GENUINE CONTENT GAPS (Need recording)

These questions genuinely lack sufficient information:

1. **Q10: "When did Michael become interested in AI?"**
   - Missing: Specific timeline/trigger for AI interest
   - Suggested content: Story about when/why AI became focus

2. **Q24: "What AI projects has Michael built recently?"**
   - Have: PostPal mentioned in Transcript v2
   - Missing: Other recent AI projects, specific details
   - Suggested content: List recent AI projects with descriptions

3. **Q18: "Lyft project details"**
   - Have: Brief mention it happened
   - Missing: What was built, challenges, outcomes
   - Suggested content: Project specifics

4. **SE-0: "What is Michael working on now?"**
   - Have: PostPal and consulting (Transcript v2)
   - Missing: More current/detailed information
   - Suggested content: Current focus areas, active projects

5. **Casa Bonita membership capacity**
   - Missing: Specific numbers about system capacity
   - Suggested content: Technical specifications

## Root Cause Analysis

### 1. Semantic Search Limitations
- Direct questions ("Where did you grow up?") retrieve poorly
- Broader questions ("Tell me about early exposure") retrieve better
- Suggests embedding model may not handle direct vs contextual phrasing well

### 2. Current Settings Analysis
```typescript
// Current configuration
model: anthropic('claude-haiku-4-5-20251001')
top_k: 20  // Very high - getting lots of context
similarity_threshold: 0.3  // Very low - accepting everything
temperature: 0.8  // Fairly high for synthesis
```

### 3. Model Comparison

| Aspect | Haiku 4.5 (Current) | Sonnet 4.5 (Proposed) |
|--------|---------------------|----------------------|
| **Cost** | ~$0.25/1M tokens | ~$3/1M tokens (12x more) |
| **Speed** | Fast (<3s typical) | Moderate (3-5s typical) |
| **Context Understanding** | Good | Excellent |
| **Synthesis Quality** | Good | Superior |
| **Handling Ambiguity** | Moderate | Excellent |
| **Per test run cost** | ~$0.02 | ~$0.25 |

## Recommendations

### Immediate Actions

#### 1. Try Sonnet 4.5 First
Sonnet would likely solve many retrieval issues through better context understanding:

```typescript
// Proposed change in route.ts
model: anthropic('claude-sonnet-4-5-20251029'),  // Upgrade model
temperature: 0.6,  // Lower for more consistent retrieval
```

**Benefits**:
- Better at finding relevant info even with poor semantic matches
- Superior at synthesizing disparate information
- More intelligent about inferring from partial context

**Tradeoffs**:
- 12x more expensive (still reasonable for production)
- Slightly slower responses (still under 5s target)

#### 2. Adjust Retrieval Parameters
```typescript
const relevantDocs = await searchSimilarDocuments(
  queryEmbedding,
  30,  // Increase from 20 to 30 for Sonnet's superior context handling
  0.25 // Slightly tighter threshold since Sonnet handles context better
);
```

### Content Recording Priorities

For your recording session, focus on filling these gaps:

#### HIGH PRIORITY (Most asked, no content):
1. **Current work/activities** - What you're working on now beyond PostPal
2. **Recent AI projects** - Specific recent AI work with details
3. **AI interest origin** - When/why you got interested in AI
4. **First tech job details** - Expand on Semantec → consultant transition

#### MEDIUM PRIORITY (Some content, needs depth):
5. **Lyft project** - What you built, challenges faced
6. **HBO project** - More details beyond "HBO Go"
7. **Portland office** - Story of opening it, what you built there

#### LOW PRIORITY (Nice to have):
8. **Casa Bonita capacity** - Technical specs if you remember
9. **Current AI philosophy** - Your evolved approach to AI development
10. **Specific project metrics** - Numbers, conversion rates, user counts

### Testing Approach

1. **First**: Try Sonnet 4.5 with current content
   - Could solve 60-70% of issues immediately
   - Run same test suite to compare

2. **Then**: Record new content for genuine gaps
   - Focus on HIGH PRIORITY items above
   - Use conversational style that matches existing transcripts

3. **Finally**: Re-test with Sonnet + new content
   - Should achieve >90% success rate

## Cost Analysis

### Current (Haiku 4.5)
- Per query: ~$0.0004
- 1000 queries/day: ~$0.40/day
- Monthly: ~$12

### Proposed (Sonnet 4.5)
- Per query: ~$0.005
- 1000 queries/day: ~$5/day
- Monthly: ~$150

**Verdict**: Sonnet is very affordable for the quality improvement.

## Conclusion

The chatbot's issues are **primarily retrieval-based, not content-based**. Information about Eugene, University of Colorado, HBO, Portland office, etc. EXISTS but isn't being retrieved consistently.

### Recommended Approach:
1. **Immediate**: Switch to Sonnet 4.5 - likely solves most issues
2. **Next Session**: Record content for genuine gaps (current work, recent AI, origin story)
3. **Optional**: Fine-tune retrieval parameters after testing Sonnet

Sonnet's superior context understanding and synthesis abilities should dramatically improve the chatbot's ability to answer questions even when semantic search isn't perfect. The 12x cost increase is negligible at your scale (~$150/month vs ~$12/month).