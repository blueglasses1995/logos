export interface ReviewItem {
  readonly quizId: string
  readonly chapterSlug: string
  readonly section: "theory" | "practice"
  readonly nextReview: string // ISO date (YYYY-MM-DD)
  readonly interval: number // days
  readonly easeFactor: number // starts at 2.5, min 1.3
  readonly repetitions: number
}

export type ResponseQuality = 0 | 1 | 2 | 3 | 4 | 5
// 0-2: incorrect (reset), 3: correct with difficulty, 4: correct, 5: easy

const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5

export function createReviewItem(
  quizId: string,
  chapterSlug: string,
  section: "theory" | "practice"
): ReviewItem {
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
  item: ReviewItem,
  quality: ResponseQuality
): ReviewItem {
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
