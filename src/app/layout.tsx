import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const baconKingdom = localFont({
  src: "../fonts/bacon-kingdom.ttf",
  variable: "--font-bacon-kingdom",
  display: "swap",
});

const linoStamp = localFont({
  src: "../fonts/lino-stamp-2.ttf",
  variable: "--font-lino-stamp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poule & Poulette",
  description:
    "Poule & Poulette — restaurants in België. Fun loving food moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${baconKingdom.variable} ${linoStamp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-pp-white text-pp-black">
        {children}
      </body>
    </html>
  );
}
