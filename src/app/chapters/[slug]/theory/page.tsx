"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
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
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        <Link href={`/chapters/${slug}`} className="hover:underline">{chapter.title}</Link>
        {" / "}
        学問編
      </div>

      <TheoryContent />

      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-4">確認クイズ</h2>
        <QuizRunner quizzes={quizzes} onComplete={handleComplete} />
      </div>

      <div className="flex justify-between pt-4">
        <Link href={`/chapters/${slug}`}>
          <Button variant="outline">チャプターに戻る</Button>
        </Link>
        <Link href={`/chapters/${slug}/practice`}>
          <Button>実践編へ →</Button>
        </Link>
      </div>
    </div>
  )
}
