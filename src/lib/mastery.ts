import type { ChapterMeta } from "@/types/content"
import type { UserProgress, ChapterProgress } from "@/types/progress"

// --- Types ---

export type MasteryLevel = "beginner" | "intermediate" | "advanced" | "master"

export interface ChapterMastery {
  readonly slug: string
  readonly title: string
  readonly order: number
  readonly totalAttempts: number
  readonly correctAttempts: number
  readonly accuracy: number
  readonly level: MasteryLevel
  readonly nextReviewDate: string | null
  readonly reviewItemCount: number
}

export interface WeakArea {
  readonly chapterSlug: string
  readonly chapterTitle: string
  readonly section: "theory" | "practice"
  readonly accuracy: number
  readonly totalAttempts: number
}

export interface StudyRecommendation {
  readonly type: "review" | "practice" | "new"
  readonly chapterSlug: string
  readonly chapterTitle: string
  readonly reason: string
}

export interface MasteryData {
  readonly chapters: readonly ChapterMastery[]
  readonly overallAccuracy: number
  readonly weakAreas: readonly WeakArea[]
  readonly recommendations: readonly StudyRecommendation[]
  readonly upcomingReviews: readonly {
    readonly date: string
    readonly count: number
  }[]
}

// --- Config ---

export const MASTERY_CONFIG: Readonly<Record<MasteryLevel, {
  readonly label: string
  readonly minAccuracy: number
  readonly colorClass: string
  readonly bgClass: string
  readonly barClass: string
}>> = {
  beginner: {
    label: "初心者",
    minAccuracy: 0,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    barClass: "bg-destructive",
  },
  intermediate: {
    label: "中級者",
    minAccuracy: 40,
    colorClass: "text-chart-4",
    bgClass: "bg-chart-4/10",
    barClass: "bg-chart-4",
  },
  advanced: {
    label: "上級者",
    minAccuracy: 70,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    barClass: "bg-primary",
  },
  master: {
    label: "マスター",
    minAccuracy: 90,
    colorClass: "text-chart-2",
    bgClass: "bg-chart-2/10",
    barClass: "bg-chart-2",
  },
}

// --- Helpers ---

export function getMasteryLevel(accuracy: number): MasteryLevel {
  if (accuracy >= 90) return "master"
  if (accuracy >= 70) return "advanced"
  if (accuracy >= 40) return "intermediate"
  return "beginner"
}

function computeSectionAccuracy(
  chapterProgress: ChapterProgress | undefined,
  section: "theory" | "practice"
): { readonly accuracy: number; readonly total: number } {
  if (!chapterProgress) return { accuracy: 0, total: 0 }
  const attempts = chapterProgress[section].attempts
  if (attempts.length === 0) return { accuracy: 0, total: 0 }
  const correct = attempts.filter((a) => a.correct).length
  return {
    accuracy: Math.round((correct / attempts.length) * 100),
    total: attempts.length,
  }
}

// --- Main computation ---

export function computeMasteryData(
  progress: UserProgress,
  chapters: readonly ChapterMeta[]
): MasteryData {
  const today = new Date().toISOString().slice(0, 10)

  const chapterMasteries: ChapterMastery[] = chapters.map((ch) => {
    const cp = progress.chapters[ch.slug]
    const theoryAttempts = cp?.theory.attempts ?? []
    const practiceAttempts = cp?.practice.attempts ?? []
    const allAttempts = [...theoryAttempts, ...practiceAttempts]
    const totalAttempts = allAttempts.length
    const correctAttempts = allAttempts.filter((a) => a.correct).length
    const accuracy = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0

    const chapterReviewItems = (progress.reviewQueue ?? []).filter(
      (r) => r.chapterSlug === ch.slug
    )
    const nextReview = chapterReviewItems.length > 0
      ? chapterReviewItems
          .map((r) => r.nextReview)
          .sort()
          [0] ?? null
      : null

    return {
      slug: ch.slug,
      title: ch.title,
      order: ch.order,
      totalAttempts,
      correctAttempts,
      accuracy,
      level: totalAttempts > 0 ? getMasteryLevel(accuracy) : "beginner",
      nextReviewDate: nextReview,
      reviewItemCount: chapterReviewItems.filter((r) => r.nextReview <= today).length,
    }
  })

  const totalAttempts = chapterMasteries.reduce((s, c) => s + c.totalAttempts, 0)
  const totalCorrect = chapterMasteries.reduce((s, c) => s + c.correctAttempts, 0)
  const overallAccuracy = totalAttempts > 0
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0

  // Weak areas: sections with at least 3 attempts and < 60% accuracy
  const weakAreas: WeakArea[] = []
  for (const ch of chapters) {
    const cp = progress.chapters[ch.slug]
    for (const section of ["theory", "practice"] as const) {
      const { accuracy, total } = computeSectionAccuracy(cp, section)
      if (total >= 3 && accuracy < 60) {
        weakAreas.push({
          chapterSlug: ch.slug,
          chapterTitle: ch.title,
          section,
          accuracy,
          totalAttempts: total,
        })
      }
    }
  }
  weakAreas.sort((a, b) => a.accuracy - b.accuracy)

  // Study recommendations
  const recommendations: StudyRecommendation[] = []

  const dueChapters = chapterMasteries.filter((c) => c.reviewItemCount > 0)
  for (const ch of dueChapters.slice(0, 2)) {
    recommendations.push({
      type: "review",
      chapterSlug: ch.slug,
      chapterTitle: ch.title,
      reason: `${ch.reviewItemCount}件の復習アイテムが期限です`,
    })
  }

  for (const wa of weakAreas.slice(0, 2)) {
    if (!recommendations.some((r) => r.chapterSlug === wa.chapterSlug)) {
      recommendations.push({
        type: "practice",
        chapterSlug: wa.chapterSlug,
        chapterTitle: wa.chapterTitle,
        reason: `${wa.section === "theory" ? "理論" : "実践"}の正答率が${wa.accuracy}%です`,
      })
    }
  }

  const unstarted = chapterMasteries.filter((c) => c.totalAttempts === 0)
  if (unstarted.length > 0 && recommendations.length < 3) {
    const next = unstarted[0]
    if (next) {
      recommendations.push({
        type: "new",
        chapterSlug: next.slug,
        chapterTitle: next.title,
        reason: "まだ始めていないチャプターです",
      })
    }
  }

  // Upcoming reviews grouped by date
  const reviewQueue = progress.reviewQueue ?? []
  const reviewsByDate: Record<string, number> = {}
  for (const item of reviewQueue) {
    if (item.nextReview >= today) {
      reviewsByDate[item.nextReview] = (reviewsByDate[item.nextReview] ?? 0) + 1
    }
  }
  const upcomingReviews = Object.entries(reviewsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 7)
    .map(([date, count]) => ({ date, count }))

  return {
    chapters: chapterMasteries,
    overallAccuracy,
    weakAreas: weakAreas.slice(0, 5),
    recommendations: recommendations.slice(0, 3),
    upcomingReviews,
  }
}
