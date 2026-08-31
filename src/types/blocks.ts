export type BlockType =
  | "rich-text"
  | "heading"
  | "image"
  | "image-gallery"
  | "quote"
  | "callout"
  | "metric"
  | "chart"
  | "embed"
  | "code"
  | "table"
  | "divider"
  | "two-column"
  | "timeline"
  | "methodology"
  | "key-finding"
  | "source-list"
  | "related-work";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface RichTextBlock extends BaseBlock {
  type: "rich-text";
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4;
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
  width: "normal" | "wide" | "full";
}

export interface ImageGalleryBlock extends BaseBlock {
  type: "image-gallery";
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  content: string;
  attribution?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  variant: "info" | "warning" | "success" | "finding";
  title?: string;
  content: string;
}

export interface MetricBlock extends BaseBlock {
  type: "metric";
  label: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
}

export interface ChartBlock extends BaseBlock {
  type: "chart";
  chartType: "line" | "bar" | "area" | "scatter" | "pie";
  title: string;
  subtitle?: string;
  data: Array<Record<string, unknown>>;
  config: Record<string, unknown>;
  source?: string;
  notes?: string;
}

export interface EmbedBlock extends BaseBlock {
  type: "embed";
  url: string;
  embedType: "tableau" | "flourish" | "iframe" | "video";
  title?: string;
  caption?: string;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
  language: string;
  code: string;
  caption?: string;
}

export interface TableBlock extends BaseBlock {
  type: "table";
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

export interface TwoColumnBlock extends BaseBlock {
  type: "two-column";
  left: ContentBlock[];
  right: ContentBlock[];
}

export interface TimelineBlock extends BaseBlock {
  type: "timeline";
  items: Array<{
    date: string;
    title: string;
    description?: string;
  }>;
}

export interface MethodologyBlock extends BaseBlock {
  type: "methodology";
  title: string;
  content: string;
}

export interface KeyFindingBlock extends BaseBlock {
  type: "key-finding";
  finding: string;
  evidence?: string;
  implication?: string;
}

export interface SourceListBlock extends BaseBlock {
  type: "source-list";
  sources: Array<{
    title: string;
    author?: string;
    url?: string;
    notes?: string;
  }>;
}

export interface RelatedWorkBlock extends BaseBlock {
  type: "related-work";
  projectIds: string[];
}

export type ContentBlock =
  | RichTextBlock
  | HeadingBlock
  | ImageBlock
  | ImageGalleryBlock
  | QuoteBlock
  | CalloutBlock
  | MetricBlock
  | ChartBlock
  | EmbedBlock
  | CodeBlock
  | TableBlock
  | DividerBlock
  | TwoColumnBlock
  | TimelineBlock
  | MethodologyBlock
  | KeyFindingBlock
  | SourceListBlock
  | RelatedWorkBlock;
