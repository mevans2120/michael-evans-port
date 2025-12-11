# Research → Plan → Build ↔ Test

If someone were to ask me "What's your secret?" I would point to quite a few tools and techniques that I use. But for me, the most important process to follow when designing and building with AI is to be diligent about following this workflow at nearly every step: **research → plan → build ↔ test**.

## Research

First, I ask the agent to research whatever it is we're trying to accomplish, provide options where applicable, and outline pros and cons. This can happen at the beginning of a project when trying to determine the feasibility of a particular feature or idea, or when trying to debug a complex or tough-to-solve issue.

**Examples:**
* Researching whether creating a Claude Code skill for memory and context management is a good idea
* Why is preview mode in the Sanity CMS still revalidating instead of using webhooks?
* What are the pros and cons of a monorepo approach for a mobile & web app that should have a very similar (if not the same) UI and feature set?

## Plan

After I review the research and ask any questions I have, I ask the agent to take the research and whatever approach we agreed upon (if applicable) and create a phased project plan with success metrics. If it's a smaller bug and the fix is only a few lines of code, I'll skip the planning phase.

**Examples:**
* Let's go with the proper approach (not the quick fix) for implementing time-based theming. Can you use your research to create a phased project plan with measurable success metrics?
* Can you create a phased approach for implementing this web (and soon to be mobile) app monorepo? Since this is such a large undertaking, can your plan include additional research phases before we dive deep into specific functional areas? Can the plan also include a proof of concept, so we know we're on the right track before we keep moving forward?

Once I've reviewed the research and asked for revisions if needed, I ask the agent to create a phased project plan based on the findings, with measurable success metrics (also saved as a .md file). After reviewing this plan and asking questions about anything I don't understand, I ask the agent to start on phase 1.

**Example Prompts:**
* Let's get started on phase 1
* Start on phase 1 and work through phase 3, then let's test the results

## Build ↔ Test

Now that we've started building, I compare what we're building against the success metrics to determine when is the best time to test. Should it be after phase 1, phase 2, etc.? If I don't know the answer, I'll ask the agent. While I have a way of thinking about when to test that I'm planning on posting about later [insert linkout to RS's work], the important part is that you and the agent get a chance to test and measure success. If you discover failures and improvement areas during the build process, I like to fix them right then and there.

---

**Tip:** Always save the research and planning docs as .md files.
