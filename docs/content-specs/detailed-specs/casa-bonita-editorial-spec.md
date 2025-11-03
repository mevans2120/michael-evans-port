# Casa Bonita - Editorial Case Study Specification

**Format:** Magazine Editorial (flowing narrative, ~3 pages)
**Style:** Editorial article, not structured sections

---

## Metadata

```yaml
title: "Casa Bonita"
slug: "casa-bonita"
category: "Case Study"
featured: true
order: 3
publishedAt: 2023-01-01
```

---

## Hero Section

```yaml
heroSection:
  badge: "Case Study"
  title: "Casa Bonita"
  subtitle: "Managing 40,000-person queues — 100% capacity, 25% more covers"
  summary: "Built Casa Bonita's reservation platform with Next.js and Supabase, handling a 40,000-person queue when the legendary Denver restaurant reopened. Kept it at 100% capacity, increased covers by 25%, and successfully handed it off to a restaurant team, not an IT department."
```

## Overview

```yaml
overview:
  role: "Project/Product Lead, UX Designer"
  company: "Independent Consulting"
  timeline: "Ongoing (2023-present)"
```

---

## The Story (Flowing Narrative)

### Opening

Casa Bonita is a legendary Mexican restaurant in Denver—a massive, theatrical dining experience known for cliff divers, Black Bart's Cave, and appearances in South Park. When the restaurant was acquired and prepared to reopen after years of closure, the anticipation was enormous.

Thousands of people wanted reservations for a restaurant with limited seating. We needed a system that could handle massive demand, manage a fair queue, keep the restaurant at full capacity month after month, support a special Founders Club membership program, and be manageable by a restaurant team—not an IT department.

This wasn't just about building a reservation system. It was about helping a beloved cultural institution successfully reopen.

**Comparison Boxes:**

```yaml
comparisonBoxes:
  - label: "The Challenge"
    icon: "🎭"
    title: "Massive Demand Meets Limited Capacity"
    text: "Tens of thousands of people wanting reservations for a few thousand seats. Need fair queuing, 100% capacity, and a system a restaurant team (not IT) could manage."

  - label: "The Stakes"
    icon: "❤️"
    title: "A Cultural Institution"
    text: "Casa Bonita isn't just a restaurant—it's a beloved experience people had been waiting years to see again. The technical decisions mattered."
```

### Building for the Hammer

We knew we'd get hammered on day one, so we built for scale from the start. **Next.js** for modern React with server-side rendering. **Supabase** for PostgreSQL with real-time capabilities. **Vercel** for automatic scaling and edge functions.

This wasn't a typical restaurant website. We were building a platform that needed to handle tens of thousands of simultaneous users, real-time queue position updates, secure authentication for Founders Club members, admin interfaces for restaurant staff, and integration with reservation systems.

**Key learning:** Supabase scales based on the compute power you allocate to it. Understanding this early allowed us to properly provision resources for launch day.

When we opened reservations, we had **40,000 people in a queue** trying to get a few thousand reservations for the first month.

**Annotation:**

```yaml
annotation:
  title: "Technical Stack"
  content: "Next.js + Supabase + Vercel. Built for scale from day one because we knew demand would be extreme. Supabase scales based on compute allocation—understanding this allowed proper resource provisioning."
```

**Visual Cards:**

```yaml
visualCards:
  - placeholderText: "Queue interface showing real-time position updates"
    caption: "40,000-person queue managed without crashes"

  - placeholderText: "Admin dashboard for Founders Club management"
    caption: "Built for restaurant team, not IT professionals"
```

### The Queuing Problem

Standard reservation systems aren't built for this scale. Users need real-time feedback on their queue position. The system must be fair—first-come, first-served. It has to remain stable under extreme load. And people will wait for hours—the experience must respect their time.

We implemented **Qit**, a specialized queuing system that handled tens of thousands of simultaneous connections, provided real-time updates, ensured fair ordering, prevented gaming the system, and scaled automatically.

Successfully processed 40,000 people through the queue without crashes. The system kept the restaurant at full capacity month after month.

**Quote Box:**

```yaml
quoteBox:
  quote: "When 40,000 people are waiting for 1,000 spots, the UX challenge isn't conversion optimization—it's managing expectations, providing transparency, and respecting people's time."
  attribution: "— On designing for extreme demand"
```

### Handoff Over Features

