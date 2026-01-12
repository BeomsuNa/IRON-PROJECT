'use client';

import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  OrbitControls, 
  Html, 
  useGLTF, 
  PerspectiveCamera 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --------------------------------------------------------------------------
// 1. 실제 3D 모델 로드 컴포넌트 (여기에 마우스 추적 로직 이식됨)
// --------------------------------------------------------------------------
function OptimusRobot() {
  const { scene } = useGLTF('/models/robot.glb');
  const robotRef = useRef<THREE.Group>(null);

  // 제어할 뼈들을 담을 변수
  const headBone = useRef<THREE.Object3D | null>(null);
  const spineBone = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    // A. 재질(Material) 수정
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.metalness = 0.8;
          mesh.material.roughness = 0.2;
          mesh.material.envMapIntensity = 1.5;
        }
        
        if (mesh.name.includes('Eye') || mesh.name.includes('Light')) {
           const mat = mesh.material as THREE.MeshStandardMaterial;
           mat.emissive = new THREE.Color("#00ffcc");
           mat.emissiveIntensity = 5;
           mat.toneMapped = false;
        }
      }
    });

    // B. 뼈(Bone) 찾기 & 연결
    // [중요] 콘솔 로그를 보고 실제 모델의 뼈 이름을 확인 후 필요하면 수정하세요.
    scene.traverse((object) => {
      if (object.type === 'Bone') {
        console.log('발견된 뼈 이름:', object.name); 
      }
    });

    // 일반적인 Mixamo/Humanoid 뼈 이름 시도
    // (모델에 따라 'Head', 'Neck', 'Spine', 'Bip01_Head' 등으로 수정 필요할 수 있음)
   
    headBone.current = scene.getObjectByName('mixamorig_Head_06')  || null
    spineBone.current = scene.getObjectByName('mixamorig_Spine_02') || null

  }, [scene]);

  // C. 마우스 추적 애니메이션 (머리와 상체만 회전)
  useFrame((state) => {
    // 마우스 좌표 (-1 ~ 1)
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    // 머리 회전 (시선) - 반응 속도 0.1
    if (headBone.current) {
      headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.rotation.y, mouseX * 0.6, 0.1);
      headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.rotation.x, -mouseY * 0.6, 0.1);
    }

    // 척추 회전 (상체 비틀기) - 머리보다 조금만 움직이게 (* 0.3)
    if (spineBone.current) {
      spineBone.current.rotation.y = THREE.MathUtils.lerp(spineBone.current.rotation.y, mouseX * 0.3, 0.1);
      spineBone.current.rotation.x = THREE.MathUtils.lerp(spineBone.current.rotation.x, -mouseY * 0.3, 0.1);
    }
  });

  return <primitive object={scene} ref={robotRef} />;
}

// GLTF 프리로드
useGLTF.preload('/models/robot.glb');


// --------------------------------------------------------------------------
// 2. 메인 모델 래퍼 컴포넌트 (전체 회전 로직 제거됨)
// --------------------------------------------------------------------------
type RobotModelProps = React.JSX.IntrinsicElements['group'];

function RobotModelWrapper(props: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!groupRef.current) return;

    // A. 등장 애니메이션 (위치)
    gsap.fromTo(groupRef.current.position, 
      { y: -5 }, 
      { y: -2.0, duration: 1, ease: 'power3.out' }
    );

    // B. 등장 애니메이션 (크기)
    gsap.fromTo(groupRef.current.scale, 
      { x: 0, y: 0, z: 0 }, 
      { x: 1.5, y: 1.5, z: 1.5, duration: 1.8, ease: 'back.out(1.2)', delay: 0.2 }
    );

    // C. 부유 효과 (위아래 둥둥)
    gsap.to(groupRef.current.position, {
      y: '-=0.15', 
      duration: 2.5, 
      repeat: -1, 
      yoyo: true, 
      ease: 'sine.inOut',
      delay: 2
    });


  }, { scope: groupRef });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      
      {/* 이제 여기서 실제 모델과 부분 회전 로직을 담당 */}
      <OptimusRobot />

      {/* 3D UI 텍스트 */}
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
// 3. 메인 씬 컴포넌트
// --------------------------------------------------------------------------
export default function RobotScene() {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <Canvas shadows dpr={[1, 2]}>
        
        <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={45} />

        <ambientLight intensity={0.2} color="#00ffcc" />
        
        <spotLight 
          position={[5, 8, 5]} 
          angle={0.3} 
          penumbra={0.5} 
          intensity={15} 
          color="#ffffff" 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        
        <spotLight position={[-5, 5, -5]} angle={0.5} intensity={8} color="#00ffcc" />
        
        <pointLight position={[0, -2, 2]} intensity={2} color="#0099ff" />

        <Environment preset="night" blur={0.8} background={false} environmentIntensity={1.5} />

        <Suspense fallback={null}>
          <RobotModelWrapper position={[0, -1.2, 0]} scale={1.5} />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={15} blur={2.5} far={1.5} color="#000000" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}