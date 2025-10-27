'use client'

import { useEffect, useState } from "react";
import Contact from "@/components/Contact";
import { client } from "@/lib/sanity/client";
import { PortableText } from "@portabletext/react";
import { logger } from "@/lib/logger";

interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: any[];
  profileImage?: string;
  social: {
    email?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

const PROFILE_QUERY = `*[_type == "profile"] | order(_updatedAt desc)[0] {
  name,
  title,
  tagline,
  bio,
  "profileImage": profileImage.asset->url,
  social
}`;

export default function AboutPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await client.fetch(PROFILE_QUERY);
        setProfile(data);
      } catch (err) {
        logger.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
              <p className="text-destructive">{error || 'Profile not found'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
              About {profile.name}
            </h1>
            {profile.tagline && (
              <p className="text-xl text-muted-foreground font-light max-w-3xl mx-auto">
                {profile.tagline}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Photo Section */}
            <div className="animate-slide-up">
              <div className="aspect-square bg-muted rounded-3xl overflow-hidden shadow-card border border-border/50">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                    <p className="text-muted-foreground text-lg font-light">Photo placeholder</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8 animate-slide-up">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <PortableText
                  value={profile.bio}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="mb-6 leading-relaxed text-muted-foreground">
                          {children}
                        </p>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
}