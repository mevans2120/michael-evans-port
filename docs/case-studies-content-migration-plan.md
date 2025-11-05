# Case Studies Content Migration Plan
**Date:** November 5, 2025
**Goal:** Transform case study content from multi-slide format to flowing magazine-style articles

---

## Executive Summary

This document outlines the **content strategy** for migrating 7 case studies from the current slide-based format (5-7 sections each) to shorter, more focused flowing articles (1-2 key narratives).

### Current State
- **Format**: Slide-based with 5-7 sections per case study
- **Style**: Comprehensive coverage of multiple aspects
- **Length**: ~1,500-2,500 words per case study (estimated)

### Target State
- **Format**: Single flowing article with inline stat blocks
- **Style**: Magazine editorial focusing on 1-2 key narratives
- **Length**: ~800-1,200 words per case study
- **Stat Blocks**: 3-5 strategic callouts (Big Number, Quote, or Free Text)

---

## Part 1: Content Audit

### Current Case Studies Inventory

From Sanity query, we currently have at least **1 visible case study** (Lyft). Let me audit all projects:

#### Lyft
- **Slides**: 5
- **Metrics**: 6
- **Current Structure**:
  1. The Context → "Joining Lyft Through Virgin America"
  2. Understanding the Two-Sided Marketplace → "The Supply and Demand Problem"
  3. Phase 1 - Website Redesign → "Building a Driver Resource"
  4. Rebuilding the Driver Signup Flow → "From Frankenstein System to Strategic A/B Test"
  5. Results and Impact → "8% Improvement and Strategic Validation"

- **Content Type**: Primarily text-based narrative (no quotes, comparisons, or visual cards used)
- **Metrics**: 6 key achievements
- **Assessment**: Strong narrative but could be condensed to focus on 1-2 key wins

#### Recommended Audit for All Projects

Run this query to get full inventory:
```groq
*[_type == "project" && category == "case-study"] | order(order asc) {
  _id,
  title,
  "slideCount": count(slides),
  "metricCount": count(metrics),
  "wordCount": length(string::join(slides[].content[].children[].text, " ")),
  slides[]{
    sectionLabel,
    heading,
    "contentLength": length(string::join(content[].children[].text, " "))
  }
}
```

---

## Part 2: Content Rewriting Questionnaire

Use this questionnaire to guide the rewriting of each case study into a flowing article.

### Section A: Core Narrative

**1. What is the ONE most important story to tell about this project?**
   - [ ] The business impact (revenue, conversion, engagement)
   - [ ] The technical innovation (new approach, architecture, solution)
   - [ ] The user experience transformation (before/after user journey)
   - [ ] The organizational change (process improvement, team collaboration)

**2. What is the SINGLE metric or outcome that best proves success?**
   - Example: "8% conversion increase", "2x engagement", "$5M revenue impact"
   - _Write it here:_ _______________

**3. If you could only tell one "before → after" story, what would it be?**
   - Before: _______________
   - After: _______________
   - Why it mattered: _______________

### Section B: Supporting Details

**4. What 2-3 specific details make this story unique?**
   1. _______________
   2. _______________
   3. _______________

**5. Is there a memorable quote from a stakeholder, user, or team member?**
   - [ ] Yes → _______________ (Attribution: _______________)
   - [ ] No → Consider adding one during rewrite

**6. Which visual/technical detail would help readers understand the solution?**
   - [ ] Before/after screenshots
   - [ ] System architecture diagram
   - [ ] User flow illustration
   - [ ] Data visualization
   - [ ] Code example
   - [ ] Other: _______________

### Section C: Stat Block Strategy

**7. Where would inline stat blocks add impact? (Choose 3-5 moments)**

For each stat block, identify:
- **Location in narrative** (beginning/middle/end)
- **Type** (Big Number, Quote, or Free Text)
- **Content** (what it says)

Example:
```
Location: Middle (after describing the problem)
Type: Big Number
Content: "15 different systems" + "Legacy signup flow complexity"

Location: End (results section)
Type: Big Number
Content: "8%" + "Conversion improvement"
```

Your selections:
1. Location: _______ | Type: _______ | Content: _______
2. Location: _______ | Type: _______ | Content: _______
3. Location: _______ | Type: _______ | Content: _______
4. Location: _______ | Type: _______ | Content: _______
5. Location: _______ | Type: _______ | Content: _______

---

## Part 3: Rewriting Guidelines

### Content Structure

```
HERO SECTION (existing)
├─ Badge: "Case Study"
├─ Title: "Project Name"
├─ Subtitle: One-sentence value prop
└─ Summary: 2-3 sentence overview

FLOWING ARTICLE
├─ Opening Hook (1-2 paragraphs)
│  └─ Set context, introduce the challenge
│
├─ The Core Story (3-5 paragraphs)
│  ├─ What was the problem?
│  ├─ [STAT BLOCK 1] ← Quantify the problem
│  ├─ What did you do? (solution approach)
│  ├─ [STAT BLOCK 2] ← Key insight or quote
│  └─ How did it work? (implementation highlights)
│
└─ Impact & Results (2-3 paragraphs)
   ├─ What changed?
   ├─ [STAT BLOCK 3-5] ← Results metrics
   └─ Why it mattered (broader implications)
```

