# Pedal Case Study - Content Specification

## Metadata

**Title:** Pedal - 15% More Cars Bought Through Conversion Optimization
**Slug:** `pedal`
**Category:** Case Study
**Featured:** Yes
**Order:** 5
**Published At:** 2020-01-01 (approximate)
**Role:** Data Team Lead, UX Designer
**Company:** Independent Consulting
**Timeline:** ~1 year

---

## Hero Section

### Title
Pedal - Making Junk Car Sales Simple

### Tagline
Applying booking flow expertise to car buying, achieving 15% more cars purchased and 5% homepage conversion lift

### Summary (2-3 sentences)
Led data team and UX design for Pedal, a company that buys junk cars and makes the process remarkably easy. Applied lessons from airline booking flows to create a decision-based car selling experience, building comprehensive dashboards with Snowflake and Snowplow, and achieving a 15% increase in cars purchased plus 5% homepage conversion improvement.

---

## Key Metrics

```json
{
  "metrics": [
    {
      "label": "Cars Purchased Increase",
      "value": "+15%"
    },
    {
      "label": "Homepage Conversion Lift",
      "value": "+5%"
    },
    {
      "label": "Tech Stack",
      "value": "React, Next.js, Sanity"
    },
    {
      "label": "Data Infrastructure",
      "value": "Snowflake, Snowplow, GA"
    }
  ]
}
```

---

## Key Achievements

```json
{
  "achievements": [
    "Increased cars purchased by 15% through UX improvements",
    "Improved homepage conversion by 5%",
    "Built comprehensive data dashboard (Snowflake, Snowplow, Google Analytics)",
    "Applied booking flow principles to car selling process",
    "First project using Sanity CMS",
    "Mapped decision-based selling flow similar to airline booking",
    "Created actionable analytics for business growth"
  ]
}
```

---

## Technologies Used

```json
{
  "technologies": [
    "React",
    "Next.js",
    "Sanity CMS",
    "Snowflake",
    "Snowplow",
    "Google Analytics",
    "Custom API Integration"
  ]
}
```

---

## Content Sections

### Section 1: Understanding Pedal

**Heading:** A Better Business You Don't Think About

**Content:**

Pedal buys junk cars from people and makes it remarkably easy. If you have a car worth between $1,000 and a few thousand dollars that you want to get rid of, Pedal will:
- Cut you a check right there
- Pick up your car
- Part it out efficiently

**The Founder's Background:**
The owner grew up in a family that owned a junkyard in Connecticut. He took this traditional, often unpleasant business and transformed it into something genuinely user-friendly. As he put it: "One of the better businesses you just don't care about that much."

**Why This Matters:**
Most people only sell a junk car once or twice in their lifetime. The traditional process is painful—negotiating with sketchy buyers, dealing with towing, uncertain payment. Pedal made it simple, transparent, and fast.

**The Challenge:**
How do you optimize conversion for an infrequent, high-friction transaction? How do you build trust quickly? How do you make data-driven decisions when you're still scaling?

---

### Section 2: My Role - Data & UX

**Heading:** Building the Foundation for Growth

**Content:**

I joined Pedal to lead two critical areas:

**1. Data Team Leadership**

Built out Pedal's entire data infrastructure and reporting system:
- **Snowflake** for data warehousing
- **Snowplow** for event tracking
- **Google Analytics** for web analytics
- Custom dashboards showing business-critical metrics

This wasn't just about tracking page views. We built a system that showed:
- Where users dropped off in the selling flow
- Which marketing channels produced quality leads
- Conversion rates by customer segment
- Pricing optimization opportunities
- Regional performance variations

**2. UX for the Buying Flow**

Applied lessons from airline booking flows to car selling:
- Instead of booking a flight, you're trying to sell a car
- Mapped out every decision a seller needs to make
- Created a step-by-step flow that reduced cognitive load
- Optimized each step independently based on data

**The Connection:**
The data infrastructure told us WHERE to improve. The UX work showed us HOW to improve. Together, they drove measurable business results.

---

### Section 3: Applying Booking Flow Principles

**Heading:** From Flights to Cars

**Content:**

The Virgin America project taught me that complex transactions should be broken into individual decisions. I applied that same principle to Pedal.

**The Decisions a Seller Makes:**

1. **Basic Car Information**
   - Year, make, model
   - Current condition
   - Location

