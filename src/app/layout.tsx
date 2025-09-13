import "~/styles/globals.css";

import { type Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";

import CsilTriangles from "~/components/CsilTriangles";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";

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
      <body>
        <main className="relative flex min-h-dvh flex-col">
          <CsilTriangles />
          <NavBar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
