import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';


interface HandModelProps {
    handDataRef: React.RefObject<{ landmarks: any[], handedness: any[] } | null>;
    handIndex?: number;
}

const BONE_MAP = [
    { bone: 'Thumb_01', from: 1, to: 2 },
    { bone: 'Thumb_02', from: 2, to: 3 },
    { bone: 'Thumb_03', from: 3, to: 4 },

    { bone: 'Index_01', from: 5, to: 6 },
    { bone: 'Index_02', from: 6, to: 7 },
    { bone: 'Index_03', from: 7, to: 8 },

    { bone: 'Middle_01', from: 9, to: 10 },
    { bone: 'Middle_02', from: 10, to: 11 },
    { bone: 'Middle_03', from: 11, to: 12 },

    { bone: 'Ring_01', from: 13, to: 14 },
    { bone: 'Ring_02', from: 14, to: 15 },
    { bone: 'Ring_03', from: 15, to: 16 },

    { bone: 'Pinky_01', from: 17, to: 18 },
    { bone: 'Pinky_02', from: 18, to: 19 },
    { bone: 'Pinky_03', from: 19, to: 20 },
];

export function HandModel({ handDataRef, handIndex = 0 }: HandModelProps) {
    const { scene } = useGLTF('/models/SteamPunkArmdTest.glb');
    const groupRef = useRef<THREE.Group>(null);
    const repulsorRef = useRef<THREE.Mesh>(null);
    const repulsorLightRef = useRef<THREE.PointLight>(null);
    const { viewport } = useThree();

    const { clonedScene, wristOffset, joints } = useMemo(() => {
        const cloned = scene.clone();
        cloned.rotation.set(Math.PI, 0, 0);
        cloned.updateWorldMatrix(true, true);

        const offset = new THREE.Vector3();
        const jointObjects: Record<string, THREE.Bone> = {};

        cloned.traverse((obj) => {
            const bone = obj as THREE.Bone;
            if (bone.isBone) {
                jointObjects[bone.name] = bone;
            }
        });

        const wristObj = cloned.getObjectByName('Wrist_01');
        if (wristObj) wristObj.getWorldPosition(offset);

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
        const BONE_FORWARD = new THREE.Vector3(0, -1, 0)
        const handedness = data.handedness[handIndex];
        if (!hand || hand.length === 0) {
            groupRef.current.visible = false;
            return;
        }

        groupRef.current.visible = true;
        const isRightHand = handedness?.categoryName === 'Right' || handedness?.label === 'Right' || handedness?.displayName === 'Right';

        const wrist = hand[0];
        const indexMCP = hand[5];
        const middleMCP = hand[9];
        const ringMCP = hand[13];
        const pinkyMCP = hand[17];

        if (!wrist || !middleMCP || !indexMCP || !pinkyMCP) return;

        const x = (wrist.x - 0.5) * viewport.width * -1;
        const y = -(wrist.y - 0.5) * viewport.height * -1;
        const z = wrist.z * -5;
        groupRef.current.position.set(x, y, z);

        const baseScale = 6;
        groupRef.current.scale.set(baseScale * (isRightHand ? -1 : 1), baseScale, baseScale);

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


        BONE_MAP.forEach(({ bone, from, to }) => {
            const obj = joints[bone];
            if (!obj) return;

            const landmark = hand[from];
            const nextLandmark = hand[to];

            if (landmark && nextLandmark) {
                const targetDir = new THREE.Vector3(
                    -(nextLandmark.x - landmark.x) * viewport.width,
                    -(nextLandmark.y - landmark.y) * viewport.height,
                    (nextLandmark.z - landmark.z) * -5
                ).normalize();

                if (obj.parent) {
                    const q = new THREE.Quaternion();
                    obj.parent.getWorldQuaternion(q);
                    targetDir.applyQuaternion(q.invert());
                }

                if (targetDir.lengthSq() < 1e-8) return;
                const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(

                    BONE_FORWARD.clone().normalize(),
                    targetDir.clone().normalize()


                );




                // Hierarchy-based slerp for natural cascading effect
                // Speed increases from Root to Tip for a "folding" look
                let slerpFactor = 0.2;
                const isRoot = [1, 5, 9, 13, 17].includes(from);     // MCP
                const isMiddle = [2, 6, 10, 14, 18].includes(from);   // PIP
                const isDistal = [3, 7, 11, 15, 19].includes(from);   // DIP

                if (isRoot) slerpFactor = 0.1;      // Root: deliberate
                else if (isMiddle) slerpFactor = 0.25; // Middle: active
                else if (isDistal) slerpFactor = 0.4;  // Distal: snappy wrapping

                obj.quaternion.slerp(targetQuaternion, slerpFactor);
            }
        });
    });

    return (
        <group ref={groupRef}>
            <primitive object={clonedScene} position={wristOffset.clone().multiplyScalar(-1)} />
            <mesh ref={repulsorRef} scale={[0.001, 0.001, 0.001]}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial color="#44ccff" emissive="#0099ff" emissiveIntensity={10} transparent opacity={0.8} />
                <pointLight ref={repulsorLightRef} color="#44ccff" intensity={0} distance={2} decay={2} />
            </mesh>
        </group>
    );
}

useGLTF.preload('/models/SteamPunkArmdTest.glb');
