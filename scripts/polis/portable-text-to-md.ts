/**
 * Portable Text to Markdown Converter for Polis Export
 *
 * Converts Sanity Portable Text blocks into standard Markdown
 * suitable for Polis publishing. Handles all block types from
 * the blog schema: text, images, image grids, portrait lists,
 * video embeds, margin notes, example prompts, and tables.
 *
 * Images are referenced via Sanity CDN URLs — no copying needed.
 */

// ---------------------------------------------------------------------------
// Types (matching the shapes returned by GROQ queries)
// ---------------------------------------------------------------------------

interface Span {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

interface MarkDef {
  _key: string
  _type: string
  href?: string
  note?: string
}

interface TextBlock {
  _type: 'block'
  _key: string
  style?: string
  children?: Span[]
  markDefs?: MarkDef[]
}

interface ImageAsset {
  _id?: string
  url?: string
}

interface ImageBlock {
  _type: 'image'
  _key: string
  asset?: ImageAsset
  alt?: string
  caption?: string
  style?: string
}

interface ImageGridBlock {
  _type: 'imageGrid'
  _key: string
  images?: Array<{
    asset?: ImageAsset
    alt?: string
    caption?: string
  }>
}

interface PortraitImageListBlock {
  _type: 'portraitImageList'
  _key: string
  images?: Array<{
    asset?: ImageAsset
    alt?: string
    caption?: string
  }>
}

interface VideoEmbedBlock {
  _type: 'videoEmbed'
  _key: string
  url?: string
  caption?: string
}

interface MarginNoteBlock {
  _type: 'marginNote'
  _key: string
  content?: string
  variant?: 'tip' | 'pro'
}

interface ExamplePromptBlock {
  _type: 'examplePrompt'
  _key: string
  prompt?: string
  label?: string
}

interface TableColumn {
  header?: string
  values?: string[]
}

interface ContentTableBlock {
  _type: 'contentTable'
  _key: string
  caption?: string
  columns?: TableColumn[]
}

type Block =
  | TextBlock
  | ImageBlock
  | ImageGridBlock
  | PortraitImageListBlock
  | VideoEmbedBlock
  | MarginNoteBlock
  | ExamplePromptBlock
  | ContentTableBlock

// ---------------------------------------------------------------------------
// Footnote collector — gathers footnotes for end-of-document rendering
// ---------------------------------------------------------------------------

interface FootnoteEntry {
  index: number
  note: string
}

class FootnoteCollector {
  private footnotes: FootnoteEntry[] = []

  add(note: string): number {
    const index = this.footnotes.length + 1
    this.footnotes.push({ index, note })
    return index
  }

  render(): string {
    if (this.footnotes.length === 0) return ''
    const lines = this.footnotes.map((fn) => `[^${fn.index}]: ${fn.note}`)
    return '\n---\n\n' + lines.join('\n\n')
  }
}

// ---------------------------------------------------------------------------
// Image URL helper
// ---------------------------------------------------------------------------

function imageUrl(asset: ImageAsset | undefined, width = 1200, quality = 80): string {
  if (!asset?.url) return ''
  // Sanity CDN URLs can take query parameters for transforms
  const base = asset.url
  return `${base}?w=${width}&q=${quality}&auto=format`
}

// ---------------------------------------------------------------------------
// Span renderer — handles inline marks (bold, italic, code, links, footnotes)
// ---------------------------------------------------------------------------

function renderSpans(children: Span[], markDefs: MarkDef[], footnotes: FootnoteCollector): string {
  return children
    .map((child) => {
      let text = child.text

      // Process marks from innermost to outermost
      const marks = child.marks || []

      // Separate decorator marks from annotation marks
      const decorators: string[] = []
      const annotations: MarkDef[] = []

      for (const mark of marks) {
        if (['strong', 'em', 'code'].includes(mark)) {
          decorators.push(mark)
        } else {
          const def = markDefs.find((md) => md._key === mark)
          if (def) annotations.push(def)
        }
      }

      // Apply decorators
      if (decorators.includes('code')) text = `\`${text}\``
      if (decorators.includes('strong')) text = `**${text}**`
      if (decorators.includes('em')) text = `*${text}*`

      // Apply annotations
      for (const def of annotations) {
        if (def._type === 'link' && def.href) {
          text = `[${text}](${def.href})`
        } else if (def._type === 'footnote' && def.note) {
          const idx = footnotes.add(def.note)
          text = `${text}[^${idx}]`
        }
      }

      return text
    })
    .join('')
}

// ---------------------------------------------------------------------------
// Block renderers
// ---------------------------------------------------------------------------

function renderTextBlock(block: TextBlock, footnotes: FootnoteCollector): string {
  const children = block.children || []
  const markDefs = block.markDefs || []

  if (children.length === 0) return ''

  const text = renderSpans(children, markDefs, footnotes)
  if (!text.trim()) return ''

  switch (block.style) {
    case 'h2':
      return `## ${text}`
    case 'h3':
      return `### ${text}`
    case 'h4':
      return `#### ${text}`
    case 'blockquote':
      return `> ${text}`
    default:
      return text
  }
}

function renderImage(block: ImageBlock): string {
  const url = imageUrl(block.asset)
  if (!url) return ''
  const alt = (block.alt || '').replace(/\]/g, '\\]')
  const caption = block.caption ? `\n\n*${block.caption}*` : ''
  return `![${alt}](${url})${caption}`
}

