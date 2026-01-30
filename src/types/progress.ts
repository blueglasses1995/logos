export interface QuizAttempt {
  readonly quizId: string
  readonly correct: boolean
  readonly timestamp: string
}

export interface SectionProgress {
  readonly completed: boolean
  readonly attempts: readonly QuizAttempt[]
}

export interface ChapterProgress {
  readonly theory: SectionProgress
  readonly practice: SectionProgress
  readonly philosophy: { readonly read: boolean }
}

export interface UserProgress {
  readonly chapters: Readonly<Record<string, ChapterProgress>>
  readonly streak: {
    readonly currentDays: number
    readonly lastActiveDate: string
  }
}

export const EMPTY_SECTION_PROGRESS: SectionProgress = {
  completed: false,
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
  },
}
