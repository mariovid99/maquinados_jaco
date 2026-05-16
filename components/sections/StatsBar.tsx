"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { StatItem } from "@/types/content";

interface Props {
  data: StatItem[];
}

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [active, value]);

  return (
    <span className="font-display text-jaco-red" style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}>
      {count}{suffix}
    </span>
  );
}

export default function StatsBar({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" ref={ref} className="relative overflow-hidden py-16 md:py-20 bg-white">
      {/* Diagonal red accent */}
      <div
        className="absolute -top-4 left-0 right-0 h-8"
        style={{ background: "#B90001", clipPath: "polygon(0 0, 100% 60%, 100% 100%, 0 100%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-4 left-0 right-0 h-8"
        style={{ background: "#001A8B", clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 100%)" }}
        aria-hidden="true"
      />

      {/* Bone background tint */}
      <div className="absolute inset-0" style={{ background: "#F7F5F0" }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {data.map((stat, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center gap-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Counter value={stat.value} suffix={stat.suffix} active={inView} />
              <span className="text-gray-500 text-sm tracking-wide uppercase font-mono">
                {stat.label}
              </span>
              {/* Decorative line */}
              <motion.div
                className="mt-2 h-0.5 bg-jaco-blue"
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
