import { defineType, defineField } from 'sanity'

export const relatedPostsSettings = defineType({
  name: 'relatedPostsSettings',
  title: 'Related Posts Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Related Posts',
      type: 'boolean',
      description: 'Show recommended posts at the bottom of blog articles',
      initialValue: true
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading for the section',
      initialValue: 'Continue Reading',
      validation: Rule => Rule.max(100)
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the heading',
      initialValue: 'More thoughts on design, technology, and creative problem-solving.',
      validation: Rule => Rule.max(200)
    }),
    defineField({
      name: 'numberOfPosts',
      title: 'Number of Posts to Show',
      type: 'number',
      description: 'How many posts to display (recommended: 3)',
      initialValue: 3,
      validation: Rule => Rule.required().min(1).max(6).integer()
    }),
    defineField({
      name: 'layoutStyle',
      title: 'Layout Style',
      type: 'string',
      description: 'How to arrange the post cards',
      options: {
        list: [
          { title: 'Grid (2-3 columns)', value: 'grid' },
          { title: 'List (1 column)', value: 'list' },
          { title: 'Carousel', value: 'carousel' }
        ],
        layout: 'radio'
      },
      initialValue: 'grid'
    }),
    defineField({
      name: 'selectionStrategy',
      title: 'Post Selection Strategy',
      type: 'string',
      description: 'How to choose which posts to show',
      options: {
        list: [
          { title: 'Most Recent', value: 'recent' },
          { title: 'Random', value: 'random' },
          { title: 'Related (by topic badge)', value: 'related' },
          { title: 'Featured Posts', value: 'featured' },
          { title: 'Curated List', value: 'curated' }
        ],
        layout: 'radio'
      },
      initialValue: 'recent'
    }),
    defineField({
      name: 'curatedPosts',
      title: 'Curated Posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blog' }] }],
      hidden: ({ parent }) => parent?.selectionStrategy !== 'curated',
      description: 'Select specific posts to show (only used when Selection Strategy is "Curated")',
      validation: Rule => Rule.custom((curatedPosts, context) => {
        const { parent } = context as { parent?: { selectionStrategy?: string } }
        if (parent?.selectionStrategy === 'curated' && (!curatedPosts || curatedPosts.length === 0)) {
          return 'Please select at least one post for curated selection'
        }
        return true
      })
    }),
    defineField({
      name: 'excludeFromRandom',
      title: 'Exclude from Random Selection',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blog' }] }],
      description: 'Posts to never show in recommendations',
      hidden: ({ parent }) => parent?.selectionStrategy !== 'random'
    }),
    defineField({
      name: 'priorityBoost',
      title: 'Priority Posts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'post',
              title: 'Post',
              type: 'reference',
              to: [{ type: 'blog' }]
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
              title: 'post.title',
              weight: 'weight'
            },
            prepare({ title, weight }) {
              return {
                title: title || 'Select post',
                subtitle: `Weight: ${weight || 1}`
              }
            }
          }
        }
      ],
      description: 'Give certain posts higher probability in random selection',
      hidden: ({ parent }) => parent?.selectionStrategy !== 'random'
    }),
    defineField({
      name: 'ctaButton',
      title: 'Call to Action Button',
      type: 'object',
      description: 'Optional button below the posts',
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
          initialValue: 'View All Posts',
          hidden: ({ parent }) => !parent?.enabled,
          validation: Rule => Rule.max(50)
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'string',
          initialValue: '/blog',
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
      count: 'numberOfPosts'
    },
    prepare({ enabled, heading, strategy, count }) {
      const strategyLabels = {
        recent: 'Recent',
        random: 'Random',
        related: 'Related',
        featured: 'Featured',
        curated: 'Curated'
      }

      return {
        title: heading || 'Related Posts',
        subtitle: enabled
          ? `${strategyLabels[strategy as keyof typeof strategyLabels] || 'Recent'} - ${count || 3} posts`
          : 'Disabled'
      }
    }
  }
})

export default relatedPostsSettings
