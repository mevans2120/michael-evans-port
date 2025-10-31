import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workflowStep',
  title: 'Workflow Step',
  type: 'document',
  description: 'Individual step in the PostPal AI workflow',
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Step Number',
      type: 'number',
      description: 'Step number (1, 2, 3, 4)',
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Step title (e.g., "Provider Upload", "AI Content Extraction")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'What happens in this step',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Optional emoji or icon character',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      stepNumber: 'stepNumber',
    },
    prepare({ title, stepNumber }) {
      return {
        title: `Step ${stepNumber}: ${title}`,
      }
    },
  },
  orderings: [
    {
      title: 'Step Number',
      name: 'stepNumberAsc',
      by: [{ field: 'stepNumber', direction: 'asc' }],
    },
  ],
})
