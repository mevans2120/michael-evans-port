# Content Spec Accuracy Evaluation
**Date:** October 30, 2025
**Purpose:** Compare content specification documents against vector database source materials

## Executive Summary

**🚨 CRITICAL FINDING: The Peddle case study has the wrong company name throughout all materials.**

I evaluated four case study content specs (Before Launcher, Casa Bonita, Peddle, and Target) against their source materials in the vector database. Overall, the content specs are **highly accurate** with excellent fidelity to source transcripts. However, I identified a critical naming error that affects both the content spec and vector database.

**The company name is "Peddle" (not "Pedal")** - this error exists in both the content specification and the vector database source materials, meaning the chatbot is providing information with the incorrect company name.

## Evaluation Method

**Content Specs Evaluated:**
- `/docs/content-specs/before-launcher-case-study.md`
- `/docs/content-specs/casa-bonita-case-study.md`
- `/docs/content-specs/pedal-case-study.md` ⚠️ **Should be named `peddle-case-study.md`**
- `/docs/content-specs/target-case-study.md`

**Vector DB Source Materials:**
- `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` (lines 177-228 for Before Launcher, 32-70 for Casa Bonita, 230-253 for Peddle, 255-285 for Target)
- `/public/chatbot-content/transcripts/before-launcher-details.md`

---

## 1. Before Launcher Case Study

