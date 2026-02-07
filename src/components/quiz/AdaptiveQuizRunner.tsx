"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "./QuizRunner"
import { cn } from "@/lib/utils"
import type { Quiz, DifficultyLevel } from "@/types/content"
import type { UserProgress } from "@/types/progress"
import {
  calculateDifficultyLevel,
  filterQuizzesByDifficulty,
  getDifficultyRecommendation,
  getAccuracyStats,
  DIFFICULTY_LABELS,
} from "@/lib/adaptive-difficulty"

interface QuizResult {
  readonly quizId: string
  readonly correct: boolean
}

interface Props {
  readonly quizzes: readonly Quiz[]
  readonly chapterSlug: string
  readonly progress: UserProgress
  readonly onComplete: (results: readonly QuizResult[]) => void
}

const DIFFICULTY_ORDER: readonly DifficultyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
]

function DifficultyBadge({
  level,
  isActive,
  onClick,
}: {
  readonly level: DifficultyLevel
  readonly isActive: boolean
  readonly onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 border cursor-pointer",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-muted-foreground border-border hover:border-primary/50"
      )}
    >
      {DIFFICULTY_LABELS[level]}
    </button>
  )
}

function AccuracyBar({
  accuracy,
  total,
  correct,
}: {
  readonly accuracy: number
  readonly total: number
  readonly correct: number
}) {
  const percentage = Math.round(accuracy * 100)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>正答率</span>
        <span>
          {correct}/{total} ({percentage}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percentage >= 80
              ? "bg-truth"
              : percentage >= 50
                ? "bg-primary"
                : "bg-falsehood"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function AdaptiveQuizRunner({
  quizzes,
  chapterSlug,
  progress,
  onComplete,
}: Props) {
  const autoLevel = useMemo(
    () => calculateDifficultyLevel(progress, chapterSlug),
    [progress, chapterSlug]
  )

  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(autoLevel)
  const [isManualOverride, setIsManualOverride] = useState(false)
  const [started, setStarted] = useState(false)

  const stats = useMemo(
    () => getAccuracyStats(progress, chapterSlug),
    [progress, chapterSlug]
  )

  const recommendation = useMemo(
    () => getDifficultyRecommendation(progress, chapterSlug),
    [progress, chapterSlug]
  )

  const filteredQuizzes = useMemo(
    () => filterQuizzesByDifficulty(quizzes, selectedLevel),
    [quizzes, selectedLevel]
  )

  const handleLevelChange = useCallback(
    (level: DifficultyLevel) => {
      setSelectedLevel(level)
      setIsManualOverride(level !== autoLevel)
    },
    [autoLevel]
  )

  const handleStart = useCallback(() => {
    setStarted(true)
  }, [])

  if (started) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                selectedLevel === "beginner" && "bg-truth",
                selectedLevel === "intermediate" && "bg-primary",
                selectedLevel === "advanced" && "bg-chart-4"
              )}
            />
            {DIFFICULTY_LABELS[selectedLevel]}レベル
          </span>
          {isManualOverride && (
            <span className="text-xs text-muted-foreground/70">
              (手動選択)
            </span>
          )}
        </div>
        <QuizRunner quizzes={filteredQuizzes as Quiz[]} onComplete={onComplete} />
      </div>
    )
  }

  return (
    <div className="border border-border rounded-xl p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          アダプティブクイズ
        </h3>
        <p className="text-sm text-muted-foreground">{recommendation}</p>
      </div>

      {stats.total > 0 && (
        <AccuracyBar
          accuracy={stats.accuracy}
          total={stats.total}
          correct={stats.correct}
        />
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground">難易度を選択</div>
        <div className="flex items-center gap-2">
          {DIFFICULTY_ORDER.map((level) => (
            <DifficultyBadge
              key={level}
              level={level}
              isActive={selectedLevel === level}
              onClick={() => handleLevelChange(level)}
            />
          ))}
        </div>
        {isManualOverride && (
          <button
            type="button"
            onClick={() => handleLevelChange(autoLevel)}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            推奨レベルに戻す（{DIFFICULTY_LABELS[autoLevel]}）
          </button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredQuizzes.length}問の問題が選択されました
      </div>

      <Button onClick={handleStart} disabled={filteredQuizzes.length === 0}>
        クイズを開始
      </Button>
    </div>
  )
}
