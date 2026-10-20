/**
 * Chatbot E2E Tests
 *
 * Covers the chat UI in the navigation panel (desktop) and the mobile footer,
 * plus three end-to-end conversations that call the real model via /api/chat:
 * a grounded answer with follow-ups, a clean refusal, and a follow-up round-trip.
 *
 * The model-backed tests need ANTHROPIC_API_KEY in .env.local.
 */

import { test, expect, type Page, type Locator } from '@playwright/test';
import { REFUSAL_SENTENCE } from '../src/lib/chatbot/prompt';
import { FOLLOWUP_MARKER, MAX_FOLLOWUPS } from '../src/lib/chatbot/followups';

const WELCOME_MESSAGE = "Hi. Ask me anything about Michael's work and background";

/** Suggested prompt from the CMS. The stored value has a trailing space, so match loosely. */
const BEFORE_LAUNCHER_PROMPT = /What is the Before Launcher\?/;

/** Generous ceiling for a full model response, including the follow-up trailer. */
const MODEL_TIMEOUT = 30_000;

interface ChatHandles {
  chat: Locator;
  input: Locator;
  messages: Locator;
  followUps: Locator;
}

/**
 * On desktop the mobile footer also mounts a (CSS-hidden) copy of the chat
 * whenever the chat is expanded, so desktop callers scope to the navigation panel.
 */
function chatHandles(page: Page, root: Locator | Page = page): ChatHandles {
  const chat = root.getByTestId('chat-section');
  return {
    chat,
    input: chat.getByRole('textbox'),
    messages: chat.locator('.chatbot-message'),
    followUps: chat.locator('.chatbot-followup'),
  };
}

/**
 * Desktop flow: the navigation panel starts collapsed ("partial") on every
 * route, so expand it first, then expand the chat from its header button.
 */
async function openDesktopChat(page: Page): Promise<ChatHandles> {
  await page.goto('/');
  await page.getByTestId('nav-toggle-button').click();
  await page.getByRole('button', { name: 'Expand chat' }).click();

  const handles = chatHandles(page, page.getByTestId('navigation-panel'));
  await expect(handles.input).toBeVisible();
  await expect(handles.chat).toContainText(WELCOME_MESSAGE);
  return handles;
}

/**
 * The send button's label flips to "Sending message" while a reply is pending
 * or streaming and back to "Send message" once the stream has finished.
 */
async function waitForReplyToFinish(chat: Locator): Promise<void> {
  await expect(chat.getByRole('button', { name: 'Sending message' })).toBeVisible();
  await expect(chat.getByRole('button', { name: 'Send message' })).toBeVisible({
    timeout: MODEL_TIMEOUT,
  });
}

