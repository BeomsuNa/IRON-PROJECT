// app/page.tsx
'use client'
import { Button } from '@/components/ui/button';
import '../globals.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const fulltext = "WHAT EVERYONE CAN DO ONLY I CAN DO";
  const logo = "WCIC";
  const textRef = useRef<HTMLHeadingElement>(null);
  const fullTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const tl = gsap.timeline();

    // 단계 1: WCIC 로고 등장
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll('span');
      tl.fromTo(letters, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, stagger: 0.1 });
      
      tl.fromTo(textRef.current, { y: -20, scale: 1 }, { y: -100, scale: 1.3, duration: 2 });
    }

    // 단계 2: fulltext 아래에서 위로 fade in
    if (fullTextRef.current) {
      tl.fromTo(fullTextRef.current, { y: -20, opacity: 0 }, { y: -80, opacity: 1, duration: 0.5 }, "+=0.2");
    }

    // 단계 3: 네비게이션 페이드인 (현재 위치 유지, 한 줄로 정렬)
    if (navRef.current) {
      tl.fromTo(navRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "+=0.1");
    }

    // 로고의 첫 번째 C에만 회전 애니메이션 추가
    if (textRef.current) {
      const firstC = textRef.current.querySelector('.char-C-first');

      if (firstC) {
        gsap.to(firstC, { rotation: 360, duration: 2, repeat: 0, ease: 'power2.inOut', transformOrigin: '50% 50%', delay: 2 });
      }
    }
  }, []);

  // 텍스트를 글자별로 span으로 분리
  const renderText = (text: string) => {
    const lastCIndex = text.lastIndexOf('C');
    const firstCIndex = text.indexOf('C');
    return text.split('').map((char, index) => {
      const isC = char === 'C';
      let className = '';
      if (isC) {
        if (index === firstCIndex) className = 'char-C char-C-first';
        else if (index === lastCIndex) className = 'char-C char-C-last';
        else className = 'char-C';
      }
      return (
        <span key={index} className={className} style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen text-white">
      <section className="flex flex-col items-center justify-center h-screen px-4 pt-16">
        {/* WCIC 로고 */}
        <h1 ref={textRef} className="text-8xl sm:text-8xl md:text-8xl font-bold uppercase tracking-wider mb-8">
          {renderText(logo)}
        </h1>

        {/* 긴 텍스트 설명 */}
        <div ref={fullTextRef} className="text-sm sm:text-base md:text-lg font-light uppercase tracking-wider text-center max-w-2xl" style={{ opacity: 0 }}>
          {fulltext}
        </div>
              
        <nav ref={navRef} className="flex w-full justify-center self-center" style={{ opacity: 1}}>
          <div style={{ width: '25vw', display: 'flex', justifyContent: 'center' }}>
            <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition duration-300">
              <Link href="/robot">3D Image</Link>
            </Button>
          </div>

          <div style={{ width: '25vw', display: 'flex', justifyContent: 'center' }}>
            <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition duration-300">
              <Link href="/pinpage">Pin Page</Link>
            </Button>
          </div>

          <div style={{ width: '25vw', display: 'flex', justifyContent: 'center' }}>
            <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition duration-300">
              <Link href="/scrollpage">Scroll Page</Link>
            </Button>
          </div>

          <div style={{ width: '25vw', display: 'flex', justifyContent: 'center' }}>
            <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition duration-300">
              <Link href="/csspage">CSS Page</Link>
            </Button>
          </div>
        </nav>
      </section>
      <main>{children}</main>
    </div>
  );
}