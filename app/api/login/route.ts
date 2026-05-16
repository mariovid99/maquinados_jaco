import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({}));

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    console.error("Variables de entorno de autenticación no configuradas");
    return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 500 });
  }

  let match = false;
  try {
    const given = Buffer.from(password, "utf8");
    const expected = Buffer.from(adminPassword, "utf8");
    if (given.length === expected.length) {
      match = crypto.timingSafeEqual(given, expected);
    }
  } catch {
    match = false;
  }

  if (!match) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = signToken({ role: "admin" });
  return NextResponse.json({ token });
}
