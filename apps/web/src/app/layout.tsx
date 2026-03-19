import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { SkipNavigation } from '@/components/SkipNavigation';

export const metadata: Metadata = {
  title: {
    default: 'Living Faith Tabernacle Cameroon',
    template: '%s | LFTCM',
  },
  description: 'Winning the world with the Word of faith. Join us for powerful worship and transformative teaching.',
  keywords: ['church', 'faith', 'Cameroon', 'Yaoundé', 'Christian', 'worship', 'prayer'],
  authors: [{ name: 'Living Faith Tabernacle' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-72x72.png', sizes: '72x72' },
      { url: '/icons/icon-96x96.png', sizes: '96x96' },
      { url: '/icons/icon-128x128.png', sizes: '128x128' },
      { url: '/icons/icon-144x144.png', sizes: '144x144' },
      { url: '/icons/icon-152x152.png', sizes: '152x152' },
      { url: '/icons/icon-192x192.png', sizes: '192x192' },
      { url: '/icons/icon-384x384.png', sizes: '384x384' },
      { url: '/icons/icon-512x512.png', sizes: '512x512' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152' },
      { url: '/icons/icon-180x180.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lftcm.org',
    siteName: 'Living Faith Tabernacle Cameroon',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Living Faith Tabernacle Cameroon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lftcm',
    creator: '@lftcm',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LFTCM',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <SkipNavigation />
        <QueryProvider>
          <LanguageProvider>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <ServiceWorkerRegistration />
            <PWAInstallPrompt />
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
