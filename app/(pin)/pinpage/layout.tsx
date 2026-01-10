export default function PinLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      {children}
    </div>
  );
}
