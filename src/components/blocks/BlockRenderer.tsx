import { ContentBlock } from "@/types/blocks";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Renders an array of content blocks with high-end editorial and academic typography.
 * Used on public-facing pages to render Project.blocks and Article.content.
 */
export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {blocks.map((block) => (
        <BlockRendererBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockRendererBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "rich-text":
      return <RichTextBlockView block={block} />;
    case "heading":
      return <HeadingBlockView block={block} />;
    case "image":
      return <ImageBlockView block={block} />;
    case "image-gallery":
      return <ImageGalleryBlockView block={block} />;
    case "quote":
      return <QuoteBlockView block={block} />;
    case "callout":
      return <CalloutBlockView block={block} />;
    case "metric":
      return <MetricBlockView block={block} />;
    case "chart":
      return <ChartBlockView block={block} />;
    case "embed":
      return <EmbedBlockView block={block} />;
    case "code":
      return <CodeBlockView block={block} />;
    case "table":
      return <TableBlockView block={block} />;
    case "divider":
      return <DividerBlockView />;
    case "two-column":
      return <TwoColumnBlockView block={block} />;
    case "timeline":
      return <TimelineBlockView block={block} />;
    case "methodology":
      return <MethodologyBlockView block={block} />;
    case "key-finding":
      return <KeyFindingBlockView block={block} />;
    case "source-list":
      return <SourceListBlockView block={block} />;
    case "related-work":
      return <RelatedWorkBlockView block={block} />;
    default:
      return null;
  }
}

// --- Individual block views with archival art direction ---

function RichTextBlockView({ block }: { block: Extract<ContentBlock, { type: "rich-text" }> }) {
  return (
    <div
      className="prose-editorial max-w-none type-body"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}

function HeadingBlockView({ block }: { block: Extract<ContentBlock, { type: "heading" }> }) {
  const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4";
  const classes = {
    1: "type-display border-b border-structural pb-4 mt-16 mb-8 text-[var(--text-main)]",
    2: "type-heading-1 border-b border-structural pb-3 mt-14 mb-6 text-[var(--text-main)]",
    3: "type-heading-2 mt-10 mb-4 text-[var(--text-main)]",
    4: "type-ui font-serif text-xl sm:text-2xl mt-8 mb-3 text-[var(--text-main)] font-semibold",
  };
  return <Tag className={classes[block.level]}>{block.content}</Tag>;
}

function ImageBlockView({ block }: { block: Extract<ContentBlock, { type: "image" }> }) {
  const widthClass = {
    normal: "max-w-4xl",
    wide: "max-w-6xl",
    full: "max-w-full -mx-4 md:-mx-12 lg:-mx-24",
  }[block.width];

  return (
    <figure className={cn("mx-auto space-y-3", widthClass)}>
      <div className="relative w-full aspect-[16/10] bg-[var(--bg-secondary)] border border-structural overflow-hidden">
        <Image
          src={block.url}
          alt={block.alt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-[1.01]"
        />
      </div>
      {block.caption && (
        <figcaption className="flex items-center gap-3 pt-1">
          <span className="type-metadata text-[var(--text-faint)]">FIG //</span>
          <span className="type-metadata text-[var(--text-muted)] italic">
            {block.caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

function ImageGalleryBlockView({ block }: { block: Extract<ContentBlock, { type: "image-gallery" }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {block.images.map((img, i) => (
        <figure key={i} className="space-y-2 group">
          <div className="relative w-full aspect-[4/3] bg-[var(--bg-secondary)] border border-structural overflow-hidden">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {img.caption && (
            <figcaption className="type-metadata text-[var(--text-muted)] text-[10px]">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function QuoteBlockView({ block }: { block: Extract<ContentBlock, { type: "quote" }> }) {
  return (
    <blockquote className="border-l-2 border-structural-strong pl-8 md:pl-12 py-4 my-10 space-y-4">
      <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[var(--text-main)] leading-relaxed tracking-normal">
        “{block.content}”
      </p>
      {block.attribution && (
        <footer className="type-metadata text-[var(--text-muted)]">
          — {block.attribution}
        </footer>
      )}
    </blockquote>
  );
}

function CalloutBlockView({ block }: { block: Extract<ContentBlock, { type: "callout" }> }) {
  const variantLabels = {
    info: "ARCHIVAL NOTE",
    warning: "CAUTIONARY CONSTRAINT",
    success: "VERIFIED RESULT",
    finding: "ANALYTIC THESIS",
  };

  return (
    <div className="border border-structural bg-[var(--bg-secondary)]/30 p-6 md:p-8 space-y-3 relative overflow-hidden">
      <div className="flex items-center gap-2 border-b border-structural pb-3 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        <span className="type-metadata text-[var(--accent)] font-mono font-semibold">
          [{variantLabels[block.variant] || "MEMORANDUM"}]
        </span>
        {block.title && (
          <span className="type-ui font-medium text-[var(--text-main)] ml-2">
            {block.title}
          </span>
        )}
      </div>
      <div
        className="type-ui text-[var(--text-main)] text-sm md:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </div>
  );
}

function MetricBlockView({ block }: { block: Extract<ContentBlock, { type: "metric" }> }) {
  const directionSign = {
    up: "↑",
    down: "↓",
    neutral: "→",
  }[block.changeDirection || "neutral"];

  return (
    <div className="border border-structural p-8 bg-[var(--bg-primary)] space-y-3">
      <p className="type-metadata text-[var(--text-muted)]">{block.label}</p>
      <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-main)] tracking-normal">
        {block.value}
      </p>
      {block.change && (
        <p className="type-metadata font-mono text-xs text-[var(--text-muted)] flex items-center gap-1.5 pt-2 border-t border-structural">
          <span>{directionSign}</span>
          <span>{block.change}</span>
        </p>
      )}
    </div>
  );
}

function ChartBlockView({ block }: { block: Extract<ContentBlock, { type: "chart" }> }) {
  return (
    <div className="border border-structural p-8 bg-[var(--bg-primary)] space-y-6">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-structural pb-4">
        <div>
          <span className="type-metadata text-[var(--text-faint)]">DATA VISUALIZATION //</span>
          <h4 className="type-heading-2 text-[var(--text-main)] mt-1">
            {block.title}
          </h4>
          {block.subtitle && (
            <p className="type-ui text-sm text-[var(--text-muted)] mt-1">
              {block.subtitle}
            </p>
          )}
        </div>
        <span className="type-metadata border border-structural px-2 py-0.5 self-start">
          FORMAT: {block.chartType.toUpperCase()}
        </span>
      </div>

      <div className="aspect-[16/9] bg-[var(--bg-secondary)] border border-structural flex flex-col items-center justify-center p-8 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-20" />
        <div className="z-10 space-y-2">
          <p className="type-metadata">Quantitative Matrix</p>
          <p className="font-serif italic text-lg text-[var(--text-muted)]">
            {block.data.length} Data Points Analyzed
          </p>
        </div>
      </div>

      {(block.source || block.notes) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-structural text-[11px] font-mono text-[var(--text-muted)]">
          {block.source && <span>SOURCE: {block.source}</span>}
          {block.notes && <span>NOTE: {block.notes}</span>}
        </div>
      )}
    </div>
  );
}

function EmbedBlockView({ block }: { block: Extract<ContentBlock, { type: "embed" }> }) {
  return (
    <figure className="space-y-3 my-8">
      <div className="relative w-full aspect-video bg-[var(--bg-secondary)] border border-structural overflow-hidden">
        <iframe
          src={block.url}
          title={block.title || "Embedded content"}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        />
      </div>
      {block.caption && (
        <figcaption className="type-metadata text-[var(--text-muted)]">
          FIG EMBED // {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function CodeBlockView({ block }: { block: Extract<ContentBlock, { type: "code" }> }) {
  return (
    <div className="border border-structural bg-black text-sand-100 overflow-hidden my-8">
      <div className="flex items-center justify-between px-4 py-2 border-b border-sand-800 bg-sand-950 font-mono text-xs text-sand-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sand-600" />
          <span>{block.language.toUpperCase()}</span>
        </div>
        {block.caption && <span className="text-sand-500">{block.caption}</span>}
      </div>
      <pre className="p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-sand-200">
        <code>{block.code}</code>
      </pre>
    </div>
  );
}

function TableBlockView({ block }: { block: Extract<ContentBlock, { type: "table" }> }) {
  return (
    <div className="space-y-3 my-8">
      <div className="overflow-x-auto border border-structural">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-structural bg-[var(--bg-secondary)]">
              {block.headers.map((header, i) => (
                <th
                  key={i}
                  className="px-6 py-3.5 type-metadata text-[var(--text-main)] font-bold tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-structural font-mono text-xs sm:text-sm">
            {block.rows.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-[var(--bg-secondary)]/50 transition-colors"
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-[var(--text-main)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption && (
        <p className="type-metadata text-[var(--text-muted)] text-[11px]">
          TABLE REF // {block.caption}
        </p>
      )}
    </div>
  );
}

function DividerBlockView() {
  return (
    <div className="flex items-center justify-center gap-3 my-16">
      <div className="w-12 h-px bg-[var(--border-subtle)]" />
      <span className="type-metadata text-xs opacity-50">§</span>
      <div className="w-12 h-px bg-[var(--border-subtle)]" />
    </div>
  );
}

function TwoColumnBlockView({ block }: { block: Extract<ContentBlock, { type: "two-column" }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 my-8 items-start">
      <div className="space-y-6">
        {block.left.map((b) => (
          <BlockRendererBlock key={b.id} block={b} />
        ))}
      </div>
      <div className="space-y-6">
        {block.right.map((b) => (
          <BlockRendererBlock key={b.id} block={b} />
        ))}
      </div>
    </div>
  );
}

function TimelineBlockView({ block }: { block: Extract<ContentBlock, { type: "timeline" }> }) {
  return (
    <div className="border-l border-structural-strong pl-6 md:pl-10 space-y-8 my-8">
      {block.items.map((item, i) => (
        <div key={i} className="relative space-y-2 group">
          <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-3 h-3 rounded-full bg-[var(--bg-primary)] border-2 border-structural-strong group-hover:border-[var(--accent)] transition-colors" />
          <p className="type-metadata text-[var(--accent)] font-mono">
            {item.date}
          </p>
          <h4 className="type-heading-2 text-[var(--text-main)] text-xl">
            {item.title}
          </h4>
          {item.description && (
            <p className="type-body text-[var(--text-muted)] text-base">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function MethodologyBlockView({ block }: { block: Extract<ContentBlock, { type: "methodology" }> }) {
  return (
    <div className="border border-structural p-8 bg-[var(--bg-secondary)]/20 space-y-4 my-8">
      <div className="flex items-center justify-between border-b border-structural pb-3">
        <span className="type-metadata text-[var(--text-main)] font-semibold">
          ANALYTICAL FRAMEWORK
        </span>
        <span className="font-mono text-xs text-[var(--text-faint)]">METHODOLOGY</span>
      </div>
      <h4 className="type-heading-2 text-[var(--text-main)]">{block.title}</h4>
      <div
        className="prose-editorial text-sm md:text-base type-body"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </div>
  );
}

function KeyFindingBlockView({ block }: { block: Extract<ContentBlock, { type: "key-finding" }> }) {
  return (
    <div className="border border-structural-strong p-8 md:p-12 bg-[var(--bg-primary)] space-y-6 my-10 relative">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[var(--accent)]" />
        <span className="type-metadata text-[var(--text-main)] font-bold">
          PRIMARY ANALYTICAL FINDING
        </span>
      </div>

      <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-[var(--text-main)] leading-tight tracking-normal">
        {block.finding}
      </p>

      {(block.evidence || block.implication) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-structural">
          {block.evidence && (
            <div className="space-y-1">
              <p className="type-metadata text-[var(--text-muted)]">Key Evidence</p>
              <p className="type-ui text-sm text-[var(--text-main)] leading-relaxed">
                {block.evidence}
              </p>
            </div>
          )}
          {block.implication && (
            <div className="space-y-1">
              <p className="type-metadata text-[var(--text-muted)]">Policy Implication</p>
              <p className="type-ui text-sm text-[var(--text-main)] leading-relaxed">
                {block.implication}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SourceListBlockView({ block }: { block: Extract<ContentBlock, { type: "source-list" }> }) {
  return (
    <div className="border-t border-structural pt-8 mt-12 space-y-6">
      <h4 className="type-metadata text-[var(--text-main)]">
        PRIMARY SOURCES & REFERENCES ({block.sources.length})
      </h4>
      <div className="divide-y divide-structural font-mono text-xs">
        {block.sources.map((source, i) => (
          <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="space-y-1">
              <span className="font-semibold text-[var(--text-main)]">
                [{i + 1}] {source.title}
              </span>
              {source.author && (
                <span className="text-[var(--text-muted)] block sm:inline sm:ml-2">
                  — {source.author}
                </span>
              )}
              {source.notes && (
                <p className="text-[var(--text-faint)] italic font-sans text-xs pt-1">
                  {source.notes}
                </p>
              )}
            </div>
            {source.url && (
              <Link
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline uppercase tracking-wider text-[11px]"
              >
                Access Source ↗
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedWorkBlockView({ block }: { block: Extract<ContentBlock, { type: "related-work" }> }) {
  if (block.projectIds.length === 0) return null;
  return (
    <div className="border border-structural p-6 bg-[var(--bg-secondary)]/20 mt-12 flex items-center justify-between">
      <span className="type-metadata">RELATED RESEARCH INQUIRIES</span>
      <span className="type-ui font-mono text-xs text-[var(--text-muted)]">
        {block.projectIds.length} Linked Nodes
      </span>
    </div>
  );
}
