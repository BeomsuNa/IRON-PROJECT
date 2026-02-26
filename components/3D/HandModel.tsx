import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface HandModelProps {
    handDataRef: React.RefObject<{ landmarks: any[], handedness: any[] } | null>;
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

export function HandModel({ handDataRef, handIndex = 0 }: HandModelProps) {
    const { scene } = useGLTF('/models/steampunk_arm.glb');

    // Debugging loading
    React.useEffect(() => {
        if (scene) {
            console.log("Model Loaded Successfully:", scene);
        }
    }, [scene]);

    const groupRef = useRef<THREE.Group>(null);
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
        const up = new THREE.Vector3(
            -(middleMCP.x - wrist.x) * viewport.width,
            -(middleMCP.y - wrist.y) * viewport.height,
            (middleMCP.z - wrist.z) * -5
        ).normalize();

        const side = new THREE.Vector3(
            -(pinkyMCP.x - indexMCP.x) * viewport.width,
            -(pinkyMCP.y - indexMCP.y) * viewport.height,
            (pinkyMCP.z - indexMCP.z) * -5
        ).normalize();

        const forward = new THREE.Vector3().crossVectors(side, up).normalize();

        // Correct side for orthogonality
        const orthoSide = new THREE.Vector3().crossVectors(up, forward).normalize();

        const matrix = new THREE.Matrix4();
        // If mirrored, the coordinate system basis also needs adjustment or the quaternion will be flipped
        matrix.makeBasis(orthoSide, up, forward);
        groupRef.current.quaternion.setFromRotationMatrix(matrix);

        // 4. Update Joints (Finger movement)
        Object.entries(joints).forEach(([idStr, obj]) => {
            const id = parseInt(idStr);

            // Skip the wrist (0) in the finger loop since orientation handles it
            // Also skip tips because they have no child bone to rotate
            if (id === 0 || [4, 8, 12, 16, 20].includes(id)) return;

            const landmark = hand[id];
            const nextLandmark = hand[id + 1];

            if (landmark && nextLandmark) {
                // Calculate the vector from this joint to the next joint
                const boneDir = new THREE.Vector3(
                    -(nextLandmark.x - landmark.x),
                    -(nextLandmark.y - landmark.y),
                    (nextLandmark.z - landmark.z)
                ).normalize();

                // Rotate the bone from its default local direction (up) to the target direction
                const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0), // Assumed default bone direction
                    boneDir
                );

                // Low-pass filter (slerp) for smooth movement
                obj.quaternion.slerp(targetQuaternion, 0.3);
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
