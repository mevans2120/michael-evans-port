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
      options: {
        list: [
          { title: 'Case Study', value: 'case-study' },
          { title: 'AI Project', value: 'ai-project' },
          { title: 'Research', value: 'research' },
          { title: 'Open Source', value: 'open-source' },
        ],
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
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
      title: 'Key Achievements',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
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
      name: 'featuredCategory',
      title: 'Featured Category',
      type: 'string',
      description: 'Category label for homepage card (e.g., "UX Design", "Experience Design", "Mobile Product")',
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({
      name: 'featuredMetric',
      title: 'Featured Metric',
      type: 'string',
      description: 'Short metric for homepage card (e.g., "15% conversion lift", "100K+ users")',
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({
      name: 'featuredDescription',
      title: 'Featured Description',
      type: 'text',
      description: 'Description for homepage card (150-200 characters)',
      rows: 4,
      validation: (Rule) => Rule.max(250),
      hidden: ({ document }) => !document?.featured,
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
    defineField({
      name: 'sections',
      title: 'Case Study Sections',
      type: 'array',
      description: 'Detailed narrative sections for the case study',
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