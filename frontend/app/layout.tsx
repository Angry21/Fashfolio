import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PixieChat from "@/components/PixieChat";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FashFolio | AI Fashion Studio",
  description: "Agentic AI for Fashion Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <Navbar />
          <main className="min-h-screen bg-white">
            {children}
          </main>
          <PixieChat />
        </body>
      </html>
    </ClerkProvider>
  );
}
