import nodemailer from 'nodemailer';
import { decrypt } from './encryption';

export interface SMTPConfig {
  email: string;
  host: string;
  port: number;
  password: string;
}

export async function sendEmail(
  smtpConfig: SMTPConfig,
  to: string,
  subject: string,
  body: string,
  resumeUrl?: string,
  resumeBuffer?: Buffer | null // ✅ NEW
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: {
      user: smtpConfig.email,
      pass: decrypt(smtpConfig.password),
    },
  });

  await transporter.sendMail({
    from: smtpConfig.email,
    to,
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),

    // ✅ Attach resume if available
    attachments: resumeBuffer
      ? [
          {
            filename: 'Sanket_Adsare_SDE.pdf',
            // content: resumeBuffer,
            // contentType: 'application/pdf',
            path: resumeUrl,
          },
        ]
      : [],
  });
}
