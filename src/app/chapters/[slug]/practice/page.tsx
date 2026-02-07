"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
import { AdaptiveQuizRunner } from "@/components/quiz/AdaptiveQuizRunner"
import { ChallengeMode } from "@/components/quiz/ChallengeMode"
import type { ChallengeScore } from "@/components/quiz/challenge-results"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import Link from "next/link"

type PracticeMode = "normal" | "adaptive" | "challenge"

export default function PracticePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const quizzes = getChapterQuizzes(slug, "practice")
  const { progress, recordAttempt } = useProgress()
  const [mode, setMode] = useState<PracticeMode>("normal")

  const handleComplete = (
    results: readonly { quizId: string; correct: boolean }[]
  ) => {
    const timestamp = new Date().toISOString()
    for (const result of results) {
      recordAttempt(slug, "practice", {
        quizId: result.quizId,
        correct: result.correct,
        timestamp,
      })
    }
  }

  const handleChallengeComplete = (score: ChallengeScore) => {
    const timestamp = new Date().toISOString()
    for (const result of score.results) {
      recordAttempt(slug, "practice", {
        quizId: result.quizId,
        correct: result.correct,
        timestamp,
      })
    }
  }

  return (
    <>
      <SiteHeader />
      <PageShell variant="quiz">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: chapter.title, href: `/chapters/${slug}` },
            { label: "実践編" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-2xl font-serif">実践編</h1>
          <p className="text-muted-foreground mt-2">
            学問編で学んだ内容を、実際のシナリオに適用してみましょう。
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "normal" ? "default" : "outline"}
            onClick={() => setMode("normal")}
          >
            通常モード
          </Button>
          <Button
            variant={mode === "adaptive" ? "default" : "outline"}
            onClick={() => setMode("adaptive")}
          >
            アダプティブ
          </Button>
          <Button
            variant={mode === "challenge" ? "default" : "outline"}
            onClick={() => setMode("challenge")}
          >
            チャレンジ
          </Button>
        </div>

        {mode === "normal" && (
          <QuizRunner quizzes={quizzes} onComplete={handleComplete} />
        )}
        {mode === "adaptive" && (
          <AdaptiveQuizRunner
            quizzes={quizzes}
            chapterSlug={slug}
            progress={progress}
            onComplete={handleComplete}
          />
        )}
        {mode === "challenge" && (
          <ChallengeMode
            quizzes={quizzes}
            onComplete={handleChallengeComplete}
          />
        )}

        <div className="flex justify-between pt-8">
          <Link href={`/chapters/${slug}/theory`}>
            <Button variant="outline">← 学問編に戻る</Button>
          </Link>
          <Link href={`/chapters/${slug}/philosophy`}>
            <Button>哲学コラムへ →</Button>
          </Link>
        </div>
      </PageShell>
    </>
  )
}
