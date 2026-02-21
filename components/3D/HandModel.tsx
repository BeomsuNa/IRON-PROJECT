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
    const { clonedScene, wristOffset } = useMemo(() => {
        const cloned = scene.clone();
        const offset = new THREE.Vector3();

        // Check both common case variations
        const wristObj = cloned.getObjectByName('Object_28');

        if (wristObj) {
            // Ensure world matrices are updated to get accurate world position relative to scene root
            cloned.updateWorldMatrix(true, true);
            wristObj.getWorldPosition(offset);
        }

        return { clonedScene: cloned, wristOffset: offset };
    }, [scene]);

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

        // Depth scaling factor (Z-axis)
        const depthMultiplier = 25;

        // Position calculation
        // MediaPipe landmarks are 0..1. Map to viewport center.
        const x = (wrist.x - 0.5) * viewport.width * -1; // Center and flip X for mirror effect
        const y = -(wrist.y - 0.5) * viewport.height;    // Center and flip Y because Three.js Y is up
        const z = -wrist.z * depthMultiplier; // Consistent depth scaling

        groupRef.current.position.set(x, y, z);

        // Orientation
        // Vector from wrist to middle finger base (MCP)
        const wristVec = new THREE.Vector3(x, y, z);
        const middleVec = new THREE.Vector3(
            (middleMCP.x - 0.5) * viewport.width * -1,
            -(middleMCP.y - 0.5) * viewport.height,
        );

        const direction = new THREE.Vector3().subVectors(middleVec, wristVec).normalize();

        // Calculate rotation to align model's forward vector with hand direction
        const targetLookAt = new THREE.Vector3().addVectors(wristVec, direction);
        groupRef.current.lookAt(targetLookAt);

        // Scale calculation
        // The distance between wrist and middle MCP in world space 
        // will naturally decrease as the hand moves farther from the camera
        // if they are mapped correctly to the viewport.
        const distance = wristVec.distanceTo(middleVec);

        // This scale factor might need fine-tuning. 
        // If the model is too big when far away, reduce this number.
        const scaleMultiplier = 4;
        const scale = distance * scaleMultiplier;
        groupRef.current.scale.set(scale, scale, scale);
    });

    return (
        <group ref={groupRef}>
            <primitive
                object={clonedScene}
                position={wristOffset.clone().multiplyScalar(-1)}
                rotation={[-Math.PI / 2, Math.PI / 2, 0]}
            />
        </group>
    );
}

useGLTF.preload('/models/steampunk_arm.glb');
