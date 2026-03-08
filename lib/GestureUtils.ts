import * as THREE from 'three';

// MediaPipe Landmark IDs
// Thumb: 1-4, Index: 5-8, Middle: 9-12, Ring: 13-16, Pinky: 17-20
// MCP: Finger Base (1, 5, 9, 13, 17)
// PIP: 2, 6, 10, 14, 18
// DIP: 3, 7, 11, 15, 19
// TIP: 4, 8, 12, 16, 20

export interface HandLandmark {
    x: number;
    y: number;
    z: number;
}

export type GestureType = 'NONE' | 'PALM_OPEN' | 'FIST' | 'POINTING' | 'REPULSOR_POSE';

const getDistance = (p1: HandLandmark, p2: HandLandmark) => {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );
};

export const detectGesture = (landmarks: HandLandmark[]): GestureType => {
    if (!landmarks || landmarks.length < 21) return 'NONE';

    // 1. Calculate finger extensions
    // A finger is "extended" if the tip is further from the wrist than the MCP
    const wrist = landmarks[0];
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky Tips
    const fingerMCPs = [5, 9, 13, 17]; // Corresponding MCPs

    const extendedFingers = fingerTips.filter((tipIdx, i) => {
        const mcpIdx = fingerMCPs[i];
        const tipDist = getDistance(landmarks[tipIdx], wrist);
        const mcpDist = getDistance(landmarks[mcpIdx], wrist);
        return tipDist > mcpDist * 1.2; // Threshold for extension
    });

    // Special handling for thumb (4: Tip, 2: MCP-ish)
    const thumbTipDist = getDistance(landmarks[4], wrist);
    const thumbMCPDist = getDistance(landmarks[2], wrist);
    const isThumbExtended = thumbTipDist > thumbMCPDist * 1.1;

    const extendedCount = extendedFingers.length + (isThumbExtended ? 1 : 0);

    // 2. Classify Gesture
    if (extendedCount >= 4) {
        // Special Iron Man Repulsor Pose: All fingers extended, palm facing camera (simplified)
        // In local coordinates or based on landmarks, we can refine this.
        return 'REPULSOR_POSE';
    } else if (extendedCount <= 1 && !extendedFingers.includes(8)) {
        return 'FIST';
    } else if (extendedFingers.length === 1 && extendedFingers[0] === 8) {
        return 'POINTING';
    }

    return 'NONE';
};
