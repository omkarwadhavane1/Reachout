import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { resumeDriveLink } = await req.json();
    if (resumeDriveLink && typeof resumeDriveLink !== 'string') {
      return NextResponse.json({ error: 'Invalid resume drive link' }, { status: 400 });
    }
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { resumeDriveLink: resumeDriveLink || null },
      });
      return NextResponse.json({ message: 'Updated', resumeDriveLink: resumeDriveLink || null });
    } catch (err: any) {
      console.error('drive-link save error', err);
      return NextResponse.json({ error: err?.message || 'Failed to save link' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}