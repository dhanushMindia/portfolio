export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function WritingPage() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      topics: {
        include: { topic: true },
      },
    },
  });

  const [feature, ...secondaryArticles] = articles;

  return (
    <div className="pt-8 md:pt-16 mx-auto w-full max-w-[1400px] px-6 lg:px-12 mb-24">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-structural pb-10">
        <ScrollReveal animation="fade-up" className="lg:col-span-6 space-y-4">
          <p className="type-metadata text-[var(--text-muted)]">Editorial Archive</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance">
            Monographs & Essays
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-6 lg:pt-8 self-end">
          <p className="type-body text-[var(--text-muted)] text-xl leading-relaxed max-w-xl lg:ml-auto">
            Long-form writing, policy analysis, and methodological reflections on public systems and data architecture.
          </p>
        </ScrollReveal>
      </header>

      {feature ? (
        <div className="space-y-16 mt-16">
          <ScrollReveal animation="fade-up">
            <Link
              href={`/writing/${feature.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-px bg-[var(--border-subtle)] border border-structural hover:border-structural-strong transition-colors"
            >
              <div className="lg:col-span-8 bg-[var(--bg-primary)] p-8 md:p-12 min-h-[380px] flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="type-metadata px-2.5 py-1 bg-[var(--bg-secondary)] border border-structural">
                      Feature Essay
                    </span>
                    {feature.publishedAt && (
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {new Date(feature.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors text-balance md:max-w-2xl">
                    {feature.title}
                  </h2>
                  {feature.subtitle && (
                    <p className="type-body text-[var(--text-muted)] max-w-2xl mt-4">
                      {feature.subtitle}
                    </p>
                  )}
                </div>
                <span className="type-metadata text-[var(--accent)] mt-12 inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Read monograph <span aria-hidden="true">&rarr;</span>
                </span>
              </div>

              <aside className="lg:col-span-4 bg-[var(--bg-secondary)]/30 p-8 flex flex-col justify-between gap-10">
                <div className="space-y-5">
                  <p className="type-metadata text-[var(--text-faint)]">Subject Index</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.topics.map((t) => (
                      <span key={t.topicId} className="type-metadata border border-structural bg-[var(--bg-primary)] px-2 py-1 leading-none flex items-center">
                        {t.topic.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-structural pt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="type-metadata text-[var(--text-faint)] mb-1">Format</p>
                    <p className="type-ui text-[var(--text-main)]">Analysis note</p>
                  </div>
                  <div>
                    <p className="type-metadata text-[var(--text-faint)] mb-1">Status</p>
                    <p className="type-ui text-[var(--text-main)]">Published</p>
                  </div>
                </div>
              </aside>
            </Link>
          </ScrollReveal>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3">
              <p className="type-metadata text-[var(--text-muted)] sticky top-28">Essay Index</p>
            </div>
            <div className="lg:col-span-9 divide-y divide-structural border-y border-structural">
              {secondaryArticles.length > 0 ? (
                secondaryArticles.map((article, idx) => (
                  <ScrollReveal key={article.id} animation="fade-up" delay={idx * 50}>
                    <Link
                      href={`/writing/${article.slug}`}
                      className="group py-8 grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-6 hover:bg-[var(--bg-secondary)]/25 transition-colors"
                    >
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })
                          : "Archive"}
                      </span>
                      <span>
                        <span className="type-heading-2 block group-hover:text-[var(--accent)] transition-colors">
                          {article.title}
                        </span>
                        {article.subtitle && (
                          <span className="type-ui text-[var(--text-muted)] block mt-2">
                            {article.subtitle}
                          </span>
                        )}
                      </span>
                      <span className="type-metadata text-[var(--text-faint)] group-hover:text-[var(--text-main)]">
                        -&gt;
                      </span>
                    </Link>
                  </ScrollReveal>
                ))
              ) : (
                <div className="py-10">
                  <p className="type-ui text-[var(--text-muted)]">
                    Additional essays will collect here as the research record expands.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="border border-dashed border-structural p-12 text-center mt-16">
          <p className="type-body text-[var(--text-muted)] italic">
            No public monographs available in the archive.
          </p>
        </div>
      )}
    </div>
  );
}
