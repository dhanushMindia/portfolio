import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentNotesUser } from "@/lib/notes/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentNotesUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: { userId: user.userId },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
        notes: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            icon: true,
            isFavorite: true,
            isArchived: true,
            coverImage: true,
            order: true,
            createdAt: true,
            updatedAt: true,
            lastEditedAt: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentNotesUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, color, parentId, order } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        icon: icon || null,
        color: color || null,
        parentId: parentId || null,
        order: order ?? 0,
        userId: user.userId,
      },
      include: {
        children: true,
        notes: true,
      },
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
