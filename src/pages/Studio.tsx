import React, { useEffect, useState } from 'react'

export default function StudioPage() {
  const [StudioComponent, setStudioComponent] = useState<any>(null)

  useEffect(() => {
    // Dynamically import Sanity Studio to avoid SSR issues
    const loadStudio = async () => {
      try {
        const { Studio } = await import('sanity')
        const { defineConfig } = await import('sanity')
        const { structureTool } = await import('sanity/structure')
        const { visionTool } = await import('@sanity/vision')

        // Import schemas
        const projectSchema = await import('../sanity-schemas/project')
        const profileSchema = await import('../sanity-schemas/profile')
        const capabilitySchema = await import('../sanity-schemas/capability')

        const config = defineConfig({
          name: 'default',
          title: 'Michael Evans Portfolio',
          projectId: '5n331bys',
          dataset: 'production',
          plugins: [structureTool(), visionTool()],
          schema: {
            types: [
              projectSchema.default,
              profileSchema.default,
              capabilitySchema.default,
            ],
          },
          basePath: '/studio',
        })

        setStudioComponent(() => () => <Studio config={config} />)
      } catch (error) {
        console.error('Failed to load Sanity Studio:', error)
      }
    }

    loadStudio()
  }, [])

  if (!StudioComponent) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Sanity Studio...</h2>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <StudioComponent />
    </div>
  )
}