### ✅ Accurate Information
- Notification filtering as core feature
- 30-40% reduction in phone opens
- Fast Company Best App of 2019 award
- Android-only platform
- Team composition (Michael, engineer, biz ops person)
- Three-swipe interface design
- App Store Optimization learnings (video doesn't convert, imagery converts, reviews matter)
- Business model challenges and eventual sale to developer
- B2B vs consumer software lessons

### ⚠️ Potential Inaccuracies

**1. Company Name Inconsistency**
- **Content Spec (line 12):** "Company: Beforelab (Startup)"
- **Vector DB:** "Before Labs" (from before-launcher-details.md:5)
- **Issue:** Spec uses "Beforelab" (one word), source says "Before Labs" (two words)
- **Recommendation:** Verify correct company name and standardize

**2. Timeline Discrepancy**
- **Content Spec (line 13):** "Timeline: ~2 years (2017-2019)"
- **Content Spec (line 10):** "Published At: 2019-01-01"
- **Source Material:** Transcript mentions "Won Fast Company's Best App of 2019" but doesn't specify start date or exact timeline
- **Issue:** The 2017 start date and 2-year timeline are not explicitly stated in source materials
- **Recommendation:** Verify the actual start date - this may be inferred but should be confirmed

**3. "Thousands" of Users**
- **Content Spec:** Multiple references to "thousands of people" (lines 26, 42, 63)
- **Vector DB:** "helped thousands of people" (chatbot-questionnaire_Answers_2.md:220, before-launcher-details.md:15, 55, 61)
- **Status:** ✅ Accurate - this is consistently stated in source materials

**4. Metrics in Hero Section**
- **Content Spec (line 41):** "Users Helped: Thousands"
- **Issue:** This is vague. While accurate to source, it could be more specific if data exists
- **Recommendation:** If more specific user numbers are available, use them

---

## 2. Casa Bonita Case Study

### ✅ Accurate Information
- 40,000-person queue managed
- 100% capacity maintained
- 25% increase in covers
- Tech stack (Next.js, Supabase, Vercel)
- Qit queuing system
- OpenTable to SevenRooms migration
- Founders Club support system
- Team composition
- Michael's role as project/product lead and UX designer
- Successful handoff to restaurant team (non-technical)

### ⚠️ Potential Inaccuracies

**1. Timeline Listed as "Ongoing"**
- **Content Spec (line 13):** "Timeline: Ongoing (2023-present)"
- **Vector DB:** No explicit mention of 2023 start date or "ongoing" status
- **Issue:** The 2023 start date and "ongoing" status are not explicitly confirmed in source materials
- **Recommendation:** Verify when the project started and if it's truly ongoing or if Michael's active involvement has concluded

**2. Supabase Scaling Detail**
- **Content Spec (line 160):** "Key Learning: Supabase scales based on the compute power you allocate to it"
- **Vector DB (line 49):** "We learned that Supabase scales via the compute power you give it"
- **Status:** ✅ Accurate - matches source material perfectly

**3. Migration Cost Reflection**
- **Content Spec (lines 236-239):** Claims migration was "costly" and questions if it was the right decision
- **Vector DB (lines 60-62):** "Switching reservation systems from OpenTable to SevenRooms offered a lot of configuration and made some things easier, but it was very costly. I'm not sure if it was the right decision in hindsight."
- **Status:** ✅ Accurate - this matches the source material well

**4. "Comprehensive Support System"**
- **Content Spec:** Describes detailed admin system for Founders Club
- **Vector DB (lines 56-58):** "We built a support system for the Founders Club. This allowed the Casa Bonita team to manage founder data, details, merge founders, create new founders if needed—basically administrate everything for the Founders Club"
- **Status:** ✅ Accurate - though content spec adds more detail than source, it's consistent with what's stated

---

## 3. Peddle Case Study

### 🚨 CRITICAL: INCORRECT COMPANY NAME THROUGHOUT

**THE COMPANY NAME IS "PEDDLE" NOT "PEDAL"**

The case study content is accurate, but **the company name is wrong** throughout all materials. The correct name is "Peddle" but both the content spec and vector database consistently use "Pedal."

### The Problem

**Content Spec Location:** `/docs/content-specs/pedal-case-study.md` (427 lines)
- Filename: `pedal-case-study.md` (should be `peddle-case-study.md`)
- Content Spec Title (line 5): "Pedal - 15% More Cars Bought..." (should be "Peddle")
- Slug (line 6): `pedal` (should be `peddle`)
- Throughout document: "Pedal" appears dozens of times

**Vector DB Location:** `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` (lines 230-253)
- Heading (line 230): "## Pedal.com" (should be "## Peddle.com")
- Subheading (line 232): "### What Pedal Does" (should be "What Peddle Does")
- Throughout section: "Pedal" appears multiple times

### ✅ Accurate Information (aside from name)
- 15% increase in cars purchased
- 5% homepage conversion improvement
- Tech stack (React, Next.js, Sanity)
- Michael's role as data team lead and UX designer
- Snowflake, Snowplow, Google Analytics infrastructure
- Booking flow approach applied to car selling
- First Sanity CMS project for Michael
- Owner's junkyard family background
- "One of the better businesses you just don't care about that much" quote
- Lesson about shipping faster vs waiting for perfection
- Joined project halfway through

### Impact

1. **Chatbot Misinformation:** The AI chatbot refers to "Pedal" instead of "Peddle" when answering user questions
2. **Website Risk:** If published, the case study would have the wrong company name
3. **SEO Impact:** Wrong company name means the case study won't be found when people search for "Peddle"
4. **Professional Credibility:** Misnaming a client's company is unprofessional

### Required Actions

1. **RENAME** `/docs/content-specs/pedal-case-study.md` to `peddle-case-study.md`
2. **FIND & REPLACE** "Pedal" with "Peddle" throughout the content spec (case-sensitive)
3. **UPDATE SLUG** from `pedal` to `peddle` (line 6)
4. **FIND & REPLACE** in vector DB source: `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` (lines 230-253) - replace "Pedal" with "Peddle"
5. **RE-INGEST** vector database after fixing: `npm run ingest`
6. **AUDIT** Sanity CMS for any Pedal/Peddle project entries and correct the name
7. **VERIFY** website doesn't have any published content with the wrong name

### ⚠️ Other Potential Inaccuracies

**1. Timeline**
- **Content Spec (line 13):** "Timeline: ~1 year"
- **Vector DB:** No explicit timeline mentioned
- **Recommendation:** Verify the actual project duration

**2. Published Date**
- **Content Spec (line 10):** "Published At: 2020-01-01 (approximate)"
- **Vector DB:** No date mentioned
- **Recommendation:** Verify or remove if unknown

---

## 4. Target Case Study

### ✅ Accurate Information
- One of Huge's biggest clients
- 20+ concurrent work streams
- Weekly travel to Minneapolis
- Project and program manager roles
- Amazon to proprietary e-commerce platform transition
- Huge did design, Sapient Nitro did development
- "Place people love" strategy vs Walmart's approach
- Future of retail conceptual work
- QR code prediction (Michael was skeptical but it came true)
- Employee empowerment tools vs kiosks insight
- Data modernization work (conversion dashboards, drop-off metrics)

### ⚠️ Potential Inaccuracies

**1. Timeline Vagueness**
- **Content Spec (line 13):** "Timeline: ~2 years (multiple work streams)"
- **Vector DB:** No explicit timeline mentioned
- **Issue:** The 2-year duration is not stated in source materials
- **Recommendation:** Verify actual project duration

**2. Published Date**
- **Content Spec (line 10):** "Published At: 2013-01-01 (approximate timeframe)"
- **Vector DB:** No date mentioned
- **Issue:** The 2013 date is not in source materials and marked as "approximate timeframe"
- **Recommendation:** Verify or clarify this is when work occurred, not when case study was published

**3. "Generating Most Revenue That Year"**
- **Content Spec (line 36):** "Huge's Largest Client"
- **Vector DB (line 257):** "Target was one of Huge's biggest clients, generating the most revenue that year"
- **Status:** ✅ Accurate - content spec simplifies but captures the essence

**4. Data Modernization Details**
- **Content Spec (lines 247-258):** Provides detailed list of what dashboards showed
- **Vector DB (line 174-175):** "We addressed real data science issues with how they reported their numbers—creating dashboards that showed meaningful conversion, drop-off, and return metrics"
- **Status:** ⚠️ Content spec adds detail beyond source material (bullet points about what dashboards showed)
- **Recommendation:** Verify the specific dashboard capabilities listed are accurate

**5. "23 chunks with 'Target' tag"**
- **Content Spec (line 363):** "Vector DB Chunks: 23 chunks with 'Target' tag"
- **Issue:** This metadata claim cannot be verified without querying the actual vector database
- **Recommendation:** Verify this chunk count is accurate

---

## Summary of Findings

### 🚨 Critical Issues (MUST FIX IMMEDIATELY)

**1. PEDDLE COMPANY NAME IS WRONG THROUGHOUT**
- The company is "Peddle" not "Pedal"
- Wrong name exists in both content spec (`/docs/content-specs/pedal-case-study.md`) and vector database
- Chatbot is currently using the wrong company name when answering questions
- Immediate action required:
  - Rename `/docs/content-specs/pedal-case-study.md` to `peddle-case-study.md`
  - Find & replace "Pedal" with "Peddle" throughout the content spec
  - Fix company name in vector database source materials (lines 230-253 in chatbot-questionnaire_Answers_2.md)
  - Update slug from `pedal` to `peddle`
  - Re-ingest vector database
  - Audit website and Sanity CMS for any published content with wrong name

### High Priority Issues (Should Fix)
1. **Before Launcher: Company name** - "Beforelab" vs "Before Labs" (line 12)
2. **Timeline dates** - Multiple case studies have unverified or approximate dates
3. **"Ongoing" status for Casa Bonita** - Verify if Michael's work is truly ongoing

### Medium Priority Issues (Consider Fixing)
1. **Vector DB chunk counts** - Verify these are accurate (Before Launcher: 24 chunks, Target: 23 chunks)
2. **Detailed elaborations** - Some content specs add detail beyond source materials (particularly in data dashboard descriptions)
3. **Start dates** - Several projects lack confirmed start dates (Before Launcher 2017, Casa Bonita 2023, Peddle 2020, Target 2013)

### Low Priority Issues (Optional)
1. **"Thousands" specificity** - If more specific user numbers exist for Before Launcher, use them

---

## Recommendations

### 🚨 URGENT - Immediate Actions Required
1. **FIX PEDDLE COMPANY NAME**
   - Rename `/docs/content-specs/pedal-case-study.md` to `/docs/content-specs/peddle-case-study.md`
   - Find & replace all instances of "Pedal" with "Peddle" in the content spec (case-sensitive)
   - Update slug from `pedal` to `peddle`
   - Edit `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` lines 230-253 to replace "Pedal" with "Peddle"
   - Run `npm run ingest` to re-sync vector database
   - Check if Pedal/Peddle content exists in Sanity CMS and correct the name
   - Verify website doesn't have published content with the wrong name

### High Priority Actions
1. **Verify company name:** Confirm "Beforelab" vs "Before Labs"
2. **Verify timelines:** Get accurate start/end dates for all projects where marked "approximate"
3. **Verify Casa Bonita status:** Confirm if project is truly "ongoing" or if Michael's active involvement has concluded

### Content Quality Improvements
1. **Add date verification notes:** If dates are approximate or inferred, add a note in the source material section
2. **Verify elaborated details:** Confirm that detailed descriptions not explicitly in source materials are accurate (especially dashboard capabilities)
3. **Check vector DB metadata:** Verify chunk counts are accurate

### Process Improvements
1. **Content verification:** Require Michael to verify all case study content before publication
2. **Source material citations:** Add line number references for all major claims
3. **Inference vs fact marking:** Distinguish between what's directly stated in source materials vs what's inferred
4. **Date sourcing:** Track where dates come from (client records, LinkedIn, memory, inference, etc.)
5. **Review workflow:** Implement review process to catch fabricated or incorrect content before it enters the system

---

## Overall Assessment

**Accuracy Rating: 8.5/10**

The content specs demonstrate strong fidelity to source materials with only minor discrepancies. The most critical issue is a naming error (Peddle vs Pedal) that affects both the content spec and chatbot responses.

### Assessment by Case Study:
- **Before Launcher:** 9/10 - Accurate with minor naming inconsistency ("Beforelab" vs "Before Labs")
- **Casa Bonita:** 9/10 - Accurate with timeline verification needed
- **Peddle:** 7/10 - ⚠️ **WRONG COMPANY NAME** (written as "Pedal" throughout)
- **Target:** 8.5/10 - Accurate with date verification needed

### The Good:
All four case studies demonstrate strong fidelity to source materials. The content, metrics, stories, and professional experiences are accurately represented.

### Critical Issue Found:
**Peddle company name is consistently wrong:**
- Written as "Pedal" instead of "Peddle" throughout content spec
- Written as "Pedal" instead of "Peddle" in vector database
- Chatbot provides correct project information but with wrong company name
- Affects SEO, professionalism, and user trust

### Other Issues:
Most remaining issues are related to:
- Date verification (timelines and start dates)
- Minor naming inconsistencies (Beforelab vs Before Labs)
- Elaborations beyond source materials that need verification

### Immediate Action Required:
Fix the Peddle company name in all materials (content spec, vector database, Sanity CMS, website) and re-ingest the vector database.

---

## Appendix: Files Evaluated

### Content Specs
- `/docs/content-specs/before-launcher-case-study.md` (296 lines)
- `/docs/content-specs/casa-bonita-case-study.md` (348 lines)
- `/docs/content-specs/pedal-case-study.md` (427 lines) ⚠️ **Should be `peddle-case-study.md`**
- `/docs/content-specs/target-case-study.md` (364 lines)

### Vector DB Sources
- `/public/chatbot-content/transcripts/chatbot-questionnaire_Answers_2.md` (464 lines)
- `/public/chatbot-content/transcripts/before-launcher-details.md` (96 lines)

### Evaluation Date
October 30, 2025
