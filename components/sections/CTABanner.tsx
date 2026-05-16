"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import { CtaBannerContent } from "@/types/content";

interface Props {
  data: CtaBannerContent;
}

export default function CTABanner({ data }: Props) {
  return (
    <section
      className="relative py-24 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1342 0%, #001A8B 60%, #0A0A0A 100%)" }}
      aria-label="Llamada a la acción"
    >
      {/* Geometric decorations */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#B90001" }} aria-hidden="true" />
      <div
        className="absolute inset-0 dot-grid opacity-20"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-0 w-64 h-64 opacity-5"
        style={{
          background: "radial-gradient(circle, #B90001 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 text-center">
        <FadeInUp>
          <h2
            className="font-display uppercase text-white leading-[0.9] tracking-tight mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            {data.headline}
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">{data.description}</p>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href={data.cta_primary_href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-semibold tracking-widest uppercase text-sm rounded-sm"
              style={{ background: "#25D366" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="w-5 h-5" />
              {data.cta_primary_text}
            </motion.a>
            <motion.a
              href={data.cta_secondary_href}
              onClick={(e) => {
                e.preventDefault();
                const id = data.cta_secondary_href.replace("#", "");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold tracking-widest uppercase text-sm rounded-sm border-2 border-white text-white transition-colors hover:bg-white hover:text-jaco-blue-deep"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {data.cta_secondary_text} →
            </motion.a>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
