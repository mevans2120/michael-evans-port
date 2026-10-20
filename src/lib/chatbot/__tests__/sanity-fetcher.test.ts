/**
 * Sanity Content Fetcher Tests
 * Tests content flattening for the chatbot corpus
 *
 * These tests ensure:
 * - Sanity content is properly fetched and transformed
 * - Portable text is converted to plain text correctly
 * - Metadata is properly structured
 * - All content types are handled consistently
 * - URLs and slugs are preserved for chatbot linking
 *
 * Mocks: Sanity client API calls
 * Real: Content transformation logic
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  portableTextToPlainText,
  fetchProjects,
  fetchProfile,
  fetchAIProjects,
  fetchBlogPosts,
  fetchAllSanityContent,
} from '../sanity-fetcher';
import { productionClient } from '@/sanity/lib/client';
import type { PortableTextBlock } from 'sanity';

// Mock Sanity client
vi.mock('@/sanity/lib/client', () => ({
  productionClient: {
    fetch: vi.fn(),
  },
}));

/** The client's overloaded `fetch` signature defeats `vi.mocked`; type the mock loosely once. */
const fetchMock = productionClient.fetch as unknown as Mock<(...args: unknown[]) => Promise<unknown>>;

const CORPUS_CACHE_OPTIONS = { next: { revalidate: false, tags: ['sanity', 'chatbot-corpus'] } };

