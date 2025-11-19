import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    // Header Section (Left Side)
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading (e.g., "Get in touch")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
      description: 'Supporting text below heading',
      validation: (Rule) => Rule.required(),
    }),

    // Email Configuration
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Email address for contact',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'emailSubject',
      title: 'Email Subject Line',
      type: 'string',
      description: 'Default subject for email links',
      initialValue: 'Project Inquiry',
    }),

    // Email Links (Right Side)
    defineField({
      name: 'gmailLinkText',
      title: 'Gmail Link Text',
      type: 'string',
      initialValue: 'Email via Gmail',
    }),
    defineField({
      name: 'outlookLinkText',
      title: 'Outlook Link Text',
      type: 'string',
      initialValue: 'Email via Outlook',
    }),
    defineField({
      name: 'copyEmailLinkText',
      title: 'Copy Email Link Text',
      type: 'string',
      initialValue: 'Copy email address',
    }),
    defineField({
      name: 'copiedConfirmationText',
      title: 'Copied Confirmation Text',
      type: 'string',
      initialValue: 'Email copied!',
    }),

    // Footer
    defineField({
      name: 'responseTimeNote',
      title: 'Response Time Note',
      type: 'string',
      description: 'Text shown at bottom (e.g., "I typically respond within 24-48 hours")',
      initialValue: 'I typically respond within 24-48 hours',
    }),

    // Form Configuration
    defineField({
      name: 'form',
      title: 'Form Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'nameLabel',
          title: 'Name Label',
          type: 'string',
          initialValue: 'Name',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email Label',
          type: 'string',
          initialValue: 'Email',
        }),
        defineField({
          name: 'messageLabel',
          title: 'Message Label',
          type: 'string',
          initialValue: 'Message',
        }),
        defineField({
          name: 'sendButtonText',
          title: 'Send Button Text',
          type: 'string',
          initialValue: 'Send Message',
        }),
        defineField({
          name: 'sendingButtonText',
          title: 'Sending Button Text',
          type: 'string',
          initialValue: 'Sending...',
        }),
        defineField({
          name: 'successMessage',
          title: 'Success Message',
          type: 'string',
          initialValue: 'Message sent successfully!',
        }),
        defineField({
          name: 'errorMessage',
          title: 'Error Message',
          type: 'string',
          initialValue: 'Something went wrong. Please try again.',
        }),
      ],
    }),

    // Confirmation Email Configuration
    defineField({
      name: 'confirmationEmail',
      title: 'Confirmation Email',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Confirmation Email',
          type: 'boolean',
          initialValue: false,
          description: 'Send a confirmation email to the user who submitted the form',
        }),
        defineField({
          name: 'fromName',
          title: 'From Name',
          type: 'string',
          initialValue: 'Michael Evans',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'subject',
          title: 'Email Subject',
          type: 'string',
          initialValue: 'Thanks for reaching out!',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'cc',
          title: 'CC Email',
          type: 'string',
          description: 'Optional email address to CC on the confirmation email',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'body',
          title: 'Email Body',
          type: 'text',
          rows: 5,
          initialValue: 'Thanks for your message. I will get back to you shortly.',
          description: 'The content of the confirmation email.',
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Page Title',
          type: 'string',
          description: 'Browser tab title and search results',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Search engine description (150-160 characters)',
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
        subtitle: 'Singleton',
      }
    },
  },
})
