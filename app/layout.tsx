import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'UI Playground',
  description: 'CSS / Scroll / Pin / Demo',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <div className="main-shell">         
          {children}
        </div>
      </body>

  );
}
