import { Geist_Mono, Open_Sans } from "next/font/google";
import "../globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata = {
  title: "Cinzel Panel",
  robots: { index: false, follow: false },
};

export default function CinzelPanelLayout({ children }) {
  return (
    <html lang="en" className={`${geistMono.variable} ${openSans.variable} h-full antialiased`}>
      <body className="font-opensans min-h-full bg-base-200 text-base-content">{children}</body>
    </html>
  );
}
