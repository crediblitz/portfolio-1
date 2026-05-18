import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPortfolioContent } from "@/lib/portfolio-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolioContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getPortfolioContent();

  return (
    <html
      lang={content.metadata.lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
