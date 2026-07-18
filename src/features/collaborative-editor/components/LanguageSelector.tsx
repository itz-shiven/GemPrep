"use client";

import type {
  LanguageId,
  LanguageOption,
} from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type LanguageSelectorProps = {
  value: LanguageId;
  languages: LanguageOption[];
  disabled?: boolean;
  onChange: (languageId: LanguageId) => void;
};

export function LanguageSelector({
  value,
  languages,
  disabled = false,
  onChange,
}: LanguageSelectorProps) {
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Select coding language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as LanguageId)}
        disabled={disabled}
        aria-label="Select coding language"
        className={cn(
          "focus-ring h-9 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-neutral-100 transition-colors",
          "hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {languages.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
