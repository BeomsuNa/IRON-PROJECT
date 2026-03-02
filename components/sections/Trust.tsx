import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRefs from 'react-use-refs'

gsap.registerPlugin(ScrollTrigger)

const Trust: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [ref1, ref2, ref3] = useRefs<HTMLDivElement>(null)
  const statsRefs = [ref1, ref2, ref3]

  const stats = [
    { label: 'Countries', value: 15, icon: '🌍' },
    { label: 'Active Deployments', value: 100, icon: '🚀' },
    { label: 'Industry Categories', value: 6, icon: '🏢' },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        statsRefs.forEach((ref, index) => {
          const el = ref.current
          if (!el) return

          // Animate stat boxes
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.6, delay: index * 0.15, ease: 'back.out' }
          )

          // Animate counter numbers
          const numberEl = el.querySelector('.stat-number')
          if (numberEl) {
            const finalValue = parseInt(numberEl.textContent || '0')
            gsap.fromTo(
              { value: 0 },
              { value: finalValue },
              {
                duration: 1.2,
                ease: 'power2.out',
                delay: index * 0.15 + 0.1,
                snap: { value: 1 },
                onUpdate: function (this: any) {
                  numberEl.textContent = Math.floor(this.targets()[0].value) + '+'
                },
              }
            )
          }
        })
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="trust-section relative py-24 md:py-32 bg-black border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
            Built on <span className="text-red-600">Foundation</span>
          </h2>
          <p className="text-lg text-gray-400">
            Trusted by leading enterprises and innovators worldwide
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={statsRefs[index]}
              className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg text-center opacity-0"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="stat-number text-4xl font-black text-red-600 mb-2">
                {stat.value}+
              </div>
              <p className="text-gray-400 uppercase text-sm font-semibold tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="text-center max-w-3xl mx-auto p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg">
          <p className="text-lg text-gray-300 leading-relaxed">
            Our commitment to excellence has earned the trust of enterprises across logistics, manufacturing, healthcare, and defense sectors. Every deployment represents a partnership in innovation.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Trust
