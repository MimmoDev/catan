import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

export async function GET() {
  try {
    console.log("API /api/users called")
    
    // Check if database file exists
    const dbPath = path.join(process.cwd(), "data", "catan.db")
    console.log("Database path:", dbPath)
    console.log("Database exists:", fs.existsSync(dbPath))
    
    // Try direct SQL query as fallback
    let allUsers
    try {
      allUsers = await db.select().from(users).orderBy(users.username)
      console.log("Drizzle query result:", allUsers.length, "users")
    } catch (drizzleError) {
      console.error("Drizzle query failed, trying direct SQL:", drizzleError)
      // Fallback to direct SQL
      const sqlite = new Database(dbPath)
      const result = sqlite.prepare("SELECT id, username, image, created_at FROM users ORDER BY username").all()
      sqlite.close()
      allUsers = result.map((row: any) => ({
        id: row.id,
        username: row.username,
        image: row.image,
        createdAt: new Date(row.created_at * 1000),
      }))
      console.log("Direct SQL query result:", allUsers.length, "users")
    }
    
    console.log("Users found:", allUsers.length)
    console.log("Users data:", JSON.stringify(allUsers, null, 2))
    
    return NextResponse.json(allUsers, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { error: "Errore nel recupero degli utenti", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

