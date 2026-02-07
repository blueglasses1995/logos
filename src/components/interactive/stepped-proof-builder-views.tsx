"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  StepSelectionExercise,
  BlockArrangeExercise,
  StructureExercise,
} from "./stepped-proof-builder-data"

// --- Shared ---

function FeedbackBox({
  correct,
  explanation,
}: {
  readonly correct: boolean
  readonly explanation: string
}) {
  return (
    <div
      className={cn(
        "text-sm rounded-md px-4 py-3",
        correct
          ? "bg-truth/10 text-foreground"
          : "bg-falsehood/10 text-foreground"
      )}
    >
      <div className="font-medium mb-1">{correct ? "正解！" : "不正解"}</div>
      <p className="text-muted-foreground">{explanation}</p>
    </div>
  )
}

function ArrowFlow({ count }: { readonly count: number }) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-mono bg-secondary px-2 py-1 rounded border border-border">
            {i + 1}
          </span>
          {i < count - 1 && (
            <span className="text-muted-foreground text-xs">→</span>
          )}
        </div>
      ))}
    </div>
  )
}

function shuffleArray<T>(arr: readonly T[]): readonly T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

// --- Level 1: Step Selection ---

export function StepSelectionView({
  exercise,
  onComplete,
}: {
  readonly exercise: StepSelectionExercise
  readonly onComplete: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const toggleStep = useCallback(
    (stepId: string) => {
      if (submitted) return
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(stepId)) {
          next.delete(stepId)
        } else {
          next.add(stepId)
        }
        return next
      })
    },
    [submitted]
  )

  const isCorrect = useMemo(() => {
    if (selected.size !== exercise.correctStepIds.length) return false
    return exercise.correctStepIds.every((id) => selected.has(id))
  }, [selected, exercise.correctStepIds])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete(isCorrect)
  }, [isCorrect, onComplete])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        正しい証明ステップをすべて選択してください。不要なステップは選択しないでください。
      </p>

      <div className="space-y-2">
        {exercise.options.map((step) => {
          const isSelected = selected.has(step.id)
          const isCorrectStep = exercise.correctStepIds.includes(step.id)

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => toggleStep(step.id)}
              disabled={submitted}
              className={cn(
                "w-full text-left px-4 py-3 rounded-md border-2 font-mono text-sm",
                "transition-all duration-300 cursor-pointer select-none",
                submitted && "cursor-default",
                !submitted && isSelected && "border-primary bg-primary/5",
                !submitted && !isSelected && "border-border hover:border-primary/30",
                submitted && isSelected && isCorrectStep &&
                  "bg-truth/10 border-truth text-foreground",
                submitted && isSelected && !isCorrectStep &&
                  "bg-falsehood/10 border-falsehood text-foreground",
                submitted && !isSelected && isCorrectStep &&
                  "border-truth/50 bg-truth/5 opacity-70"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{step.content}</span>
                <span className="text-xs text-muted-foreground ml-3">
                  {step.rule}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} disabled={selected.size === 0}>
          提出
        </Button>
      )}

      {submitted && (
        <FeedbackBox correct={isCorrect} explanation={exercise.explanation} />
      )}
    </div>
  )
}

// --- Level 2: Block Arrange ---

