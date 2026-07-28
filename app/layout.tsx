import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blesslife Limited — Comprehensive Business Solutions in KSA",
  description:
    "Blesslife Limited is a multifaceted company providing comprehensive solutions in business consultation, trading, services, construction, HR supply, operations & maintenance. Aligned with Saudi Vision 2030.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
