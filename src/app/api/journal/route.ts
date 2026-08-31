import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = await auth();
  const isAuthenticated = !!session?.user;

  const where: any = {};

  if (!isAuthenticated) {
    where.status = "PUBLISHED";
    where.visibility = "PUBLIC";
  }

  const journalEntries = await prisma.journalEntry.findMany({
    where,
    include: {
      projects: {
        include: {
          project: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
      skills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      weekNumber: "desc",
    },
  });

  return NextResponse.json({ journalEntries });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      weekNumber,
      startDate,
      endDate,
      title,
      focus,
      workCompleted,
      outcomes,
      reflection,
      challenges,
      nextWeekFocus,
      projectIds = [],
      skillIds = [],
      attachments = [],
    } = body;

    const journalEntry = await prisma.journalEntry.create({
      data: {
        weekNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        title,
        focus,
        workCompleted,
        outcomes,
        reflection,
        challenges,
        nextWeekFocus,
        projects: {
          create: projectIds.map((id: string) => ({
            project: { connect: { id } },
          })),
        },
        skills: {
          create: skillIds.map((id: string) => ({
            skill: { connect: { id } },
          })),
        },
        attachments: {
          create: attachments.map((a: any) => ({
            title: a.title,
            url: a.url,
            fileType: a.fileType,
            size: a.size || 0,
          })),
        }
      },
      include: {
        projects: { include: { project: true } },
        skills: { include: { skill: true } },
        attachments: true,
      },
    });

    return NextResponse.json({ journalEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
