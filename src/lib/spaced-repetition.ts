import type { ReviewItemData } from "@/types/progress"

export type ResponseQuality = 0 | 1 | 2 | 3 | 4 | 5
// 0-2: incorrect (reset), 3: correct with difficulty, 4: correct, 5: easy

const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5

export function createReviewItem(
  quizId: string,
  chapterSlug: string,
  section: "theory" | "practice"
): ReviewItemData {
  return {
    quizId,
    chapterSlug,
    section,
    nextReview: new Date().toISOString().slice(0, 10),
    interval: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    repetitions: 0,
  }
}

export function calculateNextReview(
  item: ReviewItemData,
  quality: ResponseQuality
): ReviewItemData {
  // SM-2 ease factor update
  const newEaseFactor = Math.max(
    MIN_EASE_FACTOR,
    item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    // Incorrect: reset
    newRepetitions = 0
    newInterval = 1
  } else {
    newRepetitions = item.repetitions + 1
    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(item.interval * newEaseFactor)
    }
  }

  // Calculate next review date
  const baseDate = new Date(item.nextReview)
  baseDate.setDate(baseDate.getDate() + newInterval)
  const newNextReview = baseDate.toISOString().slice(0, 10)

  return {
    ...item,
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
    nextReview: newNextReview,
  }
}
