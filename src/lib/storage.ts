import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3-compatible object storage client.
 * Works with AWS S3, Supabase Storage, Cloudflare R2, and any S3-compatible service.
 *
 * REQUIRED environment variables:
 *   S3_ENDPOINT   — Service endpoint (e.g., https://xxx.supabase.co/storage/v1/s3)
 *   S3_REGION     — Region or "auto" for providers like R2
 *   S3_BUCKET     — Bucket name
 *   S3_ACCESS_KEY — Access key ID
 *   S3_SECRET_KEY — Secret access key
 *
 * OPTIONAL:
 *   S3_PUBLIC_URL — Custom public CDN URL (overrides default public URL format)
 */
const s3Client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET || "";

function ensureConfigured(): void {
  if (!BUCKET_NAME || !process.env.S3_ENDPOINT) {
    throw new Error(
      "Object storage not configured. Set S3_BUCKET, S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY."
    );
  }
}

/**
 * Upload a file to object storage and return its storage key.
 * The key is the canonical identifier — never use filesystem paths.
 */
export async function uploadFile(
  file: File,
  folder: string = "media"
): Promise<{ key: string }> {
  ensureConfigured();

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${timestamp}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return { key };
}

/**
 * Delete a file from object storage by its key.
 */
export async function deleteFile(key: string): Promise<void> {
  ensureConfigured();

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * Generate a signed URL for temporary private access.
 * Default expiration: 1 hour.
 */
export async function getSignedFileUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  ensureConfigured();

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Get an access URL for a media asset based on its visibility.
 * - PUBLIC: returns the canonical public URL
 * - PRIVATE / UNLISTED: returns a signed URL valid for 1 hour
 */
export async function getMediaUrl(asset: {
  fileUrl: string;
  visibility: string;
}): Promise<string> {
  if (asset.visibility === "PUBLIC") {
    const publicBase = process.env.S3_PUBLIC_URL
      || `https://${BUCKET_NAME}.s3.amazonaws.com`;
    return `${publicBase}/${asset.fileUrl}`;
  }

  return await getSignedFileUrl(asset.fileUrl);
}
