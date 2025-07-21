import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IconKit - Your favorite icons, all in one place",
  description:
    "Find any icon from Hero Icons, Lucide, Font Awesome, Simple Icons, and 8 more libraries—all in one search.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className='h-full'
    >
      <body className={`${inter.className} antialiased h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

