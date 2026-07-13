import { NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

export async function POST(req: Request) {
  try {
    const { language, version, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code are required" }, { status: 400 });
    }

    // Default versions if not provided
    const languageVersions: Record<string, string> = {
      javascript: "18.15.0",
      python: "3.10.0",
      typescript: "5.0.3",
      java: "15.0.2",
      cpp: "10.2.0"
    };

    const runVersion = version || languageVersions[language] || "*";

    const response = await fetch(PISTON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        version: runVersion,
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Piston API error: ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Code execution error:", error);
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 });
  }
}
