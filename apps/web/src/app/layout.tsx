import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvlschool.edu.in'),
  title: {
    default: 'KVL International School — Excellence in Education',
    template: '%s | KVL International School',
  },
  description:
    'KVL International School — A premier institution shaping tomorrow\'s leaders through excellence in academics, character, and innovation. Affiliated with CBSE.',
  keywords: [
    'KVL International School', 'best school', 'CBSE school', 'international school',
    'premier education', 'school admissions', 'academic excellence',
  ],
  authors: [{ name: 'KVL International School' }],
  creator: 'KVL International School',
  publisher: 'KVL International School',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kvlschool.edu.in',
    siteName: 'KVL International School',
    title: 'KVL International School — Excellence in Education',
    description: 'A premier institution shaping tomorrow\'s leaders through excellence in academics, character, and innovation.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'KVL International School' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KVL International School',
    description: 'Excellence in Education — CBSE Affiliated Premier Institution',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e3a5f' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1628' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${dancingScript.variable}`}
    >
      <head>
        <meta name="application-name" content="KVL Education OS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KVL EduOS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1e3a5f" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f1f33',
                color: '#faf8f5',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 20px',
              },
              success: { iconTheme: { primary: '#c9922a', secondary: '#faf8f5' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
