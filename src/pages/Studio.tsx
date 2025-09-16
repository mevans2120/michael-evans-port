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

        const config = defineConfig({
          name: 'default',
          title: 'Michael Evans Portfolio',
          projectId: 'vc89ievx',
          dataset: 'production',
          plugins: [structureTool()],
          schema: {
            types: [
              {
                name: 'test',
                title: 'Test',
                type: 'document',
                fields: [
                  {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                  },
                ],
              },
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