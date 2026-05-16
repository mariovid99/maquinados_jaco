import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client, streamToBuffer } from "@/lib/s3";
import { migrateContent } from "@/lib/content-migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const s3 = getS3Client();
    const cmd = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: "content.json",
    });
    const res = await s3.send(cmd);
    const buf = await streamToBuffer(res.Body as AsyncIterable<Uint8Array>);
    const raw = JSON.parse(buf.toString("utf-8"));
    const content = migrateContent(raw);

    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err: unknown) {
    const error = err as { name?: string };
    if (error.name === "NoSuchKey") {
      return NextResponse.json(migrateContent({}), {
        headers: { "Cache-Control": "no-store" },
      });
    }
    console.error("Error leyendo content.json:", err);
    return NextResponse.json({ error: "Error al cargar contenido" }, { status: 500 });
  }
}
