import {
  EMPTY_CHAPTER_PROGRESS,
  EMPTY_PROGRESS,
  type ChapterProgress,
  type QuizAttempt,
  type ReviewItemData,
  type SectionProgress,
  type UserProgress,
} from "@/types/progress"

const STORAGE_KEY = "logos-progress"

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    return JSON.parse(raw) as UserProgress
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

  return {
    ...progress,
    chapters: {
      ...progress.chapters,
      [chapterSlug]: {
        ...chapter,
        [section]: updatedSection,
      },
    },
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
  const { lastActiveDate, currentDays } = progress.streak

  if (lastActiveDate === today) return progress

  const lastDate = new Date(lastActiveDate)
  const todayDate = new Date(today)
  const diffMs = todayDate.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const newDays = diffDays === 1 ? currentDays + 1 : 1

  return {
    ...progress,
    streak: {
      currentDays: newDays,
      lastActiveDate: today,
    },
  }
}
