import { ClerkProvider } from '@clerk/nextjs/dist/components.server';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { dark } from '@clerk/themes';
import Head from 'next/head';
import { Metadata } from 'next';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Explore | Gymlink',
  description:
    'Explore the Gymlink community. Download the Gymlink app available on iOS TestFlight.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en' className='bg-dark-500 dark'>
        <body className={montserrat.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