### Writing Style

**DO:**
- ✅ Lead with the most interesting/important point
- ✅ Use specific numbers and metrics
- ✅ Show before/after transformations
- ✅ Include one memorable detail that makes it real
- ✅ Write in active voice ("We redesigned..." not "The design was...")

**DON'T:**
- ❌ Chronological storytelling ("First we did X, then Y, then Z...")
- ❌ List every task or feature
- ❌ Use jargon without explaining it
- ❌ Save the punchline for the end
- ❌ Include details that don't support the core narrative

### Paragraph Guidelines

- **Opening paragraph**: 3-4 sentences, hook + context
- **Body paragraphs**: 4-6 sentences, one idea per paragraph
- **Transition phrases**: Use sparingly (the narrative should flow naturally)
- **Length target**: 800-1,200 words total (vs current 1,500-2,500)

---

## Part 4: Example Rewrite

### BEFORE (Slide-Based - Lyft Example)

**Slide 1**: The Context
"Joining Lyft Through Virgin America..."
[Full paragraph about joining Lyft, context about Virgin America acquisition, marketplace dynamics... 200+ words]

**Slide 2**: Understanding the Two-Sided Marketplace
"The Supply and Demand Problem..."
[Detailed explanation of marketplace theory, driver supply challenges... 250+ words]

**Slide 3**: Phase 1 - Website Redesign
"Building a Driver Resource..."
[Website content strategy details, localization approach... 200+ words]

**Slide 4**: Rebuilding the Driver Signup Flow
"From Frankenstein System to Strategic A/B Test..."
[Technical details about legacy system, rebuild approach... 300+ words]

**Slide 5**: Results and Impact
"8% Improvement and Strategic Validation..."
[Results breakdown, learnings, next steps... 150+ words]

**Total**: ~1,100+ words across 5 slides

---

### AFTER (Flowing Article - Rewritten)

When Lyft acquired Virgin America's design team, they inherited a driver acquisition problem: a signup flow built from 15 different legacy systems that confused drivers and cost conversions. The challenge wasn't just technical—it was strategic. How do you rebuild a critical flow while proving the value of design-driven optimization?

**[STAT BLOCK: Big Number]**
**15**
Legacy systems powering the driver signup flow

The root issue was simple but painful. Lyft's growth depended on driver supply, but their website and signup experience hadn't evolved with the business. Drivers landing on lyft.com found generic marketing copy instead of answers to their questions: "How much will I make?" "What do I need to start?" "Is this available in my city?"

I led a two-phase transformation. First, we rebuilt lyft.com as a driver resource, creating localized content for each city and state-specific licensing requirements. This wasn't just better UX—it was strategic positioning for multi-state expansion.

**[STAT BLOCK: Quote]**
"We needed to prove that design could move metrics, not just make things look better."

The second phase tackled the signup flow itself. Rather than incrementally improving the Frankenstein system, we built a completely new flow and ran it as an A/B test against the legacy experience. This approach gave us two wins: a better product *and* data to validate design's business impact.

**[STAT BLOCK: Big Number]**
**8%**
Conversion improvement from redesigned signup flow

The results proved the approach. An 8% lift in conversion meant thousands of new drivers—but more importantly, it established a framework for data-driven design decisions across the organization.

**Total**: ~290 words (73% reduction, same impact)

---

## Part 5: Migration Workflow

### Step 1: Content Preparation (Per Case Study)

1. **Export current content** from Sanity Studio
2. **Complete questionnaire** (Section A-C above)
3. **Draft new flowing article** following guidelines
4. **Identify 3-5 stat block locations** and content
5. **Review against checklist**:
   - [ ] Focuses on 1-2 core narratives?
   - [ ] Under 1,200 words?
   - [ ] Includes specific metrics?
   - [ ] Has clear before/after?
   - [ ] Stat blocks add impact (not just decoration)?

### Step 2: Content Entry (Post-Development)

Once the new schema is live:

1. **Create new article field** with flowing content
2. **Insert stat blocks inline** as you write
3. **Add supporting media** (images, videos, code blocks)
4. **Preview and refine** pacing and flow
5. **Publish and test** on live site

### Step 3: Quality Checklist

Before publishing each migrated case study:

- [ ] **Readability**: Can you understand the story in 2 minutes?
- [ ] **Impact**: Are metrics and outcomes clear?
- [ ] **Flow**: Does it read like a magazine article?
- [ ] **Stat blocks**: Do they enhance (not interrupt) the narrative?
- [ ] **Media**: Are images/videos necessary and well-placed?
- [ ] **Mobile**: Does it work on small screens?
- [ ] **SEO**: Does it have meta description, keywords, social image?

---

## Part 6: Prioritization & Timeline

### Content Rewriting Order

