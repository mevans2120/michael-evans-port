import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatPrompts',
  title: 'Chat Suggested Prompts',
  type: 'document',
  fields: [
    defineField({
      name: 'prompts',
      title: 'Initial Suggested Prompts',
      type: 'array',
      description: 'List of prompts shown when chat first opens. 2 are randomly selected each time.',
      validation: (Rule) => Rule.required().min(2).max(10),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Prompt Text',
              type: 'string',
              description: 'The question or prompt to display',
              validation: (Rule) => Rule.required().max(150),
            }),
            defineField({
              name: 'order',
              title: 'Sort Order',
              type: 'number',
              description: 'Lower numbers appear first (used for prioritization)',
              initialValue: 0,
            }),
            defineField({
              name: 'active',
              title: 'Active',
              type: 'boolean',
              description: 'Only active prompts will be shown',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'text',
              active: 'active',
              order: 'order',
            },
            prepare({ title, active, order }) {
              return {
                title: `${active ? '✓' : '✗'} ${title}`,
                subtitle: `Order: ${order}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'numberOfPromptsToShow',
      title: 'Number of Prompts to Show',
      type: 'number',
      description: 'How many prompts to randomly select and display (default: 2)',
      initialValue: 2,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Chat Suggested Prompts',
        subtitle: 'Initial prompts shown when chat opens',
      }
    },
  },
})
