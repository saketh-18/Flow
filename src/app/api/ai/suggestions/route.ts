import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { title, description, teamId, historicalContext } =
      await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Build the prompt for AI suggestions
    const systemPrompt = `You are an AI assistant for a project management tool similar to Linear. 
Your task is to analyze issue titles and descriptions to suggest appropriate metadata.

Based on the issue content, suggest:
1. Priority level (urgent, high, medium, low, none)
2. Issue type inference (bug, feature, task, improvement)
3. Potential labels/tags
4. Time estimate if applicable

Respond in JSON format only with these fields:
{
  "suggestedPriority": "medium",
  "issueType": "feature",
  "suggestedLabels": ["frontend", "ux"],
  "confidence": 0.8,
  "reasoning": "Brief explanation"
}`;

    const userPrompt = `Analyze this issue and provide suggestions:

Title: ${title}
Description: ${description || "No description provided"}

Provide your analysis in JSON format.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "{}";

    try {
      const suggestions = JSON.parse(responseText);
      return NextResponse.json(suggestions);
    } catch {
      return NextResponse.json({
        suggestedPriority: "medium",
        confidence: 0.5,
        error: "Failed to parse AI response",
      });
    }
  } catch (error) {
    console.error("AI suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
