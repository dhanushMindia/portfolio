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

    const folder = await prisma.folder.findUnique({
      where: { id },
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
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (folder.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json(
      { error: "Failed to fetch folder" },
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

    const existingFolder = await prisma.folder.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (existingFolder.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, icon, color, parentId, order } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (order !== undefined) updateData.order = order;

    const folder = await prisma.folder.update({
      where: { id },
      data: updateData,
      include: {
        children: true,
        notes: true,
      },
    });

    return NextResponse.json({ folder });
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { error: "Failed to update folder" },
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

    const existingFolder = await prisma.folder.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (existingFolder.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.folder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
