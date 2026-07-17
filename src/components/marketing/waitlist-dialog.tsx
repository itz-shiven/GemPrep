"use client";

import { FormEvent, ReactNode, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type WaitlistDialogProps = {
  children: ReactNode;
};

export function WaitlistDialog({ children }: WaitlistDialogProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the GEMPREP preview</DialogTitle>
          <DialogDescription>
            Get notified when the first peer practice cohorts open. No auth or
            account flow is wired in this phase.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="rounded-lg border bg-secondary p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium">You are on the preview list.</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This is a frontend-only interaction for now. Backend wiring can
                  be added in a later phase.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-label="Email address"
              required
            />
            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">
                Request access
                <ArrowRight className="size-4" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
