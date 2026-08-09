// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function ensureConfig() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary env variables are missing');
  }
}

export async function uploadPDF(
  buffer: Buffer,
  userId: string
): Promise<string> {
  ensureConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumes',
        resource_type: 'raw',
        public_id: `resume_${userId}_${Date.now()}`,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) {
          return reject(new Error('Upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deletePDF(url: string): Promise<void> {
  const parts = url.split('/');
  const publicIdWithExt = parts.slice(-2).join('/');
  const publicId = publicIdWithExt.split('.')[0];

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'raw',
  });
}
