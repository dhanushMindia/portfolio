export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { notFound } from "next/navigation";
import { ContentBlock } from "@/types/blocks";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      topics: {
        include: { topic: true },
      },
      skills: {
        include: { skill: true },
      },
    },
  });

  if (!project || project.status !== "PUBLISHED" || project.visibility !== "PUBLIC") {
    notFound();
  }

  // Fetch adjacent project for editorial continuity
  const nextProject = await prisma.project.findFirst({
    where: {
      status: "PUBLISHED",
      visibility: "PUBLIC",
      slug: { not: slug },
    },
    orderBy: { updatedAt: "desc" },
    select: { title: true, slug: true },
  });

  const blocks = (project.blocks as unknown as ContentBlock[]) || [];

  return (
    <div className="space-y-16 pt-8 md:pt-16 pb-24 px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1400px]">
      {/* 1. BREADCRUMB & CONTEXT */}
      <div className="flex items-center justify-between border-b border-structural pb-4">
        <Link
          href="/work"
          className="type-metadata text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors inline-flex items-center gap-2 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Index of Inquiries
        </Link>
        <span className="type-metadata text-[var(--text-faint)]">
          ARCHIVE REF // {project.slug}
        </span>
      </div>

      {/* 2. EDITORIAL MASTHEAD */}
      <header className="space-y-8 max-w-4xl">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="type-metadata px-2.5 py-1 bg-[var(--bg-secondary)] border border-structural">
              Case Study
            </span>
            {project.startDate && (
              <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-widest">
                {new Date(project.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
                {project.endDate ? (
                  <>
                    {" "}—{" "}
                    {new Date(project.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </>
                ) : (
                  " — Present"
                )}
              </span>
            )}
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-[var(--text-main)] mb-6 text-balance">
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="type-body text-xl md:text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>
          )}
        </ScrollReveal>
      </header>

      <ScrollReveal animation="fade-up" delay={100}>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-subtle)] border border-structural mt-12">
          {[
            ["Organization", project.organization || "Independent research"],
            ["Role", project.role || "Researcher"],
            ["Format", project.projectType || "Case study"],
            ["Status", project.progressStatus.charAt(0) + project.progressStatus.slice(1).toLowerCase()],
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-primary)] p-5 md:p-6">
              <p className="type-metadata text-[var(--text-faint)]">{label}</p>
              <p className="type-ui text-[var(--text-main)] mt-3 leading-relaxed">{value}</p>
            </div>
          ))}
        </section>
      </ScrollReveal>

      {/* 3. ASYMMETRICAL BODY: NARRATIVE + RESEARCH METADATA RAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 border-t border-structural items-start">
        {/* Left/Main Column: Content Blocks */}
        <div className="lg:col-span-8 space-y-12">
          {blocks.length > 0 ? (
            <BlockRenderer blocks={blocks} />
          ) : (
            <div className="border border-dashed border-structural p-12 text-center bg-[var(--bg-secondary)]/20">
              <p className="type-body text-[var(--text-muted)] italic">
                Case study documentation is currently compiling for this inquiry node.
              </p>
            </div>
          )}
        </div>

        {/* Right Rail: Research Metadata & Systematic Taxonomy */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
          <div className="border border-structural p-6 md:p-8 bg-[var(--bg-primary)] space-y-6">
            <h3 className="type-metadata font-bold border-b border-structural pb-3 text-[var(--text-main)]">
              PROJECT SCOPE & METHODOLOGY
            </h3>

            <div className="space-y-5 font-mono text-xs">
              <div>
                <p className="text-[var(--text-faint)] uppercase tracking-wider mb-1.5">
                  Primary Classification
                </p>
                <p className="text-[var(--text-main)] font-sans font-medium text-sm">
                  Applied Policy & Econometric Framework
                </p>
              </div>

              {project.topics.length > 0 && (
                <div>
                  <p className="text-[var(--text-faint)] uppercase tracking-wider mb-2">
                    Thematic Taxonomy
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {project.topics.map((t) => (
                      <span
                        key={t.topicId}
                        className="type-metadata px-2.5 py-1 border border-structural bg-[var(--bg-secondary)]/60 text-[var(--text-main)]"
                      >
                        {t.topic.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.skills.length > 0 && (
                <div>
                  <p className="text-[var(--text-faint)] uppercase tracking-wider mb-2">
                    Methodological Tools
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {project.skills.map((s) => (
                      <span
                        key={s.skillId}
                        className="type-metadata px-2.5 py-1 border border-structural bg-[var(--bg-primary)] text-[var(--text-muted)]"
                      >
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-structural">
                <p className="text-[var(--text-faint)] uppercase tracking-wider mb-1.5">
                  Project Status
                </p>
                <div className="flex items-center gap-2 text-[var(--text-main)] font-sans text-xs">
                  <span className={`w-2 h-2 rounded-full ${project.progressStatus === 'COMPLETED' ? 'bg-[var(--text-main)]' : project.progressStatus === 'ONGOING' ? 'bg-[var(--text-muted)] animate-pulse' : 'bg-[var(--border-strong)]'}`} />
                  <span>{project.progressStatus.charAt(0) + project.progressStatus.slice(1).toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER / CONTINUATION */}
      {nextProject && (
        <footer className="border-t border-structural pt-12 pb-16 mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="type-metadata text-[var(--text-faint)] mb-1">Next In Sequence</p>
              <h4 className="type-heading-2 text-[var(--text-main)]">
                {nextProject.title}
              </h4>
            </div>
            <Link
              href={`/work/${nextProject.slug}`}
              className="type-metadata border border-structural hover:border-structural-strong bg-[var(--bg-primary)] px-6 py-3 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
            >
              Continue Reading →
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
}
