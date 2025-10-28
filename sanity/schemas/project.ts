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
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
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