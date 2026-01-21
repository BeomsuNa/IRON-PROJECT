'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function SciFiDoors({ onOpenComplete }: { onOpenComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 1, // 1초 대기 후 시작
      onComplete: onOpenComplete // 문이 다 열리면 콜백 실행 (중요!)
    });

    tl.to([leftDoorRef.current, rightDoorRef.current], {
      // 문이 열리기 직전에 약간 덜컹거리는 효과 (선택사항)
      x: (i) => (i === 0 ? 10 : -10),
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false })"
    })
    .to(leftDoorRef.current, {
      xPercent: -100, // 왼쪽 문은 왼쪽으로 완전히 이동
      duration: 2.5,
      ease: 'power4.inOut',
    }, 'open')
    .to(rightDoorRef.current, {
      xPercent: 100, // 오른쪽 문은 오른쪽으로 완전히 이동
      duration: 2.5,
      ease: 'power4.inOut',
    }, 'open')
    // 문이 다 열리면 컨테이너 자체를 숨겨서 클릭 방해 방지
    .set(containerRef.current, { display: 'none' });

  }, { scope: containerRef });

  // 공학적이고 역동적인 SF 문 디자인 (Tailwind + CSS 그라데이션 + 애니메이션)
  const doorStyle = `
    absolute top-0 w-1/2 h-full 
    bg-gradient-to-br from-slate-900 via-slate-800 to-black 
    border-2 border-cyan-400 shadow-2xl shadow-cyan-400/50 
    flex items-center justify-center 
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-cyan-500/10 before:to-transparent before:animate-pulse
    after:absolute after:inset-0 after:bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,cyan_15px,cyan_16px)] after:opacity-20
  `;

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-[100] pointer-events-none">
      {/* 왼쪽 문 */}
      <div ref={leftDoorRef} className={`${doorStyle} left-0`}>
        <div className="relative z-10 text-center">
          <div className="text-cyan-400 font-mono text-3xl font-bold tracking-widest mb-4 drop-shadow-lg animate-pulse">
            SECURE GATE L-01
          </div>
          <div className="text-cyan-300 text-sm font-mono opacity-80">
            ACCESSING CORE SYSTEMS...
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
      {/* 오른쪽 문 */}
      <div ref={rightDoorRef} className={`${doorStyle} right-0`}>
        <div className="relative z-10 text-center">
          <div className="text-cyan-400 font-mono text-3xl font-bold tracking-widest mb-4 drop-shadow-lg animate-pulse">
            SECURE GATE R-01
          </div>
          <div className="text-cyan-300 text-sm font-mono opacity-80">
            INITIALIZING PROTOCOLS...
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}