Beyond public reservations, Casa Bonita has a Founders Club—members who supported the restaurant's acquisition. This required a comprehensive admin system: view, merge, and update founder records; create new founders; manage reservations and benefits; track engagement.

The critical constraint: this needed to be usable by the Casa Bonita team—restaurant professionals, not IT professionals.

We built intuitive interfaces with clear workflows. Comprehensive documentation and training. Error prevention and helpful messages. Support for common operations without developer intervention. Clear audit trails for important changes.

**What I'm most proud of:** Beyond measurably improving their bottom line (25% more covers, 100% capacity), we successfully handed this work off to a restaurant team and made it minimally burdensome. That's rare in custom software projects.

The best kind of technical work serves a purpose bigger than itself and disappears into successful execution.

### Platform Migration Lessons

Initially we integrated with **OpenTable**. Partway through, we migrated to **SevenRooms** for more configuration options and better support for complex scenarios.

The migration was costly—not just licensing fees, but engineering time to rebuild integrations and learn a new API.

**In hindsight:** I'm not entirely sure it was the right decision. Improving our custom OpenTable integrations might have been better than the costly migration. The additional configuration was nice, but the ROI wasn't definitively positive.

**The lesson:** Sometimes the devil you know is better than the devil you don't. When evaluating platform switches, account for the full cost—engineering time, testing, training, and opportunity cost of other features you could build.

**Comparison Boxes:**

```yaml
comparisonBoxes:
  - label: "What Worked"
    icon: "✅"
    title: "Scale + Handoff"
    text: "Built for extreme demand from day one. Next.js/Supabase/Vercel handled 40K queues. Successful handoff to non-technical team. Restaurant still managing it independently."

  - label: "What I'd Reconsider"
    icon: "🔧"
    title: "Platform Migration Cost"
    text: "SevenRooms migration was expensive in engineering time. Improving existing OpenTable integration might have delivered better ROI. Full cost matters more than features."
```

### The Results

**100% capacity.** Restaurant consistently full. **25% increase in covers.** More guests served per service period. **40,000-person queue** successfully managed without crashes. **Seamless handoff** to non-technical restaurant team.

The system continues to operate successfully, keeping Casa Bonita full and helping manage one of Denver's most beloved dining experiences. The restaurant team manages it independently with minimal technical support.

Casa Bonita is thriving. People are experiencing the cliff divers, the sopapillas, and the joy that makes it special. The technical infrastructure works invisibly in the background, doing exactly what it should: supporting the experience without getting in the way.

**Metrics:**

```yaml
metrics:
  - value: "40,000"
    label: "People in Queue"
    description: "Successfully managed"

  - value: "100%"
    label: "Capacity"
    description: "Consistently full"

  - value: "25%"
    label: "More Covers"
    description: "Measurable revenue impact"

  - value: "Zero"
    label: "Technical Team Needed"
    description: "Restaurant manages independently"
```

### Reflections

**Build for scale from day one.** Don't wait to see if you need it—if there's any chance of high demand, architect for it from the start.

**The handoff matters as much as the build.** Technical excellence is only part of success. Building something a non-technical team can manage is often more valuable than adding features.

**Platform migrations are expensive.** Evaluate the full cost—not just licensing, but engineering time and opportunity cost of other features you could build.

**Queuing at scale is hard.** Managing tens of thousands of simultaneous users competing for limited resources requires specialized tools. Using Qit rather than building from scratch was the right call.

**Quote Box:**

```yaml
quoteBox:
  quote: "The handoff matters as much as the build. The best measure of success: they're still using it successfully without constant developer intervention."
  attribution: "— On sustainable software projects"
```

---

## Technologies

```yaml
technologies:
  - "Next.js"
  - "Supabase"
  - "Vercel"
  - "Qit (Queuing System)"
  - "OpenTable API"
  - "SevenRooms API"
  - "React"
  - "TypeScript"
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
1. **Opening** - Set up the cultural significance and challenge
2. **Building for the Hammer** - Technical architecture and scale decisions
3. **The Queuing Problem** - Core technical challenge and solution
4. **Handoff Over Features** - Building for non-technical teams
5. **Platform Migration Lessons** - Honest about what didn't work perfectly
6. **The Results** - Impact and ongoing success
7. **Reflections** - Key learnings

**Tone:** Proud of the technical achievement, honest about trade-offs, focused on the bigger purpose (helping a cultural institution succeed)

**Length:** ~3 pages total
