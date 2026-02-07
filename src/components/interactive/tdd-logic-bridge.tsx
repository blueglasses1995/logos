"use client"

import { useState, useCallback } from "react"
import { EXERCISES, type Exercise } from "./tdd-logic-exercises"

interface TddLogicBridgeProps {
  readonly caption?: string
}

function SelectExercise({
  exercise,
  selectedIndex,
  isCompleted,
  onSelect,
}: {
  readonly exercise: Exercise
  readonly selectedIndex: number | null
  readonly isCompleted: boolean
  readonly onSelect: (index: number) => void
}) {
  return (
    <div className="space-y-4">
      {exercise.scenario && (
        <div className="bg-background/50 border border-border rounded-md px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            命題・仕様
          </div>
          <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
            {exercise.scenario}
          </pre>
        </div>
      )}
      <div className="text-sm text-foreground">{exercise.prompt}</div>
      <div className="space-y-2">
        {exercise.options?.map((option, i) => {
          const isSelected = selectedIndex === i
          const showCorrect = isCompleted && i === exercise.correctIndex
          const showWrong = isSelected && selectedIndex !== exercise.correctIndex
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(i)}
              disabled={isCompleted}
              className={`
                w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 border
                ${showCorrect ? "bg-truth/10 border-truth text-foreground"
                  : showWrong ? "bg-falsehood/10 border-falsehood text-foreground"
                  : isSelected ? "bg-primary/10 border-primary"
                  : "bg-background border-border hover:border-primary/50"}
                ${isCompleted ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
      {selectedIndex !== null && selectedIndex !== exercise.correctIndex && !isCompleted && (
        <div className="text-sm text-falsehood">
          不正解 -- もう一度考えてみましょう
        </div>
      )}
    </div>
  )
}

function MatchExercise({
  exercise,
  matchedPairs,
  selectedTdd,
  isCompleted,
  onSelectTdd,
  onSelectLogic,
}: {
  readonly exercise: Exercise
  readonly matchedPairs: ReadonlySet<string>
  readonly selectedTdd: string | null
  readonly isCompleted: boolean
  readonly onSelectTdd: (id: string) => void
  readonly onSelectLogic: (id: string) => void
}) {
  const pairs = exercise.pairs ?? []
  const logicOrder = [...pairs].sort((a, b) =>
    a.logicConcept.localeCompare(b.logicConcept)
  )

  const cardClass = (matched: boolean, selected: boolean, clickable: boolean) => `
    w-full text-left px-3 py-3 rounded-md text-sm transition-all duration-200 border
    ${matched ? "bg-truth/10 border-truth/40 opacity-70"
      : selected ? "bg-primary/10 border-primary ring-2 ring-primary/30"
      : clickable ? "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
      : "bg-background border-border opacity-50"}
    ${matched || isCompleted ? "cursor-default" : "cursor-pointer"}
  `

  return (
    <div className="space-y-4">
      <div className="text-sm text-foreground">{exercise.prompt}</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            TDD 概念
          </div>
          <div className="space-y-2">
            {pairs.map((pair) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => onSelectTdd(pair.id)}
                disabled={matchedPairs.has(pair.id) || isCompleted}
                className={cardClass(matchedPairs.has(pair.id), selectedTdd === pair.id, true)}
              >
                <div className="font-medium">{pair.tddConcept}</div>
                <div className="text-xs text-muted-foreground mt-1">{pair.tddDescription}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            論理学 概念
          </div>
          <div className="space-y-2">
            {logicOrder.map((pair) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => onSelectLogic(pair.id)}
                disabled={matchedPairs.has(pair.id) || isCompleted || selectedTdd === null}
                className={cardClass(matchedPairs.has(pair.id), false, selectedTdd !== null && !matchedPairs.has(pair.id))}
              >
                <div className="font-medium">{pair.logicConcept}</div>
                <div className="text-xs text-muted-foreground mt-1">{pair.logicDescription}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TddLogicBridge({ caption }: TddLogicBridgeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<ReadonlySet<number>>(new Set())
  const [selectedTdd, setSelectedTdd] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<ReadonlySet<string>>(new Set())
  const [wrongMatch, setWrongMatch] = useState(false)

  const exercise = EXERCISES[currentStep]
  const isCompleted = completedSteps.has(currentStep)
  const allCompleted = completedSteps.size === EXERCISES.length

  const handleSelectOption = useCallback((index: number) => {
    if (isCompleted) return
    setSelectedIndex(index)
    if (index === exercise.correctIndex) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
    }
  }, [isCompleted, exercise.correctIndex, currentStep])

  const handleSelectTdd = useCallback((id: string) => {
    if (isCompleted || matchedPairs.has(id)) return
    setSelectedTdd(id)
    setWrongMatch(false)
  }, [isCompleted, matchedPairs])

  const handleSelectLogic = useCallback((logicId: string) => {
    if (isCompleted || selectedTdd === null || matchedPairs.has(logicId)) return
    if (selectedTdd === logicId) {
      const newMatched = new Set([...matchedPairs, logicId])
      setMatchedPairs(newMatched)
      setSelectedTdd(null)
      setWrongMatch(false)
      const pairs = exercise.pairs ?? []
      if (newMatched.size === pairs.length) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]))
      }
    } else {
      setWrongMatch(true)
      setSelectedTdd(null)
    }
  }, [isCompleted, selectedTdd, matchedPairs, exercise.pairs, currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < EXERCISES.length) {
      setCurrentStep(step)
      setSelectedIndex(null)
      setSelectedTdd(null)
      setMatchedPairs(new Set())
      setWrongMatch(false)
    }
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-xl px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            テスト駆動開発 ↔ 論理学
          </span>
          <span className="text-xs text-muted-foreground">
            {completedSteps.size} / {EXERCISES.length} 完了
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-5">
          {EXERCISES.map((_, i) => (
            <button
              key={EXERCISES[i].id}
              type="button"
              onClick={() => goToStep(i)}
              aria-label={`問題 ${i + 1}`}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer
                ${i === currentStep ? "bg-primary scale-125"
                  : completedSteps.has(i) ? "bg-truth" : "bg-border"}
              `}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border border-border rounded-md overflow-hidden mb-5">
          <div className="px-4 py-3 bg-background/50">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              テスト駆動開発（TDD）
            </div>
            <div className="text-sm text-foreground">テストケース → 失敗 → 実装 → 通過</div>
          </div>
          <div className="px-4 py-3 bg-background/50">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              論理学
            </div>
            <div className="text-sm text-foreground">反例探索 → 反駁 → 修正 → 検証</div>
          </div>
        </div>

        <div className="text-sm font-medium text-foreground mb-3">{exercise.title}</div>

        {exercise.type === "select" ? (
          <SelectExercise
            exercise={exercise}
            selectedIndex={selectedIndex}
            isCompleted={isCompleted}
            onSelect={handleSelectOption}
          />
        ) : (
          <MatchExercise
            exercise={exercise}
            matchedPairs={matchedPairs}
            selectedTdd={selectedTdd}
            isCompleted={isCompleted}
            onSelectTdd={handleSelectTdd}
            onSelectLogic={handleSelectLogic}
          />
        )}

        {wrongMatch && !isCompleted && (
          <div className="mt-3 text-sm text-falsehood">
            マッチが正しくありません。もう一度試してみましょう。
          </div>
        )}

        {isCompleted && (
          <div className="mt-4 text-sm text-truth bg-truth/10 rounded-md px-4 py-3">
            {exercise.explanation}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
          <button
            type="button"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
          >
            ← 前へ
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {currentStep + 1} / {EXERCISES.length}
          </span>
          <button
            type="button"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === EXERCISES.length - 1}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
          >
            次へ →
          </button>
        </div>

        {allCompleted && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <div className="text-sm font-medium text-truth">
              全問完了！TDD と論理学の深い対応関係を理解できました。
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              テストを書くことは、反例を探すこと。コードの正しさを論理的に考える習慣が身につきます。
            </div>
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
