import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";

export const metadata: Metadata = {
  title: "CSIL",
  description: "UChicago's Computer Science Instructional Lab",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({ variable: "--font-geist-sans" });
const garamond = Cormorant_Garamond({ variable: "--font-garamond-serif" });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${garamond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
