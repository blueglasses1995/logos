"use client"

import { useState, useCallback } from "react"
import { CROSS_CHAPTER_EXERCISES } from "./cross-chapter-data"

interface CrossChapterExerciseProps {
  readonly exerciseIndex?: number
}

export function CrossChapterExercise({
  exerciseIndex = 0,
}: CrossChapterExerciseProps) {
  const [currentExercise, setCurrentExercise] = useState(
    Math.min(exerciseIndex, CROSS_CHAPTER_EXERCISES.length - 1)
  )
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Readonly<Record<string, number | null>>>(
    {}
  )
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set())
  const [showSummary, setShowSummary] = useState(false)

  const exercise = CROSS_CHAPTER_EXERCISES[currentExercise]
  const step = exercise.steps[currentStep]
  const totalSteps = exercise.steps.length

  const handleSelect = useCallback(
    (stepId: string, optionIndex: number) => {
      if (revealed.has(stepId)) return
      setAnswers((prev) => ({ ...prev, [stepId]: optionIndex }))
    },
    [revealed]
  )

  const handleCheck = useCallback(() => {
    if (!step) return
    const selected = answers[step.id]
    if (selected === null || selected === undefined) return
    setRevealed((prev) => new Set([...prev, step.id]))
  }, [step, answers])

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setShowSummary(true)
    }
  }, [currentStep, totalSteps])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setRevealed(new Set())
    setShowSummary(false)
  }, [])

  const handleChangeExercise = useCallback(
    (index: number) => {
      setCurrentExercise(index)
      setCurrentStep(0)
      setAnswers({})
      setRevealed(new Set())
      setShowSummary(false)
    },
    []
  )

  const isStepAnswered = revealed.has(step?.id ?? "")
  const isStepCorrect = answers[step?.id ?? ""] === step?.correctIndex
  const correctCount = exercise.steps.filter(
    (s) => answers[s.id] === s.correctIndex
  ).length

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 bg-secondary/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            クロスチャプター演習
          </span>
        </div>

        {/* Exercise selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CROSS_CHAPTER_EXERCISES.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleChangeExercise(i)}
              className={`
                text-xs px-3 py-1 rounded-full border transition-all duration-200
                ${
                  i === currentExercise
                    ? "bg-primary/15 border-primary text-primary font-medium"
                    : "bg-background border-border text-muted-foreground hover:border-primary/50 cursor-pointer"
                }
              `}
            >
              {i + 1}. {ex.title}
            </button>
          ))}
        </div>

        {/* Chapter tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {exercise.chapters.map((ch) => (
            <span
              key={ch}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Context */}
        <div className="text-sm text-foreground mb-4 bg-background/50 rounded-md px-4 py-3 border border-border/50">
          {exercise.context}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-4">
          {exercise.steps.map((s, i) => (
            <div
              key={s.id}
              className={`
                h-2 flex-1 rounded-full transition-all duration-300
                ${
                  i < currentStep
                    ? revealed.has(s.id) && answers[s.id] === s.correctIndex
                      ? "bg-emerald-500"
                      : "bg-red-400"
                    : i === currentStep
                      ? "bg-primary"
                      : "bg-border"
                }
              `}
            />
          ))}
        </div>

        {!showSummary ? (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground">
                  ステップ {currentStep + 1}/{totalSteps}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {step.chapterRef}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground mb-3">
                {step.instruction}
              </div>

              <div className="space-y-2">
                {step.options.map((option, i) => {
                  const isSelected = answers[step.id] === i
                  const showCorrect = isStepAnswered && i === step.correctIndex
                  const showWrong = isStepAnswered && isSelected && !isStepCorrect

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(step.id, i)}
                      disabled={isStepAnswered}
                      className={`
                        w-full text-left px-4 py-2.5 rounded-md text-sm font-mono
                        transition-all duration-200 border
                        ${
                          showCorrect
                            ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                            : showWrong
                              ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                              : isSelected
                                ? "bg-primary/10 border-primary"
                                : "bg-background border-border hover:border-primary/50"
                        }
                        ${isStepAnswered ? "cursor-default" : "cursor-pointer"}
                      `}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {isStepAnswered && isStepCorrect && (
                <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-4 py-3">
                  正解！ {step.hint}
                </div>
              )}
              {isStepAnswered && !isStepCorrect && (
                <div className="mt-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">
                  不正解 --- ヒント: {step.hint}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isStepAnswered && (
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={answers[step.id] === null || answers[step.id] === undefined}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  確認する
                </button>
              )}
              {isStepAnswered && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {currentStep < totalSteps - 1 ? "次のステップ" : "結果を見る"}
                </button>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className="text-base font-semibold text-foreground mb-2">
              結果: {correctCount}/{totalSteps} 正解
            </div>
            <div className="h-3 w-full bg-border rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(correctCount / totalSteps) * 100}%` }}
              />
            </div>
            <div className="text-sm text-foreground bg-primary/5 rounded-md px-4 py-3 border border-primary/20 mb-4">
              <span className="font-medium text-primary">まとめ: </span>
              {exercise.summary}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-background text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              もう一度挑戦する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
