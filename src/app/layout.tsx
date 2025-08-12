import "~/styles/globals.css";

import { type Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";

export const metadata: Metadata = {
  title: "CSIL",
  description: "UChicago's Computer Science Instructional Lab",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const garamond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond-serif",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={garamond.variable}>
      <body>{children}</body>
    </html>
  );
}
