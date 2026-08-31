export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WorkGallery } from "@/components/work/WorkGallery";

export default async function WorkPage() {
  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      topics: {
        include: { topic: true },
      },
    },
  });

  const topics = await prisma.topic.findMany({
    where: { projects: { some: {} } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-8 md:pt-16 mx-auto w-full max-w-[1400px] px-6 lg:px-12 mb-24 space-y-16">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-structural pb-10">
        <ScrollReveal animation="fade-up" className="lg:col-span-6 space-y-4">
          <p className="type-metadata text-[var(--text-muted)]">Primary Directory</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance">
            Selected Inquiries
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-6 lg:pt-8 self-end">
          <p className="type-body text-[var(--text-muted)] text-xl leading-relaxed max-w-xl lg:ml-auto">
            A comprehensive index of policy research, fiscal architecture case studies, and applied quantitative methodology.
          </p>
        </ScrollReveal>
      </header>

      <ScrollReveal animation="fade-up" delay={160}>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-structural">
          <div className="bg-[var(--bg-primary)] p-6 md:p-8">
            <p className="type-metadata text-[var(--text-faint)]">Public dossiers</p>
            <p className="font-serif text-3xl md:text-4xl text-[var(--text-main)] mt-3">{projects.length}</p>
          </div>
          <div className="bg-[var(--bg-primary)] p-6 md:p-8">
            <p className="type-metadata text-[var(--text-faint)]">Research fields</p>
            <p className="font-serif text-3xl md:text-4xl text-[var(--text-main)] mt-3">{topics.length}</p>
          </div>
          <div className="bg-[var(--bg-primary)] p-6 md:p-8">
            <p className="type-metadata text-[var(--text-faint)]">Archive mode</p>
            <p className="font-serif text-2xl md:text-3xl text-[var(--text-main)] mt-3">Curated</p>
          </div>
        </section>
      </ScrollReveal>

      <WorkGallery projects={projects} allTopics={topics} />
    </div>
  );
}
