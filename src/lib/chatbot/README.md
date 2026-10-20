# Chatbot

This directory holds the server-side pieces of the portfolio chatbot: corpus assembly, the system prompt, the follow-up trailer parser, structured logging, and the Sanity-to-text fetcher. The route that uses them is `src/app/api/chat/route.ts`.

## Design

The whole knowledge base is sent to the model on every request. It is small: twelve transcript files plus the Sanity projects, blog posts, and profile come to roughly 50k tokens. That fits comfortably in Claude Haiku 4.5's context, so there is no retrieval step, no embeddings, and no database. The model sees every document and answers from them or says it cannot. The reasoning behind this choice is in `docs/chatbot-functionality-audit-2026-10-09.md`, section 6, option B, and the implementation plan is `docs/plans/2026-10-09-chatbot-remediation.md`.

The corpus has two sources that arrive by different paths. Transcripts are markdown files in the repo, compiled into a JSON module before `next build`, so the route never touches the filesystem at request time and nothing is served from `public/`. Sanity content is fetched at request time through the Next.js data cache and invalidated by the existing Sanity webhook, so edits in the Studio reach the chatbot within seconds without a redeploy. `buildCorpus()` in `corpus.ts` merges both into one text block, wraps each document in a `<document>` tag with its title and public URL, and collects every editor-written question into a question bank. The route sends that block as a prompt-cached system message, so the model reads it from cache on all but the first request in an hour.

## Transcripts

Transcript files live in `content/chatbot/transcripts/` as `.md` or `.txt`. The build skips anything whose filename contains `_Raw` and ignores the `_Raw_Files_Ignore/` folder and non-text files such as the resume PDF. The filename becomes the document title, with underscores and hyphens turned into spaces.

Each file may begin with a frontmatter block carrying a single `questions:` key. These are the only questions the model is allowed to suggest as follow-ups for that document, so add only questions the file actually answers.

```markdown
---
questions:
  - What does Michael do outside of work?
  - What kind of music does Michael play and listen to?
  - What did Michael build for Alexander Marchant?
---
# Personal Information

I'm originally from Eugene, Oregon. ...
```

The parser in `transcript-frontmatter.ts` reads exactly that shape: a `---` fence, a `questions:` line, one `- ` item per line, and a closing `---`. Any other key is ignored. A file with no frontmatter is included with an empty question list.

### Building the corpus

```bash
npm run build:corpus
```

This runs `scripts/build-transcript-corpus.ts` and writes `src/lib/chatbot/generated/transcripts.json`, an array of `{ id, title, body, questions }`. The `generated/` folder is gitignored. You rarely run it by hand because it is wired in three places:

- `prebuild` runs it before every `next build`, locally and on Vercel.
- `pretest` runs it before `vitest`.
- `vitest.global-setup.ts` builds it if the file is missing, so a fresh checkout can run a single test file without `npm test`.

If you edit a transcript while `next dev` is running, run `npm run build:corpus` again. The dev server picks up the new JSON on the next request.

## Sanity content

`sanity-fetcher.ts` queries `project`, `blog`, `profile`, and `aiProject` documents with `productionClient` and converts their Portable Text to plain text. Every fetch passes `{ next: { revalidate: false, tags: ['sanity', 'chatbot-corpus'] } }`, so the result is cached indefinitely by the Next.js data cache until one of those tags is revalidated.

The webhook at `src/app/api/webhooks/sanity/route.ts` always revalidates `sanity`, and additionally revalidates `chatbot-corpus` when the changed document is one of the four types above. Publishing in the Studio therefore refreshes the chatbot's view of the content on the next chat request. Drafts are skipped.

The `project`, `blog`, and `profile` schemas each have a `chatbotQuestions` string array labelled "Chatbot: Suggested Questions" in the Studio. It serves the same purpose as the transcript frontmatter: the questions an editor adds there are the only follow-ups the model may suggest about that document. `aiProject` documents carry no questions and no URL.

Projects become `/case-studies/<slug>`, posts `/blog/<slug>`, and the profile `/about`. A project with `chatbotOnly` set is included in the corpus text but left out of the list of linkable pages, since it has no public page.

