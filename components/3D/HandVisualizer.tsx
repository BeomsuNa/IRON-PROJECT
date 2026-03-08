'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { HandModel } from './HandModel';

interface HandVisualizerProps {
    handDataRef: React.RefObject<{ landmarks: any[], handedness: any[] } | null>;
}

export default function HandVisualizer({ handDataRef }: HandVisualizerProps) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="w-full h-full"
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <HandModel handDataRef={handDataRef} handIndex={0} />
            <HandModel handDataRef={handDataRef} handIndex={1} />
        </Canvas>
    );
}
