"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // negative moves opposite, positive moves along
  className?: string;
}

export function Parallax({ children, speed = 0.1, className }: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only compute if in or near viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const centerDistance = rect.top + rect.height / 2 - viewportHeight / 2;
        setOffset(centerDistance * speed);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
        className="transition-transform duration-100 ease-out will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}