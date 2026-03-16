import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Microservices Deployment Test",
  description: "Testing User, Product, and Order services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-50">
        <main className="container mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
