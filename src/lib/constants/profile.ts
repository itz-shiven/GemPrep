export const EXPERIENCE_LEVEL_VALUES = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const;

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
] as const;

export const PREFERRED_LANGUAGE_VALUES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Swift",
] as const;

export const PREFERRED_LANGUAGE_OPTIONS = PREFERRED_LANGUAGE_VALUES.map(
  (language) => ({
    value: language,
    label: language,
  }),
);

export const BIO_MAX_LENGTH = 280;
export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;
export const AVATAR_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
