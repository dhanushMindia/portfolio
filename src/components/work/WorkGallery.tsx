"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { DistributionCurve } from "@/components/ui/DataGraphics";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  startDate: Date | null;
  progressStatus: "PLANNING" | "ONGOING" | "COMPLETED";
  topics: { topic: { id: string; name: string } }[];
  featured?: boolean;
}

interface WorkGalleryProps {
  projects: ProjectItem[];
  allTopics: { id: string; name: string }[];
}

export function WorkGallery({ projects, allTopics }: WorkGalleryProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!selectedTopic) return projects;
    return projects.filter((p) =>
      p.topics.some((t) => t.topic.id === selectedTopic)
    );
  }, [projects, selectedTopic]);

  return (
    <div className="space-y-16">
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-structural pb-6">
        <span className="type-metadata mr-3 text-[var(--text-faint)]">Filter Domain:</span>
        <button
          onClick={() => setSelectedTopic(null)}
          className={cn(
            "type-metadata px-3 py-1.5 transition-all text-xs",
            !selectedTopic
              ? "bg-[var(--text-main)] text-[var(--bg-primary)]"
              : "border border-structural bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-structural-strong"
          )}
        >
          All Inquiries ({projects.length})
        </button>
        {allTopics.map((topic) => {
          const isSelected = selectedTopic === topic.id;
          const count = projects.filter((p) =>
            p.topics.some((t) => t.topic.id === topic.id)
          ).length;

          if (count === 0) return null;

          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
              className={cn(
                "type-metadata px-3 py-1.5 transition-all flex items-center gap-1.5 text-xs",
                isSelected
                  ? "bg-[var(--text-main)] text-[var(--bg-primary)]"
                  : "border border-structural bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-structural-strong"
              )}
            >
              {topic.name}
              <span className="font-mono text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC PRESENTATION PATTERNS */}
      <motion.div layout className="space-y-12">
        <AnimatePresence>
          {filteredProjects.map((project, index) => {
            const isLead = index === 0;
            const isPair = index === 1 || index === 2;

            if (isLead) {
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group flex flex-col justify-between border border-structural hover:border-structural-strong bg-[var(--bg-primary)] p-8 md:p-12 lg:p-14 transition-colors"
                  >
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="type-metadata px-2.5 py-1 bg-[var(--bg-secondary)] border border-structural">
                          Lead Dossier
                        </span>
                        <span className={`type-metadata px-2.5 py-1 text-xs border border-structural ${project.progressStatus === 'COMPLETED' ? 'bg-[var(--text-main)] text-[var(--bg-primary)]' : project.progressStatus === 'ONGOING' ? 'bg-[var(--text-muted)] text-[var(--bg-primary)]' : 'bg-transparent text-[var(--text-main)]'}`}>
                          {project.progressStatus.charAt(0) + project.progressStatus.slice(1).toLowerCase()}
                        </span>
                        {project.startDate && (
                          <span className="font-mono text-xs text-[var(--text-muted)]">
                            {new Date(project.startDate).getFullYear()}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors text-balance">
                        {project.title}
                      </h2>

                      {project.shortDescription && (
                        <p className="type-body text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
                          {project.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-12 border-t border-structural flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.topics.map((t) => (
                          <span
                            key={t.topic.id}
                            className="type-metadata px-2 py-0.5 border border-structural bg-[var(--bg-secondary)]/50 text-[var(--text-muted)]"
                          >
                            {t.topic.name}
                          </span>
                        ))}
                      </div>
                      <span className="type-metadata text-[var(--accent)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                        Open inquiry &rarr;
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            }

            if (isPair) {
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="lg:w-[calc(50%-0.75rem)] lg:inline-block lg:align-top lg:mr-6 lg:even:mr-0 mb-6 lg:mb-0"
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group flex flex-col justify-between h-full border border-structural hover:border-structural-strong bg-[var(--bg-primary)] p-8 transition-colors"
                  >
                    <div className="space-y-5 flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className={`type-metadata px-2 py-0.5 mr-1 text-[10px] border border-structural ${project.progressStatus === 'COMPLETED' ? 'bg-[var(--text-main)] text-[var(--bg-primary)]' : project.progressStatus === 'ONGOING' ? 'bg-[var(--text-muted)] text-[var(--bg-primary)]' : 'bg-transparent text-[var(--text-main)]'}`}>
                            {project.progressStatus.charAt(0) + project.progressStatus.slice(1).toLowerCase()}
                          </span>
                          {project.topics.map((t) => (
                            <span key={t.topic.id} className="type-metadata px-2 py-0.5 bg-[var(--bg-secondary)] border border-structural">
                              {t.topic.name}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-xs text-[var(--text-faint)]">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl md:text-3xl text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                        {project.title}
                      </h3>

                      {project.shortDescription && (
                        <p className="type-ui text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                          {project.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-structural flex items-center justify-between">
                      <span className="type-metadata text-[var(--accent)] group-hover:text-[var(--text-main)] transition-colors">
                        Explore Finding
                      </span>
                      <span className="font-mono text-xs text-[var(--text-faint)] group-hover:text-[var(--text-main)] group-hover:translate-x-1 transition-all">&rarr;</span>
                    </div>
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group block border border-structural hover:border-structural-strong bg-[var(--bg-primary)] p-8 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
                    <div className="md:w-1/4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[var(--text-faint)]">
                          {project.startDate
                            ? new Date(project.startDate).getFullYear()
                            : "ARCHIVE"}
                        </span>
                        <span className={`type-metadata px-1.5 py-0.5 text-[9px] border border-structural ${project.progressStatus === 'COMPLETED' ? 'bg-[var(--text-main)] text-[var(--bg-primary)]' : project.progressStatus === 'ONGOING' ? 'bg-[var(--text-muted)] text-[var(--bg-primary)]' : 'bg-transparent text-[var(--text-main)]'}`}>
                          {project.progressStatus.charAt(0) + project.progressStatus.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.topics.map((t) => (
                          <span
                            key={t.topic.id}
                            className="type-metadata text-[10px] text-[var(--text-muted)]"
                          >
                            {t.topic.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-3/4 space-y-2">
                      <h3 className="font-serif text-2xl text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                        {project.title}
                      </h3>
                      {project.shortDescription && (
                        <p className="type-ui text-[var(--text-muted)] leading-relaxed">
                          {project.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="border border-dashed border-structural p-12 text-center">
            <p className="type-ui text-[var(--text-muted)] italic">
              No matching research inquiries found in this category.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}