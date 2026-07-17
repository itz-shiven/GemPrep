"use client";

import { Loader2, Upload } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { useActionState } from "react";

import {
  completeOnboarding,
} from "@/app/(protected)/onboarding/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AVATAR_ACCEPTED_TYPES,
  BIO_MAX_LENGTH,
  EXPERIENCE_LEVEL_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from "@/lib/constants";
import { initialOnboardingFormState } from "@/lib/validators";

type OnboardingFormProps = {
  defaults: {
    fullName: string;
    college: string;
    graduationYear: number | "";
    preferredLanguage: string;
    experienceLevel: string;
    bio: string;
  };
};

export function OnboardingForm({ defaults }: OnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    initialOnboardingFormState,
  );

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
        <CardDescription>
          Add the basics GEMPREP needs before showing the application shell.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Full name"
              error={state.errors?.fullName?.[0]}
            >
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                defaultValue={defaults.fullName}
                placeholder="Ada Lovelace"
                required
              />
            </Field>

            <Field
              id="college"
              label="College"
              error={state.errors?.college?.[0]}
            >
              <Input
                id="college"
                name="college"
                autoComplete="organization"
                defaultValue={defaults.college}
                placeholder="University name"
                required
              />
            </Field>

            <Field
              id="graduationYear"
              label="Graduation year"
              error={state.errors?.graduationYear?.[0]}
            >
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                inputMode="numeric"
                min={2000}
                max={2040}
                defaultValue={defaults.graduationYear}
                placeholder="2027"
                required
              />
            </Field>

            <Field
              id="preferredLanguage"
              label="Preferred language"
              error={state.errors?.preferredLanguage?.[0]}
            >
              <Select
                id="preferredLanguage"
                name="preferredLanguage"
                defaultValue={defaults.preferredLanguage}
                required
              >
                <option value="" disabled>
                  Select language
                </option>
                {PREFERRED_LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="experienceLevel"
              label="Experience level"
              error={state.errors?.experienceLevel?.[0]}
            >
              <Select
                id="experienceLevel"
                name="experienceLevel"
                defaultValue={defaults.experienceLevel}
                required
              >
                <option value="" disabled>
                  Select level
                </option>
                {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field id="avatar" label="Avatar upload">
              <div className="relative">
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept={AVATAR_ACCEPTED_TYPES.join(",")}
                  className="pt-2"
                />
                <Upload className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" />
              </div>
            </Field>
          </div>

          <Field id="bio" label="Short bio" error={state.errors?.bio?.[0]}>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={defaults.bio}
              maxLength={BIO_MAX_LENGTH}
              placeholder="Tell peers what you are preparing for and where you want feedback."
              required
            />
          </Field>

          {state.message ? (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Finish onboarding
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={[
        "focus-ring flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
