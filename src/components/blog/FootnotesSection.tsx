interface Footnote {
  _key: string;
  note: string;
}

interface FootnotesSectionProps {
  footnotes: Footnote[];
}

/**
 * FootnotesSection Component
 *
 * Renders collected footnotes at the bottom of an article.
 * Includes back-links and :target highlighting for jumped-to notes.
 */
export function FootnotesSection({ footnotes }: FootnotesSectionProps) {
  if (!footnotes.length) return null;

  return (
    <section
      className="mt-12 pt-6 border-t border-border"
      aria-label="Footnotes"
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        Notes
      </h2>
      <ol className="list-none text-sm text-muted-foreground">
        {footnotes.map((fn, index) => (
          <li
            key={fn._key}
            id={`fn-${index + 1}`}
            className="mb-3 pl-6 relative scroll-mt-24
              target:bg-accent/10 target:rounded target:py-2 target:pl-8 target:-mx-2"
          >
            <span className="absolute left-0 target:left-2 text-accent font-semibold">
              {index + 1}.
            </span>
            {fn.note}
            <a
              href={`#fnref-${index + 1}`}
              className="text-accent ml-2 hover:underline transition-smooth"
              aria-label={`Back to reference ${index + 1}`}
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
