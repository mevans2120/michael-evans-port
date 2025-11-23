import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepageHero',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'tagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Text that appears after "Michael Evans" (e.g., "builds products")',
      placeholder: 'builds products',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      description: '1-2 sentences describing your experience and background',
      placeholder: 'Shipping innovative digital products since 2007, across a variety of industries and technologies.',
      validation: (Rule) => Rule.required().max(300),
    }),

    // Hero CTA
    defineField({
      name: 'heroCta',
      title: 'Hero CTA',
      type: 'object',
      description: 'Call-to-action button below hero description',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Learn more about my background',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              { title: 'Internal Page', value: 'internal' },
              { title: 'External URL', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'internal',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'internalLink',
          title: 'Internal Page',
          type: 'string',
          options: {
            list: [
              { title: 'About', value: '/about' },
              { title: 'Blog', value: '/blog' },
              { title: 'Case Studies', value: '/case-studies' },
              { title: 'Home', value: '/' },
            ],
          },
          hidden: ({ parent }) => parent?.linkType !== 'internal',
          initialValue: '/about',
          validation: (Rule) => Rule.custom((value, context) => {
            const parent = context.parent as { linkType?: string };
            if (parent?.linkType === 'internal' && !value) {
              return 'Internal page is required';
            }
            return true;
          }),
        }),
        defineField({
          name: 'externalLink',
          title: 'External URL',
          type: 'url',
          description: 'Full URL starting with http:// or https://',
          hidden: ({ parent }) => parent?.linkType !== 'external',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as any;
              if (parent?.linkType === 'external' && !value) {
                return 'External URL is required';
              }
              return true;
            }).uri({
              scheme: ['http', 'https'],
            }),
        }),
      ],
    }),

    // Selected Work Section
    defineField({
      name: 'selectedWorkSection',
      title: 'Selected Work Section',
      type: 'object',
      description: 'Content for the Featured Work section',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Selected Work',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'string',
          initialValue: 'Case studies and product launches',
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'viewAllText',
          title: 'View All CTA Text',
          type: 'string',
          initialValue: 'View all case studies',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'viewAllLinkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              { title: 'Internal Page', value: 'internal' },
              { title: 'External URL', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'internal',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'viewAllInternalLink',
          title: 'Internal Page',
          type: 'string',
          options: {
            list: [
              { title: 'About', value: '/about' },
              { title: 'Blog', value: '/blog' },
              { title: 'Case Studies', value: '/case-studies' },
              { title: 'Home', value: '/' },
            ],
          },
          hidden: ({ parent }) => parent?.viewAllLinkType !== 'internal',
          initialValue: '/case-studies',
          validation: (Rule) => Rule.custom((value, context) => {
            const parent = context.parent as any;
            if (parent?.viewAllLinkType === 'internal' && !value) {
              return 'Internal page is required';
            }
            return true;
          }),
        }),
        defineField({
          name: 'viewAllExternalLink',
          title: 'External URL',
          type: 'url',
          description: 'Full URL starting with http:// or https://',
          hidden: ({ parent }) => parent?.viewAllLinkType !== 'external',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as any;
              if (parent?.viewAllLinkType === 'external' && !value) {
                return 'External URL is required';
              }
              return true;
            }).uri({
              scheme: ['http', 'https'],
            }),
        }),
      ],
    }),

    // Featured Post Section
    defineField({
      name: 'featuredPostSection',
      title: 'Featured Post Section',
      type: 'object',
      description: 'Content for the Featured Post section',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Featured Post',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'string',
          initialValue: 'My journey with AI-assisted development',
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'viewAllText',
          title: 'View All CTA Text',
          type: 'string',
          initialValue: 'View all posts',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'viewAllLinkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              { title: 'Internal Page', value: 'internal' },
              { title: 'External URL', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'internal',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'viewAllInternalLink',
          title: 'Internal Page',
          type: 'string',
          options: {
            list: [
              { title: 'About', value: '/about' },
              { title: 'Blog', value: '/blog' },
              { title: 'Case Studies', value: '/case-studies' },
              { title: 'Home', value: '/' },
            ],
          },
          hidden: ({ parent }) => parent?.viewAllLinkType !== 'internal',
          initialValue: '/blog',
          validation: (Rule) => Rule.custom((value, context) => {
            const parent = context.parent as any;
            if (parent?.viewAllLinkType === 'internal' && !value) {
              return 'Internal page is required';
            }
            return true;
          }),
        }),
        defineField({
          name: 'viewAllExternalLink',
          title: 'External URL',
          type: 'url',
          description: 'Full URL starting with http:// or https://',
          hidden: ({ parent }) => parent?.viewAllLinkType !== 'external',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as any;
              if (parent?.viewAllLinkType === 'external' && !value) {
                return 'External URL is required';
              }
              return true;
            }).uri({
              scheme: ['http', 'https'],
            }),
        }),
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media metadata for the homepage',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'All homepage content (hero, sections, CTAs)',
      }
    },
  },
})
