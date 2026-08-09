import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';
import { extractEmails } from '@/utils/emailExtractor';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emails, subject, body, mode, input, isManual } = await req.json();

      if (!emails || !subject || !body) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // If AI mode → require mode and input
      if (!isManual && (!mode || !input)) {
        return NextResponse.json({ error: 'AI generation data missing' }, { status: 400 });
      }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        smtpEmail: true,
        smtpHost: true,
        smtpPort: true,
        smtpPassword: true,
        resumePdfUrl: true,
      },
    });

    if (!user?.smtpEmail || !user?.smtpHost || !user?.smtpPort || !user?.smtpPassword) {
      return NextResponse.json({ error: 'Configure SMTP first' }, { status: 400 });
    }

    const smtpConfig = {
      email: user.smtpEmail,
      host: user.smtpHost,
      port: user.smtpPort,
      password: user.smtpPassword,
    };

    // ✅ FIX: declare buffer
    // let resumeBuffer: Buffer | null = null;

    // if (user.resumePdfUrl) {
    //   const res = await fetch(user.resumePdfUrl);
    //   if (!res.ok) {
    //     return NextResponse.json(
    //       { error: 'Failed to fetch resume file' },
    //       { status: 500 }
    //     );
    //   }
    //   resumeBuffer = Buffer.from(await res.arrayBuffer());
    // }

    const emailList = extractEmails(emails);
    const results = [];

    for (const email of emailList) {
      try {
        await sendEmail(
          smtpConfig,
          email,
          subject,
          body,
          // resumeBuffer // ✅ attachment
          user.resumePdfUrl!
        );

        await prisma.emailLog.create({
          data: {
            userId: session.user.id,
            recruiterEmail: email,
            subject,
            body,
            generationMode: isManual ? 'MANUAL' : mode,
            role: !isManual && mode === 'ROLE_BASED' ? input : null,
            jobDescription: !isManual && mode === 'JD_BASED' ? input : null,
            status: 'SENT',
          },
        });

        results.push({ email, status: 'SENT' });
        // await new Promise((resolve) => setTimeout(resolve, 2000));

      } catch (error: any) {
        await prisma.emailLog.create({
          data: {
            userId: session.user.id,
            recruiterEmail: email,
            subject,
            body,
            generationMode: mode,
            role: mode === 'ROLE_BASED' ? input : null,
            jobDescription: mode === 'JD_BASED' ? input : null,
            status: 'FAILED',
            errorMessage: error.message,
          },
        });

        results.push({ email, status: 'FAILED', error: error.message });
      }
    }

    return NextResponse.json({ results });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
