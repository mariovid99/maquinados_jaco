import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";

const REQUIRED_KEYS = [
  "hero", "stats", "nosotros", "historia", "rd", "precision",
  "soldadura", "procesoSoluciones", "tecnologia", "servicios",
  "comercializacion", "clientes", "testimonios", "faq",
  "ctaBanner", "contacto", "footer",
];

export async function POST(request: NextRequest) {
  try {
    verifyToken(request);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Token inválido";
    return NextResponse.json({ error: "No autorizado: " + message }, { status: 401 });
  }

  const content = await request.json().catch(() => null);

  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in content)) {
      return NextResponse.json({ error: `Clave requerida faltante: ${key}` }, { status: 400 });
    }
  }

  content._updated = new Date().toISOString();
  content._version = ((content._version as number) || 0) + 1;

  try {
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: "content.json",
      Body: JSON.stringify(content, null, 2),
      ContentType: "application/json",
      CacheControl: "no-cache, no-store",
    }));

    return NextResponse.json({
      ok: true,
      updated: content._updated,
      version: content._version,
    });
  } catch (err) {
    console.error("Error guardando content.json:", err);
    return NextResponse.json({ error: "Error al guardar contenido" }, { status: 500 });
  }
}
