import { NextRequest, NextResponse } from "next/server";
import { anthropic, AI_MODEL } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "No CV text provided" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system:
        "You are an expert HR assistant. Extract structured information from CVs and return it as valid JSON. Be concise and accurate.",
      messages: [
        {
          role: "user",
          content: `Extract the following from this CV and return ONLY a JSON object with these fields:
- name: string
- email: string
- phone: string (or null)
- skills: string[] (top 8-10 skills as individual items)
- experience: string (total years + most recent role, e.g. "5 years · Senior Dev at Acme")
- education: string (highest qualification)
- summary: string (2-3 sentence professional summary)

CV TEXT:
${text.slice(0, 4000)}

Return only the JSON object, no markdown or explanation.`,
        },
      ],
    });

    const raw = message.content[0];
    if (raw.type !== "text") {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
    }

    try {
      const jsonMatch = raw.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        summary: raw.text,
        skills: [],
        name: "Unknown",
        email: "",
        phone: null,
        experience: "",
        education: "",
      });
    }
  } catch (error) {
    console.error("parse-cv error:", error);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
