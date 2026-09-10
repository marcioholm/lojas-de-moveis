import type { Metadata } from "next";
import { DM_Serif_Text, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const fontDisplay = DM_Serif_Text({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const fontBody = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "VitrinaHub",
  description: "Sistema completo para gestão de lojas de móveis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${fontDisplay.variable} ${fontBody.variable} antialiased`}
    >
      <body className="font-body bg-[var(--bg)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
