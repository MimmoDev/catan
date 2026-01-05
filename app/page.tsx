import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, games, gameParticipants } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import LoginForm from "@/components/LoginForm"
import LeaderboardClient from "@/components/LeaderboardClient"
import HomeClient from "@/components/HomeClient"

export default async function Home() {
  const user = await getCurrentUser()

  // If not logged in, show login form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">🏰 Catan</h1>
            <p className="text-muted-foreground">Classifica Partite</p>
          </div>
          <LoginForm />
        </div>
      </div>
    )
  }

  // If logged in, show leaderboard
  // Get all users with their stats (wins and total score)
  // Using subqueries to avoid duplicates
  const allUsers = await db.select().from(users)
  
  const leaderboard = await Promise.all(
    allUsers.map(async (user) => {
      const winsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(games)
        .where(eq(games.winnerId, user.id))
      
      const scoreResult = await db
        .select({ total: sql<number>`COALESCE(SUM(${gameParticipants.score}), 0)` })
        .from(gameParticipants)
        .where(eq(gameParticipants.userId, user.id))
      
      const lastWinResult = await db
        .select({ lastWin: sql<number>`MAX(${games.playedAt})` })
        .from(games)
        .where(eq(games.winnerId, user.id))
      
      const totalScore = scoreResult[0]?.total !== null && scoreResult[0]?.total !== undefined 
        ? Number(scoreResult[0].total) 
        : 0
      
      return {
        id: user.id,
        username: user.username,
        image: user.image,
        wins: Number(winsResult[0]?.count || 0),
        totalScore: totalScore,
        lastWin: lastWinResult[0]?.lastWin ? Number(lastWinResult[0].lastWin) : null,
      }
    })
  )
  
  // Sort by wins first, then by total score
  leaderboard.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return b.totalScore - a.totalScore
  })

  // Get recent games
  const recentGames = await db
    .select({
      id: games.id,
      winnerId: games.winnerId,
      winnerUsername: users.username,
      winnerImage: users.image,
      location: games.location,
      playedAt: games.playedAt,
    })
    .from(games)
    .innerJoin(users, eq(games.winnerId, users.id))
    .orderBy(desc(games.playedAt))
    .limit(10)

  return (
    <HomeClient
      user={user}
      leaderboard={leaderboard.map(u => ({
        ...u,
        wins: Number(u.wins || 0),
        totalScore: Number(u.totalScore || 0),
        lastWin: u.lastWin ? Number(u.lastWin) : null,
      }))}
      recentGames={recentGames.map(g => ({
        ...g,
        playedAt: Number(g.playedAt),
      }))}
    />
  )
}

