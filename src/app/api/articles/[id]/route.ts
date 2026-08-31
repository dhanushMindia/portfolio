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

  const article = await prisma.article.findFirst({
    where,
    include: {
      topics: { include: { topic: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
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
      coverImageUrl,
      content,
      status,
      visibility,
      readingTime,
      topicIds,
      tagIds,
    } = body;

    const updateData: any = {
      title,
      slug,
      subtitle,
      coverImageUrl,
      content,
      status,
      visibility,
      readingTime,
    };

    if (status === "PUBLISHED" && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (topicIds !== undefined) {
      await prisma.articleTopic.deleteMany({ where: { articleId: id } });
      updateData.topics = {
        create: topicIds.map((topicId: string) => ({
          topic: { connect: { id: topicId } },
        })),
      };
    }

    if (tagIds !== undefined) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });
      updateData.tags = {
        create: tagIds.map((tagId: string) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        topics: { include: { topic: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ article });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update article" },
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
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}
