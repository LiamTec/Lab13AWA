import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Provider from "@/components/SessionProvider";
import NavAuth from "@/components/NavAuth";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
// ... continuación de la Parte 1 ...

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <nav className="w-full bg-black shadow-sm">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="text-xl font-semibold">
                MyAuthApp
              </Link>
              <ul className="flex items-center justify-center gap-6 text-sm">
                <NavAuth />
              </ul>
            </div>
          </nav>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}