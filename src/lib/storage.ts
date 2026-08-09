import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function ensureCloudinaryConfig() {
  const ok = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (!ok) {
    console.error('Cloudinary configuration missing:', {
      cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      api_key: !!process.env.CLOUDINARY_API_KEY,
      api_secret: !!process.env.CLOUDINARY_API_SECRET,
    });
    throw new Error('Cloudinary configuration is missing or incomplete');
  }
}

export async function uploadPDF(buffer: Buffer, userId: string): Promise<string> {
  ensureCloudinaryConfig();
  return new Promise((resolve, reject) => {
    const publicId = `resume_${userId}_${Date.now()}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumes',
        public_id: publicId,
        resource_type: 'raw',
      },
      (error, result) => {
        if (error) {
          console.error('cloudinary upload error', error);
          return reject(error);
        }
        if (!result || !result.secure_url) {
          console.error('cloudinary upload returned no secure_url', result);
          return reject(new Error('Cloudinary upload failed: no secure_url'));
        }
        return resolve(result.secure_url);
      }
    );

    try {
      uploadStream.end(buffer);
    } catch (err) {
      console.error('uploadStream.end error', err);
      reject(err);
    }
  });
}

export async function deletePDF(url: string): Promise<void> {
  try {
    const parts = url.split('/');
    const lastTwo = parts.slice(-2).join('/');
    const publicId = lastTwo.split('.')[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (err) {
    console.error('cloudinary delete error', err);
    throw err;
  }
}