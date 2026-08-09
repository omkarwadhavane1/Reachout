// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';

// export default async function HomePage() {
//   const session = await getServerSession(authOptions);
//   if (session) redirect('/workspace');
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold text-gray-800 mb-4">Job Application Mailer</h1>
//         <p className="text-xl text-gray-600 mb-8">AI-powered cover letter generation</p>
//         <div className="space-x-4">
//           <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block">Sign In</Link>
//           <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 inline-block">Sign Up</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import LandingPage from '@/components/landing/LandingPage'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // 1️⃣ Guest → landing
  if (!session?.user?.email) {
    return <LandingPage />
  }

  // 2️⃣ Logged in → check profile
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      resumeText: true,
      smtpEmail: true
    }
  })

  // 3️⃣ Profile incomplete → force setup
  if (!user?.resumeText || !user?.smtpEmail) {
    redirect('/profile')
  }

  // 4️⃣ Fully ready → workspace
  redirect('/workspace')
}