2. **Detailed Condition Assessment**
   - Does it run?
   - Any major damage?
   - Missing parts?

3. **Pick-up Details**
   - Where is the car?
   - When can we pick it up?
   - Any access issues?

4. **Seller Information**
   - Contact details
   - Ownership verification
   - Payment preferences

5. **Price Agreement**
   - Instant quote based on information
   - Accept or negotiate
   - Schedule pick-up

**The Pattern:**
Just like with airline booking, we gave each decision its own space. No overwhelming forms. Clear progress indication. Ability to go back and modify earlier decisions.

**Why It Works:**
Selling a junk car is already stressful (your car died, you need to deal with it). Breaking the process into manageable steps reduces anxiety and improves conversion.

---

### Section 4: Data Infrastructure

**Heading:** Building the Dashboard

**Content:**

Pedal needed a sophisticated data infrastructure to make smart business decisions.

**What We Built:**

**Snowflake Data Warehouse:**
- Central repository for all business data
- Customer information, transaction history, pricing data
- Marketing attribution, conversion funnels
- Regional and temporal patterns

**Snowplow Event Tracking:**
- Custom event tracking beyond standard web analytics
- Detailed user journey mapping
- Interaction-level data (what users clicked, how long they spent on each step)
- Integration with business systems for end-to-end visibility

**Google Analytics:**
- Standard web analytics for traffic and basic conversion
- Marketing channel performance
- Geographic and demographic insights
- Integration with Snowflake for enriched analysis

**Custom Dashboards:**
- Real-time business metrics
- Conversion funnel visualization
- Drop-off analysis by step
- Pricing optimization insights
- Marketing ROI by channel

**The Impact:**
For the first time, Pedal could make data-driven decisions about where to invest, what to optimize, and how to grow. The dashboard became the operational heartbeat of the business.

---

### Section 5: Technical Implementation

**Heading:** React, Next.js, and Sanity

**Content:**

**Tech Stack Choice:**
- **React** for component-based UI
- **Next.js** for server-side rendering and SEO
- **Sanity CMS** for content management (my first Sanity project!)
- Custom API integration with Pedal's backend systems

**Why Next.js:**
- SEO was critical (people searching "sell my junk car")
- Fast initial page load improved conversion
- API routes handled form submissions securely
- Easy deployment and scaling

**Why Sanity:**
This was my first time working with Sanity CMS. I was immediately impressed by:
- Structured content modeling
- Real-time collaboration
- Powerful querying capabilities
- Developer-friendly API

This project started my appreciation for Sanity that led to using it on many subsequent projects, including Casa Bonita, PostPal, and numerous marketing websites.

**API Integration:**
Worked closely with Pedal's team to design API endpoints that:
- Handled car information submission
- Generated instant quotes based on condition and market data
- Scheduled pick-ups and integrated with operations
- Tracked conversion events back to the data warehouse

---

### Section 6: Results & Impact

**Heading:** Measurable Business Outcomes

**Content:**

**Quantifiable Results:**
- **15% increase in cars purchased** - The primary business metric
- **5% homepage conversion improvement** - More visitors starting the selling process
- **Comprehensive data infrastructure** - Enabling ongoing optimization
- **Faster time to market** - Though we could have shipped even faster (more on that below)

**How We Achieved This:**

1. **Data-Driven Optimization:**
   The dashboard showed exactly where users dropped off, allowing us to focus improvements where they'd have the most impact.

2. **Decision-Based Flow:**
   Breaking the selling process into clear steps reduced anxiety and improved completion rates.

3. **Trust Building:**
   Clear pricing, transparent process, and professional presentation built confidence in an industry known for shady operators.

4. **Technical Excellence:**
   Fast, reliable, mobile-responsive experience that worked for users in any context (often stressed, often on mobile).

**The Ongoing Impact:**
The data infrastructure and UX improvements we built continue to benefit Pedal, enabling ongoing optimization and business growth.

---

### Section 7: What I'd Do Differently

**Heading:** Ship Faster

**Content:**

I joined the Pedal project halfway through, and looking back, there's one thing I'd change:

**The Issue:**
We wanted to wait until the new booking flow was perfect before shipping. There seemed to be value left in development because we kept refining and polishing.

**The Problem:**
Perfect is the enemy of good. Getting the improved flow to market faster would have been better than holding it back for additional polish.

