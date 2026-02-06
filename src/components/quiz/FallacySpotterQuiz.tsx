"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FallacySpotterQuiz as FallacySpotterQuizType, FallacyType } from "@/types/content"

const FALLACY_LABELS: Readonly<Record<FallacyType, string>> = {
  "ad-hominem": "人身攻撃",
  "straw-man": "藁人形論法",
  "false-dilemma": "偽の二択",
  "slippery-slope": "滑りやすい坂論法",
  "appeal-to-authority": "権威への訴え",
  "appeal-to-emotion": "感情への訴え",
  "appeal-to-popularity": "多数への訴え",
  "begging-the-question": "循環論法",
  "correlation-causation": "相関と因果の混同",
}

interface Props {
  readonly quiz: FallacySpotterQuizType
  readonly onAnswer: (correct: boolean) => void
}

export function FallacySpotterQuiz({ quiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<FallacyType | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const options = useMemo(() => {
    const all = [quiz.fallacyType, ...quiz.distractors]
    // Deterministic shuffle based on quiz id
    return [...all].sort((a, b) => {
      const hashA = quiz.id.length + a.charCodeAt(0)
      const hashB = quiz.id.length + b.charCodeAt(0)
      return hashA - hashB
    })
  }, [quiz])

  const handleSelect = (fallacy: FallacyType) => {
    if (submitted) return
    setSelected(fallacy)
    setSubmitted(true)
    onAnswer(fallacy === quiz.fallacyType)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          以下の文章に含まれる誤謬を特定してください
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="border-l-4 border-primary/30 pl-4 py-2 text-foreground/80 italic">
          {quiz.passage}
        </blockquote>

        <div className="grid grid-cols-2 gap-2">
          {options.map((fallacy) => {
            const isSelected = selected === fallacy
            const isCorrectAnswer = fallacy === quiz.fallacyType
            const showCorrect = submitted && isCorrectAnswer
            const showWrong = submitted && isSelected && !isCorrectAnswer

            return (
              <button
                key={fallacy}
                type="button"
                onClick={() => handleSelect(fallacy)}
                disabled={submitted}
                aria-label={FALLACY_LABELS[fallacy]}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium text-left
                  transition-all duration-200 border
                  ${
                    showCorrect
                      ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                      : showWrong
                        ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                        : submitted
                          ? "bg-muted border-border text-muted-foreground cursor-default"
                          : "bg-background border-border hover:border-primary/50 cursor-pointer"
                  }
                `}
              >
                {FALLACY_LABELS[fallacy]}
              </button>
            )
          })}
        </div>

        {submitted && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${
              selected === quiz.fallacyType
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {selected === quiz.fallacyType ? "正解！" : `不正解 — 正解: ${FALLACY_LABELS[quiz.fallacyType]}`}
            </div>
            {quiz.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
