import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateCoverLetterPrompt } from '@/lib/ai/coverLetterPrompt';
import 'dotenv/config';
import { text } from 'stream/consumers';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
console.log('GEMINI KEY EXISTS:', !!process.env.GEMINI_API_KEY);


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { mode, input } = await req.json();
    if (!mode || !input) {
      return NextResponse.json({ error: 'Mode and input required' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { resumeText: true, resumeDriveLink: true },
    });
    if (!user?.resumeText) {
      return NextResponse.json({ error: 'Upload resume first' }, { status: 400 });
    }
    const prompt = generateCoverLetterPrompt(user.resumeText, mode, input, user.resumeDriveLink || undefined);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(text);
    return NextResponse.json({ subject: parsed.subject, body: parsed.body });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}