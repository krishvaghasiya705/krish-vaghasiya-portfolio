import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "@/styles/globals.scss";
import { Loadingscreen } from "@/common/loading/loadingscreen";
import Header from "@/common/header";
import CursorSmoke from "@/components/cursor-smoke";
import SmoothScroll from "@/common/smooth-scroll";
import ScrollAudio from "@/common/scroll-audio";
import Customscrollbar from "@/components/CustomScrollbar";
import Customcursor from "@/components/customcursor";

const krishCodeFont = localFont({
  src: [
    {
      path: "../font-family/Krishfnt-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font-family/Krishfnt-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-krish-code",
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krish-vaghasiya.netlify.app"),
  title: "Krish Vaghasiya | Web Designer & Frontend Developer Portfolio",
  description:
    "Krish Vaghasiya is a web designer and frontend developer in Surat, Gujarat, India, creating thoughtful UI/UX designs, responsive interfaces, and digital experiences.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  authors: [
    {
      name: "Krish Vaghasiya",
      url: "https://krish-vaghasiya.netlify.app",
    },
  ],
  creator: "Krish Vaghasiya",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Krish Vaghasiya",
    title: "Krish Vaghasiya | Web Designer & Frontend Developer Portfolio",
    description:
      "Explore the portfolio of Krish Vaghasiya, a web designer and frontend developer based in Surat, Gujarat, India.",
    locale: "en_IN",
    images: [
      {
        url: "/assets/images/krish-vaghasiya-profile.jpg",
        width: 941,
        height: 941,
        alt: "Krish Vaghasiya, web designer and frontend developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Vaghasiya | Web Designer & Frontend Developer Portfolio",
    description:
      "Explore the portfolio of Krish Vaghasiya, a web designer and frontend developer based in Surat, Gujarat, India.",
    images: [
      {
        url: "/assets/images/krish-vaghasiya-profile.jpg",
        alt: "Krish Vaghasiya, web designer and frontend developer",
      },
    ],
  },
  verification: {
    google: "04RlWCaA-OOL0IkS6zkJ7h0TT4J96ek5DnCcxXo1QPU",
  },
  icons: {
    icon: "/logo/favicon.ico",
    shortcut: "/logo/favicon.ico",
    apple: "/logo/apple-touch-icon.png",
  },
  manifest: "/logo/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html id="page-scroll-target" lang="en" className={krishCodeFont.variable}>
      <body>
        <Loadingscreen />
        <Customscrollbar />
        <SmoothScroll />
        <ScrollAudio />
        <CursorSmoke />
        <Customcursor />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
