import React, { ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedCounter } from "./AnimatedCounter";

export function MetricDisplay({
  label,
  value,
  prefix = "",
  suffix = "",
  description,
  trend,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="border border-structural p-6 bg-[var(--bg-secondary)]/20 hover:bg-[var(--bg-secondary)]/40 transition-colors group">
      <h4 className="type-metadata text-[var(--text-faint)] mb-4">{label}</h4>
      <div className="flex items-baseline gap-1 mb-2">
        {prefix && <span className="font-serif text-3xl text-[var(--text-muted)]">{prefix}</span>}
        <span className="font-serif text-5xl text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
          <AnimatedCounter to={value} />
        </span>
        {suffix && <span className="font-serif text-3xl text-[var(--text-muted)]">{suffix}</span>}
      </div>
      {description && <p className="type-metadata text-xs text-[var(--text-muted)] mt-4">{description}</p>}
    </div>
  );
}

export function ResearchCallout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="border-l-2 border-l-[var(--text-main)] pl-6 py-2 my-10 bg-gradient-to-r from-[var(--bg-secondary)]/30 to-transparent">
      {title && <h4 className="type-metadata text-[var(--text-muted)] mb-3">{title}</h4>}
      <div className="type-body text-xl lg:text-2xl text-[var(--text-main)] leading-relaxed italic">
        {children}
      </div>
    </div>
  );
}

export function ChartFrame({ title, source, children }: { title: string; source?: string; children: ReactNode }) {
  return (
    <div className="border border-structural bg-[var(--bg-primary)] overflow-hidden my-12">
      <div className="border-b border-structural px-6 py-4 flex items-center justify-between bg-[var(--bg-secondary)]/30">
        <h4 className="type-ui text-sm text-[var(--text-main)]">{title}</h4>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--text-faint)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--text-faint)]" />
          <div className="w-2 h-2 rounded-full border border-[var(--text-faint)]" />
        </div>
      </div>
      <div className="p-6 md:p-10 lg:p-16 w-full flex items-center justify-center min-h-[300px] bg-grid-pattern">
        {children}
      </div>
      {source && (
        <div className="border-t border-structural px-6 py-3 bg-[var(--bg-secondary)]/10">
          <p className="type-metadata text-[10px] text-[var(--text-faint)] uppercase tracking-wider">Source: {source}</p>
        </div>
      )}
    </div>
  );
}

export function EditorialFeature({
  tag,
  title,
  description,
  href,
  children
}: {
  tag?: string;
  title: string;
  description: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center py-20 border-b border-structural">
      <ScrollReveal animation="fade-right">
        <div className="space-y-6 max-w-xl">
          {tag && <span className="type-metadata text-[var(--text-muted)] border border-structural px-2 py-1">{tag}</span>}
          <h2 className="type-display text-4xl lg:text-5xl text-[var(--text-main)] leading-tight">{title}</h2>
          <p className="type-body text-xl text-[var(--text-muted)] leading-relaxed">
            {description}
          </p>
          {href && (
            <a href={href} className="inline-flex items-center gap-2 type-ui text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mt-4">
              Explore formulation <span className="font-mono text-xs">→</span>
            </a>
          )}
        </div>
      </ScrollReveal>
      {children && (
        <ScrollReveal animation="fade-left" className="relative w-full aspect-square md:aspect-video lg:aspect-square border border-structural bg-[var(--bg-secondary)]/20 p-8 flex items-center justify-center overflow-hidden">
          {children}
        </ScrollReveal>
      )}
    </div>
  );
}

export function SourceBlock({ citation, url, notes }: { citation: string, url?: string, notes?: string }) {
  return (
    <div className="border border-structural p-5 bg-[var(--bg-primary)]">
      <div className="flex gap-4">
        <div className="w-6 h-6 border flex-shrink-0 border-structural text-[var(--text-faint)] flex items-center justify-center font-mono text-[9px]">REF</div>
        <div>
          <p className="type-body text-sm text-[var(--text-main)] leading-relaxed">{citation}</p>
          {notes && <p className="type-metadata text-xs text-[var(--text-muted)] mt-3 italic">{notes}</p>}
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="block mt-3 type-metadata text-[10px] text-[var(--accent)] hover:underline truncate max-w-md">
              {url}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaSplit({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-structural my-12">
      <div className="bg-[var(--bg-primary)] p-8 lg:p-16 flex items-center justify-center">
        {left}
      </div>
      <div className="bg-[var(--bg-primary)] p-8 lg:p-16 flex items-center justify-center">
        {right}
      </div>
    </div>
  );
}
