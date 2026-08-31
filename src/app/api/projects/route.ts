import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = await auth();
  const isAuthenticated = !!session?.user;

  const featured = searchParams.get("featured") === "true";
  const topic = searchParams.get("topic");
  const search = searchParams.get("search");

  const where: any = {};

  // Public filter: only published + public
  if (!isAuthenticated) {
    where.status = "PUBLISHED";
    where.visibility = "PUBLIC";
  }

  if (featured) {
    where.featured = true;
  }

  if (topic) {
    where.topics = {
      some: {
        topic: {
          slug: topic,
        },
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      topics: { include: { topic: true } },
      skills: { include: { skill: true } },
      tags: { include: { tag: true } },
    },
    orderBy: [
      { featured: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      shortDescription,
      projectType,
      organization,
      role,
      startDate,
      endDate,
      coverImageUrl,
      blocks,
      topicIds = [],
      skillIds = [],
      tagIds = [],
    } = body;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        subtitle,
        shortDescription,
        projectType,
        organization,
        role,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        coverImageUrl,
        blocks: blocks || [],
        topics: {
          create: topicIds.map((id: string) => ({
            topic: { connect: { id } },
          })),
        },
        skills: {
          create: skillIds.map((id: string) => ({
            skill: { connect: { id } },
          })),
        },
        tags: {
          create: tagIds.map((id: string) => ({
            tag: { connect: { id } },
          })),
        },
      },
      include: {
        topics: { include: { topic: true } },
        skills: { include: { skill: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
