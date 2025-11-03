# Peddle - Editorial Case Study Specification

**Format:** Magazine Editorial (flowing narrative, ~3 pages)
**Style:** Editorial article, not structured sections

---

## Metadata

```yaml
title: "Peddle"
slug: "peddle"
category: "Case Study"
featured: true
order: 5
publishedAt: 2020-01-01
```

---

## Hero Section

```yaml
heroSection:
  badge: "Case Study"
  title: "Peddle"
  subtitle: "15% more cars purchased through conversion optimization"
  summary: "Led data team and UX design for Peddle, a company that buys junk cars and makes the process remarkably easy. Applied booking flow principles to car selling, built comprehensive dashboards with Snowflake and Snowplow, and achieved 15% more cars purchased plus 5% homepage conversion improvement."
```

## Overview

```yaml
overview:
  role: "Data Team Lead, UX Designer"
  company: "Independent Consulting"
  timeline: "~1 year"
```

---

## The Story (Flowing Narrative)

### A Better Business You Don't Think About

Peddle buys junk cars from people and makes it remarkably easy. If you have a car worth between $1,000 and a few thousand dollars that you want to get rid of, Peddle will cut you a check right there, pick up your car, and part it out efficiently.

The owner grew up in a family that owned a junkyard in Connecticut. He took this traditional, often unpleasant business and transformed it into something genuinely user-friendly. As he put it: "One of the better businesses you just don't care about that much."

Most people only sell a junk car once or twice in their lifetime. The traditional process is painful—negotiating with sketchy buyers, dealing with towing, uncertain payment. Peddle made it simple, transparent, and fast.

**The challenge:** How do you optimize conversion for an infrequent, high-friction transaction? How do you build trust quickly? How do you make data-driven decisions when you're still scaling?

**Comparison Boxes:**

```yaml
comparisonBoxes:
  - label: "Traditional Junk Car Sales"
    icon: "🚗"
    title: "Painful, Sketchy, Uncertain"
    text: "Negotiating with questionable buyers. Arranging towing yourself. Uncertain payment. Stressful process for an already stressful situation (your car died)."

  - label: "Peddle's Approach"
    icon: "✨"
    title: "Simple, Transparent, Fast"
    text: "Instant quote. Check on the spot. Free pick-up. Professional service. Make a bad day (broken car) a little bit better."
```

### From Flights to Cars

The Virgin America project taught me that complex transactions should be broken into individual decisions. I applied that same principle to Peddle.

Instead of booking a flight, you're trying to sell a car. But the pattern is the same: map out every decision a seller needs to make, create a step-by-step flow that reduces cognitive load, optimize each step independently based on data.

**The decisions a seller makes:**

Basic car information. Year, make, model, current condition, location. Detailed condition assessment. Does it run? Any major damage? Missing parts? Pick-up details. Where is the car? When can we pick it up? Any access issues? Seller information. Contact details, ownership verification, payment preferences. Price agreement. Instant quote based on information, accept or negotiate, schedule pick-up.

Just like with airline booking, we gave each decision its own space. No overwhelming forms. Clear progress indication. Ability to go back and modify earlier decisions.

**Why it works:** Selling a junk car is already stressful. Breaking the process into manageable steps reduces anxiety and improves conversion.

**Visual Cards:**

```yaml
visualCards:
  - placeholderText: "Step-by-step selling flow: One decision at a time"
    caption: "Booking flow principles applied to car selling"

  - placeholderText: "Snowflake dashboard showing conversion funnel"
    caption: "Data infrastructure enabled optimization"
```

### Building the Data Foundation

I joined Peddle to lead two critical areas: data infrastructure and UX for the buying flow. The data infrastructure told us WHERE to improve. The UX work showed us HOW to improve. Together, they drove measurable business results.

We built Peddle's entire data system: **Snowflake** for data warehousing, **Snowplow** for event tracking, **Google Analytics** for web analytics, custom dashboards showing business-critical metrics.

This wasn't just tracking page views. We built a system that showed where users dropped off in the selling flow, which marketing channels produced quality leads, conversion rates by customer segment, pricing optimization opportunities, regional performance variations.

For the first time, Peddle could make data-driven decisions about where to invest, what to optimize, and how to grow. The dashboard became the operational heartbeat of the business.

**Annotation:**

```yaml
annotation:
  title: "Technical Stack"
  content: "React + Next.js + Sanity CMS. Snowflake data warehouse + Snowplow event tracking + Google Analytics. My first Sanity project—immediately impressed by structured content modeling and developer-friendly APIs. Started my appreciation for Sanity that led to using it on many subsequent projects."
```

**Quote Box:**

