import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salary Management",
  description: "HR salary management and insights",
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
