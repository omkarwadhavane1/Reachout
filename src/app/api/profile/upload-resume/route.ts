// import { NextRequest } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { writeFile, mkdir } from 'fs/promises';
// import path from 'path';
// import { randomBytes } from 'crypto';
// import { uploadPDF, deletePDF } from '@/lib/cloudinary';


// const UPLOAD_DIR = path.join(process.cwd(), 'public', 'resumes');

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.email) {
//     return Response.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const formData = await req.formData();
//     const file = formData.get('resume') as File | null;
//     const extractedText = formData.get('resumeText') as string | null;

//     if (!file) {
//       return Response.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       return Response.json({ error: 'File too large (max 5MB)' }, { status: 400 });
//     }

//     // ✅ Ensure directory exists
//     await mkdir(UPLOAD_DIR, { recursive: true });

//     const ext = path.extname(file.name);
//     const filename = `${randomBytes(16).toString('hex')}${ext}`;
//     const filepath = path.join(UPLOAD_DIR, filename);

//     const buffer = Buffer.from(await file.arrayBuffer());
//     await writeFile(filepath, buffer);

//     const resumePdfUrl = `/resumes/${filename}`;

//     const updatedUser = await prisma.user.update({
//       where: { email: session.user.email },
//       data: {
//         resumePdfUrl,
//         resumeText: extractedText || null,
//       },
//     });

//     return Response.json({
//       message: 'Resume uploaded successfully',
//       resumePdfUrl: updatedUser.resumePdfUrl,
//     });

//   } catch (error) {
//     console.error('Resume upload error:', error);
//     return Response.json({ error: 'Upload failed' }, { status: 500 });
//   }
// }


import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadPDF, deletePDF } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const extractedText = formData.get('resumeText') as string | null;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // delete old resume if exists
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { resumePdfUrl: true },
    });

    if (existingUser?.resumePdfUrl) {
      await deletePDF(existingUser.resumePdfUrl);
    }

    const resumePdfUrl = await uploadPDF(buffer, session.user.email);

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        resumePdfUrl,
        resumeText: extractedText || null,
      },
    });

    return Response.json({
      message: 'Resume uploaded successfully',
      resumePdfUrl,
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
