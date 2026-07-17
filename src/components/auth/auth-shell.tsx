import type { ReactNode } from "react";

import { Logo } from "@/components/shared/logo";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="grid min-h-screen bg-secondary/45 px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">
        <div className="mb-8">
          <Logo />
          <h1 className="mt-8 text-3xl font-semibold tracking-normal">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border bg-background p-2 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}
