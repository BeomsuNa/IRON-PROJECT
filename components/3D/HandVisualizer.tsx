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
            gl={{ alpha: true }} // Transparent background
        >
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} />
            <HandModel handDataRef={handDataRef} handIndex={0} />
            <HandModel handDataRef={handDataRef} handIndex={1} />
        </Canvas>
    );
}
