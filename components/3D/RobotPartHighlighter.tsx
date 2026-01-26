'use client';

import React, { useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

interface RobotPartHighlighterProps {
  scene: THREE.Group;
}

export default function RobotPartHighlighter({ scene }: RobotPartHighlighterProps) {
  const [activePart, setActivePart] = useState<string | null>(null);

  const highlightPart = (partName: string) => {
    // 이전 하이라이트 제거
    if (activePart) {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.name === activePart) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
              mat.needsUpdate = true;
            }
          });
        }
      });
    }

    // 새로운 파츠 하이라이트
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name === partName) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.emissive.setHex(0xff0000); // 빨간색 빛
            mat.emissiveIntensity = 0.5;
            mat.needsUpdate = true;
          }
        });
      }
    });

    setActivePart(partName);
  };

  const resetHighlight = () => {
    if (activePart) {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.name === activePart) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
              mat.needsUpdate = true;
            }
          });
        }
      });
      setActivePart(null);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '40%', 
      left: '10%', 
      transform: 'translateY(-50%)', 
      pointerEvents: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      padding: '20px',
      borderRadius: '10px',
      color: 'white'
    }}>
      <h3>로봇 파츠 하이라이트</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
        <Button onClick={() => highlightPart('mixamorig_Head_06')} variant="outline" className='text-black'>머리 빛나게</Button>
        <Button onClick={() => highlightPart('mixamorig_LeftEye_05')} variant="outline" className='text-black'>왼쪽 눈 빛나게</Button>
        <Button onClick={() => highlightPart('mixamorig_RightEye_04')} variant="outline" className='text-black'>오른쪽 눈 빛나게</Button>
        <Button onClick={resetHighlight} variant="outline">리셋</Button>
      </div>
    </div>
  );
}