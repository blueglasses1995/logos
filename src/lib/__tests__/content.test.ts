import { describe, it, expect } from "vitest"
import { getChapterQuizzes, getAllChapters } from "../content"

describe("getChapterQuizzes", () => {
  it("loads theory quizzes for chapter 01", () => {
    const quizzes = getChapterQuizzes("01-propositions", "theory")
    expect(quizzes.length).toBeGreaterThan(0)
    expect(quizzes[0].id).toBe("ch1-t1")
  })

  it("loads practice quizzes for chapter 01", () => {
    const quizzes = getChapterQuizzes("01-propositions", "practice")
    expect(quizzes.length).toBeGreaterThan(0)
    expect(quizzes[0].id).toBe("ch1-p1")
  })
})

describe("getAllChapters", () => {
  it("returns chapter metadata list", () => {
    const chapters = getAllChapters()
    expect(chapters).toHaveLength(1)
    expect(chapters[0].slug).toBe("01-propositions")
  })
})
