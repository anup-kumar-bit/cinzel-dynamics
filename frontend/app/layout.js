import { Geist_Mono, Cinzel,Open_Sans } from "next/font/google";
import NavBar from "./Global-Compoents/NavBar";
import ContactPopup from "./Global-Compoents/ContactPopup";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});


const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const SITE_URL = "https://cinzeldynamics.com";
const SITE_NAME = "Cinzel Dynamics";
const SITE_DESCRIPTION =
  "Cinzel Dynamics designs and builds the backends, web apps and mobile products startups scale on — then keeps them running, found, and ranking long after launch.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Custom App, Web & Backend Development Agency`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Cinzel Dynamics",
    "custom app development",
    "web application development",
    "backend engineering",
    "mobile app development",
    "SEO agency",
    "App Store Optimization",
    "Web development",
    "Website development"
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Custom App, Web & Backend Development Agency`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/apps.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Custom App, Web & Backend Development Agency`,
    description: SITE_DESCRIPTION,
    images: ["/images/apps.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${cinzel.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar/>
        <main className="flex-1">
          {children}
        </main>
        <ContactPopup/>
      </body>
    </html>
  );
}
