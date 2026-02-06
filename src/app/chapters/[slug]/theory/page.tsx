"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ReadingProgressBar } from "@/components/layout/reading-progress-bar"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { getChapterContent } from "@/lib/content-registry"
import { useProgress } from "@/hooks/use-progress"
import Link from "next/link"

export default function TheoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const content = getChapterContent(slug)
  if (!content) notFound()
  const { TheoryContent } = content

  const quizzes = getChapterQuizzes(slug, "theory")
  const { recordAttempt } = useProgress()

  const handleComplete = (
    results: readonly { quizId: string; correct: boolean }[]
  ) => {
    const timestamp = new Date().toISOString()
    for (const result of results) {
      recordAttempt(slug, "theory", {
        quizId: result.quizId,
        correct: result.correct,
        timestamp,
      })
    }
  }

  return (
    <>
      <ReadingProgressBar />
      <SiteHeader />
      <PageShell variant="reading">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: chapter.title, href: `/chapters/${slug}` },
            { label: "学問編" },
          ]}
        />

        <TheoryContent />

        <div className="border-t border-border mt-16 pt-8">
          <h2 className="text-xl font-serif mb-6">確認クイズ</h2>
          <QuizRunner quizzes={quizzes} onComplete={handleComplete} />
        </div>

        <div className="flex justify-between pt-8">
          <Link href={`/chapters/${slug}`}>
            <Button variant="outline">チャプターに戻る</Button>
          </Link>
          <Link href={`/chapters/${slug}/practice`}>
            <Button>実践編へ →</Button>
          </Link>
        </div>
      </PageShell>
    </>
  )
}
