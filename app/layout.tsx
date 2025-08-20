import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Warr",
  description: "Warr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-[768px] mx-auto">{children}</body>
    </html>
  );
}
