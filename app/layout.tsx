import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
//import Footer from './components/footer'
import { baseUrl } from './sitemap'

// app/layout.tsx
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


const cx = (...classes) => classes.filter(Boolean).join(' ')

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
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col">
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
