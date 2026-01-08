'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pinpage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2000',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          // markers: true,
        },
      });

      tl.to(overlayRef.current, { opacity: 0.7, ease: 'none' }, 0)
        .to(titleRef.current, { opacity: 0, y: -30, ease: 'none' }, 0.15)
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: 'none' },
          0.35
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-[400vh]">
      {/* pin 될 섹션: 흐름 안에 있어야 안정적 */}
      <section ref={sectionRef} className="relative h-screen w-full">
        {/* 배경 비디오 (레이어 0) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full"
        >
          <source src="/Bacteria_blue.mp4" type="video/mp4" />
        </video>

        {/* 어두워지는 오버레이 (레이어 1) */}
        <div ref={overlayRef} className="absolute inset-0 bg-black opacity-0" />

        {/* 텍스트/콘텐츠 (레이어 2) */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 text-white">
          <h1 ref={titleRef} className="text-6xl font-black">
            Welcome to
          </h1>
          <p ref={subRef} className="mt-4 text-2xl opacity-0">
            Scroll to reveal next content
          </p>
        </div>
      </section>

      {/* 이후 섹션 */}
      <section className="relative z-10 h-screen bg-red-900 flex items-center justify-center">
        <h3 className="text-5xl text-white">다음 섹션</h3>
      </section>
    </div>
  );
}
