"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("jaco-loaded");
    if (hasLoaded) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("jaco-loaded", "1");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
          style={{ background: "#0A1342" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/logos/jaco-icon-light.png"
              alt="Maquinados JACO"
              width={120}
              height={120}
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.p
            style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.25rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.85)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            MAQUINADOS JACO
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
