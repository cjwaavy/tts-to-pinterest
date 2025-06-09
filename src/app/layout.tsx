import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth.config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TikTok to Pinterest Reposter",
  description: "Repost your TikTok videos to Pinterest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter?.className || ""}>
        <Providers session={session}>
          <Navbar />
        {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
