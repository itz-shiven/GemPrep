import type { CodeExecutionLanguage } from "@/features/code-execution/types/execution";

export type PistonLanguageRuntime = {
  language: string;
  version: string;
  fileName: string;
};

export const PISTON_LANGUAGE_RUNTIMES: Record<
  CodeExecutionLanguage,
  PistonLanguageRuntime
> = {
  cpp: {
    language: "cpp",
    version: "*",
    fileName: "main.cpp",
  },
  java: {
    language: "java",
    version: "*",
    fileName: "Main.java",
  },
  python: {
    language: "python",
    version: "*",
    fileName: "main.py",
  },
  javascript: {
    language: "javascript",
    version: "*",
    fileName: "main.js",
  },
};

export function getPistonLanguageRuntime(language: CodeExecutionLanguage) {
  return PISTON_LANGUAGE_RUNTIMES[language];
}
