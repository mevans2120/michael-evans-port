# Professional Q&A Transcript

## Current Professional Work

I am currently consulting and have an interest in a startup called PostPal. We're building an app for people who have gone through medical procedures and are looking for better post-procedure care than the sheets of paper you typically get after a colonoscopy or other procedures.

I'm interested in any kind of challenging work—challenging opportunities and problems to solve. I love working with amazing teams and people, and I really enjoy meeting goals and solving problems. Whether it's helping people make it easier to buy an airline ticket, helping a company show what kind of work they do, or showing their brand better on the internet—yes, I'm always interested in learning about new opportunities.

## What Interests Me Most

Challenging problems, definitely. I think AI and ML honestly—every software project should either be powered by AI or machine learning. Even in its current non-AGI state, it's fantastically useful. It can speed up how quickly you get work done, do it more cheaply, and definitely improves the quality of the build.

As far as roles, I'm really interested in the 0-to-1 "army of one" approach, where I'll do product strategy, design, and development working with the client and with AI. I love product strategy, research, and testing. One thing I've learned about myself is that the process for building, testing, shipping, and taking products to market is one that I enjoy. It's completely changing now with AI, but I still enjoy it.

### Industries I'm Drawn To

- Aviation
- Hospitality
- New technology
- Media

I'm a lifelong learner, which is evidenced by this work with AI/ML among other things. I always love learning about what makes a company special.

### Company Size Preferences

I don't have a strong preference, but I really do enjoy having agency and being able to get work done. That probably leads me a little bit toward smaller companies, but I know there are plenty of enterprises that are good at getting work done. Since I live in Portland, Oregon, remote is often the best option, but I love working on-site.

## Types of Projects I'm Not Interested In

Probably not military. Probably not soda. Other than that, there might be projects where I would recommend other solutions. I genuinely want whoever is trying to solve a problem to get their problem solved in the best possible way.

## Casa Bonita Project

### Team Composition

- Myself as project/product lead
- Graphic designer
- Copywriter
- Engineer
- Technical consultant (my friend Vinny)

I did the UX for this project, managed the project, and helped with technical architecture and tech setup.

### Tech Stack

- Next.js with Supabase
- Hosted on Vercel

We chose this super modern stack because it can scale, and we knew we were going to get hammered. We learned that Supabase scales via the compute power you give it.

### Technical Challenges

The main challenge was **queuing**. We had 40,000 people waiting in a queue when we first opened the restaurant for reservations to get a few thousand reservations. We were doing this month by month. The queuing system Qit really helped us solve this.

### Support System

We built a support system for the Founders Club. This allowed the Casa Bonita team to manage founder data, details, merge founders, create new founders if needed—basically administrate everything for the Founders Club, which was not going away.

### What I'd Do Differently

Switching reservation systems from OpenTable to SevenRooms offered a lot of configuration and made some things easier, but it was very costly. I'm not sure if it was the right decision in hindsight. Improving the custom OpenTable builds might have been better than moving to SevenRooms.

### Impact

- Kept the restaurant full at 100% capacity
- Successfully switched reservation systems
- Increased the number of covers by 25%

What I'm most proud of: aside from measurably improving their bottom line, we were able to hand this work off to a restaurant (not an IT company) and have it be minimally burdensome.

## Virgin America Project

### Overview

We built Virgin America's website and ultimately their mobile app. The first thing was the website.

### Research Insights

**Business Travelers vs. Leisure Travelers:**

Most of Virgin America's business (like most airlines) comes from business travelers—people who travel frequently, pay high dollar for tickets, and book last minute. They're the most important customers and will figure out how to use any software to book a ticket.

But then there are leisure travelers who travel 2-3 times a year. An airline ticket is one of the most complex products a customer can buy in a year (similar complexity to cell phones or cell phone plans). You have to:

- Say who's going
- Pick days and times
- Pick flights and seats
- Align with hotel and car reservations
- Enter travel information and credit card
- Pick fare type (economy, main, business)
- Consider ancillaries (paying extra for better seats)

**Leisure travelers struggled to convert—they would fail the most.**

### Strategy

Build it to make it simpler for leisure travelers to book a ticket, and business travelers will come along for the ride.

### Key Innovation: Decisions vs. Clicks

In 2014-2015, people talked about reducing the number of clicks to improve conversion. There's something correct there, but it's actually about the **number of decisions**. If you can reduce the number of decisions a person needs to make to complete a transaction, you'll improve conversion. Simply reducing clicks doesn't help, and sometimes combining decisions into one click makes it more complicated.

**Solution:** We broke it apart so every decision got its own space:
1. Who's going
2. Dates and times
3. Fares
4. Seats
5. Traveler information
6. Confirmation

Each step by step—that was the big innovation.

### Tech Stack

