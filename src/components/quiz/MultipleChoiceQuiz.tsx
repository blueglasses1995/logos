"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MultipleChoiceQuiz as MCQuiz } from "@/types/content"
import { cn } from "@/lib/utils"

interface Props {
  readonly quiz: MCQuiz
  readonly onAnswer: (correct: boolean) => void
}

export function MultipleChoiceQuiz({ quiz, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedIndex === null) return
    setSubmitted(true)
    onAnswer(selectedIndex === quiz.correctIndex)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{quiz.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {quiz.options.map((option, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelectedIndex(i)}
              disabled={submitted}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                selectedIndex === i && !submitted && "border-primary bg-primary/5",
                submitted && i === quiz.correctIndex && "border-green-500 bg-green-50",
                submitted && selectedIndex === i && i !== quiz.correctIndex && "border-red-500 bg-red-50"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} disabled={selectedIndex === null}>
            回答する
          </Button>
        )}

        {submitted && (
          <div className={cn(
            "rounded-lg p-4 text-sm",
            selectedIndex === quiz.correctIndex
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          )}>
            <p className="font-medium mb-1">
              {selectedIndex === quiz.correctIndex ? "正解！" : "不正解"}
            </p>
            <p>{quiz.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
