import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { I18nProvider } from '@/lib/i18n'
import { siteConfig } from '@/content/site.config'
import './globals.css'

const GA_ID = 'G-TJRWP2YTM2'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://cursorserbia.com')

const siteTitle = `${siteConfig.communityName} ${siteConfig.communityNameLocal}`
const siteDescription =
  'Cursor Community Serbia — the official local community for Cursor AI enthusiasts in Serbia. Join meetups, workshops, and connect with fellow developers.'

const ogImage = {
  url: '/images/og-cursor-serbia.jpg',
  width: 1024,
  height: 1024,
  alt: siteTitle,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteTitle} | Cursor Ambassador Site`,
  description: siteDescription,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    type: 'website',
    locale: 'en_US',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImage.url],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={siteConfig.defaultLocale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
