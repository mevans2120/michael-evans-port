import React from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import Image from 'next/image';
import { buildImageUrl } from '@/lib/sanity/image-builder';
import { ImageGrid } from '@/components/case-study-flowing/ImageGrid';
import { PortraitImageList } from '@/components/case-study-flowing/PortraitImageList';

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
      // Images with style variants
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
              <div className="relative w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={value.alt || ''}
                  width={1200}
                  height={800}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 1200px"
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
              <div className="relative w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={value.alt || ''}
                  width={800}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 45vw"
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
              <div className="relative w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={value.alt || ''}
                  width={800}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 45vw"
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
              <div className="relative w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={value.alt || ''}
                  width={400}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 45vw"
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
    },
  };

  return (
    <div>
      <PortableText value={content} components={components} />
    </div>
  );
}
