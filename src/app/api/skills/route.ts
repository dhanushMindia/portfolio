import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const skills = await prisma.skill.findMany({
    include: {
      _count: {
        select: {
          projects: true,
          journalEntries: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({ skills });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, category } = body;

    const skill = await prisma.skill.create({
      data: {
        name,
        slug,
        category,
      },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create skill" },
      { status: 500 }
    );
  }
}
