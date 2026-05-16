"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "INICIO", href: "#hero" },
  { label: "NOSOTROS", href: "#nosotros" },
  { label: "SERVICIOS", href: "#servicios" },
  { label: "PROCESO", href: "#proceso" },
  { label: "CLIENTES", href: "#clientes" },
  { label: "CONTACTO", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] h-20 flex items-center transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b-2 border-jaco-red"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Maquinados JACO - Inicio">
            <div className="relative h-[48px] w-[170px]">
              <Image
                src="/logos/jaco-full.png"
                alt="Maquinados JACO"
                fill
                className="object-contain object-left"
                style={scrolled ? {} : { filter: "brightness(0) invert(1)" }}
                sizes="170px"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative text-sm font-semibold tracking-wider transition-colors duration-200 group ${
                  scrolled ? "text-jaco-black" : "text-white"
                }`}
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-jaco-red transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/528114883334?text=Hola%20JACO%2C%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={`hidden md:flex items-center gap-2 transition-colors ${scrolled ? "text-gray-600 hover:text-jaco-red" : "text-white/80 hover:text-white"}`}
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => handleNavClick("#contacto")}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider text-white uppercase bg-jaco-red hover:bg-red-700 transition-colors duration-200 rounded-sm"
            >
              COTIZAR
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className={`lg:hidden p-2 ${scrolled ? "text-jaco-black" : "text-white"}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ background: "#0A1342" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 h-20">
              <div className="relative h-[48px] w-[170px]">
                <Image src="/logos/jaco-full.png" alt="Maquinados JACO" fill className="object-contain object-left brightness-0 invert" sizes="170px" />
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="text-white p-2">
                <X className="w-7 h-7" />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-1 gap-8" aria-label="Menú móvil">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white text-4xl font-display tracking-widest hover:text-jaco-red transition-colors"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                href="https://wa.me/528114883334?text=Hola%20JACO%2C%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-8 py-4 bg-jaco-red text-white text-lg font-semibold tracking-widest rounded-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                COTIZAR AHORA
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
