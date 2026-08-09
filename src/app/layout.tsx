// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import SessionProvider from '@/components/SessionProvider';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Job Application Mailer',
//   description: 'AI-powered job application tool',
// };

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//   const session = await getServerSession(authOptions);
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <SessionProvider session={session}>{children}</SessionProvider>
//       </body>
//     </html>
//   );
// }


//========================google analytics========================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Job Application Mailer',
  description: 'AI-powered job application tool',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1GWWPB48RZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1GWWPB48RZ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
