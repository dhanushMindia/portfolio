export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      topics: {
        include: { topic: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-50 mb-2">
            Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Articles list */}
      {articles.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No articles yet
          </p>
          <Link
            href="/admin/articles/new"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Write your first article →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-1">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <StatusBadge status={article.status} />
                  <VisibilityBadge visibility={article.visibility} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {article.topics.length > 0 && (
                  <span>
                    {article.topics.map((t) => t.topic.name).join(", ")}
                  </span>
                )}
                <span>
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    DRAFT: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    PUBLISHED: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    ARCHIVED: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${colors[status as keyof typeof colors] || colors.DRAFT}`}
    >
      {status}
    </span>
  );
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const colors = {
    PUBLIC: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    UNLISTED: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    PRIVATE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  const icons = {
    PUBLIC: "🌐",
    UNLISTED: "🔗",
    PRIVATE: "🔒",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${colors[visibility as keyof typeof colors] || colors.PRIVATE}`}
    >
      {icons[visibility as keyof typeof icons]} {visibility}
    </span>
  );
}
