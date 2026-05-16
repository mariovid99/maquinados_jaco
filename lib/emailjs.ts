import emailjs from "@emailjs/browser";
import { ContactFormData } from "@/types/content";

export async function sendContactEmail(data: ContactFormData) {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      nombre: data.nombre,
      empresa: data.empresa || "No especificada",
      email: data.email,
      telefono: data.telefono,
      servicio: data.servicio,
      mensaje: data.mensaje,
    },
    {
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    }
  );
}
