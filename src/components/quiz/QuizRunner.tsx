"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz"
import { TruthTableQuiz } from "./TruthTableQuiz"
import type { Quiz } from "@/types/content"

interface QuizResult {
  readonly quizId: string
  readonly correct: boolean
}

interface Props {
  readonly quizzes: readonly Quiz[]
  readonly onComplete: (results: readonly QuizResult[]) => void
}

export function QuizRunner({ quizzes, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const resultsRef = useRef<QuizResult[]>([])

  const currentQuiz = quizzes[currentIndex]
  const isLast = currentIndex === quizzes.length - 1

  const handleAnswer = useCallback(
    (correct: boolean) => {
      resultsRef.current = [
        ...resultsRef.current,
        { quizId: currentQuiz.id, correct },
      ]
      setAnswered(true)
    },
    [currentQuiz.id]
  )

  const handleNext = () => {
    if (isLast) {
      onComplete(resultsRef.current)
      return
    }
    setCurrentIndex((prev) => prev + 1)
    setAnswered(false)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {currentIndex + 1} / {quizzes.length}
      </div>

      {currentQuiz.type === "multiple-choice" && (
        <MultipleChoiceQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "truth-table" && (
        <TruthTableQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}

      {answered && (
        <Button onClick={handleNext}>
          {isLast ? "完了" : "次へ"}
        </Button>
      )}
    </div>
  )
}
