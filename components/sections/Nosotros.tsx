"use client";

import { motion } from "motion/react";
import { Award, Leaf, ShieldCheck, Cog, Star, Workflow, Settings } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { NosotrosContent } from "@/types/content";
import BrandStripes from "@/components/shared/BrandStripes";

const iconMap: Record<string, React.ReactNode> = {
  Award: <Award className="w-8 h-8" />,
  Leaf: <Leaf className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Cog: <Cog className="w-8 h-8" />,
  Star: <Star className="w-8 h-8" />,
  Workflow: <Workflow className="w-8 h-8" />,
  Settings: <Settings className="w-8 h-8" />,
};

interface Props {
  data: NosotrosContent;
}

export default function Nosotros({ data }: Props) {
  return (
    <section id="nosotros" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 -left-4" aria-hidden="true">01</div>

      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-50" aria-hidden="true" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="flex items-start gap-4 mb-4">
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
            <div className="flex flex-col gap-4 mt-6 max-w-2xl">
              <p className="text-gray-600 leading-relaxed">{data.desc1}</p>
              {data.desc2 && <p className="text-gray-600 leading-relaxed">{data.desc2}</p>}
            </div>
          </FadeInUp>
        </div>

        {/* 4 pilares — bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.pilares.map((pilar, i) => (
            <motion.div
              key={i}
              className="group relative clip-card bg-white border border-gray-100 p-8 cursor-default"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              {/* Hover red bar at bottom */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-jaco-red origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon */}
              <div className="relative mb-6 inline-block">
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-sm"
                  style={{ background: "#F1F1F2", color: "#001A8B" }}
                >
                  {iconMap[pilar.icon] || <Settings className="w-8 h-8" />}
                </div>
                {/* Red corner dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-jaco-red" />
              </div>

              <h3 className="font-display text-xl uppercase tracking-wider text-jaco-black mb-3 leading-tight group-hover:text-jaco-blue transition-colors">
                {pilar.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{pilar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