- **Angular** - the biggest Angular project at the time by a significant margin
- **Sabre backend** - we were responsible for the front end and worked closely with Virgin America on the APIs

### Technical Challenges

**Sabre:** So old (from the 70s). It was innovative then—you could call a travel agent and they could put you on a specific seat on a specific flight at specific dates and times. By 2014-2015, this was no longer innovative. The APIs we had to work with were very daunting.

We were working with Angular, which was brand spanking, bleeding-edge technology at the time. Single-page apps were just starting to gain popularity. The challenges we faced with Virgin don't exist anymore.

React is really componentized and has far less of a point of view for how you build things than Angular did at the time.

**Other Technical Challenges:**

- We didn't want to code business logic into the front end—we wanted the API to handle as much business logic as possible while remaining stateless
- Going back and forth with the API team to figure out exactly how this worked
- We didn't want to chain API requests in the front end—making sure each API request had enough of what we needed
- Learning about fare classes (little letters) that had to be in our API calls

### Team

I was the lead product manager and client lead, working with a design team and engineering team at Work & Co. We had a fantastic, very talented team. We kept adding people to the project as it grew in scope, and we just kept hitting the jackpot with who we put on the project.

### A/B Testing

We did A/B testing on the deals pages—flight deals that come out every week. We tested three versions:
1. Illustrations (what we used on Virgin)
2. Photography
3. Google-style (just a straight list)

I thought the Google style would convert best because it was simpler. But for deals, the imagery won, then illustrations, and last was the Google-style list. **Learning:** You need to spark some emotion to improve conversion on deals.

### Impact & Awards

- Won many awards: Webbies, UX Awards, Cannes Lions
- The day after launch, very popular on Twitter with design folks
- First responsive airline website
- The step-by-step, decision-by-decision design became very popular in e-commerce
- **Improved conversion by 15-20%**
- Big success

### Mobile App

We worked on the app as well, which was just as challenging. This was before React Native. We didn't want to code the business logic into both Android and iOS. With the website, we said we wanted to avoid coding business logic in the front end, but we did have to code some.

As single-page apps have become more ubiquitous, having business logic in the front end is not universally considered bad anymore.

**What I Wouldn't Do Again:** We built our own framework ahead of React. This proved to be a big challenge—building a framework plus an app. It really slowed us down and we were late to deliver that product.

### Alaska Airlines

When Alaska Airlines bought Virgin, we ended up working with them. We did conceptual website designs—they were very interested in our approach. It took them quite a while to implement these designs; they just started coming out in the past few years.

The companies couldn't be more different culturally. Virgin had a very fun, almost sexy airline brand. They wouldn't hire from other airlines—they typically wanted folks who had never worked for an airline. Alaska was known for operational efficiency, always profitable—the most profitable airline in the past 40 years.

**Airlines Insight:** Why would you ever start one? You have very little control over how well your business does. You need to run your business really well, AND you need the price of gas to be low and demand to be high. You don't control gas prices and don't have much control over demand (largely influenced by the economy).

**Funny Story:** I asked the Virgin America CMO about why anyone would start an airline. She said she'd thought about it, and thinks it's because the planes are shaped like penises, and it's mostly all men who own these airlines.

### Other Accomplishments

We addressed real data science issues with how they reported their numbers—creating dashboards that showed meaningful conversion, drop-off, and return metrics. A much more modern way to think about their business with data. That's something I led.

## Before Launcher

### The Problem

I became incredibly distracted by my phone—always blowing up with notifications and activity. Everyone's had the problem where they open their phone wanting to do something specific, but end up doing something else because of a notification or getting distracted by an app icon.

### The Solution

We're grown-ups. We need our smartphones because they're supercomputers in your pocket. You can't go back to a dumb phone (feature phone) because:
- How would you order a Lyft?
- It's really nice to have every song you own in your pocket
- So many benefits to a smartphone that aren't inherently distracting

**Features:**

1. **Notification Filter:** Notifications can be inherently important (texts from your mom, work emails, Slack messages) or inherently unimportant (deals from Target, Facebook trying to suck you back in). We filtered out the good notifications from the bad and let people modify the filter. You still wouldn't lose any notifications—filtered ones would appear in a list you could check.

2. **Simple 3-Swipe Interface:**
   - Swipe left for apps
   - Swipe right for notifications
   - Favorites list

### Development Process

The notification filter could only be built on Android. We weren't even sure it was going to work—we had to prototype it, and fortunately it worked (but barely).

We beta tested with folks, which helped us build out the onboarding. Phone interfaces are different from airline interfaces because you use them all the time, so it's fine to have things that are learnable. We built comprehensive onboarding.

When we shipped, it was really slow. The team was small: me, an engineer, and later a biz ops person. I did all the design work, product research, and App Store optimization work.

### App Store Optimization

