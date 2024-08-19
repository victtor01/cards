import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en" className="light">
        <body className={`${inter.className} bg-white text-zinc-700 dark:bg-zinc-950 dark:text-gray-200`}>
          {children}
        </body>
      </html>
    </QueryProvider>
  );
}
