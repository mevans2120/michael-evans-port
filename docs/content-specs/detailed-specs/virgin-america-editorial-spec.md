# Virgin America - Editorial Case Study Specification

**Format:** Magazine Editorial (flowing narrative, ~3 pages)
**Style:** Editorial article, not structured sections

---

## Metadata

```yaml
title: "Virgin America"
slug: "virgin-america"
category: "Case Study"
featured: true
order: 1
publishedAt: 2015-06-01
```

---

## Hero Section

```yaml
heroSection:
  badge: "Case Study"
  title: "Virgin America"
  subtitle: "First responsive airline website — 15-20% conversion improvement"
  summary: "Led product strategy for Virgin America's groundbreaking responsive website. By rethinking booking flows around decisions instead of clicks, we created the first responsive airline website, improved conversion 15-20%, and won Webbies, UX Awards, and Cannes Lions."
```

## Overview

```yaml
overview:
  role: "Lead Product Manager & Client Lead"
  company: "Work & Co"
  timeline: "~1 year (2014-2015)"
```

---

## The Story (Flowing Narrative)

### Opening

Most of Virgin America's revenue came from business travelers—frequent flyers who pay premium prices and book last-minute. They'll figure out any booking system. But leisure travelers, who book 2-3 times per year, were struggling.

An airline ticket is one of the most complex consumer products to purchase: choose travelers, select dates and times, pick flights and seats, align with hotel and car reservations, enter payment information, choose fare types and ancillaries. Leisure travelers were failing to convert at alarming rates.

**The brief:** Make it simpler for leisure travelers without compromising the experience for business travelers.

**Comparison Boxes:**

```yaml
comparisonBoxes:
  - label: "The Problem"
    icon: "✈️"
    title: "Complex Purchase, Infrequent Users"
    text: "Leisure travelers book 2-3 times per year and were overwhelmed by the complexity of airline booking—8+ major decisions crammed into dense screens."

  - label: "The Constraint"
    icon: "💼"
    title: "Can't Break Power Users"
    text: "Business travelers generate most revenue. Any simplification must preserve efficiency for frequent flyers who know exactly what they want."
```

### The Insight

In 2014-2015, the industry was obsessed with reducing clicks to improve conversion. Everyone believed fewer clicks meant better conversion. We discovered something more fundamental: **it's not about the number of clicks—it's about the number of decisions.**

Combining multiple decisions into one screen to reduce clicks actually makes the experience more complicated and overwhelming. Each decision needs space to breathe. People need cognitive breathing room.

Our insight was simple: separate every major decision into its own step. Don't try to minimize clicks—try to clarify choices.

**Quote Box:**

```yaml
quoteBox:
  quote: "It's not about the number of clicks—it's about the number of decisions. Combining decisions to reduce clicks makes experiences more overwhelming. Each decision needs space to breathe."
  attribution: "— On rethinking conversion optimization"
```

### The Solution

We redesigned the entire booking flow around individual decisions. Who's going. When you want to travel. Which flights work. Where you want to sit. Who's traveling. How you're paying. Each step optimized independently, with clear progress indicators and easy ability to return and modify earlier decisions.

This wasn't just a visual refresh. Virgin America's booking ran on **Sabre, an IBM mainframe from the 1970s**. We were integrating bleeding-edge Angular with one of the oldest enterprise systems still in production. This became the **largest Angular project at the time**.

We insisted business logic stay in the API rather than the front-end. This was controversial—it required extensive collaboration with Virgin America's API team to design stateless endpoints that could handle complex booking flows. But we'd learned from painful experience. On my previous project (Broadway.com at Huge), we ignored engineer concerns about architecture. The site crashed after 3 minutes in production. On Virgin America, we listened.

**Visual Cards:**

```yaml
visualCards:
  - placeholderText: "Step-by-step booking flow: One decision per screen"
    caption: "Focused decision-making replaced dense multi-choice screens"

  - placeholderText: "Responsive design across devices"
    caption: "First responsive airline website"
```

**Annotation:**

```yaml
annotation:
  title: "Technical Achievement"
  content: "Built on Sabre (1970s IBM mainframe) using Angular—the largest Angular project at the time. API-first architecture: business logic in stateless endpoints, not front-end. No chained requests for performance."
```

### The Results

The website launched to immediate industry acclaim. **15-20% improvement in conversion rates.** Featured heavily on design Twitter the day after launch. Won Webbies, UX Awards, and Cannes Lions. Became a portfolio staple as "the first responsive airline website."

But the real impact was the pattern we established. The step-by-step, decision-by-decision flow we pioneered became standard in e-commerce. You can see its influence in booking flows across industries—from travel to insurance to financial services.

Following the website's success, we built Virgin America's mobile app. When Alaska Airlines acquired Virgin America years later, they engaged us to design conceptual website experiences based on our approach. Those designs are just now being implemented (2023-2025), showing how forward-thinking the work was.

**Metrics:**

```yaml
metrics:
  - value: "15-20%"
    label: "Conversion Improvement"
    description: "Measurable revenue impact"

  - value: "First"
    label: "Responsive Airline Website"
    description: "Industry milestone"

  - value: "3"
    label: "Major Awards"
    description: "Webbies, UX Awards, Cannes Lions"
```

### Reflections

We kept adding people to the project as it grew, and kept "hitting the jackpot" with talent. Having exceptional people makes everything possible.

The biggest lesson: respect your engineers. On Broadway.com, we ignored their concerns—disaster. On Virgin America, we listened to their technical judgment about API-first architecture and performance. That made all the difference.

What I'd do differently: We built our own framework for the mobile app ahead of React. Building a framework AND an app simultaneously was ambitious to a fault—we delivered late. Lesson learned: use established tools when possible. Innovate where it matters most.

**Quote Box:**

```yaml
quoteBox:
  quote: "On my previous project, we ignored engineer concerns—the site crashed after 3 minutes in production. On Virgin America, we listened. That made all the difference."
  attribution: "— On building great teams"
```

**Comparison Boxes:**

```yaml
comparisonBoxes:
  - label: "What Worked"
    icon: "✅"
    title: "Decision-Based Flow + Team Quality"
    text: "Pioneered pattern now standard in e-commerce. Respecting engineers' technical judgment. Keeping business logic in APIs. Exceptional talent."

  - label: "What I'd Change"
    icon: "🔧"
    title: "Don't Build Frameworks"
    text: "Built our own framework for the mobile app ahead of React. Delivered late. Lesson: use established tools when possible."
```

---

## Technologies

```yaml
technologies:
  - "Angular"
  - "Sabre API (IBM Mainframe)"
  - "Responsive Design"
  - "Single-Page Application"
  - "RESTful APIs"
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
1. **Opening** - Set up the business problem (leisure vs. business travelers)
2. **The Insight** - Challenge industry assumption (clicks vs. decisions)
3. **The Solution** - How we built it (step-by-step flow, technical reality)
4. **The Results** - Impact and industry influence
5. **Reflections** - Honest lessons learned

**Tone:** Confident about the innovation, honest about mistakes, focused on the human story behind the metrics

**Length:** ~3 pages total
