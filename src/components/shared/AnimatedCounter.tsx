"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function AnimatedCounter({
  label,
  sublabel,
  from = 0,
}: {
  label: string;
  sublabel: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const numericMatch = label.match(/\d+(\.\d+)?/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const decimals = numericMatch?.[1]?.length ? numericMatch[1].length - 1 : 0;
  const suffix = numericMatch ? label.replace(numericMatch[0], "") : label;
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (!isInView || numericValue === null) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(from + (numericValue! - from) * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, numericValue, from]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="font-display text-3xl text-chocolate-900 sm:text-4xl">
        {numericValue !== null ? `${displayValue.toFixed(decimals)}${suffix}` : label}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-chocolate-700/60">{sublabel}</p>
    </motion.div>
  );
}
