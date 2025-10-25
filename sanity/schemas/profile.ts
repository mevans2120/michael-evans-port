import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  __experimental_singleton: true,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
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
      subtitle: 'title',
      media: 'profileImage',
    },
  },
})