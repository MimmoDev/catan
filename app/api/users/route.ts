import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function GET() {
  try {
    console.log("API /api/users called")
    const allUsers = await db.select().from(users).orderBy(users.username)
    console.log("Users found:", allUsers.length)
    return NextResponse.json(allUsers, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Errore nel recupero degli utenti" },
      { status: 500 }
    )
  }
}

