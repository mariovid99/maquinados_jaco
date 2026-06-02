"use client";

import Image from "next/image";
import { motion } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { ComercializacionContent } from "@/types/content";
import BrandStripes from "@/components/shared/BrandStripes";

interface Props {
  data: ComercializacionContent;
}

export default function Comercializacion({ data }: Props) {
  return (
    <section id="comercializacion" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 -left-4" aria-hidden="true">09</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-8">
            <FadeInUp>
              <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <div className="flex items-start gap-4 mb-5">
                <AccentBar variant="vertical" color="red" length="sm" className="mt-1 shrink-0" />
                <h2
                  className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  {data.headline}
                </h2>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-gray-600 leading-relaxed max-w-xl">{data.descripcion}</p>
            </FadeInUp>
          </div>
          <div className="lg:col-span-4">
            <FadeInUp delay={0.3}>
              <h3 className="font-mono text-xs tracking-widest text-jaco-blue uppercase mb-4">CATEGORÍAS</h3>
              <ul className="space-y-2">
                {data.categorias.map((cat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-jaco-red shrink-0" />
                    {cat}
                  </li>
                ))}
              </ul>
            </FadeInUp>
          </div>
        </div>

        {/* Brand marquee */}
        <FadeInUp delay={0.4}>
          <h3 className="font-mono text-xs tracking-widest text-jaco-blue uppercase mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-jaco-blue" />MARCAS QUE COMERCIALIZAMOS
          </h3>
        </FadeInUp>
        <div className="overflow-hidden border-t border-b border-gray-100 py-8">
          {/* Duplicate items for seamless loop */}
          <div className="marquee-track gap-12 items-center">
            {[...data.marcas, ...data.marcas].map((marca, i) => (
              <motion.div
                key={`${marca.id}-${i}`}
                className="shrink-0 px-6 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                {marca.logo_url ? (
                  <div className="relative h-10 w-28">
                    <Image
                      src={marca.logo_url}
                      alt={marca.nombre}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  </div>
                ) : (
                  <span className="font-display text-xl text-gray-400 tracking-wider whitespace-nowrap">
                    {marca.nombre}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
