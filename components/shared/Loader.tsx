"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Don't show loader on subsequent navigations (session storage flag)
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
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "#0A1342" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Three triangles assembling into JACO logo */}
          <div className="relative w-32 h-32">
            {/* Triangle 1 — blue */}
            <motion.div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "48px solid transparent",
                borderRight: "48px solid transparent",
                borderBottom: "72px solid #001A8B",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Triangle 2 — red */}
            <motion.div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "40px solid transparent",
                borderRight: "40px solid transparent",
                borderTop: "60px solid #B90001",
                bottom: 0,
                left: 4,
              }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Triangle 3 — dark */}
            <motion.div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "40px solid transparent",
                borderRight: "40px solid transparent",
                borderTop: "60px solid #0A0A0A",
                bottom: 0,
                right: 4,
              }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {/* JACO text */}
          <motion.div
            className="absolute bottom-[40%] text-white"
            style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.5rem", letterSpacing: "0.4em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            MAQUINADOS JACO
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
