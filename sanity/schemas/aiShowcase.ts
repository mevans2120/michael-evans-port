import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aiShowcase',
  title: 'AI Showcase',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main title of the AI showcase',
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
      options: {
        list: [
          { title: 'AI Workflow & Tools', value: 'ai-workflow' },
          { title: 'Healthcare AI', value: 'healthcare-ai' },
          { title: 'Marketing Sites', value: 'marketing-sites' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this showcase prominently',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in showcase listing (1, 2, 3, etc.)',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'badge',
          title: 'Badge Text',
          type: 'string',
          description: 'Small badge above title (e.g., "AI Workflow Showcase")',
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Large hero title',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          description: 'Tagline below title',
        },
        {
          name: 'summary',
          title: 'Summary',
          type: 'text',
          rows: 4,
          description: 'Brief overview paragraph',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slides',
      title: 'Content Slides',
      type: 'array',
      description: 'Main content slides (excluding hero and horizontal timeline)',
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
              description: 'Small uppercase label (e.g., "Phase 01 — Discovery")',
            },
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Main slide heading',
              validation: (Rule) => Rule.required(),
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
                  description: 'Quote source (e.g., "— On building Dungeon Tracker")',
                },
              ],
            },
            {
              name: 'comparisonBoxes',
              title: 'Comparison Boxes',
              type: 'array',
              description: 'Problem/Solution or Before/After comparison boxes',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      description: 'Box label (e.g., "The Problem", "AI Excels")',
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
                      description: 'Large stat to display (e.g., "$20K-$50K")',
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
              description: 'Image placeholders or screenshots',
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
                      description: 'Text to show if no image (e.g., "Claude Code in Action")',
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
              name: 'techPills',
              title: 'Technology Pills',
              type: 'array',
              description: 'Technology tags (for PostPal tech stack)',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags',
              },
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
    defineField({
      name: 'horizontalSectionLabel',
      title: 'Horizontal Section Label',
      type: 'string',
      description: 'Label for the horizontal scrolling section (e.g., "Phase 02 — Evolution")',
    }),
    defineField({
      name: 'horizontalSectionHeading',
      title: 'Horizontal Section Heading',
      type: 'string',
      description: 'Heading for the horizontal scrolling section',
    }),
    defineField({
      name: 'timelinePhases',
      title: 'Timeline Phases',
      type: 'array',
      description: 'For AI Workflow: chronological timeline phases',
      of: [{ type: 'reference', to: [{ type: 'timelinePhase' }] }],
      hidden: ({ document }) => document?.category !== 'ai-workflow',
    }),
    defineField({
      name: 'workflowSteps',
      title: 'Workflow Steps',
      type: 'array',
      description: 'For PostPal: numbered workflow steps',
      of: [{ type: 'reference', to: [{ type: 'workflowStep' }] }],
      hidden: ({ document }) => document?.category !== 'healthcare-ai',
    }),
    defineField({
      name: 'projectCards',
      title: 'Project Cards',
      type: 'array',
      description: 'For Marketing Sites: project showcase cards',
      of: [{ type: 'reference', to: [{ type: 'projectCard' }] }],
      hidden: ({ document }) => document?.category !== 'marketing-sites',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      description: 'Key metrics for the metrics slide',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value', description: 'e.g., "1000+", "< 1 Week"' },
            { name: 'label', type: 'string', title: 'Label', description: 'e.g., "GitHub Commits"' },
            {
              name: 'description',
              type: 'string',
              title: 'Description',
              description: 'Optional context (e.g., "Since March 2024")',
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
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
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      featured: 'featured',
    },
    prepare({ title, category, featured }) {
      return {
        title,
        subtitle: `${category}${featured ? ' • Featured' : ''}`,
      }
    },
  },
})