```yaml
quoteBox:
  quote: "The data infrastructure told us WHERE to improve. The UX work showed us HOW to improve. Together, they drove measurable business results: 15% more cars purchased, 5% homepage conversion lift."
  attribution: "— On data-driven UX optimization"
```

### What I'd Do Differently

I joined the Peddle project halfway through. Looking back, there's one thing I'd change: **ship faster**.

We wanted to wait until the new booking flow was perfect before shipping. There seemed to be value left in development because we kept refining and polishing.

**The problem:** Perfect is the enemy of good. Getting the improved flow to market faster would have been better than holding it back for additional polish.

Ship when it's good enough, then iterate based on real user behavior. The data infrastructure we built would have shown us exactly what to improve—but only if we'd shipped and started collecting real usage data.

**How I apply this now:** With Claude Code and modern development practices, I'm much more biased toward shipping quickly and iterating. The cost of change is lower, and the value of real-world feedback is higher than ever.

**Comparison Boxes:**

```yaml
comparisonBoxes:
  - label: "What Worked"
    icon: "✅"
    title: "Data + Decisions"
    text: "Comprehensive analytics (Snowflake, Snowplow). Decision-based flow reduced anxiety. Trust-building through transparency. 15% more cars purchased, 5% conversion lift."

  - label: "What I'd Change"
    icon: "⚡"
    title: "Ship Faster"
    text: "Held back the new flow for perfection. Should have shipped good enough and iterated based on real data. Perfect in isolation < good enough in production."
```

### The Results

**15% increase in cars purchased.** The primary business metric. **5% homepage conversion improvement.** More visitors starting the selling process. **Comprehensive data infrastructure** enabling ongoing optimization.

**How we achieved this:**

Data-driven optimization—the dashboard showed exactly where users dropped off. Decision-based flow—breaking the selling process into clear steps reduced anxiety. Trust building—clear pricing, transparent process, professional presentation in an industry known for shady operators. Technical excellence—fast, reliable, mobile-responsive experience for users who are often stressed, often on mobile, sometimes at the roadside.

**Metrics:**

```yaml
metrics:
  - value: "+15%"
    label: "Cars Purchased"
    description: "Primary business metric"

  - value: "+5%"
    label: "Homepage Conversion"
    description: "More visitors starting the process"

  - value: "Snowflake + Snowplow"
    label: "Data Infrastructure"
    description: "Enabling ongoing optimization"

  - value: "Next.js + Sanity"
    label: "Tech Stack"
    description: "Fast, reliable, SEO-friendly"
```

### Reflections

**Booking flow principles are universal.** The decision-based approach that worked for airline tickets also worked for junk car sales. Complex transactions benefit from breaking decisions into discrete steps, regardless of industry.

**Data infrastructure is investment, not cost.** Building comprehensive analytics took time upfront but paid dividends immediately. Every optimization decision was informed by real data rather than opinions.

**Trust is conversion.** In industries with trust issues (like junk car buying), professional presentation, clear communication, and transparent pricing directly improve conversion.

**Mobile-first matters.** People selling junk cars are often dealing with a broken-down vehicle. They're on mobile, often stressed, sometimes at the roadside. Mobile optimization wasn't optional—it was essential.

**Unglamorous businesses, sophisticated tech:** Peddle represents an interesting category—"one of the better businesses you just don't care about that much." It's not sexy. Most people use it once in their lifetime. But it's a real business solving a real problem. Sophisticated technology drives real business outcomes. Good UX makes an unpleasant experience less painful.

Some of the most satisfying work is applying sophisticated techniques to unglamorous problems. Making someone's bad day (broken-down car) a little bit better (easy, transparent, fast sale) is genuinely valuable work.

**Quote Box:**

```yaml
quoteBox:
  quote: "Ship when it's good enough, then iterate based on real user behavior. The cost of change is lower than ever, and the value of real-world feedback is higher than ever."
  attribution: "— On shipping and iterating"
```

---

## Technologies

```yaml
technologies:
  - "React"
  - "Next.js"
  - "Sanity CMS"
  - "Snowflake"
  - "Snowplow"
  - "Google Analytics"
  - "Custom API Integration"
```

---

## Call to Action

```yaml
callToAction:
  text: "View More Projects"
  link: "/work"
```

---

## Editorial Notes

**Narrative Flow:**
1. **A Better Business You Don't Think About** - The problem Peddle solves
2. **From Flights to Cars** - Applying booking flow principles
3. **Building the Data Foundation** - Infrastructure enabling optimization
4. **What I'd Do Differently** - Ship faster, iterate based on data
5. **The Results** - Quantified impact
6. **Reflections** - Universal principles and unglamorous work

**Tone:** Honest about perfectionism (shipping too slowly), proud of the results, focused on applying sophisticated techniques to unglamorous problems

**Length:** ~2.5 pages total
