interface ServicesInterludeProps {
  text?: string
}

export function ServicesInterlude({ text }: ServicesInterludeProps) {
  if (!text) return null

  return (
    <section
      className="py-[60px] text-center animate-in fade-in duration-700"
      style={{ animationDelay: '0.2s' }}
    >
      {/* Gradient line */}
      <div className="w-px h-12 mx-auto mb-6 bg-gradient-to-b from-transparent via-accent dark:via-accent-light to-transparent" />

      <p className="font-serif text-lg font-light text-muted-foreground italic">
        "{text}"
      </p>
    </section>
  )
}
