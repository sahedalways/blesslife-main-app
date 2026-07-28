import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — Blesslife Limited",
  description: "Manage notices and announcements for the Blesslife website.",
};

import './admin.css';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-theme">{children}</div>;
}
