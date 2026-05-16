"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { HeroContent } from "@/types/content";

interface Props {
  data: HeroContent;
}

const wordVariant = {
  hidden: { opacity: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
  show: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
};

export default function Hero({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();
      });

      // Draw connection lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animFrame = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleScrollDown = () => {
    const el = document.getElementById("stats");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1342 0%, #001A8B 55%, #0A0A0A 100%)" }}
      aria-label="Hero principal"
    >
      {/* Background image */}
      {data.bg_image_url && (
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src={data.bg_image_url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />

      {/* Large JACO logo watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-[1] pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="relative"
          style={{ width: "min(60vh, 600px)", height: "min(60vh, 600px)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/logos/jaco-icon-dark.png"
            alt=""
            fill
            className="object-contain opacity-8"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.06 }}
            sizes="600px"
          />
        </motion.div>
      </div>

      {/* Geometric accent lines */}
      <div className="absolute right-0 top-0 h-full w-2 z-[1] opacity-60" style={{ background: "#001A8B" }} aria-hidden="true" />
      <div className="absolute right-2 top-0 h-full w-0.5 z-[1] opacity-30" style={{ background: "#B90001" }} aria-hidden="true" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-1 h-5 rounded-sm" style={{ background: "#B90001" }} />
            <span className="text-white/70 text-sm font-mono tracking-widest uppercase">
              {data.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display uppercase leading-[0.9] tracking-tight mb-8"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
          >
            <motion.span className="block text-white" variants={wordVariant} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              {data.headline_line1}
            </motion.span>
            <motion.span
              className="block"
              variants={wordVariant}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ color: "#B90001" }}
            >
              {data.headline_accent}
            </motion.span>
            <motion.span className="block text-white" variants={wordVariant} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              {data.headline_line3}
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            {data.subheading}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <a
              href={data.cta_primary_href}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold tracking-widest uppercase text-sm rounded-sm transition-all duration-300 hover:gap-4"
              style={{ background: "#B90001" }}
              onClick={(e) => {
                e.preventDefault();
                const id = data.cta_primary_href.replace("#", "");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {data.cta_primary_text}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a
              href={data.cta_secondary_href}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold tracking-widest uppercase text-sm rounded-sm border-2 border-white text-white transition-all duration-300 hover:bg-white hover:text-jaco-blue-deep"
              onClick={(e) => {
                e.preventDefault();
                const id = data.cta_secondary_href.replace("#", "");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {data.cta_secondary_text}
            </a>
          </motion.div>

          {/* Inline stats */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <div className="w-6 h-px" style={{ background: "#B90001" }} />
            <span className="text-white/50 font-mono text-xs tracking-widest">
              {data.inline_stats}
            </span>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
