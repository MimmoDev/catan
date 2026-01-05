import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { games, gameParticipants } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }

    const { winnerId, location, playedAt, participants } = await request.json()

    if (!winnerId || !location || !playedAt) {
      return NextResponse.json(
        { error: "Tutti i campi sono richiesti" },
        { status: 400 }
      )
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: "Aggiungi almeno un partecipante" },
        { status: 400 }
      )
    }

    // Insert game
    const [game] = await db.insert(games).values({
      winnerId: parseInt(winnerId),
      location,
      playedAt: new Date(playedAt * 1000),
    }).returning()

    // Insert participants
    if (game && participants.length > 0) {
      await db.insert(gameParticipants).values(
        participants.map((p: { userId: number; score: number }) => ({
          gameId: game.id,
          userId: p.userId,
          score: p.score,
        }))
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json(
      { error: "Errore nella creazione della partita" },
      { status: 500 }
    )
  }
}

