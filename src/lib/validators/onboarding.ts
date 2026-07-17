import { z } from "zod";

import {
  BIO_MAX_LENGTH,
  EXPERIENCE_LEVEL_VALUES,
  PREFERRED_LANGUAGE_VALUES,
} from "@/lib/constants";

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Full name must be 80 characters or fewer."),
  college: z
    .string()
    .trim()
    .min(2, "Enter your college or university.")
    .max(120, "College must be 120 characters or fewer."),
  graduationYear: z.coerce
    .number("Enter a valid graduation year.")
    .int("Graduation year must be a whole number.")
    .min(2000, "Graduation year must be 2000 or later.")
    .max(2040, "Graduation year must be 2040 or earlier."),
  preferredLanguage: z.enum(PREFERRED_LANGUAGE_VALUES, {
    message: "Choose a preferred programming language.",
  }),
  experienceLevel: z.enum(EXPERIENCE_LEVEL_VALUES, {
    message: "Choose your experience level.",
  }),
  bio: z
    .string()
    .trim()
    .min(20, "Bio must be at least 20 characters.")
    .max(BIO_MAX_LENGTH, `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`),
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
