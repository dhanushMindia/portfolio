import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProjectStatus, Visibility } from "@prisma/client";

/**
 * Search across projects, articles, and journal entries.
 * Public: only published + public content.
 * Authenticated: all content.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = query.trim();

  // Build visibility filter
  const visibilityFilter: any = isAuthenticated
    ? {}
    : { status: ProjectStatus.PUBLISHED, visibility: Visibility.PUBLIC };

  try {
    // Search projects
    const projects = await prisma.project.findMany({
      where: {
        ...visibilityFilter,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { shortDescription: { contains: searchTerm, mode: "insensitive" } },
          { subtitle: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      include: {
        topics: {
          include: { topic: true },
        },
      },
    });

    // Search articles
    const articles = await prisma.article.findMany({
      where: {
        ...visibilityFilter,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { subtitle: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      include: {
        topics: {
          include: { topic: true },
        },
      },
    });

    // Search journal entries
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        ...visibilityFilter,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { focus: { contains: searchTerm, mode: "insensitive" } },
          { workCompleted: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    // Format results
    const results = [
      ...projects.map((p) => ({
        type: "project",
        id: p.id,
        title: p.title,
        description: p.shortDescription || p.subtitle,
        href: `/work/${p.slug}`,
        topics: p.topics.map((t) => t.topic.name),
      })),
      ...articles.map((a) => ({
        type: "article",
        id: a.id,
        title: a.title,
        description: a.subtitle,
        href: `/writing/${a.slug}`,
        topics: a.topics.map((t) => t.topic.name),
      })),
      ...journalEntries.map((j) => ({
        type: "journal",
        id: j.id,
        title: j.title || `Week ${j.weekNumber}`,
        description: j.focus || j.workCompleted,
        href: `/journal#${j.weekNumber}`,
        topics: [],
      })),
    ];

    return NextResponse.json({ results, query: searchTerm });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