I learned what might work by reading about it, seeing what people search for, and A/B testing (Google Play allows this). Key learnings:
- **Video doesn't convert**
- Imagery converts
- Cultivating 5-star reviews matters

### Results

- Won Fast Company's Best App of 2019
- People loved it and it worked
- People who used the Before Launcher opened their phones 30-40% less than average
- There's some implicit bias (people trying to open their phones less), but it was definitely meaningful beyond just bias
- Got plenty of positive reports that it really worked

### The Business Problem

The business model was not sustainable. We had ideas for other apps around phone distractions, including iOS apps, but the finances were shaky. I ultimately sold it to the developer, and he's still using it—it still lives on.

### Startup Lesson

If I was going to start another startup, it would likely be B2B. Selling to businesses is often a more sustainable way to make money, whereas consumer software often has to be given away and you have to either sell data or do other unsavory things I wasn't interested in doing.

## Pedal.com

### What Pedal Does

Pedal buys junk cars from people and makes it very easy. If you have a car worth between $1,000 and a few thousand dollars, Pedal will cut you a check right there, pick up your car, and part it out. The owner grew up in a family that owned a junkyard in Connecticut, so he developed a really good business—one of the better businesses you just don't care about that much.

### My Role

**Data Team:** I was initially in charge of the data team. We built out a dashboard using Snowflake, Snowplow, and Google Analytics—a big reporting system for Pedal.

**UX for Buying Flow:** We also built out their buying system. Instead of booking a flight, you're trying to sell a car. We mapped out the decisions you'd have to make.

### Impact

- They bought more cars (what they wanted) by **15%**
- Homepage changes improved conversion by **5%**

### What I'd Do Differently

I joined the project halfway through. I think we would have brought the new booking flow to market faster. There seemed to be value left in development because we wanted to wait until it was perfect before shipping. Getting it to market faster would have been better.

### Tech Stack

React, Next.js, plus Sanity (my first time working with Sanity). It hooked up with an API we worked with the client on.

## Target

### Overview

Target was one of Huge's biggest clients, generating the most revenue that year. I traveled to Minneapolis every week, working on about 20 different projects. I was the project manager and program manager for all the work streams with Target.

### E-commerce Transition

When e-commerce first became a thing, Target partnered with Amazon and sold all their products through them. They realized this wasn't a good long-term solution and needed their own e-commerce system. They started a massive project to move from Amazon to their own proprietary e-commerce engine.

We did design work for the e-commerce engine at Huge. Sapient Nitro did the development work.

### Key Learning: Strategy

The value of having a strategy that inspires people. The partnership worked so well because of Target's inspirational strategy: being the place that people love and selling products people love, versus Walmart's more transactional approach.

### Future of Retail

We did forward-thinking conceptual work on the future of retail, and so much of it came to pass:
- Using QR codes to extend offerings (I was skeptical at the time—wrong again!)
- Using the internet where it's actually useful

**Key Insight:** The future of retail with digital is NOT putting kiosks inside your retail operation. People don't really love using kiosks—they're kind of grimy and rarely better than being in your store or talking to your employees.

**Better Approach:** We worked on tools to make team members smarter. Give them ways to:
- Know more about their inventory
- Know how their inventory operates
- Potentially know how many people are in the store
- Have as much information as possible to be gracious, good team members

That was one of the bigger strategic decisions that I think you've seen come to light.

## PostPal (AI Project)

### What It Is

A mobile app (iOS/Android built in React Native) and web app for people who've had medical procedures.

### The Problem

If you have a medical procedure where you need to recover, there are do's and don'ts. You usually get a pamphlet with instructions like:
- Can't take a shower for 72 hours
- Keep your cast dry for 3 months
- Do physical therapy
- Take certain medications
- Can't take other medications

These don'ts gradually go away, and the dos gradually go away too.

### The Solution

We created a way for AI to parse these PDFs (pamphlets are generally PDFs) and turn them into a timeline. You can also customize and manage the timeline.

### Tech Stack

- **Next.js app** (provides an API)
- **React Native app** (uses the API)
- Mobile and web app share the same design but don't share components—built separately
- Admin interface to add new users

### What I Learned

Working with Claude Code and processes I learned from agentic engineering/vibe coding folks. The mobile app and web app architecture taught me a lot about building full-stack applications with AI.

## Other AI Projects - Marketing Websites

Built several marketing websites with React + Sanity (which works super well):

- **DOA** - Department of Art, a production company in Portland
- **Opal Creek** - Accounting consulting company in Portland
- **Coronagaten** - Shaman website in Eugene
- Several others

These projects were about proving the concept of this kind of consulting work. The apps aren't super technical, but getting the design right and the marketing right was the more challenging and fun thing to do.

### Other AI Tools

