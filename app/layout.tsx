import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from "next/script"
import './globals.css'
import { ReactGrabOverlay } from './components/react-grab-overlay'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Acme Incorporated | Building Tomorrow, Today',
  description: 'Acme Incorporated delivers innovative solutions for businesses worldwide. We help enterprises transform and scale with cutting-edge technology and expert consulting.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {process.env.NODE_ENV === "development" && (
        <Script
          src="//unpkg.com/react-grab/dist/index.global.js"
          strategy="beforeInteractive"
        />
      )}
      <body className={`font-sans antialiased`}>
        <ReactGrabOverlay>
          {children}
        </ReactGrabOverlay>
        <Analytics />
      </body>
    </html>
  )
}
