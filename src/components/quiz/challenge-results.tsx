"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trophy, RotateCcw } from "lucide-react"
import type { Quiz } from "@/types/content"

// --- Types ---

export interface ChallengeResult {
  readonly quizId: string
  readonly correct: boolean
  readonly timeSpent: number
}

export interface ChallengeScore {
  readonly totalScore: number
  readonly correctCount: number
  readonly totalCount: number
  readonly longestStreak: number
  readonly totalTimeMs: number
  readonly results: readonly ChallengeResult[]
}

// --- Results Screen ---

interface ResultsScreenProps {
  readonly score: ChallengeScore
  readonly quizzes: readonly Quiz[]
  readonly onRetry: () => void
}

export function ChallengeResultsScreen({
  score,
  quizzes,
  onRetry,
}: ResultsScreenProps) {
  const accuracy = score.totalCount > 0
    ? Math.round((score.correctCount / score.totalCount) * 100)
    : 0
  const avgTimeSeconds = score.totalCount > 0
    ? (score.totalTimeMs / score.totalCount / 1000).toFixed(1)
    : "0"

  return (
    <div className="border border-border rounded-xl p-6 space-y-6">
      <div className="text-center space-y-2">
        <Trophy className="size-10 text-primary mx-auto" />
        <h2 className="text-2xl font-serif text-foreground">
          チャレンジ結果
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-3xl font-serif text-primary tabular-nums">
            {score.totalScore}
          </p>
          <p className="text-xs text-muted-foreground mt-1">スコア</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-3xl font-serif text-foreground tabular-nums">
            {accuracy}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">正答率</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-3xl font-serif text-foreground tabular-nums">
            {score.longestStreak}
          </p>
          <p className="text-xs text-muted-foreground mt-1">最大連続正解</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-3xl font-serif text-foreground tabular-nums">
            {avgTimeSeconds}秒
          </p>
          <p className="text-xs text-muted-foreground mt-1">平均回答時間</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">問題ごとの結果</p>
        <div className="space-y-1">
          {score.results.map((result, i) => {
            const quiz = quizzes.find((q) => q.id === result.quizId)
            return (
              <div
                key={result.quizId}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                  result.correct
                    ? "bg-truth/10 text-truth"
                    : "bg-falsehood/10 text-falsehood"
                )}
              >
                <span className="truncate flex-1">
                  問{i + 1}: {quiz && "question" in quiz ? quiz.question : quiz?.id}
                </span>
                <span className="font-mono text-xs shrink-0 ml-2">
                  {(result.timeSpent / 1000).toFixed(1)}秒
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <Button onClick={onRetry} variant="outline" className="w-full">
        <RotateCcw className="size-4" />
        もう一度挑戦
      </Button>
    </div>
  )
}
