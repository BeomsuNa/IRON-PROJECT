import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface HandModelProps {
    landmarksRef: React.RefObject<any[] | null>;
    handIndex?: number;
}

// Landmark mapping: MediaPipe ID -> Blender Object Name
const LANDMARK_MAP: Record<number, string> = {
    0: 'Object_28',   // Wrist
    1: 'Object_179',  // Thumb CMC
    2: 'Object_226',  // Thumb MCP
    3: 'Object_228',  // Thumb IP
    4: 'Object_230',  // Thumb TIP
    5: 'Object_171',  // Index MCP
    6: 'Object_216',  // Index PIP
    7: 'Object_218',  // Index DIP
    8: 'Object_312',  // Index TIP
    9: 'Object_173',  // Middle MCP
    10: 'Object_239', // Middle PIP
    11: 'Object_241', // Middle DIP
    12: 'Object_247', // Middle TIP
    13: 'Object_175', // Ring MCP
    14: 'Object_256', // Ring PIP
    15: 'Object_258', // Ring DIP
    16: 'Object_264', // Ring TIP
    17: 'Object_214', // Pinky MCP
    18: 'Object_275', // Pinky PIP
    19: 'Object_277', // Pinky DIP
    20: 'Object_283'  // Pinky TIP
};

export function HandModel({ landmarksRef, handIndex = 0 }: HandModelProps) {
    const { scene } = useGLTF('/models/steampunk_arm.glb');
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Store references to the bones/objects for animation
    const { clonedScene, wristOffset, joints } = useMemo(() => {
        const cloned = scene.clone();
        const offset = new THREE.Vector3();
        const jointObjects: Record<number, THREE.Object3D> = {};

        // Find and store all joint objects
        Object.entries(LANDMARK_MAP).forEach(([id, name]) => {
            const obj = cloned.getObjectByName(name);
            if (obj) {
                jointObjects[parseInt(id)] = obj;
                console.log('obj확인완료', obj.name);
            }
        });

        // Use the wrist (0) for initial offset
        const wristObj = jointObjects[0];
        if (wristObj) {
            cloned.updateWorldMatrix(true, true);
            wristObj.getWorldPosition(offset);
        }

        return { clonedScene: cloned, wristOffset: offset, joints: jointObjects };
    }, [scene]);

    useFrame(() => {
        if (!groupRef.current) return;

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

        const wrist = hand[0];
        const middleMCP = hand[9];

        if (!wrist || !middleMCP) return;

        // Depth scaling factor
        const depthMultiplier = 25;

        // 1. Calculate main position (Wrist)
        const x = (wrist.x - 0.5) * viewport.width * -1;
        const y = -(wrist.y - 0.5) * viewport.height;
        const z = -wrist.z * depthMultiplier;

        groupRef.current.position.set(x, y, z);

        // 2. Calculate main orientation (Wrist to Middle MCP)
        const wristVec = new THREE.Vector3(x, y, z);
        const middleVec = new THREE.Vector3(
            (middleMCP.x - 0.5) * viewport.width * -1,
            -(middleMCP.y - 0.5) * viewport.height,
            -middleMCP.z * depthMultiplier
        );

        const direction = new THREE.Vector3().subVectors(middleVec, wristVec).normalize();
        const targetLookAt = new THREE.Vector3().addVectors(wristVec, direction);
        groupRef.current.lookAt(targetLookAt);

        // 3. Calculate scale based on distance between landmarks
        const distance = wristVec.distanceTo(middleVec);
        const scaleMultiplier = 4;
        const scale = distance * scaleMultiplier;
        groupRef.current.scale.set(scale, scale, scale);

        // TODO: Individually rotate finger joints (joints[id])
        // To make it look "active", we'll need to calculate relative rotations
        // for each parent-child joint pair.
    });

    return (
        <group ref={groupRef}>
            <primitive
                object={clonedScene}
                position={wristOffset.clone().multiplyScalar(-1)}
                // Keep the initial model rotation to align with MediaPipe's forward direction
                rotation={[-Math.PI / 2, Math.PI / 2, 0]}
            />
        </group>
    );
}

useGLTF.preload('/models/steampunk_arm.glb');
