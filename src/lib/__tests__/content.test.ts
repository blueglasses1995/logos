import { describe, it, expect } from "vitest"
import { getChapterQuizzes, getAllChapters } from "../content"
import { getChapterContent } from "../content-registry"

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
    expect(chapters.length).toBeGreaterThanOrEqual(1)
    expect(chapters[0].slug).toBe("01-propositions")
  })
})

describe("getChapterContent", () => {
  it("returns content for a valid chapter slug", () => {
    const content = getChapterContent("01-propositions")
    expect(content).toBeDefined()
    expect(content!.TheoryContent).toBeDefined()
    expect(content!.PhilosophyContent).toBeDefined()
    expect(content!.theoryQuizzes.length).toBeGreaterThan(0)
    expect(content!.practiceQuizzes.length).toBeGreaterThan(0)
  })

  it("returns undefined for an unknown slug", () => {
    const content = getChapterContent("nonexistent")
    expect(content).toBeUndefined()
  })
})
