"use client"

import { useState, useCallback } from "react"

interface ProofStep {
  readonly id: number
  readonly label: string
  readonly formula: string
  readonly justification: string
  readonly isError: boolean
}

interface Exercise {
  readonly id: string
  readonly title: string
  readonly errorType: string
  readonly goal: string
  readonly steps: readonly ProofStep[]
  readonly errorExplanation: string
}

interface ProofErrorDetectorProps {
  readonly caption?: string
}

const EXERCISES: readonly Exercise[] = [
  {
    id: "wrong-direction",
    title: "肯定式の誤用",
    errorType: "推論規則の誤用",
    goal: "P → Q, Q から P を導く（誤り）",
    steps: [
      { id: 1, label: "前提1", formula: "P → Q", justification: "仮定", isError: false },
      { id: 2, label: "前提2", formula: "Q", justification: "仮定", isError: false },
      {
        id: 3,
        label: "結論",
        formula: "P",
        justification: "1, 2 より肯定式（Modus Ponens）",
        isError: true,
      },
    ],
    errorExplanation:
      "肯定式（Modus Ponens）は「P → Q, P ∴ Q」の形式です。ここでは前件 P ではなく後件 Q が与えられているため、後件肯定の誤謬（Affirming the Consequent）になっています。Q が真でも P が真とは限りません。",
  },
  {
    id: "scope-violation",
    title: "仮定スコープの違反",
    errorType: "仮定スコープの違反",
    goal: "P → (Q → R) を証明する際のスコープ誤り",
    steps: [
      { id: 1, label: "仮定1", formula: "P", justification: "仮定（→導入のため）", isError: false },
      { id: 2, label: "仮定2", formula: "Q", justification: "仮定（→導入のため）", isError: false },
      { id: 3, label: "ステップ3", formula: "P ∧ Q", justification: "1, 2 より ∧導入", isError: false },
      { id: 4, label: "ステップ4", formula: "R", justification: "3 より（何らかの推論）", isError: false },
      { id: 5, label: "ステップ5", formula: "Q → R", justification: "2-4 より →導入（仮定2を解除）", isError: false },
      {
        id: 6,
        label: "ステップ6",
        formula: "Q ∧ R",
        justification: "2, 4 より ∧導入",
        isError: true,
      },
    ],
    errorExplanation:
      "仮定2（Q）はステップ5で →導入により解除されました。ステップ6で Q を再び使用していますが、Q はもうスコープ外です。解除された仮定を使用することはできません。",
  },
  {
    id: "eigenvariable",
    title: "固有変数条件の違反",
    errorType: "固有変数条件の不遵守",
    goal: "∀x.P(x) → ∀x.Q(x) を証明する際の誤り",
    steps: [
      { id: 1, label: "前提", formula: "∀x.(P(x) → Q(x))", justification: "仮定", isError: false },
      { id: 2, label: "ステップ2", formula: "P(a) → Q(a)", justification: "1 より ∀除去（a は任意）", isError: false },
      { id: 3, label: "仮定", formula: "∀x.P(x)", justification: "仮定（→導入のため）", isError: false },
      { id: 4, label: "ステップ4", formula: "P(a)", justification: "3 より ∀除去", isError: false },
      { id: 5, label: "ステップ5", formula: "Q(a)", justification: "2, 4 より →除去", isError: false },
      {
        id: 6,
        label: "ステップ6",
        formula: "∀x.Q(x)",
        justification: "5 より ∀導入（a を x に一般化）",
        isError: true,
      },
    ],
    errorExplanation:
      "∀導入で a を一般化していますが、a はステップ2で ∀除去により導入された変数であり、前提1に依存しています。∀導入の固有変数条件により、一般化する変数は未解除の仮定に自由に出現してはなりません。ここでは a が前提に出現するため、この一般化は不正です。",
  },
  {
    id: "missing-step",
    title: "推論の飛躍",
    errorType: "根拠の欠如",
    goal: "A → C を A → B と B → C から導く",
    steps: [
      { id: 1, label: "前提1", formula: "A → B", justification: "仮定", isError: false },
      { id: 2, label: "前提2", formula: "B → C", justification: "仮定", isError: false },
      { id: 3, label: "仮定", formula: "A", justification: "仮定（→導入のため）", isError: false },
      {
        id: 4,
        label: "ステップ4",
        formula: "C",
        justification: "1, 3 より →除去",
        isError: true,
      },
      { id: 5, label: "結論", formula: "A → C", justification: "3-4 より →導入", isError: false },
    ],
    errorExplanation:
      "ステップ4で「A → B」と「A」から直接 C を導いていますが、→除去で得られるのは B であって C ではありません。正しくは、まず B を導出し（A → B, A より）、次に B → C と B から C を導出する必要があります。中間ステップ（B の導出）が欠落しています。",
  },
  {
    id: "circular",
    title: "循環論証",
    errorType: "循環論証",
    goal: "P ∨ Q から P を証明する（不正な試み）",
    steps: [
      { id: 1, label: "前提", formula: "P ∨ Q", justification: "仮定", isError: false },
      { id: 2, label: "場合1", formula: "P", justification: "仮定（∨除去・左）", isError: false },
      { id: 3, label: "結果1", formula: "P", justification: "2 より（自明）", isError: false },
      {
        id: 4,
        label: "場合2",
        formula: "Q",
        justification: "仮定（∨除去・右）",
        isError: false,
      },
      {
        id: 5,
        label: "結果2",
        formula: "P",
        justification: "P は前提から自明に成立",
        isError: true,
      },
      { id: 6, label: "結論", formula: "P", justification: "1, 2-3, 4-5 より ∨除去", isError: false },
    ],
    errorExplanation:
      "∨除去では、各場合について同じ結論を独立に導く必要があります。場合2（Q を仮定）から P を導くには、Q から P への根拠が必要ですが、「前提から自明」としか書かれておらず、実質的に証明すべき P を根拠なく使っています。これは循環論証です。",
  },
]

