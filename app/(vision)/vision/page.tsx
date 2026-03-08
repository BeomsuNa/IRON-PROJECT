'use client';

import CameraPermissionModal from '@/components/camera/CameraPermissionModal';
import HandLandmarksDetector from '@/components/camera/HandLandmarksDetector';
import { useCameraDetection, useCamera } from '@/lib/useCamera';
import { useEffect, useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

const HandVisualizer = dynamic<any>(() => import('@/components/3D/HandVisualizer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/20 animate-pulse" />
});

export default function IronManPage() {
  const { detected: cameraDetected } = useCameraDetection();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [gestures, setGestures] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [fps, setFps] = useState(0);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  // Ref to store MediaPipe results for 3D model without re-renders
  const handDataRef = useRef<{ landmarks: any[], handedness: any[] } | null>(null);

  const {
    videoRef,
    isActive: cameraActive,
    startCamera,
    stopCamera,
  } = useCamera({
    autoStart: false,
  });

  const handleHandResults = (data: any) => {
    handDataRef.current = {
      landmarks: data.landmarks,
      handedness: data.handedness.map((h: string) => ({ displayName: h }))
    };
    setGestures(data.gestures);
    setConfidence(data.confidence);

    // FPS Calculation in onResults might be slightly off due to throttle, 
    // but good enough for feedback.
    const now = performance.now();
    frameCountRef.current++;
    if (now - lastTimeRef.current >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Log JSON format as requested
    if (data.landmarks.length > 0) {
      console.log(JSON.stringify({
        landmarks: data.landmarks[0].map((lm: any) => [lm.x, lm.y, lm.z]),
        confidence: data.confidence
      }));
    }
  };


  // 웹카메라 감지 시 모달 표시
  useEffect(() => {
    if (cameraDetected === true) {
      setShowPermissionModal(true);
    }
  }, [cameraDetected]);

  // 카메라 권한 승인 처리
  const handleCameraPermissionGranted = async () => {
    try {
      await startCamera();
      setShowPermissionModal(false);
      setPermissionDenied(false);
    } catch (error) {
      setPermissionDenied(true);
    }
  };

  // 카메라 권한 거부 처리
  const handleCameraPermissionDenied = () => {
    setShowPermissionModal(false);
    setPermissionDenied(true);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e3a857] flex flex-col items-center justify-center p-4 font-serif relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#e3a857 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

      <div className="w-full max-w-7xl relative z-10">
        {/* Steampunk Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#b87333] opacity-40 pointer-events-none transition-all duration-1000" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-[#b87333] opacity-40 pointer-events-none transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-[#b87333] opacity-40 pointer-events-none transition-all duration-1000" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#b87333] opacity-40 pointer-events-none transition-all duration-1000" />

        {/* Floating Gear Accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 border-8 border-[#b87333]/10 rounded-full animate-spin-slow pointer-events-none">
          <div className="absolute top-0 left-1/2 -ml-2 w-4 h-8 bg-[#b87333]/20" />
          <div className="absolute bottom-0 left-1/2 -ml-2 w-4 h-8 bg-[#b87333]/20" />
          <div className="absolute left-0 top-1/2 -mt-2 w-8 h-4 bg-[#b87333]/20" />
          <div className="absolute right-0 top-1/2 -mt-2 w-8 h-4 bg-[#b87333]/20" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-widest text-center uppercase skew-x-[-12deg] bg-gradient-to-r from-[#8b4513] via-[#e3a857] to-[#8b4513] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#b87333]/30 pb-4">
            Steampunk Vision // Interface
          </h1>
          <div className="text-[10px] tracking-[0.4em] text-[#b87333]/60 italic mt-2 uppercase">Victorian Engineering x Digital Neural Tracking</div>
        </div>

        {cameraDetected === null && (
          <div className="text-center animate-pulse py-20">
            <p className="text-xl tracking-widest text-[#e3a857]">CALIBRATING OPTICAL SENSORS...</p>
          </div>
        )}

        {cameraDetected === false && (
          <div className="bg-[#1a0a0a] border-2 border-red-900/50 rounded-lg p-12 text-center backdrop-blur-md shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-900/5 -z-1 group-hover:bg-red-900/10 transition-colors" />
            <p className="text-2xl text-red-500 font-bold mb-4 uppercase tracking-tighter">
              Critical Failure: Lens Not Found
            </p>
            <p className="text-red-400/70 max-w-md mx-auto leading-relaxed">
              Biometric acquisition requires valid optical hardware. Check device connectivity at your central workstation.
            </p>
          </div>
        )}

        {cameraDetected === true && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Viewport */}
            <div className="lg:col-span-3 space-y-6">
              <div className={`relative bg-[#050505] rounded-lg overflow-hidden border-4 border-[#b87333]/50 shadow-[0_0_50px_rgba(184,115,51,0.2)] aspect-video group`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover opacity-60 sepia-[0.3] brightness-[1.1] contrast-[1.1]"
                  style={{ transform: 'scaleX(-1)' }} // Mirror mode
                />

                {/* 3D Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  <Suspense fallback={null}>
                    <HandVisualizer handDataRef={handDataRef} />
                  </Suspense>
                </div>

                <HandLandmarksDetector
                  videoRef={videoRef}
                  onResults={handleHandResults}
                  enabled={cameraActive}
                  minDetectionConfidence={0.85}
                />

                {!cameraActive && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md z-50">
                    <div className="text-center p-10 border-2 border-[#b87333]/30 bg-[#0d0d0d] rounded-lg shadow-[0_0_50px_rgba(184,115,51,0.3)]">
                      <p className="text-[#e3a857] text-2xl font-black mb-8 tracking-[0.3em] uppercase italic">
                        Input Feed: Latent
                      </p>
                      {permissionDenied && (
                        <p className="text-red-500 text-sm mb-8 max-w-xs mx-auto uppercase font-mono tracking-tight leading-loose">
                          Authentication Error: Biometric feed access denied by system protocols.
                        </p>
                      )}
                      <button
                        onClick={() => setShowPermissionModal(true)}
                        className="px-10 py-4 bg-gradient-to-b from-[#e3a857] to-[#8b4513] hover:from-[#f5c38c] hover:to-[#a0522d] text-white rounded-none border-2 border-[#5d3a1a] shadow-xl hover:shadow-[#e3a857]/20 transition-all duration-300 uppercase tracking-[0.3em] font-black active:scale-95 text-sm"
                      >
                        Engage Sensors
                      </button>
                    </div>
                  </div>
                )}

                {/* SCANNER OVERLAY */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(227,168,87,0.02)_1px,transparent_1px)] bg-[size:100%_8px] opacity-30 animate-scan" />

                {/* HUD Elements Overlay */}
                <div className="absolute top-4 left-4 flex flex-col items-start opacity-70">
                  <div className="text-[10px] font-mono tracking-tighter p-1 bg-[#b87333] text-black font-bold border border-[#5d3a1a]">LENS_STATUS: READY</div>
                  <div className="text-[8px] font-mono mt-1 text-[#e3a857]">FEED_COORDS: {handDataRef.current?.landmarks[0]?.[0]?.x.toFixed(3) || '0.000'} , {handDataRef.current?.landmarks[0]?.[0]?.y.toFixed(3) || '0.000'}</div>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center space-x-2 opacity-70">
                  <div className="w-10 h-10 border-2 border-[#b87333]/50 rounded-full animate-spin-slow relative">
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-[#b87333] -translate-x-1/2" />
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#b87333] -translate-y-1/2" />
                  </div>
                  <div className="text-[8px] font-mono uppercase text-[#e3a857]">Rotational Stability: Optimized</div>
                </div>

                <div className="absolute top-4 right-4 text-[10px] font-mono opacity-70 text-right text-[#e3a857]">
                  <div className="bg-[#b87333]/10 px-2 py-1">RECOVERY_BUFF: 100%</div>
                  <div className="text-[18px] font-black text-[#e3a857] mt-1 italic drop-shadow-[0_0_5px_rgba(227,168,87,0.4)]">FPS: {fps}</div>
                </div>
              </div>
            </div>

            {/* Sidebar Data */}
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] border-l-4 border-r-4 border-[#b87333] p-5 rounded-none shadow-xl transform skew-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <div className="w-12 h-12 border-2 border-[#b87333] rounded-sm rotate-45" />
                </div>
                <h3 className="text-xs font-black mb-4 tracking-widest text-[#b87333] uppercase flex items-center">
                  <div className="w-2 h-2 bg-[#b87333] mr-2" />
                  Biometric Status
                </h3>
                <div className="space-y-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between font-mono">
                      <div>
                        <span className="text-[9px] font-black inline-block py-1 px-2 uppercase rounded-none text-[#000] bg-[#b87333]">
                          Neural Sync
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black inline-block text-[#e3a857]">
                          {(confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-none bg-black border border-[#b87333]/30 p-0.5">
                      <div style={{ width: `${confidence * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#5d3a1a] via-[#b17a3a] to-[#e3a857] transition-all duration-700"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#b87333]/5 p-3 border border-[#b87333]/20 font-mono">
                    <span className="text-[10px] uppercase tracking-tighter">Core Integrity</span>
                    <span className={`text-[10px] font-black tracking-widest shadow-[0_0_10px_rgba(0,0,0,0.5)] px-2 py-0.5 ${cameraActive ? 'bg-green-900/40 text-green-400 border border-green-500/50' : 'bg-gray-900/40 text-gray-500 border border-gray-500/30'}`}>
                      {cameraActive ? 'NOMINAL' : 'INERT'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border-t-2 border-b-2 border-[#b87333] p-5 rounded-none shadow-xl flex-1 transform -skew-y-1 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 p-2 opacity-5">
                  <div className="w-20 h-20 border-t border-l border-[#b87333]" />
                </div>
                <h3 className="text-xs font-black mb-4 tracking-widest text-[#b87333] uppercase flex items-center">
                  <div className="w-2 h-2 bg-[#b87333] mr-2 animate-pulse" />
                  Gesture Processor
                </h3>
                <div className="space-y-4">
                  {gestures.length > 0 ? (
                    gestures.map((g, i) => (
                      <div key={i} className={`p-4 border-2 transition-all duration-500 relative overflow-hidden ${g === 'REPULSOR_POSE' ? 'bg-red-950/40 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-105 z-10' : 'bg-black/40 border-[#b87333]/30'}`}>
                        <div className="text-[10px] mb-2 opacity-50 font-mono tracking-widest text-[#e3a857]">HAND_SUB_ID_{i + 1}</div>
                        <div className={`text-xl font-black italic tracking-tighter uppercase ${g === 'REPULSOR_POSE' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.7)]' : 'text-[#e3a857]'}`}>
                          {g === 'REPULSOR_POSE' ? 'REPULSOR_ARMED' : (g === 'NONE' ? 'SEARCHING...' : g.replace('_', ' '))}
                        </div>
                        {g === 'REPULSOR_POSE' && (
                          <div className="absolute top-0 right-0 p-1">
                            <span className="flex h-3 w-3 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-10 bg-black/40 border border-[#b87333]/10 text-[9px] text-center opacity-30 font-mono italic tracking-[0.3em] uppercase leading-loose">
                        // INITIALIZING BIOMETRIC SCAN...<br />
                        // WAITING FOR NEURAL INPUT...
                    </div>
                  )}
                </div>
              </div>

              {/* Warning/Alert Area */}
              {gestures.includes('REPULSOR_POSE') && (
                <div className="bg-red-700 text-white font-black text-center py-4 animate-bounce skew-x-[-15deg] shadow-[0_0_30px_rgba(220,38,38,0.4)] border-2 border-red-500 uppercase tracking-[0.3em] text-[15px] italic">
                  SYSTEM STATUS: COMBAT ENGAGED
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .animate-scan {
          animation: scan 15s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* 카메라 권한 모달 */}
      {showPermissionModal && (
        <CameraPermissionModal
          onGranted={handleCameraPermissionGranted}
          onDenied={handleCameraPermissionDenied}
        />
      )}
    </div>
  );
}
