"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import Link from "next/link"

export default function PracticePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const quizzes = getChapterQuizzes(slug, "practice")
  const { recordAttempt } = useProgress()

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

        <QuizRunner quizzes={quizzes} onComplete={handleComplete} />

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
