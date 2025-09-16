import { PortableText as PortableTextComponent } from '@portabletext/react'
import { urlFor } from '@/lib/sanity/client'

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <img
          className="w-full rounded-lg my-8"
          alt={value.alt || ' '}
          loading="lazy"
          src={urlFor(value).width(1200).height(800).fit('max').auto('format').url()}
        />
      )
    },
    code: ({ value }: any) => {
      return (
        <pre className="bg-secondary/30 rounded-lg p-4 my-6 overflow-x-auto">
          <code className="text-sm">{value.code}</code>
        </pre>
      )
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-light mb-6 mt-8">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-light mb-4 mt-6">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-light mb-3 mt-4">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-medium mb-2 mt-3">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-muted-foreground">{children}</li>,
    number: ({ children }: any) => <li className="text-muted-foreground">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-secondary/50 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}

export default function PortableText({ value }: { value: any }) {
  return <PortableTextComponent value={value} components={components} />
}