"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { ReviewPrompt } from "@/components/dashboard/review-prompt"
import { ChapterCard } from "@/components/dashboard/chapter-card"
import { getAllChapters, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"
import { OnboardingOverlay } from "@/components/onboarding/onboarding-overlay"

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

          <div className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">チャプター</h2>
            <div className="space-y-2">
              {chapters.map((chapter) => (
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
        </div>
      </PageShell>
    </>
  )
}
