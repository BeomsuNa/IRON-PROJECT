import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface HandModelProps {
    landmarksRef: React.RefObject<any[] | null>;
    handIndex?: number;
}

export function HandModel({ landmarksRef, handIndex = 0 }: HandModelProps) {
    const { scene } = useGLTF('/models/steampunk_arm.glb');
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Clone scene so we can reuse for multiple hands
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useFrame(() => {
        if (!groupRef.current) return;

        // Check if landmarks exist
        const landmarks = landmarksRef.current;
        if (!landmarks || !landmarks[handIndex]) {
            groupRef.current.visible = false;
            return;
        }

        const hand = landmarks[handIndex];
        if (!hand || hand.length === 0) {
            groupRef.current.visible = false;
            return;
        }

        groupRef.current.visible = true;

        // Wrist
        const wrist = hand[0];
        const middleMCP = hand[9];

        if (!wrist || !middleMCP) return;

        // Map normalized coordinates (0..1) to Three.js viewport coordinates
        // MediaPipe: (0,0) top-left -> (1,1) bottom-right
        // Three.js: (0,0) center, Y up.
        // Also consider video mirroring if needed. Assuming video is mirrored via CSS scaleX(-1).
        // The landmarks from MediaPipe are relative to input image. 
        // If input image is mirrored, landmarks are mirrored.

        // Position
        const x = (wrist.x - 0.5) * viewport.width * -1; // Flip X for mirror effect
        const y = -(wrist.y - 0.5) * viewport.height;    // Flip Y because Three.js Y is up
        const z = -wrist.z * 10; // Simple depth scaling, might need adjustment

        groupRef.current.position.set(x, y, z);

        // Orientation
        // Vector from wrist to middle finger base
        const wristVec = new THREE.Vector3(x, y, z);
        const middleVec = new THREE.Vector3(
            (middleMCP.x - 0.5) * viewport.width * -1,
            -(middleMCP.y - 0.5) * viewport.height,
            -middleMCP.z * 10
        );

        const direction = new THREE.Vector3().subVectors(middleVec, wristVec).normalize();

        // Calculate rotation to align model's forward vector with hand direction
        // Assuming model faces +Z by default
        const targetLookAt = new THREE.Vector3().addVectors(wristVec, direction);
        groupRef.current.lookAt(targetLookAt);

        // Simple scale based on hand size
        const distance = wristVec.distanceTo(middleVec);
        // Base scale of 10 might be too big/small depending on model unit 
        // Hand distance is usually around 0.1-0.2 in normalized units?
        // Let's start with a fixed scale for now to verify visibility first
        const scale = distance * 5;
        groupRef.current.scale.set(scale, scale, scale);
    });

    return <primitive object={clonedScene} ref={groupRef} />;
}

useGLTF.preload('/models/steampunk_arm.glb');
