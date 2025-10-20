import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroOption',
  title: 'Hero Options',
  type: 'document',
  fields: [
    // Sentence Construction
    defineField({
      name: 'prefix',
      title: 'Sentence Prefix',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'Text before the highlighted dropdown word (e.g., "shipped the first responsive")',
      placeholder: 'shipped the first responsive',
    }),
    defineField({
      name: 'dropdown',
      title: 'Dropdown Word/Phrase',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
      description: 'The highlighted/underlined part that users click (e.g., "airline website")',
      placeholder: 'airline website',
    }),

    // Navigation
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page/Project', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [{ type: 'project' }, { type: 'aiProject' }],
      description: 'Select a project or AI project page',
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalLink',
      title: 'External URL',
      type: 'url',
      description: 'Full URL starting with http:// or https://',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'label',
      title: 'Option Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
      description: 'Display name for this option (shown in modal)',
      placeholder: 'Virgin America',
    }),

    // Modal Display Content
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      description: 'Brief description shown in the modal card',
      placeholder: 'Revolutionized airline digital experience...',
    }),
    defineField({
      name: 'image',
      title: 'Preview Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      description: 'Image displayed in the modal grid (recommended: 600x400px)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(5),
      description: 'Up to 5 tags describing this option (e.g., "UX Design", "Responsive")',
    }),
    defineField({
      name: 'colorGradient',
      title: 'Color Gradient',
      type: 'string',
      description: 'Tailwind gradient classes (e.g., "from-red-500 to-pink-600") - optional',
      placeholder: 'from-purple-500 to-indigo-600',
    }),

    // Management
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Only active options appear in the hero rotation',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
      description: 'Order in rotation sequence (1 = first, 2 = second, etc.)',
      initialValue: 1,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When this option was published',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'dropdown',
      media: 'image',
      active: 'active',
      order: 'order',
    },
    prepare({ title, subtitle, media, active, order }) {
      return {
        title: title || 'Hero Option',
        subtitle: `${active ? '✓' : '○'} Order ${order} • "${subtitle}"`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Recently Published',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
