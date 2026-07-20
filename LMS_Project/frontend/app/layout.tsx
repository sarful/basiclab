import type { Metadata } from "next";
import CoursePublishingBoundary from "../src/auth/CoursePublishingBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "MechatronicsLAB",
  description: "Structured electrical lessons, interactive simulations, and reusable diagram components.",
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
