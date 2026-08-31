"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ContentBlock, BlockType } from "@/types/blocks";
import { TipTapEditor } from "./TipTapEditor";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = (type: BlockType) => {
    const newBlock = createDefaultBlock(type);
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updatedBlock: ContentBlock) => {
    onChange(blocks.map((b) => (b.id === id ? updatedBlock : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);
    onChange(newBlocks);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const newBlocks = Array.from(blocks);
    const [moved] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(destinationIndex, 0, moved);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6">
      {/* Existing blocks list with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border border-structural rounded-lg p-4 bg-[var(--bg-primary)] relative group transition-shadow ${
                        snapshot.isDragging
                          ? "shadow-lg ring-2 ring-emerald-500/50"
                          : ""
                      }`}
                    >
                      {/* Header controls */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-structural text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-[var(--text-faint)] hover:text-gray-600 dark:hover:text-gray-200"
                            title="Drag to reorder"
                          >
                            ⋮⋮
                          </div>
                          <span className="font-mono uppercase font-semibold text-[var(--text-main)]">
                            {block.type}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlock(block.id, "up")}
                            disabled={index === 0}
                            className="p-1 hover:bg-[var(--bg-secondary)] rounded disabled:opacity-30"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(block.id, "down")}
                            disabled={index === blocks.length - 1}
                            className="p-1 hover:bg-[var(--bg-secondary)] rounded disabled:opacity-30"
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded ml-2"
                            title="Delete Block"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Block-specific editor */}
                      <BlockItemEditor
                        block={block}
                        onChange={(updated) => updateBlock(block.id, updated)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add block toolbar */}
      <div className="border border-dashed border-[var(--border-strong)] rounded-lg p-4 bg-[var(--bg-secondary)]/50">
        <p className="text-xs uppercase tracking-wider text-[var(--text-faint)] dark:text-[var(--text-muted)] mb-3 font-medium">
          Add Content Block
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { type: "rich-text", label: "Text (Rich Editor)" },
            { type: "heading", label: "Heading" },
            { type: "image", label: "Image" },
            { type: "callout", label: "Callout" },
            { type: "metric", label: "Metric" },
            { type: "quote", label: "Quote" },
            { type: "key-finding", label: "Finding" },
            { type: "methodology", label: "Methodology" },
            { type: "divider", label: "Divider" },
          ].map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type as BlockType)}
              className="text-xs px-3 py-1.5 bg-[var(--bg-primary)] border border-structural hover:border-structural-strong text-[var(--text-main)] rounded shadow-sm transition-all"
            >
              + {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlockItemEditor({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "rich-text":
      return (
        <TipTapEditor
          content={block.content}
          onChange={(content) => onChange({ ...block, content })}
        />
      );

    case "heading":
      return (
        <div className="flex gap-2">
          <select
            value={block.level}
            onChange={(e) =>
              onChange({ ...block, level: parseInt(e.target.value) as any })
            }
            className="text-sm p-2 border border-structural rounded bg-transparent"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
          </select>
          <input
            type="text"
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="Heading text..."
            className="flex-1 text-sm p-2 border border-structural rounded bg-transparent text-[var(--text-main)]"
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="Image URL..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
          <input
            type="text"
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="Alt text..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
        </div>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="Quote text..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent min-h-[60px]"
          />
          <input
            type="text"
            value={block.attribution || ""}
            onChange={(e) => onChange({ ...block, attribution: e.target.value })}
            placeholder="Attribution (optional)..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
        </div>
      );

    case "callout":
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={block.variant}
              onChange={(e) =>
                onChange({ ...block, variant: e.target.value as any })
              }
              className="text-sm p-2 border border-structural rounded bg-transparent"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="finding">Finding</option>
            </select>
            <input
              type="text"
              value={block.title || ""}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder="Title (optional)..."
              className="flex-1 text-sm p-2 border border-structural rounded bg-transparent"
            />
          </div>
          <textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="Callout content..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent min-h-[60px]"
          />
        </div>
      );

    case "metric":
      return (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Label (e.g. Total Debt)..."
            className="text-sm p-2 border border-structural rounded bg-transparent"
          />
          <input
            type="text"
            value={block.value}
            onChange={(e) => onChange({ ...block, value: e.target.value })}
            placeholder="Value (e.g. ₹6.71 Lakh Cr)..."
            className="text-sm p-2 border border-structural rounded bg-transparent"
          />
        </div>
      );

    case "key-finding":
      return (
        <div className="space-y-2">
          <textarea
            value={block.finding}
            onChange={(e) => onChange({ ...block, finding: e.target.value })}
            placeholder="Key finding..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent min-h-[60px]"
          />
          <input
            type="text"
            value={block.evidence || ""}
            onChange={(e) => onChange({ ...block, evidence: e.target.value })}
            placeholder="Evidence (optional)..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
          <input
            type="text"
            value={block.implication || ""}
            onChange={(e) => onChange({ ...block, implication: e.target.value })}
            placeholder="Implication (optional)..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
        </div>
      );

    case "methodology":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Methodology title..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent"
          />
          <textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="Methodology description..."
            className="w-full text-sm p-2 border border-structural rounded bg-transparent min-h-[80px]"
          />
        </div>
      );

    case "divider":
      return <div className="text-xs text-[var(--text-faint)] text-center py-2">— Horizontal Rule —</div>;

    default:
      return (
        <div className="text-xs text-[var(--text-faint)]">
          Editor for block type "{block.type}" is basic.
        </div>
      );
  }
}

function createDefaultBlock(type: BlockType): ContentBlock {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case "rich-text":
      return { id, type: "rich-text", content: "" };
    case "heading":
      return { id, type: "heading", level: 2, content: "" };
    case "image":
      return { id, type: "image", url: "", alt: "", width: "normal" };
    case "image-gallery":
      return { id, type: "image-gallery", images: [] };
    case "quote":
      return { id, type: "quote", content: "" };
    case "callout":
      return { id, type: "callout", variant: "info", content: "" };
    case "metric":
      return { id, type: "metric", label: "", value: "" };
    case "chart":
      return {
        id,
        type: "chart",
        chartType: "line",
        title: "",
        data: [],
        config: {},
      };
    case "embed":
      return { id, type: "embed", url: "", embedType: "iframe" };
    case "code":
      return { id, type: "code", language: "typescript", code: "" };
    case "table":
      return { id, type: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "divider":
      return { id, type: "divider" };
    case "two-column":
      return { id, type: "two-column", left: [], right: [] };
    case "timeline":
      return { id, type: "timeline", items: [] };
    case "methodology":
      return { id, type: "methodology", title: "", content: "" };
    case "key-finding":
      return { id, type: "key-finding", finding: "" };
    case "source-list":
      return { id, type: "source-list", sources: [] };
    case "related-work":
      return { id, type: "related-work", projectIds: [] };
    default:
      return { id, type: "rich-text", content: "" };
  }
}
