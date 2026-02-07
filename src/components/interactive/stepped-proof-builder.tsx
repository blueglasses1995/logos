"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  EXERCISES,
  LEVEL_LABELS,
  type ProofLevel,
  type Exercise,
} from "./stepped-proof-builder-data"
import { StepSelectionView } from "./stepped-proof-builder-views"
import { BlockArrangeView } from "./stepped-proof-builder-views"
import { StructureView } from "./stepped-proof-builder-views"

interface SteppedProofBuilderProps {
  readonly caption?: string
}

// --- Sub-components ---

function PremisesDisplay({
  premises,
  conclusion,
}: {
  readonly premises: readonly string[]
  readonly conclusion: string
}) {
  return (
    <div className="bg-secondary border border-border rounded-md px-4 py-3 space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">
        前提と結論
      </div>
      <div className="space-y-1">
        {premises.map((p, i) => (
          <div key={i} className="font-mono text-sm text-foreground">
            {i + 1}. {p}
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-2">
        <div className="font-mono text-sm font-bold text-foreground">
          ∴ {conclusion}
        </div>
      </div>
    </div>
  )
}

function LevelTab({
  level,
  label,
  isActive,
  onClick,
}: {
  readonly level: ProofLevel
  readonly label: string
  readonly isActive: boolean
  readonly onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      Lv.{level} {label}
    </button>
  )
}

// --- Main Component ---

export function SteppedProofBuilder({ caption }: SteppedProofBuilderProps) {
  const [currentLevel, setCurrentLevel] = useState<ProofLevel>(1)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  const exercisesForLevel = useMemo(
    () => EXERCISES.filter((e) => e.level === currentLevel),
    [currentLevel]
  )

  const currentExercise = exercisesForLevel[exerciseIndex] as
    | Exercise
    | undefined

  const handleLevelChange = useCallback((level: ProofLevel) => {
    setCurrentLevel(level)
    setExerciseIndex(0)
    setCompletedCount(0)
  }, [])

  const handleExerciseComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        setCompletedCount((prev) => prev + 1)
      }
    },
    []
  )

  const handleNextExercise = useCallback(() => {
    if (exerciseIndex < exercisesForLevel.length - 1) {
      setExerciseIndex((prev) => prev + 1)
    }
  }, [exerciseIndex, exercisesForLevel.length])

  const isLastExercise = exerciseIndex >= exercisesForLevel.length - 1

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            段階的証明ビルダー
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {([1, 2, 3] as const).map((level) => (
              <LevelTab
                key={level}
                level={level}
                label={LEVEL_LABELS[level]}
                isActive={currentLevel === level}
                onClick={() => handleLevelChange(level)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            問題 {exerciseIndex + 1} / {exercisesForLevel.length}
          </span>
          <span>正解数: {completedCount}</span>
        </div>

        {currentExercise && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">
              {currentExercise.title}
            </h4>

            <PremisesDisplay
              premises={currentExercise.premises}
              conclusion={currentExercise.conclusion}
            />

            {currentExercise.level === 1 && (
              <StepSelectionView
                key={currentExercise.id}
                exercise={currentExercise}
                onComplete={handleExerciseComplete}
              />
            )}
            {currentExercise.level === 2 && (
              <BlockArrangeView
                key={currentExercise.id}
                exercise={currentExercise}
                onComplete={handleExerciseComplete}
              />
            )}
            {currentExercise.level === 3 && (
              <StructureView
                key={currentExercise.id}
                exercise={currentExercise}
                onComplete={handleExerciseComplete}
              />
            )}

            {!isLastExercise && (
              <div className="pt-2">
                <Button variant="outline" onClick={handleNextExercise}>
                  次の問題へ
                </Button>
              </div>
            )}
          </div>
        )}

        {!currentExercise && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            このレベルの問題はありません。
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
