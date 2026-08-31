import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const topics = await prisma.topic.findMany({
    include: {
      _count: {
        select: {
          projects: true,
          articles: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({ topics });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description } = body;

    const topic = await prisma.topic.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create topic" },
      { status: 500 }
    );
  }
}
