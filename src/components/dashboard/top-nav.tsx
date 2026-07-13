"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  const lastSegment = pathname.split("/").pop() || "";
  const title = pathname === "/dashboard" 
    ? "Dashboard" 
    : lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
