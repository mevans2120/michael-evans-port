import { defineType, defineField } from 'sanity'

export const viewMoreProjectsSettings = defineType({
  name: 'viewMoreProjectsSettings',
  title: 'View More Projects Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable View More Projects',
      type: 'boolean',
      description: 'Show recommended projects at the bottom of case studies',
      initialValue: true
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading for the section',
      initialValue: 'Explore More Work',
      validation: Rule => Rule.max(100)
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the heading',
      initialValue: 'Each project represents a unique challenge solved through thoughtful design and technical excellence.',
      validation: Rule => Rule.max(200)
    }),
    defineField({
      name: 'numberOfProjects',
      title: 'Number of Projects to Show',
      type: 'number',
      description: 'How many projects to display (recommended: 3)',
      initialValue: 3,
      validation: Rule => Rule.required().min(1).max(6).integer()
    }),
    defineField({
      name: 'layoutStyle',
      title: 'Layout Style',
      type: 'string',
      description: 'How to arrange the project cards',
      options: {
        list: [
          { title: 'Grid (2 columns)', value: 'grid' },
          { title: 'List (1 column)', value: 'list' },
          { title: 'Carousel', value: 'carousel' }
        ],
        layout: 'radio'
      },
      initialValue: 'grid'
    }),
    defineField({
      name: 'selectionStrategy',
      title: 'Project Selection Strategy',
      type: 'string',
      description: 'How to choose which projects to show',
      options: {
        list: [
          { title: 'Random', value: 'random' },
          { title: 'Related (by category)', value: 'related' },
          { title: 'Most Recent', value: 'recent' },
          { title: 'Curated List', value: 'curated' }
        ],
        layout: 'radio'
      },
      initialValue: 'random'
    }),
    defineField({
      name: 'curatedProjects',
      title: 'Curated Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      hidden: ({ parent }) => parent?.selectionStrategy !== 'curated',
      description: 'Select specific projects to show (only used when Selection Strategy is "Curated")',
      validation: Rule => Rule.custom((curatedProjects, context) => {
        const { parent } = context as { parent?: { selectionStrategy?: string } }
        if (parent?.selectionStrategy === 'curated' && (!curatedProjects || curatedProjects.length === 0)) {
          return 'Please select at least one project for curated selection'
        }
        return true
      })
    }),
    defineField({
      name: 'excludeFromRandom',
      title: 'Exclude from Random Selection',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Projects to never show in recommendations (e.g., outdated or internal projects)',
      hidden: ({ parent }) => parent?.selectionStrategy !== 'random'
    }),
    defineField({
      name: 'priorityBoost',
      title: 'Priority Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'project',
              title: 'Project',
              type: 'reference',
              to: [{ type: 'project' }]
            },
            {
              name: 'weight',
              title: 'Weight',
              type: 'number',
              description: 'Higher weight = more likely to appear (1-10)',
              initialValue: 5,
              validation: Rule => Rule.min(1).max(10)
            }
          ],
          preview: {
            select: {
              title: 'project.title',
              weight: 'weight'
            },
            prepare({ title, weight }) {
              return {
                title: title || 'Select project',
                subtitle: `Weight: ${weight || 1}`
              }
            }
          }
        }
      ],
      description: 'Give certain projects higher probability in random selection',
      hidden: ({ parent }) => parent?.selectionStrategy !== 'random'
    }),
    defineField({
      name: 'ctaButton',
      title: 'Call to Action Button',
      type: 'object',
      description: 'Optional button below the projects',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show CTA Button',
          type: 'boolean',
          initialValue: true
        }),
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'View All Case Studies',
          hidden: ({ parent }) => !parent?.enabled,
          validation: Rule => Rule.max(50)
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'string',
          initialValue: '/case-studies',
          hidden: ({ parent }) => !parent?.enabled,
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'style',
          title: 'Button Style',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Outline', value: 'outline' },
              { title: 'Ghost', value: 'ghost' }
            ]
          },
          initialValue: 'secondary',
          hidden: ({ parent }) => !parent?.enabled
        })
      ]
    }),
    defineField({
      name: 'animation',
      title: 'Animation Settings',
      type: 'object',
      description: 'Control how elements appear',
      fields: [
        defineField({
          name: 'enableAnimation',
          title: 'Enable Animations',
          type: 'boolean',
          initialValue: true
        }),
        defineField({
          name: 'staggerDelay',
          title: 'Stagger Delay (ms)',
          type: 'number',
          description: 'Delay between each card animation',
          initialValue: 100,
          validation: Rule => Rule.min(0).max(500),
          hidden: ({ parent }) => !parent?.enableAnimation
        })
      ]
    })
  ],
  preview: {
    select: {
      enabled: 'enabled',
      heading: 'heading',
      strategy: 'selectionStrategy',
      count: 'numberOfProjects'
    },
    prepare({ enabled, heading, strategy, count }) {
      const strategyLabels = {
        random: 'Random',
        related: 'Related',
        recent: 'Recent',
        curated: 'Curated'
      }

      return {
        title: heading || 'View More Projects',
        subtitle: enabled
          ? `${strategyLabels[strategy as keyof typeof strategyLabels] || 'Random'} • ${count || 3} projects`
          : 'Disabled'
      }
    }
  }
})

export default viewMoreProjectsSettings