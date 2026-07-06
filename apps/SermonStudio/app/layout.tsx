import './globals.css'
import type { Metadata } from 'next'
import { Source_Serif_4, Inter } from 'next/font/google'

const sourceSerif = Source_Serif_4({ subsets: ['latin'], display: 'swap', variable: '--font-serif' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })

export const metadata: Metadata = {
  title: "Pastor's Sermon Studio",
  description: 'Draft sermons, plan series, curate worship, and stay on schedule.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sourceSerif.className} ${inter.className}`}>{children}</body>
    </html>
  )
}
