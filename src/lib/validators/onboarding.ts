import { z } from "zod";

import {
  BIO_MAX_LENGTH,
  EXPERIENCE_LEVEL_VALUES,
  PREFERRED_LANGUAGE_VALUES,
} from "@/lib/constants";

const blankStringToNull = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
};

const optionalTrimmedString = (maxLength: number, message: string) =>
  z
    .preprocess(
      (value) => value ?? "",
      z.string().trim().max(maxLength, message),
    )
    .transform((value) => (value ? value : null));

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Full name must be 80 characters or fewer."),
  college: optionalTrimmedString(
    120,
    "College must be 120 characters or fewer.",
  ),
  graduationYear: z.preprocess(
    blankStringToNull,
    z.union([
      z.coerce
        .number("Enter a valid graduation year.")
        .int("Graduation year must be a whole number.")
        .min(2000, "Graduation year must be 2000 or later.")
        .max(2040, "Graduation year must be 2040 or earlier."),
      z.null(),
    ]),
  ),
  preferredLanguage: z.enum(PREFERRED_LANGUAGE_VALUES, {
    message: "Choose a preferred programming language.",
  }),
  experienceLevel: z.preprocess(
    blankStringToNull,
    z
      .enum(EXPERIENCE_LEVEL_VALUES, {
        message: "Choose your experience level.",
      })
      .nullable(),
  ),
  bio: optionalTrimmedString(
    BIO_MAX_LENGTH,
    `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`,
  ),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type OnboardingField = keyof OnboardingInput;

export type OnboardingFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<OnboardingField, string[]>>;
};

export const initialOnboardingFormState: OnboardingFormState = {
  status: "idle",
};
