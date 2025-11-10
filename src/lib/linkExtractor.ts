/**
 * Link Extractor Utility
 *
 * Extracts internal preview links from markdown content to render them
 * separately from paragraph text, avoiding React hydration errors.
 */

export interface ExtractedLink {
  text: string;
  href: string;
  original: string; // Original markdown syntax
}

export interface ExtractedContent {
  textContent: string;     // Markdown with preview links removed
  links: ExtractedLink[];  // Extracted preview links
}

/**
 * Check if a link should be rendered as a rich preview card
 * @param href - The link URL
 * @returns true if the link should be extracted for preview rendering
 */
export function isPreviewableLink(href: string): boolean {
  if (!href) return false;

  // Only extract internal links to case studies and blog
  return (
    href.startsWith('/case-studies/') ||
    href.startsWith('/blog/')
  );
}

/**
 * Extract internal preview links from markdown content
 *
 * Finds all markdown links that should render as rich preview cards
 * (case studies, blog posts) and extracts them from the
 * content to be rendered separately.
 *
 * @param markdown - The markdown content to process
 * @returns Object with cleaned text content and array of extracted links
 *
 * @example
 * const input = "Check out [My Project](/case-studies/foo) for more!";
 * const result = extractInternalLinks(input);
 * // result.textContent: "Check out  for more!"
 * // result.links: [{ text: "My Project", href: "/case-studies/foo", original: "[My Project](/case-studies/foo)" }]
 */
export function extractInternalLinks(markdown: string): ExtractedContent {
  if (!markdown) {
    return { textContent: '', links: [] };
  }

  const links: ExtractedLink[] = [];
  let textContent = markdown;

  // Regex to match markdown links: [text](url)
  // Captures: [1] = link text, [2] = URL
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  let match;
  while ((match = markdownLinkRegex.exec(markdown)) !== null) {
    const [original, text, href] = match;

    // Only extract previewable internal links
    if (isPreviewableLink(href)) {
      links.push({
        text,
        href,
        original,
      });

      // Remove the link from the text content
      // This prevents it from being rendered inline
      textContent = textContent.replace(original, '');
    }
    // Non-previewable links stay in the text content
  }

  // Clean up extra whitespace left by removed links
  textContent = textContent
    .replace(/\s{2,}/g, ' ') // Multiple spaces → single space
    .trim();

  return {
    textContent,
    links,
  };
}
