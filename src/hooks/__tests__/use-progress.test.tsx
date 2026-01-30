import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import { useProgress } from "../use-progress"
import { EMPTY_PROGRESS } from "@/types/progress"

beforeEach(() => {
  localStorage.clear()
})

describe("useProgress", () => {
  it("returns empty progress initially (with streak updated)", () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.progress.chapters).toEqual(EMPTY_PROGRESS.chapters)
    expect(result.current.progress.streak.currentDays).toBe(1)
    expect(result.current.progress.streak.lastActiveDate).toBeTruthy()
  })

  it("records quiz attempt and persists", () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.recordAttempt("01-propositions", "theory", {
        quizId: "q1",
        correct: true,
        timestamp: "2025-01-30T10:00:00Z",
      })
    })

    expect(
      result.current.progress.chapters["01-propositions"].theory.attempts
    ).toHaveLength(1)

    const stored = JSON.parse(localStorage.getItem("logos-progress")!)
    expect(stored.chapters["01-propositions"].theory.attempts).toHaveLength(1)
  })
})
