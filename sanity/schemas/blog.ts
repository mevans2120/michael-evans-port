import { defineType, defineField } from 'sanity';
import { DocumentTextIcon, BookIcon } from '@sanity/icons';
import { AsciiArtInput } from '../../src/sanity/components/AsciiArtInput';

export default defineType({
  name: 'blog',
  title: 'Posts',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    // Core fields
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Blog post title (used in listings and hero)',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary for listings and SEO (~150 characters)',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),

    // Hero section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'badge',
          title: 'Badge',
          type: 'string',
          description: 'Small uppercase label (e.g., "AI Showcase")',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          description: 'Tagline below title',
        },
      ],
    }),

    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Main blog post content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
              {
                name: 'footnote',
                type: 'object',
                title: 'Footnote',
                icon: BookIcon,
                fields: [
                  {
                    name: 'note',
                    type: 'text',
                    title: 'Footnote Text',
                    description: 'Citation or explanatory note',
                    rows: 3,
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'style',
              type: 'string',
              title: 'Image Style',
              description: 'Choose how this image should be displayed',
              options: {
                list: [
                  { title: 'Full Width (16:9)', value: 'fullWidth' },
                  { title: 'Float Left (4:3)', value: 'floatLeft' },
                  { title: 'Float Right (4:3)', value: 'floatRight' },
                  { title: 'Float Right (Portrait)', value: 'floatRightPortrait' }
                ],
                layout: 'radio'
              },
              initialValue: 'fullWidth',
              validation: (Rule) => Rule.required()
            }
          ],
        },
        // Image Grid - 2-column grid for 2-6 images
        {
          type: 'object',
          name: 'imageGrid',
          title: 'Image Grid',
          description: '2-column grid for 2-6 images with captions',
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              description: 'Add 2-6 images for the grid',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alt Text',
                      description: 'Describe the image for accessibility',
                      validation: (Rule) => Rule.required()
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                      description: 'Description text shown below the image'
                    }
                  ]
                }
              ],
              validation: (Rule) => Rule.min(2).max(6).required()
                .error('Image grid must contain 2-6 images')
            }
          ],
          preview: {
            select: {
              images: 'images'
            },
            prepare(selection: { images?: Array<unknown> }) {
              const { images } = selection
              return {
                title: 'Image Grid',
                subtitle: `${images?.length || 0} images`
              }
            }
          }
        },
        // Portrait Image List - 1-10 portrait images with captions
        {
          type: 'object',
          name: 'portraitImageList',
          title: 'Portrait Image List',
          description: '1-10 portrait phone images with captions (horizontal scrolling layout)',
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Portrait Images',
              description: 'Add 1-10 portrait-oriented images (scrollable)',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alt Text',
                      description: 'Describe the image for accessibility',
                      validation: (Rule) => Rule.required()
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                      description: 'Description text shown below the image'
                    }
                  ]
                }
              ],
              validation: (Rule) => Rule.min(1).max(10).required()
                .error('Portrait image list must contain 1-10 images')
            }
          ],
          preview: {
            select: {
              images: 'images'
            },
            prepare(selection: { images?: Array<unknown> }) {
              const { images } = selection
              return {
                title: 'Portrait Image List',
                subtitle: `${images?.length || 0} image${images?.length !== 1 ? 's' : ''}`
              }
            }
          }
        },
        // Video embeds
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          description: 'YouTube or Vimeo video embed',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Video URL',
              description: 'YouTube or Vimeo URL',
              validation: (Rule) => Rule.required().uri({
                scheme: ['http', 'https']
              })
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ],
          preview: {
            select: {
              url: 'url',
              caption: 'caption'
            },
            prepare({ url, caption }: any) {
              return {
                title: caption || 'Video',
                subtitle: url
              }
            }
          }
        },
        // Margin Note / Tip - Tufte-style sidenote
        {
          type: 'object',
          name: 'marginNote',
          title: 'Margin Note (Tip)',
          description: 'Appears in the right margin on desktop, floats right on mobile.',
          fields: [
            {
              name: 'content',
              title: 'Note Content',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(200),
            },
            {
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Tip', value: 'tip' },
                  { title: 'Pro Tip', value: 'pro' },
                ],
                layout: 'radio',
              },
              initialValue: 'tip',
            },
          ],
          preview: {
            select: { content: 'content', variant: 'variant' },
            prepare({ content, variant }: { content?: string; variant?: string }) {
              return {
                title: variant === 'pro' ? '💡 Pro Tip' : '💡 Tip',
                subtitle: content?.substring(0, 50) + '...',
              };
            },
          },
        },
        // Example Prompt - Classic italic blockquote
        {
          type: 'object',
          name: 'examplePrompt',
          title: 'Example Prompt',
          description: 'Displays a prompt example in italic blockquote style.',
          fields: [
            {
              name: 'prompt',
              title: 'Prompt Text',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label (optional)',
              type: 'string',
              description: 'Defaults to "Example Prompt"',
            },
          ],
          preview: {
            select: { prompt: 'prompt', label: 'label' },
            prepare({ prompt, label }: { prompt?: string; label?: string }) {
              return {
                title: `📝 ${label || 'Example Prompt'}`,
                subtitle: prompt?.substring(0, 50) + '...',
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Metadata
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When the post was published',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Updated Date',
      type: 'datetime',
      description: 'When the post was last updated (optional)',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author name',
      initialValue: 'Michael Evans',
    }),

    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
      validation: (Rule) => Rule.min(1).max(60),
    }),

    // Organization
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in featured listings',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order (lower numbers appear first)',
      initialValue: 0,
    }),

    // Media
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for listings and social sharing',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: 'asciiArt',
      title: 'ASCII Art (Alternative to Image)',
      type: 'text',
      description: 'Paste ASCII art to display instead of featured image. Leave empty to use featured image. Max 80 chars wide, 50 lines tall.',
      components: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: AsciiArtInput as any,
      },
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true; // Empty is valid (uses featured image)

        const lines = value.split('\n');
        const maxWidth = 80;
        const maxHeight = 50;

        // Check height
        if (lines.length > maxHeight) {
          return `Too tall: ${lines.length} lines (max ${maxHeight})`;
        }

        // Check width
        const longestLine = Math.max(...lines.map(l => l.length));
        if (longestLine > maxWidth) {
          return `Line too wide: ${longestLine} chars (max ${maxWidth})`;
        }

        // Check for tabs (should use spaces)
        if (value.includes('\t')) {
          return 'Contains tabs. Please convert tabs to spaces for consistent rendering.';
        }

        return true;
      }),
    }),

    defineField({
      name: 'asciiArtLabel',
      title: 'ASCII Art Description',
      type: 'string',
      description: 'Accessibility label describing the ASCII art (for screen readers)',
      hidden: ({ parent }) => !parent?.asciiArt,
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { asciiArt?: string };
        if (parent?.asciiArt && !value) {
          return 'Please provide an accessibility description for the ASCII art';
        }
        return true;
      }),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'Override default title for SEO (60 chars)',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          description: 'SEO description (150-160 chars)',
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Open Graph Image',
          description: 'Custom image for social sharing',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, subtitle, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : 'No date';
      return {
        title,
        subtitle: `${date} - ${subtitle || 'No excerpt'}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date (Oldest)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
