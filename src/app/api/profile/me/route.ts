import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        resumePdfUrl: true,
        resumeDriveLink: true,
        smtpEmail: true,
        smtpHost: true,
        smtpPort: true,
      },
    });

    return NextResponse.json(user || {});
  } catch (error: any) {
    console.error('profile/me GET error', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}