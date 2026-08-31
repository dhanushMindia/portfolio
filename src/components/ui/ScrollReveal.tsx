"use client";

import { useRef, ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "blur-in" | "slide-left" | "slide-right" | "fade-right" | "fade-left";
  delay?: number;
  threshold?: number;
  staggerChildren?: boolean;
}

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px 80px 0px",
      }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [hasAnimated, threshold]);

  const baseStyles = "transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

  const getAnimationStyles = () => {
    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0";
        case "fade-in":
          return "opacity-0 motion-reduce:opacity-100";
        case "blur-in":
          return "opacity-0 blur-sm translate-y-3 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:translate-y-0";
        case "slide-left":
        case "fade-left":
          return "opacity-0 translate-x-6 motion-reduce:opacity-100 motion-reduce:translate-x-0";
        case "slide-right":
        case "fade-right":
          return "opacity-0 -translate-x-6 motion-reduce:opacity-100 motion-reduce:translate-x-0";
        default:
          return "opacity-0 motion-reduce:opacity-100";
      }
    }

    switch (animation) {
      case "fade-up":
        return "opacity-100 translate-y-0";
      case "fade-in":
        return "opacity-100";
      case "blur-in":
        return "opacity-100 blur-none translate-y-0";
      case "slide-left":
      case "fade-left":
      case "slide-right":
      case "fade-right":
        return "opacity-100 translate-x-0";
      default:
        return "opacity-100";
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(baseStyles, getAnimationStyles(), className)}
    >
      {children}
    </div>
  );
}
