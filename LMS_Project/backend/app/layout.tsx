import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS Backend",
  description: "Backend service for the BasicsLearn LMS platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