describe('Sanity Content Fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('portableTextToPlainText', () => {
    it('converts simple text blocks to plain text', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block-1',
          children: [
            { _type: 'span', _key: 'span-1', text: 'Hello world', marks: [] },
          ],
        } as unknown as PortableTextBlock,
      ];

      const result = portableTextToPlainText(blocks);

      expect(result).toBe('Hello world');
    });

    it('joins multiple blocks with double newlines', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block-1',
          children: [
            { _type: 'span', _key: 'span-1', text: 'First paragraph', marks: [] },
          ],
        } as unknown as PortableTextBlock,
        {
          _type: 'block',
          _key: 'block-2',
          children: [
            { _type: 'span', _key: 'span-2', text: 'Second paragraph', marks: [] },
          ],
        } as unknown as PortableTextBlock,
      ];

      const result = portableTextToPlainText(blocks);

      expect(result).toBe('First paragraph\n\nSecond paragraph');
    });

    it('concatenates multiple children in a block', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block-1',
          children: [
            { _type: 'span', _key: 'span-1', text: 'Hello ', marks: [] },
            { _type: 'span', _key: 'span-2', text: 'world', marks: ['strong'] },
          ],
        } as unknown as PortableTextBlock,
      ];

      const result = portableTextToPlainText(blocks);

      expect(result).toBe('Hello world');
    });

    it('skips non-block types', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block-1',
          children: [
            { _type: 'span', _key: 'span-1', text: 'Text content', marks: [] },
          ],
        } as unknown as PortableTextBlock,
        {
          _type: 'image',
          _key: 'image-1',
          asset: { _ref: 'image-123' },
        } as unknown as PortableTextBlock,
      ];

      const result = portableTextToPlainText(blocks);

      expect(result).toBe('Text content');
    });

    it('handles undefined blocks', () => {
      const result = portableTextToPlainText(undefined);
      expect(result).toBe('');
    });

    it('handles empty array', () => {
      const result = portableTextToPlainText([]);
      expect(result).toBe('');
    });

    it('handles blocks without children', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block-1',
        } as unknown as PortableTextBlock,
      ];

      const result = portableTextToPlainText(blocks);

      expect(result).toBe('');
    });

    it('filters out empty blocks', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block-1',
          children: [
            { _type: 'span', _key: 'span-1', text: 'Content', marks: [] },
          ],
        } as unknown as PortableTextBlock,
        {
          _type: 'block',
          _key: 'block-2',
          children: [],
        } as unknown as PortableTextBlock,
        {
          _type: 'block',
          _key: 'block-3',
          children: [
            { _type: 'span', _key: 'span-2', text: 'More content', marks: [] },
          ],
        } as unknown as PortableTextBlock,
      ];

      const result = portableTextToPlainText(blocks);

      expect(result).toBe('Content\n\nMore content');
    });

    // Rich block types from sanity/schemas/project.ts and sanity/schemas/blog.ts
    describe('rich block types', () => {
      const rich = (block: Record<string, unknown>) =>
        portableTextToPlainText([{ _key: 'k', ...block } as unknown as PortableTextBlock]);

      it('renders statBlockQuote as a quote with attribution', () => {
        expect(
          rich({ _type: 'statBlockQuote', quote: 'Finally, a launcher that respects my time.', attribution: 'App Store review' })
        ).toBe('"Finally, a launcher that respects my time." — App Store review');
      });

      it('renders statBlockQuote without attribution as just the quote', () => {
        expect(rich({ _type: 'statBlockQuote', quote: 'Just the quote.' })).toBe('"Just the quote."');
      });

      it('renders quoteBox like statBlockQuote', () => {
        expect(rich({ _type: 'quoteBox', quote: 'Pull quote.', attribution: 'On design' })).toBe(
          '"Pull quote." — On design'
        );
      });

      it('renders statBlockText as heading and text', () => {
        expect(rich({ _type: 'statBlockText', heading: 'Why it worked', text: 'Fewer notifications.' })).toBe(
          'Why it worked\nFewer notifications.'
        );
        expect(rich({ _type: 'statBlockText', text: 'Only text.' })).toBe('Only text.');
        expect(rich({ _type: 'statBlockText', heading: 'Only heading' })).toBe('Only heading');
      });

      it('renders statBlockNumber as number and label', () => {
        expect(rich({ _type: 'statBlockNumber', number: '30-40%', label: 'fewer phone opens' })).toBe(
          '30-40% fewer phone opens'
        );
      });

      it('renders examplePrompt with optional label', () => {
        expect(rich({ _type: 'examplePrompt', label: 'Try this', prompt: 'Summarize the article.' })).toBe(
          'Try this: Summarize the article.'
        );
        expect(rich({ _type: 'examplePrompt', prompt: 'Summarize the article.' })).toBe('Summarize the article.');
      });

      it('renders image caption, falls back to alt, and skips images with neither', () => {
        expect(rich({ _type: 'image', asset: { _ref: 'image-1' }, alt: 'alt', caption: 'Home screen' })).toBe(
          'Home screen'
        );
        expect(rich({ _type: 'image', asset: { _ref: 'image-1' }, alt: 'Home screen alt' })).toBe(
          'Home screen alt'
        );
        expect(rich({ _type: 'image', asset: { _ref: 'image-1' } })).toBe('');
      });

      it('renders imageGrid and portraitImageList captions, falling back to alt', () => {
        const images = [
          { _type: 'image', asset: { _ref: 'a' }, alt: 'First alt', caption: 'First caption' },
          { _type: 'image', asset: { _ref: 'b' }, alt: 'Second alt' },
          { _type: 'image', asset: { _ref: 'c' } },
        ];
        expect(rich({ _type: 'imageGrid', images })).toBe('First caption\nSecond alt');
        expect(rich({ _type: 'portraitImageList', images })).toBe('First caption\nSecond alt');
      });

      it('renders videoEmbed caption only when present', () => {
        expect(rich({ _type: 'videoEmbed', url: 'https://youtu.be/x', caption: 'Demo video' })).toBe('Demo video');
        expect(rich({ _type: 'videoEmbed', url: 'https://youtu.be/x' })).toBe('');
      });

      it('renders marginNote string content and recurses into portable text content', () => {
        expect(rich({ _type: 'marginNote', content: 'Keep prompts short.', variant: 'tip' })).toBe(
          'Keep prompts short.'
        );
        expect(
          rich({
            _type: 'marginNote',
            content: [{ _type: 'block', _key: 'b', children: [{ _type: 'span', _key: 's', text: 'Nested note.' }] }],
          })
        ).toBe('Nested note.');
      });

      it('skips codeBlock and contentTable', () => {
        expect(rich({ _type: 'codeBlock', language: 'ts', code: 'const x = 1;' })).toBe('');
        expect(
          rich({ _type: 'contentTable', caption: 'Table', columns: [{ header: 'A', values: ['1'] }] })
        ).toBe('');
      });

      it('skips unknown block types', () => {
        expect(rich({ _type: 'somethingElse', foo: 'bar' })).toBe('');
      });
    });
  });

  describe('fetchProjects', () => {
    // Mirrors the real `project` schema shape (sanity/schemas/project.ts)
    const projectFixture = {
      _id: 'project-1',
      _updatedAt: '2025-11-18T03:41:27Z',
      title: 'Before Launcher',
      slug: { current: 'before-launcher' },
      category: 'Product',
      heroSection: { subtitle: 'Reduced phone opens by 30-40% with a notification filter.' },
      featuredDescription: 'An Android launcher that cut phone opens by 30-40%.',
      featuredMetric: '30-40% fewer phone opens',
      overview: { role: 'Founder, Product', company: 'Before Labs', timeline: '2017-2020' },
      metrics: [{ label: 'Downloads', value: '100k+', description: 'Play Store' }],
      technologies: ['Android', 'Kotlin'],
      article: [
        { _type: 'block', children: [{ _type: 'span', text: 'Body paragraph one.' }] },
      ],
      chatbotQuestions: ['What is the Before Launcher?'],
      publishedAt: '2020-01-01',
    };

    it('requests the corpus with an indefinite, tag-invalidated data cache', async () => {
      fetchMock.mockResolvedValue([projectFixture]);

      await fetchProjects();

      expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {}, CORPUS_CACHE_OPTIONS);
    });

    it('fetches and transforms project data', async () => {
      fetchMock.mockResolvedValue([projectFixture]);

      const result = await fetchProjects();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        content: expect.stringContaining('Before Launcher'),
        metadata: {
          source: 'sanity_project',
          source_id: 'project-1',
          title: 'Before Launcher',
          category: 'Product',
          slug: 'before-launcher',
          updated_at: '2025-11-18T03:41:27Z',
        },
      });
    });

    it('includes overview, featured description, metric, and article body', async () => {
      fetchMock.mockResolvedValueOnce([projectFixture]);

      const [doc] = await fetchProjects();

      expect(doc.content).toContain('Role: Founder, Product at Before Labs (2017-2020)');
      expect(doc.content).toContain('An Android launcher that cut phone opens by 30-40%.');
      expect(doc.content).toContain('Headline result: 30-40% fewer phone opens');
      expect(doc.content).toContain('Body paragraph one.');
      expect(doc.content).toContain('Downloads: 100k+ (Play Store)');
      expect(doc.content).toContain('Case study URL: /case-studies/before-launcher');
    });

    it('includes the hero subtitle right after the category line', async () => {
      fetchMock.mockResolvedValueOnce([projectFixture]);

      const [doc] = await fetchProjects();

      expect(doc.content).toContain('Reduced phone opens by 30-40% with a notification filter.');
      expect(doc.content).toContain(
        'Category: Product\n\nReduced phone opens by 30-40% with a notification filter.'
      );
    });

    it('carries chatbotOnly into metadata, defaulting to false', async () => {
      fetchMock.mockResolvedValueOnce([projectFixture]);
      const [publicDoc] = await fetchProjects();
      expect(publicDoc.metadata.chatbotOnly).toBe(false);

      fetchMock.mockResolvedValueOnce([{ ...projectFixture, chatbotOnly: true }]);
      const [hiddenDoc] = await fetchProjects();
      expect(hiddenDoc.metadata.chatbotOnly).toBe(true);
    });

    it('carries chatbotQuestions into metadata', async () => {
      fetchMock.mockResolvedValueOnce([projectFixture]);

      const [doc] = await fetchProjects();

      expect(doc.metadata.questions).toEqual(['What is the Before Launcher?']);
      expect(doc.metadata.url).toBe('/case-studies/before-launcher');
    });

    it('includes case study URL in content', async () => {
      const mockProjects = [
        {
          _id: 'project-123',
          _updatedAt: '2025-01-01',
          title: 'Virgin America',
          slug: { current: 'virgin-america' },
          category: 'Case Study',
          technologies: [],
        },
      ];

      fetchMock.mockResolvedValue(mockProjects);

      const result = await fetchProjects();

      expect(result[0].content).toContain('Case study URL: /case-studies/virgin-america');
    });

    it('builds comprehensive content string', async () => {
      const mockProjects = [
        {
          _id: 'project-123',
          _updatedAt: '2025-01-01',
          title: 'Casa Bonita',
          slug: { current: 'casa-bonita' },
          category: 'Experience Design',
          featuredDescription: 'Restaurant redesign project',
          article: [
            {
              _type: 'block',
              children: [
                { _type: 'span', text: 'Detailed case study content' },
              ],
            },
          ],
          metrics: [
            { label: 'Visitors', value: '50% increase' },
          ],
          technologies: ['Figma', 'Adobe XD'],
        },
      ];

      fetchMock.mockResolvedValue(mockProjects);

      const result = await fetchProjects();

      const content = result[0].content;

      expect(content).toContain('# Casa Bonita');
      expect(content).toContain('Category: Experience Design');
      expect(content).toContain('Restaurant redesign project');
      expect(content).toContain('Detailed case study content');
      expect(content).toContain('## Key Metrics');
      expect(content).toContain('Visitors: 50% increase');
      expect(content).toContain('Technologies: Figma, Adobe XD');
    });

    it('handles projects with minimal fields', async () => {
      const mockProjects = [
        {
          _id: 'project-minimal',
          _updatedAt: '2025-01-01',
          title: 'Minimal Project',
          slug: { current: 'minimal' },
        },
      ];

      fetchMock.mockResolvedValue(mockProjects);

      const result = await fetchProjects();

      expect(result).toHaveLength(1);
      expect(result[0].content).toContain('# Minimal Project');
      expect(result[0].metadata.title).toBe('Minimal Project');
    });

    it('includes all metadata fields', async () => {
      const mockProjects = [
        {
          _id: 'project-123',
          _updatedAt: '2025-01-01T12:00:00Z',
          title: 'Test',
          slug: { current: 'test' },
          category: 'UX Design',
          technologies: ['React', 'Node.js'],
        },
      ];

      fetchMock.mockResolvedValue(mockProjects);

      const result = await fetchProjects();

      expect(result[0].metadata).toEqual({
        source: 'sanity_project',
        source_id: 'project-123',
        title: 'Test',
        category: 'UX Design',
        slug: 'test',
        url: '/case-studies/test',
        updated_at: '2025-01-01T12:00:00Z',
        technologies: ['React', 'Node.js'],
        questions: [],
        chatbotOnly: false,
      });
    });
  });

  describe('fetchProfile', () => {
    it('fetches and transforms profile data', async () => {
      const mockProfile = {
        _id: 'profile-singleton',
        _updatedAt: '2025-01-01T00:00:00Z',
        name: 'Michael Evans',
        heroHeadline: 'Product Manager & UX Strategist',
        heroSubheadline: '20 years of experience',
        heroIntro: 'Building innovative products',
        quickFacts: [
          { label: 'Location', value: 'Portland, OR' },
        ],
        title: 'Product Leader',
        tagline: 'Builds things people use',
        chatbotQuestions: ['Where is Michael based?'],
        bio: [
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'Bio content here' },
            ],
          },
        ],
        article: [
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'Extended about content' },
            ],
          },
        ],
        skills: [
          { category: 'Technical', skills: ['JavaScript', 'Python'] },
        ],
        experience: [
          { company: 'Work & Co', role: 'Senior PM', description: 'Led multiple projects' },
        ],
      };

      fetchMock.mockResolvedValue(mockProfile);

      const result = await fetchProfile();

      expect(result).toHaveLength(1);
      expect(result[0].content).toContain('Michael Evans');
      expect(result[0].content).toContain('Product Manager & UX Strategist');
      expect(result[0].content).toContain('Product Leader');
      expect(result[0].content).toContain('Builds things people use');
      expect(result[0].metadata.source).toBe('sanity_profile');
      expect(result[0].metadata.url).toBe('/about');
      expect(result[0].metadata.questions).toEqual(['Where is Michael based?']);
    });

    it('builds comprehensive profile content', async () => {
      const mockProfile = {
        _id: 'profile-singleton',
        _updatedAt: '2025-01-01',
        name: 'Michael Evans',
        heroHeadline: 'PM & Builder',
        bio: [
          { _type: 'block', children: [{ _type: 'span', text: 'Background info' }] },
        ],
        skills: [
          { category: 'Design', skills: ['Figma', 'Sketch'] },
        ],
      };

      fetchMock.mockResolvedValue(mockProfile);

      const result = await fetchProfile();

      const mainContent = result[0].content;

      expect(mainContent).toContain('# Michael Evans');
      expect(mainContent).toContain('PM & Builder');
      expect(mainContent).toContain('## Background');
      expect(mainContent).toContain('Background info');
      expect(mainContent).toContain('## Skills');
      expect(mainContent).toContain('### Design');
      expect(mainContent).toContain('Figma, Sketch');
    });

    it('returns a single profile document with empty questions when none are set', async () => {
      const mockProfile = {
        _id: 'profile-singleton',
        _updatedAt: '2025-01-01',
        name: 'Michael Evans',
      };

      fetchMock.mockResolvedValue(mockProfile);

      const result = await fetchProfile();

      expect(result).toHaveLength(1);
      expect(result[0].metadata.questions).toEqual([]);
    });

    it('returns empty array for null profile', async () => {
      fetchMock.mockResolvedValue(null);

      const result = await fetchProfile();

      expect(result).toEqual([]);
    });

    it('includes article content in main profile document', async () => {
      const mockProfile = {
        _id: 'profile-singleton',
        _updatedAt: '2025-01-01',
        name: 'Michael Evans',
        article: [
          { _type: 'block', children: [{ _type: 'span', text: 'Extended about content here' }] },
        ],
      };

      fetchMock.mockResolvedValue(mockProfile);

      const result = await fetchProfile();

      expect(result[0].content).toContain('## About / Background Details');
      expect(result[0].content).toContain('Extended about content here');
    });
  });

  describe('fetchAIProjects', () => {
    it('fetches and transforms AI project data', async () => {
      const mockProjects = [
        {
          _id: 'ai-project-123',
          _updatedAt: '2025-01-01T00:00:00Z',
          title: 'AI Chatbot System',
          slug: { current: 'ai-chatbot' },
          subtitle: 'RAG-powered chatbot',
          description: 'Advanced AI system',
          category: 'AI/ML',
          status: 'Production',
          overview: {
            problem: 'Need better customer support',
            solution: 'AI-powered chatbot',
            role: 'Lead AI Engineer',
            timeline: '6 months',
          },
          metrics: [
            { label: 'Response Time', value: '<2s' },
          ],
          techStack: ['Python', 'TensorFlow', 'LangChain'],
          aiComponents: [
            {
              name: 'RAG Pipeline',
              description: 'Semantic search with reranking',
              technology: 'LangChain + Pinecone',
            },
          ],
          learnings: ['Importance of context windows'],
          achievements: ['Reduced support tickets by 60%'],
        },
      ];

      fetchMock.mockResolvedValue(mockProjects);

      const result = await fetchAIProjects();

      expect(result).toHaveLength(1);
      expect(result[0].content).toContain('# AI Chatbot System');
      expect(result[0].content).toContain('RAG-powered chatbot');
      expect(result[0].content).toContain('Status: Production');
      expect(result[0].content).toContain('## Problem');
      expect(result[0].content).toContain('Need better customer support');
      expect(result[0].content).toContain('## AI Components');
      expect(result[0].content).toContain('### RAG Pipeline');
      expect(result[0].metadata.source).toBe('sanity_ai_project');
    });

    it('includes all AI project sections', async () => {
      const mockProjects = [
        {
          _id: 'ai-123',
          _updatedAt: '2025-01-01',
          title: 'ML Model',
          slug: { current: 'ml-model' },
          developmentProcess: [
            {
              phase: 'Research',
              description: 'Data collection',
              outcomes: ['Dataset created', 'Baseline established'],
            },
          ],
          learnings: ['Model optimization tips'],
          achievements: ['95% accuracy'],
        },
      ];

      fetchMock.mockResolvedValue(mockProjects);

      const result = await fetchAIProjects();

      expect(result[0].content).toContain('## Development Process');
      expect(result[0].content).toContain('### Research');
      expect(result[0].content).toContain('Data collection');
      expect(result[0].content).toContain('**Outcomes:**');
      expect(result[0].content).toContain('- Dataset created');
      expect(result[0].content).toContain('## Key Learnings');
      expect(result[0].content).toContain('- Model optimization tips');
      expect(result[0].content).toContain('## Achievements');
      expect(result[0].content).toContain('- 95% accuracy');
    });
  });

  describe('fetchBlogPosts', () => {
    it('fetches and transforms blog post data', async () => {
      const mockPosts = [
        {
          _id: 'blog-123',
          _updatedAt: '2025-01-01T00:00:00Z',
          title: 'How to Build Better Products',
          slug: { current: 'better-products' },
          excerpt: 'Tips for product managers',
          content: [
            {
              _type: 'block',
              children: [
                { _type: 'span', text: 'Full blog content here' },
              ],
            },
          ],
          heroSection: {
            badge: 'Product Management',
            subtitle: 'A guide for PMs',
          },
          publishedAt: '2025-01-01T00:00:00Z',
          author: 'Michael Evans',
          featured: true,
          chatbotQuestions: ['How do I build better products?'],
        },
      ];

      fetchMock.mockResolvedValue(mockPosts);

      const result = await fetchBlogPosts();

      expect(result).toHaveLength(1);
      expect(result[0].content).toContain('# How to Build Better Products');
      expect(result[0].content).toContain('Blog post URL: /blog/better-products');
      expect(result[0].content).toContain('Category: Product Management');
      expect(result[0].content).toContain('Tips for product managers');
      expect(result[0].content).toContain('Full blog content here');
      expect(result[0].metadata.source).toBe('sanity_blog');
      expect(result[0].metadata.url).toBe('/blog/better-products');
      expect(result[0].metadata.questions).toEqual(['How do I build better products?']);
    });

    it('includes blog URL in content', async () => {
      const mockPosts = [
        {
          _id: 'blog-123',
          _updatedAt: '2025-01-01',
          title: 'Test Post',
          slug: { current: 'test-post' },
        },
      ];

      fetchMock.mockResolvedValue(mockPosts);

      const result = await fetchBlogPosts();

      expect(result[0].content).toContain('Blog post URL: /blog/test-post');
    });

    it('formats published date', async () => {
      const mockPosts = [
        {
          _id: 'blog-123',
          _updatedAt: '2025-01-01',
          title: 'Test',
          slug: { current: 'test' },
          publishedAt: '2025-01-15T00:00:00Z',
          author: 'Michael Evans',
        },
      ];

      fetchMock.mockResolvedValue(mockPosts);

      const result = await fetchBlogPosts();

      expect(result[0].content).toContain('Published:');
      expect(result[0].content).toContain('Author: Michael Evans');
    });
  });

  describe('fetchAllSanityContent', () => {
    it('fetches and combines all content types', async () => {
      const mockProjects = [{ _id: 'p1', _updatedAt: '2025-01-01', title: 'Project', slug: { current: 'p' } }];
      const mockProfile = { _id: 'profile', _updatedAt: '2025-01-01', name: 'Michael' };
      const mockAIProjects = [{ _id: 'ai1', _updatedAt: '2025-01-01', title: 'AI Project', slug: { current: 'ai' } }];
      const mockBlogPosts = [{ _id: 'blog1', _updatedAt: '2025-01-01', title: 'Blog', slug: { current: 'b' } }];

      fetchMock
        .mockResolvedValueOnce(mockProjects)
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(mockAIProjects)
        .mockResolvedValueOnce(mockBlogPosts);

      const result = await fetchAllSanityContent();

      // Should include: 1 project + 1 profile + 1 AI project + 1 blog = 4 minimum
      expect(result.length).toBeGreaterThanOrEqual(4);

      // Check we have documents from each source
      const sources = result.map(doc => doc.metadata.source);
      expect(sources).toContain('sanity_project');
      expect(sources).toContain('sanity_profile');
      expect(sources).toContain('sanity_ai_project');
      expect(sources).toContain('sanity_blog');
    });

    it('does not log to the console on the request path', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      fetchMock
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await fetchAllSanityContent();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
