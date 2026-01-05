import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline for the services page',
      initialValue: 'The best partnerships start with good questions',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the headline',
      initialValue: 'Here are the ones I hear most often from teams considering working together.',
      validation: (Rule) => Rule.max(200),
    }),

    // Service Entries (with optional lead-in quote)
    defineField({
      name: 'serviceEntries',
      title: 'Service Entries',
      type: 'array',
      description: 'Each entry is a service, optionally introduced by a quote or testimonial',
      of: [
        {
          type: 'object',
          name: 'serviceEntry',
          title: 'Service Entry',
          fields: [
            // Optional lead-in (quote, testimonial, or question)
            defineField({
              name: 'leadInText',
              title: 'Lead-in Text (Optional)',
              type: 'text',
              rows: 2,
              description: 'Optional quote, testimonial, or question shown before the service. Leave empty to show service card alone.',
              validation: (Rule) => Rule.max(150),
            }),
            defineField({
              name: 'leadInAttribution',
              title: 'Lead-in Attribution (Optional)',
              type: 'string',
              description: 'Attribution for the quote (e.g., "VP Product, Fintech Startup"). Leave empty for no attribution.',
            }),
            defineField({
              name: 'serviceTitle',
              title: 'Service Title',
              type: 'string',
              description: 'The service name (e.g., "Product Strategy")',
              validation: (Rule) => Rule.required().max(50),
            }),
            defineField({
              name: 'answerParagraphs',
              title: 'Answer Paragraphs',
              type: 'array',
              description: 'One or more paragraphs explaining the service',
              of: [{ type: 'text', rows: 3 }],
              validation: (Rule) => Rule.required().min(1).max(4),
            }),
          ],
          preview: {
            select: {
              title: 'serviceTitle',
              subtitle: 'leadInText',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled Service',
                subtitle: subtitle ? `"${subtitle.slice(0, 50)}..."` : '(No lead-in)',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),

    // Interlude Section
    defineField({
      name: 'interludeText',
      title: 'Interlude Quote',
      type: 'string',
      description: 'Quote displayed between services and footer',
      initialValue: 'Every project starts with a conversation like this.',
      validation: (Rule) => Rule.max(100),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media settings',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Services Page',
        subtitle: 'Singleton document',
      }
    },
  },
})
