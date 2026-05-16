"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { PrecisionContent } from "@/types/content";

interface Props {
  data: PrecisionContent;
}

export default function Precision({ data }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="precision" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#F7F5F0" }}>
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">04</div>

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
                {data.headline_line1}<br />{data.headline_line2}
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

        {/* Masonry-style gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {data.galeria.map((item, i) => (
            <motion.button
              key={item.id}
              className="relative block w-full overflow-hidden group"
              style={{ breakInside: "avoid" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              onClick={() => setLightbox(item.image_url)}
              aria-label={`Ver: ${item.caption}`}
            >
              <div
                className="relative overflow-hidden"
                style={{ clipPath: i % 2 === 0 ? "polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)" : "polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 15%)" }}
              >
                <Image
                  src={item.image_url}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ height: i % 3 === 1 ? "280px" : "220px", objectFit: "cover" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-jaco-blue opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div
                  className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  style={{ background: "rgba(10,19,66,0.85)" }}
                >
                  <p className="text-white text-sm font-mono tracking-wide">{item.caption}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[500] flex items-center justify-center p-4"
            style={{ background: "rgba(10,19,66,0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-jaco-red transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Cerrar imagen"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              className="relative max-w-4xl max-h-[85vh] w-full"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox}
                alt="Imagen ampliada"
                width={1200}
                height={800}
                className="object-contain max-h-[85vh] w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
