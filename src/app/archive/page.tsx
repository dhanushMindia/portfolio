export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";

export default async function ArchivePage() {
  const [projects, articles, journals] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      orderBy: { startDate: "desc" },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.journalEntry.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      orderBy: { startDate: "desc" },
    })
  ]);

  const allItems = [
    ...projects.map(p => ({
      id: p.id,
      title: p.title,
      date: p.startDate || p.createdAt,
      type: "Project" as const,
      href: `/work/${p.slug}`,
    })),
    ...articles.map(a => ({
      id: a.id,
      title: a.title,
      date: a.publishedAt || a.createdAt,
      type: "Writing" as const,
      href: `/writing/${a.slug}`,
    })),
    ...journals.map(j => ({
      id: j.id,
      title: j.title || `Week ${j.weekNumber}`,
      date: j.startDate,
      type: "Journal" as const,
      href: `/journal#${j.weekNumber}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-16 pt-12 md:pt-20 px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-structural pb-10">
        <ScrollReveal animation="fade-up" className="lg:col-span-6 space-y-4">
          <p className="type-metadata text-[var(--text-muted)]">Research & Writing Index</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance">
            Archive
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-6 lg:pt-8 self-end">
          <p className="type-body text-[var(--text-muted)] text-xl leading-relaxed max-w-xl lg:ml-auto">
            Chronological log of all public records across projects, essays, and CSPR field logs.
          </p>
        </ScrollReveal>
      </header>

      <ScrollReveal animation="fade-up" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-structural">
          {[
            ["Projects", projects.length],
            ["Writing", articles.length],
            ["Journal", journals.length],
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-primary)] p-6 md:p-8 py-8 md:py-10">
              <p className="type-metadata text-[var(--text-faint)]">{label}</p>
              <p className="font-serif text-4xl text-[var(--text-main)] mt-4">{value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={260}>
        <div className="overflow-x-auto border-y border-structural">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-structural">
                <th className="py-4 type-metadata text-[var(--text-faint)] font-normal text-left">Date</th>
                <th className="py-4 type-metadata text-[var(--text-faint)] font-normal text-left">Classification</th>
                <th className="py-4 type-metadata text-[var(--text-faint)] font-normal text-left w-full">Title</th>
                <th className="py-4 type-metadata text-[var(--text-faint)] font-normal text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-structural">
              {allItems.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="group hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="py-4 font-mono text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {new Date(item.date).getFullYear()} — {String(new Date(item.date).getMonth() + 1).padStart(2, '0')}
                  </td>
                  <td className="py-4 pl-4 pr-8">
                    <span className="inline-flex type-metadata text-[9px] px-1.5 py-0.5 border border-structural text-[var(--text-muted)] group-hover:border-[var(--text-faint)] transition-colors">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 text-base font-serif text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors pr-6">
                    <Link href={item.href} className="block w-full">
                      {item.title}
                    </Link>
                  </td>
                  <td className="py-4 text-right pr-2">
                     <Link href={item.href} className="inline-flex text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                       </svg>
                     </Link>
                  </td>
                </tr>
              ))}
              {allItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <p className="type-body text-[var(--text-muted)] italic text-sm">
                      No records found in the archive.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
}
