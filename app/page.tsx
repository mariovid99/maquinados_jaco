import { Toaster } from "sonner";
import { getContentFromS3 } from "@/lib/content";
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

export const revalidate = 60;

export default async function HomePage() {
  const content = await getContentFromS3();

  return (
    <>
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
