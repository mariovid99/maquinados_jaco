"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { FaqItem } from "@/types/content";

interface Props {
  data: FaqItem[];
}

export default function FAQ({ data }: Props) {
  const [open, setOpen] = useState<string | null>(data[0]?.id || null);

  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#F7F5F0" }}>
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">12</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left header */}
          <div className="lg:col-span-4">
            <FadeInUp>
              <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">12 / PREGUNTAS FRECUENTES</p>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <div className="flex items-start gap-4 mb-5">
                <AccentBar variant="vertical" color="red" length="sm" className="mt-1 shrink-0" />
                <h2
                  className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
                >
                  RESOLVEMOS TUS DUDAS
                </h2>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-gray-500 leading-relaxed mb-8">
                ¿Tienes preguntas antes de contactarnos? Aquí encontrarás las respuestas más comunes.
              </p>
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-jaco-red text-white font-semibold text-sm tracking-wider rounded-sm hover:bg-red-700 transition-colors"
              >
                CONTACTAR →
              </a>
            </FadeInUp>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-8 space-y-2">
            {data.map((item, i) => (
              <FadeInUp key={item.id} delay={i * 0.06}>
                <div className="border border-gray-200 bg-white">
                  <button
                    onClick={() => setOpen(open === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    aria-expanded={open === item.id}
                  >
                    <span className="font-medium text-jaco-black group-hover:text-jaco-blue transition-colors pr-4">
                      {item.pregunta}
                    </span>
                    <div
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-sm transition-colors"
                      style={{ background: open === item.id ? "#B90001" : "#F1F1F2", color: open === item.id ? "white" : "#6B6B70" }}
                    >
                      {open === item.id ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {open === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100">
                          {item.respuesta}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
