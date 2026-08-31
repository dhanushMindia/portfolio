export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { projects: true, journalEntries: true },
      },
    },
  });

  const categories = Array.from(
    new Set(skills.map((s) => s.category).filter(Boolean))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-main)] mb-2">
            Skills
          </h1>
          <p className="text-[var(--text-muted)]">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} across{" "}
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/admin/skills/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">
            No skills yet
          </p>
          <Link
            href="/admin/skills/new"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Add your first skill →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            return (
              <div key={category}>
                <h2 className="text-sm uppercase tracking-wider text-[var(--text-faint)] dark:text-[var(--text-muted)] mb-3 font-medium">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/admin/skills/${skill.id}`}
                      className="bg-[var(--bg-primary)] border border-structural rounded-lg p-5 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <h3 className="font-medium text-[var(--text-main)] mb-2">
                        {skill.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span>
                          {skill._count.projects} project
                          {skill._count.projects !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {skill._count.journalEntries} journal entr
                          {skill._count.journalEntries !== 1 ? "ies" : "y"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Uncategorized skills */}
          {skills.filter((s) => !s.category).length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-wider text-[var(--text-faint)] dark:text-[var(--text-muted)] mb-3 font-medium">
                Uncategorized
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .filter((s) => !s.category)
                  .map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/admin/skills/${skill.id}`}
                      className="bg-[var(--bg-primary)] border border-structural rounded-lg p-5 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <h3 className="font-medium text-[var(--text-main)] mb-2">
                        {skill.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span>
                          {skill._count.projects} project
                          {skill._count.projects !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {skill._count.journalEntries} journal entr
                          {skill._count.journalEntries !== 1 ? "ies" : "y"}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
