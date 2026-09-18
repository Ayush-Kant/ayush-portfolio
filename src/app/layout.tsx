import type { Metadata } from "next";

import Starfield from "@/components/background/Starfield";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ayush Kant — Portfolio",
  description:
    "Portfolio of Ayush Kant — software engineer and builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Starfield />

        <div className="site-content">
          {children}
        </div>
      </body>
    </html>
  );
}
