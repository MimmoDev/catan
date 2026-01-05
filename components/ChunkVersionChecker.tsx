"use client"

import { useEffect } from "react"

export default function ChunkVersionChecker() {
  useEffect(() => {
    // Check for chunk loading errors and force reload
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      if (
        error?.message?.includes("chunk") ||
        error?.message?.includes("Loading chunk") ||
        error?.name === "ChunkLoadError"
      ) {
        console.log("Chunk loading error detected, forcing page reload...")
        // Clear cache and reload
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name)
            })
          })
        }
        // Force reload without cache
        window.location.reload()
      }
    }

    // Listen for unhandled errors
    window.addEventListener("error", handleChunkError, true)

    // Also check for failed resource loads
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement
      if (
        target &&
        (target.tagName === "SCRIPT" || target.tagName === "LINK") &&
        (target as any).src?.includes("_next/static")
      ) {
        console.log("Failed to load Next.js chunk, forcing reload...")
        // Clear cache and reload
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name)
            })
          })
        }
        window.location.reload()
      }
    }

    window.addEventListener("error", handleResourceError, true)

    return () => {
      window.removeEventListener("error", handleChunkError, true)
      window.removeEventListener("error", handleResourceError, true)
    }
  }, [])

  return null
}

