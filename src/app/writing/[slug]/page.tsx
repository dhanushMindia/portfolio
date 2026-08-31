export const revalidate = 60;
import { prisma } from "@/lib/prisma";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { notFound } from "next/navigation";
import { ContentBlock } from "@/types/blocks";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      topics: {
        include: { topic: true },
      },
    },
  });

  if (!article || article.status !== "PUBLISHED" || article.visibility !== "PUBLIC") {
    notFound();
  }

  // Next article
  const nextArticle = await prisma.article.findFirst({
    where: {
      status: "PUBLISHED",
      visibility: "PUBLIC",
      slug: { not: slug },
    },
    orderBy: { publishedAt: "desc" },
    select: { title: true, slug: true },
  });

  const isHtml = typeof article.content === "string";
  const content = isHtml ? article.content : ((article.content as unknown as ContentBlock[]) || []);

  return (
    <article className="pt-12 md:pt-20 px-6 mx-auto w-full max-w-[800px] pb-24">
      {/* 1. READER BREADCRUMB */}
      <div className="mb-12">
        <Link
          href="/writing"
          className="type-metadata text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors inline-flex items-center gap-2 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Return to Index
        </Link>
      </div>

      {/* 2. EDITORIAL READ HEADER */}
      <header className="space-y-8 mb-16 relative">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {article.publishedAt && (
              <span className="font-mono text-sm uppercase tracking-widest text-[var(--text-main)] border-b border-structural pb-1">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {article.topics.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-faint)]">/</span>
                {article.topics.map((t) => (
                  <span
                    key={t.topicId}
                    className="type-metadata text-[var(--text-muted)]"
                  >
                    {t.topic.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance leading-[1.1]">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="type-body text-xl md:text-2xl text-[var(--text-muted)] mt-6 text-balance leading-relaxed">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-structural">
            <div className="w-10 h-10 bg-[var(--bg-secondary)] border border-structural overflow-hidden grayscale">
              {/* Author portrait placeholder */}
              <div className="w-full h-full bg-gradient-to-tr from-structural to-[var(--bg-secondary)]" />
            </div>
            <div className="flex flex-col">
              <span className="type-ui font-serif font-medium text-[var(--text-main)]">Dhanush Mendu</span>
              <span className="type-metadata text-[var(--text-muted)]">Author & Researcher</span>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* 3. NARRATIVE CONTENT */}
      <div className="mt-16">
        {isHtml ? (
          <div
            className="prose-editorial max-w-none type-body"
            dangerouslySetInnerHTML={{ __html: content as string }}
          />
        ) : (
          <BlockRenderer blocks={content as ContentBlock[]} />
        )}
      </div>

      {/* 4. FOOTER */}
      <footer className="mt-24 pt-12 border-t border-structural">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            {/* Kept simple for a clean quantitative layout */}
          </div>

          {nextArticle && (
            <Link
              href={`/writing/${nextArticle.slug}`}
              className="group block text-right border border-structural hover:border-structural-strong bg-[var(--bg-secondary)]/20 p-6 transition-all"
            >
              <p className="type-metadata text-[var(--text-muted)] mb-2">Read Next Sequence</p>
              <h4 className="type-heading-2 text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                {nextArticle.title}
              </h4>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
