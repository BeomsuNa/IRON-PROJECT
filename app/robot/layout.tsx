import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Optimus 3D Web',
  description: 'Tesla Optimus inspired 3D interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>{children}</div>
  );
}