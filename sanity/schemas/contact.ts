import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact Information',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
      description: 'Primary contact email',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Optional phone number',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, State or general location',
    }),
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available for Work', value: 'available' },
          { title: 'Open to Opportunities', value: 'open' },
          { title: 'Not Available', value: 'unavailable' },
        ],
        layout: 'radio',
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
        {
          name: 'github',
          title: 'GitHub',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        },
        {
          name: 'website',
          title: 'Personal Website',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'CTA Heading',
          type: 'string',
          initialValue: 'Let\'s Work Together',
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          rows: 3,
          initialValue: 'Have a project in mind? Get in touch and let\'s discuss how I can help bring your ideas to life.',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Get in Touch',
        },
      ],
    }),
  ],
  preview: {
    select: {
      email: 'email',
      location: 'location',
      availability: 'availability',
    },
    prepare({ email, location, availability }) {
      return {
        title: email || 'Contact Information',
        subtitle: `${location || 'Location not set'} • ${availability || 'Status not set'}`,
      }
    },
  },
})
