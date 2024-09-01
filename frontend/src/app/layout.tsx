import { LoaderLogo } from "@/components/loader-logo";
import { QueryProvider } from "@/providers/query-client";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  const cookiesStore = cookies();
  const theme = cookiesStore?.get("_theme")?.value;

  return (
    <QueryProvider>
      <html lang="en" className={theme || "light"}>
        <body
          className={`${inter.className} bg-white text-zinc-700 dark:bg-black dark:text-gray-200`}
        >
          <Suspense fallback={<LoaderLogo />}>{children}</Suspense>
        </body>
      </html>
    </QueryProvider>
  );
}
