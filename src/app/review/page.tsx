"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProgress } from "@/hooks/use-progress"
import { getChapterContent } from "@/lib/content-registry"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { calculateNextReview, createReviewItem, type ResponseQuality } from "@/lib/spaced-repetition"
import { MultipleChoiceQuiz } from "@/components/quiz/MultipleChoiceQuiz"
import { TruthTableQuiz } from "@/components/quiz/TruthTableQuiz"
import type { Quiz, MultipleChoiceQuiz as MCQuiz, TruthTableQuiz as TTQuiz } from "@/types/content"
import type { ReviewItemData } from "@/types/progress"
import Link from "next/link"

type ReviewPhase = "answering" | "rating"

export default function ReviewPage() {
  const { progress, addReviewItem, getDueItems } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<ReviewPhase>("answering")
  const [lastCorrect, setLastCorrect] = useState(false)

  const dueItems = getDueItems()

  if (dueItems.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
        <h1 className="text-2xl font-bold">復習</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-xl mb-4">復習するアイテムはありません</p>
            <p className="text-muted-foreground mb-6">
              クイズに回答すると、復習キューに追加されます。
            </p>
            <Link href="/">
              <Button>ダッシュボードへ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentItem = dueItems[currentIndex]
  if (!currentItem) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
        <h1 className="text-2xl font-bold">復習完了</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-xl mb-4">本日の復習を完了しました</p>
            <Link href="/">
              <Button>ダッシュボードへ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chapterMeta = getChapterMeta(currentItem.chapterSlug)
  const quizzes = getChapterQuizzes(currentItem.chapterSlug, currentItem.section)
  const quiz = quizzes.find((q) => q.id === currentItem.quizId)

  if (!quiz || !chapterMeta) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <p>クイズデータが見つかりません。</p>
        <Link href="/"><Button>ダッシュボードへ</Button></Link>
      </div>
    )
  }

  const handleQuizComplete = (correct: boolean) => {
    setLastCorrect(correct)
    setPhase("rating")
  }

  const handleRating = (quality: ResponseQuality) => {
    const reviewItem = {
      quizId: currentItem.quizId,
      chapterSlug: currentItem.chapterSlug,
      section: currentItem.section,
      nextReview: currentItem.nextReview,
      interval: currentItem.interval,
      easeFactor: currentItem.easeFactor,
      repetitions: currentItem.repetitions,
    }
    const updated = calculateNextReview(reviewItem, quality)
    addReviewItem({
      quizId: updated.quizId,
      chapterSlug: updated.chapterSlug,
      section: updated.section,
      nextReview: updated.nextReview,
      interval: updated.interval,
      easeFactor: updated.easeFactor,
      repetitions: updated.repetitions,
    })
    setPhase("answering")
    setCurrentIndex((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        復習
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">復習</h1>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {dueItems.length}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        {chapterMeta.title} — {currentItem.section === "theory" ? "学問編" : "実践編"}
      </p>

      {phase === "answering" && (
        <ReviewQuiz quiz={quiz} onComplete={handleQuizComplete} />
      )}

      {phase === "rating" && (
        <Card>
          <CardHeader>
            <CardTitle>{lastCorrect ? "正解！" : "不正解"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">難易度を選んでください（次の復習間隔に影響します）</p>
            <div className="flex gap-2 flex-wrap">
              <Button variant="destructive" onClick={() => handleRating(1)}>
                もう一度
              </Button>
              <Button variant="outline" onClick={() => handleRating(3)}>
                難しい
              </Button>
              <Button onClick={() => handleRating(4)}>
                普通
              </Button>
              <Button variant="secondary" onClick={() => handleRating(5)}>
                簡単
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ReviewQuiz({
  quiz,
  onComplete,
}: {
  quiz: Quiz
  onComplete: (correct: boolean) => void
}) {
  if (quiz.type === "multiple-choice") {
    return (
      <MultipleChoiceQuiz
        key={quiz.id}
        quiz={quiz as MCQuiz}
        onAnswer={(correct) => onComplete(correct)}
      />
    )
  }
  if (quiz.type === "truth-table") {
    return (
      <TruthTableQuiz
        key={quiz.id}
        quiz={quiz as TTQuiz}
        onAnswer={(correct) => onComplete(correct)}
      />
    )
  }
  return <p>Unknown quiz type</p>
}
