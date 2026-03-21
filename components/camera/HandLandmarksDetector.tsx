'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';


interface Landmark {
    x: number;
    y: number;
    z: number;
}

interface HandData {
    landmarks: Landmark[][];
    confidence: number;
    handedness: string[];
    gestures: string[];
}

interface HandLandmarksDetectorProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    onResults?: (data: HandData) => void;
    minDetectionConfidence?: number;
    maxNumHands?: number;
    enabled?: boolean;
}

const HandLandmarksDetector: React.FC<HandLandmarksDetectorProps> = ({
    videoRef,
    onResults,
    minDetectionConfidence = 0.85,
    maxNumHands = 2,
    enabled = true,
}) => {
    const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null);
    const requestRef = useRef<number | null>(null);
    const lastLandmarksRef = useRef<Landmark[][]>([]);
    const JUMP_THRESHOLD = 0.15;

    const validateAndFilter = useCallback((newLandmarks: Landmark[][]) => {
        return newLandmarks.map((hand, handIdx) => {
            const prevHand = lastLandmarksRef.current[handIdx];

            return hand.map((lm, lmIdx) => {
                if (isNaN(lm.x) || isNaN(lm.y) || isNaN(lm.z)) {
                    return prevHand ? prevHand[lmIdx] : { x: 0, y: 0, z: 0 };
                }

                if (prevHand && prevHand[lmIdx]) {
                    const dist = Math.sqrt(
                        Math.pow(lm.x - prevHand[lmIdx].x, 2) +
                        Math.pow(lm.y - prevHand[lmIdx].y, 2)
                    );
                    if (dist > JUMP_THRESHOLD) {
                        return prevHand[lmIdx];
                    }
                }
                return lm;
            });
        });
    }, []);

    useEffect(() => {
        const initLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );
            const result = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                    delegate: 'GPU',
                },
                numHands: maxNumHands,
                minHandDetectionConfidence: minDetectionConfidence,
                minHandPresenceConfidence: minDetectionConfidence,
                minTrackingConfidence: minDetectionConfidence,
                runningMode: 'VIDEO'
            });
            setLandmarker(result);
        };

        if (enabled) {
            initLandmarker();
        }

        return () => {
            if (landmarker) landmarker.close();
        };
    }, [enabled, minDetectionConfidence, maxNumHands]);

    const predict = useCallback(() => {
        if (!landmarker || !videoRef.current || videoRef.current.readyState < 2) {
            requestRef.current = requestAnimationFrame(predict);
            return;
        }

        const startTimeMs = performance.now();
        const results = landmarker.detectForVideo(videoRef.current, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
            const rawLandmarks = results.landmarks as unknown as Landmark[][];
            const filteredLandmarks = validateAndFilter(rawLandmarks);
            lastLandmarksRef.current = filteredLandmarks;

            const handedness = results.handedness ? results.handedness.map(h => h[0].displayName) : [];
            const confidence = results.handedness ? results.handedness.reduce((acc, h) => acc + h[0].score, 0) / results.handedness.length : 0;
            const gestures = filteredLandmarks.map(() => 'NONE');

            if (onResults) {
                onResults({
                    landmarks: filteredLandmarks,
                    confidence: confidence,
                    handedness: handedness,
                    gestures: gestures
                });
            }
        } else if (onResults) {
            // Send empty data when no hands are detected to clear UI states
            onResults({
                landmarks: [],
                confidence: 0,
                handedness: [],
                gestures: []
            });
            lastLandmarksRef.current = [];
        }

        requestRef.current = requestAnimationFrame(predict);
    }, [landmarker, videoRef, onResults, validateAndFilter]);

    useEffect(() => {
        if (landmarker && enabled) {
            requestRef.current = requestAnimationFrame(predict);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [landmarker, enabled, predict]);

    return null;
};

export default HandLandmarksDetector;
