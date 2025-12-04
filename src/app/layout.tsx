import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { DataSeeder } from "@/components/DataSeeder";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoQuest Campus",
  description: "Building a Better World for the Future",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={clsx(inter.className, "bg-gray-100 min-h-screen")}>
        <AuthProvider>
          <DataSeeder />
          <main className="mobile-container pb-20">
            {children}
            <Navigation />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
