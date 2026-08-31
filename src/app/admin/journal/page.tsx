export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminJournalPage() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { startDate: "desc" },
    include: {
      projects: {
        include: { project: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-main)] mb-2">
            Weekly Journal
          </h1>
          <p className="text-[var(--text-muted)]">
            {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Week
        </Link>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">
            No journal entries yet
          </p>
          <Link
            href="/admin/journal/new"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Log your first week →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/admin/journal/${entry.id}`}
              className="block bg-[var(--bg-primary)] border border-structural rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium font-mono text-[var(--text-main)] mb-2">
                    {entry.title || `Week ${entry.weekNumber}`}{" "}
                    ({new Date(entry.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    —{" "}
                    {new Date(entry.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })})
                  </h3>
                  {entry.focus && (
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                      {entry.focus}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <StatusBadge status={entry.status} />
                  <VisibilityBadge visibility={entry.visibility} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                {entry.projects.length > 0 && (
                  <span>
                    {entry.projects.length} project
                    {entry.projects.length !== 1 ? "s" : ""}
                  </span>
                )}
                <span>
                  Updated{" "}
                  {new Date(entry.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
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
    ARCHIVED: "bg-[var(--bg-secondary)] text-[var(--text-muted)]",
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
