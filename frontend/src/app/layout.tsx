import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WashLedger - Çamaşırhane Operasyon Yönetimi',
  description: 'Makine envanteri, tahsilat kayıtları, onarım takibi ve bakım planlama platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
