"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import AccentBar from "@/components/animations/AccentBar";
import { ContactoContent } from "@/types/content";
import { sendContactEmail } from "@/lib/email";
import BrandStripes from "@/components/shared/BrandStripes";

const schema = z.object({
  nombre: z.string().min(2, "Nombre muy corto"),
  empresa: z.string().optional(),
  email: z.string().email("Email inválido"),
  telefono: z.string().regex(/^(\+?52)?[\s\-]?(\d{2,3})[\s\-]?(\d{3,4})[\s\-]?(\d{4})$/, "Teléfono inválido (formato MX)"),
  servicio: z.string().min(1, "Selecciona un servicio"),
  mensaje: z.string().min(20, "Mensaje muy corto (mínimo 20 caracteres)").max(1000),
  privacidad: z.literal(true, { errorMap: () => ({ message: "Debes aceptar el aviso de privacidad" }) }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: ContactoContent;
}

export default function Contacto({ data }: Props) {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    setSending(true);
    try {
      await sendContactEmail(values);
      toast.success("¡Solicitud enviada con éxito! Te contactaremos pronto.", { duration: 5000 });
      reset();
    } catch {
      toast.error("Error al enviar. Por favor contacta por WhatsApp.", { duration: 6000 });
    } finally {
      setSending(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 border text-sm transition-colors outline-none focus:border-jaco-blue bg-white ${
      hasError ? "border-jaco-red" : "border-gray-200 hover:border-gray-400"
    }`;

  return (
    <section id="contacto" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <BrandStripes />
      {/* Section number */}
      <div className="section-num top-8 right-4" aria-hidden="true">13</div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeInUp>
            <p className="font-mono text-sm text-jaco-red tracking-widest mb-3 uppercase">{data.label}</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2
              className="font-display uppercase leading-[0.9] tracking-tight text-jaco-black mb-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {data.headline}
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-gray-500 max-w-md mx-auto">{data.subtitle}</p>
          </FadeInUp>
          <FadeInUp delay={0.25}>
            <AccentBar color="red" length="md" className="mx-auto mt-4" />
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — Form (7 cols) */}
          <div className="lg:col-span-7">
            <FadeInUp delay={0.3}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nombre completo <span className="text-jaco-red">*</span>
                    </label>
                    <input {...register("nombre")} className={inputClass(!!errors.nombre)} placeholder="Tu nombre" />
                    {errors.nombre && <p className="mt-1 text-xs text-jaco-red">{errors.nombre.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Empresa</label>
                    <input {...register("empresa")} className={inputClass()} placeholder="Nombre de tu empresa" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-jaco-red">*</span>
                    </label>
                    <input {...register("email")} type="email" className={inputClass(!!errors.email)} placeholder="tu@email.com" />
                    {errors.email && <p className="mt-1 text-xs text-jaco-red">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Teléfono <span className="text-jaco-red">*</span>
                    </label>
                    <input {...register("telefono")} type="tel" className={inputClass(!!errors.telefono)} placeholder="81 1234 5678" />
                    {errors.telefono && <p className="mt-1 text-xs text-jaco-red">{errors.telefono.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tipo de servicio <span className="text-jaco-red">*</span>
                  </label>
                  <select {...register("servicio")} className={inputClass(!!errors.servicio)}>
                    <option value="">Selecciona un servicio</option>
                    <option value="Manufactura CNC">Manufactura CNC</option>
                    <option value="Soldadura">Soldadura</option>
                    <option value="Diseño CAD-CAM">Diseño CAD-CAM</option>
                    <option value="Comercialización">Comercialización</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.servicio && <p className="mt-1 text-xs text-jaco-red">{errors.servicio.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mensaje <span className="text-jaco-red">*</span>
                  </label>
                  <textarea
                    {...register("mensaje")}
                    rows={5}
                    className={inputClass(!!errors.mensaje)}
                    placeholder="Cuéntanos sobre tu proyecto, piezas, materiales, tolerancias, volumen..."
                  />
                  {errors.mensaje && <p className="mt-1 text-xs text-jaco-red">{errors.mensaje.message}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input {...register("privacidad")} type="checkbox" className="mt-1 accent-jaco-red" />
                    <span className="text-sm text-gray-500">
                      Acepto el aviso de privacidad y el uso de mis datos para ser contactado por Maquinados JACO.
                    </span>
                  </label>
                  {errors.privacidad && <p className="mt-1 text-xs text-jaco-red">{errors.privacidad.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-jaco-red text-white font-semibold tracking-widest uppercase text-sm rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "ENVIANDO..." : "ENVIAR SOLICITUD"}
                  {!sending && <Send className="w-4 h-4" />}
                </button>
              </form>
            </FadeInUp>
          </div>

          {/* Right — Info + map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <FadeInUp delay={0.4}>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jaco-red flex items-center justify-center shrink-0 rounded-sm">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-0.5">TELÉFONO</p>
                    <a href={data.phone_href} className="text-jaco-black hover:text-jaco-red transition-colors font-medium">
                      {data.phone_display}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jaco-blue flex items-center justify-center shrink-0 rounded-sm">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-0.5">EMAIL</p>
                    <a href={`mailto:${data.email}`} className="text-jaco-black hover:text-jaco-blue transition-colors font-medium break-all">
                      {data.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-700 flex items-center justify-center shrink-0 rounded-sm">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-0.5">DIRECCIÓN</p>
                    <p className="text-jaco-black font-medium">{data.address_line1}</p>
                    <p className="text-gray-500 text-sm">{data.address_line2}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center shrink-0 rounded-sm">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-0.5">HORARIOS</p>
                    <p className="text-jaco-black text-sm">{data.hours_weekday}</p>
                    <p className="text-gray-500 text-sm">{data.hours_saturday}</p>
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Map embed */}
            <FadeInUp delay={0.5}>
              <div className="relative overflow-hidden clip-shard-tr" style={{ height: "240px" }}>
                <iframe
                  title="Ubicación Maquinados JACO en Google Maps"
                  src={data.maps_embed_src}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
