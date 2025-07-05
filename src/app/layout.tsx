import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { AuthProvider } from '@/hooks/use-auth';
import { AuthProtector } from '@/components/auth-protector';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://codezcube.com'), // Change this to your production domain
  title: {
    default: 'CodezCube - Innovation & Technology Solutions',
    template: '%s | CodezCube',
  },
  description: 'CodezCube is a hybrid innovation company offering web/IT services and a long-term product incubation lab.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <AuthProtector>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AuthProtector>
            <Toaster />
            <CookieConsentBanner />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
