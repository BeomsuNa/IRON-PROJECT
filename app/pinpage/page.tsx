"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function StickyIntroPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  gsap.to(".box",{
    ScrollTrigger: {  
trigger: ".container",
start: "top center",
end: "bottom top",
scrub: true,
    }
  }

  )
  return (
    <div  className="no-scrollbar-page">
      {/* Sticky Intro Section */}
      <section className="sc-intro relative h-screen w-full ">
        <div  className="sticky-wrap h-screen w-full overflow-hidden">
        <div>
          <video id="Video" autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
            <source src="/Bacteria_blue.mp4" type="video/mp4"></source>
          </video>
        </div>

          {/* 앞에 오는 텍스트 */}
          <div
       
            className="group-intro-text absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8 z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent drop-shadow-2xl">
              Welcome to
            </h1>
            <h2 className="text-3xl md:text-5xl font-light tracking-widest mb-8 drop-shadow-xl">
              Amazing Journey
            </h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90 drop-shadow-lg">
              Scroll down to explore the extraordinary experience waiting for you
            </p>
          </div>
        </div>
      </section>

      {/* 다음 콘텐츠들 */}
      <section className="h-screen w-full bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <h3 className="text-4xl text-white">우선 텍스트가 배치되어야 합니다
          배경화면을 확인
        
        </h3>
      </section>
      <section className="h-screen w-full bg-slate-800 flex items-center justify-center">
        <h3 className="text-4xl text-white"> 정상적으로 텍스트가 넘어가졌나요?</h3>
      </section>
    </div>
  );
}
