# Agentic Engineering Journey

## Background: The "Oh Shit" Moment

After completing the Casa Bonita project at Raw Materials, I finally had time to pay attention to AI beyond just following the news. I'd been impressed by AI's capabilities in copy editing and domain expertise across various subjects, but hadn't experimented much myself.

In early 2024, I tried prompt prototyping products and was unimpressed. Then someone told me about Replit, and everything changed.

### The Kitchen Timer Experiment

I wanted a voice-activated kitchen timer that didn't connect to the internet. I loved my Alexa for voice-activated cooking timers (you can set multiple timers hands-free when your hands are dirty), but I was increasingly uncomfortable with having an internet-connected listening device in my house. With AI's capabilities, I realized Amazon could do far more with that data than I'd previously thought.

I built a prototype in Replit in about an hour. It wasn't quite usable—it needed more work—but it was surprisingly close to functional. That got my attention.

### The Dungeon Tracker Breakthrough

The real revelation came when working with my 11-year-old son, who loves Dungeons & Dragons. I serve as dungeon master for some of his and his friends' campaigns. One aspect of D&D I appreciate is that everyone tracks everything on paper—no screens involved, which I think is valuable for kids.

However, as the DM, I always had a computer and needed to track initiative (who goes first in combat) and hit points. I thought we could build an app for this. Within an hour, we had something useful—something I could actually use in our games. It's called **Dungeon Tracker** and is available on my GitHub.

This was my **"oh shit" moment**. I had always said it took about a year to build anything complex for clients (research, strategy, design, prototyping, and development). Seeing how fast AI could produce usable software made me realize that timeline was about to change dramatically. But having been focused on Casa Bonita, I didn't know what everyone else thought about this shift.

---

## The AI Research Project

To understand the current state of AI in the industry, I conducted interviews with people at various levels—C-suite executives, VPs, directors, and individual contributors. I asked about:

- How they use AI
- What they think the future will look like
- How AI has impacted their workplace
- What they find useful

The results were fascinating and are documented in my AI Research Presentation. During this project, I was simultaneously progressing as an **"agentic engineer"** (also known as **"vibe coding"**).

---

## The Evolution of My Workflow

### Tool Progression

I quickly outgrew Replit and switched to **Cursor** after hearing it was a step up. Cursor offered much more flexibility by working with local files, which made it faster and more straightforward to verify work quality. It also expanded my technical capabilities.

### Current Predictions

After ChatGPT-5 launched and proved to be only incrementally better rather than transformationally better, my suspicions were confirmed: it's going to be a while before we have AI as smart as we want it to be.

AI has limitations. It can't smell, can't properly hear, can't walk around easily like humans, and doesn't have diverse real-world experiences. However, it can know the entire internet and vast collections of books—it can be very book smart. But that only gets you so far.

AI is particularly good at coding and building software, which makes sense—AI understands itself and software is native to its domain. It's also getting good at writing because natural language is fundamental to it.

**Will AI be smart enough to run a company in the next 10 years?** I don't think so. It reminds me of self-driving cars—impressive technology that can take you anywhere within certain cities, but heavily gated for safety. Consumers can't buy these cars for unrestricted use because it's hard technology with real risks.

---

## Working with the AI Builders Collective

I've been collaborating with the AI Builders Collective—highly technical product managers with extensive experience building software who see the potential in agentic engineering. Together, we've been building products and refining best practices.

---

## Best Practices for Agentic Engineering

### Technology Stack

- **Single-page applications**: Easier for AI to keep in context
- **TypeScript and React**: TypeScript's forced typing prevents errors
- **Next.js**: Good framework choice for React projects

TypeScript is crucial because AI doesn't keep everything in memory. Without typed variables, it might use incorrect names when building new features, causing production builds to fail. Type errors force corrections before moving forward, and you want to ensure AI fixes them properly without resorting to "any" hacks.

### Prompt Engineering

For system prompts, I prefer having AI do as much work as possible (with exceptions for privacy and important keys). The workflow:

1. Have AI write the first pass
2. Read and evaluate it
3. Iterate and ask for advice
4. Work with Claude through the entire process

I don't reuse prompts much (except "update memory bank commit push"). The key to good prompts is **specificity**:

- Write the prompt, then review it
- Ask: Could any words have other meanings?
- Find more specific words when possible
- Don't worry about grammar, focus on specificity
- Reuse established terms and names consistently

Interestingly, my English major—which I thought might not be useful for software—is now paying dividends.

### Reliability and Hallucinations

You have to read what AI is doing. This is why I've struggled with orchestration (multiple agents running simultaneously)—AI will sometimes start working on something incorrect or rewrite existing features.

AI writes in specific patterns. If it's writing as though a feature doesn't exist when you know it does, it probably doesn't know about it.

With **Claude Code**, you can quickly redirect: "Stop working on that. Here's why. Work on something else instead."

I often have multiple VS Code windows or terminals open, working side by side on different tasks. Even when AI works autonomously, I scroll through what it did to ensure it didn't do anything problematic. If it did, I revert it.

I wish there were a better way, but currently: AI can work autonomously for long periods, and it doesn't take long to read through and verify its work.

---

## Why Claude Code

I've ended up spending significant time in the terminal, which I wouldn't have expected. The terminal is incredibly powerful:

- Access to all your files
- Connection to numerous other CLIs and terminal apps
- Claude can do extensive work through the CLI
- Seems faster than VS Code plug-ins

The terminal app's plug-ins and skills system is elegant—you put plain English instructions in files in a folder. The invisible `.claude` file contains all your settings and can be rewritten as needed. This system is very powerful.

I used to use Lovable for prototyping and design-first work because of its visual interface, but it wasn't nearly as reliable as Claude for following instructions.

**Claude Code is:**
- The most powerful
- The fastest
- Works best autonomously
- Makes the fewest mistakes

---

## Current Challenges

### Memory

Memory remains a problem. AI doesn't have memories like humans do. This may improve with clever solutions, but it's a persistent challenge.

### Adherence

Getting AI to adhere to rules and processes you've laid out is difficult. You can write guidelines in `Claude.md`, put them in skills, or include them in subagents—and sometimes AI will simply ignore them.

### Common Issues

These insights apply to virtually all projects:

- Adherence problems
- Memory issues
- AI deciding to do the wrong thing
- AI making things up completely

These issues happen on every project. It's part of the current reality of working with AI.

---

## Conclusion

Despite the challenges, agentic engineering is transforming how we build software. The speed at which functional applications can be created is remarkable. While AI isn't perfect and requires oversight, it's becoming an increasingly powerful tool for anyone willing to learn its strengths and limitations.
