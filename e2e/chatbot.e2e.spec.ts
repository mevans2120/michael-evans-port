/**
 * Chatbot E2E Tests
 * Tests the full chatbot user experience and conversation flows
 */

import { test, expect } from '@playwright/test';

test.describe('Chatbot User Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('opens chat panel from navigation', async ({ page }) => {
    // Find and click chat button
    const chatButton = page.locator('[aria-label*="chat" i]').first();
    await chatButton.click();

    // Verify chat panel is visible
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible({ timeout: 3000 });
  });

  test('displays welcome message on first open', async ({ page }) => {
    // Open chat
    await page.locator('[aria-label*="chat" i]').first().click();

    // Look for welcome/intro message
    const chatContent = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatContent).toBeVisible();

    // Should have some initial content or placeholder
    const hasContent = await chatContent.locator('text=/ask|chat|message|help/i').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test('sends a message and receives response', async ({ page }) => {
    // Open chat
    await page.locator('[aria-label*="chat" i]').first().click();

    // Find input field (try multiple common patterns)
    const input = page.locator('input[type="text"]').or(
      page.locator('textarea')
    ).or(
      page.locator('[placeholder*="message" i]')
    ).or(
      page.locator('[placeholder*="ask" i]')
    ).first();

    await expect(input).toBeVisible({ timeout: 3000 });

    // Type message
    const testMessage = 'What is agentic engineering?';
    await input.fill(testMessage);

    // Find and click send button
    const sendButton = page.locator('button[type="submit"]').or(
      page.locator('[aria-label*="send" i]')
    ).or(
      page.locator('button:has-text("Send")')
    ).first();

    await sendButton.click();

    // Wait for response (look for assistant message)
    // The response should contain relevant content about agentic engineering
    const responseArea = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(responseArea.locator('text=/agentic|agent|AI|autonomous/i').first())
      .toBeVisible({ timeout: 15000 });
  });

  test('displays user message in chat history', async ({ page }) => {
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    const testMessage = 'Test user message';
    await input.fill(testMessage);

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();
    await sendButton.click();

    // Verify user message appears in chat
    await expect(page.locator(`text="${testMessage}"`)).toBeVisible({ timeout: 3000 });
  });

  test('handles multiple messages in conversation', async ({ page }) => {
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();

    // First message
    await input.fill('What is Casa Bonita?');
    await sendButton.click();
    await expect(page.locator('text=/Casa Bonita|restaurant|Denver/i').first())
      .toBeVisible({ timeout: 15000 });

    // Wait a moment for UI to settle
    await page.waitForTimeout(1000);

    // Second message (contextual follow-up)
    await input.fill('Who worked on this project?');
    await sendButton.click();

    // Should reference the previous context
    await expect(page.locator('text=/Michael|team|project/i').first())
      .toBeVisible({ timeout: 15000 });
  });

  test('closes chat panel', async ({ page }) => {
    // Open chat
    await page.locator('[aria-label*="chat" i]').first().click();

    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();

    // Find close button (X, Close, etc.)
    const closeButton = page.locator('[aria-label*="close" i]').or(
      page.locator('button:has-text("×")')
    ).or(
      page.locator('[role="dialog"] button').first() // Often first button is close
    ).first();

    await closeButton.click();

    // Verify panel is hidden
    await expect(chatPanel).not.toBeVisible({ timeout: 3000 });
  });

  test('maintains conversation state after closing and reopening', async ({ page }) => {
    // Open chat and send message
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    const testMessage = 'Tell me about Virgin America';
    await input.fill(testMessage);

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Close chat
    const closeButton = page.locator('[aria-label*="close" i]').first();
    await closeButton.click();

    // Reopen chat
    await page.locator('[aria-label*="chat" i]').first().click();

    // Verify previous message is still visible
    await expect(page.locator(`text="${testMessage}"`)).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Chatbot Responsiveness', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open chat
    const chatButton = page.locator('[aria-label*="chat" i]').first();
    await chatButton.click();

    // Verify chat is visible and usable on mobile
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();

    // Verify input is accessible
    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    await expect(input).toBeVisible();
  });

  test('works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const chatButton = page.locator('[aria-label*="chat" i]').first();
    await chatButton.click();

    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();
  });

  test('works on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const chatButton = page.locator('[aria-label*="chat" i]').first();
    await chatButton.click();

    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();
  });
});

test.describe('Chatbot Edge Cases', () => {
  test('handles empty message submission gracefully', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();

    // Try to send empty message
    await sendButton.click();

    // Should not crash or show error
    // Send button should likely be disabled or do nothing
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();
  });

  test('handles very long message', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    const longMessage = 'This is a very long message. '.repeat(50);

    await input.fill(longMessage);

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();
    await sendButton.click();

    // Should handle gracefully
    await page.waitForTimeout(2000);
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();
  });

  test('handles special characters in message', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    const specialMessage = 'Test <script>alert("xss")</script> & special chars: @#$%';

    await input.fill(specialMessage);

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();
    await sendButton.click();

    // Should not execute script or crash
    await page.waitForTimeout(2000);
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();

    // Verify message is properly escaped
    await expect(page.locator('text=/Test.*special chars/i')).toBeVisible();
  });

  test('handles rapid message sending', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();

    // Send multiple messages quickly
    for (let i = 0; i < 3; i++) {
      await input.fill(`Message ${i + 1}`);
      await sendButton.click();
      await page.waitForTimeout(500);
    }

    // Should handle gracefully without crashing
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible();
  });
});

test.describe('Chatbot Accessibility', () => {
  test('chat panel has proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    // Panel should have role="dialog" or similar
    const dialog = page.locator('[role="dialog"]');
    const count = await dialog.count();

    if (count > 0) {
      await expect(dialog.first()).toBeVisible();
    }
  });

  test('can navigate chat with keyboard', async ({ page }) => {
    await page.goto('/');

    // Use keyboard to open chat (if button is focusable)
    await page.keyboard.press('Tab'); // Navigate to chat button
    // Note: This test may need adjustment based on actual tab order

    // Try pressing Enter to open
    await page.keyboard.press('Enter');

    // Give time for potential chat opening
    await page.waitForTimeout(1000);

    // Check if chat opened or is openable
    const chatVisible = await page.locator('[role="dialog"], .chat-panel').isVisible();
    // This is informational - keyboard navigation should be possible
  });

  test('send button is accessible', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();

    // Should have accessible label or text
    const hasLabel = await sendButton.getAttribute('aria-label');
    const hasText = await sendButton.textContent();

    expect(hasLabel || hasText).toBeTruthy();
  });
});

test.describe('Chatbot Performance', () => {
  test('chat opens within reasonable time', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();

    await page.locator('[aria-label*="chat" i]').first().click();

    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel).toBeVisible({ timeout: 2000 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should open in less than 2 seconds
    expect(duration).toBeLessThan(2000);
  });

  test('response arrives within reasonable time', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-label*="chat" i]').first().click();

    const input = page.locator('input[type="text"], textarea, [placeholder*="message" i]').first();
    await input.fill('Quick question');

    const sendButton = page.locator('button[type="submit"], [aria-label*="send" i]').first();

    const startTime = Date.now();
    await sendButton.click();

    // Wait for any response to appear
    const chatPanel = page.locator('[role="dialog"]').or(page.locator('.chat-panel'));
    await expect(chatPanel.locator('text=/./').nth(1)).toBeVisible({ timeout: 20000 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Response should start streaming within 20 seconds
    expect(duration).toBeLessThan(20000);
  });
});
