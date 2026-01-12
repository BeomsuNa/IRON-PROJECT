'use client';

import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  OrbitControls, 
  Html, 
  useGLTF, // GLTF/GLB 모델 로더 추가
  PerspectiveCamera 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';



// --------------------------------------------------------------------------
// 1. 실제 3D 모델 로드 컴포넌트 (새로 추가됨)
// --------------------------------------------------------------------------
function OptimusRobot() {
  // public/models/robot.glb 경로에서 모델을 로드합니다.
  // 본인이 다운로드한 파일명에 맞게 수정하세요.
  const { scene, materials } = useGLTF('/models/robot.glb');
  const robotRef = useRef<THREE.Group>(null);

  // 모델 재질 추가 수정 (선택 사항)
  // 로드된 모델의 재질을 더 멋지게 수정합니다.
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // 예시: 특정 파츠의 재질을 금속성으로 변경
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.metalness = 0.8;
          mesh.material.roughness = 0.2;
          mesh.material.envMapIntensity = 1.5; // 환경 반사 강화
        }
        
        // 예시: 눈이나 발광 부위 재질 적용 (모델 구조에 따라 다름)
        // 만약 모델에 'Eyes'라는 이름의 메쉬가 있다면 발광 효과 적용
        if (mesh.name.includes('Eye') || mesh.name.includes('Light')) {
           const mat = mesh.material as THREE.MeshStandardMaterial;
           mat.emissive = new THREE.Color("#00ffcc");
           mat.emissiveIntensity = 5;
           mat.toneMapped = false;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} ref={robotRef} />;
}

// GLTF 프리로드 (성능 최적화)
useGLTF.preload('/models/robot.glb');


// --------------------------------------------------------------------------
// 2. 메인 모델 래퍼 컴포넌트 (기존 RobotModel 수정)
// --------------------------------------------------------------------------
type RobotModelProps = React.JSX.IntrinsicElements['group'];

function RobotModelWrapper(props: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (!groupRef.current) return;

    // A. 등장 애니메이션 (위치)
    gsap.fromTo(groupRef.current.position, 
      { y: -5 }, 
      { y: -2.0, duration: 1, ease: 'power3.out' } // 도착 높이 및 시간 약간 수정
    );

    // B. 등장 애니메이션 (크기)
    gsap.fromTo(groupRef.current.scale, 
      { x: 0, y: 0, z: 0 }, 
      { x: 1.5, y: 1.5, z: 1.5, duration: 1.8, ease: 'back.out(1.2)', delay: 0.2 } // 타이밍 및 이징 수정
    );

    // C. 부유 효과
    gsap.to(groupRef.current.position, {
      y: '-=0.15', // 움직임 폭 감소
      duration: 2.5, 
      repeat: -1, 
      yoyo: true, 
      ease: 'sine.inOut',
      delay: 2
    });

    // D. 마우스 추적
    xTo.current = gsap.quickTo(groupRef.current.rotation, 'y', { duration: 0.8, ease: 'power2' }); // 반응 속도 조절
    yTo.current = gsap.quickTo(groupRef.current.rotation, 'x', { duration: 0.8, ease: 'power2' });

  }, { scope: groupRef });

  useFrame((state) => {
    if (xTo.current && yTo.current) {
      // 마우스 움직임 범위 조절
      xTo.current(state.mouse.x * 0.2);
      yTo.current(-state.mouse.y * 0.1);
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      
      {/* 기존 캡슐 및 박스 제거 후 실제 모델 컴포넌트 배치 */}
      <OptimusRobot />

      {/* 3D UI 텍스트 디자인 개선 */}
      <Html position={[1.2, 1.8, 0]} transform occlude distanceFactor={2} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border-l-2 border-[#00ffcc] pl-3 pr-4 py-2 rounded-r-lg">
            <div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse shadow-[0_0_10px_#00ffcc]"></div>
            <span className="text-[#00ffcc] font-mono text-xs tracking-widest uppercase">System Online</span>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border-l-2 border-white/50 pl-3 pr-4 py-1 rounded-r-lg ml-4">
             <span className="text-white/70 font-mono text-[0.65rem] uppercase">Status: Scanning User</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// --------------------------------------------------------------------------
// 3. 메인 씬 컴포넌트 (조명 및 환경 설정 개선)
// --------------------------------------------------------------------------
export default function RobotScene() {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <Canvas shadows dpr={[1, 2]}> {/* dpr 설정으로 해상도 대응 */}
        
        {/* 카메라 설정 변경: 더 넓고 역동적인 시야 */}
        <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={45} />

        {/* 조명 설정 개선: 더 드라마틱한 분위기 연출 */}
        <ambientLight intensity={0.2} color="#00ffcc" /> {/* 전체적으로 푸른빛 감돌게 */}
        
        {/* 메인 키 라이트 (우측 상단) */}
        <spotLight 
          position={[5, 8, 5]} 
          angle={0.3} 
          penumbra={0.5} 
          intensity={15} 
          color="#ffffff" 
          castShadow 
          shadow-mapSize={[2048, 2048]} // 그림자 품질 향상
          shadow-bias={-0.0001}
        />
        
        {/* 림 라이트 (좌측 후방, 실루엣 강조) */}
        <spotLight position={[-5, 5, -5]} angle={0.5} intensity={8} color="#00ffcc" />
        
        {/* 필 라이트 (하단, 아래쪽 디테일) */}
        <pointLight position={[0, -2, 2]} intensity={2} color="#0099ff" />

        {/* 환경맵 변경: 더 어둡고 반사가 강한 야경 느낌 */}
        <Environment preset="night" blur={0.8} background={false} environmentIntensity={1.5} />

        <Suspense fallback={null}>
          {/* 위치 및 스케일 조정 */}
          <RobotModelWrapper position={[0, -1.2, 0]} scale={1.5} />
        </Suspense>

        {/* 그림자 설정 개선 */}
        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={15} blur={2.5} far={1.5} color="#000000" />
        
        {/* 컨트롤 설정 조정 */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5} // 위아래 회전 제한
          maxPolarAngle={Math.PI / 1.8}
          rotateSpeed={0.5} // 회전 속도 조절
        />
      </Canvas>
    </div>
  );
}