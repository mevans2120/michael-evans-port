import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'projectCard',
  title: 'Project Card',
  type: 'document',
  description: 'Individual project for Marketing Sites showcase',
  fields: [
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
      description: 'e.g., "Department of Art", "Opal Creek"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      description: 'e.g., "Film & TV Set Construction · Portland"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      description: 'Project description and key challenges/solutions',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      description: 'Technology tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon character (e.g., "🎬", "💼", "✨")',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (1, 2, 3)',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'projectName',
      subtitle: 'projectType',
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
