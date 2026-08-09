import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { smtpEmail, smtpHost, smtpPort, smtpPassword } = await req.json();
    if (!smtpEmail || !smtpHost || !smtpPort || !smtpPassword) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    const encryptedPassword = encrypt(smtpPassword);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { smtpEmail, smtpHost, smtpPort: parseInt(smtpPort), smtpPassword: encryptedPassword },
    });
    return NextResponse.json({ message: 'SMTP configured' });
  } catch (error) { 
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { smtpEmail: true, smtpHost: true, smtpPort: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}