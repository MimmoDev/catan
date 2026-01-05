import { NextResponse } from "next/server"
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

export async function GET() {
  try {
    console.log("API /api/users called")
    console.log("process.cwd():", process.cwd())
    
    // Try multiple possible database paths (for standalone build)
    const possiblePaths = [
      path.join(process.cwd(), "data", "catan.db"),
      path.join(process.cwd(), "..", "data", "catan.db"),
      "/app/data/catan.db",
      "./data/catan.db",
    ]
    
    let dbPath: string | null = null
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        dbPath = possiblePath
        console.log("Database found at:", dbPath)
        break
      }
    }
    
    if (!dbPath) {
      console.error("Database not found in any of these paths:", possiblePaths)
      return NextResponse.json(
        { error: "Database non trovato" },
        { status: 500 }
      )
    }
    
    // Use direct SQL query (more reliable than Drizzle in API routes)
    const sqlite = new Database(dbPath, { readonly: true })
    const result = sqlite.prepare("SELECT id, username, image, created_at FROM users ORDER BY username").all()
    sqlite.close()
    
    const allUsers = result.map((row: any) => ({
      id: row.id,
      username: row.username,
      image: row.image || null,
      createdAt: row.created_at ? new Date(row.created_at * 1000) : new Date(),
    }))
    
    console.log("Users found:", allUsers.length)
    console.log("Users:", allUsers.map((u: any) => u.username).join(", "))
    
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

