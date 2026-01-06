interface ServicesHeroProps {
  title: string
  subtitle?: string
}

export function ServicesHero({ title, subtitle }: ServicesHeroProps) {
  return (
    <section className="min-h-[50vh] flex flex-col justify-center pt-[120px] pb-[60px] animate-in fade-in duration-700">
      <h1 className="font-sans text-[clamp(2rem,4vw,3rem)] font-light leading-[1.3] mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="font-serif text-lg text-muted-foreground">{subtitle}</p>
      )}
    </section>
  )
}
