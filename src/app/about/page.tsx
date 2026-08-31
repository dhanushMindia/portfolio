export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function AboutPage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="space-y-24 pt-8 md:pt-16 px-6 md:px-12 lg:px-24 mx-auto w-full max-w-[1400px] mb-24 pb-32">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-structural pb-10">
        <ScrollReveal animation="fade-up" className="lg:col-span-6 space-y-4">
          <p className="type-metadata text-[var(--text-muted)]">Background & Directives</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-main)] tracking-tight text-balance">
            {profile?.name || "Dhanush Mendu"}
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-6 lg:pt-8 self-end">
          <p className="type-body text-[var(--text-muted)] text-xl leading-relaxed max-w-xl lg:ml-auto">
            {profile?.tagline || "Research, public finance, data analysis and policy — building an evidence-based body of work."}
          </p>
        </ScrollReveal>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Main Content */}
        <div className="lg:col-span-7 space-y-12">
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="prose-editorial">
              {profile?.bio ? (
                profile.bio.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    I operate at the intersection of quantitative data analysis, public finance, and applied economic policy.
                    Currently focusing on uncovering structured evidence for state-level financial dynamics and policy effectiveness.
                  </p>
                  <p>
                    This platform serves as an open record of my research processes, public datasets, and analytical briefs. It is structured to provide transparent, verifiable insights into public finance systems, state liabilities, and regional development indicators.
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Sidebar / Metadata */}
        <div className="lg:col-span-5 space-y-12">
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="border border-structural p-8 space-y-8 bg-[var(--bg-secondary)]/20">

              {profile?.currentRole && (
                <div>
                  <h3 className="type-metadata text-[var(--text-faint)] mb-2">Current Role</h3>
                  <p className="type-ui text-[var(--text-main)]">{profile.currentRole}</p>
                </div>
              )}

              {profile?.location && (
                <div>
                  <h3 className="type-metadata text-[var(--text-faint)] mb-2">Location</h3>
                  <p className="type-ui text-[var(--text-main)]">{profile.location}</p>
                </div>
              )}

              {profile?.currentFocus && profile.currentFocus.length > 0 && (
                <div>
                  <h3 className="type-metadata text-[var(--text-faint)] mb-3">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.currentFocus.map(focus => (
                      <span key={focus} className="inline-block type-metadata text-[10px] px-2 py-1 border border-structural text-[var(--text-muted)]">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-structural">
                <h3 className="type-metadata text-[var(--text-faint)] mb-4">Contact & Links</h3>
                <div className="space-y-4">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex justify-between items-center group">
                      <span className="type-ui text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Email</span>
                      <span className="font-mono text-xs text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors">↗</span>
                    </a>
                  )}
                  {profile?.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center group">
                      <span className="type-ui text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">LinkedIn</span>
                      <span className="font-mono text-xs text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <section className="space-y-12 border-t border-structural pt-12">
        <ScrollReveal animation="fade-up">
          <div className="space-y-4 mb-4">
            <p className="type-metadata text-[var(--text-muted)]">Operating Principles</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-main)]">Methodology & Ethos</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-structural">
            {[
              ["Evidence first", "Claims are strongest when their sources, limits, and assumptions remain visible."],
              ["Systems view", "Policy questions are read across institutions, incentives, implementation, and lived outcomes."],
              ["Living record", "Projects, essays, and weekly notes stay connected as the work matures."],
            ].map(([title, body]) => (
              <div key={title} className="bg-[var(--bg-primary)] p-6 md:p-8 lg:p-10">
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--text-main)]">{title}</h2>
                <p className="type-ui text-[var(--text-muted)] leading-relaxed mt-6">{body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
