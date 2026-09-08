import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentNotesUser } from "@/lib/notes/jwt";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentNotesUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentNotesUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingNote = await prisma.note.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existingNote.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const updateData: any = {
      lastEditedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (icon !== undefined) updateData.icon = icon;
    if (content !== undefined) updateData.content = content;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (isArchived !== undefined) updateData.isArchived = isArchived;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (order !== undefined) updateData.order = order;

    const note = await prisma.note.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentNotesUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingNote = await prisma.note.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existingNote.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
