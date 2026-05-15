import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { title, message, type } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: "title and message are required" }, { status: 400 });
    }

    // Send to every recruiter in the system
    const recruiters = await prisma.user.findMany({
      where: { role: "recruiter" },
      select: { id: true },
    });

    if (recruiters.length === 0) {
      return NextResponse.json({ error: "No recruiter found" }, { status: 404 });
    }

    const notifications = await prisma.notification.createMany({
      data: recruiters.map((r) => ({
        title,
        message,
        type: type ?? "info",
        userId: r.id,
      })),
    });

    return NextResponse.json({ ok: true, created: notifications.count });
  } catch (err) {
    console.error("[notifications] error:", err);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
