import type { AchievementId, UserProgress } from "@/types/progress"

interface AchievementMeta {
  readonly title: string
  readonly description: string
  readonly icon: string
}

const ACHIEVEMENT_META: Readonly<Record<AchievementId, AchievementMeta>> = {
  "first-chapter": {
    title: "第一歩",
    description: "最初の章をクリア",
    icon: "📖",
  },
  "first-review": {
    title: "復習の始まり",
    description: "初めての復習完了",
    icon: "🔄",
  },
  "streak-7": {
    title: "週間学習者",
    description: "7日連続学習",
    icon: "🔥",
  },
  "streak-30": {
    title: "月間学習者",
    description: "30日連続学習",
    icon: "💪",
  },
  "all-chapters": {
    title: "全章制覇",
    description: "全章クリア",
    icon: "🏆",
  },
  "100-answers": {
    title: "百問の道",
    description: "100問回答",
    icon: "💯",
  },
  "perfect-quiz": {
    title: "完璧な解答",
    description: "クイズ全問正解",
    icon: "⭐",
  },
  "logic-master": {
    title: "論理マスター",
    description: "全章90%以上",
    icon: "🎓",
  },
  "speed-demon": {
    title: "スピードデーモン",
    description: "チャレンジモード完走",
    icon: "⚡",
  },
  "proof-architect": {
    title: "証明の建築家",
    description: "証明ビルダー10問クリア",
    icon: "🏗️",
  },
} as const

const TOTAL_CHAPTERS = 11

export function getAchievementMeta(id: AchievementId): AchievementMeta {
  return ACHIEVEMENT_META[id]
}

export function getAllAchievementIds(): readonly AchievementId[] {
  return Object.keys(ACHIEVEMENT_META) as AchievementId[]
}

function getTotalAnswers(progress: UserProgress): number {
  return Object.values(progress.chapters).reduce((total, chapter) => {
    const theoryCount = chapter.theory.attempts.length
    const practiceCount = chapter.practice.attempts.length
    return total + theoryCount + practiceCount
  }, 0)
}

function getChapterCorrectRate(
  chapter: { readonly theory: { readonly attempts: readonly { readonly correct: boolean }[] }; readonly practice: { readonly attempts: readonly { readonly correct: boolean }[] } }
): number {
  const allAttempts = [...chapter.theory.attempts, ...chapter.practice.attempts]
  if (allAttempts.length === 0) return 0
  const correctCount = allAttempts.filter((a) => a.correct).length
  return correctCount / allAttempts.length
}

function hasCompletedChapter(
  chapter: { readonly theory: { readonly attempts: readonly { readonly correct: boolean }[] }; readonly practice: { readonly attempts: readonly { readonly correct: boolean }[] }; readonly philosophy: { readonly read: boolean } }
): boolean {
  const hasTheoryCorrect = chapter.theory.attempts.some((a) => a.correct)
  const hasPracticeCorrect = chapter.practice.attempts.some((a) => a.correct)
  return hasTheoryCorrect && hasPracticeCorrect
}

function countCompletedChapters(progress: UserProgress): number {
  return Object.values(progress.chapters).filter(hasCompletedChapter).length
}

function hasAnyPerfectQuiz(progress: UserProgress): boolean {
  return Object.values(progress.chapters).some((chapter) => {
    const theoryAttempts = chapter.theory.attempts
    const practiceAttempts = chapter.practice.attempts
    if (theoryAttempts.length >= 3) {
      const allCorrect = theoryAttempts.every((a) => a.correct)
      if (allCorrect) return true
    }
    if (practiceAttempts.length >= 3) {
      const allCorrect = practiceAttempts.every((a) => a.correct)
      if (allCorrect) return true
    }
    return false
  })
}

function countProofBuilderClears(progress: UserProgress): number {
  return Object.values(progress.chapters).reduce((total, chapter) => {
    const proofAttempts = [
      ...chapter.theory.attempts,
      ...chapter.practice.attempts,
    ].filter((a) => a.quizId.includes("proof") && a.correct)
    return total + proofAttempts.length
  }, 0)
}

function allChaptersAbove90(progress: UserProgress): boolean {
  const chapters = Object.values(progress.chapters)
  if (chapters.length < TOTAL_CHAPTERS) return false
  return chapters.every((chapter) => getChapterCorrectRate(chapter) >= 0.9)
}

export function checkAchievements(
  progress: UserProgress
): readonly AchievementId[] {
  const existingIds = new Set(progress.achievements.map((a) => a.id))
  const newlyUnlocked: AchievementId[] = []

  const checks: readonly { readonly id: AchievementId; readonly condition: () => boolean }[] = [
    {
      id: "first-chapter",
      condition: () => countCompletedChapters(progress) >= 1,
    },
    {
      id: "first-review",
      condition: () => progress.reviewQueue.length > 0,
    },
    {
      id: "streak-7",
      condition: () => progress.streak.longestStreak >= 7,
    },
    {
      id: "streak-30",
      condition: () => progress.streak.longestStreak >= 30,
    },
    {
      id: "all-chapters",
      condition: () => countCompletedChapters(progress) >= TOTAL_CHAPTERS,
    },
    {
      id: "100-answers",
      condition: () => getTotalAnswers(progress) >= 100,
    },
    {
      id: "perfect-quiz",
      condition: () => hasAnyPerfectQuiz(progress),
    },
    {
      id: "logic-master",
      condition: () => allChaptersAbove90(progress),
    },
    {
      id: "speed-demon",
      condition: () => {
        // Checked externally when challenge mode is completed
        return false
      },
    },
    {
      id: "proof-architect",
      condition: () => countProofBuilderClears(progress) >= 10,
    },
  ]

  for (const check of checks) {
    if (!existingIds.has(check.id) && check.condition()) {
      newlyUnlocked.push(check.id)
    }
  }

  return newlyUnlocked
}