**Why This Happened:**
- Perfectionism (always a risk in product development)
- Joining mid-project meant I inherited some assumptions
- Desire to deliver something we were proud of
- Underestimating the value of real-world feedback vs. internal iteration

**The Lesson:**
Ship when it's good enough, then iterate based on real user behavior. The data infrastructure we built would have shown us exactly what to improve—but only if we'd shipped and started collecting real usage data.

**How I Apply This Now:**
With Claude Code and modern development practices, I'm much more biased toward shipping quickly and iterating. The cost of change is lower, and the value of real-world feedback is higher than ever.

---

### Section 8: Key Learnings

**Heading:** Takeaways for Conversion Optimization

**Content:**

**1. Booking Flow Principles Are Universal**
The decision-based approach that worked for airline tickets also worked for junk car sales. Complex transactions benefit from breaking decisions into discrete steps, regardless of industry.

**2. Data Infrastructure Is Investment, Not Cost**
Building comprehensive analytics took time upfront but paid dividends immediately. Every optimization decision was informed by real data rather than opinions.

**3. Trust Is Conversion**
In industries with trust issues (like junk car buying), professional presentation, clear communication, and transparent pricing directly improve conversion.

**4. Mobile-First Matters**
People selling junk cars are often dealing with a broken-down vehicle. They're on mobile, often stressed, sometimes at the roadside. Mobile optimization wasn't optional—it was essential.

**5. Sanity Is Powerful**
My first Sanity project convinced me of its value. Structured content, developer-friendly APIs, and real-time collaboration made it superior to traditional CMSs.

**6. Ship and Iterate**
The biggest learning: ship faster, learn from real users, iterate based on data. Perfection in isolation is less valuable than good enough in production.

---

### Section 9: The Bigger Picture

**Heading:** Unglamorous Businesses, Sophisticated Tech

**Content:**

Pedal represents an interesting category of business: "one of the better businesses you just don't care about that much."

It's not sexy. It's not going to be featured on TechCrunch. Most people will use it once in their lifetime.

**But:**
- It's a real business solving a real problem
- Sophisticated technology drives real business outcomes
- Good UX makes an unpleasant experience less painful
- Data infrastructure enables smart growth decisions

**The Philosophy:**
Some of the most satisfying work is applying sophisticated techniques to unglamorous problems. Making someone's bad day (broken-down car) a little bit better (easy, transparent, fast sale) is genuinely valuable work.

**The Parallel to Other Projects:**
- Virgin America: Making complex transactions simpler
- Casa Bonita: Handling massive demand gracefully
- Target: Enterprise-scale optimization
- Pedal: Conversion optimization for infrequent, high-friction transactions

The principles are the same: understand your users, reduce friction, make decisions easy, build trust, measure everything, iterate constantly.

---

## SEO Metadata

**Meta Title:** Pedal Case Study - 15% Conversion Increase Through UX & Data | Car Buying Flow

**Meta Description:** How data infrastructure and booking flow UX principles increased Pedal's car purchases by 15% and homepage conversion by 5%. React, Next.js, and Sanity case study.

**Keywords:** conversion optimization, UX design, data analytics, Snowflake, Snowplow, Next.js case study, Sanity CMS, booking flow optimization, decision-based design

---

## Images Needed

1. **Hero Image:** Pedal homepage or car selling interface
2. **Booking Flow:** Step-by-step screenshots of the selling process
3. **Data Dashboard:** Snowflake/Snowplow dashboard (if shareable)
4. **Before/After:** Comparison of old vs. new flow
5. **Mobile Experience:** Mobile-optimized selling interface
6. **Conversion Funnel:** Visualization of the decision-based flow
7. **Results Graphic:** +15% and +5% metrics visualization

---

## Related Projects

- Virgin America (booking flow optimization, decision-based design)
- Casa Bonita (Next.js implementation, Vercel deployment)
- Target (data analytics, conversion optimization)

---

## Call to Action

Need help optimizing conversion for complex transactions or building data infrastructure for business growth? Let's talk about your challenge.

---

## Source Material

**Primary:** `/docs/research/research-batch-1-102525/source-materials/transcripts/chatbot-questionnaire_Answers_2.md` (lines 230-253 in original, lines 7-30 in updated)

**Vector DB Chunks:** Chunks with "Pedal" tag
