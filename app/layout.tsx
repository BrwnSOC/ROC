import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "ROC - Response Operations Companion",
  description: "Advanced Cybersecurity Incident Response Platform",
  generator: "v0.app",
  keywords: "cybersecurity, incident response, SOC, security operations, threat intelligence",
  authors: [{ name: "ROC Platform" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      </body>
    </html>
  )
}
