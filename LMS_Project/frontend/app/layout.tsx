import type { Metadata } from "next";
import CoursePublishingBoundary from "../src/auth/CoursePublishingBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electrical Training Platform",
  description: "Interactive electrical lessons, starter projects, and reusable diagram components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CoursePublishingBoundary>{children}</CoursePublishingBoundary>
      </body>
    </html>
  );
}
