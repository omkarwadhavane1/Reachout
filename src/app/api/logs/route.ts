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
    const logs = await prisma.emailLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, recruiterEmail: true, subject: true, status: true, body:true,  role:true, errorMessage: true, createdAt: true },
    });
    const stats = await prisma.emailLog.groupBy({
      by: ['status'],
      where: { userId: session.user.id },
      _count: true,
    });
    const sentCount = stats.find((s:any) => s.status === 'SENT')?._count || 0;
    const failedCount = stats.find((s:any) => s.status === 'FAILED')?._count || 0;
    return NextResponse.json({ logs, stats: { sent: sentCount, failed: failedCount } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}