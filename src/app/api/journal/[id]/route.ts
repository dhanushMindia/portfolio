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

  const where: any = { OR: [{ id }, { weekNumber: parseInt(id) || -1 }] };

  if (!isAuthenticated) {
    where.status = "PUBLISHED";
    where.visibility = "PUBLIC";
  }

  const journalEntry = await prisma.journalEntry.findFirst({
    where,
    include: {
      projects: {
        include: {
          project: {
            select: {
              id: true,
              title: true,
              slug: true,
              shortDescription: true,
            },
          },
        },
      },
      skills: { include: { skill: true } },
      attachments: true,
    },
  });

  if (!journalEntry) {
    return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
  }

  return NextResponse.json({ journalEntry });
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
      focus,
      workCompleted,
      outcomes,
      reflection,
      challenges,
      nextWeekFocus,
      status,
      visibility,
      projectIds,
      skillIds,
      attachments,
    } = body;

    const updateData: any = {
      title,
      focus,
      workCompleted,
      outcomes,
      reflection,
      challenges,
      nextWeekFocus,
      status,
      visibility,
    };

    if (status === "PUBLISHED" && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (projectIds !== undefined) {
      await prisma.journalEntryProject.deleteMany({ where: { journalEntryId: id } });
      updateData.projects = {
        create: projectIds.map((projectId: string) => ({
          project: { connect: { id: projectId } },
        })),
      };
    }

    if (skillIds !== undefined) {
      await prisma.journalEntrySkill.deleteMany({ where: { journalEntryId: id } });
      updateData.skills = {
        create: skillIds.map((skillId: string) => ({
          skill: { connect: { id: skillId } },
        })),
      };
    }

    if (attachments !== undefined) {
      await prisma.attachment.deleteMany({ where: { journalEntryId: id } });
      updateData.attachments = {
        create: attachments.map((a: any) => ({
          title: a.title,
          url: a.url,
          fileType: a.fileType,
          size: a.size || 0,
        })),
      };
    }

    const journalEntry = await prisma.journalEntry.update({
      where: { id },
      data: updateData,
      include: {
        projects: { include: { project: true } },
        skills: { include: { skill: true } },
        attachments: true,
      },
    });

    return NextResponse.json({ journalEntry });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update journal entry" },
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
    await prisma.journalEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
