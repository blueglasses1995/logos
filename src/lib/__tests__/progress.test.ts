import { describe, it, expect, beforeEach } from "vitest"
import {
  loadProgress,
  saveProgress,
  recordQuizAttempt,
  markPhilosophyRead,
  updateStreak,
} from "../progress"
import {
  EMPTY_PROGRESS,
  type UserProgress,
} from "@/types/progress"

beforeEach(() => {
  localStorage.clear()
})

describe("loadProgress", () => {
  it("returns empty progress when nothing is stored", () => {
    const result = loadProgress()
    expect(result).toEqual(EMPTY_PROGRESS)
  })

  it("returns stored progress", () => {
    const stored: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 3, lastActiveDate: "2025-01-30", longestStreak: 3 },
    }
    localStorage.setItem("logos-progress", JSON.stringify(stored))
    expect(loadProgress()).toEqual(stored)
  })

  it("migrates legacy progress without new fields", () => {
    const legacy = {
      chapters: {},
      streak: { currentDays: 5, lastActiveDate: "2025-01-30" },
      reviewQueue: [],
    }
    localStorage.setItem("logos-progress", JSON.stringify(legacy))
    const result = loadProgress()
    expect(result.streak.longestStreak).toBe(5)
    expect(result.dailyLogs).toEqual([])
    expect(result.achievements).toEqual([])
    expect(result.onboardingCompleted).toBe(false)
  })
})

describe("saveProgress", () => {
  it("persists progress to localStorage", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 1, lastActiveDate: "2025-01-30", longestStreak: 1 },
    }
    saveProgress(progress)
    const raw = localStorage.getItem("logos-progress")
    expect(JSON.parse(raw!)).toEqual(progress)
  })
})

describe("recordQuizAttempt", () => {
  it("adds attempt to chapter theory section", () => {
    const result = recordQuizAttempt(
      EMPTY_PROGRESS,
      "01-propositions",
      "theory",
      { quizId: "q1", correct: true, timestamp: "2025-01-30T10:00:00Z" }
    )
    expect(result.chapters["01-propositions"].theory.attempts).toHaveLength(1)
    expect(result.chapters["01-propositions"].theory.attempts[0].correct).toBe(true)
  })

  it("updates daily log when recording attempt", () => {
    const result = recordQuizAttempt(
      EMPTY_PROGRESS,
      "01-propositions",
      "theory",
      { quizId: "q1", correct: true, timestamp: "2025-01-30T10:00:00Z" }
    )
    expect(result.dailyLogs).toHaveLength(1)
    expect(result.dailyLogs[0]).toEqual({
      date: "2025-01-30",
      quizCount: 1,
      correctCount: 1,
    })
  })

  it("does not mutate original progress", () => {
    const original = EMPTY_PROGRESS
    recordQuizAttempt(
      original,
      "01-propositions",
      "theory",
      { quizId: "q1", correct: true, timestamp: "2025-01-30T10:00:00Z" }
    )
    expect(original.chapters["01-propositions"]).toBeUndefined()
  })
})

describe("markPhilosophyRead", () => {
  it("marks philosophy section as read", () => {
    const result = markPhilosophyRead(EMPTY_PROGRESS, "01-propositions")
    expect(result.chapters["01-propositions"].philosophy.read).toBe(true)
  })
})

describe("updateStreak", () => {
  it("increments streak for consecutive day", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 2, lastActiveDate: "2025-01-29", longestStreak: 2 },
    }
    const result = updateStreak(progress, "2025-01-30")
    expect(result.streak.currentDays).toBe(3)
    expect(result.streak.lastActiveDate).toBe("2025-01-30")
    expect(result.streak.longestStreak).toBe(3)
  })

  it("resets streak if more than 1 day gap", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 5, lastActiveDate: "2025-01-27", longestStreak: 5 },
    }
    const result = updateStreak(progress, "2025-01-30")
    expect(result.streak.currentDays).toBe(1)
    expect(result.streak.longestStreak).toBe(5)
  })

  it("keeps streak same if same day", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 3, lastActiveDate: "2025-01-30", longestStreak: 3 },
    }
    const result = updateStreak(progress, "2025-01-30")
    expect(result.streak.currentDays).toBe(3)
  })
})
