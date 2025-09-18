import type { Metadata, Viewport } from "next";
import "./globals.css";
import theme from "@/app/utils/theme";
import CombinedProvider from "@/app/components/CombinedProvider";

export const metadata: Metadata = {
  title: "🐶 Warr",
  description: "Warr",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function buildThemeCssVariables(): string {
  const colorVars = Object.entries(theme.colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join("\n");
  return `:root {\n${colorVars}\n}`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeCss = buildThemeCssVariables();

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body suppressHydrationWarning className="font-sans">
        <CombinedProvider>{children}</CombinedProvider>
      </body>
    </html>
  );
}
