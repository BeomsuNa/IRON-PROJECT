'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Zap, Target, Cpu } from 'lucide-react';

interface SteampunkHUDProps {
    fps: number;
    gesture: string;
    handDetected: boolean;
}

export default function SteampunkHUD({ fps, gesture, handDetected }: SteampunkHUDProps) {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => (prev + 1) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 font-mono">
            {/* Top Bar - Brass Header */}
            <div className="flex justify-between items-start">
                <div className="relative">
                    <div className="bg-gradient-to-r from-[#b87333] via-[#cd7f32] to-[#b87333] p-1 rounded-sm border border-[#5d3a1a] shadow-lg">
                        <div className="bg-[#1a1a1a] px-4 py-2 border border-[#8b4513] flex items-center space-x-3">
                            <Settings className="w-5 h-5 text-[#cd7f32] animate-spin-slow" style={{ animationDuration: '10s' }} />
                            <span className="text-[#44ccff] text-xl font-bold tracking-widest uppercase glow-text">
                                System Status: <span className={handDetected ? "text-green-400" : "text-red-500"}>
                                    {handDetected ? "Online" : "Searching..."}
                                </span>
                            </span>
                        </div>
                    </div>
                    {/* Decorative Gear */}
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 text-[#b87333] opacity-50">
                        <Settings className="w-full h-full" style={{ transform: `rotate(${rotation}deg)` }} />
                    </div>
                </div>

                <div className="bg-[#1a1a1a]/80 border-2 border-[#cd7f32] p-3 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(205,127,50,0.5)]">
                    <Zap className={`w-8 h-8 ${handDetected ? "text-[#44ccff] animate-pulse" : "text-gray-600"}`} />
                </div>
            </div>

            {/* Middle - Crosshair (Optional, can be centered) */}
            <div className="flex-1 flex items-center justify-center opacity-30">
                <div className="relative w-64 h-64 border-2 border-[#cd7f32] rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 border-t-4 border-[#44ccff] rounded-full animate-spin-slow"></div>
                    <Target className="w-12 h-12 text-[#cd7f32]" />
                </div>
            </div>

            {/* Bottom Bar - Gauges and Data */}
            <div className="flex justify-between items-end">
                <div className="space-y-4">
                    {/* Power Gauge */}
                    <div className="bg-[#1a1a1a] border-2 border-[#b87333] p-4 rounded-lg shadow-inner w-48 relative overflow-hidden">
                        <div className="flex justify-between text-[10px] text-[#cd7f32] mb-1">
                            <span>POWER OUTPUT</span>
                            <span>{handDetected ? "87%" : "2%"}</span>
                        </div>
                        <div className="h-4 bg-black/50 border border-[#5d3a1a] p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-[#44ccff] to-[#0099ff] transition-all duration-500"
                                style={{ width: handDetected ? '87%' : '2%' }}
                            />
                        </div>
                        <div className="absolute top-0 right-0 p-1">
                            <Cpu className="w-3 h-3 text-[#cd7f32] opacity-30" />
                        </div>
                    </div>

                    {/* FPS Display */}
                    <div className="inline-block bg-[#b87333] px-3 py-1 text-black font-bold text-sm skew-x-[-12deg]">
                        REFRESH: {fps} HZ
                    </div>
                </div>

                {/* Gesture Analysis */}
                <div className="text-right">
                    <div className="bg-[#1a1a1a] border-l-4 border-[#44ccff] p-4 rounded-r-lg max-w-xs transition-all">
                        <div className="text-[10px] text-gray-500 mb-1">GESTURE RECOGNITION</div>
                        <div className="text-[#44ccff] text-2xl font-black italic tracking-tighter">
                            {gesture === 'NONE' ? '---' : gesture.replace('_', ' ')}
                        </div>
                        {gesture === 'PALM_OPEN' && (
                            <div className="text-[8px] text-blue-300 animate-pulse mt-1">
                                REPULSOR CORE CHARGED
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .glow-text {
                    text-shadow: 0 0 10px rgba(68, 204, 255, 0.7);
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow linear infinite;
                }
            `}</style>
        </div>
    );
}
