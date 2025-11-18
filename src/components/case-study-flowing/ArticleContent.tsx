/**
 * Article Content Renderer
 * Renders Portable Text with custom components for stat blocks, images, videos, and code
 */

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/sanity/image-builder'
import { StatBlockNumber } from './StatBlockNumber'
import { StatBlockQuote } from './StatBlockQuote'
import { StatBlockText } from './StatBlockText'
import { ImageGrid } from './ImageGrid'
import { PortraitImageList } from './PortraitImageList'

interface ArticleContentProps {
  content: any[]
}

export function ArticleContent({ content }: ArticleContentProps) {
  const components: PortableTextComponents = {
    types: {
      // Stat Blocks
      statBlockNumber: ({ value }: any) => (
        <StatBlockNumber
          number={value.number}
          label={value.label}
        />
      ),
      statBlockQuote: ({ value }: any) => (
        <StatBlockQuote
          quote={value.quote}
          attribution={value.attribution}
        />
      ),
      statBlockText: ({ value }: any) => (
        <StatBlockText
          heading={value.heading}
          text={value.text}
        />
      ),

      // Images
      image: ({ value }: any) => {
        if (!value?.asset) return null

        const style = value.style || 'fullWidth' // Fallback for existing images without style
        // Use article-full for fullWidth, article-float for floating images
        const isFloating = style === 'floatLeft' || style === 'floatRight' || style === 'floatRightPortrait'
        const imageUrl = buildImageUrl(value, isFloating ? 'article-float' : 'article-full')

        // Full width (respects Sanity crop)
        if (style === 'fullWidth') {
          return (
            <figure className="my-8">
              <div className="relative w-full h-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={value.alt || ''}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
              {value.caption && (
                <figcaption className="mt-3 text-sm text-muted-foreground text-center">
                  {value.caption}
                </figcaption>
              )}
            </figure>
          )
        }

        // Float left variant (respects Sanity crop)
        if (style === 'floatLeft') {
          return (
            <figure className="my-6 w-full md:w-[45%] md:float-left md:mr-6 md:mb-6 clear-left">
              <div className="relative w-full h-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={value.alt || ''}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              {value.caption && (
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {value.caption}
                </figcaption>
              )}
            </figure>
          )
        }

        // Float right variant (respects Sanity crop)
        if (style === 'floatRight') {
          return (
            <figure className="my-6 w-full md:w-[45%] md:float-right md:ml-6 md:mb-6 clear-right">
              <div className="relative w-full h-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={value.alt || ''}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              {value.caption && (
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {value.caption}
                </figcaption>
              )}
            </figure>
          )
        }

        // Float right portrait variant (respects Sanity crop)
        if (style === 'floatRightPortrait') {
          return (
            <figure className="my-6 w-full md:w-[45%] md:float-right md:ml-6 md:mb-6 clear-right">
              <div className="relative w-full h-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={value.alt || ''}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              {value.caption && (
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {value.caption}
                </figcaption>
              )}
            </figure>
          )
        }

        return null
      },

      // Image Grid
      imageGrid: ({ value }: any) => {
        return <ImageGrid images={value.images} />
      },

      // Portrait Image List
      portraitImageList: ({ value }: any) => {
        return <PortraitImageList images={value.images} />
      },

      // Video Embeds
      videoEmbed: ({ value }: any) => {
        if (!value?.url) return null

        // Extract video ID from YouTube or Vimeo URLs
        const getEmbedUrl = (url: string) => {
          // YouTube
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtu.be')
              ? url.split('youtu.be/')[1]?.split('?')[0]
              : new URLSearchParams(new URL(url).search).get('v')
            return `https://www.youtube.com/embed/${videoId}`
          }
          // Vimeo
          if (url.includes('vimeo.com')) {
            const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
            return `https://player.vimeo.com/video/${videoId}`
          }
          return url
        }

        const embedUrl = getEmbedUrl(value.url)

        return (
          <figure className="my-8">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={embedUrl}
                title={value.caption || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {value.caption && (
              <figcaption className="mt-3 text-sm text-muted-foreground text-center">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },

      // Code Blocks
      code: ({ value }: any) => {
        return (
          <div className="my-8 rounded-lg overflow-hidden bg-muted">
            {value.filename && (
              <div className="px-4 py-2 bg-accent/10 border-b border-border text-sm text-muted-foreground font-mono">
                {value.filename}
              </div>
            )}
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-foreground">
                {value.code}
              </code>
            </pre>
          </div>
        )
      },
    },

    block: {
      // Headings
      h2: ({ children }) => (
        <h2 className="text-4xl md:text-5xl font-light text-foreground mt-16 mb-6 first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-3xl md:text-4xl font-light text-foreground mt-12 mb-4">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-2xl md:text-3xl font-medium text-foreground mt-8 mb-4">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="text-xl md:text-2xl font-medium text-foreground mt-6 mb-3">
          {children}
        </h5>
      ),
      h6: ({ children }) => (
        <h6 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">
          {children}
        </h6>
      ),

      // Normal paragraph
      normal: ({ children }) => (
        <p className="text-lg leading-relaxed text-muted-foreground mb-6">
          {children}
        </p>
      ),

      // Blockquote
      blockquote: ({ children }) => (
        <blockquote className="my-8 pl-6 border-l-4 border-accent text-xl italic text-muted-foreground">
          {children}
        </blockquote>
      ),
    },

    list: {
      bullet: ({ children }) => (
        <ul className="space-y-2 my-6 ml-6 list-disc list-outside text-lg leading-relaxed text-muted-foreground">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="space-y-2 my-6 ml-6 list-decimal list-outside text-lg leading-relaxed text-muted-foreground">
          {children}
        </ol>
      ),
    },

    listItem: {
      bullet: ({ children }) => (
        <li className="pl-2">{children}</li>
      ),
      number: ({ children }) => (
        <li className="pl-2">{children}</li>
      ),
    },

    marks: {
      // Links
      link: ({ value, children }: any) => {
        const target = value?.newTab ? '_blank' : undefined
        const rel = value?.newTab ? 'noopener noreferrer' : undefined

        return (
          <a
            href={value?.href}
            target={target}
            rel={rel}
            className="text-accent hover:text-accent-light underline underline-offset-4 transition-colors"
          >
            {children}
          </a>
        )
      },

      // Text decorators
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic">{children}</em>
      ),
      underline: ({ children }) => (
        <span className="underline underline-offset-2">{children}</span>
      ),
      code: ({ children }) => (
        <code className="px-1.5 py-0.5 rounded bg-muted text-accent font-mono text-sm">
          {children}
        </code>
      ),
    },
  }

  return (
    <div className="prose-custom max-w-none">
      <PortableText value={content} components={components} />
    </div>
  )
}
