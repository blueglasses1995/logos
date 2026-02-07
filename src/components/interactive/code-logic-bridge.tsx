"use client"

import { useState, useCallback } from "react"

interface Exercise {
  readonly id: string
  readonly title: string
  readonly logicFormula: string
  readonly codeTemplate: string
  readonly prompt: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

interface CodeLogicBridgeProps {
  readonly caption?: string
}

const EXERCISES: readonly Exercise[] = [
  {
    id: "conjunction",
    title: "論理積（AND）",
    logicFormula: "P ∧ Q",
    codeTemplate: "if (p && q) { ... }",
    prompt: "P ∧ Q に対応する TypeScript コードはどれですか？",
    options: ["if (p && q) { ... }", "if (p || q) { ... }", "if (!p) { ... }", "if (p ? q : false) { ... }"],
    correctIndex: 0,
    explanation: "P ∧ Q（論理積）は && 演算子に対応します。P と Q の両方が true のときだけ true を返します。",
  },
  {
    id: "disjunction",
    title: "論理和（OR）",
    logicFormula: "P ∨ Q",
    codeTemplate: "if (p || q) { ... }",
    prompt: "P ∨ Q に対応する TypeScript コードはどれですか？",
    options: ["if (p && q) { ... }", "if (p || q) { ... }", "if (!p && !q) { ... }", "if (p !== q) { ... }"],
    correctIndex: 1,
    explanation: "P ∨ Q（論理和）は || 演算子に対応します。P と Q のどちらかが true であれば true を返します。",
  },
  {
    id: "negation",
    title: "否定（NOT）",
    logicFormula: "¬P",
    codeTemplate: "!p",
    prompt: "¬P に対応する TypeScript コードはどれですか？",
    options: ["p === false", "!p", "p = false", "~p"],
    correctIndex: 1,
    explanation: "¬P（否定）は ! 演算子に対応します。真偽値を反転させ、true → false、false → true に変換します。",
  },
  {
    id: "implication",
    title: "含意（IF-THEN）",
    logicFormula: "P → Q",
    codeTemplate: "if (p) { return q }",
    prompt: "P → Q に対応する TypeScript コードはどれですか？",
    options: ["if (p) { return q }", "if (p && q) { return true }", "p === q", "if (q) { return p }"],
    correctIndex: 0,
    explanation: "P → Q（含意）は「P ならば Q」を意味します。コードでは if (p) { return q } と表現でき、!p || q とも等価です。",
  },
  {
    id: "universal",
    title: "全称量化子（FOR ALL）",
    logicFormula: "∀x P(x)",
    codeTemplate: "array.every(x => P(x))",
    prompt: "∀x P(x) に対応する TypeScript コードはどれですか？",
    options: ["array.some(x => P(x))", "array.filter(x => P(x))", "array.every(x => P(x))", "array.map(x => P(x))"],
    correctIndex: 2,
    explanation: "∀x P(x) は「すべての x について P(x) が真」を意味します。Array.every() がこれに対応し、全要素が条件を満たすか検査します。",
  },
  {
    id: "existential",
    title: "存在量化子（EXISTS）",
    logicFormula: "∃x P(x)",
    codeTemplate: "array.some(x => P(x))",
    prompt: "∃x P(x) に対応する TypeScript コードはどれですか？",
    options: ["array.every(x => P(x))", "array.some(x => P(x))", "array.includes(x)", "array.find(x => P(x)) !== undefined"],
    correctIndex: 1,
    explanation: "∃x P(x) は「ある x が存在して P(x) が真」を意味します。Array.some() がこれに直接対応し、条件を満たす要素が一つでもあれば true を返します。",
  },
] as const

const LIVE_DEMOS: readonly {
  readonly id: string
  readonly logicFormula: string
  readonly codeSnippet: string
  readonly evaluate: (vals: Readonly<Record<string, boolean>>) => boolean
}[] = [
  { id: "and", logicFormula: "P ∧ Q", codeSnippet: "p && q", evaluate: (v) => v["P"] && v["Q"] },
  { id: "or", logicFormula: "P ∨ Q", codeSnippet: "p || q", evaluate: (v) => v["P"] || v["Q"] },
  { id: "not", logicFormula: "¬P", codeSnippet: "!p", evaluate: (v) => !v["P"] },
  { id: "implies", logicFormula: "P → Q", codeSnippet: "!p || q", evaluate: (v) => !v["P"] || v["Q"] },
] as const

export function CodeLogicBridge({ caption }: CodeLogicBridgeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<ReadonlySet<number>>(new Set())
  const [showDemo, setShowDemo] = useState(false)
  const [demoValues, setDemoValues] = useState<Readonly<Record<string, boolean>>>(
    () => Object.fromEntries(["P", "Q"].map((v) => [v, true]))
  )

  const exercise = EXERCISES[currentStep]
  const isCompleted = completedSteps.has(currentStep)
  const allCompleted = completedSteps.size === EXERCISES.length

  const handleSelect = useCallback(
    (index: number) => {
      if (isCompleted) return
      setSelectedIndex(index)
      if (index === exercise.correctIndex) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]))
      }
    },
    [isCompleted, exercise.correctIndex, currentStep]
  )

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < EXERCISES.length) {
      setCurrentStep(step)
      setSelectedIndex(null)
    }
  }, [])

  const toggleDemoVar = useCallback((variable: string) => {
    setDemoValues((prev) => ({ ...prev, [variable]: !prev[variable] }))
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            論理とコードの対応
          </span>
          <span className="text-xs text-muted-foreground">
            {completedSteps.size} / {EXERCISES.length} 完了
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-5">
          {EXERCISES.map((_, i) => (
            <button
              key={EXERCISES[i].id}
              type="button"
              onClick={() => goToStep(i)}
              aria-label={`問題 ${i + 1}`}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer
                ${
                  i === currentStep
                    ? "bg-primary scale-125"
                    : completedSteps.has(i)
                      ? "bg-emerald-500"
                      : "bg-border"
                }
              `}
            />
          ))}
        </div>

        {/* Current exercise */}
        <div className="mb-4">
          <div className="text-sm font-medium text-foreground mb-1">{exercise.title}</div>

          {/* Side-by-side: logic formula vs TypeScript code */}
          <div className="grid grid-cols-2 divide-x divide-border border border-border rounded-md overflow-hidden mb-4">
            <div className="px-4 py-3 bg-background/50">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                論理式
              </div>
              <code className="text-lg font-mono text-foreground">{exercise.logicFormula}</code>
            </div>
            <div className="px-4 py-3 bg-background/50">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                TypeScript
              </div>
              <code className="text-lg font-mono text-primary">
                {isCompleted ? exercise.codeTemplate : "???"}
              </code>
            </div>
          </div>

          {/* Question */}
          <div className="text-sm text-foreground mb-3">{exercise.prompt}</div>

          {/* Options */}
          <div className="space-y-2">
            {exercise.options.map((option, i) => {
              const isSelected = selectedIndex === i
              const showCorrect = isCompleted && i === exercise.correctIndex
              const showWrong = isSelected && selectedIndex !== exercise.correctIndex

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={isCompleted}
                  className={`
                    w-full text-left px-4 py-2 rounded-md text-sm font-mono
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
                    ${isCompleted ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {/* Wrong answer feedback */}
          {selectedIndex !== null && selectedIndex !== exercise.correctIndex && !isCompleted && (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400">
              不正解 -- もう一度考えてみましょう
            </div>
          )}

          {/* Correct answer explanation */}
          {isCompleted && (
            <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-4 py-3">
              {exercise.explanation}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
          >
            ← 前へ
          </button>
          <button
            type="button"
            onClick={() => setShowDemo((prev) => !prev)}
            className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            {showDemo ? "デモを閉じる" : "ライブデモ"}
          </button>
          <button
            type="button"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === EXERCISES.length - 1}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
          >
            次へ →
          </button>
        </div>

        {/* Live demo section */}
        {showDemo && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              ライブデモ -- 変数を切り替えて結果を確認
            </div>
            <div className="flex items-center gap-3 mb-3">
              {["P", "Q"].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v}: ${demoValues[v] ? "True" : "False"} -- クリックで切替`}
                  onClick={() => toggleDemoVar(v)}
                  className={`
                    px-3 py-1.5 rounded-md font-mono text-sm font-semibold
                    transition-all duration-300 border-2 cursor-pointer select-none
                    ${
                      demoValues[v]
                        ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                        : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                    }
                  `}
                >
                  {v} = {demoValues[v] ? "T" : "F"}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {LIVE_DEMOS.map((demo) => {
                const result = demo.evaluate(demoValues)
                return (
                  <div
                    key={demo.id}
                    className="grid grid-cols-3 items-center px-3 py-2 rounded-md bg-background/50 border border-border/50"
                  >
                    <code className="text-sm font-mono text-foreground">{demo.logicFormula}</code>
                    <code className="text-sm font-mono text-primary text-center">{demo.codeSnippet}</code>
                    <span
                      className={`
                        font-mono font-bold text-sm text-right transition-all duration-300
                        ${result ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                      `}
                    >
                      {result ? "true" : "false"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All complete message */}
        {allCompleted && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              全問正解です！論理演算子と TypeScript の対応関係を理解できました。
            </div>
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