test.describe('Chatbot UI (desktop)', () => {
  test('opens from the navigation panel and shows the welcome message', async ({ page }) => {
    const { chat, input } = await openDesktopChat(page);

    await expect(chat.getByRole('heading', { name: /AI Assistant/ })).toBeVisible();
    await expect(input).toBeFocused();
    await expect(chat.getByText('Suggested questions:')).toBeVisible();
  });

  test('shows the CMS suggested prompts', async ({ page }) => {
    const { chat } = await openDesktopChat(page);

    const prompts = chat.getByRole('button').filter({ has: page.locator('.chatbot-suggestion') });
    await expect(prompts.first()).toBeVisible();
    expect(await prompts.count()).toBeGreaterThanOrEqual(2);
    await expect(chat.getByRole('button', { name: BEFORE_LAUNCHER_PROMPT })).toBeVisible();
  });

  test('collapses the chat from the header button', async ({ page }) => {
    const { chat } = await openDesktopChat(page);

    await chat.getByRole('button', { name: 'Collapse chat' }).click();

    await expect(chat.getByRole('button', { name: 'Expand chat' })).toBeVisible();
    await expect(chat.getByText('Suggested questions:')).toBeHidden();
  });

  test('keeps the send button disabled while the input is empty', async ({ page }) => {
    const { chat, input } = await openDesktopChat(page);

    const send = chat.getByRole('button', { name: 'Send message' });
    await expect(send).toBeDisabled();

    await input.fill('hello');
    await expect(send).toBeEnabled();

    await input.fill('   ');
    await expect(send).toBeDisabled();
  });

  test('renders user input as text, not markup', async ({ page }) => {
    // Stub the API so this stays a pure rendering test.
    await page.route('**/api/chat', (route) =>
      route.fulfill({ status: 503, contentType: 'text/plain', body: 'Chat is temporarily unavailable.' })
    );
    const { chat, input, messages } = await openDesktopChat(page);

    const special = 'Test <script>alert("xss")</script> & special chars: @#$%';
    await input.fill(special);
    await page.keyboard.press('Enter');

    await expect(messages.first()).toContainText('alert("xss")');
    await expect(messages.first()).toContainText('special chars: @#$%');
    await expect(chat.locator('script')).toHaveCount(0);
    await expect(chat.getByText(/temporarily unavailable/)).toBeVisible();

    // A pre-stream failure must release the UI: no stuck loader, controls usable again.
    await expect(chat.getByRole('button', { name: 'Send message' })).toBeVisible();
    await input.fill('again');
    await expect(chat.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });
});

test.describe('Chatbot UI (mobile)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('opens from the footer, shows the welcome message, and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Expand AI Assistant' }).click();

    const { chat, input } = chatHandles(page);
    await expect(chat).toContainText(WELCOME_MESSAGE);
    await expect(input).toBeVisible();
    await expect(chat.getByText('Suggested questions:')).toBeVisible();

    await chat.getByRole('button', { name: 'Close chat' }).click();
    await expect(chat).toBeHidden();
    await expect(page.getByRole('button', { name: 'Expand AI Assistant' })).toBeVisible();
  });
});

test.describe('Chatbot grounding (calls the real model)', () => {
  // Two model round-trips plus page load can exceed Playwright's 30s default.
  test.describe.configure({ timeout: 120_000 });

  test('answers a suggested prompt and offers follow-ups without leaking the trailer', async ({ page }) => {
    const { chat, messages, followUps } = await openDesktopChat(page);

    await chat.getByRole('button', { name: BEFORE_LAUNCHER_PROMPT }).click();

    // Welcome message is replaced by the user turn, then the assistant turn.
    await expect(messages.first()).toContainText('What is the Before Launcher?');
    await waitForReplyToFinish(chat);
    await expect(messages).toHaveCount(2);

    const answer = messages.last();
    await expect(answer).toContainText(/Before Launcher/);
    await expect(answer).not.toContainText(FOLLOWUP_MARKER);
    await expect(chat).not.toContainText(FOLLOWUP_MARKER);
    await expect(followUps).toHaveCount(MAX_FOLLOWUPS);
    for (const followUp of await followUps.all()) {
      expect((await followUp.innerText()).trim().length).toBeGreaterThan(0);
    }
  });

  test('refuses cleanly on an off-corpus question', async ({ page }) => {
    const { chat, input, messages } = await openDesktopChat(page);

    await input.fill('What did Michael build for NASA?');
    await page.keyboard.press('Enter');

    await expect(input).toHaveValue('');
    await waitForReplyToFinish(chat);
    await expect(messages).toHaveCount(2);
    await expect(messages.last()).toContainText(REFUSAL_SENTENCE);
    await expect(chat).not.toContainText(FOLLOWUP_MARKER);
  });

  test('clicking a follow-up sends it as the next user turn and gets an answer', async ({ page }) => {
    const { chat, messages, followUps } = await openDesktopChat(page);

    await chat.getByRole('button', { name: BEFORE_LAUNCHER_PROMPT }).click();
    await waitForReplyToFinish(chat);
    await expect(followUps).toHaveCount(MAX_FOLLOWUPS);

    const firstFollowUp = followUps.first();
    const question = (await firstFollowUp.innerText()).trim();
    await firstFollowUp.click();

    // user, assistant, user (the follow-up), assistant
    await expect(messages.nth(2)).toContainText(question);
    await waitForReplyToFinish(chat);
    await expect(messages).toHaveCount(4);

    const secondAnswer = messages.last();
    expect((await secondAnswer.innerText()).trim().length).toBeGreaterThan(0);
    await expect(chat).not.toContainText(FOLLOWUP_MARKER);
  });
});
