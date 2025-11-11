'use server'

import { revalidateTag } from 'next/cache'

/**
 * Server Action: Revalidate Sanity Document by Type
 *
 * This server action provides targeted revalidation for Sanity documents
 * used by the VisualEditing component's custom refresh handler.
 *
 * @param documentType - The Sanity document type (e.g., 'blog', 'project')
 * @see /src/components/VisualEditingWrapper.tsx
 * @see /docs/sanity-presentation-revalidation-research.md
 */
export async function revalidateSanityDocument(documentType: string) {
  await revalidateTag(documentType)
}
