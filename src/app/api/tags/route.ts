import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          projects: true,
          articles: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ tags });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug } = body;

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create tag" },
      { status: 500 }
    );
  }
}
