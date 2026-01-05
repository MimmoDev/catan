import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { initDb } from "@/lib/db"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Catan Leaderboard",
  description: "Classifica partite di Catan tra amici",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

// Initialize database
initDb()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

