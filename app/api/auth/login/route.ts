import { NextRequest, NextResponse } from "next/server"
import { login, setSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("Login attempt for:", username)

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e password sono richiesti" },
        { status: 400 }
      )
    }

    const user = await login(username, password)

    if (!user) {
      console.log("Login failed: invalid credentials")
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 }
      )
    }

    await setSession(user.id)
    console.log("Login successful, session set for user:", user.id)

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } })
  } catch (error) {
    console.error("Login error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { error: "Errore del server", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

