---
title: How I AI in Q4 2025
published: 2026-02-05T23:00:09Z
generator: polis-cli-go/0.1.0
current-version: sha256:6de92012dac2d34729bc48d70e3c241ae319447410775d62bde85e9b27ef08aa
version-history:
  - sha256:6de92012dac2d34729bc48d70e3c241ae319447410775d62bde85e9b27ef08aa (2026-02-05T23:00:09Z)
signature: U1NIU0lHAAAAAQAAADMAAAALc3NoLWVkMjU1MTkAAAAgDkCPyhCkBfaxYZnZnhpy5tiRAooty+t7Ei2MKLL2h30AAAAEZmlsZQAAAAAAAAAGc2hhNTEyAAAAUwAAAAtzc2gtZWQyNTUxOQAAAEAdO0p9iJkYTRoeDAcAD0z2GUDItj9F36zY4PRSnaTCdDX13iVJFW33Bqk43PRT1nUFBNmMrXaOo1zcdHfY/Y0M
---

# How I AI in Q4 2025

The catalyst was deceptively simple: I wanted to build one of the half-baked ideas that I have every so often, a voice-activated kitchen timer that didn't connect to the internet. For people who don't want Amazon or Google listening in, but still want to use the best design for a kitchen timer (its voice!). Anyway, I built a prototype in Replit in about an hour. It wasn't quite usable, it needed more work, but it was surprisingly close to functional. That got my attention, but I didn't fully grasp the implications yet.

The real revelation came when working with my 11-year-old son, who loves Dungeons & Dragons. Within an hour, we had something genuinely useful, something I use in our games. I felt like I'd discovered a super power, and needed to learn how to maximize it to its fullest potential. A colleague put it well in discussing AI's future growth: "If AI ceased to get any better than it is now, there is at least half a decade of work creating new products and improving existing ones." That realization about how quickly I could build usable software made me realize that the year-long timeline I'd always quoted was about to change dramatically.

While AI has been facile with nearly every technology I've thrown at it, there are choices you can make that greatly improve the ease of development, especially when projects get more complex. As AI has a poor memory, and occasionally sloppy habits (AI slop anyone), lean towards languages that are strongly typed, and frameworks that are widely used and have a well established set of best practices.

For example, TypeScript has become essential, not optional, but fundamental. If at all possible, don't use pure Javascript. The forced typing prevents an entire category of AI-generated errors. Every time you build for production with a Typescript project and it fails because there are type errors, be thankful those never make it to production. Next.js, React, and React Native have proven ideal. They're modern, well-documented frameworks that AI understands deeply because they're widely used in training data. While I haven't spent a lot of time working with it, I've heard that using Rust is preferable to Python for the same reason.

Test driven development or ensuring you have significant unit testing coverage of your app is also essential. I find starting out test driven can be hard if the product needs definition through testing and the design process.

![footer wireframe drawn in the terminal by Claude Code](https://cdn.sanity.io/images/5n331bys/production/12384f7138c6aa80707cc3caaaac64264d2a1406-1220x980.png?w=1200&q=80&auto=format)

*Footer wireframe drawn in the terminal by Claude Code*

I landed on Claude Code after going from Replit to Cursor to Roo Code and VS Code. While I think Roo's plugin has the best experience design, Claude Code is more powerful, faster and easier to customize to suit your workflow. It runs in the terminal, providing access to all files and CLI tools, which proves faster than VS Code plugins and more flexible than browser-based solutions. What sets Claude Code apart isn't just raw capability, it's autonomous reliability. Claude Code makes fewer mistakes than alternatives and works best when given complex, multi-step tasks to complete independently. Plus CLI apps have almost no latency. If I want Claude to stop working on something, tap the escape key and it stops. This has not been my experience with other agent coding apps.

If you would have told me this time last year that I would spend many working hours building apps in VS Code and the terminal, I would have said you were full of it. If you would have told me that I would be experimenting with a vector DB based API sandboxed MCP server approach for improving project context and reducing token usage, I would have asked you to please say that again in English... but it sounds interesting!

Over months of development, I've built comprehensive skill suites and tools. The technologies involved span Claude Code, TypeScript, Next.js, React, Git, Playwright, VS Code, Terminal, Custom Skills, and Memory Bank. The speed improvements are difficult to overstate. Implementing Sanity CMS, a task that previously took a month with multiple developers, now takes less than a week. A reasonable prototype of a functional app now takes less than an hour. Since March 2024, I've generated over 1,000 GitHub commits across 30+ projects. The variety is remarkable: AI-powered specialized agents, autonomous analyzers, RAG-powered retrieval systems, full-stack applications, mobile apps, marketing websites, and developer tools.

Every software project should leverage AI to enhance capabilities, not as an afterthought, but as a core architectural decision from day one. This means choosing TypeScript for better AI error detection, favoring single-page applications for easier AI context management, and building skills that encode best practices.

AI can work autonomously for extended periods, but human verification remains absolutely necessary. I read every significant change AI makes, scrolling through code to understand what it did and catch mistakes before they compound. This verification isn't busywork, it's where human judgment adds irreplaceable value. Surprisingly, my English degree pays dividends in AI-assisted development. Specificity in language matters enormously. The ability to choose precise words, understand context, and communicate clearly makes AI dramatically more effective. Technical knowledge is learnable; clarity of communication is harder to develop but more valuable when working with AI.
