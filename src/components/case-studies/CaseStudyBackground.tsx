'use client'

import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

interface CaseStudyBackgroundProps {
  image?: {
    asset?: {
      _id: string
      url: string
    }
    alt?: string
  }
}

export function CaseStudyBackground({ image }: CaseStudyBackgroundProps) {
  if (!image?.asset) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50" />
    )
  }

  const imageUrl = urlFor(image)
    .width(1920)
    .height(1080)
    .quality(75)
    .url()

  return (
    <>
      {/* Background image layer */}
      <div className="absolute inset-0 opacity-25">
        <Image
          src={imageUrl}
          alt={image.alt || ''}
          fill
          className="object-cover blur-[4px] grayscale-[20%]"
          priority
          quality={75}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/80 to-slate-950/75"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(5,5,16,0.75) 0%, rgba(15,23,42,0.80) 50%, rgba(5,5,16,0.75) 100%)'
        }}
      />

      {/* Blur orb */}
      <div
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none z-[1] blur-[100px]"
        style={{
          background: 'rgba(168, 85, 247, 0.15)'
        }}
      />
    </>
  )
}
