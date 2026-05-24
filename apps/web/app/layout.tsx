import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AppNav } from "@/components/layout/app-nav";
import { QueryProvider } from "@/components/providers/query-provider";
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
      <body>
        <QueryProvider>
          <AppNav />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
