"use client";

import Image from "next/image";
import { motion } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { SoldaduraContent } from "@/types/content";
import BrandStripes from "@/components/shared/BrandStripes";

interface Props {
  data: SoldaduraContent;
}

export default function Soldadura({ data }: Props) {
  return (
    <section id="soldadura" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 -left-4" aria-hidden="true">05</div>

      {/* Vertical display text */}
      <div
        className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 font-display text-5xl tracking-[0.4em] text-gray-100 rotate-90 select-none"
        aria-hidden="true"
      >
        {data.display_lateral}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left images */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-square clip-shard-br overflow-hidden">
              <Image
                src={data.galeria[0]?.image_url || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75"}
                alt={data.galeria[0]?.alt || "Soldadura industrial"}
                fill
                className="object-cover scale-110 hover:scale-100 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            {/* Accent bar */}
            <div className="absolute -bottom-4 -right-4 flex gap-1">
              <div className="w-1 h-16" style={{ background: "#B90001" }} />
              <div className="w-1 h-16" style={{ background: "#001A8B" }} />
            </div>
          </motion.div>

          {/* Right — text (7 cols) */}
          <div className="lg:col-span-7">
            <FadeInUp>
              <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <div className="flex items-start gap-4 mb-6">
                <AccentBar variant="vertical" color="blue" length="sm" className="mt-1 shrink-0" />
                <h2
                  className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                >
                  {data.headline}
                </h2>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-gray-600 leading-relaxed mb-4">{data.desc1}</p>
              <p className="text-gray-600 leading-relaxed mb-8">{data.desc2}</p>
            </FadeInUp>

            {/* Técnicas */}
            <FadeInUp delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {data.tecnicas.map((tec, i) => (
                  <motion.div
                    key={tec.id}
                    className="group relative p-5 border border-gray-100 hover:border-jaco-red transition-colors duration-200 clip-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="font-display text-3xl text-jaco-red mb-1">{tec.acronimo}</div>
                    <div className="font-mono text-xs text-gray-400 mb-2">{tec.nombre_completo}</div>
                    <p className="text-gray-600 text-sm">{tec.descripcion}</p>
                  </motion.div>
                ))}
              </div>
            </FadeInUp>

            {/* Aplicaciones */}
            <FadeInUp delay={0.5}>
              <h4 className="font-mono text-xs tracking-widest text-jaco-blue uppercase mb-3">APLICACIONES</h4>
              <ul className="flex flex-wrap gap-2">
                {data.aplicaciones.map((app, i) => (
                  <li
                    key={i}
                    className="px-3 py-1.5 text-sm border border-gray-200 text-gray-600 rounded-sm hover:border-jaco-red hover:text-jaco-red transition-colors"
                  >
                    {app}
                  </li>
                ))}
              </ul>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
