import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRefs from 'react-use-refs'

gsap.registerPlugin(ScrollTrigger)

const News: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [ref1, ref2, ref3] = useRefs<HTMLDivElement>(null)
  const articleRefs = [ref1, ref2, ref3]

  const articles = [
    {
      id: 1,
      title: 'The Next Generation of Industrial Humanoids',
      category: 'HUMANOID ROBOT',
      tag: 'ELIXIS',
      readTime: '8 mins',
      icon: '🤖',
    },
    {
      id: 2,
      title: 'Are Collaborative Robots the Future of Logistics?',
      category: 'COBOT',
      tag: 'SYNCRO',
      readTime: '4 mins',
      icon: '🦾',
    },
    {
      id: 3,
      title: "India's Quadruped Revolution",
      category: 'QUADRUPED ROBOT',
      tag: 'TRAKR',
      readTime: '6 mins',
      icon: '🐕',
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        articleRefs.forEach((ref, index) => {
          const card = ref.current
          if (card) {
            gsap.fromTo(
              card,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: 'power2.out' }
            )
          }
        })
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="news-section relative py-24 md:py-32 bg-black border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
            The Evolution <span className="text-red-600">Continues</span>
          </h2>
          <p className="text-lg text-gray-400">
            Stay updated on breakthroughs, deployments, and the future of physical intelligence
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div
              key={article.id}
              ref={articleRefs[index]}
              className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-red-600/50 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)]"
            >
              {/* Article Icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {article.icon}
              </div>

              {/* Article Info */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {article.title}
              </h3>

              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 space-x-2">
                <span>{article.category}</span>
                <span>•</span>
                <span className="text-red-400">{article.tag}</span>
              </p>

              {/* Read Time */}
              <p className="text-sm text-gray-400 mb-4">{article.readTime} read</p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-semibold">Read Article</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-white/20 text-white font-semibold uppercase text-sm tracking-wider hover:border-red-600 hover:text-red-400 transition-all duration-300">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  )
}

export default News
