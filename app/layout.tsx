import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { I18nProvider } from '@/lib/i18n'
import { siteConfig } from '@/content/site.config'
import './globals.css'

const GA_ID = 'G-TJRWP2YTM2'

export const metadata: Metadata = {
  title: `${siteConfig.communityName} | Cursor Ambassador Site`,
  description: 'Reusable Cursor Ambassador website template for local communities.',
  openGraph: {
    title: siteConfig.communityName,
    description: 'Reusable Cursor Ambassador website template for local communities.',
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
