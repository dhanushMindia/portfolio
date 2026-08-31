export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTopicsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { projects: true, articles: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-main)] mb-2">
            Topics
          </h1>
          <p className="text-[var(--text-muted)]">
            {topics.length} topic{topics.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/topics/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Topic
        </Link>
      </div>

      {topics.length === 0 ? (
        <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">
            No topics yet
          </p>
          <Link
            href="/admin/topics/new"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Create your first topic →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/admin/topics/${topic.id}`}
              className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-[var(--text-main)] mb-2">
                {topic.name}
              </h3>
              {topic.description && (
                <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">
                  {topic.description}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span>{topic._count.projects} projects</span>
                <span>{topic._count.articles} articles</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
