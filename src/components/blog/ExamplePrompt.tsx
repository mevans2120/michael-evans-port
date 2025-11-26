interface ExamplePromptProps {
  prompt: string;
  label?: string;
}

/**
 * ExamplePrompt Component
 *
 * Displays prompt examples in classic italic blockquote style.
 * Uses semantic HTML (figure/figcaption/blockquote) for accessibility.
 * Full-width within content column.
 */
export function ExamplePrompt({ prompt, label = 'Example Prompt' }: ExamplePromptProps) {
  return (
    <figure className="my-8 border-l-2 border-muted-foreground/30 pl-5">
      <figcaption className="text-[11px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        {label}
      </figcaption>
      <blockquote className="font-serif text-lg italic text-foreground/85 leading-relaxed">
        &ldquo;{prompt}&rdquo;
      </blockquote>
    </figure>
  );
}
