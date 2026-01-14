'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei'; // 필요한 것만 남김
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --------------------------------------------------------------------------
// 1. 실제 3D 모델 로드 컴포넌트
// --------------------------------------------------------------------------
function OptimusRobot() {
  const { scene } = useGLTF('/models/robot.glb');
  const robotRef = useRef<THREE.Group>(null);
  const headBone = useRef<THREE.Object3D | null>(null);
  const spineBone = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
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

    headBone.current = scene.getObjectByName('mixamorig_Head_06')  || scene.getObjectByName('Head') || null;
    spineBone.current = scene.getObjectByName('mixamorig_Spine_02') || scene.getObjectByName('Spine') || null;

  }, [scene]);

  useFrame((state) => {
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    if (headBone.current) {
      headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.rotation.y, mouseX * 0.6, 0.1);
      headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.rotation.x, -mouseY * 0.6, 0.1);
    }

    if (spineBone.current) {
      spineBone.current.rotation.y = THREE.MathUtils.lerp(spineBone.current.rotation.y, mouseX * 0.3, 0.1);
      spineBone.current.rotation.x = THREE.MathUtils.lerp(spineBone.current.rotation.x, -mouseY * 0.3, 0.1);
    }
  });

  return <primitive object={scene} ref={robotRef} />;
}

useGLTF.preload('/models/robot.glb');


// --------------------------------------------------------------------------
// 2. 메인 모델 래퍼 컴포넌트 (이것이 최종 Export 됩니다)
// --------------------------------------------------------------------------
type RobotModelProps = React.JSX.IntrinsicElements['group'];

export default function RobotScene(props: RobotModelProps) { // 이름 변경 및 export default
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!groupRef.current) return;

    // A. 등장 애니메이션 (위치)
    gsap.fromTo(groupRef.current.position, 
      { y: 0 }, 
      { y: -1.8, duration: 1, ease: 'power3.out' } // 위치값 StudioStage에 맞게 조정 (-1.2 추천)
    );

    // B. 등장 애니메이션 (크기)
    gsap.fromTo(groupRef.current.scale, 
      { x: 0, y: 0, z: 0 }, 
      { x: 1.5, y: 1.5, z: 1.5, duration: 1.8, ease: 'back.out(1.2)', delay: 0.2 }
    );



  }, { scope: groupRef });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      
      <OptimusRobot />

      {/* UI 텍스트 */}
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