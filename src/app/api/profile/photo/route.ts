import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// 🔐 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ Read form data
    const formData = await req.formData();
    const file = formData.get('photo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 3️⃣ Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images allowed' }, { status: 400 });
    }

    // 4️⃣ Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5️⃣ Upload to Cloudinary
    // 5️⃣ Upload to Cloudinary (OVERWRITE previous image)
const uploadResult = await new Promise<any>((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    {
      folder: 'profile_photos',
      public_id: `user_${session.user.id}`, // 🔥 SAME ID EVERY TIME
      overwrite: true,                      // 🔥 THIS IS THE KEY
      invalidate: true,                     // 🔥 clears CDN cache
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      ],
    },
    (error, result) => {
      if (error) reject(error)
      else resolve(result)
    }
  ).end(buffer)
})


    // 6️⃣ Save URL in DB
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: uploadResult.secure_url,
      },
    });

    // 7️⃣ Return success
    return NextResponse.json({
      message: 'Profile photo uploaded',
      imageUrl: user.image,
    });

  } catch (error) {
    console.error('PHOTO UPLOAD ERROR:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
