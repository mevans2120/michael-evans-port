import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virgin America: First Responsive Airline Website - Case Study',
  description: 'Reimagining airline booking by focusing on decisions, not clicks — achieving 15-20% conversion improvement',
}

export default function VirginAmericaDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#050510] text-white overflow-x-hidden">
      {/* Atmospheric blur orbs - fixed position, behind content */}
      <div
        className="blur-orb-1 fixed pointer-events-none -z-10"
        style={{
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'hsl(280, 100%, 70%)',
          opacity: 0.15,
          filter: 'blur(100px)',
        }}
      />
      <div
        className="blur-orb-2 fixed pointer-events-none -z-10"
        style={{
          bottom: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'hsl(276, 100%, 75%)',
          opacity: 0.15,
          filter: 'blur(100px)',
        }}
      />

      {/* Hero Section */}
      <section className="hero relative min-h-screen flex items-center justify-center text-center px-8 py-32">
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Category Badge */}
          <div
            className="inline-block px-6 py-2 mb-8 rounded-full text-xs font-semibold uppercase tracking-[0.1em]"
            style={{
              background: 'rgba(199, 128, 245, 0.1)',
              border: '1px solid rgba(199, 128, 245, 0.3)',
              color: 'hsl(280, 100%, 80%)',
            }}
          >
            Case Study
          </div>

          {/* Hero Title with Gradient */}
          <h1
            className="font-semibold mb-8"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Virgin America:<br />First Responsive Airline Website
          </h1>

          {/* Hero Subtitle */}
          <p
            className="font-light leading-relaxed max-w-3xl mx-auto mb-8"
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: '#a0a0a0',
            }}
          >
            Reimagining airline booking by focusing on decisions, not clicks — achieving 15-20% conversion improvement
          </p>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            {['Angular', 'Sabre API', 'Responsive Design', 'Single-Page Application'].map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 rounded-xl text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="relative py-32 z-10">
        <div className="container max-w-[1200px] mx-auto px-8">
          <div
            className="text-xs font-bold uppercase mb-8"
            style={{
              letterSpacing: '0.15em',
              color: 'hsl(280, 100%, 80%)',
            }}
          >
            The Challenge
          </div>

          <h2
            className="font-light mb-8 relative pb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: '1.3',
            }}
          >
            Understanding the Real Problem
            <span
              className="absolute bottom-0 left-0 w-16 h-px"
              style={{
                background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)',
              }}
            />
          </h2>

          <p
            className="font-light leading-[1.8] mb-6"
            style={{
              fontSize: '1.25rem',
              color: '#d0d0d0',
              maxWidth: '900px',
            }}
          >
            Most of Virgin America's revenue came from business travelers—frequent flyers who pay premium prices and book last-minute. They'll figure out how to use any booking system.
          </p>

          <p
            className="font-light leading-[1.8] mb-6"
            style={{
              fontSize: '1.25rem',
              color: '#d0d0d0',
              maxWidth: '900px',
            }}
          >
            But leisure travelers, who book 2-3 times per year, were struggling. An airline ticket is one of the most complex consumer products to purchase. Leisure travelers were failing to convert at alarming rates.
          </p>

          <p
            className="font-medium leading-[1.8]"
            style={{
              fontSize: '1.25rem',
              color: 'hsl(280, 100%, 80%)',
              maxWidth: '900px',
            }}
          >
            The brief: make it simpler for leisure travelers without compromising the experience for business travelers.
          </p>
        </div>
      </section>

      {/* Research Insights Section - with alternating background */}
      <section
        className="relative py-32 z-10"
        style={{
          background: 'rgba(199, 128, 245, 0.03)',
        }}
      >
        <div className="container max-w-[1200px] mx-auto px-8">
          <div className="text-xs font-bold uppercase mb-8" style={{letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)'}}>
            Research Insights
          </div>

          <h2 className="font-light mb-8 relative pb-4" style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3'}}>
            Clicks vs. Decisions:<br />The Key Insight
            <span className="absolute bottom-0 left-0 w-16 h-px" style={{background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)'}} />
          </h2>

          <p className="font-light leading-[1.8] mb-6" style={{fontSize: '1.25rem', color: '#d0d0d0', maxWidth: '900px'}}>
            In 2014-2015, the industry was obsessed with reducing clicks to improve conversion. We discovered something more fundamental: it's not about the number of clicks—it's about the number of decisions.
          </p>

          <p className="font-light leading-[1.8] mb-6" style={{fontSize: '1.25rem', color: '#d0d0d0', maxWidth: '900px'}}>
            Combining multiple decisions into one screen to reduce clicks actually makes the experience more complicated and overwhelming. Each decision needs space to breathe.
          </p>

          <p className="font-medium leading-[1.8]" style={{fontSize: '1.25rem', color: '#fafafa', maxWidth: '900px'}}>
            Our insight: Separate every major decision into its own step. Give users cognitive breathing room.
          </p>

          {/* Annotation */}
          <div className="mt-16 p-8 rounded-lg text-[0.95rem] leading-[1.6] italic" style={{background: 'rgba(199, 128, 245, 0.05)', borderLeft: '3px solid hsl(280, 100%, 80%)', color: '#c0c0c0'}}>
            <strong className="not-italic" style={{color: 'hsl(280, 100%, 80%)'}}>
              Design Decision:
            </strong> This long-form scrolling approach mirrors the insight itself—giving each section space to breathe. Instead of cramming information into slides, we let the narrative unfold naturally as users scroll. The parallax blur orbs create depth and atmosphere without overwhelming the content.
          </div>

          {/* Large Screenshot */}
          <div className="mt-16 max-w-[1100px] mx-auto">
            <div className="relative rounded-2xl overflow-hidden" style={{aspectRatio: '16 / 9', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              <div className="w-full h-full flex items-center justify-center text-center px-8 text-sm" style={{background: 'linear-gradient(135deg, rgba(199, 128, 245, 0.1), rgba(199, 128, 245, 0.05))', color: '#707070'}}>
                Screenshot: Virgin America's old booking flow<br />
                Showing the complex, multi-decision screen that confused users
              </div>
            </div>
            <div className="mt-4 text-sm text-center" style={{color: '#a0a0a0'}}>
              Before: Complex booking screens combined multiple decisions, overwhelming leisure travelers
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-32 z-10">
        <div className="container max-w-[1200px] mx-auto px-8">
          <div className="text-xs font-bold uppercase mb-8" style={{letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)'}}>
            The Solution
          </div>

          <h2 className="font-light mb-8 relative pb-4" style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3'}}>
            A Step-by-Step Booking Flow
            <span className="absolute bottom-0 left-0 w-16 h-px" style={{background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)'}} />
          </h2>

          <p className="font-light leading-[1.8] mb-6" style={{fontSize: '1.25rem', color: '#d0d0d0', maxWidth: '900px'}}>
            We redesigned the entire booking flow around individual decisions, with each step optimized independently and clear progress indicators.
          </p>

          <p className="font-light leading-[1.8] mb-6" style={{fontSize: '1.25rem', color: '#d0d0d0', maxWidth: '900px'}}>
            The new flow began with a simple question: <strong style={{color: 'hsl(280, 100%, 80%)'}}>who's going?</strong> Clear passenger selection without distractions. Once that decision was made, users moved to <strong style={{color: 'hsl(280, 100%, 80%)'}}>dates and times</strong>—a focused date picker that didn't compete for attention with flight options or pricing.
          </p>

          <p className="font-light leading-[1.8] mb-6" style={{fontSize: '1.25rem', color: '#d0d0d0', maxWidth: '900px'}}>
            Only after those foundational decisions were locked in did we present <strong style={{color: 'hsl(280, 100%, 80%)'}}>flight options</strong>, with clear differentiation between choices. Then came <strong style={{color: 'hsl(280, 100%, 80%)'}}>seat selection</strong>—a visual, interactive seat map that made the decision tangible. <strong style={{color: 'hsl(280, 100%, 80%)'}}>Traveler information</strong> was simplified into digestible form fields. Finally, a clear <strong style={{color: 'hsl(280, 100%, 80%)'}}>confirmation</strong> screen summarized everything before payment.
          </p>

          <p className="font-light leading-[1.8] italic" style={{fontSize: '1.25rem', color: '#d0d0d0', maxWidth: '900px'}}>
            This pattern became widely adopted in e-commerce and is now considered standard practice for complex purchase flows.
          </p>

          {/* Screenshot Grid */}
          <div className="mt-16">
            <div className="grid gap-8" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
              {[
                { step: 'Step 1', title: "Who's going?", caption: 'Passenger selection with clear, focused UI' },
                { step: 'Step 2', title: 'Dates & times', caption: 'Date picker without distractions' },
                { step: 'Step 3', title: 'Flight selection', caption: 'Clear differentiation between flight options' },
                { step: 'Step 4', title: 'Seat selection', caption: 'Visual, interactive seat map' },
              ].map((item) => (
                <div key={item.step}>
                  <div className="relative rounded-2xl overflow-hidden" style={{aspectRatio: '16 / 10', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <div className="w-full h-full flex items-center justify-center text-center px-8 text-sm" style={{background: 'linear-gradient(135deg, rgba(199, 128, 245, 0.1), rgba(199, 128, 245, 0.05))', color: '#707070'}}>
                      Screenshot: {item.step}<br />
                      {item.title}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-center" style={{color: '#a0a0a0'}}>
                    {item.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-32 z-10" style={{background: 'rgba(199, 128, 245, 0.03)'}}>
        <div className="container max-w-[1200px] mx-auto px-8">
          <div className="text-xs font-bold uppercase mb-8" style={{letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)'}}>
            Key Metrics
          </div>

          <h2 className="font-light mb-8 relative pb-4" style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3'}}>
            Quantifiable Impact
            <span className="absolute bottom-0 left-0 w-16 h-px" style={{background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)'}} />
          </h2>

          <div className="grid gap-8 mt-16" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
            {[
              { value: '15-20%', label: 'Conversion Improvement' },
              { value: 'Industry First', label: 'Responsive Airline Website' },
              { value: '3', label: 'Major Awards Won', description: 'Webbies, UX Awards, Cannes Lions' },
              { value: 'Largest', label: 'Angular Project', description: 'At the time of launch' },
            ].map((metric, index) => (
              <div key={index} className="rounded-3xl px-8 py-12 text-center" style={{background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <div className="font-bold mb-4 leading-none" style={{fontSize: '3.5rem', background: 'linear-gradient(135deg, hsl(276, 100%, 75%), hsl(280, 100%, 80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                  {metric.value}
                </div>
                <div className="text-lg font-medium mb-2">
                  {metric.label}
                </div>
                {metric.description && (
                  <div className="text-sm" style={{color: '#a0a0a0'}}>
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Typography annotation */}
          <div className="mt-16 p-8 rounded-lg text-[0.95rem] leading-[1.6] italic" style={{background: 'rgba(199, 128, 245, 0.05)', borderLeft: '3px solid hsl(280, 100%, 80%)', color: '#c0c0c0'}}>
            <strong className="not-italic" style={{color: 'hsl(280, 100%, 80%)'}}>
              Typography & Spacing:
            </strong> Notice how generous whitespace and larger font sizes make this feel premium and easy to read. Large metrics use gradient text for visual hierarchy.
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="relative py-32 z-10">
        <div className="container max-w-[1200px] mx-auto px-8">
          <div className="text-xs font-bold uppercase mb-8" style={{letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)'}}>
            Outcomes & Impact
          </div>

          <h2 className="font-light mb-8 relative pb-4" style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3'}}>
            Industry-Defining Success
            <span className="absolute bottom-0 left-0 w-16 h-px" style={{background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)'}} />
          </h2>

          <div className="mt-12 max-w-[900px]">
            {[
              'Created the first responsive airline website',
              'Improved conversion rates by 15-20%',
              'Won Webbies, UX Awards, and Cannes Lions',
              'Pioneered the step-by-step, decision-by-decision e-commerce pattern',
              'Built the largest Angular project at the time',
              'Addressed complex data science issues with modern dashboards',
            ].map((achievement, index) => (
              <div key={index} className="mb-7 pl-8 relative">
                <span className="absolute rounded-full" style={{left: 0, top: '0.6rem', width: '6px', height: '6px', background: 'hsl(280, 100%, 80%)'}} />
                <div className="leading-[1.7]" style={{fontSize: '1.25rem', color: '#fafafa'}}>
                  {achievement}
                </div>
              </div>
            ))}
          </div>

          {/* Screenshots: Desktop & Mobile */}
          <div className="mt-16">
            <div className="grid gap-8" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
              {[
                { title: 'Desktop experience', subtitle: 'Full responsive layout', caption: 'Desktop: Spacious layout with sidebar navigation' },
                { title: 'Mobile experience', subtitle: 'Touch-optimized interface', caption: 'Mobile: First responsive airline booking experience' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="relative rounded-2xl overflow-hidden" style={{aspectRatio: '16 / 10', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <div className="w-full h-full flex items-center justify-center text-center px-8 text-sm" style={{background: 'linear-gradient(135deg, rgba(199, 128, 245, 0.1), rgba(199, 128, 245, 0.05))', color: '#707070'}}>
                      Screenshot: {item.title}<br />
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-center" style={{color: '#a0a0a0'}}>
                    {item.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Large Screenshot: Final Product */}
          <div className="mt-16 max-w-[1100px] mx-auto">
            <div className="relative rounded-2xl overflow-hidden" style={{aspectRatio: '16 / 9', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              <div className="w-full h-full flex items-center justify-center text-center px-8 text-sm" style={{background: 'linear-gradient(135deg, rgba(199, 128, 245, 0.1), rgba(199, 128, 245, 0.05))', color: '#707070'}}>
                Screenshot: Virgin America homepage hero<br />
                Showing the final responsive design across multiple devices
              </div>
            </div>
            <div className="mt-4 text-sm text-center" style={{color: '#a0a0a0'}}>
              The final product: Industry's first responsive airline website, winner of Webbies, UX Awards, and Cannes Lions
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="container max-w-[1200px] mx-auto px-8 pb-32">
        <div className="text-center pt-20 border-t border-white/10">
          <a
            href="/case-studies"
            className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-lg text-lg transition-all duration-300 hover:-translate-y-1"
          >
            View More Case Studies
          </a>
        </div>
      </div>
    </div>
  )
}
