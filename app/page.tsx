'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  useGSAP(() => {
    // 3D 이미지 회전 애니메이션
    gsap.to('.hero-image', {
      rotateY: 360,
      rotateX: 20,
      scale: 1.1,
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // 스크롤과 완벽 동기화
        markers: false // true로 하면 디버그 라인 표시
      }
    })

    // 배경 그라디언트 애니메이션
    gsap.to('.hero-bg', {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    })
  })

  return (
    <main className="min-h-[400vh]">
      {/* 히어로 섹션 */}
      <section className="hero-container h-screen flex items-center justify-center relative overflow-hidden">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black" />
        
        <div className="hero-image w-96 h-96 mx-auto perspective-1000">
          <Image
            src="/public/HOT.jpg"
            alt="3D Hero"
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/30 hover:scale-105 transition-all duration-300"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </div>

        <div className="text-center text-white mt-16 px-4">
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Scroll Magic
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            스크롤을 내리며 3D 회전 효과를 확인하세요
          </p>
        </div>
      </section>

      {/* 스크롤 위한 긴 콘텐츠 */}
      <section className="h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-8">
        <div className="max-w-4xl mx-auto text-white space-y-8">
          <h2 className="text-5xl font-bold text-center">포트폴리오에 딱!</h2>
          <p className="text-xl leading-relaxed">
            GSAP ScrollTrigger로 구현한 3D 스크롤 애니메이션입니다. 
            Next.js 16 + React 완벽 호환, 성능 최적화 완료.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
              <h3 className="text-2xl font-bold mb-4">🚀 특징</h3>
              <ul className="space-y-2 text-lg">
                <li>• 60fps 부드러운 3D 회전</li>
                <li>• 모바일 완벽 대응</li>
                <li>• Next.js Image 최적화</li>
              </ul>
            </div>
            <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
              <h3 className="text-2xl font-bold mb-4">⚙️ 커스터마이징</h3>
              <ul className="space-y-2 text-lg">
                <li>• rotateY: 360 → 원하는 각도</li>
                <li>• scrub: 1 → 속도 조절</li>
                <li>• 이미지 교체 즉시 적용</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
