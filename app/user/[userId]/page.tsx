import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, games, gameParticipants } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import UserProfileClient from "@/components/UserProfileClient"

export default async function UserProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/")
  }

  const userId = parseInt(params.userId)

  if (isNaN(userId)) {
    redirect("/")
  }

  // Get user info
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (user.length === 0) {
    redirect("/")
  }

  const userData = user[0]

  // Get all games where this user participated using a subquery approach
  // First get all game IDs
  const userGameIdsRaw = await db
    .select({ gameId: gameParticipants.gameId })
    .from(gameParticipants)
    .where(eq(gameParticipants.userId, userId))

  // Remove duplicates
  const uniqueGameIds = Array.from(new Set(userGameIdsRaw.map((g) => g.gameId)))

  if (uniqueGameIds.length === 0) {
    return (
      <UserProfileClient
        user={userData}
        games={[]}
        stats={{
          totalGames: 0,
          wins: 0,
          totalScore: 0,
        }}
      />
    )
  }

  // Get all games and filter in memory (simpler approach)
  const allGames = await db
    .select({
      id: games.id,
      winnerId: games.winnerId,
      location: games.location,
      playedAt: games.playedAt,
    })
    .from(games)
    .orderBy(desc(games.playedAt))

  const filteredGames = allGames.filter((g) => uniqueGameIds.includes(g.id))

  // Get winner info for each game
  const gamesWithWinner = await Promise.all(
    filteredGames.map(async (game) => {
      const winner = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, game.winnerId))
        .limit(1)

      // Convert playedAt to number (timestamp in seconds)
      // Drizzle with mode: "timestamp" can return Date or number at runtime
      const playedAtValue = game.playedAt as Date | number
      const playedAtNumber = playedAtValue instanceof Date
        ? Math.floor(playedAtValue.getTime() / 1000)
        : typeof playedAtValue === 'number'
          ? playedAtValue
          : 0

      return {
        gameId: game.id,
        winnerId: game.winnerId,
        winnerUsername: winner[0]?.username || "",
        location: game.location,
        playedAt: playedAtNumber,
      }
    })
  )

  // Get participants and scores for each game
  const gamesWithParticipants = await Promise.all(
    gamesWithWinner.map(async (game) => {
      const participants = await db
        .select({
          userId: users.id,
          username: users.username,
          image: users.image,
          score: gameParticipants.score,
        })
        .from(gameParticipants)
        .innerJoin(users, eq(gameParticipants.userId, users.id))
        .where(eq(gameParticipants.gameId, game.gameId))
        .orderBy(desc(gameParticipants.score))

      // Convert playedAt to number (timestamp in seconds)
      // Drizzle with mode: "timestamp" can return Date or number at runtime
      const playedAtValue = game.playedAt as Date | number
      const playedAtNumber = playedAtValue instanceof Date
        ? Math.floor(playedAtValue.getTime() / 1000)
        : typeof playedAtValue === 'number'
          ? playedAtValue
          : 0

      return {
        ...game,
        playedAt: playedAtNumber,
        participants: participants.map((p) => ({
          ...p,
          score: Number(p.score),
        })),
      }
    })
  )

  // Calculate stats
  const totalGames = gamesWithParticipants.length
  const wins = gamesWithParticipants.filter((g) => g.winnerId === userId).length
  const totalScore = gamesWithParticipants.reduce((sum, game) => {
    const userParticipant = game.participants.find((p) => p.userId === userId)
    return sum + (userParticipant?.score || 0)
  }, 0)

  return (
    <UserProfileClient
      user={userData}
      games={gamesWithParticipants}
      stats={{
        totalGames,
        wins,
        totalScore,
      }}
    />
  )
}

