"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface User {
  id: number
  username: string
}

interface AddGameFormProps {
  currentUserId: number
}

export default function AddGameForm({ currentUserId }: AddGameFormProps) {
  const router = useRouter()
  const [winnerId, setWinnerId] = useState("")
  const [location, setLocation] = useState("")
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().slice(0, 16)
  )
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  // Fetch users on mount
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winnerId: parseInt(winnerId),
          location,
          playedAt: new Date(playedAt).getTime() / 1000,
        }),
      })

      if (!res.ok) {
        throw new Error("Errore nell'aggiunta della partita")
      }

      // Reset form
      setWinnerId("")
      setLocation("")
      setPlayedAt(new Date().toISOString().slice(0, 16))
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Errore nell'aggiunta della partita")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Aggiungi Partita
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="winner">Vincitore</Label>
            <Select
              id="winner"
              value={winnerId}
              onChange={(e) => setWinnerId(e.target.value)}
              required
            >
              <option value="">Seleziona vincitore</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Sede</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Es: Casa di Mario"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playedAt">Data e Ora</Label>
            <Input
              id="playedAt"
              type="datetime-local"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvataggio..." : "Aggiungi Partita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

