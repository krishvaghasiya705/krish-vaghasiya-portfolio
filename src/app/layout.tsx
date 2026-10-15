import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.scss";
import { Loadingscreen } from "@/common/loading/loadingscreen";
import Header from "@/common/header";
import CursorSmoke from "@/components/cursor-smoke";

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
  title: "Krish Vaghasiya — Web Designer & Developer",
  description: "I'm Krish Vaghasiya, a web designer and developer crafting distinctive digital experiences through thoughtful UI/UX design, modern web technologies, and clean, responsive interfaces.",
  icons: {
    icon: "/logo/favicon.ico",
    shortcut: "/logo/favicon.ico",
    apple: "/logo/apple-touch-icon.png",
  },
  manifest: "/logo/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={krishCodeFont.variable}>
      <body>
        <CursorSmoke />
        <Loadingscreen />
        <Header />
        {children}
      </body>
    </html>
  );
}
