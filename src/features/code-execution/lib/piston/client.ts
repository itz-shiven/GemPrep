import {
  formatPistonResult,
  type PistonExecutionResponse,
} from "@/features/code-execution/lib/piston/formatter";
import type { PistonLanguageRuntime } from "@/features/code-execution/lib/piston/languages";
import type {
  CodeExecutionResult,
  CodeExecutionTestCase,
} from "@/features/code-execution/types/execution";

type ExecuteTestCasesParams = {
  runtime: PistonLanguageRuntime;
  sourceCode: string;
  testCases: CodeExecutionTestCase[];
};

type PistonApiErrorBody = {
  error?: string;
  message?: string;
};

export class PistonExecutionError extends Error {
  constructor(
    message: string,
    readonly statusCode = 502,
    readonly stderr = "",
    readonly compileOutput = "",
  ) {
    super(message);
    this.name = "PistonExecutionError";
  }
}

export async function executePistonTestCases({
  runtime,
  sourceCode,
  testCases,
}: ExecuteTestCasesParams): Promise<CodeExecutionResult[]> {
  return Promise.all(
    testCases.map(async (testCase) => {
      const execution = await executeSingleTestCase({
        runtime,
        sourceCode,
        stdin: testCase.input,
      });

      return formatPistonResult(testCase, execution);
    }),
  );
}

async function executeSingleTestCase({
  runtime,
  sourceCode,
  stdin,
}: {
  runtime: PistonLanguageRuntime;
  sourceCode: string;
  stdin: string;
}) {
  let response: Response;
  const pistonApiUrl = getPistonApiUrl();

  try {
    response = await fetch(pistonApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version,
        files: [
          {
            name: runtime.fileName,
            content: sourceCode,
          },
        ],
        stdin,
      }),
      cache: "no-store",
    });
  } catch {
    throw new PistonExecutionError(
      "Could not reach the Piston execution service. Check PISTON_API_URL.",
    );
  }

  const body = await parsePistonResponse(response);

  if (!response.ok) {
    throw new PistonExecutionError(
      getPistonErrorMessage(response.status, body),
      getRouteStatusCode(response.status),
    );
  }

  return body as PistonExecutionResponse;
}

async function parsePistonResponse(response: Response) {
  try {
    return (await response.json()) as PistonExecutionResponse | PistonApiErrorBody;
  } catch {
    return {
      message: "Piston returned an invalid response.",
    } satisfies PistonApiErrorBody;
  }
}

function getPistonErrorMessage(
  statusCode: number,
  body: PistonExecutionResponse | PistonApiErrorBody,
) {
  if (statusCode === 401 || statusCode === 403) {
    return "Piston rejected the execution request.";
  }

  if (statusCode === 429) {
    return "Piston rate limit reached. Try again shortly or use a self-hosted Piston API URL.";
  }

  if (statusCode >= 500) {
    return "Piston execution service is unavailable right now.";
  }

  const serviceMessage = getServiceMessage(body);

  return serviceMessage
    ? `Piston rejected the execution request: ${serviceMessage}`
    : "Piston rejected the execution request.";
}

function getRouteStatusCode(pistonStatusCode: number) {
  if (pistonStatusCode === 400) {
    return 400;
  }

  if (pistonStatusCode === 401 || pistonStatusCode === 403) {
    return 502;
  }

  if (pistonStatusCode === 429) {
    return 429;
  }

  return 502;
}

function getServiceMessage(body: PistonExecutionResponse | PistonApiErrorBody) {
  if ("message" in body && typeof body.message === "string") {
    return body.message;
  }

  if ("error" in body && typeof body.error === "string") {
    return body.error;
  }

  return null;
}

function getPistonApiUrl() {
  return (
    process.env.PISTON_API_URL ??
    "https://emkc.org/api/v2/piston/execute"
  ).trim();
}