export function BlockArrangeView({
  exercise,
  onComplete,
}: {
  readonly exercise: BlockArrangeExercise
  readonly onComplete: (correct: boolean) => void
}) {
  const [order, setOrder] = useState<readonly string[]>(() =>
    shuffleArray(exercise.blocks.map((b) => b.id))
  )
  const [submitted, setSubmitted] = useState(false)

  const blockMap = useMemo(
    () => new Map(exercise.blocks.map((b) => [b.id, b])),
    [exercise.blocks]
  )

  const moveBlock = useCallback(
    (index: number, direction: "up" | "down") => {
      if (submitted) return
      const targetIndex = direction === "up" ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= order.length) return
      setOrder((prev) => {
        const next = [...prev]
        const temp = next[index]
        next[index] = next[targetIndex]
        next[targetIndex] = temp
        return next
      })
    },
    [submitted, order.length]
  )

  const isCorrect = useMemo(
    () =>
      order.length === exercise.correctOrder.length &&
      order.every((id, i) => id === exercise.correctOrder[i]),
    [order, exercise.correctOrder]
  )

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete(isCorrect)
  }, [isCorrect, onComplete])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        証明ブロックを正しい順序に並べ替えてください。矢印ボタンで順序を変更できます。
      </p>

      <div className="space-y-2">
        {order.map((blockId, index) => {
          const block = blockMap.get(blockId)
          if (!block) return null
          const correctAtPosition =
            submitted && blockId === exercise.correctOrder[index]
          const wrongAtPosition =
            submitted && blockId !== exercise.correctOrder[index]

          return (
            <div
              key={blockId}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-md border-2 font-mono text-sm",
                "transition-all duration-300",
                !submitted && "border-border bg-background",
                correctAtPosition && "bg-truth/10 border-truth",
                wrongAtPosition && "bg-falsehood/10 border-falsehood"
              )}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveBlock(index, "up")}
                  disabled={submitted || index === 0}
                  aria-label="上に移動"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, "down")}
                  disabled={submitted || index === order.length - 1}
                  aria-label="下に移動"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  ▼
                </button>
              </div>
              <span className="text-xs text-muted-foreground font-mono w-6 text-right shrink-0">
                {index + 1}.
              </span>
              <span className="flex-1">{block.content}</span>
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                {block.rule}
              </span>
            </div>
          )
        })}
      </div>

      <ArrowFlow count={order.length} />

      {!submitted && (
        <Button onClick={handleSubmit}>提出</Button>
      )}

      {submitted && (
        <FeedbackBox correct={isCorrect} explanation={exercise.explanation} />
      )}
    </div>
  )
}

// --- Level 3: Structure (Step + Rule assignment) ---

export function StructureView({
  exercise,
  onComplete,
}: {
  readonly exercise: StructureExercise
  readonly onComplete: (correct: boolean) => void
}) {
  const [assignments, setAssignments] = useState<Readonly<Record<string, string>>>(
    () => Object.fromEntries(exercise.steps.map((s) => [s.id, ""]))
  )
  const [submitted, setSubmitted] = useState(false)

  const handleChange = useCallback(
    (stepId: string, rule: string) => {
      if (submitted) return
      setAssignments((prev) => ({ ...prev, [stepId]: rule }))
    },
    [submitted]
  )

  const isCorrect = useMemo(
    () =>
      exercise.steps.every(
        (s) => assignments[s.id] === exercise.correctAssignments[s.id]
      ),
    [assignments, exercise.steps, exercise.correctAssignments]
  )

  const allFilled = useMemo(
    () => exercise.steps.every((s) => assignments[s.id] !== ""),
    [assignments, exercise.steps]
  )

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete(isCorrect)
  }, [isCorrect, onComplete])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        各ステップに適用されている推論規則を選択してください。
      </p>

      <div className="space-y-2">
        {exercise.steps.map((step, index) => {
          const assigned = assignments[step.id]
          const correct = exercise.correctAssignments[step.id]
          const stepCorrect = submitted && assigned === correct
          const stepWrong = submitted && assigned !== correct

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md border-2",
                "transition-all duration-300",
                !submitted && "border-border bg-background",
                stepCorrect && "bg-truth/10 border-truth",
                stepWrong && "bg-falsehood/10 border-falsehood"
              )}
            >
              <span className="text-xs text-muted-foreground font-mono w-6 text-right shrink-0">
                {index + 1}.
              </span>
              <span className="flex-1 font-mono text-sm">{step.content}</span>
              <select
                value={assigned}
                onChange={(e) => handleChange(step.id, e.target.value)}
                disabled={submitted}
                className={cn(
                  "text-sm font-mono px-2 py-1 rounded border",
                  "bg-background text-foreground",
                  submitted ? "cursor-default" : "cursor-pointer"
                )}
              >
                <option value="">規則を選択...</option>
                {exercise.ruleOptions.map((rule) => (
                  <option key={rule} value={rule}>
                    {rule}
                  </option>
                ))}
              </select>
              {submitted && stepWrong && (
                <span className="text-xs text-falsehood shrink-0">
                  正解: {correct}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} disabled={!allFilled}>
          提出
        </Button>
      )}

      {submitted && (
        <FeedbackBox correct={isCorrect} explanation={exercise.explanation} />
      )}
    </div>
  )
}