function renderImageGrid(block: ImageGridBlock): string {
  const images = block.images || []
  if (images.length === 0) return ''
  return images
    .map((img) => {
      const url = imageUrl(img.asset, 800)
      if (!url) return ''
      const alt = (img.alt || '').replace(/\]/g, '\\]')
      const caption = img.caption ? `\n\n*${img.caption}*` : ''
      return `![${alt}](${url})${caption}`
    })
    .filter(Boolean)
    .join('\n\n')
}

function renderPortraitImageList(block: PortraitImageListBlock): string {
  // Same approach as image grid — sequential images
  const images = block.images || []
  if (images.length === 0) return ''
  return images
    .map((img) => {
      const url = imageUrl(img.asset, 800)
      if (!url) return ''
      const alt = (img.alt || '').replace(/\]/g, '\\]')
      const caption = img.caption ? `\n\n*${img.caption}*` : ''
      return `![${alt}](${url})${caption}`
    })
    .filter(Boolean)
    .join('\n\n')
}

function renderVideoEmbed(block: VideoEmbedBlock): string {
  if (!block.url) return ''
  const caption = block.caption || 'Video'
  return `[${caption}](${block.url})`
}

function renderMarginNote(block: MarginNoteBlock): string {
  if (!block.content) return ''
  const prefix = block.variant === 'pro' ? '**Pro Tip:**' : '**Tip:**'
  return `> ${prefix} ${block.content}`
}

function renderExamplePrompt(block: ExamplePromptBlock): string {
  if (!block.prompt) return ''
  const label = block.label || 'Example Prompt'
  return `> **${label}:** ${block.prompt}`
}

function renderTable(block: ContentTableBlock): string {
  const columns = block.columns || []
  if (columns.length === 0) return ''

  const headers = columns.map((col) => col.header || '')
  const rowCount = Math.max(...columns.map((col) => col.values?.length || 0))

  // Header row
  const headerRow = '| ' + headers.join(' | ') + ' |'
  const separatorRow = '| ' + headers.map(() => '---').join(' | ') + ' |'

  // Data rows
  const dataRows: string[] = []
  for (let i = 0; i < rowCount; i++) {
    const cells = columns.map((col) => (col.values?.[i] || '').replace(/\|/g, '\\|'))
    dataRows.push('| ' + cells.join(' | ') + ' |')
  }

  const table = [headerRow, separatorRow, ...dataRows].join('\n')
  const caption = block.caption ? `\n\n*${block.caption}*` : ''
  return table + caption
}

// ---------------------------------------------------------------------------
// Main converter
// ---------------------------------------------------------------------------

export function portableTextToMarkdown(blocks: Block[]): string {
  const footnotes = new FootnoteCollector()

  const rendered = blocks
    .map((block) => {
      switch (block._type) {
        case 'block':
          return renderTextBlock(block as TextBlock, footnotes)
        case 'image':
          return renderImage(block as ImageBlock)
        case 'imageGrid':
          return renderImageGrid(block as ImageGridBlock)
        case 'portraitImageList':
          return renderPortraitImageList(block as PortraitImageListBlock)
        case 'videoEmbed':
          return renderVideoEmbed(block as VideoEmbedBlock)
        case 'marginNote':
          return renderMarginNote(block as MarginNoteBlock)
        case 'examplePrompt':
          return renderExamplePrompt(block as ExamplePromptBlock)
        case 'contentTable':
          return renderTable(block as ContentTableBlock)
        default:
          return ''
      }
    })
    .filter(Boolean)

  const body = rendered.join('\n\n')
  const footnotesSection = footnotes.render()

  return body + footnotesSection + '\n'
}
