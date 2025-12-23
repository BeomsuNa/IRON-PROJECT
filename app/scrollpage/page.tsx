'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  useGSAP(() => {
    const container = heroRef.current
    const image = imageRef.current

    // 🔥 1단계: 페이지 "고정" + 3D 회전
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',           // 화면 상단 도착 즉시
        end: '+=300%',              // 3배 스크롤 길이 (충분한 시간)
        scrub: 1,
        pin: true,                  // 📌 페이지 고정!
        pinSpacing: true,           // 스크롤 공간 예약
        markers: true,              // 디버그
        anticipatePin: 1            // 부드러운 고정
      }
    })

    // 🎥 고정된 페이지에서 3D 회전
    tl.to(image, {
      rotationY: 1080,            // 3바퀴 완전 회전
      rotationX: 30,
      scale: 1.15,
      y: -40,
      boxShadow: '0 80px 160px rgba(99, 102, 241, 0.8)',
      filter: 'brightness(1.2) saturate(1.4)',
      duration: 1.5
    })

    // 🎥 페이드아웃 효과 (끝부분)
    tl.to(container, {
      opacity: 0,
      scale: 0.9,
      y: 100,
      duration: 0.8
    }, "-=0.5") // 마지막 0.5초 겹침

  }, { scope: heroRef })

  return (
    <main className="min-h-[500vh] bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      
      {/* 📱 1. 인트로 텍스트 */}
      <section className="h-screen flex flex-col items-center justify-center text-white px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent mb-8 leading-tight">
            3D Scroll Journey
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-12">
            아래로 스크롤하면 새로운 3D 페이지가 열립니다
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 border-4 border-white/30 rounded-full animate-spin-slow" />
            <p className="text-lg opacity-75 font-medium tracking-wide">스크롤을 내리세요 ↓</p>
          </div>
        </div>
      </section>

      {/* 🚀 2. 고정 3D 페이지 (핵심!) */}
      <section ref={heroRef} className="h-screen flex flex-col items-center justify-center relative p-12 bg-gradient-to-br from-slate-900/90 via-purple-900/50 backdrop-blur-xl shadow-2xl">
        
        {/* 페이지 헤더 (고정됨) */}
        <div className="text-center z-20 mb-16 absolute top-12 left-1/2 -translate-x-1/2">
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent mb-4">
            Welcome to 3D World
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-md mx-auto">
            이 페이지는 스크롤로 제어됩니다
          </p>
        </div>

        {/* 🔥 3D 회전 오브젝트 */}
        <div 
          ref={imageRef}
          className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] perspective-[3000px] mx-auto relative z-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=85"
            className="w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white/40 hover:border-gradient-to-r hover:from-blue-400 hover:to-purple-500 transition-all duration-500"
          />
        </div>

        {/* 페이지 푸터 */}
        <div className="text-center z-20 mt-20 absolute bottom-12 left-1/2 -translate-x-1/2">
          <p className="text-lg md:text-xl text-white/70 mb-4">
            스크롤 계속 → 페이지 벗어남
          </p>
          <div className="flex items-center space-x-4 text-sm opacity-60">
            <span>GSAP ScrollTrigger</span>
            <span>•</span>
            <span>Next.js 16</span>
          </div>
        </div>

        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/20 to-pink-500/10 rounded-3xl blur-xl" />
      </section>

      {/* 📚 3. 다음 섹션 (페이지 벗어난 후) */}
      <section className="h-screen bg-gradient-to-r from-slate-800 via-purple-900 to-slate-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03] opacity-50" />
        <div className="max-w-6xl mx-auto px-8 text-white relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 via-white to-blue-400 bg-clip-text text-transparent mb-6">
              Perfect Landing!
            </h2>
            <p className="text-2xl opacity-90 max-w-3xl mx-auto">
              3D 페이지가 완벽하게 벗어났습니다. 이제 본문 시작!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 hover:bg-white/10 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-6">📌 Pin Effect</h3>
              <p className="text-lg leading-relaxed">스크롤 중 페이지가 화면에 고정되어 완전히 새로운 공간처럼 느껴집니다.</p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 hover:bg-white/10 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-6">⏱️ Timeline</h3>
              <p className="text-lg leading-relaxed">복잡한 3D 회전과 페이드아웃을 정밀하게 동기화합니다.</p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 hover:bg-white/10 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-6">🎨 Performance</h3>
              <p className="text-lg leading-relaxed">GPU 가속 + useGSAP으로 60fps 부드러운 애니메이션 보장.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
