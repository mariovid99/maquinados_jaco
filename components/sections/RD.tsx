"use client";

import Image from "next/image";
import { motion } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { ResearchContent } from "@/types/content";
import BrandStripes from "@/components/shared/BrandStripes";

interface Props {
  data: ResearchContent;
}

export default function RD({ data }: Props) {
  return (
    <section id="rd" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 -left-4" aria-hidden="true">03</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — text (7 cols) */}
          <div className="lg:col-span-7">
            <FadeInUp>
              <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <div className="flex items-start gap-4 mb-6">
                <AccentBar variant="vertical" color="stack" length="sm" className="mt-1 shrink-0" />
                <h2
                  className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                >
                  {data.headline}
                </h2>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-gray-600 leading-relaxed mb-5">{data.desc1}</p>
              <p className="text-gray-600 leading-relaxed mb-10">{data.desc2}</p>
            </FadeInUp>

            {/* Enfoque block */}
            <FadeInUp delay={0.3}>
              <div className="border-l-4 border-jaco-red pl-6 py-2">
                <h3 className="font-display text-2xl uppercase tracking-wider text-jaco-blue mb-3">
                  {data.enfoque_title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{data.enfoque_desc}</p>
              </div>
            </FadeInUp>
          </div>

          {/* Right — image (5 cols) */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/5] clip-shard-tl overflow-hidden">
              <Image
                src={data.image_url}
                alt="Investigación y desarrollo industrial en JACO"
                fill
                className="object-cover scale-110 hover:scale-100 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, #001A8B33)" }} />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 p-4 bg-jaco-red text-white rounded-sm">
              <p className="font-mono text-xs tracking-widest">±0.005 mm</p>
              <p className="font-display text-xl uppercase">TOLERANCIA</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
