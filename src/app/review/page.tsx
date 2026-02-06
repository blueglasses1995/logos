"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { QuizProgressDots } from "@/components/quiz/quiz-progress-dots"
import { useProgress } from "@/hooks/use-progress"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { calculateNextReview, type ResponseQuality } from "@/lib/spaced-repetition"
import { MultipleChoiceQuiz } from "@/components/quiz/MultipleChoiceQuiz"
import { TruthTableQuiz } from "@/components/quiz/TruthTableQuiz"
import type { Quiz, MultipleChoiceQuiz as MCQuiz, TruthTableQuiz as TTQuiz } from "@/types/content"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

type ReviewPhase = "answering" | "rating"

export default function ReviewPage() {
  const { addReviewItem, getDueItems } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<ReviewPhase>("answering")
  const [lastCorrect, setLastCorrect] = useState(false)

  const dueItems = getDueItems()

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "復習" },
  ]

  if (dueItems.length === 0) {
    return (
      <>
        <SiteHeader />
        <PageShell variant="quiz">
          <Breadcrumb items={breadcrumbItems} />
          <div className="py-16 text-center space-y-4">
            <CheckCircle2 className="size-10 text-primary mx-auto" />
            <h1 className="text-2xl font-serif">復習するアイテムはありません</h1>
            <p className="text-muted-foreground">
              クイズに回答すると、復習キューに追加されます。
            </p>
            <Link href="/">
              <Button>ダッシュボードへ</Button>
            </Link>
          </div>
        </PageShell>
      </>
    )
  }

  const currentItem = dueItems[currentIndex]
  if (!currentItem) {
    return (
      <>
        <SiteHeader />
        <PageShell variant="quiz">
          <Breadcrumb items={breadcrumbItems} />
          <div className="py-16 text-center space-y-4">
            <CheckCircle2 className="size-10 text-primary mx-auto" />
            <h1 className="text-2xl font-serif">復習完了</h1>
            <p className="text-muted-foreground">本日の復習を完了しました。</p>
            <Link href="/">
              <Button>ダッシュボードへ</Button>
            </Link>
          </div>
        </PageShell>
      </>
    )
  }

  const chapterMeta = getChapterMeta(currentItem.chapterSlug)
  const quizzes = getChapterQuizzes(currentItem.chapterSlug, currentItem.section)
  const quiz = quizzes.find((q) => q.id === currentItem.quizId)

  if (!quiz || !chapterMeta) {
    return (
      <>
        <SiteHeader />
        <PageShell variant="quiz">
          <Breadcrumb items={breadcrumbItems} />
          <p className="text-muted-foreground">クイズデータが見つかりません。</p>
          <Link href="/"><Button>ダッシュボードへ</Button></Link>
        </PageShell>
      </>
    )
  }

  const handleQuizComplete = (correct: boolean) => {
    setLastCorrect(correct)
    setPhase("rating")
  }

  const handleRating = (quality: ResponseQuality) => {
    const updated = calculateNextReview(currentItem, quality)
    addReviewItem(updated)
    setPhase("answering")
    setCurrentIndex((prev) => prev + 1)
  }

  return (
    <>
      <SiteHeader />
      <PageShell variant="quiz">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif">復習</h1>
          <QuizProgressDots
            total={dueItems.length}
            current={currentIndex}
            answered={currentIndex + (phase === "rating" ? 1 : 0)}
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {chapterMeta.title} — {currentItem.section === "theory" ? "学問編" : "実践編"}
        </p>

        {phase === "answering" && (
          <ReviewQuiz quiz={quiz} onComplete={handleQuizComplete} />
        )}

        {phase === "rating" && (
          <div className="rounded-lg border border-border p-6 space-y-4">
            <p className="font-medium text-foreground">
              {lastCorrect ? "正解！" : "不正解"}
            </p>
            <p className="text-sm text-muted-foreground">
              難易度を選んでください（次の復習間隔に影響します）
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRating(1)}
              >
                もう一度
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRating(3)}
              >
                難しい
              </Button>
              <Button size="sm" onClick={() => handleRating(4)}>
                普通
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRating(5)}
              >
                簡単
              </Button>
            </div>
          </div>
        )}
      </PageShell>
    </>
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
