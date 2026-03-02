import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRefs from 'react-use-refs'

gsap.registerPlugin(ScrollTrigger)

const ApplicationsGrid: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [ref1, ref2, ref3, ref4, ref5, ref6] = useRefs<HTMLDivElement>(null)
  const cardsRefs = [ref1, ref2, ref3, ref4, ref5, ref6]

  const applications = [
    {
      id: 'logistics',
      title: 'Logistics',
      description: 'Autonomous material handling, cross-floor navigation, real-time route optimization',
      icon: '📦',
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      description: 'Collaborative assembly, quality control, precision material handling',
      icon: '🏭',
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Disinfection, material transport, safe human interaction',
      icon: '🏥',
    },
    {
      id: 'defense',
      title: 'Defense & Security',
      description: 'Reconnaissance, payload transport, hazardous environment access',
      icon: '🛡️',
    },
    {
      id: 'warehousing',
      title: 'Warehousing',
      description: 'Inventory management, bin picking, order fulfillment at scale',
      icon: '🔧',
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      description: 'Inspection, maintenance, data collection at height and depth',
      icon: '🏗️',
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    // Stagger animation on scroll
    cardsRefs.forEach((ref) => {
      const card = ref.current
      if (!card) return

      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }
          )
        },
      })
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="applications-grid-section relative py-24 md:py-32 bg-black border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
            Where Intelligence Meets <span className="text-red-600">Reality</span>
          </h2>
          <p className="text-lg text-gray-400">
            Deployed across industries and environments. Continuously learning. Always improving.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <div
              key={app.id}
              ref={cardsRefs[index]}
              className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-red-600/50 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)]"
            >
              {/* Background tilt effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="text-5xl mb-4">{app.icon}</div>
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-3">
                  {app.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {app.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-semibold uppercase">Learn More</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ApplicationsGrid
