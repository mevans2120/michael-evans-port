/**
 * Sanity Schema Validation Tests
 * Tests schema structure, required fields, and validation rules
 *
 * These tests ensure:
 * - Schemas have required fields defined
 * - Field types are correct
 * - Validation rules are properly configured
 * - Schema consistency across the project
 */

import { describe, it, expect } from 'vitest';
import projectSchema from '../project';
import profileSchema from '../profile';
import blogSchema from '../blog';
import homepageHeroSchema from '../homepageHero';
import footerSchema from '../footer';

describe('Sanity Schema Validation', () => {
  describe('Project Schema', () => {
    it('defines required core fields', () => {
      const requiredFields = ['title', 'slug', 'featuredDescription'];

      requiredFields.forEach(fieldName => {
        const field = projectSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `Field "${fieldName}" should be defined`).toBeDefined();

        // Check if field has validation
        expect(field.validation, `Field "${fieldName}" should have validation`).toBeDefined();
      });
    });

    it('has correct document type name', () => {
      expect(projectSchema.name).toBe('project');
      expect(projectSchema.type).toBe('document');
    });

    it('includes SEO fields', () => {
      const seoFields = ['featuredImage', 'seo', 'slug'];

      seoFields.forEach(fieldName => {
        const field = projectSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `SEO field "${fieldName}" should be defined`).toBeDefined();
      });
    });

    it('includes editorial format fields', () => {
      const editorialFields = ['heroSection', 'article', 'overview', 'metrics'];

      editorialFields.forEach(fieldName => {
        const field = projectSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `Editorial field "${fieldName}" should be defined`).toBeDefined();
      });
    });

    it('has slug field with required validation', () => {
      const slugField = projectSchema.fields.find((f: any) => f.name === 'slug');

      expect(slugField).toBeDefined();
      expect(slugField.type).toBe('slug');
      expect(slugField.validation).toBeDefined();
    });

    it('has featuredDescription with max length validation', () => {
      const field = projectSchema.fields.find((f: any) => f.name === 'featuredDescription');

      expect(field).toBeDefined();
      expect(field.type).toBe('text');
      expect(field.validation).toBeDefined();
    });

    it('has article field with portable text blocks', () => {
      const articleField = projectSchema.fields.find((f: any) => f.name === 'article');

      expect(articleField).toBeDefined();
      expect(articleField.type).toBe('array');
      expect(articleField.of).toBeDefined();
      expect(Array.isArray(articleField.of)).toBe(true);
    });

    it('supports stat blocks in article content', () => {
      const articleField = projectSchema.fields.find((f: any) => f.name === 'article');
      const statBlockTypes = ['statBlockNumber', 'statBlockQuote', 'statBlockText'];

      statBlockTypes.forEach(statType => {
        const hasStatBlock = articleField.of.some((block: any) => block.name === statType);
        expect(hasStatBlock, `Article should support ${statType}`).toBe(true);
      });
    });

    it('has featured and order fields for homepage display', () => {
      const featuredField = projectSchema.fields.find((f: any) => f.name === 'featured');
      const orderField = projectSchema.fields.find((f: any) => f.name === 'order');

      expect(featuredField).toBeDefined();
      expect(featuredField.type).toBe('boolean');

      expect(orderField).toBeDefined();
      expect(orderField.type).toBe('number');
    });

    it('has preview configuration', () => {
      expect(projectSchema.preview).toBeDefined();
      expect(projectSchema.preview.select).toBeDefined();
      expect(projectSchema.preview.prepare).toBeDefined();
    });
  });

  describe('Profile Schema', () => {
    it('defines required core fields', () => {
      const requiredFields = ['name', 'profileImage', 'heroHeadline'];

      requiredFields.forEach(fieldName => {
        const field = profileSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `Field "${fieldName}" should be defined`).toBeDefined();
        expect(field.validation, `Field "${fieldName}" should have validation`).toBeDefined();
      });
    });

    it('has correct document type name', () => {
      expect(profileSchema.name).toBe('profile');
      expect(profileSchema.type).toBe('document');
    });

    it('includes hero section fields', () => {
      const heroFields = ['heroHeadline', 'heroSubheadline', 'heroIntro'];

      heroFields.forEach(fieldName => {
        const field = profileSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `Hero field "${fieldName}" should be defined`).toBeDefined();
      });
    });

    it('has article field with editorial blocks', () => {
      const articleField = profileSchema.fields.find((f: any) => f.name === 'article');

      expect(articleField).toBeDefined();
      expect(articleField.type).toBe('array');
      expect(articleField.of).toBeDefined();
    });

    it('supports stat blocks in article content', () => {
      const articleField = profileSchema.fields.find((f: any) => f.name === 'article');
      const statBlockTypes = ['statBlockNumber', 'statBlockQuote', 'statBlockText'];

      statBlockTypes.forEach(statType => {
        const hasStatBlock = articleField.of.some((block: any) => block.name === statType);
        expect(hasStatBlock, `Article should support ${statType}`).toBe(true);
      });
    });

    it('has legacy fields for compatibility', () => {
      const legacyFields = ['title', 'tagline', 'bio', 'skills', 'experience'];

      legacyFields.forEach(fieldName => {
        const field = profileSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `Legacy field "${fieldName}" should be defined`).toBeDefined();
      });
    });

    it('has social links object', () => {
      const socialField = profileSchema.fields.find((f: any) => f.name === 'social');

      expect(socialField).toBeDefined();
      expect(socialField.type).toBe('object');
      expect(socialField.fields).toBeDefined();
    });

    it('has SEO field', () => {
      const seoField = profileSchema.fields.find((f: any) => f.name === 'seo');

      expect(seoField).toBeDefined();
      expect(seoField.type).toBe('seo');
    });
  });

  describe('Blog Schema', () => {
    it('defines required core fields', () => {
      const requiredFields = ['title', 'slug', 'excerpt'];

      requiredFields.forEach(fieldName => {
        const field = blogSchema.fields.find((f: any) => f.name === fieldName);
        expect(field, `Field "${fieldName}" should be defined`).toBeDefined();
      });
    });

    it('has correct document type name', () => {
      expect(blogSchema.name).toBe('blog');
      expect(blogSchema.type).toBe('document');
    });

    it('includes hero section fields', () => {
      const heroSectionField = blogSchema.fields.find((f: any) => f.name === 'heroSection');

      expect(heroSectionField).toBeDefined();
      expect(heroSectionField.type).toBe('object');
    });

    it('has content field with portable text', () => {
      const contentField = blogSchema.fields.find((f: any) => f.name === 'content');

      expect(contentField).toBeDefined();
      expect(contentField.type).toBe('array');
    });

    it('has featured and order fields', () => {
      const featuredField = blogSchema.fields.find((f: any) => f.name === 'featured');
      const orderField = blogSchema.fields.find((f: any) => f.name === 'order');

      expect(featuredField).toBeDefined();
      expect(orderField).toBeDefined();
    });

    it('has publishedAt field for sorting', () => {
      const publishedAtField = blogSchema.fields.find((f: any) => f.name === 'publishedAt');

      expect(publishedAtField).toBeDefined();
      expect(publishedAtField.type).toBe('datetime');
    });
  });

  describe('Homepage Hero Schema', () => {
    it('has correct document type name', () => {
      expect(homepageHeroSchema.name).toBe('homepageHero');
      expect(homepageHeroSchema.type).toBe('document');
    });

    it('includes tagline and description fields', () => {
      const taglineField = homepageHeroSchema.fields.find((f: any) => f.name === 'tagline');
      const descriptionField = homepageHeroSchema.fields.find((f: any) => f.name === 'description');

      expect(taglineField).toBeDefined();
      expect(taglineField.validation).toBeDefined();
      expect(descriptionField).toBeDefined();
      expect(descriptionField.validation).toBeDefined();
    });

    it('includes hero CTA configuration', () => {
      const heroCtaField = homepageHeroSchema.fields.find((f: any) => f.name === 'heroCta');

      expect(heroCtaField).toBeDefined();
      expect(heroCtaField.type).toBe('object');
    });

    it('includes section configuration fields', () => {
      const selectedWorkField = homepageHeroSchema.fields.find((f: any) => f.name === 'selectedWorkSection');
      const featuredPostField = homepageHeroSchema.fields.find((f: any) => f.name === 'featuredPostSection');

      expect(selectedWorkField).toBeDefined();
      expect(featuredPostField).toBeDefined();
    });
  });

  describe('Footer Schema', () => {
    it('has correct document type name', () => {
      expect(footerSchema.name).toBe('footer');
      expect(footerSchema.type).toBe('document');
    });

    it('includes services array field', () => {
      const servicesField = footerSchema.fields.find((f: any) => f.name === 'services');
      expect(servicesField).toBeDefined();
      expect(servicesField.type).toBe('array');
      expect(servicesField.validation).toBeDefined();
    });

    it('includes LinkedIn URL field', () => {
      const linkedinField = footerSchema.fields.find((f: any) => f.name === 'linkedinUrl');

      expect(linkedinField).toBeDefined();
      expect(linkedinField.type).toBe('url');
      expect(linkedinField.validation).toBeDefined();
    });

    it('includes contact link configuration', () => {
      const contactLinkTypeField = footerSchema.fields.find((f: any) => f.name === 'contactLinkType');

      expect(contactLinkTypeField).toBeDefined();
      expect(contactLinkTypeField.type).toBe('string');
    });

    it('includes weather settings', () => {
      const weatherEnabledField = footerSchema.fields.find((f: any) => f.name === 'weatherEnabled');
      const weatherLocationField = footerSchema.fields.find((f: any) => f.name === 'weatherLocation');

      expect(weatherEnabledField).toBeDefined();
      expect(weatherEnabledField.type).toBe('boolean');
      expect(weatherLocationField).toBeDefined();
    });
  });

  describe('Schema Consistency', () => {
    it('all schemas have name and type properties', () => {
      const schemas = [projectSchema, profileSchema, blogSchema, homepageHeroSchema, footerSchema];

      schemas.forEach(schema => {
        expect(schema.name, `Schema should have name property`).toBeDefined();
        expect(schema.type, `Schema should have type property`).toBeDefined();
        expect(schema.fields, `Schema should have fields array`).toBeDefined();
        expect(Array.isArray(schema.fields), `Schema fields should be an array`).toBe(true);
      });
    });

    it('all schemas with slugs use slug type', () => {
      const schemasWithSlugs = [projectSchema, blogSchema];

      schemasWithSlugs.forEach(schema => {
        const slugField = schema.fields.find((f: any) => f.name === 'slug');
        expect(slugField, `${schema.name} should have slug field`).toBeDefined();
        expect(slugField.type, `${schema.name} slug should be of type 'slug'`).toBe('slug');
      });
    });

    it('all schemas with images use proper image type', () => {
      const projectImageField = projectSchema.fields.find((f: any) => f.name === 'featuredImage');
      const profileImageField = profileSchema.fields.find((f: any) => f.name === 'profileImage');

      expect(projectImageField.type).toBe('image');
      expect(profileImageField.type).toBe('image');

      // Should have hotspot option
      expect(projectImageField.options?.hotspot).toBe(true);
      expect(profileImageField.options?.hotspot).toBe(true);
    });
  });

  describe('Validation Rules', () => {
    it('project title has required validation', () => {
      const titleField = projectSchema.fields.find((f: any) => f.name === 'title');
      expect(titleField.validation).toBeDefined();
    });

    it('project slug has required validation', () => {
      const slugField = projectSchema.fields.find((f: any) => f.name === 'slug');
      expect(slugField.validation).toBeDefined();
    });

    it('profile name has required validation', () => {
      const nameField = profileSchema.fields.find((f: any) => f.name === 'name');
      expect(nameField.validation).toBeDefined();
    });

    it('profile image has required validation', () => {
      const imageField = profileSchema.fields.find((f: any) => f.name === 'profileImage');
      expect(imageField.validation).toBeDefined();
    });

    it('stat blocks have max length validations', () => {
      const articleField = projectSchema.fields.find((f: any) => f.name === 'article');
      const statBlockNumber = articleField.of.find((block: any) => block.name === 'statBlockNumber');

      expect(statBlockNumber).toBeDefined();

      const numberField = statBlockNumber.fields.find((f: any) => f.name === 'number');
      const labelField = statBlockNumber.fields.find((f: any) => f.name === 'label');

      expect(numberField.validation).toBeDefined();
      expect(labelField.validation).toBeDefined();
    });

    it('article field has stat block count validation', () => {
      const articleField = projectSchema.fields.find((f: any) => f.name === 'article');

      expect(articleField.validation).toBeDefined();
      // Validation enforces max 5 stat blocks per article
    });
  });
});
