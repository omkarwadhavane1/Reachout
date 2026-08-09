import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { useSession } from 'next-auth/react'


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
  // 🔐 Admin check
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== 'sanketadsare5@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder: 'documentation' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return NextResponse.json({
    url: uploadResult.secure_url
  })
}
