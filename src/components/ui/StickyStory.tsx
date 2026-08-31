"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

export function StickyDataStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Example SVG Animation physics
  // Let's create a scroll progression for SVG path length (draw-in effect)
  const drawLine = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const dashOffset = useTransform(drawLine, [0, 1], [1000, 0]); // Assuming path length ~ 1000

  // Points appearing 
  const p1Opacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const p1Scale = useSpring(useTransform(scrollYProgress, [0.35, 0.45], [0, 1]), { stiffness: 400, damping: 25 });
  
  const p2Opacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const p2Scale = useSpring(useTransform(scrollYProgress, [0.65, 0.75], [0, 1]), { stiffness: 400, damping: 25 });

  const labelLeftOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.5], [1, 1, 0, 0]);
  const labelMidOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const labelRightOpacity = useTransform(scrollYProgress, [0.6, 0.7, 1, 1], [0, 1, 1, 1]);

  return (
    <div ref={containerRef} className="relative h-auto md:h-[300vh]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start h-full md:pb-[100vh]">

        {/* LEFT COLUMN: Sticky Narrative */}
        <div className="lg:col-span-5 md:h-[100vh] md:sticky top-0 flex flex-col justify-center py-10 md:py-20 pointer-events-none">
          <div className="space-y-4 pointer-events-auto max-w-md bg-[var(--bg-primary)]/80 backdrop-blur-md p-6 border border-structural shadow-sm">
            <h3 className="type-metadata text-[var(--accent)] font-mono font-bold tracking-widest border-b border-structural pb-3 mb-6">
              FISCAL OBSERVATION
            </h3>

            <div className="relative md:h-48 flex flex-col gap-12 md:block">
              {/* Desktop uses framer-motion opacity; Mobile uses raw stacked layout */}
              <motion.div
                style={{ opacity: labelLeftOpacity }}
                className="md:absolute inset-0 md:opacity-100! opacity-100 max-md:!opacity-100 max-md:!static"
              >
                <h4 className="type-heading-1 text-2xl lg:text-3xl text-[var(--text-main)] transition-colors leading-tight">
                  Establishing the baseline.
                </h4>
                <p className="type-ui text-[var(--text-muted)] mt-5 leading-relaxed">
                  Pre-policy metrics remained stable across observed districts between Q1–Q4 prior to state fiscal intervention.
                </p>
              </motion.div>

              <motion.div
                style={{ opacity: labelMidOpacity }}
                className="md:absolute inset-0 md:opacity-100! opacity-100 max-md:!opacity-100 max-md:!static"
              >
                <h4 className="type-heading-1 text-2xl lg:text-3xl text-[var(--text-main)] transition-colors leading-tight">
                  Initial response.
                </h4>
                <p className="type-ui text-[var(--text-muted)] mt-5 leading-relaxed">
                  Upon rollout (Month 0), initial spending adjusted and stabilized rapidly, indicating predictable operational absorption.
                </p>
              </motion.div>

              <motion.div
                style={{ opacity: labelRightOpacity }}
                className="md:absolute inset-0 md:opacity-100! opacity-100 max-md:!opacity-100 max-md:!static"
              >
                <h4 className="type-heading-1 text-2xl lg:text-3xl text-[var(--accent)] transition-colors leading-tight">
                  Longitudinal outcome.
                </h4>
                <p className="type-ui text-[var(--text-muted)] mt-5 leading-relaxed">
                  At month 12, target districts demonstrated a net positive fiscal balance and sustained program efficiency.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling / Sticky Visual Evidence */}
        <div className="lg:col-span-7 h-auto md:h-[100vh] md:sticky top-0 flex flex-col justify-center py-10 md:py-20">
          <div className="bg-[var(--bg-secondary)]/10 border border-structural relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="absolute top-4 left-6 type-metadata text-[var(--text-faint)]">DATA VISUALIZATION</div>
            <div className="absolute bottom-4 right-6 font-mono text-[10px] text-[var(--text-muted)]">N=58 DISTRICTS</div>

            {/* Simulated Data Chart */}
            <svg 
              className="w-full h-full p-12 overflow-visible relative z-10"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid meet"
              stroke="currentColor" 
              fill="none" 
              strokeWidth="2"
            >
              {/* Axes */}
              <line x1="40" y1="260" x2="360" y2="260" strokeDasharray="4 4" className="text-structural-strong" />
              <line x1="40" y1="40" x2="40" y2="260" strokeDasharray="4 4" className="text-structural-strong" />
              
              {/* Data Line - Driven by Scroll */}
              <motion.path
                d="M 40 200 C 100 195, 140 210, 200 160 C 260 110, 300 130, 350 80"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeDasharray="1000"
                style={{ strokeDashoffset: dashOffset }}
              />

              {/* Point A: Pre-treatment stable */}
              <motion.g style={{ opacity: p1Opacity, scale: p1Scale }} cx="120" cy="205" className="origin-[120px_205px]">
                <circle cx="120" cy="205" r="5" fill="var(--bg-primary)" stroke="var(--text-muted)" />
                <text x="120" y="235" className="text-[8px] font-mono fill-[var(--text-muted)]" textAnchor="middle">Q3 BASELINE</text>
              </motion.g>

              {/* Point B: Reverting to mean / Equilibrium */}
              <motion.g style={{ opacity: p2Opacity, scale: p2Scale }} cx="300" cy="115" className="origin-[300px_115px]">
                <circle cx="300" cy="115" r="6" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="2" />
                <rect x="260" y="60" width="80" height="30" fill="var(--bg-primary)" stroke="var(--border-subtle)" rx="2" />
                <text x="300" y="75" className="text-[10px] font-mono fill-emerald-400 font-bold" textAnchor="middle">+1.2% CAP</text>
                <text x="300" y="85" className="text-[8px] font-sans fill-[var(--text-faint)]" textAnchor="middle">target trend</text>
                <line x1="300" y1="90" x2="300" y2="109" className="text-[var(--border-subtle)]" strokeDasharray="2 2" strokeWidth="1" />
              </motion.g>

            </svg>
          </div>
        </div>
        
      </div>
    </div>
  );
}
