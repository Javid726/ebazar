import type { Metadata } from 'next';
import { Inter, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import CategoryProvider from './category-provider';

const inter = Inter({ subsets: ['latin'] });
const open_sans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Ebazar App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CategoryProvider>
        <body className={open_sans.className}>{children}</body>
        <Toaster richColors={true} theme="light" closeButton={true} />
      </CategoryProvider>
    </html>
  );
}
