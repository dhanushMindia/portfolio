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

    const notes = await prisma.note.findMany({
      where: { userId: user.userId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        icon: true,
        folderId: true,
        isFavorite: true,
        isArchived: true,
        coverImage: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        lastEditedAt: true,
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
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
    const {
      title,
      icon,
      content,
      folderId,
      isFavorite,
      isArchived,
      coverImage,
      order,
    } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        icon: icon || null,
        content: content || [],
        folderId: folderId || null,
        userId: user.userId,
        isFavorite: isFavorite ?? false,
        isArchived: isArchived ?? false,
        coverImage: coverImage || null,
        order: order ?? 0,
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
