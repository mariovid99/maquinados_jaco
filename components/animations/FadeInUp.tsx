"use client";

import { motion, MotionProps } from "motion/react";
import { ReactNode } from "react";

interface Props extends MotionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
}

export default function FadeInUp({ children, delay = 0, duration = 0.7, className = "", y = 40, ...rest }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
