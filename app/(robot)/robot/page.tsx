import IntroOverlay from '@/components/ui/IntroOverlay';
import RobotClient from '@/components/3D/RobotClient';

export const metadata = {
  title: 'Future Maze - Robot',
  description: 'Interactive 3D Robot Interface',
};

export default function Home() {
  return (
    <main className="fixed w-full h-dvh overflow-hidden bg-[#F5F5F7] z-1 inset-0"> {/* w-screen -> w-full, h-screen -> h-dvh 수정 권장 */}

      <div className="w-full h-full absolute inset-0 z-0 ">
        <RobotClient />
      </div>

      {/* HTML 오버레이 */}

      <IntroOverlay />
    </main>
  );
}