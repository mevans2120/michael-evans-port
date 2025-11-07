import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import { urlFor } from '@/lib/sanity/client';

interface BlogContentProps {
  content: PortableTextBlock[];
}

/**
 * BlogContent Component
 *
 * Renders blog post content using PortableText
 * with custom serializers for rich formatting
 */
export function BlogContent({ content }: BlogContentProps) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-lg leading-relaxed font-serif mb-6 text-foreground">
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className="text-3xl md:text-4xl font-semibold font-sans mt-12 mb-6 text-foreground">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl md:text-3xl font-semibold font-sans mt-10 mb-5 text-foreground">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl md:text-2xl font-semibold font-sans mt-8 mb-4 text-foreground">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-6 my-8 text-xl italic text-muted-foreground">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }) => (
        <code className="bg-code-block px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ value, children }) => (
        <a
          href={value?.href}
          className="text-accent hover:text-accent-light underline transition-smooth"
          target={value?.href?.startsWith('http') ? '_blank' : undefined}
          rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }) => (
        <figure className="my-10">
          <img
            src={urlFor(value.asset).url()}
            alt={value.alt || ''}
            className="w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="text-sm text-muted-foreground text-center mt-3 font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
    },
  };

  return (
    <div>
      <PortableText value={content} components={components} />
    </div>
  );
}
