# VERSION_FILE_FORMAT=1.0
# CANONICAL_FILE=posts/20260205/gemini-3-and-antigravity-versus-claude-code.md
# CURRENT_HASH=sha256:fab7511ffb2d95ca80bb1f13fb5764a699008121de61452fa453ebdfabb30160

[VERSION sha256:fab7511ffb2d95ca80bb1f13fb5764a699008121de61452fa453ebdfabb30160]
TIMESTAMP=2026-02-05T23:00:09Z
PARENT=none
FULL_CONTENT_START
# Gemini 3 and Antigravity versus Claude Code

I'm quite fond of Claude. In my head, I say Claude's name in a German accent whenever I think about the agent. Sometimes I even speak it aloud that way. I'm also fond of [Claude Code ](https://www.claude.com/product/claude-code)and all its quirky terminal-ness. Whenever it's working without needing assistance or having anything to say, the app animates a funny verb in the present tense: meandering, pogoing, prowling, caramelizing. I'm convinced the agent picks from a very large list based on... something. I don't know what. It will draw what feel like ASCII art wireframes and flows when it wants to visually show how something will look. I love when it does that.

![wireframe of the footer](https://cdn.sanity.io/images/5n331bys/production/12384f7138c6aa80707cc3caaaac64264d2a1406-1220x980.png?w=1200&q=80&auto=format)

*Little wireframe Claude Code did. *

Aside from having some amount of soul, Claude Code is extremely stable compared to other coding agents I've used. It rarely slows down, and rarely crashes. The only feature that doesn't reliably work is when you want to review the details (ctrl o) and then get back to the app's main context. For some reason, that can be slow. But if you want Claude Code to stop working on something, the escape key works instantly. Its one of its best features.

That said, it's far from perfect. Writing in the terminal reminds me why word processing software was invented decades ago. You can't use the mouse to edit your prompts. Copying text sort of works, but you can't cut. You can paste, but you don't see or get the chance to edit what you paste before it's submitted.

And while I like Claude Code's VS Code plugin, I found it to be a bit slower and not as fully featured as the terminal version.

So while I honestly have an emotional attachment to Claude's models and Claude Code, I'm sure it's not the endpoint for agentic engineering. Working with [Antigravity](https://antigravity.google/) and [Gemini 3 ](https://blog.google/products/gemini/gemini-3/) these past couple days has shown me that very clearly.

Antigravity, for those who don't know, is Google's new IDE, and Gemini 3 is their latest AI model. First let's talk about Gemini 3, which gives Claude Sonnet 4.5 a run for its money. While I don't do [a Pelican test with new models like Simon Willison](https://simonwillison.net/2025/Nov/18/gemini-3/) does, I do like to spend time building with a new model to evaluate the quality of the output, the process, and speed. Let me define what I mean for each.

**Output: **Did the agent solve the problem? How many defects? Did it align with the coding standards?

**Process: **How much upfront work do I have to do to get to a solution? How much back and forth with the agent needs to take place? How well does it take explicit direction? And how well does it pick up things implicitly based on how the filesystem and code are organized?

**Speed: **How quickly does it code, review codebases, and write documentation?

For output, Gemini 3 and Sonnet 4.5 seem to be equivalent. I had each build simple features yesterday and research solutions to potential problems, and they both did very good work. This honestly tilts things a bit in Gemini 3's favor, as I've spent a lot of time working with Sonnet 4.5 and have built out an extensive toolset in Claude Code. Gemini didn't have access to any of this, but still did well.

For process, I was very impressed with Gemini 3. The agent picked up that I like to document every significant solution in a markdown file and started working that way without direction. I consistently have to remind Sonnet 4.5 to document in markdown files, unless I use a subagent or skill (where I have more control). I like documentation because it means we can easily pick up where we left off, and it enables easier research of past decisions.

Speed is the only category where Claude was the clear winner, and this may only be because I was using Claude in the terminal. The Claude Code terminal app just seems to run quicker.

This brings us to Antigravity, the new IDE designed to work with agent-assisted or agent-driven development. Antigravity is a fork of VS Code (like Cursor) and feels very familiar to anyone who has used it. At first I wondered why Antigravity wasn't a plugin, and then I learned about the feature that's my best guess as to why: the agent manager.

![agent manager interface that has a left navigation, and looks a little like Slack. ](https://cdn.sanity.io/images/5n331bys/production/b42e96fee46c066b86a468c298cf0eb5e696bbb3-2394x1596.png?w=1200&q=80&auto=format)

*Slack for agents. Its a pretty good idea, with decent execution.*

This feature feels like Slack for agents. It easily allows users to deploy multiple agents at once, review the output from each, and drill into their work as necessary. It's a wonderful idea that's mostly well executed. It's totally easy to deploy multiple agents, although it's a bit unintuitive how to switch from the agent manager view to the traditional file editor view. My other issue is speed. Antigravity really feels the weight if you have a few agents running concurrently.  It slows down noticeably. I'm using an M2-powered MacBook Air, so folks on newer, faster computers may have better results.

Without this manager, I would have multiple terminal instances running Claude Code and manually keep track of them. It's a messier process, but it's workable.

Deep Chrome integration is Antigravity's other notable feature. The agent always tests its features in the browser in a separate instance of Chrome. I appreciate this feature, even though it's very much in your face. New tabs open up and take focus away from what you're working on whenever an agent finishes and wants to test something. I like the way[ Roo Code](https://roocode.com/) does it better, or how Claude Code works with a testing framework built into its process. I don't need the tests to be in my face. Plus it took me a minute to realize I was running two instances of Chrome, and why I was logged out of everything in one of them and why my Chrome was in light mode. Though that issue may have more to do with me being dense

The agent interface is also nice, although it's very similar to [Claude Code VS Code plugin](https://code.claude.com/docs/en/vs-code) (and Roo!).

So here's the question: will I switch? I'm not planning on switching to Antigravity, although I'll give it another look once it leaves the preview phase. But I am planning on working more with Gemini 3. I'm setting it up as my testing and review agent (I was using ChatGPT 5 for this work until Sonnet 4.5 came out). If Gemini continues to perform well, I may switch it to be my main coding agent. Though it will be hard for me to stop gallivanting, swooping, trotting, and puttering with Claude Code
FULL_CONTENT_END

