"use client"

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
export default function IntroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (!containerRef.current) return;
    const texts = gsap.utils.toArray(['h1','p']);
    gsap.fromTo(texts, 
      {y:-60, opacity:0, filter: "blur(10px)"},
      {y: 0,         // 제자리로 돌아옴
        opacity: 1,   // 완전히 보임
        filter: "blur(0px)", // 블러 제거
        duration: 1.5, // 1.5초 동안 재생
        ease: 'power3.out', // 부드럽게 감속하며 도착
        stagger: 0.3, // (중요✨) h1과 p 사이에 0.3초 시차를 두고 순서대로 실행
        delay: 0.5,   // 페이지 로드 후 0.5초 뒤에 시작
      }
    );
  }, {scope: containerRef})

  return(
        <div className="absolute top-0 left-0 p-10 text-black z-10 pointer-events-none" ref={containerRef}>
        <h1 className="text-6xl font-bold m-0 tracking-tighter opacity-0">FUTRURE MAZE</h1>
        <p className="text-2xl mt-2 opacity-80">CSS PROJECT SITE 3D</p>
      </div>

  )
}