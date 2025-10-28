import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    // Hero Section (for About Page)
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main tagline shown on hero (e.g., "Product Manager • UX Strategist • AI Builder")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'string',
      description: 'Brief statement below headline (e.g., "20 years solving complex problems...")',
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero Introduction',
      type: 'text',
      rows: 3,
      description: '2-3 sentence introduction for about page hero',
    }),

    // Quick Facts
    defineField({
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'array',
      description: 'At-a-glance facts displayed in grid on about page',
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
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
    }),

    // Capabilities
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      description: 'List of key capabilities/skills with descriptions',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'string',
              title: 'Description',
            },
            {
              name: 'isNew',
              type: 'boolean',
              title: 'Show "New" Badge',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              isNew: 'isNew',
            },
            prepare({ title, subtitle, isNew }) {
              return {
                title: isNew ? `${title} (NEW)` : title,
                subtitle,
              }
            },
          },
        },
      ],
    }),

    // Content Sections
    defineField({
      name: 'sections',
      title: 'About Page Sections',
      type: 'array',
      description: 'Main content sections for about page',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              type: 'string',
              title: 'Section Heading',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'slug',
              type: 'slug',
              title: 'Slug',
              description: 'For anchor links',
              options: {
                source: 'heading',
                maxLength: 96,
              },
            },
            {
              name: 'content',
              type: 'array',
              title: 'Content',
              of: [{ type: 'block' }],
            },
            {
              name: 'subsections',
              type: 'array',
              title: 'Subsections',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'heading',
                      type: 'string',
                      title: 'Subsection Heading',
                    },
                    {
                      name: 'content',
                      type: 'array',
                      title: 'Content',
                      of: [{ type: 'block' }],
                    },
                  ],
                  preview: {
                    select: {
                      title: 'heading',
                    },
                  },
                },
              ],
            },
            {
              name: 'visible',
              type: 'boolean',
              title: 'Visible',
              description: 'Show/hide this section',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'heading',
              visible: 'visible',
            },
            prepare({ title, visible }) {
              return {
                title: visible ? title : `${title} (Hidden)`,
              }
            },
          },
        },
      ],
    }),

    // Selected Projects
    defineField({
      name: 'selectedProjects',
      title: 'Selected Projects',
      type: 'array',
      description: 'Curated project highlights for about page',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Project Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'metric',
              type: 'string',
              title: 'Key Metric/Achievement',
              description: 'E.g., "15-20% conversion improvement"',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 3,
            },
            {
              name: 'order',
              type: 'number',
              title: 'Display Order',
              validation: (Rule) => Rule.required().integer().positive(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'metric',
              order: 'order',
            },
            prepare({ title, subtitle, order }) {
              return {
                title: `${order}. ${title}`,
                subtitle,
              }
            },
          },
        },
      ],
    }),

    // Technologies
    defineField({
      name: 'technologies',
      title: 'Technologies & Tools',
      type: 'object',
      description: 'Tech stack organized by category',
      fields: [
        {
          name: 'frontend',
          type: 'array',
          title: 'Frontend',
          of: [{ type: 'string' }],
        },
        {
          name: 'mobile',
          type: 'array',
          title: 'Mobile',
          of: [{ type: 'string' }],
        },
        {
          name: 'backend',
          type: 'array',
          title: 'Backend',
          of: [{ type: 'string' }],
        },
        {
          name: 'cms',
          type: 'array',
          title: 'CMS',
          of: [{ type: 'string' }],
        },
        {
          name: 'data',
          type: 'array',
          title: 'Data & Analytics',
          of: [{ type: 'string' }],
        },
        {
          name: 'aiMl',
          type: 'array',
          title: 'AI/ML',
          of: [{ type: 'string' }],
        },
        {
          name: 'deployment',
          type: 'array',
          title: 'Deployment',
          of: [{ type: 'string' }],
        },
        {
          name: 'enterprise',
          type: 'array',
          title: 'Enterprise',
          of: [{ type: 'string' }],
        },
      ],
    }),

    // Availability & CTA
    defineField({
      name: 'availability',
      title: 'Available for Work',
      type: 'boolean',
      description: 'Toggle availability status',
      initialValue: true,
    }),
    defineField({
      name: 'availabilityText',
      title: 'Availability Text',
      type: 'text',
      rows: 3,
      description: 'Text explaining current availability/interests',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Section Text',
      type: 'text',
      rows: 3,
      description: 'Call-to-action section copy',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text for CTA button',
      initialValue: "Let's Work Together",
    }),

    // Legacy Fields (kept for compatibility)
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'Legacy field - consider using heroHeadline instead',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Legacy field - used on homepage',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Legacy field - consider using sections instead',
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      description: 'Legacy field - consider using capabilities or technologies instead',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'category',
              type: 'string',
              title: 'Category',
            },
            {
              name: 'skills',
              type: 'array',
              of: [{ type: 'string' }],
              title: 'Skills',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      description: 'Work history - useful for resume/CV',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'company', type: 'string', title: 'Company' },
            { name: 'role', type: 'string', title: 'Role' },
            { name: 'startDate', type: 'date', title: 'Start Date' },
            { name: 'endDate', type: 'date', title: 'End Date' },
            { name: 'current', type: 'boolean', title: 'Current Position' },
            { name: 'description', type: 'text', title: 'Description' },
          ],
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'github', type: 'url', title: 'GitHub' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'twitter', type: 'url', title: 'Twitter' },
        { name: 'email', type: 'email', title: 'Email' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'heroHeadline',
      media: 'profileImage',
    },
  },
})