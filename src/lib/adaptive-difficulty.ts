import type { DifficultyLevel, Quiz } from "@/types/content"
import type { UserProgress, ChapterProgress, QuizAttempt } from "@/types/progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"

// --- Accuracy Calculation ---

function getChapterAttempts(
  progress: UserProgress,
  chapterSlug: string
): readonly QuizAttempt[] {
  const chapter: ChapterProgress =
    progress.chapters[chapterSlug] ?? EMPTY_CHAPTER_PROGRESS
  return [...chapter.theory.attempts, ...chapter.practice.attempts]
}

function computeAccuracy(attempts: readonly QuizAttempt[]): number {
  if (attempts.length === 0) return 0
  const correct = attempts.filter((a) => a.correct).length
  return correct / attempts.length
}

// --- Thresholds ---

const BEGINNER_THRESHOLD = 0.5
const ADVANCED_THRESHOLD = 0.8
const MIN_ATTEMPTS_FOR_ADJUSTMENT = 3

// --- Public API ---

export function calculateDifficultyLevel(
  progress: UserProgress,
  chapterSlug: string
): DifficultyLevel {
  const attempts = getChapterAttempts(progress, chapterSlug)

  if (attempts.length < MIN_ATTEMPTS_FOR_ADJUSTMENT) {
    return "beginner"
  }

  const accuracy = computeAccuracy(attempts)

  if (accuracy < BEGINNER_THRESHOLD) {
    return "beginner"
  }
  if (accuracy >= ADVANCED_THRESHOLD) {
    return "advanced"
  }
  return "intermediate"
}

export function filterQuizzesByDifficulty(
  quizzes: readonly Quiz[],
  level: DifficultyLevel
): readonly Quiz[] {
  const withDifficulty = quizzes.filter((q) => q.difficulty !== undefined)

  if (withDifficulty.length === 0) {
    return quizzes
  }

  const matched = withDifficulty.filter((q) => q.difficulty === level)

  if (matched.length === 0) {
    return quizzes
  }

  return matched
}

export function getDifficultyRecommendation(
  progress: UserProgress,
  chapterSlug: string
): string {
  const attempts = getChapterAttempts(progress, chapterSlug)

  if (attempts.length === 0) {
    return "まだ回答履歴がありません。基礎レベルから始めましょう。"
  }

  const accuracy = computeAccuracy(attempts)
  const percentage = Math.round(accuracy * 100)
  const level = calculateDifficultyLevel(progress, chapterSlug)

  const labels: Readonly<Record<DifficultyLevel, string>> = {
    beginner: "基礎",
    intermediate: "標準",
    advanced: "発展",
  }

  if (attempts.length < MIN_ATTEMPTS_FOR_ADJUSTMENT) {
    return `正答率 ${percentage}%（${attempts.length}問回答済み）。もう少し回答すると難易度が自動調整されます。`
  }

  return `正答率 ${percentage}%（${attempts.length}問回答済み）。推奨難易度: ${labels[level]}`
}

export function getAccuracyStats(
  progress: UserProgress,
  chapterSlug: string
): {
  readonly total: number
  readonly correct: number
  readonly accuracy: number
} {
  const attempts = getChapterAttempts(progress, chapterSlug)
  const correct = attempts.filter((a) => a.correct).length
  return {
    total: attempts.length,
    correct,
    accuracy: attempts.length === 0 ? 0 : correct / attempts.length,
  }
}

export const DIFFICULTY_LABELS: Readonly<Record<DifficultyLevel, string>> = {
  beginner: "基礎",
  intermediate: "標準",
  advanced: "発展",
}
