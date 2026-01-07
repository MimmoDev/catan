"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

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

interface LeaderboardClientProps {
  leaderboard: LeaderboardEntry[]
  recentGames: RecentGame[]
}

export default function LeaderboardClient({
  leaderboard,
  recentGames,
}: LeaderboardClientProps) {
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 ${
                  index < 3 ? "bg-muted/30" : ""
                }`}
              >
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  {getRankIcon(index)}
                </div>
                <Link href={`/user/${entry.id}`} className="flex-shrink-0">
                  {entry.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-border hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src={entry.image}
                        alt={entry.username}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg border border-border hover:opacity-80 transition-opacity cursor-pointer">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/user/${entry.id}`}
                    className="font-semibold text-lg truncate hover:underline block"
                  >
                    {entry.username}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {entry.wins} {entry.wins === 1 ? "vittoria" : "vittorie"}
                    {entry.totalGames > 0 && (
                      <span className="ml-2">
                        • {entry.totalGames} {entry.totalGames === 1 ? "partita" : "partite"}
                      </span>
                    )}
                    {entry.lastWin && (
                      <span className="ml-2">
                        • Ultima: {formatDate(entry.lastWin)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Punteggio totale: {(entry.totalScore || 0).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {entry.wins}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(entry.totalScore || 0).toLocaleString()} pt
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Partite Recenti</h2>
          <div className="space-y-3">
            {recentGames.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nessuna partita ancora
              </p>
            ) : (
              recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Link href={`/user/${game.winnerId}`}>
                    {game.winnerImage ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border hover:opacity-80 transition-opacity cursor-pointer">
                        <Image
                          src={game.winnerImage}
                          alt={game.winnerUsername}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold border border-border hover:opacity-80 transition-opacity cursor-pointer">
                        {game.winnerUsername.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/user/${game.winnerId}`}
                      className="font-medium truncate hover:underline block"
                    >
                      {game.winnerUsername}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {game.location} • {formatDate(game.playedAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

