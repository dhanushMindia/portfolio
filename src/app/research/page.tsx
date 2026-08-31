export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ResearchExplorer } from "@/components/research/ResearchExplorer";

export default async function ResearchPage() {
  const topics = await prisma.topic.findMany({
    include: {
      projects: {
        where: { project: { status: "PUBLISHED", visibility: "PUBLIC" } },
        include: { project: true },
      },
      articles: {
        where: { article: { status: "PUBLISHED", visibility: "PUBLIC" } },
        include: { article: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const activeTopics = topics.filter((t) => t.projects.length > 0 || t.articles.length > 0);
  const leadTopic = activeTopics.length > 0 ? activeTopics[0] : null;
  const recordCount = activeTopics.reduce((sum, topic) => sum + topic.projects.length + topic.articles.length, 0);

  const formattedTopics = activeTopics.map(topic => {
    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      projects: topic.projects,
      articles: topic.articles,
      records: [
        ...topic.projects.map(({ project }) => ({
          id: project.id,
          label: "Project" as const,
          title: project.title,
          description: project.shortDescription,
          href: `/work/${project.slug}`,
        })),
        ...topic.articles.map(({ article }) => ({
          id: article.id,
          label: "Essay" as const,
          title: article.title,
          description: article.subtitle,
          href: `/writing/${article.slug}`,
        })),
      ]
    };
  });

  return (
    <div className="pt-12 md:pt-20 px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1600px] pb-32">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-structural pb-10">
        <ScrollReveal animation="fade-up" className="lg:col-span-6 space-y-4">
          <p className="type-metadata text-[var(--text-muted)]">Research Areas</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance">
            Domains & Themes
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-6 lg:pt-8 self-end">
          <p className="type-body text-[var(--text-muted)] text-xl leading-relaxed max-w-xl lg:ml-auto">
            A structured breakdown of focus areas connecting independent projects, published essays, and field analysis.
          </p>
        </ScrollReveal>
      </header>

      {activeTopics.length === 0 ? (
        <div className="py-24 text-center border border-structural border-dashed mt-16">
          <p className="type-body text-[var(--text-muted)] italic">
            No public research domains currently indexed.
          </p>
        </div>
      ) : (
        <div className="space-y-24 mt-16">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[var(--border-subtle)] border border-structural">
            <div className="lg:col-span-7 bg-[var(--bg-primary)] p-8 md:p-12 lg:p-16 space-y-8 flex flex-col justify-between">
              <p className="type-metadata text-[var(--accent)]">Featured area</p>
              <div>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-main)] leading-tight text-balance">
                  {leadTopic?.name.toUpperCase()}
                </h2>
                <p className="type-body text-[var(--text-muted)] mt-6 max-w-3xl leading-relaxed">
                  {leadTopic?.description || "Ongoing thematic exploration incorporating cross-disciplinary methods."}
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[var(--border-subtle)] grid grid-cols-2 gap-px">
              {[
                ["Total Areas", activeTopics.length],
                ["Linked records", recordCount],
                ["Projects", activeTopics.reduce((sum, topic) => sum + topic.projects.length, 0)],
                ["Essays", activeTopics.reduce((sum, topic) => sum + topic.articles.length, 0)],
              ].map(([label, value]) => (
                <div key={label} className="bg-[var(--bg-primary)] p-6 md:p-8 flex flex-col justify-center">
                  <p className="type-metadata text-[var(--text-muted)]">{label}</p>
                  <p className="font-serif text-4xl md:text-5xl text-[var(--text-main)] mt-4">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <ResearchExplorer topics={formattedTopics} />
        </div>
      )}
    </div>
  );
}
