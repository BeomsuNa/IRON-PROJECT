import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectGesture } from '@/lib/GestureUtils';

interface HandModelProps {
    handDataRef: React.RefObject<{ landmarks: any[], handedness: any[] } | null>;
    handIndex?: number;
}

const LANDMARK_MAP: Record<number, string> = {
    0: 'Object_28',
    1: 'Object_179', 2: 'Object_226', 3: 'Object_228', 4: 'Object_230',
    5: 'Object_171', 6: 'Object_216', 7: 'Object_218', 8: 'Object_235',
    9: 'Object_210', 10: 'Object_239', 11: 'Object_241', 12: 'Object_247',
    13: 'Object_212', 14: 'Object_256', 15: 'Object_258', 16: 'Object_264',
    17: 'Object_214', 18: 'Object_275', 19: 'Object_277', 20: 'Object_283'
};

export function HandModel({ handDataRef, handIndex = 0 }: HandModelProps) {
    const { scene } = useGLTF('/models/steampunk_arm.glb');
    const groupRef = useRef<THREE.Group>(null);
    const repulsorRef = useRef<THREE.Mesh>(null);
    const repulsorLightRef = useRef<THREE.PointLight>(null);
    const { viewport } = useThree();

    const { clonedScene, wristOffset, joints } = useMemo(() => {
        const cloned = scene.clone();
        cloned.rotation.set(Math.PI, 0, 0);
        cloned.updateWorldMatrix(true, true);

        const offset = new THREE.Vector3();
        const jointObjects: Record<number, THREE.Object3D> = {};

        Object.entries(LANDMARK_MAP).forEach(([id, name]) => {
            const obj = cloned.getObjectByName(name);
            if (obj) jointObjects[parseInt(id)] = obj;
        });

        const wristObj = cloned.getObjectByName('Object_28');
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
        const pinkyMCP = hand[17];

        if (!wrist || !middleMCP) return;

        const x = (wrist.x - 0.5) * viewport.width * -1;
        const y = -(wrist.y - 0.5) * viewport.height;
        const z = wrist.z * -5;
        groupRef.current.position.set(x, y, z);

        const baseScale = 4;
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

        const gesture = detectGesture(hand);

        if (repulsorRef.current && repulsorLightRef.current) {
            const isActive = gesture === 'PALM_OPEN' || gesture === 'REPULSOR_POSE';
            const targetIntensity = isActive ? 5 : 0;
            const targetScale = isActive ? 1.2 : 0.001;

            repulsorLightRef.current.intensity += (targetIntensity - repulsorLightRef.current.intensity) * 0.15;
            const s = repulsorRef.current.scale.x;
            const ns = s + (targetScale - s) * 0.15;
            repulsorRef.current.scale.set(ns, ns, ns);

            repulsorRef.current.position.set(
                -(middleMCP.x - wrist.x) * viewport.width * (isRightHand ? -1 : 1),
                -(middleMCP.y - wrist.y) * viewport.height,
                (middleMCP.z - wrist.z) * -5
            );
        }

        Object.entries(joints).forEach(([idStr, obj]) => {
            const id = parseInt(idStr);
            if (id === 0 || [4, 8, 12, 16, 20].includes(id)) return;

            const landmark = hand[id];
            const nextLandmark = hand[id + 1];

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

                const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, -1, 0),
                    targetDir
                );

                obj.quaternion.slerp(targetQuaternion, [1, 5, 9, 13, 17].includes(id) ? 0.15 : 0.3);
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

useGLTF.preload('/models/steampunk_arm.glb');
