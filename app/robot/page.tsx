import RobotScene from '@/components/RobotScene';
export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#111]">
      
      {/* 1. 배경 3D 씬 (클라이언트 컴포넌트) */}
      <RobotScene />

      {/* 2. HTML 오버레이 (SEO 친화적인 정적 컨텐츠) */}
      <div className="absolute top-0 left-0 p-10 text-white z-10 pointer-events-none">
        <h1 className="text-6xl font-bold m-0 tracking-tighter">OPTIMUS WEB</h1>
        <p className="text-2xl mt-2 opacity-80">Collaborative AI Design System</p>
        
        {/* 상호작용 가능한 버튼 예시 (pointer-events-auto 필요) */}
        <button className="mt-8 px-6 py-3 bg-[#00ffcc] text-black font-bold rounded pointer-events-auto hover:bg-white transition-colors">
          Start Project
        </button>
      </div>
      
    </main>
  );
}