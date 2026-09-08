import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentNotesUser } from "@/lib/notes/jwt";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentNotesUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.userId,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { lastEditedAt: "desc" },
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

    return NextResponse.json({ notes, query });
  } catch (error) {
    console.error("Error searching notes:", error);
    return NextResponse.json(
      { error: "Failed to search notes" },
      { status: 500 }
    );
  }
}
