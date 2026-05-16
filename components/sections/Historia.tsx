"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { HistoriaContent } from "@/types/content";

interface Props {
  data: HistoriaContent;
}

export default function Historia({ data }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#F7F5F0" }}
    >
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">02</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2
              className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {data.headline}
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-gray-500 max-w-xl mx-auto">{data.subtitle}</p>
          </FadeInUp>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" aria-hidden="true">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-jaco-red"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-0">
            {data.hitos.map((hito, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={hito.id}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 ${
                    i > 0 ? "md:-mt-4" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Left content (odd items on desktop right, even on left) */}
                  <div className={`${isLeft ? "md:text-right md:pr-12" : "md:order-2 md:text-left md:pl-12"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span
                        className="font-display text-6xl md:text-7xl leading-none tracking-tighter"
                        style={{ color: "#E5E5E8" }}
                      >
                        {hito.year}
                      </span>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-jaco-black mt-2 mb-3">
                        {hito.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-sm ml-auto">
                        {hito.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Center dot */}
                  <div className={`hidden md:flex items-start justify-center absolute left-1/2 -translate-x-1/2 mt-6 ${isLeft ? "" : ""}`}>
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-jaco-red bg-white"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, type: "spring" }}
                    />
                  </div>

                  {/* Right empty on desktop (spacer) */}
                  <div className={`hidden md:block ${isLeft ? "md:order-2" : "md:order-1"}`} />

                  {/* Mobile left border */}
                  <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-gray-200">
                    <motion.div
                      className="w-full bg-jaco-red"
                      initial={{ height: 0 }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
