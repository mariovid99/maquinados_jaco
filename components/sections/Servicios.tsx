"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Settings2, Flame, Pencil, ChevronRight } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { ServiciosContent } from "@/types/content";

const iconMap: Record<string, React.ReactNode> = {
  Settings2: <Settings2 className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Pencil: <Pencil className="w-6 h-6" />,
};

interface Props {
  data: ServiciosContent;
}

export default function Servicios({ data }: Props) {
  const [activeCol, setActiveCol] = useState(0);

  return (
    <section id="servicios" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#F7F5F0" }}>
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">08</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-14">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="flex items-start gap-4 mb-5">
              <AccentBar variant="vertical" color="blue" length="sm" className="mt-1 shrink-0" />
              <h2
                className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                {data.headline}
              </h2>
            </div>
          </FadeInUp>
        </div>

        {/* Tab headers (mobile) */}
        <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
          {data.columnas.map((col, i) => (
            <button
              key={col.id}
              onClick={() => setActiveCol(i)}
              className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-sm transition-colors ${
                activeCol === i
                  ? "bg-jaco-red text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {col.titulo.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* 3 columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.columnas.map((col, i) => (
            <motion.div
              key={col.id}
              className={`group relative clip-card p-8 border transition-all duration-300 ${
                activeCol === i ? "border-jaco-red" : "border-gray-100 hover:border-jaco-blue"
              } bg-white md:block ${i !== activeCol ? "hidden md:block" : "block"}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              onClick={() => setActiveCol(i)}
            >
              {/* Icon header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-sm transition-colors"
                  style={{ background: activeCol === i ? "#B90001" : "#001A8B", color: "white" }}
                >
                  {iconMap[col.icon] || <Settings2 className="w-6 h-6" />}
                </div>
                <h3 className="font-display text-lg uppercase tracking-wider text-jaco-black leading-tight">
                  {col.titulo}
                </h3>
              </div>

              {/* Services list */}
              <h4 className="font-mono text-xs tracking-widest text-jaco-blue uppercase mb-3">SERVICIOS</h4>
              <ul className="space-y-1.5 mb-6">
                {col.servicios.map((s, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-jaco-red shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>

              {/* Equipment/Software list */}
              {col.equipos.length > 0 && (
                <>
                  <h4 className="font-mono text-xs tracking-widest text-jaco-blue uppercase mb-3">
                    {col.equipo_label || "EQUIPO:"}
                  </h4>
                  <ul className="space-y-1.5">
                    {col.equipos.map((e, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                        <ChevronRight className="w-3 h-3 mt-1 text-gray-300 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
