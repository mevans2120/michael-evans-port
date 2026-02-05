# VERSION_FILE_FORMAT=1.0
# CANONICAL_FILE=posts/20260205/a-filing-cabinet-isn-t-the-best-collaborator.md
# CURRENT_HASH=sha256:e1d37b0c627652d1c9af147653d9e095ca9cd01980cee6bd82a7544552d94944

[VERSION sha256:e1d37b0c627652d1c9af147653d9e095ca9cd01980cee6bd82a7544552d94944]
TIMESTAMP=2026-02-05T23:00:26Z
PARENT=none
FULL_CONTENT_START
# A filing cabinet isn't the best collaborator

I recently participated in an interview conducted by [Anthropic Interviewer](https://www.anthropic.com/news/anthropic-interviewer), a cool new research tool Anthropic built to understand how people feel about working with AI. At one point, the interviewing agent took a step back and asked me: "If you could wave a magic wand and have AI do one thing for you, what would it be?"

What I really want is an AI that folds my family's laundry and weeds the garden. But that wasn't a useful answer, to Anthropic or myself. So I thought about how I actually work with AI and said: "I want it to remember everything we've worked on together as well as I do."

The interviewing agent pushed back: "Isn't that just a better memory feature?"

Fair question. This does seem like a fairly tactical feature for a magic wand. But thinking about it more, I’m not sure if it really is…

What I want isn't better recall. Rather, I want the agent to remember conversations the way a trusted colleague does. Not just remember what decisions we made, but also remember the relative importance of those decisions. Not just the architecture we chose, but the tradeoffs we weighed. The *process of arriving at a judgment*, not just the facts.

We're not there yet. Today, out of the box, Claude Code saves project context into [a claude.md file](https://claude.com/blog/using-claude-md-files) that gets loaded at the start of each session. This process is workable and is intended to be customized and optimized over time, but it's more a filing cabinet as opposed to a collaborator. And on complex projects, the claude.md file can become large and unwieldy, filling the agent’s context window.

So until AI can remember as well as I do, here are six ways I compensate:

**Share the context.** I don't assume the agent knows what I know, or assume that a tool you installed will do all the work. I spend the extra seconds orienting the agent with my prompt…. We're already working at warp speed.

**Messy prompts are fine.** I was comparing notes with a colleague and we both admitted that the prompts we gave our agents often had typos and awkward phrasing. But, provided they get the idea across, that's okay.

**Document progress and decisions.** I use a memory bank process integrated into my claude.md file, which serves as the knowledge management hub. The agent updates the memory bank with what it did and what it's working on at least once a session. I've found both the documentation itself and the documentation process to be helpful. Today, I use a homebrewed memory management solution.[^1]

**Trust your intuition.** If something feels off (with what the agent wrote or the steps it's taking) I immediately stop and interrogate it. If my hunch is right, and it often is, I've prevented something ill-advised from happening to the codebase. If my hunch is wrong, I usually learn something. For example, I learned a lot about deploying software to production by being wrong at first…

**Ask the agent.** While I trust my intuition, I make plenty of mistakes and get stuck fairly frequently. I ask the agent to explain concepts and to ask questions on anything in the brief it doesn't understand. The agent is more than just a worker, it can also be a teacher and advisor.

**Experiment with tools.** I've tried out the [Claude Flow](https://github.com/ruvnet/claude-flow) and [the Superpowers](https://github.com/obra/superpowers) Claude Code plugins and can recommend both. While there is significant overlap, Claude Flow excels at orchestrating work that has good definition (utilizing swarms of agents to complete tasks in parallel) and the Superpowers plugin has an excellent built-in process for helping define ideas. It's a baked-in [research → plan → build ↔ test](https://mevans.space/blog/research-plan-build-test) workflow. Also, I've experimented with creating [my own plugins and skills](https://github.com/mevans2120) and learned a bunch throughout the process. AI agents seem to have a knack for building tools for themselves.

It's not shared understanding or a magic wand. But with a bit of guidance, it's good enough to ship.
---

[^1]: I use a set of skills and slash commands that are best represented in this repo: https://github.com/mevans2120/hybrid-memory-bank-plugin
FULL_CONTENT_END

