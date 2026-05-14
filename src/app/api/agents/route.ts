import { NextRequest, NextResponse } from "next/server";
import { anthropic, AI_MODEL } from "@/lib/anthropic";

async function runAgent(systemPrompt: string, userPrompt: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const content = msg.content[0];
  return content.type === "text" ? content.text : "";
}

export async function POST(request: NextRequest) {
  try {
    const { cvText, jobDescription } = await request.json();

    if (!cvText?.trim()) {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 });
    }

    const results: Record<string, string> = {};

    // Agent 1: CV Analyst
    results["cv-analyst"] = await runAgent(
      "You are a CV Analyst. Extract and structure key information from CVs concisely.",
      `Analyse this CV and provide a structured summary covering: candidate name, key skills (top 5), total experience, highest education, and career level (junior/mid/senior).\n\nCV:\n${cvText.slice(0, 2000)}`
    );

    // Agent 2: Match Scorer
    results["match-scorer"] = await runAgent(
      "You are a Match Scorer. Score candidate-job fit objectively and briefly.",
      `Based on this CV analysis, score the candidate's fit for the role${jobDescription ? ` described as: "${jobDescription.slice(0, 300)}"` : " (general professional role)"}.\n\nCV Analysis:\n${results["cv-analyst"]}\n\nProvide: match score (0-100), top 3 strengths, top 2 gaps. Be concise.`
    );

    // Agent 3: Interview Planner
    results["interview-planner"] = await runAgent(
      "You are an Interview Planner. Create targeted, insightful interview questions.",
      `Based on this candidate profile and match analysis, create 5 tailored interview questions (mix of technical and behavioural). Keep questions specific to the candidate's background.\n\nProfile:\n${results["cv-analyst"]}\n\nMatch:\n${results["match-scorer"]}`
    );

    // Agent 4: Outreach Agent
    results["outreach-agent"] = await runAgent(
      "You are an Outreach Agent. Write professional, warm, and personalised recruitment messages.",
      `Write a brief outreach message to this candidate inviting them to discuss an opportunity. Make it personalised based on their profile. Keep it under 120 words.\n\nProfile:\n${results["cv-analyst"]}`
    );

    // Agent 5: Similar Finder
    results["similar-finder"] = await runAgent(
      "You are a Similar Candidate Finder. Suggest profile types and search strategies.",
      `Based on this candidate's profile, suggest 3 similar candidate archetypes a recruiter should look for if this candidate doesn't proceed. Include the key skills and experience level to target.\n\nProfile:\n${results["cv-analyst"]}`
    );

    // Agent 6: Report Writer
    results["report-writer"] = await runAgent(
      "You are a Recruitment Report Writer. Produce clear, professional recruitment summaries.",
      `Write a concise recruitment summary report for this candidate covering: profile overview, match assessment, interview recommendation, and next steps. Use the outputs from the pipeline.\n\nCV Analysis:\n${results["cv-analyst"]}\n\nMatch Score:\n${results["match-scorer"]}\n\nInterview Questions:\n${results["interview-planner"]}`
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("agents error:", error);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
