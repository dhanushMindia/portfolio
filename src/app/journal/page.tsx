export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollTimelineProgress } from "@/components/ui/ScrollPhysics";
import { JournalTimelineMarker } from "@/components/ui/JournalTimelineMarker";

// Helper for attachment icons
const getFileIcon = (fileType: string) => {
  switch (fileType?.toUpperCase()) {
    case "PDF":
      return "📄";
    case "SPREADSHEET":
      return "📊";
    case "CODE":
      return "💻";
    case "DOCUMENT":
      return "📝";
    default:
      return "🔗";
  }
};

export default async function JournalPage() {
  const [entries, skills, profile] = await Promise.all([
    prisma.journalEntry.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      orderBy: {
        startDate: "desc",
      },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        attachments: true,
      },
    }),
    prisma.skill.findMany({
      take: 8,
    }),
    prisma.profile.findFirst(),
  ]);

  const entriesByYear = entries.reduce((acc, entry) => {
    const year = new Date(entry.startDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(entry);
    return acc;
  }, {} as Record<number, typeof entries>);

  const years = Object.keys(entriesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const latest = entries[0];
  const earliest = entries[entries.length - 1];
  const linkedProjectCount = new Set(
    entries.flatMap((entry) => entry.projects.map((project) => project.projectId))
  ).size;

  return (
    <div className="pt-8 md:pt-16 mx-auto w-full max-w-[1400px] px-6 lg:px-12 mb-24 space-y-16">
      {/* 1. DASHBOARD / MASTHEAD */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-structural pb-10">
        <ScrollReveal animation="fade-up" className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 border border-structural px-2.5 py-1 bg-[var(--bg-secondary)]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <p className="type-metadata text-[var(--text-muted)]">CSPR Fellowship / State Scan Workspace</p>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance">
            Internship Log & Field Ledger
          </h1>
          <p className="type-body text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl pt-2">
            Weekly continuous record tracking research directives, execution logs, analytical reflections, and deliverables under the guidance of Dr. S Subramanian (Director, CSPR).
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-5 flex flex-col justify-end">
          <div className="border border-structural p-6 bg-[var(--bg-secondary)]/20 space-y-4">
            <h3 className="type-metadata text-[var(--text-main)] font-semibold border-b border-structural pb-2">
              CORE DIRECTIVES & MANDATE
            </h3>
            <p className="type-ui text-sm text-[var(--text-muted)] leading-relaxed">
              <strong>State Scan – Telangana:</strong> Systematic tracking of state public finances, liability ratios, macroeconomic indicators, and district-level economic data for transparent reporting.
            </p>
            <div className="pt-2">
              <span className="type-metadata text-[var(--text-faint)] block mb-2">RUNNING SKILLS INVENTORY</span>
              <div className="flex flex-wrap gap-1.5">
                {["Public Finance", "Data Visualization", "Telangana State Scan", "R & Python", "Fiscal Modeling"].map((s) => (
                  <span key={s} className="type-metadata text-[10px] px-2 py-0.5 border border-structural bg-[var(--bg-primary)] text-[var(--text-muted)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* OVERVIEW STATS */}
      <ScrollReveal animation="fade-up">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-structural">
          {[
            ["Timeline Span", earliest && latest ? `${formatMonth(earliest.startDate)} - ${formatMonth(latest.startDate)}` : "Compiling"],
            ["Total Logs Filed", String(entries.length)],
            ["Associated Projects", String(linkedProjectCount)],
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-primary)] p-6 md:p-8">
              <p className="type-metadata text-[var(--text-faint)]">{label}</p>
              <p className="font-serif text-3xl md:text-4xl text-[var(--text-main)] mt-3">{value}</p>
            </div>
          ))}
        </section>
      </ScrollReveal>

      {/* 2 & 3. PROJECT LOG & WEEKLY REFLECTIONS */}
      {entries.length === 0 ? (
        <div className="border border-dashed border-structural p-12 text-center">
          <p className="type-body text-[var(--text-muted)] italic">
            No public internship records available in the archive.
          </p>
        </div>
      ) : (
        <div className="space-y-24">
          {years.map((year, yearIdx) => (
            <section key={year} className="relative">
              <ScrollReveal animation="fade-up" delay={yearIdx * 50}>
                <div className="sticky top-20 bg-[var(--bg-primary)] z-10 py-4 border-y border-structural mb-12 flex items-baseline justify-between">
                  <h2 className="type-display text-3xl text-[var(--text-muted)]">{year} Weekly Ledger</h2>
                  <span className="type-metadata text-[var(--text-faint)]">
                    {entriesByYear[year].length} Filed {entriesByYear[year].length !== 1 ? "Reports" : "Report"}
                  </span>
                </div>
              </ScrollReveal>

              <ScrollTimelineProgress className="ml-3 md:ml-8 pl-8 md:pl-12 space-y-24">
                {entriesByYear[year].map((entry) => (
                  <ScrollReveal key={entry.id} animation="fade-up" delay={80}>
                    <article id={String(entry.weekNumber)} className="relative group space-y-8">
                      <JournalTimelineMarker />

                      {/* Header row */}
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-structural pb-4 gap-4">
                        <div className="flex items-center gap-3">
                          <span className="type-metadata text-sm font-bold bg-[var(--bg-secondary)] border border-structural px-2.5 py-1 text-[var(--text-main)]">
                            WEEK {String(entry.weekNumber).padStart(2, '0')}
                          </span>
                          <h3 className="type-heading-2 text-[var(--text-main)] text-xl md:text-2xl">
                            {entry.title || "Weekly Research & Execution Log"}
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-[var(--text-muted)]">
                          {formatDate(entry.startDate)} — {formatDate(entry.endDate)}
                        </span>
                      </div>

                      {/* 2-Column Content Grid: Project Log + Weekly Reflection */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Project Log (Context -> Action -> Impact) */}
                        <div className="lg:col-span-7 space-y-6">
                          <div className="border border-structural p-6 bg-[var(--bg-primary)] space-y-5">
                            <h4 className="type-metadata text-[var(--text-main)] font-semibold border-b border-structural pb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                              PROJECT LOG & EXECUTION
                            </h4>

                            {entry.focus && (
                              <div>
                                <p className="type-metadata text-[var(--text-faint)] text-[10px] uppercase">1. Context & Objectives</p>
                                <p className="type-ui text-sm text-[var(--text-main)] mt-1 leading-relaxed">
                                  {entry.focus}
                                </p>
                              </div>
                            )}

                            {entry.workCompleted && (
                              <div>
                                <p className="type-metadata text-[var(--text-faint)] text-[10px] uppercase">2. Action Taken & Methodology</p>
                                <p className="type-ui text-sm text-[var(--text-muted)] mt-1 whitespace-pre-wrap leading-relaxed">
                                  {entry.workCompleted}
                                </p>
                              </div>
                            )}

                            {entry.outcomes && (
                              <div>
                                <p className="type-metadata text-[var(--text-faint)] text-[10px] uppercase">3. Impact & Outcomes</p>
                                <p className="type-ui text-sm text-[var(--text-main)] mt-1 leading-relaxed">
                                  {entry.outcomes}
                                </p>
                              </div>
                            )}

                            {entry.projects.length > 0 && (
                              <div className="pt-3 border-t border-structural flex flex-wrap items-center gap-2">
                                <span className="type-metadata text-[var(--text-faint)] text-[10px]">Linked Work:</span>
                                {entry.projects.map((p) => (
                                  <Link
                                    key={p.projectId}
                                    href={`/work/${p.project.slug}`}
                                    className="type-metadata text-[10px] border border-structural hover:border-[var(--text-main)] bg-[var(--bg-secondary)]/50 px-2 py-0.5 transition-colors"
                                  >
                                    {p.project.title} ↗
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* REPOSITORY & ATTACHMENTS */}
                          {entry.attachments && entry.attachments.length > 0 && (
                            <div className="border border-structural p-5 bg-[var(--bg-primary)] space-y-4">
                              <h4 className="type-metadata text-[var(--text-main)] font-semibold border-b border-structural pb-2 flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                REPOSITORY & ARTIFACTS
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {entry.attachments.map((attachment: any) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 border border-structural bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] transition-colors group"
                                  >
                                    <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">
                                      {getFileIcon(attachment.fileType)}
                                    </span>
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="type-ui text-sm text-[var(--text-main)] truncate font-medium">
                                        {attachment.title}
                                      </span>
                                      <span className="type-metadata text-[10px] text-[var(--text-muted)] mt-0.5">
                                        {attachment.fileType} {attachment.size > 0 && `• ${(attachment.size / 1024).toFixed(1)} KB`}
                                      </span>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: Weekly Reflection & Learning Ledger */}
                        <div className="lg:col-span-5 space-y-6">
                          <div className="border border-structural p-6 bg-[var(--bg-secondary)]/15 space-y-5">
                            <h4 className="type-metadata text-[var(--text-main)] font-semibold border-b border-structural pb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sand-500" />
                              WEEKLY REFLECTION LEDGER
                            </h4>

                            {entry.reflection && (
                              <div>
                                <p className="type-metadata text-emerald-600 dark:text-emerald-400 text-[10px] uppercase">✓ Wins & Milestones</p>
                                <p className="type-ui text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                                  {entry.reflection}
                                </p>
                              </div>
                            )}

                            {entry.challenges && (
                              <div>
                                <p className="type-metadata text-amber-600 dark:text-amber-400 text-[10px] uppercase">! Roadblocks & Challenges</p>
                                <p className="type-ui text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                                  {entry.challenges}
                                </p>
                              </div>
                            )}

                            {entry.nextWeekFocus && (
                              <div>
                                <p className="type-metadata text-[var(--accent)] text-[10px] uppercase">→ Key Learnings & Next Steps</p>
                                <p className="type-ui text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                                  {entry.nextWeekFocus}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </ScrollTimelineProgress>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonth(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