## Prompt and output contract

`prompt.ts` exports `buildInstructions(pages)`, a pure function that returns the instruction text, and `REFUSAL_SENTENCE`. The instructions tell the model to answer only from the knowledge base, to use the refusal sentence verbatim when it cannot, to link only to pages in the manifest and only by the exact title and relative path listed, and to end every reply with a follow-up trailer.

The refusal sentence is:

```
I don't have that in Michael's materials.
```

The production smoke test greps for it, so changing it means changing `scripts/chatbot-smoke-checks.ts` expectations too. They import the constant, so the TypeScript side cannot drift, but the model's behaviour should be re-checked after any prompt edit.

The trailer is the last line of the answer:

```
FOLLOWUPS: ["first question", "second question"]
```

`followups.ts` exports `FOLLOWUP_MARKER`, `MAX_FOLLOWUPS`, and `splitFollowUps(text)`, which returns `{ answer, followUps }`. The marker only counts at the start of a line, the payload must be valid JSON, and at most two strings are kept. While streaming, a partial marker at the end of the text is stripped so the UI never flashes it. The same module is imported by the route, which logs the parsed follow-ups, and by `ChatSection.tsx`, which hides the trailer and renders the questions as buttons. The model is told to pick both questions verbatim from the `<suggested-questions>` lists in the corpus. The route records any follow-up that is not in the question bank under `followUpsOffBank` so you can see when the model ignores that rule.

## Prompt caching and cost

The route calls `streamText` with two system blocks in a fixed order: the instructions, then the corpus with `providerOptions.anthropic.cacheControl = { type: 'ephemeral', ttl: '1h' }`. Anthropic caching is a prefix match, so both blocks are read from cache as long as neither changes. Editing the prompt or any corpus document invalidates the cache once; the next request pays a cache write and everything after it reads from cache again. Do not reorder those two blocks or put anything variable before them.

At the time of writing (October 2026), Haiku 4.5 list prices are $1 per million input tokens and $5 per million output tokens. A one-hour cache write is twice the input price and a cache read is a tenth of it. For a 50k-token corpus that works out to about 10 cents for the write, about half a cent per message for the cached read, and a fraction of a cent for a 200-token answer. The write happens once per hour of idle time, or once per content change. A conversation of ten messages therefore costs on the order of five cents. Check the `cacheWrite` and `cacheRead` fields on `chat.answer` events to confirm reads are happening; a run of answers with `cacheRead: 0` means something in the prefix is changing between requests.

## Request handling

`POST /api/chat` runs on the Node.js runtime with `maxDuration = 60`. It accepts `{ messages, sessionId? }` in the AI SDK UI message format. Only the most recent twelve messages are kept, and that window is then trimmed to start at a user turn, because Anthropic rejects a conversation that opens with an assistant message. Every message must have the role `user` or `assistant`; any other role fails the request. Only text parts are forwarded, each under 4,000 characters, and non-text parts are dropped. A user message left with no text parts is rejected, as is a last message that is not a user text message. All of these failures return `400` with a plain-text reason, since the client renders the response body as the error message. If the assembled corpus is under `CHATBOT_CONFIG.MIN_CORPUS_CHARS` (20,000 characters) the route returns `503`, also plain text, rather than answer from almost nothing, and an unexpected exception before streaming returns a plain-text `500`. The response carries an `X-Session-ID` header, echoing the client's UUID or minting one. Model constants live in `CHATBOT_CONFIG` in `src/lib/constants.ts`.

Suggested prompts shown before the first message come from the `chatPrompts` singleton in Sanity. They are fetched server-side in the public layout with the `chat-prompts` cache tag, which the webhook also invalidates, so they are on the page at first paint.

## Logs

`events.ts` exports `logChatEvent(event, fields)`, which writes one JSON object per line to stdout via `console.info`. Vercel captures these as runtime logs. Every line has `event` and `ts`; string fields are truncated at 500 characters.

