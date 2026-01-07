import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }

    const gameId = parseInt(params.gameId)

    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: "ID partita non valido" },
        { status: 400 }
      )
    }

    // Check if game exists
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1)

    if (game.length === 0) {
      return NextResponse.json(
        { error: "Partita non trovata" },
        { status: 404 }
      )
    }

    // Delete game (cascade will delete participants)
    await db.delete(games).where(eq(games.id, gameId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      { error: "Errore nell'eliminazione della partita" },
      { status: 500 }
    )
  }
}


