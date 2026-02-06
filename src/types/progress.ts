export interface QuizAttempt {
  readonly quizId: string
  readonly correct: boolean
  readonly timestamp: string
}

export interface SectionProgress {
  readonly attempts: readonly QuizAttempt[]
}

export interface ChapterProgress {
  readonly theory: SectionProgress
  readonly practice: SectionProgress
  readonly philosophy: { readonly read: boolean }
}

export interface ReviewItemData {
  readonly quizId: string
  readonly chapterSlug: string
  readonly section: "theory" | "practice"
  readonly nextReview: string
  readonly interval: number
  readonly easeFactor: number
  readonly repetitions: number
}

export interface DailyLog {
  readonly date: string
  readonly quizCount: number
  readonly correctCount: number
}

export type AchievementId =
  | "first-chapter"
  | "first-review"
  | "streak-7"
  | "streak-30"
  | "all-chapters"
  | "100-answers"
  | "perfect-quiz"

export interface Achievement {
  readonly id: AchievementId
  readonly unlockedAt: string
}

export interface UserProgress {
  readonly chapters: Readonly<Record<string, ChapterProgress>>
  readonly streak: {
    readonly currentDays: number
    readonly lastActiveDate: string
    readonly longestStreak: number
  }
  readonly reviewQueue: readonly ReviewItemData[]
  readonly dailyLogs: readonly DailyLog[]
  readonly achievements: readonly Achievement[]
  readonly onboardingCompleted: boolean
}

const EMPTY_SECTION_PROGRESS: SectionProgress = {
  attempts: [],
}

export const EMPTY_CHAPTER_PROGRESS: ChapterProgress = {
  theory: EMPTY_SECTION_PROGRESS,
  practice: EMPTY_SECTION_PROGRESS,
  philosophy: { read: false },
}

export const EMPTY_PROGRESS: UserProgress = {
  chapters: {},
  streak: {
    currentDays: 0,
    lastActiveDate: "",
    longestStreak: 0,
  },
  reviewQueue: [],
  dailyLogs: [],
  achievements: [],
  onboardingCompleted: false,
}
