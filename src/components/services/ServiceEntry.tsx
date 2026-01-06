'use client'

interface ServiceEntryProps {
  leadInText?: string // Optional quote/testimonial
  leadInAttribution?: string // Optional attribution
  serviceTitle: string
  answerParagraphs: string[]
}

export function ServiceEntry({
  leadInText,
  leadInAttribution,
  serviceTitle,
  answerParagraphs,
}: ServiceEntryProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Optional Lead-in (quote/testimonial) - right-aligned */}
      {leadInText && (
        <div className="self-end max-w-[85%] text-right">
          <p className="font-serif text-[1.375rem] font-normal text-accent dark:text-accent-light italic">
            "{leadInText}"
          </p>
          {leadInAttribution && (
            <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground mt-1.5">
              — {leadInAttribution}
            </p>
          )}
        </div>
      )}

      {/* Service card (left-aligned, or full-width if no lead-in) */}
      <div className={leadInText ? 'self-start max-w-[90%]' : 'w-full'}>
        <div className="bg-card border-l-[3px] border-accent dark:border-accent-light px-7 py-6 transition-colors-smooth hover:border-purple-700 dark:hover:border-purple-300">
          <h3 className="font-sans text-xl font-medium text-foreground mb-3">
            {serviceTitle}
          </h3>
          {answerParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="font-serif text-muted-foreground leading-[1.7] mb-3 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
