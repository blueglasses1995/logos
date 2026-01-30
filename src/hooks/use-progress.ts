"use client"

import { useState, useEffect, useCallback } from "react"
import {
  loadProgress,
  saveProgress,
  recordQuizAttempt,
  markPhilosophyRead,
  updateStreak,
} from "@/lib/progress"
import { EMPTY_PROGRESS, type QuizAttempt, type UserProgress } from "@/types/progress"

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)

  useEffect(() => {
    const loaded = loadProgress()
    const today = new Date().toISOString().split("T")[0]
    const updated = updateStreak(loaded, today)
    setProgress(updated)
    saveProgress(updated)
  }, [])

  const persist = useCallback((next: UserProgress) => {
    setProgress(next)
    saveProgress(next)
  }, [])

  const recordAttempt = useCallback(
    (
      chapterSlug: string,
      section: "theory" | "practice",
      attempt: QuizAttempt
    ) => {
      setProgress((prev) => {
        const next = recordQuizAttempt(prev, chapterSlug, section, attempt)
        saveProgress(next)
        return next
      })
    },
    []
  )

  const markPhilosophy = useCallback((chapterSlug: string) => {
    setProgress((prev) => {
      const next = markPhilosophyRead(prev, chapterSlug)
      saveProgress(next)
      return next
    })
  }, [])

  return {
    progress,
    recordAttempt,
    markPhilosophy,
    persist,
  }
}
