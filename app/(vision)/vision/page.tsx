'use client';

import CameraPermissionModal from '@/components/camera/CameraPermissionModal';
import { useCameraDetection, useCameraWithMediaPipe } from '@/lib/useCamera';
import { useEffect, useState } from 'react';


export default function IronManPage() {
  const { detected: cameraDetected } = useCameraDetection();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const {
    videoRef,
    canvasRef,
    isActive: cameraActive,
    startCamera,
    stopCamera,
    fps,
  } = useCameraWithMediaPipe({
    runningMode: 'LIVE_STREAM',
    maxNumHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    onResults: (results) => {
      // 필요시 추가 결과 처리 로직
    }
  });


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
      console.error('카메라 접근 실패:', error);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Iron Man Interface
        </h1>

        {cameraDetected === null && (
          <div className="text-center text-gray-300">
            <p className="text-lg">카메라 확인 중...</p>
          </div>
        )}

        {cameraDetected === false && (
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-8 text-center">
            <p className="text-xl text-red-200 font-semibold mb-2">
              ⚠️ 웹카메라 감지 안 됨
            </p>
            <p className="text-gray-300">
              이 기능을 사용하려면 웹카메라를 연결해주세요.
            </p>
          </div>
        )}

        {cameraDetected === true && (
          <div className="space-y-6">
            {/* 카메라 화면 */}
            <div className={`relative bg-black rounded-lg overflow-hidden border-4 border-blue-400 shadow-2xl aspect-[3/4] md:aspect-[4/3]`}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // 거울 모드
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ transform: 'scaleX(-1)' }} // 거울 모드 대응
              />
              {!cameraActive && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-300 text-lg mb-4">
                      카메라가 비활성화되어 있습니다
                    </p>
                    {permissionDenied && (
                      <p className="text-red-400 text-sm mb-4">
                        카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 다시 활성화해주세요.
                      </p>
                    )}
                    <button
                      onClick={() => setShowPermissionModal(true)}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                      카메라 권한 요청
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/50 text-green-400 px-2 py-1 rounded text-xs font-mono z-10">
                FPS: {fps}
              </div>
            </div>

            {/* 상태 표시 */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full ${cameraActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                    }`}
                />
                <span className="text-gray-300">
                  {cameraActive ? '카메라 활성화' : '카메라 비활성화'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

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
