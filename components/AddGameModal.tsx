"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"

interface User {
  id: number
  username: string
}

interface Participant {
  userId: string
  score: string
}

interface AddGameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: number
}

export default function AddGameModal({
  open,
  onOpenChange,
  currentUserId,
}: AddGameModalProps) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().slice(0, 16)
  )
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [participants, setParticipants] = useState<Participant[]>([
    { userId: "", score: "" },
  ])

  // Fetch users on mount and when modal opens
  useEffect(() => {
    if (open) {
      fetch("/api/users")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          console.log("Users loaded:", data)
          setUsers(data || [])
        })
        .catch((error) => {
          console.error("Error fetching users:", error)
          alert("Errore nel caricamento degli utenti. Ricarica la pagina.")
        })
    }
  }, [open])

  const addParticipant = () => {
    setParticipants([...participants, { userId: "", score: "" }])
  }

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
  }

  const updateParticipant = (index: number, field: "userId" | "score", value: string) => {
    const updated = [...participants]
    updated[index] = { ...updated[index], [field]: value }
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate participants
    const validParticipants = participants.filter(
      (p) => p.userId && p.score && !isNaN(parseInt(p.score))
    )

    if (validParticipants.length === 0) {
      alert("Aggiungi almeno un partecipante con punteggio valido")
      setLoading(false)
      return
    }

    // Find winner (highest score)
    const winner = validParticipants.reduce((prev, current) =>
      parseInt(current.score) > parseInt(prev.score) ? current : prev
    )

    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winnerId: parseInt(winner.userId),
          location,
          playedAt: new Date(playedAt).getTime() / 1000,
          participants: validParticipants.map((p) => ({
            userId: parseInt(p.userId),
            score: parseInt(p.score),
          })),
        }),
      })

      if (!res.ok) {
        throw new Error("Errore nell'aggiunta della partita")
      }

      // Reset form
      setLocation("")
      setPlayedAt(new Date().toISOString().slice(0, 16))
      setParticipants([{ userId: "", score: "" }])
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Errore nell'aggiunta della partita")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aggiungi Partita
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Partecipanti e Punteggi</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParticipant}
              >
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi
              </Button>
            </div>

            {participants.map((participant, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`participant-${index}`}>Giocatore</Label>
                  <Select
                    id={`participant-${index}`}
                    value={participant.userId}
                    onChange={(e) =>
                      updateParticipant(index, "userId", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleziona giocatore</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`score-${index}`}>Punteggio</Label>
                  <Input
                    id={`score-${index}`}
                    type="number"
                    min="0"
                    value={participant.score}
                    onChange={(e) =>
                      updateParticipant(index, "score", e.target.value)
                    }
                    placeholder="0"
                    required
                  />
                </div>
                {participants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParticipant(index)}
                    className="mb-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            💡 Il vincitore sarà determinato automaticamente dal punteggio più alto
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Annulla
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Salvataggio..." : "Aggiungi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
