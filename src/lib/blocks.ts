import { nanoid } from "nanoid";
import { ContentBlock, BlockType } from "@/types/blocks";

/**
 * Creates a new block with a generated ID
 */
export function createBlock<T extends ContentBlock>(
  type: BlockType,
  data: Omit<T, "id" | "type">
): T {
  return {
    id: nanoid(),
    type,
    ...data,
  } as T;
}

/**
 * Reorders blocks in an array
 */
export function reorderBlocks<T extends ContentBlock>(
  blocks: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const result = Array.from(blocks);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Extracts plain text from a single block
 */
export function getBlockPlainText(block: ContentBlock): string {
  switch (block.type) {
    case "rich-text":
      return block.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    case "heading":
      return block.content;
    case "quote":
      return block.content;
    case "callout":
      return `${block.title || ""} ${block.content}`.trim();
    case "code":
      return block.code;
    case "methodology":
      return `${block.title} ${block.content}`.trim();
    case "key-finding":
      return `${block.finding} ${block.evidence || ""} ${block.implication || ""}`.trim();
    case "two-column":
      return `${getBlocksPlainText(block.left)} ${getBlocksPlainText(block.right)}`.trim();
    default:
      return "";
  }
}

/**
 * Extracts all plain text from an array of blocks
 */
export function getBlocksPlainText(blocks: ContentBlock[]): string {
  return blocks.map(getBlockPlainText).join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Project templates with pre-configured blocks
 */
export const PROJECT_TEMPLATES: Record<string, ContentBlock[]> = {
  "Research Project": [
    createBlock("heading", { level: 2, content: "Overview" }),
    createBlock("rich-text", { content: "<p>Describe your research question and objectives.</p>" }),
    createBlock("heading", { level: 2, content: "Methodology" }),
    createBlock("methodology", {
      title: "Research Approach",
      content: "Describe your research methods and data collection process.",
    }),
    createBlock("heading", { level: 2, content: "Key Findings" }),
    createBlock("key-finding", {
      finding: "Your main finding here",
      evidence: "Supporting evidence",
      implication: "What this means",
    }),
    createBlock("heading", { level: 2, content: "Sources" }),
    createBlock("source-list", {
      sources: [
        {
          title: "Source Title",
          author: "Author Name",
          url: "https://example.com",
        },
      ],
    }),
  ],

  "Data Analysis": [
    createBlock("heading", { level: 2, content: "Project Overview" }),
    createBlock("rich-text", { content: "<p>What question are you answering with this analysis?</p>" }),
    createBlock("heading", { level: 2, content: "Key Metrics" }),
    createBlock("metric", {
      label: "Primary Metric",
      value: "0",
      change: "+0%",
      changeDirection: "up",
    }),
    createBlock("heading", { level: 2, content: "Analysis" }),
    createBlock("chart", {
      chartType: "line",
      title: "Trend Over Time",
      data: [],
      config: {},
    }),
    createBlock("heading", { level: 2, content: "Insights" }),
    createBlock("callout", {
      variant: "finding",
      title: "Key Insight",
      content: "What does the data tell you?",
    }),
  ],

  "Policy Research": [
    createBlock("heading", { level: 2, content: "Executive Summary" }),
    createBlock("rich-text", { content: "<p>Brief overview of the policy issue and recommendations.</p>" }),
    createBlock("heading", { level: 2, content: "Background" }),
    createBlock("rich-text", { content: "<p>Context and current policy landscape.</p>" }),
    createBlock("heading", { level: 2, content: "Analysis" }),
    createBlock("callout", {
      variant: "info",
      title: "Policy Context",
      content: "Important background information",
    }),
    createBlock("heading", { level: 2, content: "Recommendations" }),
    createBlock("rich-text", { content: "<p>Your policy recommendations based on research.</p>" }),
    createBlock("heading", { level: 2, content: "References" }),
    createBlock("source-list", { sources: [] }),
  ],

  Visualization: [
    createBlock("heading", { level: 2, content: "Visualization Title" }),
    createBlock("rich-text", { content: "<p>What story does this visualization tell?</p>" }),
    createBlock("chart", {
      chartType: "bar",
      title: "Main Chart",
      data: [],
      config: {},
    }),
    createBlock("heading", { level: 2, content: "Insights" }),
    createBlock("rich-text", { content: "<p>What patterns or trends do you see?</p>" }),
    createBlock("heading", { level: 2, content: "Data Source" }),
    createBlock("rich-text", { content: "<p>Where did this data come from?</p>" }),
  ],

  "Team/Leadership": [
    createBlock("heading", { level: 2, content: "Project Overview" }),
    createBlock("rich-text", { content: "<p>Describe the team project and your role.</p>" }),
    createBlock("heading", { level: 2, content: "Timeline" }),
    createBlock("timeline", {
      items: [
        {
          date: "Month Year",
          title: "Project Phase",
          description: "What was accomplished",
        },
      ],
    }),
    createBlock("heading", { level: 2, content: "Outcomes" }),
    createBlock("rich-text", { content: "<p>What did the team achieve?</p>" }),
    createBlock("heading", { level: 2, content: "Reflection" }),
    createBlock("rich-text", { content: "<p>What did you learn from this experience?</p>" }),
  ],

  "Writing/Essay": [
    createBlock("heading", { level: 2, content: "Introduction" }),
    createBlock("rich-text", { content: "<p>Introduce your topic and thesis.</p>" }),
    createBlock("heading", { level: 2, content: "Section 1" }),
    createBlock("rich-text", { content: "<p>Your first main point.</p>" }),
    createBlock("heading", { level: 2, content: "Section 2" }),
    createBlock("rich-text", { content: "<p>Your second main point.</p>" }),
    createBlock("heading", { level: 2, content: "Conclusion" }),
    createBlock("rich-text", { content: "<p>Synthesize your argument and key takeaways.</p>" }),
    createBlock("heading", { level: 2, content: "Works Cited" }),
    createBlock("source-list", { sources: [] }),
  ],
};
