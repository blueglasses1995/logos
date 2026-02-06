"use client"

import { useState } from "react"

interface InlineMiniQuizProps {
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

export function InlineMiniQuiz({
  question,
  options,
  correctIndex,
  explanation,
}: InlineMiniQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const isCorrect = selectedIndex === correctIndex

  const handleSelect = (index: number) => {
    if (revealed) return
    setSelectedIndex(index)
    if (index === correctIndex) {
      setRevealed(true)
    }
  }

  return (
    <div className="not-prose my-6 border border-border rounded-md bg-secondary/50 px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          確認
        </span>
      </div>
      <div className="text-sm font-medium text-foreground mb-3">{question}</div>
      <div className="space-y-2">
        {options.map((option, i) => {
          const isSelected = selectedIndex === i
          const showCorrect = revealed && i === correctIndex
          const showWrong = isSelected && !isCorrect && !revealed

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`
                w-full text-left px-4 py-2 rounded-md text-sm
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
                ${revealed ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
      {selectedIndex !== null && !isCorrect && !revealed && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          不正解 — もう一度考えてみましょう
        </div>
      )}
      {revealed && (
        <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-4 py-3">
          {explanation}
        </div>
      )}
    </div>
  )
}
