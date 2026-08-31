import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "topics") {
      const topics = await prisma.topic.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      });
      return NextResponse.json({ topics });
    }

    if (type === "skills") {
      const skills = await prisma.skill.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, category: true },
      });
      return NextResponse.json({ skills });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch taxonomy" },
      { status: 500 }
    );
  }
}
