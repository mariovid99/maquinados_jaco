"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "left" | "right" | "top" | "bottom";
}

export default function ClipReveal({ children, delay = 0, duration = 1, className = "", direction = "left" }: Props) {
  const initial = {
    left: { clipPath: "inset(0 100% 0 0)" },
    right: { clipPath: "inset(0 0 0 100%)" },
    top: { clipPath: "inset(0 0 100% 0)" },
    bottom: { clipPath: "inset(100% 0 0 0)" },
  };
  return (
    <motion.div
      className={className}
      initial={initial[direction]}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
