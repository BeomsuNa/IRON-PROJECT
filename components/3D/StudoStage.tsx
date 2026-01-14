'use client';
import { Environment, ContactShadows, Grid } from '@react-three/drei';

export default function StudioStage() {
  return (
    <>
    <axesHelper args={[5]} />
      {/* 1. 조명 설정 */}
      <ambientLight intensity={1.5} color="#ffffff" />
      <spotLight position={[5, 5, 5]} intensity={10} castShadow color="#ffffff" />
      <spotLight position={[-5, 5, -5]} intensity={5} color="#eeeeee" />

      {/* 2. 환경맵 (은은한 반사광) */}
      <Environment preset="studio" blur={0.8} />

      {/* 3. 바닥 그리드 (공학적 느낌) */}
      <Grid
        position={[0, -0.5, -0.4]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        infiniteGrid
      />

      {/* 4. 그림자 */}
      <ContactShadows opacity={0.6} scale={10} blur={2} far={1} color="#000000" />
    </>
  );
}