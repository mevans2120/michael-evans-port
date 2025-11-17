import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'timelinePhase',
  title: 'Timeline Phase',
  type: 'document',
  description: 'Individual phase in the AI Workflow timeline',
  fields: [
    defineField({
      name: 'phase',
      title: 'Phase Label',
      type: 'string',
      description: 'Time period or phase identifier (e.g., "Spring 2024", "Early 2024")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Phase title (e.g., "Experimentation", "Tool Discovery")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Description of what happened in this phase',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (1, 2, 3, etc.)',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'phase',
      order: 'order',
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