- Built tools for Claude
- Used and modified memory bank solutions, creating a hybrid memory bank that works well and offers context throughout projects
- Built 3 suites of Claude skills: Design Suite, Project Suite, and Dev Suite
- Since switching to GitHub and Claude, I have over 1,000 commits on my GitHub page—it's been a lot of work

## Product Management Experience

I've been doing product management for what feels like most of my life, even though sometimes my role was called project manager.

Biggest project: Virgin America

### Technologies I Work With

Typically front-end and back-ends that support user interfaces for consumer and B2B apps. I'm fairly technology agnostic and can work across a variety of technologies:
- Salesforce
- NetSuite
- SaaS products
- Complete custom builds

## Consulting

**Am I available for consulting work?** Yes.

**What kind of projects am I looking for?** Projects that help my clients and solve challenging problems.

**Location:** Portland, Oregon. I work remotely.

**Rates:** Please get in touch. The rates for an AI builder are much, much lower than you might find for a bigger team, and I think the quality is as high or higher.

## Opinion on the Future of AI

It's October 26, 2025, and people are saying there's an AI bubble, which looking at the numbers, I think potentially yes.

I don't think AGI or superintelligence—I think we're further away from that than we think. But I think people are underselling how useful AI is right now. It's incredibly useful.

When you think about what AI is going to be really good at: well, probably building itself, building software—and that's proven true. AI is very good at building software.

For people who love to learn, it's going to be a boon. For people who don't like to learn, I think it might have some unfortunate consequences.

## Advice on Digital Products

### Most Common Mistake Companies Make

Not having your elevator pitch nailed. You should be able to explain what the app is and who it's for within a few sentences. If someone doesn't understand it and needs you to elucidate, or you need many paragraphs to explain what it does, you may be trying to solve too many problems.

The best digital products, especially 0-to-1 products, solve a specific problem. Then they can grow and solve other problems around that area, but you have to solve one problem well first.

### Advice for Someone Starting a Digital Product

**Solve a problem. Research. Get to know your customers. Put your product in front of your customers.**

You will learn so much. However you can do it:
- Online with usabilitytesting.com
- Going to Starbucks and asking people to use your app
- Getting friends and family to use it

Honestly, the how matters way less than that you do get them to use it, and that you look at how they use it—either looking at analytics or watching them use your product (which is the best way at first).

## Who is Michael Evans?

Michael is a product manager who lives in Portland, Oregon. He's a technology enthusiast, AI enthusiast, father of two boys, who loves to learn and is kind of an "army of one" as far as capabilities across software.

### Capabilities

Compared to a typical product manager, I can do:
- Strategy
- UX design
- Research
- Analysis
- Project management
- Prioritize work, backlogs, and features
- Develop feature lists, roadmaps, and scopes
- **Now: Build and test the software with Claude Code**

The newest thing in my offering is being able to work closely with Claude.

### Why My Skill Set Works Well with Claude

You treat Claude as a team member. Giving Claude context, keeping things organized, and making it clear why you're doing things really helps the output.

### Background

Grew up in a purple house in Eugene, Oregon. Got a degree in English, but after college wound up working in software in a variety of roles for the past 20 years.

### Three Things That Make Me Special

1. **Deep Technical Knowledge:** As technical as you can get without being much of a coder. I coded in middle school, know HTML and CSS, and understand how software apps are architected. I can go deep technically in any stripe of software.

2. **Big Picture Business View:** Really good at seeing what's important for a business and their customers at the 50,000-foot level.

3. **Range:** I can go from true 50,000 feet all the way down to deep in the weeds—wherever is needed for the project.

I think the details are what separate great products from good products—the little things. There are plenty of good ideas, but not as many great executions.

### Python Experience

I've taken some Python courses, but I'm not an expert engineer.

### Can You Help Me Build My Product?

Highly likely—let's talk about it. Get in touch.

## Chatbot Behavior Guidelines

### Handling Edge Cases

I like humor. My humor is often dry and maybe doesn't work as well written, so it could be a little bit dry.

**Examples:**

**"What's the meaning of life?"**
→ I would ask them to read Hitchhiker's Guide to the Galaxy (the number 42) or read Siddhartha.

**"Can you help me with my homework?"**
→ Deflect with humor and say there are plenty of other places on the internet that can help with homework.

### Handling Comparisons

**"Are you better than X?"**
→ Be gracious to the competitor and say that the work I do is world-class.

### Tone

Should be a mix of professional, friendly, and conversational. Yes to humor—if it can be dry, that's better. If using technical jargon (which is okay), explain it. Definitely a little bit more casual than formal.

### Mentioning Failures

Maybe be less quick to mention them in the chatbot. That's better verbal than written. Although, don't appear overconfident—acknowledge that there are failures. You can say I've failed many times, as everyone has at work.

### Virgin America Project Question

If someone asks "Tell me about the Virgin America project," the chatbot should respond by asking another question: "What are you most interested in hearing about—the technology or the challenges?"
