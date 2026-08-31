export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FiscalScatterPlot, DistributionCurve } from "@/components/ui/DataGraphics";
import { ScrollParallax, ScrollScale, ScrollTypography } from "@/components/ui/ScrollPhysics";

export default async function HomePage() {
  const [featuredProjects, recentArticles, recentJournals, topics, profile] = await Promise.all([
    prisma.project.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
      include: {
        topics: {
          include: { topic: true },
        },
        skills: {
          include: { skill: true },
        },
      },
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 3,
      include: {
        topics: {
          include: { topic: true },
        },
      },
    }),
    prisma.journalEntry.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      orderBy: {
        weekNumber: "desc",
      },
      take: 4,
    }),
    prisma.topic.findMany({
      where: {
        OR: [
          { projects: { some: { project: { status: "PUBLISHED", visibility: "PUBLIC" } } } },
          { articles: { some: { article: { status: "PUBLISHED", visibility: "PUBLIC" } } } },
        ],
      },
      include: {
        _count: {
          select: { projects: true, articles: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.profile.findFirst(),
  ]);

  const [leadProject, ...otherProjects] = featuredProjects;
  const latestArticle = recentArticles[0];
  const latestJournal = recentJournals[0];

  return (
    <div className="pt-10 md:pt-16">
      <section className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px] min-h-[calc(100vh-9rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full">
          <div className="lg:col-span-7 self-center space-y-10">
            <ScrollReveal animation="fade-up" delay={40}>
              <div className="inline-flex items-center gap-3 border-y border-structural py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span className="type-metadata text-[var(--text-muted)]">
                  {profile?.tagline || "Public Finance & Quantitative Analysis"}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <div className="space-y-6">
                <h1 className="type-display text-[var(--text-main)] font-serif">
                  {profile?.name || "Dhanush Mendu"}
                </h1>
                <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight text-[var(--text-main)] max-w-4xl text-balance">
                  {profile?.bio
                    ? profile.bio.split('\n')[0]
                    : "Quantitative data analysis, public economics, and state policy research structured as an evidence-based professional record."}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-structural max-w-3xl">
                {[
                  ["Current focus", "Public finances, tracking state liabilities and local economic health."],
                  ["State Scan", "Working with CSPR to analyze and synthesize macro trends in Telangana."],
                  ["Archive state", `${featuredProjects.length} projects / ${recentArticles.length} essays / ${recentJournals.length} logs`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[var(--bg-primary)] p-5">
                    <p className="type-metadata text-[var(--text-faint)] mb-3">{label}</p>
                    <p className="type-ui text-sm leading-relaxed text-[var(--text-main)]">{value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade-left" delay={180} className="lg:col-span-5">
            <ScrollParallax speed={0.88}>
              <ScrollScale>
                <div className="relative min-h-[440px] border border-structural bg-[var(--bg-secondary)]/25 overflow-hidden">
                  <FiscalScatterPlot />
                  <div className="absolute inset-x-0 top-0 border-b border-structural bg-[var(--bg-primary)]/80 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
                    <span className="type-metadata text-[var(--text-muted)]">Evidence Instrument</span>
                    <span className="font-mono text-[10px] text-[var(--text-faint)]">LIVE CANVAS</span>
                  </div>
                  <div className="absolute left-6 right-6 bottom-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-structural shadow-2xl">
                    <div className="bg-[var(--bg-primary)]/90 backdrop-blur-md p-5 flex flex-col justify-between">
                      <p className="type-metadata text-[var(--text-faint)]">Lead dossier</p>
                      <p className="font-serif text-2xl lg:text-3xl text-[var(--text-main)] leading-tight mt-6 text-balance">
                        {leadProject?.title || "Research system compiling"}
                      </p>
                    </div>
                    <div className="bg-[var(--bg-primary)]/90 backdrop-blur-md p-5 flex flex-col justify-between">
                      <p className="type-metadata text-[var(--text-faint)]">Latest log</p>
                      <p className="font-mono text-4xl lg:text-5xl text-[var(--text-main)] mt-6">
                        WK {latestJournal?.weekNumber ?? "00"}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollScale>
            </ScrollParallax>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-structural mt-0">
        <div className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-subtle)] border-x border-b border-structural">
            {[
              ["Public inquiries", featuredProjects.length, ""],
              ["Monograph essays", recentArticles.length, ""],
              ["Continuous logs", recentJournals.length, ""],
              ["Indexed domains", topics.length, ""],
            ].map(([label, value, suffix]) => (
              <div key={label} className="bg-[var(--bg-primary)] py-12 px-6 lg:px-10 hover:bg-[var(--bg-secondary)]/30 transition-colors">
                <p className="type-metadata text-[var(--text-muted)]">{label}</p>
                <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-main)] mt-4">
                  <AnimatedCounter to={Number(value)} suffix={String(suffix)} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-28 md:space-y-36 py-24 md:py-32">
        <section className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
              <p className="type-metadata text-[var(--text-muted)]">Current Thinking</p>
              <h2 className="type-heading-1 text-[var(--text-main)]">What the archive is tracking now</h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-structural">
              <Link
                href={leadProject ? `/work/${leadProject.slug}` : "/work"}
                className="group bg-[var(--bg-primary)] p-8 md:p-10 min-h-[320px] flex flex-col justify-between hover:bg-[var(--bg-secondary)]/25 transition-colors"
              >
                <div>
                  <p className="type-metadata text-[var(--accent)] mb-5">Active case study</p>
                  <h3 className="font-serif text-3xl md:text-4xl leading-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                    {leadProject?.title || "No public case study yet"}
                  </h3>
                  {leadProject?.shortDescription && (
                    <p className="type-ui text-[var(--text-muted)] leading-relaxed mt-5">
                      {leadProject.shortDescription}
                    </p>
                  )}
                </div>
                <span className="type-metadata text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                  Open dossier -&gt;
                </span>
              </Link>

              <Link
                href="/journal"
                className="group bg-[var(--bg-primary)] p-8 md:p-10 min-h-[320px] flex flex-col justify-between hover:bg-[var(--bg-secondary)]/25 transition-colors"
              >
                <div>
                  <p className="type-metadata text-[var(--accent)] mb-5">Latest field note</p>
                  <h3 className="font-serif text-3xl md:text-4xl leading-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                    {latestJournal ? `WK ${latestJournal.weekNumber}: ${latestJournal.title}` : "System initializing"}
                  </h3>
                  {latestJournal?.focus && (
                    <p className="type-ui text-[var(--text-muted)] leading-relaxed mt-5">
                      {latestJournal.focus}
                    </p>
                  )}
                </div>
                <span className="type-metadata text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                  Read ledger -&gt;
                </span>
              </Link>
            </div>
          </div>
        </section>

        {leadProject && (
          <section className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
            <ScrollReveal animation="fade-up">
              <Link
                href={`/work/${leadProject.slug}`}
                className="group grid grid-cols-1 xl:grid-cols-12 gap-px bg-[var(--border-subtle)] border border-structural hover:border-structural-strong transition-colors"
              >
                <div className="xl:col-span-7 bg-[var(--bg-primary)] p-8 md:p-12 lg:p-16 space-y-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="type-metadata px-2.5 py-1 bg-[var(--bg-secondary)] border border-structural">
                      Featured inquiry
                    </span>
                    {leadProject.topics.map((t) => (
                      <span key={t.topicId} className="type-metadata text-[var(--text-muted)]">
                        {t.topic.name}
                      </span>
                    ))}
                  </div>
                  <h2 className="type-heading-1 group-hover:text-[var(--accent)] transition-colors">
                    {leadProject.title}
                  </h2>
                  <p className="type-body text-[var(--text-muted)] max-w-3xl">
                    {leadProject.shortDescription}
                  </p>
                </div>
                <div className="lg:col-span-12 xl:col-span-5 min-h-[400px] bg-[var(--bg-secondary)] relative overflow-hidden flex items-end">
                  <DistributionCurve className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>
              </Link>
            </ScrollReveal>
          </section>
        )}

        <section className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5 space-y-6">
              <p className="type-metadata text-[var(--text-muted)]">Research Domains</p>
              <h2 className="type-heading-1 text-[var(--text-main)]">Themes behave like threads, not categories.</h2>
              <Link href="/research" className="type-metadata text-[var(--accent)] hover:text-[var(--text-main)] transition-colors">
                View domain map -&gt;
              </Link>
            </div>
            <div className="lg:col-span-7 divide-y divide-structural border-y border-structural">
              {topics.map((topic, index) => (
                <Link
                  href="/research"
                  key={topic.id}
                  className="group grid grid-cols-[auto_1fr_auto] gap-5 items-center py-6 hover:bg-[var(--bg-secondary)]/25 transition-colors"
                >
                  <span className="font-mono text-xs text-[var(--text-faint)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                    {topic.name}
                  </span>
                  <span className="type-metadata text-[var(--text-muted)]">
                    {topic._count.projects + topic._count.articles} records
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {latestJournal && (
          <section className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
            <div className="border-y border-structural pt-12 pb-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-baseline">
              <div className="md:col-span-4 lg:col-span-3">
                <p className="type-metadata text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-4">Weekly field note</p>
                <p className="font-mono text-5xl text-[var(--text-main)] mt-6 tracking-tight">WK {latestJournal.weekNumber}</p>
              </div>
              <div className="md:col-span-8 lg:col-span-7 space-y-5">
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[var(--text-main)] leading-tight text-balance hover:text-[var(--accent)] transition-colors cursor-pointer">{latestJournal.title}</h2>
                {latestJournal.focus && (
                  <p className="type-body text-xl lg:text-2xl text-[var(--text-muted)] max-w-2xl leading-relaxed">{latestJournal.focus}</p>
                )}
              </div>
              <div className="md:col-span-12 lg:col-span-2 flex lg:justify-end mt-4 lg:mt-0">
                <Link href="/journal" className="type-metadata text-[var(--accent)] hover:text-[var(--text-main)] transition-colors self-start border border-structural px-6 py-3 rounded-none">
                  Timeline -&gt;
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px]">
          <ScrollTypography>
            <div className="border-y border-structural-strong py-14 md:py-20">
              <p className="type-metadata text-[var(--text-muted)] mb-6">Platform Ethos</p>
              <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl text-[var(--text-main)] font-normal leading-tight max-w-5xl text-balance">
                Evidence is not static documentation; it is a continuously evolving dialogue with public data and fiscal realities.
              </blockquote>
            </div>
          </ScrollTypography>
        </section>
      </div>
    </div>
  );
}
