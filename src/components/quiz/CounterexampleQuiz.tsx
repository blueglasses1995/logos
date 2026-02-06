"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CounterexampleQuiz as CounterexampleQuizType } from "@/types/content"

interface Props {
  readonly quiz: CounterexampleQuizType
  readonly onAnswer: (correct: boolean) => void
}

export function CounterexampleQuiz({ quiz, onAnswer }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const selectedOption = quiz.counterexamples.find((ce) => ce.id === selectedId)
  const isCorrect = selectedOption?.isValid ?? false

  const handleSelect = (id: string) => {
    if (submitted) return
    const option = quiz.counterexamples.find((ce) => ce.id === id)
    if (!option) return
    setSelectedId(id)
    setSubmitted(true)
    onAnswer(option.isValid)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          以下の論証の弱点を突く反例を選んでください
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="border-l-4 border-primary/30 pl-4 py-2 text-foreground/80 italic">
          {quiz.argument}
        </blockquote>

        <div className="space-y-1">
          {quiz.premises.map((premise, i) => (
            <div
              key={premise}
              className={`text-sm px-3 py-1.5 rounded-md ${
                i === quiz.vulnerablePremiseIndex
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {premise}
            </div>
          ))}
          <div className="text-sm px-3 py-1.5 font-medium text-foreground">
            ∴ {quiz.conclusion}
          </div>
        </div>

        <div className="space-y-2">
          {quiz.counterexamples.map((ce) => {
            const isSelected = selectedId === ce.id
            const showCorrect = submitted && isSelected && ce.isValid
            const showWrong = submitted && isSelected && !ce.isValid
            const showAsValid = submitted && !isSelected && ce.isValid

            return (
              <button
                key={ce.id}
                type="button"
                onClick={() => handleSelect(ce.id)}
                disabled={submitted}
                aria-label={ce.text}
                className={`
                  w-full text-left px-4 py-2 rounded-md text-sm
                  transition-all duration-200 border
                  ${
                    showCorrect
                      ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                      : showWrong
                        ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                        : showAsValid
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-400"
                          : submitted
                            ? "bg-muted border-border text-muted-foreground cursor-default"
                            : "bg-background border-border hover:border-primary/50 cursor-pointer"
                  }
                `}
              >
                {ce.text}
              </button>
            )
          })}
        </div>

        {submitted && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${
              isCorrect
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {isCorrect ? "正解！" : "不正解"}
            </div>
            {quiz.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
