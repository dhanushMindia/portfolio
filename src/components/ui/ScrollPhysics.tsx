"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 1. Subtle Parallax Layer
 * Moves elements at a different physical speed than normal scrolling.
 */
export function ScrollParallax({
  children,
  speed = 0.85,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate pixel displacement based on relative speed
  const y = useTransform(scrollYProgress, [0, 1], [-30 * (1 - speed), 30 * (1 - speed)]);
  const smoothY = useSpring(y, { stiffness: 400, damping: 90 });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y: smoothY }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 2. Image Scale on Scroll
 * Very subtly scales an image/card between 1.0 -> 1.04 to give depth without excessive zooming.
 */
export function ScrollScale({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.03, 1.0]);
  const smoothScale = useSpring(scale, { stiffness: 300, damping: 60 });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ scale: smoothScale }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 3. Scroll Progress Indicator Bar
 * Minimalist top indicator showing page reading progression.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  );
}

/**
 * 4. Scroll-Driven Typography
 * Shifts opacity and alignment subtly based on distance to the viewport center.
 */
export function ScrollTypography({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * 5. Interactive Physical Timeline Progress
 * A vertical line that progressively fills with physical tension.
 */
export function ScrollTimelineProgress({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 50,
  });

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Background track (matches the original border-l position) */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-structural-strong" />
      {/* Active progress fill */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] -ml-[0.5px] bg-[var(--accent)] origin-top z-10"
        style={{ scaleY }}
      />
      <div className="w-full h-full relative">{children}</div>
    </div>
  );
}
