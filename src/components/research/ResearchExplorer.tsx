"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

interface RelatedRecord {
  id: string;
  label: "Project" | "Essay";
  title: string;
  description: string | null;
  href: string;
}

interface TopicData {
  id: string;
  name: string;
  description: string | null;
  projects: any[];
  articles: any[];
  records: RelatedRecord[];
}

interface ResearchExplorerProps {
  topics: TopicData[];
}

export function ResearchExplorer({ topics }: ResearchExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;

    const query = searchQuery.toLowerCase();

    return topics
      .map((topic) => {
        // Find if topic name or description matches
        const topicMatches =
          topic.name.toLowerCase().includes(query) ||
          (topic.description && topic.description.toLowerCase().includes(query));

        // Find matching records within the topic
        const matchingRecords = topic.records.filter(r =>
          r.title.toLowerCase().includes(query) ||
          (r.description && r.description.toLowerCase().includes(query)) ||
          r.label.toLowerCase().includes(query)
        );

        if (topicMatches || matchingRecords.length > 0) {
          return {
            ...topic,
            // If topic name matches, keep all records. Otherwise keep only matching records.
            records: topicMatches ? topic.records : matchingRecords
          };
        }
        return null;
      })
      .filter(Boolean) as TopicData[];
  }, [topics, searchQuery]);

  return (
    <div className="space-y-16">
      {/* Search Bar */}
      <div className="sticky top-20 z-20 bg-[var(--bg-primary)]/95 backdrop-blur-xl py-4 border-b border-structural">
        <div className="relative flex items-center gap-3 px-6 py-4 border border-structural bg-[var(--bg-primary)] shadow-sm focus-within:border-structural-strong transition-colors">
          <svg className="w-5 h-5 text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domains, topics, or specific inquiries..."
            className="w-full bg-transparent text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none font-serif text-lg md:text-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] px-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-28 min-h-[50vh]">
        <AnimatePresence mode="popLayout">
          {filteredTopics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center border border-structural border-dashed"
            >
              <p className="type-body text-[var(--text-muted)] italic">
                No results found for "{searchQuery}".
              </p>
            </motion.div>
          ) : (
            filteredTopics.map((topic, index) => (
              <motion.section
                key={topic.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
              >
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-40 space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-main)] leading-tight">
                      {topic.name}
                    </h2>
                    <p className="type-body text-base md:text-lg text-[var(--text-muted)]">
                      {topic.description || "Ongoing thematic exploration incorporating cross-disciplinary methods."}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 divide-y divide-structural border-y border-structural">
                  {topic.records.map((record) => (
                    <Link
                      key={`${record.label}-${record.id}`}
                      href={record.href}
                      className="group grid grid-cols-1 md:grid-cols-[130px_1fr_auto] gap-5 py-7 hover:bg-[var(--bg-secondary)]/25 transition-colors"
                    >
                      <span className="type-metadata text-[var(--text-muted)]">{record.label}</span>
                      <span>
                        <span className="type-heading-2 block group-hover:text-[var(--accent)] transition-colors">
                          {record.title}
                        </span>
                        {record.description && (
                          <span className="type-ui text-[var(--text-muted)] block mt-2 line-clamp-2">
                            {record.description}
                          </span>
                        )}
                      </span>
                      <span className="type-metadata text-[var(--text-faint)] group-hover:text-[var(--text-main)]">
                        -&gt;
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
