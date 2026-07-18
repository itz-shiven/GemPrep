"use client";

import { useCallback, useState } from "react";

import type {
  CodeExecutionLanguage,
  CodeExecutionResult,
  CodeRunResponse,
  NewCodeExecutionTestCase,
} from "@/features/code-execution/types/execution";

type RunCodeParams = {
  language: CodeExecutionLanguage;
  sourceCode: string;
  testCases: NewCodeExecutionTestCase[];
};

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CodeExecutionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runCode = useCallback(async (params: RunCodeParams) => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch("/api/code/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const body = (await response.json()) as
        | CodeRunResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in body && body.error
            ? body.error
            : "Unable to run code right now.",
        );
      }

      if (!("results" in body)) {
        throw new Error("Code execution returned an invalid response.");
      }

      setResults(body.results);
      return body.results;
    } catch (runError) {
      const message =
        runError instanceof Error
          ? runError.message
          : "Unable to run code right now.";

      setError(message);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const resetResults = useCallback(() => {
    setError(null);
    setResults([]);
  }, []);

  return {
    error,
    isRunning,
    resetResults,
    results,
    runCode,
  };
}
