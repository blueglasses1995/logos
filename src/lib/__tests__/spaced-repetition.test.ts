import { describe, it, expect } from "vitest"
import {
  calculateNextReview,
  createReviewItem,
  type ReviewItem,
  type ResponseQuality,
} from "../spaced-repetition"

describe("createReviewItem", () => {
  it("creates a new review item with default values", () => {
    const item = createReviewItem("ch1-t1", "01-propositions", "theory")
    expect(item.quizId).toBe("ch1-t1")
    expect(item.chapterSlug).toBe("01-propositions")
    expect(item.section).toBe("theory")
    expect(item.interval).toBe(0)
    expect(item.easeFactor).toBe(2.5)
    expect(item.repetitions).toBe(0)
  })
})

describe("calculateNextReview", () => {
  const baseItem: ReviewItem = {
    quizId: "ch1-t1",
    chapterSlug: "01-propositions",
    section: "theory",
    nextReview: "2026-01-30",
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
  }

  it("resets repetitions on quality < 3", () => {
    const result = calculateNextReview(baseItem, 2)
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })

  it("sets interval to 1 on first successful review", () => {
    const result = calculateNextReview(baseItem, 4)
    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
  })

  it("sets interval to 6 on second successful review", () => {
    const item: ReviewItem = { ...baseItem, repetitions: 1, interval: 1 }
    const result = calculateNextReview(item, 4)
    expect(result.repetitions).toBe(2)
    expect(result.interval).toBe(6)
  })

  it("multiplies interval by ease factor on subsequent reviews", () => {
    const item: ReviewItem = { ...baseItem, repetitions: 2, interval: 6, easeFactor: 2.5 }
    const result = calculateNextReview(item, 4)
    expect(result.repetitions).toBe(3)
    expect(result.interval).toBe(15) // Math.round(6 * 2.5)
  })

  it("increases ease factor for quality 5 (easy)", () => {
    const result = calculateNextReview(baseItem, 5)
    expect(result.easeFactor).toBeGreaterThan(2.5)
  })

  it("decreases ease factor for quality 3 (hard)", () => {
    const result = calculateNextReview(baseItem, 3)
    expect(result.easeFactor).toBeLessThan(2.5)
  })

  it("does not let ease factor go below 1.3", () => {
    const item: ReviewItem = { ...baseItem, easeFactor: 1.3 }
    const result = calculateNextReview(item, 0)
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
  })

  it("sets nextReview date based on interval", () => {
    const item: ReviewItem = { ...baseItem, nextReview: "2026-01-30" }
    const result = calculateNextReview(item, 4)
    // interval = 1 for first success, so next review is tomorrow
    expect(result.nextReview).toBe("2026-01-31")
  })

  it("returns a new object (immutability)", () => {
    const result = calculateNextReview(baseItem, 4)
    expect(result).not.toBe(baseItem)
  })
})
