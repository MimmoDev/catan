import { NextRequest, NextResponse } from "next/server"
import { login, setSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e password sono richiesti" },
        { status: 400 }
      )
    }

    const user = await login(username, password)

    if (!user) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 }
      )
    }

    await setSession(user.id)

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Errore del server" },
      { status: 500 }
    )
  }
}

