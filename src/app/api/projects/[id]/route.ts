import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const { id } = await params;

  const where: any = { OR: [{ id }, { slug: id }] };

  if (!isAuthenticated) {
    where.status = "PUBLISHED";
    where.visibility = "PUBLIC";
  }

  const project = await prisma.project.findFirst({
    where,
    include: {
      topics: { include: { topic: true } },
      skills: { include: { skill: true } },
      tags: { include: { tag: true } },
      journalEntries: {
        include: {
          journalEntry: {
            select: {
              id: true,
              weekNumber: true,
              title: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      shortDescription,
      status,
      progressStatus,
      visibility,
      featured,
      featuredOrder,
      projectType,
      organization,
      role,
      startDate,
      endDate,
      coverImageUrl,
      blocks,
      topicIds,
      skillIds,
      tagIds,
    } = body;

    // Update project with optional relation updates
    const updateData: any = {
      title,
      slug,
      subtitle,
      shortDescription,
      status,
      progressStatus,
      visibility,
      featured,
      featuredOrder,
      projectType,
      organization,
      role,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      coverImageUrl,
      blocks,
    };

    if (status === "PUBLISHED" && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // Handle relation updates if provided
    if (topicIds !== undefined) {
      await prisma.projectTopic.deleteMany({ where: { projectId: id } });
      updateData.topics = {
        create: topicIds.map((topicId: string) => ({
          topic: { connect: { id: topicId } },
        })),
      };
    }

    if (skillIds !== undefined) {
      await prisma.projectSkill.deleteMany({ where: { projectId: id } });
      updateData.skills = {
        create: skillIds.map((skillId: string) => ({
          skill: { connect: { id: skillId } },
        })),
      };
    }

    if (tagIds !== undefined) {
      await prisma.projectTag.deleteMany({ where: { projectId: id } });
      updateData.tags = {
        create: tagIds.map((tagId: string) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        topics: { include: { topic: true } },
        skills: { include: { skill: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
