import "server-only";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Stores an uploaded image and returns its public URL.
 * Defaults to local disk under /public/uploads. Set STORAGE_PROVIDER=s3
 * (with the S3_* env vars) to swap in cloud storage without touching callers.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WEBP, or GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is too large. Max size is 8MB.");
  }

  const provider = process.env.STORAGE_PROVIDER ?? "local";
  const extension = file.type.split("/")[1] ?? "jpg";
  const filename = `${randomUUID()}.${extension}`;

  if (provider === "s3") {
    return uploadToS3(file, filename);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

async function uploadToS3(_file: File, _filename: string): Promise<string> {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  if (!bucket || !region) {
    throw new Error("S3_BUCKET and S3_REGION must be set when STORAGE_PROVIDER=s3");
  }
  // Intentionally left as an integration point: install @aws-sdk/client-s3 and
  // implement the PutObject call here when cloud storage credentials are available.
  throw new Error(
    "S3 storage is not yet wired up. Add @aws-sdk/client-s3 and implement uploadToS3(), or leave STORAGE_PROVIDER unset to use local disk."
  );
}
