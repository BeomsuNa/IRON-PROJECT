'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type RobotModelProps = React.JSX.IntrinsicElements['group'];

function RobotModel(props: RobotModelProps) {
  // 1. Ref 초기화: null을 명시적으로 넣어줍니다.
  const groupRef = useRef<THREE.Group>(null);
  
  // 2. GSAP quickTo Ref 초기화: 역시 null을 넣어줍니다.
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    // 안전 장치: groupRef가 연결되지 않았으면 실행하지 않음
    if (!groupRef.current) return;

    // -------------------------------------------------------
    // [중요 수정] position과 scale 애니메이션 분리
    // -------------------------------------------------------

    // A. 위치(Position) 애니메이션: 아래에서 위로 등장
    // position 속성에는 scale이 없으므로 y값만 조절합니다.
    gsap.fromTo(groupRef.current.position, 
      { y: -5 }, 
      { y: -1, duration: 1.5, ease: 'power3.out' }
    );

    // B. 크기(Scale) 애니메이션: 0에서 1로 커짐
    // scale 속성을 따로 타겟팅해야 합니다.
    gsap.fromTo(groupRef.current.scale, 
      { x: 0, y: 0, z: 0 }, 
      { x: 1, y: 1, z: 1, duration: 1.5, ease: 'back.out(1.7)' }
    );

    // C. 부유(Floating) 효과
    gsap.to(groupRef.current.position, {
      y: '-=0.2', 
      duration: 2, 
      repeat: -1, 
      yoyo: true, 
      ease: 'sine.inOut',
      delay: 1.5 // 등장이 끝난 뒤 시작
    });

    // D. 마우스 추적 (quickTo 설정)
    xTo.current = gsap.quickTo(groupRef.current.rotation, 'y', { duration: 0.5, ease: 'power3' });
    yTo.current = gsap.quickTo(groupRef.current.rotation, 'x', { duration: 0.5, ease: 'power3' });

  }, { scope: groupRef });

  useFrame((state) => {
    // xTo.current가 null이 아닐 때만 실행
    if (xTo.current && yTo.current) {
      xTo.current(state.mouse.x * 0.3);
      yTo.current(-state.mouse.y * 0.3);
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* 로봇 몸체 (캡슐) */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 로봇 눈 (바이저) */}
      <mesh position={[0, 0.5, 0.4]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      
      {/* 3D UI 텍스트 */}
      <Html position={[1, 1, 0]} transform occlude distanceFactor={1.5} style={{ pointerEvents: 'none' }}>
        <div className="bg-black/80 text-[#00ffcc] p-2 rounded border border-[#00ffcc] font-mono whitespace-nowrap text-sm">
          System: Online<br/>Target: User
        </div>
      </Html>
    </group>
  );
}

// 메인 컴포넌트
export default function RobotScene() {
  return (
    // 부모 div에 w-full h-full이 있어야 화면에 꽉 찹니다.
    <div className="w-full h-full absolute top-0 left-0 ">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <RobotModel position={[0, -1, 0]} />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={1.5} far={0.8} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}