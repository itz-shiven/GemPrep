import type {
  CodeExecutionResult,
  CodeExecutionTestCase,
} from "@/features/code-execution/types/execution";

export type PistonStageOutput = {
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number | null;
  signal?: string | null;
  time?: number | null;
};

export type PistonExecutionResponse = {
  run?: PistonStageOutput;
  compile?: PistonStageOutput;
  message?: string;
};

export type PistonExecutionSummary = {
  output: string;
  stderr: string;
  compile_output: string;
  execution_time: number | null;
};

export function formatPistonResult(
  testCase: CodeExecutionTestCase,
  execution: PistonExecutionResponse,
): CodeExecutionResult {
  const output = execution.run?.stdout ?? execution.run?.output ?? "";
  const stderr = execution.run?.stderr ?? "";
  const compileOutput =
    execution.compile?.stderr ??
    execution.compile?.output ??
    execution.compile?.stdout ??
    "";
  const status = getExecutionStatus(execution);
  const passed =
    status === "Accepted" &&
    normalizeOutput(output) === normalizeOutput(testCase.expectedOutput);

  return {
    id: testCase.id,
    label: testCase.label,
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: (output || stderr || compileOutput).trimEnd(),
    output: output.trimEnd(),
    stderr: stderr.trimEnd(),
    compile_output: compileOutput.trimEnd(),
    execution_time: execution.run?.time ?? null,
    passed,
    status,
  };
}

export function summarizePistonResults(
  results: CodeExecutionResult[],
): PistonExecutionSummary {
  return {
    output: results.map((result) => result.output).join("\n"),
    stderr: results
      .map((result) => result.stderr)
      .filter(Boolean)
      .join("\n"),
    compile_output: results
      .map((result) => result.compile_output)
      .filter(Boolean)
      .join("\n"),
    execution_time: summarizeExecutionTime(results),
  };
}

function getExecutionStatus(execution: PistonExecutionResponse) {
  if (execution.compile?.code && execution.compile.code !== 0) {
    return "Compilation Error";
  }

  if (execution.run?.code && execution.run.code !== 0) {
    return "Runtime Error";
  }

  if (execution.run?.signal) {
    return `Signal: ${execution.run.signal}`;
  }

  return "Accepted";
}

function summarizeExecutionTime(results: CodeExecutionResult[]) {
  const timings = results
    .map((result) => result.execution_time)
    .filter((time): time is number => typeof time === "number");

  if (timings.length === 0) {
    return null;
  }

  return timings.reduce((total, time) => total + time, 0);
}

function normalizeOutput(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}
