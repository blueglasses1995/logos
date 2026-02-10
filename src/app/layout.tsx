import type { Metadata } from "next";
import {
  Lora,
  Source_Serif_4,
  JetBrains_Mono,
  Noto_Sans_JP,
} from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { OfflineIndicator } from "@/components/offline/offline-indicator";
import { InstallPrompt } from "@/components/offline/install-prompt";

const lora = Lora({
  variable: "--font-heading-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Logos - 論理学学習アプリ",
  description: "論理学の基礎を学び、実務に活かすインタラクティブな学習アプリケーション",
  applicationName: "Logos",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Logos",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export const viewport = {
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${lora.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${notoSansJP.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        <OfflineIndicator />
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
