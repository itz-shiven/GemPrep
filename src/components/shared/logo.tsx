import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  markOnly?: boolean;
};

export function Logo({ href = "/", className, markOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex items-center gap-2 rounded-md font-semibold tracking-normal",
        className,
      )}
      aria-label="GEMPREP home"
    >
      <span
        className="grid size-7 place-items-center rounded-md border border-primary/20 bg-primary text-primary-foreground shadow-sm"
        aria-hidden="true"
      >
        <span className="size-2.5 rotate-45 rounded-[2px] border border-current" />
      </span>
      {markOnly ? null : <span>GEMPREP</span>}
    </Link>
  );
}
