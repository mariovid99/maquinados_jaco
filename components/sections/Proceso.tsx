"use client";

import { motion } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { ProcesoContent } from "@/types/content";

interface Props {
  data: ProcesoContent;
}

export default function Proceso({ data }: Props) {
  return (
    <section id="proceso" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#F7F5F0" }}>
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">06</div>

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" aria-hidden="true" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-14">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="flex items-start gap-4 mb-5">
              <AccentBar variant="vertical" color="red" length="sm" className="mt-1 shrink-0" />
              <h2
                className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                {data.headline}
              </h2>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
              <p className="text-gray-600 leading-relaxed">{data.desc1}</p>
              <p className="text-gray-600 leading-relaxed">{data.desc2}</p>
            </div>
          </FadeInUp>
        </div>

        {/* Process subtitle */}
        <FadeInUp delay={0.3}>
          <p className="font-mono text-sm text-jaco-blue tracking-widest uppercase mb-10 flex items-center gap-3">
            <span className="h-px w-8 bg-jaco-blue" />
            {data.subtitle_pasos}
          </p>
        </FadeInUp>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-0 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gray-200 z-0" aria-hidden="true">
            <motion.div
              className="h-full bg-jaco-red origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>

          {data.pasos.map((paso, i) => (
            <motion.div
              key={paso.id}
              className="relative z-10 group flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Step number circle */}
              <div
                className="relative w-20 h-20 flex items-center justify-center rounded-full mb-5 transition-colors duration-300 group-hover:bg-jaco-red"
                style={{ background: "#001A8B" }}
              >
                <span
                  className="font-display text-3xl text-white"
                >
                  {paso.number}
                </span>
                {/* Connecting arrow (not last) */}
                {i < data.pasos.length - 1 && (
                  <div className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 text-gray-300 font-mono text-xl">→</div>
                )}
              </div>

              <h3 className="font-display text-xl uppercase tracking-wider text-jaco-black mb-3 group-hover:text-jaco-red transition-colors">
                {paso.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{paso.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
