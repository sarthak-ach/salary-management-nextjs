"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/insights", label: "Insights", icon: BarChart3 },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Salary Management
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
