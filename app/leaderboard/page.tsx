import { redirect } from "next/navigation"

export default async function LeaderboardPage() {
  // Redirect to home page where the leaderboard is now
  redirect("/")
}

