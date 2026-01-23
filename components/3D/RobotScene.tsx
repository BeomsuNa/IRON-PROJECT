'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type RobotModelProps = React.JSX.IntrinsicElements['group'];

export default function RobotScene({ isHologram, ...props }: { isHologram: boolean } & RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/robot.glb');  // 직접 로드
  
  const headBone = useRef<THREE.Object3D | null>(null);
  const spineBone = useRef<THREE.Object3D | null>(null);
  
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  
  const [mouseTrackingEnabled, setMouseTrackingEnabled] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // 1. 모델 로드 후 재질 설정
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (isHologram) {
      groupRef.current.visible = false;
    } else {
      groupRef.current.scale.set(0, 0, 0);
      // 홀로그램 재질
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const mesh = obj;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        mats.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) return;
          mat.emissive = new THREE.Color("#070606");
          mat.emissiveIntensity = 3;
          mat.metalness = 0;
          mat.roughness = 0;
          mat.transparent = true;
          mat.opacity = 0.3;
          mat.needsUpdate = true;
        });
      });
    }
  }, [scene, isHologram]);

  // 2. 실체화 애니메이션
  useGSAP(() => {
    if (isHologram || !groupRef.current) return;

    // visible 활성화
    groupRef.current.visible = true;

    // bone 설정
    const head = groupRef.current.getObjectByName('mixamorig_Head_06');
    const spine = groupRef.current.getObjectByName('mixamorig_Spine1_03');
    
    if (head) {
      headBone.current = head;
    }
    if (spine) {
      spineBone.current = spine;
    }

    if (tl.current) tl.current.kill();

    tl.current = gsap.timeline({
    });

    // 재질 실체화
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mesh = obj;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        tl.current?.to(mat, {
          emissiveIntensity: 0,
          metalness: 0.8,
          roughness: 0.2,
          opacity: 1,
          duration: 3.0,
          ease: "power3.inOut",
          onUpdate: () => { mat.needsUpdate = true; }
        }, 0);
      });
    });

    // 위치 애니 (groupRef 안전하게)
    gsap.fromTo(groupRef.current.position, 
      { y:0 }, 
      { 
        y: 0.5, 
        duration: 1, 
        ease: 'power3.out',
        onComplete: () => {
          setMouseTrackingEnabled(true);
        }
      }
    );

    // 크기 애니
    gsap.fromTo(groupRef.current.scale, 
      { x: 0, y: 0, z: 0 }, 
      { x: 1.5, y: 1.5, z: 1.5, duration: 1.8, ease: 'back.out(1.2)', delay: 0.2 }
    );

    // 마우스 준비
    xTo.current = gsap.quickTo(groupRef.current.rotation, 'y', { duration: 0.8, ease: 'power2' });
    yTo.current = gsap.quickTo(groupRef.current.rotation, 'x', { duration: 0.8, ease: 'power2' });

  }, { scope: groupRef, dependencies: [isHologram, scene] });

  // 3. 마우스 추적
  useFrame((state) => {
    if (!mouseTrackingEnabled) 
      {console.log("준비가 되었나?", mouseTrackingEnabled)
        return;}

    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    
    // 상반신
    if (headBone.current) {
      headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.rotation.y, mouseX * 0.6, 0.1);
      headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.rotation.x, -mouseY * 0.6, 0.1);
    }
    if (spineBone.current) {
      spineBone.current.rotation.y = THREE.MathUtils.lerp(spineBone.current.rotation.y, mouseX * 0.3, 0.1);
      spineBone.current.rotation.x = THREE.MathUtils.lerp(spineBone.current.rotation.x, -mouseY * 0.3, 0.1);
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={scene} />
      
      <Html position={[0.8, 1.7, 0]} transform occlude distanceFactor={2} style={{ pointerEvents: 'none' }}>
        {/* UI 텍스트 */}
      </Html>
    </group>
  );
}
