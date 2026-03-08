'use client';

import React from 'react';

interface CameraPermissionModalProps {
    onGranted: () => void;
    onDenied: () => void;
}

const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({ onGranted, onDenied }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-[#1a0d05] border-4 border-[#b87333] p-8 shadow-[0_0_50px_rgba(184,115,51,0.4)] relative overflow-hidden">
                {/* Decorative Rivets */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#5d3a1a]" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5d3a1a]" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#5d3a1a]" />
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#5d3a1a]" />

                <div className="text-center relative z-10">
                    <h2 className="text-2xl font-black text-[#e3a857] mb-6 uppercase tracking-widest italic border-b-2 border-[#b87333]/30 pb-4">
                        Biometric Link Request
                    </h2>
                    <p className="text-[#b87333] mb-8 leading-relaxed font-serif italic text-sm">
                        To interface with the Victorian Digital Engine, we require authorization to engage your thermal-optical sensors.
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={onGranted}
                            className="w-full py-4 bg-gradient-to-b from-[#e3a857] to-[#8b4513] text-white font-black uppercase tracking-[0.2em] border-2 border-[#5d3a1a] shadow-lg hover:from-[#f5c38c] hover:to-[#a0522d] transition-all active:scale-95"
                        >
                            Authorize Integration
                        </button>
                        <button
                            onClick={onDenied}
                            className="w-full py-2 text-[#8b4513] font-bold uppercase tracking-widest text-xs hover:text-[#e3a857] transition-colors"
                        >
                            Abort Sequence
                        </button>
                    </div>
                </div>

                {/* Background Gears Watermark */}
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                    <div className="w-40 h-40 border-8 border-[#e3a857] rounded-full animate-spin-slow" />
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default CameraPermissionModal;