```bash
vercel logs <deployment-url> | grep '"event":"chat.'                       # streams live logs for that deployment
vercel logs <deployment-url> --no-follow -n 1000 | grep '"event":"chat.'   # searches recent history instead
```

Given a deployment URL, `vercel logs` streams live logs, so it shows nothing until a request arrives. Add `--no-follow -n 1000` to search the most recent lines instead.

| Event | Fields | When |
|---|---|---|
| `chat.question` | `sessionId`, `turn` (messages received), `window` (messages forwarded after trimming), `text`, `corpusChars` | Request validated, before the model call |
| `chat.answer` | `sessionId`, `ms`, `chars`, `refused`, `followUps`, `followUpsOffBank`, `inputTokens`, `outputTokens`, `cacheWrite`, `cacheRead` | Stream finished, including when the client disconnected |
| `chat.error` | `sessionId`, `phase` (`request` or `stream`), `message` | Thrown before streaming, or a provider error inside the stream |
| `chat.unavailable` | `sessionId`, `reason` | Corpus too small; the route returned 503 |

Useful filters: `"refused":true` shows what visitors ask that the corpus does not cover, which is the best signal for what to add. `"followUpsOffBank":[` followed by anything other than `]` shows the model inventing follow-ups. `"phase":"stream"` errors are usually provider-side (bad key, overloaded) and arrive with HTTP 200 because the failure happens mid-stream.

## Checks

```bash
npm run validate:prompts                           # against http://localhost:3000
CHAT_BASE=https://mevans.space npm run validate:prompts
```

`scripts/validate-chat-prompts.ts` reads every active prompt from the `chatPrompts` document, posts each to `/api/chat`, and fails if any answer contains the refusal sentence or lacks the follow-up trailer. Run it after adding a suggested prompt or editing the corpus. The script needs a running server; locally that is `npm run dev`.

`.github/workflows/chatbot-smoke.yml` runs daily at 14:17 UTC and on manual dispatch against production. It runs the prompt validation and then `scripts/chatbot-smoke-checks.ts`, which asks one question the corpus answers (expecting a grounded reply with the trailer) and one it does not (expecting the refusal sentence). Both scripts share `scripts/lib/chat-client.ts`, which reassembles the assistant text from the UI message stream and throws on timeout, non-2xx status, or an error chunk.

Unit tests for this directory are in `__tests__/` and run with `npm test`. The Playwright spec for the chat UI is `e2e/chatbot.e2e.spec.ts`.

## Files

| Path | Purpose |
|---|---|
| `corpus.ts` | `buildCorpus()`: merges transcripts and Sanity into one text block, page manifest, and question bank |
| `prompt.ts` | `buildInstructions(pages)` and `REFUSAL_SENTENCE` |
| `followups.ts` | `FOLLOWUP_MARKER`, `splitFollowUps()`; shared by route and UI |
| `events.ts` | `logChatEvent()` structured logging |
| `transcript-frontmatter.ts` | Parses the `questions:` frontmatter block |
| `sanity-fetcher.ts` | GROQ queries, Portable Text to plain text, cache tags |
| `generated/transcripts.json` | Build output, gitignored |
| `__tests__/` | Vitest suites for each module above |
| `../../app/api/chat/route.ts` | The chat endpoint |
| `../../app/api/webhooks/sanity/route.ts` | Revalidates `chatbot-corpus` and `chat-prompts` |
| `../../lib/constants.ts` | `CHATBOT_CONFIG`: model, temperature, token and corpus limits |
| `../../../content/chatbot/transcripts/` | Transcript sources |
| `../../../scripts/build-transcript-corpus.ts` | Writes `generated/transcripts.json` |
| `../../../scripts/validate-chat-prompts.ts` | Checks CMS suggested prompts are answerable |
| `../../../scripts/chatbot-smoke-checks.ts` | Known-answer and refusal checks |
| `../../../scripts/lib/chat-client.ts` | Shared HTTP client for the two scripts |
| `../../../.github/workflows/chatbot-smoke.yml` | Daily production smoke test |
| `../../../vitest.global-setup.ts` | Builds the corpus for tests when missing |
