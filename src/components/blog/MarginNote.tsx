interface MarginNoteProps {
  content: string;
  variant?: 'tip' | 'pro';
}

/**
 * MarginNote Component
 *
 * Displays tip/pro-tip content as a floating aside.
 * Floats right at all viewport sizes with text wrapping around it.
 */
export function MarginNote({ content, variant = 'tip' }: MarginNoteProps) {
  const borderColor = 'border-l-accent';

  const labelColor = 'text-accent';

  const label = variant === 'pro' ? 'Pro Tip' : 'Tip';

  return (
    <aside
      className={`
        my-4 w-[200px]
        float-right ml-6 mb-4
        clear-right
        border-l-2 ${borderColor} pl-3
      `}
      role="note"
    >
      <span className={`text-[11px] font-semibold uppercase tracking-wide ${labelColor}`}>
        {label}
      </span>
      <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
        {content}
      </p>
    </aside>
  );
}
