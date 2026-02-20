// app/layout.tsx (루트)
import "./globals.css";
import { Geist_Mono } from 'next/font/google';

const geistSans = Geist_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`
        main-body-fullscreen
        ${geistSans.variable} antialiased
      `}>
        {children}
      </body>
    </html>
  );
}