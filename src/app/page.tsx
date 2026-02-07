"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { ReviewPrompt } from "@/components/dashboard/review-prompt"
import { AchievementDisplay } from "@/components/dashboard/achievement-display"
import { ChapterCard } from "@/components/dashboard/chapter-card"
import { getAllChapters, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"
import { OnboardingOverlay } from "@/components/onboarding/onboarding-overlay"

const PARTS = [
  { label: "Part 1 — 命題論理の基礎", from: 1, to: 5 },
  { label: "Part 2 — 述語論理", from: 6, to: 13 },
  { label: "Part 3 — 集合と構造", from: 14, to: 17 },
  { label: "Part 4 — 帰納と再帰", from: 18, to: 20 },
  { label: "Part 5 — 様相・時相論理", from: 21, to: 23 },
  { label: "Part 6 — 批判的思考と確率", from: 24, to: 26 },
  { label: "Part 7 — 計算と論理", from: 27, to: 28 },
  { label: "Part 8 — メタ論理と総合", from: 29, to: 30 },
] as const

export default function HomePage() {
  const chapters = getAllChapters()
  const { progress, getDueItems, completeOnboarding } = useProgress()
  const dueCount = getDueItems().length

  function getSectionStatus(
    slug: string,
    section: "theory" | "practice" | "philosophy"
  ): "done" | "started" | "none" {
    const cp = progress.chapters[slug] ?? EMPTY_CHAPTER_PROGRESS

    if (section === "philosophy") {
      return cp.philosophy.read ? "done" : "none"
    }

    const quizzes = getChapterQuizzes(slug, section)
    const uniqueIds = new Set(cp[section].attempts.map((a) => a.quizId)).size

    if (quizzes.length > 0 && uniqueIds >= quizzes.length) return "done"
    if (cp[section].attempts.length > 0) return "started"
    return "none"
  }

  return (
    <>
      {!progress.onboardingCompleted && (
        <OnboardingOverlay onComplete={completeOnboarding} />
      )}
      <SiteHeader />
      <PageShell variant="dashboard">
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl font-serif tracking-tight text-foreground">
              Logos
            </h1>
            <p className="text-muted-foreground mt-2">
              論理学の基礎を学び、実務に活かす
            </p>
          </div>

          <ReviewPrompt dueCount={dueCount} />

          <section>
            <AchievementDisplay achievements={progress.achievements} />
          </section>

          <div className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">チャプター</h2>
            <div className="space-y-6">
              {PARTS.map((part) => {
                const partChapters = chapters.filter(
                  (ch) => ch.order >= part.from && ch.order <= part.to
                )
                return (
                  <div key={part.label} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                      {part.label}
                    </h3>
                    <div className="space-y-2">
                      {partChapters.map((chapter) => (
                        <ChapterCard
                          key={chapter.slug}
                          chapter={chapter}
                          sectionStatus={{
                            theory: getSectionStatus(chapter.slug, "theory"),
                            practice: getSectionStatus(chapter.slug, "practice"),
                            philosophy: getSectionStatus(chapter.slug, "philosophy"),
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </PageShell>
    </>
  )
}
