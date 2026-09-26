import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import NavLink from "./components/NavLink";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const outfit = Outfit({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Brighte Eats",
  description: "Register your interest in Brighte Eats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <span className="brand">Brighte Eats</span>
            <nav className="nav">
              <NavLink href="/">Register</NavLink>
              <NavLink href="/leads">Leads</NavLink>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
