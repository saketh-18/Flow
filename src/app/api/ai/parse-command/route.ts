import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ParsedCommand {
  action: string;
  parameters: Record<string, any>;
  confidence: number;
}

export async function POST(request: Request) {
  try {
    const { input, availableActions } = await request.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const systemPrompt = `You are a command parser for a project management app. Parse natural language commands into structured actions.

Available actions:
- create_issue: Create a new issue (params: title, description, priority, assignee)
- update_issue: Update an existing issue (params: issueId, field, value)
- assign_issue: Assign issue to someone (params: issueId, assignee)
- change_status: Change issue status (params: issueId, status)
- add_label: Add label to issue (params: issueId, label)
- search_issues: Search for issues (params: query, filters)
- navigate: Navigate to a page (params: destination)
- create_project: Create a new project (params: name, description)
- list_issues: List issues with optional filters (params: filters)

Respond in JSON format:
{
  "action": "action_name",
  "parameters": { ... },
  "confidence": 0.9,
  "interpretation": "What you understood the user wants"
}

If you can't determine the action, set action to "unknown" and provide suggestions.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Parse this command: "${input}"` },
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(responseText) as ParsedCommand;
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        action: "unknown",
        parameters: {},
        confidence: 0,
        error: "Failed to parse command",
      });
    }
  } catch (error) {
    console.error("Command parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse command" },
      { status: 500 }
    );
  }
}