**Tier 1: Priority Projects** (Rewrite first)
1. Lyft (already partially analyzed)
2. [Next most important case study]
3. [Third most important]

**Tier 2: Secondary Projects** (Rewrite after design/dev is ready)
4-7. Remaining case studies

### Estimated Timeline

| Task | Time per Case Study | Total (7 studies) |
|------|---------------------|-------------------|
| Complete questionnaire | 15-20 min | ~2 hours |
| Draft new article | 30-45 min | ~4.5 hours |
| Identify stat blocks | 10-15 min | ~1.5 hours |
| Revise and refine | 20-30 min | ~3 hours |
| **Total writing time** | **~90 min** | **~11 hours** |

**Recommendation**: Rewrite 1-2 case studies first as prototypes, get feedback, then batch the rest.

---

## Part 7: Success Metrics

How will we know the content migration succeeded?

### Quantitative Metrics
- **Reading time**: Average time on page (target: 2-4 minutes)
- **Scroll depth**: % of users reaching end (target: 60%+)
- **Bounce rate**: % leaving immediately (target: <40%)
- **Conversion**: Contact form submissions from case studies (track before/after)

### Qualitative Metrics
- **Clarity**: Can readers summarize the project in one sentence?
- **Impact**: Do the metrics feel credible and meaningful?
- **Engagement**: Are readers sharing or discussing the work?

---

## Part 8: Content Maintenance

### Ongoing Updates

**Quarterly Review** (every 3 months):
- Review analytics (reading time, scroll depth, bounce rate)
- Update any outdated metrics or outcomes
- Refresh screenshots if product has changed
- Consider adding new stat blocks if new data available

**Annual Refresh** (once per year):
- Fully rewrite underperforming case studies
- Remove case studies that are no longer relevant
- Add new case studies for recent work

---

## Appendix A: Stat Block Content Guidelines

### Type 1: Big Number

**Purpose**: Emphasize quantitative impact
**Format**:
```
[LARGE NUMBER]
[Short label/context]
```

**Examples**:
- "8% | Conversion improvement"
- "15 | Legacy systems consolidated"
- "2.5M | Drivers onboarded"

**Best Practices**:
- Use when you have a clear, impressive metric
- Keep label under 5 words
- Place at moment of maximum impact in narrative

---

### Type 2: Quote

**Purpose**: Add human perspective or memorable insight
**Format**:
```
"[Quote text, 1-2 sentences]"
[Attribution line]
```

**Examples**:
- "We needed to prove design could move metrics." — On strategic validation
- "Every driver has different questions depending on their city." — User research insight

**Best Practices**:
- Use real quotes when possible (stakeholder, user, team)
- Create synthesized quotes if no real quote exists
- Keep to 1-2 sentences maximum
- Attribution should add context, not just name

---

### Type 3: Free Text

**Purpose**: Provide technical context, methodology, or key insight
**Format**:
```
[Heading - optional]
[2-4 sentences of explanatory text]
```

**Examples**:
```
Why localization mattered
Each state has different driver licensing requirements. By creating state-specific content, we reduced drop-off during the application process and positioned Lyft for faster expansion into new markets.
```

**Best Practices**:
- Use when context is needed but doesn't fit main narrative
- Keep to 2-4 sentences
- Optional heading helps scanning
- Great for "why this approach" explanations

---

## Appendix B: Example Questionnaire (Completed for Lyft)

### Section A: Core Narrative

**1. What is the ONE most important story?**
- ☑ The business impact (8% conversion increase, driver supply growth)

**2. SINGLE metric that proves success?**
- 8% conversion improvement

**3. One "before → after" story?**
- Before: 15 legacy systems, generic website, confused drivers
- After: Unified signup flow, localized content, data-driven validation
- Why it mattered: Proved design could move business metrics

### Section B: Supporting Details

**4. 2-3 unique details:**
1. Rebuilt from scratch rather than incremental improvements
2. Used A/B test to validate new flow against legacy
3. Localized content for multi-state expansion strategy

**5. Memorable quote?**
- ☑ Yes → "We needed to prove that design could move metrics, not just make things look better." (Attribution: On design validation)

**6. Which visual/technical detail?**
- ☑ Before/after screenshots (of signup flow)

### Section C: Stat Block Strategy

1. **Location**: Beginning | **Type**: Big Number | **Content**: "15 legacy systems"
2. **Location**: Middle | **Type**: Quote | **Content**: Design validation quote
3. **Location**: End | **Type**: Big Number | **Content**: "8% conversion improvement"

---

## Next Steps

1. **Review this plan** and approve content strategy
2. **Complete questionnaire** for Tier 1 case studies (Lyft + 2 others)
3. **Draft 1-2 prototype rewrites** to validate approach
4. **Get feedback** on prototype articles
5. **Batch remaining rewrites** once approach is validated
6. **Coordinate with design/dev plan** for implementation

---

**Document Owner**: Claude
**Last Updated**: November 5, 2025
**Status**: Draft for Review
