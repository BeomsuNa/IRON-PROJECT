'use client'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Hero.css'
import { CldVideoPlayer } from 'next-cloudinary'
import 'next-cloudinary/dist/cld-video-player.css'

const Hero: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLDivElement>(null)
  const ctaContainerRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Animate logo/branding
    if (headlineRef.current) {
      const letters = headlineRef.current.querySelectorAll('span')
      tl.fromTo(
        letters,
        { opacity: 0, scale: 0, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' },
        0
      )
    }

    // Animate subheadline
    if (subheadlineRef.current) {
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.3
      )
    }

    // Animate CTA buttons
    if (ctaContainerRef.current) {
      const ctaButtons = ctaContainerRef.current.querySelectorAll('button, a')
      tl.fromTo(
        ctaButtons,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out' },
        0.6
      )
    }

    // Animate scroll indicator (infinite pulsing)
    if (scrollIndicatorRef.current) {
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0.5 },
        { opacity: 0.5, duration: 0 },
        0.8
      )

      // Pulsing animation
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Y oscillation
      gsap.to(scrollIndicatorRef.current, {
        y: -8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }
  }, [])

  return (
    <section className="hero-section relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Video - CldVideoPlayer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">

        {/* Dark Overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/20 via-black/50 to-black/70 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Main Headline */}
        <h1 ref={headlineRef} className="hero-headline text-7xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
          {/* Character-by-character animation */}
          {'I AM IRON MAN'.split('').map((char, i) => (
            <span key={i}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <div ref={subheadlineRef} className="hero-subheadline text-lg md:text-xl font-light tracking-wide max-w-3xl mx-auto mb-10 text-gray-300">
        AND IT's YOUR NEXT TURN
        </div>

        {/* CTA Buttons */}
        <div ref={ctaContainerRef} className="flex flex-col sm:flex-row gap-4 mb-16">
          <button className="hero-cta-primary px-8 py-3 bg-red-600 text-white font-semibold uppercase text-sm tracking-wider hover:bg-red-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
            Explore the Arsenal
          </button>
          <button className="hero-cta-secondary px-8 py-3 border-2 border-white text-white font-semibold uppercase text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300">
            Watch the Vision
          </button>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero
