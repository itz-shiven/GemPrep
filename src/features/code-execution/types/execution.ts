export type CodeExecutionLanguage = "cpp" | "java" | "python" | "javascript";

export type CodeExecutionTestCase = {
  id: string;
  label: string;
  input: string;
  expectedOutput: string;
};

export type NewCodeExecutionTestCase = {
  input: string;
  expectedOutput: string;
};

export type CodeExecutionResult = {
  id: string;
  label: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  output: string;
  stderr: string;
  compile_output: string;
  execution_time: number | null;
  passed: boolean;
  status: string;
};

export type CodeRunRequest = {
  language: CodeExecutionLanguage;
  sourceCode: string;
  testCases: NewCodeExecutionTestCase[];
};

export type CodeRunSuccessResponse = {
  results: CodeExecutionResult[];
  output: string;
  stderr: string;
  compile_output: string;
  execution_time: number | null;
};

export type CodeRunFailureResponse = {
  error: string;
  stderr: string;
  compile_output: string;
};

export type CodeRunResponse = CodeRunSuccessResponse;
