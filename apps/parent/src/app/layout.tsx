import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parent Portal | KVL International School',
  description: 'Stay connected with your child\'s academic journey at KVL International School.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50/30 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
