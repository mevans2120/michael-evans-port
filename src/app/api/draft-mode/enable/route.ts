import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  // Enable Draft Mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the query parameter, or to the homepage
  redirect(slug || '/')
}
