import { NextRequest, NextResponse } from "next/server";
import { anthropic, AI_MODEL } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let prompt = "";
    let systemPrompt =
      "You are an expert recruitment AI assistant helping with applicant tracking and talent acquisition. Provide concise, professional responses.";

    if (type === "match") {
      const { candidate, job } = data;
      prompt = `Analyze the match between this candidate and job:

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidate.skills}
Experience: ${candidate.experience || "Not specified"}
Education: ${candidate.education || "Not specified"}

JOB:
Title: ${job.title}
Requirements: ${job.requirements || "Not specified"}
Description: ${job.description}
Location: ${job.location}
Salary: ${job.salary || "Not specified"}

Provide a match score from 0-100 and brief reasoning. Format as JSON: {"score": number, "reasoning": "string", "strengths": ["string"], "gaps": ["string"]}`;
    } else if (type === "summarize") {
      const { candidate } = data;
      prompt = `Summarize this candidate's professional profile in 2-3 sentences:

Name: ${candidate.name}
Skills: ${candidate.skills}
Experience: ${candidate.experience || "Not specified"}
Education: ${candidate.education || "Not specified"}
Notes: ${candidate.notes || "None"}

Provide a professional, concise summary suitable for a recruiter.`;
    } else if (type === "describe") {
      const { job } = data;
      prompt = `Improve and enhance this job description to attract top talent:

Title: ${job.title}
Current Description: ${job.description}
Requirements: ${job.requirements || "Not specified"}
Location: ${job.location}
Salary: ${job.salary || "Not specified"}
Type: ${job.type}

Provide an improved, compelling job description that is professional, clear, and attractive to qualified candidates. Keep it concise but complete.`;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response type" },
        { status: 500 }
      );
    }

    let result: unknown = content.text;

    // Try to parse JSON for match type
    if (type === "match") {
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch {
        result = { score: 50, reasoning: content.text, strengths: [], gaps: [] };
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze" },
      { status: 500 }
    );
  }
}
