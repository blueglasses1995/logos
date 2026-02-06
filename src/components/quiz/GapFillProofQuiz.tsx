"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GapFillProofQuiz as GapFillProofQuizType, ProofStep } from "@/types/content"

interface Props {
  readonly quiz: GapFillProofQuizType
  readonly onAnswer: (correct: boolean) => void
}

function StepRow({
  step,
  index,
  value,
  onChange,
  submitted,
  isCorrect,
}: {
  readonly step: ProofStep
  readonly index: number
  readonly value: string
  readonly onChange: (stepId: string, value: string) => void
  readonly submitted: boolean
  readonly isCorrect: boolean
}) {
  const stepNumber = index + 1

  if (step.type === "given") {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-background/50 border border-border/50">
        <span className="text-xs text-muted-foreground font-mono w-6 text-right">
          {stepNumber}.
        </span>
        <code className="text-sm font-mono text-foreground">{step.content}</code>
        <span className="text-xs text-muted-foreground ml-auto">前提</span>
      </div>
    )
  }

  if (step.type === "gap") {
    return (
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md border ${
          submitted
            ? isCorrect
              ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-500"
              : "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-500"
            : "bg-primary/5 border-primary/30"
        }`}
      >
        <span className="text-xs text-muted-foreground font-mono w-6 text-right">
          {stepNumber}.
        </span>
        <select
          value={value}
          onChange={(e) => onChange(step.id, e.target.value)}
          disabled={submitted}
          role="combobox"
          className={`
            text-sm font-mono px-2 py-1 rounded border
            bg-background text-foreground
            ${submitted ? "cursor-default" : "cursor-pointer"}
          `}
        >
          <option value="">選択...</option>
          {step.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {submitted && (
          <span className="text-xs ml-2">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400">正解</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                正解: {step.correctValue}
              </span>
            )}
          </span>
        )}
      </div>
    )
  }

  // derived
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-background/50 border border-border/50">
      <span className="text-xs text-muted-foreground font-mono w-6 text-right">
        {stepNumber}.
      </span>
      <code className="text-sm font-mono text-foreground font-medium">
        {step.content}
      </code>
      {step.rule && (
        <span className="text-xs text-muted-foreground ml-auto italic">
          {step.rule}
        </span>
      )}
    </div>
  )
}

export function GapFillProofQuiz({ quiz, onAnswer }: Props) {
  const [gapValues, setGapValues] = useState<Readonly<Record<string, string>>>(
    () =>
      Object.fromEntries(
        quiz.steps
          .filter((s) => s.type === "gap")
          .map((s) => [s.id, ""])
      )
  )
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (stepId: string, value: string) => {
    if (submitted) return
    setGapValues((prev) => ({ ...prev, [stepId]: value }))
  }

  const gapSteps = quiz.steps.filter((s) => s.type === "gap")
  const allCorrect = gapSteps.every(
    (s) => gapValues[s.id] === s.correctValue
  )

  const handleSubmit = () => {
    setSubmitted(true)
    onAnswer(allCorrect)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          証明の空欄を埋めてください
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {quiz.steps.map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              index={index}
              value={gapValues[step.id] ?? ""}
              onChange={handleChange}
              submitted={submitted}
              isCorrect={
                step.type === "gap"
                  ? gapValues[step.id] === step.correctValue
                  : true
              }
            />
          ))}
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} aria-label="提出">
            提出
          </Button>
        )}

        {submitted && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${
              allCorrect
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {allCorrect ? "正解！" : "不正解"}
            </div>
            {quiz.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
