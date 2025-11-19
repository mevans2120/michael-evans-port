'use client'

import dynamic from 'next/dynamic'

const VisualEditingWrapper = dynamic(
    () => import('./VisualEditingWrapper').then((mod) => mod.VisualEditingWrapper),
    { ssr: false }
)

export function SanityVisualEditingLoader() {
    return <VisualEditingWrapper />
}
