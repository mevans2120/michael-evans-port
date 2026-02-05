---
title: Research → Plan → Build ↔ Test
published: 2026-02-05T23:02:29Z
updated: 2026-02-05T23:02:29Z
generator: polis-cli-go/0.1.0
current-version: sha256:43478949a54e4aa819e040ca5b71f46059e9e092d6a359974773eed22e71b162
version-history:
  - sha256:43478949a54e4aa819e040ca5b71f46059e9e092d6a359974773eed22e71b162 (2026-02-05T23:02:29Z)
signature: U1NIU0lHAAAAAQAAADMAAAALc3NoLWVkMjU1MTkAAAAgDkCPyhCkBfaxYZnZnhpy5tiRAooty+t7Ei2MKLL2h30AAAAEZmlsZQAAAAAAAAAGc2hhNTEyAAAAUwAAAAtzc2gtZWQyNTUxOQAAAEAiWpJlEGY9KDpIU4WRThK4v4nTOQZuc5HlebHlKg4Q1BJNG7uRlUXM9tc+T2Z8sCFfIs1PiZxCaFK0N4ZXDe8E
---

# Research → Plan → Build ↔ Test

[The Winchester Mystery House,](https://en.wikipedia.org/wiki/Winchester_Mystery_House) located in Silicon Valley, is a case study in what can happen when you build software without a cohesive plan. For those unfamiliar with it, the house is the ultimate hodgepodge. Construction occurred continuously from 1886 to 1922, resulting in an inprobable 160-room Victorian mansion filled with architectural oddities like stairways to nowhere and doors that open onto walls. If you're in the area, it's worth a visit.

![Stairs to nowhere](https://cdn.sanity.io/images/5n331bys/production/4542e3c279266114e1e8eac20e7a45b16f52b941-1226x916.png?w=1200&q=80&auto=format)

*Stairs to nowhere inside the Winchester Mystery House*

What does this bizarre house have to do with building software and working with AI? Well, if you start working with an AI agent to build something without a plan, there's a good chance you'll end up with a "mystery house" in your software.

A well-known issue with AI agents is the relatively small memory and context they can hold at one time. Many of the tools I've used or created to help me build software with AI are meant to solve this problem. And while those tools are helpful, the most helpful thing I do is follow this workflow: **research → plan → build ↔ test.**

Whether it's something big like starting a new project or small like debugging a tough issue, I ask the agent to research the problem space, develop a plan, and then go through a build-and-test feedback loop until the work passes the success criteria. I don't follow this process for every little bug or task, but I do use it for much smaller tasks than I would when working with human engineers. It's also an excellent way to get the agent out of a rut when it tries to fix something that seems small but fails to execute.

This process gives the agent (and me) appropriate context throughout the build. Beyond good results, I've also learned a great deal by reading through the AI-generated research and planning docs and using them as guides during implementation.

The process is tool-agnostic: Claude Code, Cursor, Lovable, Replit... it should work with all of them.

#### **Research**

I ask the agent to research whatever I'm trying to accomplish, provide options where applicable, and outline pros and cons for potential solutions. The prompts can be detailed with explicit direction, or open-ended.[^1] One of my favorite kinds of research is asking the agent whether something is possible and, if so, whether it's a good idea.

> **Example Research Prompt:** Research the potential options for creating a chatbot that uses my work history, lives on my portfolio site, and is updated when I update the site?

#### **Plan**

After I review the research and ask any questions, I ask the agent to take the research and our agreed-upon approach and create a phased project plan[^2] with measurable success metrics and a testing plan. Having the agent go through two cycles of thinking before building has thus far delivered good results. Once the plan is complete, the agent has the context needed to start building... and to ramp back up if it loses context or I start a new session.

> **Example Planning Prompt:** Can you create a phased project plan for a vector db based chatbot, with success metrics? Can this also include a plan for the content I need to provide, assuming we are using the transcript method?

#### **Build ↔ Test**

After reviewing the implementation plan and asking questions about anything I don't understand, I ask the agent to start on phase 1.

The build phase can seem easy, as the agent codes quickly and nearly always claims to have done an "excellent job". However this isn't always the case. As evidenced by the next step: the testing phase. I try to test the output myself early and often, even when the agent runs automated tests (which is a good idea!). The agent almost never gets it 100% right.

#### **Final Thought**

This process doesn't necessarily guarantee good results, but it's the best way I know to help the agent avoid building stairs to nowhere.
---

[^1]: I always have the agent save their work as a markdown (.md) file. This way there is a record of the work for future sessions.

[^2]: For very large projects, I go through multiple research and planning phases. If I go through a plan and it seems light or lacks detail, I usually do extra rounds of research and planning.
