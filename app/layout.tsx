// app/layout.tsx
import './global.css'
import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
// import Footer from './components/footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Brendan Birozy',
    template: '%s | Brendan Birozy',
  },
  description: 'Electrical Engineering portfolio and projects.',
  openGraph: {
    title: 'Brendan Birozy',
    description: 'Electrical Engineering portfolio and projects.',
    url: baseUrl,
    siteName: 'Brendan Birozy',
    locale: 'en_US',
    type: 'website',
  },
  // ...
}

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mono',
})

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        jetbrainsMono.variable
      )}
    >
      <body className={cx(ibmPlexSans.className, 'antialiased max-w-xl mx-4 mt-8 lg:mx-auto')}>
        {/* pb-16 adds bottom padding on every page */}
        <main className="flex-auto min-w-0 mt-6 flex flex-col pb-16">
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
