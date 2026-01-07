import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function GET() {
  try {
    console.log("API /api/users called")
    
    // Use Drizzle ORM (same as leaderboard) for consistency
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      image: users.image,
    }).from(users).orderBy(users.username)
    
    console.log("✅ Users found:", allUsers.length)
    console.log("✅ Users:", allUsers.map((u) => u.username).join(", "))
    
    return NextResponse.json(allUsers, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("❌ Error fetching users:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { error: "Errore nel recupero degli utenti", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

