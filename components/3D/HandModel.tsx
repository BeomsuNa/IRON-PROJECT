import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface HandModelProps {
    handDataRef: React.RefObject<{ landmarks: any[], handedness: any[] } | null>;
    handIndex?: number;
}

// Landmark mapping: MediaPipe ID -> Blender Object Name

// Updated LANDMARK_MAP based on user request (Object_241 -> Object_252, etc.)
const LANDMARK_MAP: Record<number, string> = {
    0: 'Object_28',   // Wrist
    1: 'Object_179', 2: 'Object_226', 3: 'Object_228', 4: 'Object_230',// Thumb
    5: 'Object_171', 6: 'Object_216', 7: 'Object_218', 8: 'Object_235', // Index
    9: 'Object_210', 10: 'Object_239', 11: 'Object_241', 12: 'Object_247', // Middle
    13: 'Object_212', 14: 'Object_256', 15: 'Object_258', 16: 'Object_264', // Ring
    17: 'Object_214', 18: 'Object_275', 19: 'Object_277', 20: 'Object_283'  // Pinky
};

export function HandModel({ handDataRef, handIndex = 0 }: HandModelProps) {
    const { scene } = useGLTF('/models/steampunk_arm.glb');

    // Debugging loading
    React.useEffect(() => {
        if (scene) {

            // DEBUG: List all object names in the scene to verify mapping
            const names: string[] = [];
            scene.traverse((obj) => {
                names.push(obj.name);
            });
        }
    }, [scene]);

    const groupRef = useRef<THREE.Group>(null);
    const hasLoggedRef = useRef(false);
    const { viewport } = useThree();

    // Store references to the bones/objects for animation
    const { clonedScene, wristOffset, joints } = useMemo(() => {
        const cloned = scene.clone();

        // Apply base rotation first so the offset is calculated for the rotated model
        cloned.rotation.set(Math.PI, 0, 0);
        cloned.updateWorldMatrix(true, true);

        const offset = new THREE.Vector3();
        const jointObjects: Record<number, THREE.Object3D> = {};

        // Find and store all joint objects
        Object.entries(LANDMARK_MAP).forEach(([id, name]) => {
            const obj = cloned.getObjectByName(name);
            if (obj) {
                jointObjects[parseInt(id)] = obj;
            }
        });

        // Use Object_28 (Wrist) for offset
        const wristObj = cloned.getObjectByName('Object_28');
        if (wristObj) {
            wristObj.getWorldPosition(offset);
        }


        return { clonedScene: cloned, wristOffset: offset, joints: jointObjects };
    }, [scene]);

    useFrame(() => {
        if (!groupRef.current) return;

        const data = handDataRef.current;
        if (!data || !data.landmarks[handIndex]) {
            groupRef.current.visible = false;
            return;
        }

        const hand = data.landmarks[handIndex];
        const handedness = data.handedness[handIndex];

        if (!hand || hand.length === 0) {
            groupRef.current.visible = false;
            return;
        }

        groupRef.current.visible = true;

        const isRightHand = handedness?.categoryName === 'Right' || handedness?.label === 'Right';

        const wrist = hand[0];
        const indexMCP = hand[5];
        const middleMCP = hand[9];
        const pinkyMCP = hand[17];

        // One-time logging of landmarks and their parts
        if (!hasLoggedRef.current) {
            Object.entries(LANDMARK_MAP).forEach(([id, objectName]) => {
                if (hand[parseInt(id)]) {

                }
            });
            hasLoggedRef.current = true;
        }


        if (!wrist || !middleMCP) return;

        // 1. Calculate main position (Wrist)
        const x = (wrist.x - 0.5) * viewport.width * -1;
        const y = -(wrist.y - 0.5) * viewport.height;
        const z = wrist.z * -5;

        groupRef.current.position.set(x, y, z);

        // 2. Adjust SCALE & Mirroring
        // Since we only have a LEFT hand model (steampunk_arm), 
        // we mirror it on the X-axis if it's a RIGHT hand.
        const baseScale = 4;
        groupRef.current.scale.set(
            baseScale * (isRightHand ? -1 : 1),
            baseScale,
            baseScale
        );

        // 3. Calculate Orientation (Rotation)
        // More precise "up" vector using all MCPs to define the hand plane
        const handPlaneUp = new THREE.Vector3(
            -(middleMCP.x - wrist.x) * viewport.width,
            -(middleMCP.y - wrist.y) * viewport.height,
            (middleMCP.z - wrist.z) * -5
        ).normalize();

        const side = new THREE.Vector3(
            -(pinkyMCP.x - indexMCP.x) * viewport.width,
            -(pinkyMCP.y - indexMCP.y) * viewport.height,
            (pinkyMCP.z - indexMCP.z) * -5
        ).normalize();

        const forward = new THREE.Vector3().crossVectors(side, handPlaneUp).normalize();
        const orthoSide = new THREE.Vector3().crossVectors(handPlaneUp, forward).normalize();

        const matrix = new THREE.Matrix4();
        matrix.makeBasis(orthoSide, handPlaneUp, forward);
        groupRef.current.quaternion.setFromRotationMatrix(matrix);

        // 4. Update Joints (Individual finger segments)
        Object.entries(joints).forEach(([idStr, obj]) => {
            const id = parseInt(idStr);
            if (id === 0) return; // Wrist is handled by group orientation

            const landmark = hand[id];
            // Tip calculation logic: find the next landmark in the sequence
            // For IP/DIP joints (last in our map), use the actual landmark TIP ID (4, 8, 12, 16, 20)
            let nextId = id + 1;

            const nextLandmark = hand[nextId];

            if (landmark && nextLandmark) {
                // Calculate target direction in world space
                const targetDir = new THREE.Vector3(
                    -(nextLandmark.x - landmark.x) * viewport.width,
                    -(nextLandmark.y - landmark.y) * viewport.height,
                    (nextLandmark.z - landmark.z) * -5
                ).normalize();

                // Convert target direction to object's parent local space
                if (obj.parent) {
                    const parentWorldQuaternion = new THREE.Quaternion();
                    obj.parent.getWorldQuaternion(parentWorldQuaternion);
                    targetDir.applyQuaternion(parentWorldQuaternion.invert());
                }

                // Default bone direction is (0, 1, 0)
                const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, -1, 0),
                    targetDir
                );

                // Specific joint weights (e.g., first joints only tilt 40%)
                // MCP joints are 1, 5, 9, 13, 17
                const isMCP = [1, 5, 9, 13, 17].includes(id);
                const slerpAmount = isMCP ? 0.2 : 0.4; // Weighted movement for realism

                obj.quaternion.slerp(targetQuaternion, slerpAmount);
            }
        });
    });

    return (
        <group ref={groupRef}>
            <primitive
                object={clonedScene}
                position={wristOffset.clone().multiplyScalar(-1)}
            />
        </group>
    );
}

useGLTF.preload('/models/steampunk_arm.glb');
