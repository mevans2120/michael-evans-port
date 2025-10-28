'use client'

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path are handled by this file.
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
