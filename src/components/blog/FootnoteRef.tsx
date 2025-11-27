interface FootnoteRefProps {
  number: number;
  children: React.ReactNode;
}

/**
 * FootnoteRef Component
 *
 * Inline superscript reference that wraps annotated text
 * and adds a clickable number linking to the footnote.
 */
export function FootnoteRef({ number, children }: FootnoteRefProps) {
  return (
    <>
      {children}
      <a
        href={`#fn-${number}`}
        id={`fnref-${number}`}
        className="text-accent text-[0.75em] align-super font-medium
          hover:text-accent-light hover:underline transition-smooth"
        aria-describedby={`fn-${number}`}
      >
        [{number}]
      </a>
    </>
  );
}
