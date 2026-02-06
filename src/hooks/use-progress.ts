"use client"

import { useState, useEffect, useCallback } from "react"
import {
  loadProgress,
  saveProgress,
  recordQuizAttempt,
  markPhilosophyRead,
  updateStreak,
  addToReviewQueue,
  getDueReviewItems,
} from "@/lib/progress"
import {
  EMPTY_PROGRESS,
  type QuizAttempt,
  type ReviewItemData,
  type UserProgress,
  type Achievement,
  type AchievementId,
} from "@/types/progress"

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)

  useEffect(() => {
    const loaded = loadProgress()
    const today = new Date().toISOString().split("T")[0]
    const updated = updateStreak(loaded, today)
    setProgress(updated)
    saveProgress(updated)
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

  const addReviewItem = useCallback((item: ReviewItemData) => {
    setProgress((prev) => {
      const next = addToReviewQueue(prev, item)
      saveProgress(next)
      return next
    })
  }, [])

  const getDueItems = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    return getDueReviewItems(progress, today)
  }, [progress])

  const unlockAchievement = useCallback((id: AchievementId) => {
    setProgress((prev) => {
      if (prev.achievements.some((a) => a.id === id)) return prev
      const achievement: Achievement = {
        id,
        unlockedAt: new Date().toISOString(),
      }
      const next: UserProgress = {
        ...prev,
        achievements: [...prev.achievements, achievement],
      }
      saveProgress(next)
      return next
    })
  }, [])

  const completeOnboarding = useCallback(() => {
    setProgress((prev) => {
      const next: UserProgress = { ...prev, onboardingCompleted: true }
      saveProgress(next)
      return next
    })
  }, [])

  return {
    progress,
    recordAttempt,
    markPhilosophy,
    addReviewItem,
    getDueItems,
    unlockAchievement,
    completeOnboarding,
  }
}
