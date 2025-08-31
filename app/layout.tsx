import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Adiar Math – The SAT Desmos Math Tutor',
  description: 'Master SAT math with AI-powered Desmos training. Think strategically, solve efficiently, and leverage the exact tool you\'ll use on test day.',
  keywords: 'SAT math, Desmos, AI tutor, test prep, mathematics, SAT preparation, graphing calculator',
  authors: [{ name: 'Adiar Math Team' }],
  openGraph: {
    title: 'Adiar Math – The SAT Desmos Math Tutor',
    description: 'Master SAT math with AI-powered Desmos training. Think strategically, solve efficiently, and leverage the exact tool you\'ll use on test day.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adiar Math – The SAT Desmos Math Tutor',
    description: 'Master SAT math with AI-powered Desmos training. Think strategically, solve efficiently, and leverage the exact tool you\'ll use on test day.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
