"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
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
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        <Link href={`/chapters/${slug}`} className="hover:underline">{chapter.title}</Link>
        {" / "}
        実践編
      </div>

      <div className="prose prose-zinc max-w-none">
        <h1>実践編: {chapter.title}</h1>
        <p>
          学問編で学んだ論理結合子を、ビジネスや日常生活の場面に適用してみましょう。
          税務署との対話、営業トーク、コードレビューなど、実際のシナリオで論理的に考える練習です。
        </p>
      </div>

      <QuizRunner quizzes={quizzes} onComplete={handleComplete} />

      <div className="flex justify-between pt-4">
        <Link href={`/chapters/${slug}/theory`}>
          <Button variant="outline">← 学問編に戻る</Button>
        </Link>
        <Link href={`/chapters/${slug}/philosophy`}>
          <Button>哲学コラムへ →</Button>
        </Link>
      </div>
    </div>
  )
}
