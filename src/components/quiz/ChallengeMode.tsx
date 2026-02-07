"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { QuizProgressDots } from "./quiz-progress-dots"
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz"
import { TruthTableQuiz } from "./TruthTableQuiz"
import { ProofBuilderQuiz } from "./ProofBuilderQuiz"
import { FallacySpotterQuiz } from "./FallacySpotterQuiz"
import { CounterexampleQuiz } from "./CounterexampleQuiz"
import { GapFillProofQuiz } from "./GapFillProofQuiz"
import type { Quiz } from "@/types/content"
import { cn } from "@/lib/utils"
import {
  TimerBar,
  StreakDisplay,
  LockedOverlay,
  ConfigScreen,
  CountdownOverlay,
  getMultiplier,
  type TimeLimit,
} from "./challenge-ui"
import { ChallengeResultsScreen, type ChallengeScore, type ChallengeResult } from "./challenge-results"

// --- Types ---

type ChallengePhase = "config" | "countdown" | "playing" | "results"

interface Props {
  readonly quizzes: readonly Quiz[]
  readonly timeLimit?: TimeLimit
  readonly onComplete?: (score: ChallengeScore) => void
  readonly locked?: boolean
}

// --- Main Component ---

export function ChallengeMode({
  quizzes,
  timeLimit: initialTimeLimit = 60,
  onComplete,
  locked = false,
}: Props) {
  const [phase, setPhase] = useState<ChallengePhase>("config")
  const [selectedTime, setSelectedTime] = useState<TimeLimit>(initialTimeLimit)
  const [countdown, setCountdown] = useState(3)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [remainingMs, setRemainingMs] = useState(0)
  const [answered, setAnswered] = useState(false)
  const resultsRef = useRef<ChallengeResult[]>([])
  const questionStartRef = useRef<number>(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalMs = selectedTime * 1000

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Countdown phase
  useEffect(() => {
    if (phase !== "countdown") return

    if (countdown <= 0) {
      setPhase("playing")
      setRemainingMs(totalMs)
      questionStartRef.current = Date.now()
      return
    }

    const id = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, countdown, totalMs])

  // Playing timer
  useEffect(() => {
    if (phase !== "playing" || answered) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 100
        if (next <= 0) {
          handleTimeUp()
          return 0
        }
        return next
      })
    }, 100)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, answered, currentIndex])

  const handleTimeUp = useCallback(() => {
    const currentQuiz = quizzes[currentIndex]
    if (!currentQuiz) return

    const timeSpent = Date.now() - questionStartRef.current
    resultsRef.current = [
      ...resultsRef.current,
      { quizId: currentQuiz.id, correct: false, timeSpent },
    ]
    setCurrentStreak(0)
    setAnswered(true)
  }, [currentIndex, quizzes])

  const handleStart = () => {
    setPhase("countdown")
    setCountdown(3)
    setCurrentIndex(0)
    setCurrentStreak(0)
    setLongestStreak(0)
    setTotalScore(0)
    resultsRef.current = []
  }

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (answered) return

      const currentQuiz = quizzes[currentIndex]
      if (!currentQuiz) return

      const timeSpent = Date.now() - questionStartRef.current

      resultsRef.current = [
        ...resultsRef.current,
        { quizId: currentQuiz.id, correct, timeSpent },
      ]

      if (correct) {
        const newStreak = currentStreak + 1
        const multiplier = getMultiplier(newStreak)
        const basePoints = 100
        const points = Math.round(basePoints * multiplier)
        setTotalScore((prev) => prev + points)
        setCurrentStreak(newStreak)
        setLongestStreak((prev) => Math.max(prev, newStreak))
      } else {
        setCurrentStreak(0)
      }

      setAnswered(true)
    },
    [answered, currentIndex, currentStreak, quizzes]
  )

  const buildScore = (): ChallengeScore => ({
    totalScore,
    correctCount: resultsRef.current.filter((r) => r.correct).length,
    totalCount: quizzes.length,
    longestStreak,
    totalTimeMs: resultsRef.current.reduce((sum, r) => sum + r.timeSpent, 0),
    results: resultsRef.current,
  })

  const handleNext = () => {
    const isLast = currentIndex === quizzes.length - 1

    if (isLast) {
      setPhase("results")
      onComplete?.(buildScore())
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setAnswered(false)
    setRemainingMs(totalMs)
    questionStartRef.current = Date.now()
  }

  if (locked) {
    return <LockedOverlay />
  }

  if (phase === "config") {
    return (
      <ConfigScreen
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
        onStart={handleStart}
        quizCount={quizzes.length}
      />
    )
  }

  if (phase === "countdown") {
    return <CountdownOverlay count={countdown} />
  }

  if (phase === "results") {
    return (
      <ChallengeResultsScreen
        score={buildScore()}
        quizzes={quizzes}
        onRetry={handleStart}
      />
    )
  }

  // Playing phase
  const currentQuiz = quizzes[currentIndex]
  if (!currentQuiz) return null

  const lastResult = resultsRef.current[resultsRef.current.length - 1]

  return (
    <div className="space-y-4">
      <TimerBar remainingMs={remainingMs} totalMs={totalMs} />

      <StreakDisplay
        streak={currentStreak}
        multiplier={getMultiplier(currentStreak)}
        score={totalScore}
      />

      <QuizProgressDots
        total={quizzes.length}
        current={currentIndex}
        answered={resultsRef.current.length}
      />

      <ChallengeQuizRenderer
        quiz={currentQuiz}
        onAnswer={handleAnswer}
        answered={answered}
      />

      {answered && (
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium",
              lastResult?.correct ? "text-truth" : "text-falsehood"
            )}
          >
            {lastResult?.correct
              ? "正解！"
              : remainingMs <= 0
                ? "時間切れ"
                : "不正解"}
          </span>
          <Button onClick={handleNext} size="sm">
            {currentIndex === quizzes.length - 1 ? "結果を見る" : "次へ"}
          </Button>
        </div>
      )}
    </div>
  )
}

// --- Quiz Renderer (no explanations shown) ---

function ChallengeQuizRenderer({
  quiz,
  onAnswer,
  answered,
}: {
  readonly quiz: Quiz
  readonly onAnswer: (correct: boolean) => void
  readonly answered: boolean
}) {
  return (
    <div
      className={cn(
        "challenge-quiz-wrapper",
        !answered && "[&_.text-muted-foreground:has(+*)]:hidden"
      )}
    >
      {quiz.type === "multiple-choice" && (
        <MultipleChoiceQuiz key={quiz.id} quiz={quiz} onAnswer={onAnswer} />
      )}
      {quiz.type === "truth-table" && (
        <TruthTableQuiz key={quiz.id} quiz={quiz} onAnswer={onAnswer} />
      )}
      {quiz.type === "proof-builder" && (
        <ProofBuilderQuiz key={quiz.id} quiz={quiz} onAnswer={onAnswer} />
      )}
      {quiz.type === "fallacy-spotter" && (
        <FallacySpotterQuiz key={quiz.id} quiz={quiz} onAnswer={onAnswer} />
      )}
      {quiz.type === "counterexample" && (
        <CounterexampleQuiz key={quiz.id} quiz={quiz} onAnswer={onAnswer} />
      )}
      {quiz.type === "gap-fill-proof" && (
        <GapFillProofQuiz key={quiz.id} quiz={quiz} onAnswer={onAnswer} />
      )}
    </div>
  )
}
