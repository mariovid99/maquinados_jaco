import { ContactFormData } from "@/types/content";

export async function sendContactEmail(data: ContactFormData) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: data.nombre,
      empresa: data.empresa || "",
      email: data.email,
      telefono: data.telefono,
      servicio: data.servicio,
      mensaje: data.mensaje,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Error al enviar el correo");
  }

  return res.json();
}
