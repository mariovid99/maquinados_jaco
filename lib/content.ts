import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client, streamToBuffer } from "./s3";
import { SiteContent } from "@/types/content";
import { migrateContent } from "./content-migration";

export async function getContentFromS3(): Promise<SiteContent> {
  try {
    const s3 = getS3Client();
    const cmd = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: "content.json",
    });
    const res = await s3.send(cmd);
    const buf = await streamToBuffer(res.Body as AsyncIterable<Uint8Array>);
    const raw = JSON.parse(buf.toString("utf-8"));
    return migrateContent(raw);
  } catch {
    return migrateContent({});
  }
}
