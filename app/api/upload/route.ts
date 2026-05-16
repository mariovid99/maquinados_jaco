import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";

export const runtime = "nodejs";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: NextRequest) {
  try {
    verifyToken(request);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Token inválido";
    return NextResponse.json({ error: "No autorizado: " + message }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Content-Type inválido para subida de archivo" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "El archivo supera el límite de 4 MB." }, { status: 400 });
  }

  const ext = MIME_TO_EXT[file.type] || ".jpg";
  const randomHex = crypto.randomBytes(6).toString("hex");
  const key = `images/${Date.now()}-${randomHex}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return NextResponse.json({ url, key });
  } catch (err) {
    console.error("Error subiendo imagen a S3:", err);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
