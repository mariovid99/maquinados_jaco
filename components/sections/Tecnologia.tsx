"use client";

import { motion } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { TecnologiaContent } from "@/types/content";
import BrandStripes from "@/components/shared/BrandStripes";

interface Props {
  data: TecnologiaContent;
}

export default function Tecnologia({ data }: Props) {
  return (
    <section id="tecnologia" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 -left-4" aria-hidden="true">07</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <FadeInUp>
              <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <div className="flex items-start gap-4 mb-5">
                <AccentBar variant="vertical" color="stack" length="sm" className="mt-1 shrink-0" />
                <h2
                  className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                  {data.headline_line1}<br />
                  {data.headline_line2}<br />
                  {data.headline_line3}
                </h2>
              </div>
            </FadeInUp>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <FadeInUp delay={0.2}>
              <p className="text-gray-600 leading-relaxed">{data.description}</p>
            </FadeInUp>
          </div>
        </div>

        {/* Software grid */}
        <h3 className="font-mono text-xs tracking-widest text-jaco-blue uppercase mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-jaco-blue" />SOFTWARE QUE UTILIZAMOS
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {data.software.map((sw, i) => (
            <motion.div
              key={sw.id}
              className="group flex flex-col items-center justify-center p-4 border border-gray-100 hover:border-jaco-red transition-colors duration-200 aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              {/* Placeholder logo — replace with actual SVG files */}
              <div
                className="w-12 h-12 rounded flex items-center justify-center mb-2 grayscale group-hover:grayscale-0 transition-all duration-300"
                style={{ background: "#F1F1F2" }}
              >
                <span className="font-display text-xs text-center leading-tight text-gray-600 group-hover:text-jaco-blue px-1">
                  {sw.name.split(" ")[0]}
                </span>
              </div>
              <span className="text-xs text-gray-400 text-center leading-tight group-hover:text-gray-700 transition-colors">
                {sw.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
