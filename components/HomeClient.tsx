"use client"

import { useState } from "react"
import LeaderboardClient from "@/components/LeaderboardClient"
import AddGameModal from "@/components/AddGameModal"
import FloatingActionButton from "@/components/FloatingActionButton"

interface User {
  id: number
  username: string
}

interface LeaderboardEntry {
  id: number
  username: string
  image: string | null
  wins: number
  totalGames: number
  totalScore: number
  lastWin: number | null
}

interface RecentGame {
  id: number
  winnerId: number
  winnerUsername: string
  winnerImage: string | null
  location: string
  playedAt: number
}

interface HomeClientProps {
  user: User
  leaderboard: LeaderboardEntry[]
  recentGames: RecentGame[]
}

export default function HomeClient({
  user,
  leaderboard,
  recentGames,
}: HomeClientProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => {
    console.log("Opening modal...")
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">🏰 Classifica</h1>
            <p className="text-muted-foreground text-sm">Catan Leaderboard</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Esci
            </button>
          </form>
        </div>

        <LeaderboardClient
          leaderboard={leaderboard}
          recentGames={recentGames}
        />

        <FloatingActionButton onClick={handleOpenModal} />

        <AddGameModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}

