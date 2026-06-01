"use client";

import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { Toaster } from "sonner";
import { SiteContent } from "@/types/content";
import { migrateContent } from "@/lib/content-migration";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import Nosotros from "@/components/sections/Nosotros";
import Historia from "@/components/sections/Historia";
import RD from "@/components/sections/RD";
import Precision from "@/components/sections/Precision";
import Soldadura from "@/components/sections/Soldadura";
import Proceso from "@/components/sections/Proceso";
import Tecnologia from "@/components/sections/Tecnologia";
import Servicios from "@/components/sections/Servicios";
import Comercializacion from "@/components/sections/Comercializacion";
import Clientes from "@/components/sections/Clientes";
import FAQ from "@/components/sections/FAQ";
import CTABanner from "@/components/sections/CTABanner";
import Contacto from "@/components/sections/Contacto";

const PREVIEW_KEY = "jaco-preview-content";

export default function PreviewPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(PREVIEW_KEY);
    if (!raw) {
      setError(true);
      return;
    }
    try {
      setContent(migrateContent(JSON.parse(raw)));
    } catch {
      setError(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.removeItem(PREVIEW_KEY);
    window.close();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-sm">No hay contenido de vista previa disponible.</p>
          <a href="/admin" className="text-blue-600 hover:underline text-sm">
            Volver al admin
          </a>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A1342" }}>
        <p className="text-white font-mono tracking-widest text-sm">CARGANDO VISTA PREVIA...</p>
      </div>
    );
  }

  return (
    <>
      {/* Banner de vista previa */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-5 py-2.5 text-sm font-semibold shadow-lg" style={{ background: "#b97800", color: "#fff" }}>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 shrink-0" />
          <span>VISTA PREVIA — Estos cambios aún no han sido guardados</span>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center gap-1.5 px-3 py-1 rounded transition-colors"
          style={{ background: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        >
          <X className="w-3.5 h-3.5" />
          Cerrar vista previa
        </button>
      </div>

      {/* Espaciado para el banner */}
      <div className="h-10" />

      <Navbar />
      <main id="main-content">
        <Hero data={content.hero} />
        <StatsBar data={content.stats} />
        <Nosotros data={content.nosotros} />
        <Historia data={content.historia} />
        <RD data={content.rd} />
        <Precision data={content.precision} />
        <Soldadura data={content.soldadura} />
        <Proceso data={content.procesoSoluciones} />
        <Tecnologia data={content.tecnologia} />
        <Servicios data={content.servicios} />
        <Comercializacion data={content.comercializacion} />
        <Clientes data={content.clientes} />
        <FAQ data={content.faq} />
        <CTABanner data={content.ctaBanner} />
        <Contacto data={content.contacto} />
      </main>
      <Footer
        data={content.footer}
        contactPhone={content.contacto.phone_display}
        contactEmail={content.contacto.email}
        contactAddr1={content.contacto.address_line1}
        contactAddr2={content.contacto.address_line2}
      />
      <WhatsAppFloat href={content.contacto.whatsapp_href} />
      <Toaster position="top-right" richColors />
    </>
  );
}
