import { NextResponse } from "next/server";
import { z } from "zod";

import {
  executePistonTestCases,
  PistonExecutionError,
} from "@/features/code-execution/lib/piston/client";
import { summarizePistonResults } from "@/features/code-execution/lib/piston/formatter";
import { getPistonLanguageRuntime } from "@/features/code-execution/lib/piston/languages";
import type { CodeExecutionTestCase } from "@/features/code-execution/types/execution";
import { isProfileComplete, requireSyncedUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const codeRunRequestSchema = z.object({
  language: z.enum(["cpp", "java", "python", "javascript"]),
  sourceCode: z
    .string()
    .min(1)
    .max(30000)
    .refine((value) => value.trim().length > 0),
  testCases: z
    .array(
      z.object({
        input: z.string().max(4000),
        expectedOutput: z.string().max(4000),
      }),
    )
    .min(1)
    .max(8),
});

export async function POST(request: Request) {
  const user = await requireSyncedUser();

  if (!isProfileComplete(user)) {
    return NextResponse.json(
      { error: "Complete onboarding before running interview code." },
      { status: 403 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid code execution request." },
      { status: 400 },
    );
  }

  const parsedBody = codeRunRequestSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid code execution request." },
      { status: 400 },
    );
  }

  const { language, sourceCode, testCases } = parsedBody.data;
  const runtime = getPistonLanguageRuntime(language);
  const executableTestCases: CodeExecutionTestCase[] = testCases.map(
    (testCase, index) => ({
      id: `case-${index + 1}`,
      label: `Test Case ${index + 1}`,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
    }),
  );

  try {
    const results = await executePistonTestCases({
      runtime,
      sourceCode,
      testCases: executableTestCases,
    });

    return NextResponse.json({
      results,
      ...summarizePistonResults(results),
    });
  } catch (error) {
    if (error instanceof PistonExecutionError) {
      return NextResponse.json(
        {
          error: error.message,
          stderr: error.stderr,
          compile_output: error.compileOutput,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to execute code right now.",
        stderr: "",
        compile_output: "",
      },
      { status: 502 },
    );
  }
}
