"use client";

import Image from "next/image";
import { motion } from "motion/react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { ClienteItem } from "@/types/content";

interface Props {
  data: ClienteItem[];
}

export default function Clientes({ data }: Props) {
  return (
    <section id="clientes" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#F7F5F0" }}>
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">10</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">10 / NUESTROS CLIENTES</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2
              className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              EMPRESAS QUE CONFÍAN
              <br />
              <span style={{ color: "#B90001" }}>EN NOSOTROS</span>
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-gray-500 max-w-lg mx-auto">
              Grandes industrias del norte de México y del mundo nos eligen para sus proyectos más exigentes.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.25}>
            <AccentBar color="red" length="md" className="mx-auto mt-5" />
          </FadeInUp>
        </div>

        {/* Clients grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data.map((cliente, i) => (
            <motion.div
              key={cliente.id}
              className="group relative flex items-center justify-center p-8 border border-gray-100 bg-white hover:border-jaco-blue transition-colors duration-300"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <div className="flex flex-col items-center gap-2">
                {cliente.logo_url ? (
                  <div className="relative w-28 h-14 grayscale group-hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={cliente.logo_url}
                      alt={cliente.nombre}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  </div>
                ) : (
                  <div
                    className="w-16 h-16 rounded flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300"
                    style={{ background: "#F7F5F0" }}
                  >
                    <span className="font-display text-2xl text-gray-300 group-hover:text-jaco-blue transition-colors">
                      {cliente.nombre.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-400 text-center font-mono leading-tight group-hover:text-jaco-blue transition-colors">
                  {cliente.nombre}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
