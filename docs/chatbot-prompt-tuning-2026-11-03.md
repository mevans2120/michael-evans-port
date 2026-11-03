# Chatbot Prompt Tuning: Before and After

**Date:** November 3, 2026
**Plan:** `docs/plans/2026-11-03-chatbot-prompt-tuning.md`
**Trigger:** `docs/chatbot-local-vs-production-2026-11-03.md` showed the whole-corpus bot averaging 159 words per answer with bullet lists, against a prompt that asked for one short paragraph.

---

## Result

| Measure | Baseline | After | Threshold |
|---|---|---|---|
| Average words per answer | 158 | 78 | under 110 |
| Longest answer (words) | 263 | 109 | under 150 |
| Answers with bullet lists | 3 of 8 | 0 of 8 | 0 |
| Broken internal links | 0 | 0 | 0 |
| Answers missing the follow-up trailer | 0 | 0 | 0 |
| Refusals (NASA question) | 1 | 1 | n/a |
| Average latency, single turn | 4.2 s | 2.8 s | n/a |

Both runs: eight fixed questions, temperature 0.3, Claude Haiku 4.5, local dev server. Raw results in `docs/chatbot-eval/2026-11-03-baseline.json` and `docs/chatbot-eval/2026-11-03-after-tuning.json`. The thresholds were met on the first post-change run; the only iteration was a wording change to the "latest work" steering, which is not a length knob.

Production (the old Supabase route) averaged 103 words on the same questions, so the new bot is now shorter than the old one rather than longer.

---

## What changed

1. **The prompt is split in two.** `buildInstructions()` (identity, grounding, attribution, links) is sent before the corpus and sits inside the cached prefix. A new `buildFormatRules()` (single paragraph under 90 words, no lists, one bold phrase at most, the follow-up trailer contract) is sent as a third system message *after* the corpus. The model follows the most recent instructions most reliably, and edits to the format block never invalidate the 50k-token cache.
2. **Output cap lowered from 1000 to 400 tokens.** A 90-word answer, a link line, and the trailer come to about 220 tokens. Observed output in the after run ranged from 75 to 199 tokens, so the trailer has headroom.
3. **"Latest work" steering.** The instructions now tell the model that blog posts carry a `Published:` date, to lead with the most recent one and say when it was published, and to mention undated projects only if clearly described as current.
4. **ISO dates in blog headers.** The fetcher used to append a locale-formatted date at the bottom of each post; it now writes `Published: YYYY-MM-DD` directly under the URL line.
5. **A kept eval script.** `npm run eval:chat` runs the eight questions and exits non-zero on any threshold breach, so future prompt edits are measured, not eyeballed.

Cache evidence from the dev log after the change: first request `cacheWrite: 50669, cacheRead: 0`; every later request `cacheWrite: 0, cacheRead: 50669`. The prefix shrank from 50,881 to 50,669 tokens because the voice section moved out of the cached block.

## Final format rules text

```
## How to write the answer
- Write a single paragraph of 2 to 4 sentences, under 90 words. This limit is strict.
- Plain prose only: no bullet points, no numbered lists, no headings, no tables, no line breaks inside the paragraph. If the source material is a list, summarize it in a sentence instead of reproducing it.
- Open with the specific project, post, or topic name. Warm, direct, conversational; contractions are fine; no hype words or superlatives.
- **Bold** at most one phrase. No italics.
- It is fine to leave details out. The user can click the link or a follow-up question for more.

## Follow-up questions
End every reply with one final line in exactly this form:
FOLLOWUPS: ["first question", "second question"]
- Choose both questions VERBATIM from any <suggested-questions> list anywhere in the knowledge base. If the document you drew on has no such list, pick from other documents' lists, preferring the most closely related document. Never write a question that is not in a list.
- Prefer one question from the document you just used and one from a different document the user has not asked about yet.
- Do not repeat a question the user already asked or that you already suggested in this conversation.
- If you had to use the refusal sentence, still suggest two questions from the knowledge base so the user can find what IS covered.
- The line must be valid JSON after the marker. Nothing may follow it.
```

---

## What did not fully change

**"Tell me Michael's latest work with AI" still leads with PostPal.** After the steering change, one of two trial answers mentioned the dated blog post ("Published in October 2025, his blog post How I AI in Q4 2025...") and linked it; the other stayed on PostPal. The PostPal document describes the project as currently seeking beta providers, which the steering line permits as "clearly described as current." Both answers are grounded. If a blog-first answer is wanted every time, the content-side fix is to give the `How I AI in Q4 2025` post two or three `chatbotQuestions` in Sanity so the question bank pulls toward it, or to add a line to the PostPal document stating its date. I stopped after one wording iteration rather than over-fit the prompt to one question.

**Follow-up relevance after blog answers.** The Gag Scale answer still offers follow-ups from unrelated transcripts because no blog document has `chatbotQuestions` yet. Same content fix as above.

## Known limits of the eval

Eight single-turn questions at temperature 0.3. Multi-turn behavior (not repeating links or follow-ups across a conversation) and UI rendering are covered only by the Playwright `@model` tests. Model variance between runs was small in practice (average 79 then 78 words on two consecutive runs) but a borderline result should be re-run before anyone edits the prompt in response.
