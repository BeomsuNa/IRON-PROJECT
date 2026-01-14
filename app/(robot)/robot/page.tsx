import RobotCanvas from '@/components/3D/RobotCanvas';

export const metadata = {
  title: 'Future Maze - Robot',
  description: 'Interactive 3D Robot Interface',
};

export default function Home() {
  return (
    <main className="fixed w-full h-dvh overflow-hidden bg-[#F5F5F7] z-50 inset-0"> {/* w-screen -> w-full, h-screen -> h-dvh 수정 권장 */}
      
     <div className="w-full h-full absolute inset-0 z-0 ">
        <RobotCanvas />
     </div>

      {/* HTML 오버레이 */}
      <div className="absolute top-0 left-0 p-10 text-black z-10 pointer-events-none">
        <h1 className="text-6xl font-bold m-0 tracking-tighter">FUTRURE MAZE</h1>
        <p className="text-2xl mt-2 opacity-80">CSS PROJECT SITE 3D</p>
        
        <button className="mt-8 px-6 py-3 bg-[#00ffcc] text-black font-bold rounded pointer-events-auto hover:bg-white transition-colors">
          Start Project
        </button>
      </div>
      
    </main>
  );
}