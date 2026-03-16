import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { I18nProvider } from '@/lib/i18n'
import { siteConfig } from '@/content/site.config'
import './globals.css'

const GA_ID = 'G-TJRWP2YTM2'

export const metadata: Metadata = {
  title: `${siteConfig.communityName} ${siteConfig.communityNameLocal} | Cursor Ambassador Site`,
  description: 'Cursor Community Serbia — the official local community for Cursor AI enthusiasts in Serbia. Join meetups, workshops, and connect with fellow developers.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: `${siteConfig.communityName} ${siteConfig.communityNameLocal}`,
    description: 'Cursor Community Serbia — the official local community for Cursor AI enthusiasts in Serbia. Join meetups, workshops, and connect with fellow developers.',
    type: 'website',
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
