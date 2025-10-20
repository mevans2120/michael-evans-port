import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aiProject',
  title: 'AI Projects',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Project title (e.g., "Post Pal")',
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
      description: 'URL-friendly version of the title (e.g., "post-pal")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Short tagline for the project (e.g., "AI-Powered Social Media Content Assistant")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Brief description of the project for cards and previews',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Project category for filtering',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live', value: 'Live' },
          { title: 'In Progress', value: 'In Progress' },
          { title: 'Coming Soon', value: 'Coming Soon' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'In Progress',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      description: 'Large hero image for the project page (1600x900 recommended)',
    }),

    // Links
    defineField({
      name: 'liveUrl',
      title: 'Live Site URL',
      type: 'url',
      description: 'URL to the live project',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      description: 'URL to the GitHub repository',
    }),

    // Project Overview
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'object',
      fields: [
        {
          name: 'problem',
          title: 'Problem',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
          description: 'What problem does this project solve?',
        },
        {
          name: 'solution',
          title: 'Solution',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required(),
          description: 'How does this project solve the problem?',
        },
        {
          name: 'role',
          title: 'Your Role',
          type: 'string',
          validation: (Rule) => Rule.required(),
          description: 'Your role in the project',
        },
        {
          name: 'timeline',
          title: 'Timeline',
          type: 'string',
          validation: (Rule) => Rule.required(),
          description: 'Project timeline (e.g., "6 months")',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Metrics
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              label: 'label',
              value: 'value',
            },
            prepare({ label, value }) {
              return {
                title: label,
                subtitle: value,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
      description: 'Key project metrics (4 recommended for best display)',
    }),

    // Tech Stack
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
      description: 'Technologies used in the project',
    }),

    // AI Components
    defineField({
      name: 'aiComponents',
      title: 'AI Components',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Component Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'technology',
              type: 'string',
              title: 'Technology',
              validation: (Rule) => Rule.required(),
              description: 'AI tech used (e.g., "OpenAI GPT-4")',
            },
          ],
          preview: {
            select: {
              name: 'name',
              technology: 'technology',
            },
            prepare({ name, technology }) {
              return {
                title: name,
                subtitle: technology,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: 'AI/ML components used in the project',
    }),

    // Development Process
    defineField({
      name: 'developmentProcess',
      title: 'Development Process',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'phase',
              type: 'string',
              title: 'Phase Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'outcomes',
              type: 'array',
              title: 'Outcomes',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
              description: 'Key outcomes from this phase',
            },
          ],
          preview: {
            select: {
              phase: 'phase',
            },
            prepare({ phase }) {
              return {
                title: phase,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: 'Development phases and their outcomes',
    }),

    // Learnings
    defineField({
      name: 'learnings',
      title: 'Key Learnings',
      type: 'array',
      of: [{ type: 'text', rows: 2 }],
      validation: (Rule) => Rule.required().min(1),
      description: 'Key learnings from the project',
    }),

    // Achievements
    defineField({
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
      description: 'Key achievements and outcomes',
    }),

    // Images
    defineField({
      name: 'images',
      title: 'Project Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Descriptive alt text for accessibility',
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: caption,
                media,
              }
            },
          },
        },
      ],
      description: 'Additional project screenshots and images',
    }),

    // Metadata
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
      description: 'Show this project prominently on the homepage',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display this project (lower numbers first)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'heroImage',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${status} • ${subtitle}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Status',
      name: 'statusDesc',
      by: [{ field: 'status', direction: 'asc' }],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Published Date',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
