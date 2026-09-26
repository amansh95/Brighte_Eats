import type { Metadata } from "next";
import NavLink from "./components/NavLink";
import "./globals.css";

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
    <html lang="en">
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
