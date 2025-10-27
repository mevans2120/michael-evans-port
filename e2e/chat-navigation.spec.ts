import { test, expect } from '@playwright/test';

test.describe('ChatSection Navigation UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display welcome message when chat is expanded', async ({ page }) => {
    // Check if we're on desktop or mobile by viewport size
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      // On desktop, need to expand the panel first
      // Look for the AI Assistant header
      const aiHeader = page.locator('text=AI Assistant');
      await expect(aiHeader).toBeVisible({ timeout: 10000 });

      // Click to expand chat if needed
      await aiHeader.click();
    }

    // Wait for welcome message to appear
    const welcomeMessage = page.locator('text=Hi! I can help you explore Michael\'s portfolio');
    await expect(welcomeMessage).toBeVisible({ timeout: 10000 });

    // Verify text is white/visible (not gray)
    const messageElement = await welcomeMessage.locator('..').locator('..');
    const color = await messageElement.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Should be white (rgb(255, 255, 255)) or close to it
    expect(color).toContain('255');
  });

  test('should display suggested prompts', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      const aiHeader = page.locator('text=AI Assistant');
      await aiHeader.click();
    }

    // Wait for suggested prompts to appear
    // The prompts are randomized, so just check that some buttons exist
    const promptButtons = page.locator('button').filter({ hasText: /Tell me|Show me|What/i });
    await expect(promptButtons.first()).toBeVisible({ timeout: 10000 });

    // Should have 2 suggested prompts
    const count = await promptButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should send message and receive response', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      const aiHeader = page.locator('text=AI Assistant');
      await aiHeader.click();
    }

    // Wait for input to be visible
    const input = page.locator('input[placeholder*="Ask about Michael"]');
    await expect(input).toBeVisible({ timeout: 10000 });

    // Type a message
    await input.fill('Tell me about Virgin America');

    // Click send button
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // Wait for user message to appear
    const userMessage = page.locator('text=Tell me about Virgin America').first();
    await expect(userMessage).toBeVisible({ timeout: 5000 });

    // Wait for AI response to start appearing (look for "Thinking..." or actual response)
    const thinkingIndicator = page.locator('text=Thinking...');
    const responseText = page.locator('text=/Virgin America|airline|website/i').first();

    // Either should appear
    await expect(
      Promise.race([
        thinkingIndicator.waitFor({ timeout: 10000 }).catch(() => null),
        responseText.waitFor({ timeout: 15000 })
      ])
    ).resolves.toBeTruthy();

    // Wait for actual response text (not just thinking indicator)
    await expect(responseText).toBeVisible({ timeout: 20000 });

    // Verify response text is white/visible
    const responseElement = await responseText.locator('..').locator('..');
    const color = await responseElement.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(color).toContain('255'); // Should be white
  });

  test('should handle suggested prompt clicks', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      const aiHeader = page.locator('text=AI Assistant');
      await aiHeader.click();
    }

    // Wait for suggested prompts
    const promptButtons = page.locator('button').filter({ hasText: /Tell me|Show me|What/i });
    await expect(promptButtons.first()).toBeVisible({ timeout: 10000 });

    // Get the text of the first prompt
    const firstPrompt = promptButtons.first();
    const promptText = await firstPrompt.textContent();

    // Click the suggested prompt
    await firstPrompt.click();

    // Verify the prompt was sent as a user message
    const userMessage = page.locator(`text=${promptText}`).first();
    await expect(userMessage).toBeVisible({ timeout: 5000 });

    // Wait for response
    await page.waitForTimeout(2000); // Give API time to respond

    // Check that we got some response (the suggested prompts should disappear)
    const stillVisible = await promptButtons.first().isVisible().catch(() => false);
    expect(stillVisible).toBe(false); // Prompts should be hidden after sending message
  });

  test('should auto-scroll to bottom as messages arrive', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      const aiHeader = page.locator('text=AI Assistant');
      await aiHeader.click();
    }

    const input = page.locator('input[placeholder*="Ask about Michael"]');
    await expect(input).toBeVisible({ timeout: 10000 });

    // Send a message that will generate a long response
    await input.fill('Tell me about all your projects');
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // Wait for response to start
    await page.waitForTimeout(3000);

    // Check if the scroll container exists and is at the bottom
    const scrollContainer = page.locator('.overflow-y-auto').first();

    // Wait a bit for scrolling
    await page.waitForTimeout(1000);

    const isAtBottom = await scrollContainer.evaluate((el) => {
      const threshold = 50; // Allow 50px threshold
      return Math.abs((el.scrollHeight - el.scrollTop) - el.clientHeight) < threshold;
    });

    expect(isAtBottom).toBe(true);
  });

  test('should handle input focus and expand chat', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    // Start collapsed
    const input = page.locator('input[placeholder*="Ask about Michael"]');

    // Input should become visible when focused (this tests handleInputFocus)
    await input.click();
    await expect(input).toBeFocused({ timeout: 5000 });

    // Chat should be expanded after focusing input
    const welcomeMessage = page.locator('text=Hi! I can help you explore Michael\'s portfolio');
    await expect(welcomeMessage).toBeVisible({ timeout: 5000 });
  });

  test('should display error message if API fails', async ({ page }) => {
    // Intercept API call and make it fail
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Test error' })
      });
    });

    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      const aiHeader = page.locator('text=AI Assistant');
      await aiHeader.click();
    }

    const input = page.locator('input[placeholder*="Ask about Michael"]');
    await input.fill('Test message');

    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // Should show error message
    const errorMessage = page.locator('text=/Error|Something went wrong/i');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should disable input and show loading state while processing', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = viewport && viewport.width >= 768;

    if (isDesktop) {
      const aiHeader = page.locator('text=AI Assistant');
      await aiHeader.click();
    }

    const input = page.locator('input[placeholder*="Ask about Michael"]');
    await input.fill('Test question');

    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // Input should be disabled while loading
    await expect(input).toBeDisabled({ timeout: 5000 });

    // Should show loading spinner
    const loadingSpinner = page.locator('[class*="animate-spin"]').first();
    await expect(loadingSpinner).toBeVisible({ timeout: 5000 });

    // Wait for response to complete
    await page.waitForTimeout(5000);

    // Input should be enabled again
    await expect(input).toBeEnabled({ timeout: 10000 });
  });
});
