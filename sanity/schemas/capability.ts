import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'capability',
  title: 'Capabilities',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Product Strategy', value: 'product-strategy' },
          { title: 'AI/ML', value: 'ai-ml' },
          { title: 'Development', value: 'development' },
          { title: 'Design', value: 'design' },
          { title: 'Leadership', value: 'leadership' },
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., "brain", "code", "users")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'skills',
      title: 'Related Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})