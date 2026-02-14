'use client'

import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import "../globals.css"
import Hero from '@/components/sections/Hero'
import VisionMission from '@/components/sections/VisionMission'
import ProductLineup from '@/components/sections/ProductLineup'
import OrbitShowcase from '@/components/sections/OrbitShowcase'
import ApplicationsGrid from '@/components/sections/ApplicationsGrid'
import Trust from '@/components/sections/Trust'
import News from '@/components/sections/News'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export default function PremiumPage() {
  useEffect(() => {
    // Initialize smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh()
  }, [])

  return (
    <div className="min-h-screen bg-[#2b1d0e] text-[#e2c98a] overflow-x-hidden font-serif">
      <div className="fixed inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: 'radial-gradient(#d4a017 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Hero Section */}
      <Hero />



      {/* Product Lineup */}
      {/* <ProductLineup /> */}

      {/* Signature Orbit Interaction */}
      {/* <OrbitShowcase /> */}

      {/* Applications Grid */}
      {/* <ApplicationsGrid /> */}

      {/* Technology Stack */}
      {/* <TechStack /> */}

      {/* Trust & Credibility */}
      {/* <Trust /> */}

      {/* News & Insights */}
      {/* <News /> */}

      {/* Final CTA */}
      {/* <FinalCTA /> */}

      {/* Footer */}
      <Footer />
    </div>
  )
}