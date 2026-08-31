"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function FiscalScatterPlot({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const points = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
      connectionThreshold: Math.random() * 30 + 15,
    }));

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const rootStyle = getComputedStyle(document.documentElement);
      const textMuted = rootStyle.getPropertyValue("--text-muted").trim() || "#73736D";
      const borderSubtle = rootStyle.getPropertyValue("--border-subtle").trim() || "#EAEAE5";
      const accent = rootStyle.getPropertyValue("--accent").trim() || "#486581";

      const colors = {
        grid: toRgba(borderSubtle, 0.75),
        points: toRgba(textMuted, 0.72),
        highlight: toRgba(accent, 0.88),
        lines: toRgba(borderSubtle, 0.8),
      };

      // Draw subtle grid axes
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;

      // X and Y axes
      ctx.beginPath();
      ctx.moveTo(40, 20);
      ctx.lineTo(40, height - 40);
      ctx.lineTo(width - 20, height - 40);
      ctx.stroke();

      // Axis ticks
      for (let i = 1; i <= 5; i++) {
        // Y ticks
        ctx.beginPath();
        const yPos = height - 40 - ((height - 60) * (i / 5));
        ctx.moveTo(35, yPos);
        ctx.lineTo(40, yPos);
        ctx.stroke();

        // X ticks
        ctx.beginPath();
        const xPos = 40 + ((width - 60) * (i / 5));
        ctx.moveTo(xPos, height - 40);
        ctx.lineTo(xPos, height - 35);
        ctx.stroke();
      }

      // Draw and animate points
      points.forEach((p, idx) => {
        const px = 40 + (p.x / 100) * (width - 60);

        // Add subtle floating animation on the Y axis
        const floatingY = p.y + Math.sin(time * p.speed + p.phase) * 3;
        const py = height - 40 - (floatingY / 100) * (height - 60);

        // Connect points that are close
        points.forEach((otherP, otherIdx) => {
          if (idx === otherIdx) return;

          const ox = 40 + (otherP.x / 100) * (width - 60);
          const floatingOY = otherP.y + Math.sin(time * otherP.speed + otherP.phase) * 3;
          const oy = height - 40 - (floatingOY / 100) * (height - 60);

          const dist = Math.sqrt(Math.pow(px - ox, 2) + Math.pow(py - oy, 2));

          if (dist < p.connectionThreshold * (width / 200)) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);

            // Fading lines based on distance
            const opacity = 1 - (dist / (p.connectionThreshold * (width / 200)));
            ctx.strokeStyle = toRgba(borderSubtle, opacity * 0.9);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw points on top of lines
      points.forEach((p, idx) => {
        const px = 40 + (p.x / 100) * (width - 60);
        const floatingY = p.y + Math.sin(time * p.speed + p.phase) * 3;
        const py = height - 40 - (floatingY / 100) * (height - 60);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);

        if (idx % 7 === 0) {
          ctx.fillStyle = colors.highlight;
          // Pulse the highlight ones
          const pulseSize = p.size + Math.sin(time * 0.05) * 2;
          ctx.beginPath();
          ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = toRgba(accent, 0.16);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = colors.highlight;
        } else {
          ctx.fillStyle = colors.points;
        }

        ctx.fill();
      });

      time += 1;
      animationFrame = requestAnimationFrame(render);
    };

    const handleResize = () => {
      // Setup high-DPI canvas
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full inset-0 absolute pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70", className)}
    />
  );
}

export function DistributionCurve({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let animationFrame: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const rootStyle = getComputedStyle(document.documentElement);
      const textMuted = rootStyle.getPropertyValue("--text-muted").trim() || "#73736D";
      const borderSubtle = rootStyle.getPropertyValue("--border-subtle").trim() || "#EAEAE5";
      const accent = rootStyle.getPropertyValue("--accent").trim() || "#486581";

      // Baseline
      ctx.beginPath();
      ctx.moveTo(20, height - 30);
      ctx.lineTo(width - 20, height - 30);
      ctx.strokeStyle = toRgba(borderSubtle, 0.9);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Distribution Curve
      ctx.beginPath();
      const pointsData = [];
      const steps = 100;

      for (let i = 0; i <= steps; i++) {
        const x = (i / steps);
        const px = 20 + x * (width - 40);

        // Bell curve formula variation
        const mean1 = 0.4 + Math.sin(time * 0.01) * 0.05;
        const std1 = 0.15 + Math.cos(time * 0.015) * 0.02;

        const mean2 = 0.7 - Math.cos(time * 0.012) * 0.05;
        const std2 = 0.1 + Math.sin(time * 0.008) * 0.02;

        const val1 = Math.exp(-Math.pow(x - mean1, 2) / (2 * Math.pow(std1, 2)));
        const val2 = 0.6 * Math.exp(-Math.pow(x - mean2, 2) / (2 * Math.pow(std2, 2)));

        const y = val1 + val2;

        const py = height - 30 - y * (height - 60);
        pointsData.push({ px, py, y });

        if (i === 0) ctx.moveTo(px, height - 30);
        ctx.lineTo(px, py);
      }

      ctx.lineTo(width - 20, height - 30);
      ctx.closePath();

      // Fill gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, toRgba(textMuted, 0.2));
      gradient.addColorStop(1, toRgba(textMuted, 0.02));
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outline
      ctx.beginPath();
      pointsData.forEach(({ px, py }, i) => {
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = toRgba(textMuted, 0.84);
      ctx.lineWidth = 2;
      ctx.stroke();

      // Confidence Interval Box
      if (pointsData.length > 50) {
        const peakIdx = pointsData.indexOf(pointsData.reduce((prev, curr) => curr.py < prev.py ? curr : prev));
        if (peakIdx > 10 && peakIdx < 90) {
          const leftP = pointsData[peakIdx - 10];
          const rightP = pointsData[peakIdx + 10];

          ctx.fillStyle = toRgba(accent, 0.12);
          ctx.fillRect(leftP.px, 20, rightP.px - leftP.px, height - 50);

          ctx.strokeStyle = toRgba(accent, 0.55);
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(pointsData[peakIdx].px, pointsData[peakIdx].py);
          ctx.lineTo(pointsData[peakIdx].px, height - 30);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      time += 1;
      animationFrame = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full inset-0 absolute pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-90", className)}
    />
  );
}

function toRgba(color: string, alpha: number) {
  if (color.startsWith("#")) {
    const normalized = color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
    const value = Number.parseInt(normalized.slice(1), 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgb = color.match(/\d+(\.\d+)?/g);
  if (rgb && rgb.length >= 3) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }

  return `rgba(72, 101, 129, ${alpha})`;
}
