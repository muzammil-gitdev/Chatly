import { v2 as cloudinary } from "cloudinary";

// ─── Configuration (server-only — never expose in CLIENT bundle) ──────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UploadResult {
  url: string;
  publicId: string;
}

// ─── Upload avatar (always overwrites the same public_id) ────────────────────
export async function uploadAvatar(
  fileBuffer: Buffer,
  uid: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const publicId = `chatly/profiles/${uid}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: undefined, // folder is encoded in publicId
        public_id: publicId,
        overwrite: true,
        invalidate: true, // purge CDN cache on overwrite
        transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

// ─── Delete avatar ────────────────────────────────────────────────────────────
export async function deleteAvatar(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
