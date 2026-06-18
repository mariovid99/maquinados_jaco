import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Destino de las solicitudes del formulario y remitente.
// CONTACT_TO_EMAIL: a dónde llegan los correos (default: buzón de contacto).
// CONTACT_FROM_EMAIL: remitente verificado en Resend. Mientras no verifiques
// tu dominio en Resend, usa "onboarding@resend.dev".
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contacto@maquinadosjaco.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Maquinados JACO <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY no está configurada");
    return NextResponse.json(
      { error: "Servicio de correo no configurado" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const empresa = String(body.empresa ?? "").trim();
  const email = String(body.email ?? "").trim();
  const telefono = String(body.telefono ?? "").trim();
  const servicio = String(body.servicio ?? "").trim();
  const mensaje = String(body.mensaje ?? "").trim();

  if (!nombre || !email || !telefono || !servicio || !mensaje) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px;">
      <h2 style="color: #b90001; margin-bottom: 4px;">Nueva solicitud de contacto</h2>
      <p style="color: #666; margin-top: 0;">Formulario del sitio web — Maquinados JACO</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Nombre</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(nombre)}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Empresa</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(empresa || "No especificada")}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Teléfono</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(telefono)}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Servicio</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(servicio)}</td></tr>
      </table>
      <div style="margin-top: 16px;">
        <p style="font-weight: bold; margin-bottom: 4px;">Mensaje:</p>
        <p style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 4px;">${escapeHtml(mensaje)}</p>
      </div>
    </div>
  `;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nueva solicitud: ${servicio} — ${nombre}`,
      html,
    });

    if (error) {
      console.error("Error de Resend:", error);
      return NextResponse.json(
        { error: "No se pudo enviar el correo" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando correo:", err);
    return NextResponse.json(
      { error: "No se pudo enviar el correo" },
      { status: 500 }
    );
  }
}
