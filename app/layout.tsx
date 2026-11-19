import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Untitled - Notepad",
  description: "A nostalgic Windows XP Notepad recreation built with ui-sdk.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
