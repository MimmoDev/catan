"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"

interface User {
  id: number
  username: string
  image: string | null
}

interface Participant {
  userId: number
  username: string
  image: string | null
  score: number
}

interface Game {
  gameId: number
  winnerId: number
  winnerUsername: string
  location: string
  playedAt: number
  participants: Participant[]
}

interface UserProfileClientProps {
  user: User
  games: Game[]
  stats: {
    totalGames: number
    wins: number
    totalScore: number
  }
}

export default function UserProfileClient({
  user,
  games,
  stats,
}: UserProfileClientProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (gameId: number) => {
    setGameToDelete(gameId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!gameToDelete) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/games/${gameToDelete}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Errore nell'eliminazione")
      }

      setDeleteDialogOpen(false)
      setGameToDelete(null)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Errore nell'eliminazione della partita")
    } finally {
      setIsDeleting(false)
    }
  }

  const gameToDeleteData = games.find((g) => g.gameId === gameToDelete)

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Indietro
        </Button>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              {user.image ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border border-border">
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-3xl border border-border">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">Profilo Giocatore</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">{stats.totalGames}</div>
                <div className="text-sm text-muted-foreground">Partite</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {stats.wins}
                </div>
                <div className="text-sm text-muted-foreground">Vittorie</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">{stats.totalScore.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Punteggio Totale</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storico Partite</CardTitle>
          </CardHeader>
          <CardContent>
            {games.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nessuna partita ancora
              </p>
            ) : (
              <Accordion type="single" defaultValue="">
                {games.map((game) => {
                  const isWinner = game.winnerId === user.id
                  const userParticipant = game.participants.find(
                    (p) => p.userId === user.id
                  )
                  const userPosition =
                    game.participants.findIndex((p) => p.userId === user.id) + 1

                  return (
                    <AccordionItem key={game.gameId} value={`game-${game.gameId}`}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            {isWinner && (
                              <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                            )}
                            <div>
                              <div className="font-semibold text-left">
                                {game.location}
                              </div>
                              <div className="text-sm text-muted-foreground text-left">
                                {formatDate(game.playedAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {userParticipant && (
                              <div className="text-right flex-shrink-0">
                                <div className="text-lg font-bold">
                                  {userParticipant.score} pt
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {userPosition}° posto
                                </div>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(game.gameId)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">
                            Classifica Partita:
                          </div>
                          {game.participants.map((participant, index) => {
                            const isUser = participant.userId === user.id
                            return (
                              <div
                                key={participant.userId}
                                className={`flex items-center gap-3 p-2 rounded ${
                                  isUser ? "bg-muted/50" : ""
                                }`}
                              >
                                <div className="w-6 text-center text-sm font-bold text-muted-foreground">
                                  {index + 1}°
                                </div>
                                {participant.image ? (
                                  <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                                    <Image
                                      src={participant.image}
                                      alt={participant.username}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-xs border border-border">
                                    {participant.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {participant.username}
                                    {participant.userId === game.winnerId && (
                                      <Trophy className="h-3 w-3 inline ml-1 text-yellow-500" />
                                    )}
                                  </div>
                                </div>
                                <div className="font-bold text-sm">
                                  {participant.score} pt
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Elimina Partita</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler eliminare questa partita?
                {gameToDeleteData && (
                  <>
                    <br />
                    <br />
                    <strong>{gameToDeleteData.location}</strong>
                    <br />
                    {formatDate(gameToDeleteData.playedAt)}
                  </>
                )}
                <br />
                <br />
                Questa azione non può essere annullata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setGameToDelete(null)
                }}
                disabled={isDeleting}
              >
                Annulla
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminazione..." : "Elimina"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

