"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import type { MultipleChoiceQuiz as MCQuiz } from "@/types/content"
import { cn } from "@/lib/utils"

interface Props {
  readonly quiz: MCQuiz
  readonly onAnswer: (correct: boolean) => void
}

export function MultipleChoiceQuiz({ quiz, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(() => {
    if (selectedIndex === null) return
    setSubmitted(true)
    onAnswer(selectedIndex === quiz.correctIndex)
  }, [selectedIndex, quiz.correctIndex, onAnswer])

  useEffect(() => {
    if (submitted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= quiz.options.length) {
        setSelectedIndex(num - 1)
      }
      if (e.key === "Enter" && selectedIndex !== null) {
        handleSubmit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [submitted, selectedIndex, quiz.options.length, handleSubmit])

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-foreground leading-relaxed">
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((option, i) => (
          <button
            key={i}
            onClick={() => !submitted && setSelectedIndex(i)}
            disabled={submitted}
            className={cn(
              "w-full rounded-lg border p-3 text-left text-sm transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
              !submitted && selectedIndex === i && "border-primary bg-primary/5",
              !submitted && selectedIndex !== i && "border-border hover:border-muted-foreground/30",
              submitted && i === quiz.correctIndex && "border-primary bg-primary/10 text-foreground",
              submitted && selectedIndex === i && i !== quiz.correctIndex && "border-destructive/50 bg-destructive/5 text-muted-foreground"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <kbd aria-hidden="true" className="text-xs text-muted-foreground font-mono">{i + 1}</kbd>
              {option}
            </span>
          </button>
        ))}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
        >
          回答する
        </Button>
      )}

      {submitted && (
        <div className={cn(
          "rounded-lg p-4 text-sm",
          selectedIndex === quiz.correctIndex
            ? "bg-primary/10 text-foreground"
            : "bg-destructive/5 text-foreground"
        )}>
          <p className="font-medium mb-1">
            {selectedIndex === quiz.correctIndex ? "正解！" : "不正解"}
          </p>
          <p className="text-muted-foreground">{quiz.explanation}</p>
        </div>
      )}
    </div>
  )
}
