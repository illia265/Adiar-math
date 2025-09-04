import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Adiar Math - SAT Desmos Math Tutor',
  description: 'Master SAT math with AI-powered Desmos training. Think strategically, solve efficiently, and leverage the exact tool you\'ll use on test day.',
  keywords: ['SAT', 'math', 'Desmos', 'tutor', 'AI', 'mathematics', 'education'],
  authors: [{ name: 'Adiar Math Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Adiar Math - SAT Desmos Math Tutor',
    description: 'Master SAT math with AI-powered Desmos training',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
