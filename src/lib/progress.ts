import {
  EMPTY_CHAPTER_PROGRESS,
  EMPTY_PROGRESS,
  type ChapterProgress,
  type DailyLog,
  type QuizAttempt,
  type ReviewItemData,
  type SectionProgress,
  type UserProgress,
} from "@/types/progress"

const STORAGE_KEY = "logos-progress"

function migrateProgress(raw: Record<string, unknown>): UserProgress {
  const base = raw as unknown as UserProgress

  return {
    chapters: base.chapters ?? {},
    streak: {
      currentDays: base.streak?.currentDays ?? 0,
      lastActiveDate: base.streak?.lastActiveDate ?? "",
      longestStreak: base.streak?.longestStreak ?? base.streak?.currentDays ?? 0,
    },
    reviewQueue: base.reviewQueue ?? [],
    dailyLogs: base.dailyLogs ?? [],
    achievements: base.achievements ?? [],
    onboardingCompleted: base.onboardingCompleted ?? false,
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw)
    return migrateProgress(parsed)
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function recordQuizAttempt(
  progress: UserProgress,
  chapterSlug: string,
  section: "theory" | "practice",
  attempt: QuizAttempt
): UserProgress {
  const chapter: ChapterProgress =
    progress.chapters[chapterSlug] ?? EMPTY_CHAPTER_PROGRESS

  const sectionProgress: SectionProgress = chapter[section]
  const updatedSection: SectionProgress = {
    ...sectionProgress,
    attempts: [...sectionProgress.attempts, attempt],
  }

  const today = attempt.timestamp.split("T")[0]
  const updatedLogs = updateDailyLog(progress.dailyLogs, today, attempt.correct)

  return {
    ...progress,
    chapters: {
      ...progress.chapters,
      [chapterSlug]: {
        ...chapter,
        [section]: updatedSection,
      },
    },
    dailyLogs: updatedLogs,
  }
}

export function markPhilosophyRead(
  progress: UserProgress,
  chapterSlug: string
): UserProgress {
  const chapter: ChapterProgress =
    progress.chapters[chapterSlug] ?? EMPTY_CHAPTER_PROGRESS

  return {
    ...progress,
    chapters: {
      ...progress.chapters,
      [chapterSlug]: {
        ...chapter,
        philosophy: { read: true },
      },
    },
  }
}

export function addToReviewQueue(
  progress: UserProgress,
  item: ReviewItemData
): UserProgress {
  const existing = progress.reviewQueue ?? []
  const filtered = existing.filter((r) => r.quizId !== item.quizId)
  return {
    ...progress,
    reviewQueue: [...filtered, item],
  }
}

export function getDueReviewItems(
  progress: UserProgress,
  today: string
): readonly ReviewItemData[] {
  const queue = progress.reviewQueue ?? []
  return queue.filter((item) => item.nextReview <= today)
}

export function updateStreak(
  progress: UserProgress,
  today: string
): UserProgress {
  const { lastActiveDate, currentDays, longestStreak } = progress.streak

  if (lastActiveDate === today) return progress

  if (lastActiveDate === "") {
    return {
      ...progress,
      streak: {
        currentDays: 1,
        lastActiveDate: today,
        longestStreak: Math.max(longestStreak ?? 0, 1),
      },
    }
  }

  const lastDate = new Date(lastActiveDate)
  const todayDate = new Date(today)
  const diffMs = todayDate.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const newDays = diffDays === 1 ? currentDays + 1 : 1
  const newLongest = Math.max(longestStreak ?? 0, newDays)

  return {
    ...progress,
    streak: {
      currentDays: newDays,
      lastActiveDate: today,
      longestStreak: newLongest,
    },
  }
}

function updateDailyLog(
  logs: readonly DailyLog[],
  date: string,
  correct: boolean
): readonly DailyLog[] {
  const existing = logs.find((l) => l.date === date)
  if (existing) {
    return logs.map((l) =>
      l.date === date
        ? {
            ...l,
            quizCount: l.quizCount + 1,
            correctCount: l.correctCount + (correct ? 1 : 0),
          }
        : l
    )
  }
  return [
    ...logs,
    { date, quizCount: 1, correctCount: correct ? 1 : 0 },
  ]
}
