"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz"
import { TruthTableQuiz } from "./TruthTableQuiz"
import { ProofBuilderQuiz } from "./ProofBuilderQuiz"
import { FallacySpotterQuiz } from "./FallacySpotterQuiz"
import { CounterexampleQuiz } from "./CounterexampleQuiz"
import { GapFillProofQuiz } from "./GapFillProofQuiz"
import { QuizProgressDots } from "./quiz-progress-dots"
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

  const quizContainerRef = useRef<HTMLDivElement>(null)

  const handleNext = () => {
    if (isLast) {
      onComplete(resultsRef.current)
      return
    }
    setCurrentIndex((prev) => prev + 1)
    setAnswered(false)
    setTimeout(() => {
      quizContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 0)
  }

  return (
    <div ref={quizContainerRef} className="space-y-6">
      <QuizProgressDots
        total={quizzes.length}
        current={currentIndex}
        answered={resultsRef.current.length}
      />

      {currentQuiz.type === "multiple-choice" && (
        <MultipleChoiceQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "truth-table" && (
        <TruthTableQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "proof-builder" && (
        <ProofBuilderQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "fallacy-spotter" && (
        <FallacySpotterQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "counterexample" && (
        <CounterexampleQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "gap-fill-proof" && (
        <GapFillProofQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
      )}

      {answered && (
        <Button onClick={handleNext}>
          {isLast ? "完了" : "次へ"}
        </Button>
      )}
    </div>
  )
}
