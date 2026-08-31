"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function JournalTimelineMarker({ className }: { className?: string }) {
  return (
    <motion.div
      initial="inactive"
      whileInView="active"
      viewport={{ once: false, margin: "-45% 0px -45% 0px" }}
      variants={{
        inactive: { borderColor: "var(--structural-strong)", backgroundColor: "var(--bg-primary)" },
        active: { borderColor: "var(--accent)", backgroundColor: "var(--accent)" }
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "absolute top-1.5 w-3 h-3 border-2 rounded-full",
        // Position it exactly centered on the timeline track
        // Track is at left:0 of <ScrollTimelineProgress>.
        // Since we are inside the padding of that container (pl-8/pl-12),
        // we pull it back by padding + half marker width (6px)
        "-left-[calc(2rem+6px)] md:-left-[calc(3rem+6px)]",
        className
      )}
    />
  );
}
