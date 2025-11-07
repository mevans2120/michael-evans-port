import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Project category (e.g., "Case Study", "UX Design", "Experience Design", "Mobile Product")',
    }),
    // ===== EDITORIAL FORMAT: Hero Section =====
    defineField({
      name: 'heroSection',
      title: 'Hero Section (Editorial Format)',
      type: 'object',
      description: 'Magazine-style hero section for editorial case studies',
      fields: [
        {
          name: 'badge',
          title: 'Badge Text',
          type: 'string',
          description: 'Small badge above title (e.g., "Case Study")',
        },
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          description: 'Large hero title (usually same as document title)',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          description: 'Tagline below title (1 sentence)',
        },
        {
          name: 'summary',
          title: 'Summary',
          type: 'text',
          rows: 4,
          description: 'Brief overview (2-3 sentences)',
        },
      ],
    }),
    // ===== DEPRECATED FIELDS (kept for backward compatibility) =====
    defineField({
      name: 'heroImage',
      title: '[DEPRECATED] Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: '⚠️ Deprecated: Not used in editorial format',
      hidden: true,
    }),
    defineField({
      name: 'summary',
      title: '[DEPRECATED] Summary',
      type: 'text',
      rows: 3,
      description: '⚠️ Deprecated: Use heroSection.summary instead',
      hidden: true,
    }),
    defineField({
      name: 'description',
      title: '[DEPRECATED] Description',
      type: 'text',
      rows: 5,
      description: '⚠️ Deprecated: Use heroSection.subtitle instead',
      hidden: true,
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'value', type: 'string', title: 'Value' },
            {
              name: 'description',
              type: 'string',
              title: 'Description',
              description: 'Optional additional context for this metric'
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'achievements',
      title: '[DEPRECATED] Key Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: '⚠️ Deprecated: Use metrics and narrative instead',
      hidden: true,
    }),
    defineField({
      name: 'content',
      title: '[DEPRECATED] Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description: '⚠️ Deprecated: Use slides instead',
      hidden: true,
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this case study on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Featured Order',
      type: 'number',
      description: 'Order on homepage (1, 2, 3, etc.). Only applies if Featured is true.',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'featuredMetric',
      title: 'Featured Metric',
      type: 'string',
      description: 'Short metric to display on homepage (e.g., "2x revenue")',
    }),
    defineField({
      name: 'featuredDescription',
      title: 'Featured Description',
      type: 'text',
      description: 'Brief description for homepage featured section',
      rows: 4,
      validation: (Rule) => Rule.max(250),
    }),
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'object',
      fields: [
        {
          name: 'role',
          title: 'Your Role',
          type: 'string',
          description: 'e.g., "Lead Product Manager & Client Lead"',
        },
        {
          name: 'company',
          title: 'Company',
          type: 'string',
          description: 'e.g., "Work & Co"',
        },
        {
          name: 'timeline',
          title: 'Timeline',
          type: 'string',
          description: 'e.g., "~1 year (2014-2015)"',
        },
      ],
    }),
    // ===== EDITORIAL FORMAT: Content Slides =====
    defineField({
      name: 'slides',
      title: '[DEPRECATED] Content Slides (Editorial Format)',
      type: 'array',
      description: '⚠️ Deprecated: Use article field instead',
      hidden: true,
      of: [
        {
          type: 'object',
          name: 'contentSlide',
          title: 'Content Slide',
          fields: [
            {
              name: 'sectionLabel',
              title: 'Section Label',
              type: 'string',
              description: 'Small label (e.g., "Opening", "The Solution")',
            },
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Main slide heading',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                { type: 'block' },
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                  ],
                },
              ],
            },
            {
              name: 'quoteBox',
              title: 'Quote Box',
              type: 'object',
              description: 'Optional pullquote',
              fields: [
                {
                  name: 'quote',
                  title: 'Quote Text',
                  type: 'text',
                  rows: 3,
                },
                {
                  name: 'attribution',
                  title: 'Attribution',
                  type: 'string',
                  description: 'Quote source (e.g., "— On building X")',
                },
              ],
            },
            {
              name: 'comparisonBoxes',
              title: 'Comparison Boxes',
              type: 'array',
              description: 'Problem/Solution or Before/After boxes',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      description: 'Box label (e.g., "The Problem")',
                    },
                    {
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                    },
                    {
                      name: 'text',
                      title: 'Text Content',
                      type: 'text',
                      rows: 4,
                    },
                    {
                      name: 'stat',
                      title: 'Stat (optional)',
                      type: 'string',
                      description: 'Large stat to display',
                    },
                    {
                      name: 'icon',
                      title: 'Icon (optional)',
                      type: 'string',
                      description: 'Emoji or icon character',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'label',
                    },
                  },
                },
              ],
            },
            {
              name: 'visualCards',
              title: 'Visual Cards',
              type: 'array',
              description: 'Screenshots or images',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: { hotspot: true },
                    },
                    {
                      name: 'placeholderText',
                      title: 'Placeholder Text',
                      type: 'text',
                      description: 'Text to show if no image',
                      rows: 2,
                    },
                    {
                      name: 'caption',
                      title: 'Caption',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'placeholderText',
                      subtitle: 'caption',
                      media: 'image',
                    },
                  },
                },
              ],
            },
            {
              name: 'annotation',
              title: 'Design Annotation',
              type: 'object',
              description: 'Optional annotation or design decision callout',
              fields: [
                {
                  name: 'title',
                  type: 'string',
                  title: 'Annotation Title',
                  description: 'e.g., "Technical Note"',
                },
                {
                  name: 'content',
                  type: 'text',
                  title: 'Annotation Content',
                  rows: 3,
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'sectionLabel',
            },
          },
        },
      ],
    }),
    // ===== EDITORIAL FORMAT: Flowing Article =====
    defineField({
      name: 'article',
      title: 'Article Content (Flowing Editorial)',
      type: 'array',
      description: 'Main article content with inline stat blocks (replaces slides)',
      of: [
        // Standard Portable Text blocks
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' }
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
                    validation: (Rule) => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    name: 'newTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false
                  }
                ]
              }
            ]
          }
        },
        // Images with captions
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for accessibility',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        },
        // Video embeds
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
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
        // Code blocks
        {
          type: 'code',
          name: 'codeBlock',
          title: 'Code Block',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'Python', value: 'python' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash', value: 'bash' }
            ],
            withFilename: true
          }
        },
        // STAT BLOCK: Big Number
        {
          type: 'object',
          name: 'statBlockNumber',
          title: 'Stat Block: Big Number',
          fields: [
            {
              name: 'number',
              type: 'string',
              title: 'Number',
              description: 'e.g., "8%", "15", "2.5M"',
              validation: (Rule) => Rule.required().max(20)
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'Short context (max 5 words)',
              validation: (Rule) => Rule.required().max(50)
            }
          ],
          preview: {
            select: {
              number: 'number',
              label: 'label'
            },
            prepare({ number, label }: any) {
              return {
                title: `📊 ${number}`,
                subtitle: label
              }
            }
          }
        },
        // STAT BLOCK: Quote
        {
          type: 'object',
          name: 'statBlockQuote',
          title: 'Stat Block: Quote',
          fields: [
            {
              name: 'quote',
              type: 'text',
              title: 'Quote Text',
              rows: 3,
              validation: (Rule) => Rule.required()
            },
            {
              name: 'attribution',
              type: 'string',
              title: 'Attribution',
              description: 'e.g., "— On design validation"',
              validation: (Rule) => Rule.max(80)
            }
          ],
          preview: {
            select: {
              quote: 'quote',
              attribution: 'attribution'
            },
            prepare({ quote, attribution }: any) {
              const truncatedQuote = quote?.length > 60
                ? quote.substring(0, 60) + '...'
                : quote
              return {
                title: `💬 "${truncatedQuote}"`,
                subtitle: attribution
              }
            }
          }
        },
        // STAT BLOCK: Free Text
        {
          type: 'object',
          name: 'statBlockText',
          title: 'Stat Block: Free Text',
          fields: [
            {
              name: 'heading',
              type: 'string',
              title: 'Heading (optional)',
              description: 'Short heading for the callout',
              validation: (Rule) => Rule.max(60)
            },
            {
              name: 'text',
              type: 'text',
              title: 'Text Content',
              rows: 4,
              validation: (Rule) => Rule.required().max(400)
            }
          ],
          preview: {
            select: {
              heading: 'heading',
              text: 'text'
            },
            prepare({ heading, text }: any) {
              const truncatedText = text?.length > 60
                ? text.substring(0, 60) + '...'
                : text
              return {
                title: `📝 ${heading || 'Free Text'}`,
                subtitle: truncatedText
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.custom((value: any) => {
        if (!value || value.length === 0) return true

        // Count stat blocks
        const statBlocks = value.filter((block: any) =>
          ['statBlockNumber', 'statBlockQuote', 'statBlockText'].includes(block._type)
        )

        if (statBlocks.length > 5) {
          return 'Maximum 5 stat blocks per article. Consider which are most impactful.'
        }

        return true
      })
    }),
    // ===== EDITORIAL FORMAT: Call to Action =====
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
      description: 'CTA button at end of case study',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          description: 'e.g., "View More Projects"',
        },
        {
          name: 'link',
          title: 'Link URL',
          type: 'string',
          description: 'Internal path or external URL',
        },
      ],
    }),
    // ===== DEPRECATED FIELD =====
    defineField({
      name: 'sections',
      title: '[DEPRECATED] Case Study Sections',
      type: 'array',
      description: '⚠️ Deprecated: Renamed to slides',
      hidden: true,
      of: [
        {
          type: 'object',
          name: 'caseStudySection',
          title: 'Section',
          fields: [
            {
              name: 'sectionLabel',
              title: 'Section Label',
              type: 'string',
              description: 'e.g., "The Challenge", "Research Insights", "The Solution"',
            },
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Main heading for this section',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                { type: 'block' },
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                  ],
                },
              ],
            },
            {
              name: 'screenshots',
              title: 'Screenshots',
              description: 'Screenshots or images for this section',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'screenshot',
                  fields: [
                    {
                      name: 'image',
                      type: 'image',
                      title: 'Screenshot',
                      options: { hotspot: true },
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                    {
                      name: 'layout',
                      type: 'string',
                      title: 'Layout',
                      description: 'How to display this screenshot',
                      options: {
                        list: [
                          { title: 'Grid (with other screenshots)', value: 'grid' },
                          { title: 'Large (full width)', value: 'large' },
                        ],
                      },
                      initialValue: 'grid',
                    },
                  ],
                  preview: {
                    select: {
                      media: 'image',
                      caption: 'caption',
                    },
                    prepare({ media, caption }) {
                      return {
                        title: caption || 'Screenshot',
                        media,
                      }
                    },
                  },
                },
              ],
            },
            {
              name: 'annotation',
              title: 'Design Annotation',
              description: 'Optional annotation or design decision callout for this section',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  type: 'string',
                  title: 'Annotation Title',
                  description: 'e.g., "Design Decision", "Technical Note"',
                },
                {
                  name: 'content',
                  type: 'text',
                  title: 'Annotation Content',
                  rows: 3,
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'heading',
              label: 'sectionLabel',
            },
            prepare({ title, label }) {
              return {
                title: title || 'Untitled Section',
                subtitle: label,
              }
            },
          },
        },
      ],
    }),
    // ===== FEATURED IMAGE & SEO =====
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for this project (used for thumbnails, social sharing, etc.)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media metadata for this project',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      category: 'category',
    },
    prepare(selection) {
      const { title, media, category } = selection
      return {
        title,
        subtitle: category,
        media,
      }
    },
  },
})