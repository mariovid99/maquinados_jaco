"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { TestimonioItem } from "@/types/content";
import BrandStripes from "@/components/shared/BrandStripes";

interface Props {
  data: TestimonioItem[];
}

export default function Testimonios({ data }: Props) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + data.length) % data.length);
  const next = () => setActive((a) => (a + 1) % data.length);

  const t = data[active];

  return (
    <section id="testimonios" className="relative py-24 md:py-32 overflow-hidden bg-white">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 -left-4" aria-hidden="true">11</div>

      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-5"
        style={{ background: "linear-gradient(135deg, #001A8B 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">11 / TESTIMONIOS</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2
              className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              LO QUE DICEN
              <br />
              <span style={{ color: "#B90001" }}>NUESTROS CLIENTES</span>
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <AccentBar color="red" length="md" className="mx-auto mt-3" />
          </FadeInUp>
        </div>

        {/* Slider */}
        <div className="max-w-3xl mx-auto">
          <FadeInUp delay={0.3}>
            <div className="relative p-10 md:p-14 border border-gray-100 bg-white">
              {/* Quote icon */}
              <Quote
                className="absolute top-6 left-6 w-10 h-10 opacity-10"
                style={{ color: "#001A8B" }}
              />

              {/* Content */}
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed italic mb-8">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl text-white"
                    style={{ background: "#001A8B" }}
                  >
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-jaco-black">{t.nombre}</p>
                    <p className="text-sm text-gray-500">{t.cargo} · {t.empresa}</p>
                  </div>
                </div>
              </motion.div>

              {/* Red left border */}
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-jaco-red rounded-r-sm" />
            </div>
          </FadeInUp>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-jaco-red" : "w-3 bg-gray-200"
                  }`}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Anterior testimonio"
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-jaco-red hover:text-jaco-red transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente testimonio"
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-jaco-red hover:text-jaco-red transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