export function ProofErrorDetector({ caption }: ProofErrorDetectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [startTime, setStartTime] = useState<number>(() => Date.now())
  const [elapsedMs, setElapsedMs] = useState<number | null>(null)
  const [scores, setScores] = useState<readonly boolean[]>([])

  const exercise = EXERCISES[currentIndex]
  const isComplete = scores.length === EXERCISES.length

  const handleSelectStep = useCallback(
    (stepId: number) => {
      if (revealed) return
      setSelectedStepId(stepId)
    },
    [revealed],
  )

  const handleSubmit = useCallback(() => {
    if (selectedStepId === null || revealed) return
    const elapsed = Date.now() - startTime
    setElapsedMs(elapsed)
    setRevealed(true)
    const step = exercise.steps.find((s) => s.id === selectedStepId)
    setScores((prev) => [...prev, step?.isError === true])
  }, [selectedStepId, revealed, startTime, exercise.steps])

  const handleNext = useCallback(() => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedStepId(null)
      setRevealed(false)
      setStartTime(Date.now())
      setElapsedMs(null)
    }
  }, [currentIndex])

  const handleReset = useCallback(() => {
    setCurrentIndex(0)
    setSelectedStepId(null)
    setRevealed(false)
    setStartTime(Date.now())
    setElapsedMs(null)
    setScores([])
  }, [])

  const correctCount = scores.filter(Boolean).length

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}秒`
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${minutes}分${remaining}秒`
  }

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            証明の誤り発見クイズ
          </div>
          <div className="text-xs text-muted-foreground">
            {currentIndex + 1} / {EXERCISES.length}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {EXERCISES.map((ex, i) => (
            <div
              key={ex.id}
              className={`
                h-1.5 flex-1 rounded-full transition-all duration-300
                ${
                  i < scores.length
                    ? scores[i]
                      ? "bg-truth"
                      : "bg-falsehood"
                    : i === currentIndex
                      ? "bg-primary/50"
                      : "bg-border"
                }
              `}
            />
          ))}
        </div>

        {isComplete ? (
          <div className="text-center space-y-4 py-4">
            <div className="text-2xl font-bold text-foreground">
              {correctCount} / {EXERCISES.length} 正解
            </div>
            <p className="text-sm text-muted-foreground">
              {correctCount === EXERCISES.length
                ? "全問正解！証明の誤りを完璧に見抜く力があります。"
                : correctCount >= 3
                  ? "よくできました。見逃した誤りのパターンを復習しましょう。"
                  : "証明の各ステップを注意深く確認する練習を続けましょう。"}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
            >
              もう一度挑戦する
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Exercise header */}
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-falsehood/10 text-falsehood">
                {exercise.errorType}
              </span>
              <h3 className="text-base font-bold text-foreground">
                {exercise.title}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground">
              以下の証明には誤りが1つあります。誤りのあるステップをクリックしてください。
            </p>

            {/* Goal */}
            <div className="px-3 py-2 rounded-md text-sm bg-secondary border border-border">
              <span className="text-xs text-muted-foreground mr-2">目標:</span>
              <span className="font-mono text-foreground">{exercise.goal}</span>
            </div>

            {/* Proof steps */}
            <div className="space-y-1.5">
              {exercise.steps.map((step) => {
                const isSelected = selectedStepId === step.id
                const showCorrectStep = revealed && !step.isError
                const showErrorStep = revealed && step.isError
                const isCorrectGuess = revealed && isSelected && step.isError
                const isWrongGuess = revealed && isSelected && !step.isError

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleSelectStep(step.id)}
                    disabled={revealed}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-md text-sm
                      transition-all duration-300 border
                      ${
                        showErrorStep
                          ? "bg-falsehood/10 border-falsehood text-foreground"
                          : showCorrectStep
                            ? "bg-truth/10 border-truth/40 text-foreground"
                            : isCorrectGuess
                              ? "bg-falsehood/10 border-falsehood text-foreground"
                              : isWrongGuess
                                ? "bg-falsehood/10 border-falsehood text-foreground"
                                : isSelected
                                  ? "bg-primary/10 border-primary text-foreground"
                                  : "bg-background border-border hover:border-primary/50 text-foreground"
                      }
                      ${revealed ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="shrink-0 text-xs text-muted-foreground font-mono mt-0.5">
                          {step.id}.
                        </span>
                        <div className="min-w-0">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {step.label}
                          </span>
                          <div className="font-mono font-medium">{step.formula}</div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground mt-0.5 text-right max-w-[45%]">
                        {step.justification}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Submit */}
            {!revealed && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedStepId === null}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${
                    selectedStepId !== null
                      ? "bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                このステップが誤りだと回答する
              </button>
            )}

            {/* Feedback */}
            {revealed && (
              <div className="space-y-3">
                {/* Time taken */}
                {elapsedMs !== null && (
                  <div className="text-xs text-muted-foreground">
                    回答時間: {formatTime(elapsedMs)}
                  </div>
                )}

                {/* Result */}
                <div
                  className={`
                    rounded-md px-4 py-3 text-sm transition-all duration-300
                    ${
                      scores[scores.length - 1]
                        ? "bg-truth/10 text-truth"
                        : "bg-falsehood/10 text-falsehood"
                    }
                  `}
                >
                  <p className="font-medium mb-1">
                    {scores[scores.length - 1] ? "正解！" : "不正解"}
                  </p>
                  <p className="text-sm opacity-90">{exercise.errorExplanation}</p>
                </div>

                {/* Next */}
                {currentIndex < EXERCISES.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
                  >
                    次の問題へ
                  </button>
                )}
              </div>
            )}
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
