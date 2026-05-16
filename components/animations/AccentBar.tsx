"use client";

import { motion } from "motion/react";

type Variant = "vertical" | "horizontal";
type Color = "red" | "blue" | "stack";
type Length = "sm" | "md" | "lg" | "full";

interface Props {
  variant?: Variant;
  color?: Color;
  length?: Length;
  className?: string;
}

const colorMap = {
  red: "#B90001",
  blue: "#001A8B",
  stack: null,
};

const lengthMap = {
  sm: "40px",
  md: "60px",
  lg: "100px",
  full: "100%",
};

export default function AccentBar({ variant = "horizontal", color = "red", length = "md", className = "" }: Props) {
  const size = lengthMap[length];
  const isVertical = variant === "vertical";

  const style: React.CSSProperties = isVertical
    ? { width: "3px", height: size }
    : { height: "3px", width: size };

  if (color === "stack") {
    return (
      <div className={`flex ${isVertical ? "flex-col" : "flex-row"} ${className}`}>
        <motion.div
          style={isVertical ? { ...style, transformOrigin: "top", background: "#B90001" } : { ...style, background: "#B90001" }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          style={{ ...style, background: "#001A8B" }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ ...style, background: colorMap[color]!, borderRadius: "1px" }}
      initial={isVertical ? { scaleY: 0, originY: 1 } : { scaleX: 0, originX: 0 }}
      whileInView={isVertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
