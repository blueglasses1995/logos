"use client"

import { useState, useCallback } from "react"

interface ProofStep {
  readonly id: number
  readonly formula: string
  readonly justification: string
  readonly isRedundant: boolean
  readonly replacementGroupId?: number
}

interface ReplacementRule {
  readonly groupId: number
  readonly label: string
  readonly formula: string
  readonly justification: string
}

interface Exercise {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly steps: readonly ProofStep[]
  readonly replacements: readonly ReplacementRule[]
  readonly optimalLength: number
  readonly hint: string
}

interface ProofRefactoringProps {
  readonly caption?: string
}

const S = (id: number, formula: string, justification: string, isRedundant: boolean, replacementGroupId?: number): ProofStep => ({
  id, formula, justification, isRedundant, ...(replacementGroupId !== undefined ? { replacementGroupId } : {}),
})

const EXERCISES: readonly Exercise[] = [
  {
    id: "double-negation", title: "不要な二重否定除去",
    description: "二重否定の導入と除去が冗長に行われています。不要なステップを取り除いてください。",
    steps: [
      S(1, "P", "仮定", false), S(2, "P → Q", "仮定", false),
      S(3, "¬¬P", "1 より 二重否定導入", true), S(4, "P", "3 より 二重否定除去", true),
      S(5, "Q", "2, 4 より →除去", false),
    ],
    replacements: [], optimalLength: 3,
    hint: "ステップ3-4は P を二重否定してから戻しているだけです。",
  },
  {
    id: "hypothetical-syllogism", title: "仮言三段論法への簡約",
    description: "2段階の→除去を仮言三段論法（Hypothetical Syllogism）1つに置き換えられます。",
    steps: [
      S(1, "P → Q", "仮定", false), S(2, "Q → R", "仮定", false),
      S(3, "P", "仮定（→導入のため）", true, 1), S(4, "Q", "1, 3 より →除去", true, 1),
      S(5, "R", "2, 4 より →除去", true, 1), S(6, "P → R", "3-5 より →導入", true, 1),
    ],
    replacements: [{ groupId: 1, label: "仮言三段論法", formula: "P → R", justification: "1, 2 より 仮言三段論法（HS）" }],
    optimalLength: 3,
    hint: "P → Q と Q → R から直接 P → R を導けます。",
  },
  {
    id: "repeated-assumption", title: "繰り返される仮定の解除",
    description: "同じ仮定の導入と解除が無駄に繰り返されています。",
    steps: [
      S(1, "A ∨ B", "仮定", false), S(2, "A → C", "仮定", false), S(3, "B → C", "仮定", false),
      S(4, "A", "仮定（場合分け・左）", false), S(5, "C", "2, 4 より →除去", false),
      S(6, "A → C", "4-5 より →導入", true), S(7, "A", "仮定（再導入）", true),
      S(8, "C", "6, 7 より →除去", true), S(9, "B", "仮定（場合分け・右）", false),
      S(10, "C", "3, 9 より →除去", false), S(11, "C", "1, 4-8, 9-10 より ∨除去", false),
    ],
    replacements: [], optimalLength: 8,
    hint: "ステップ5で既に C が得られているのに、ステップ6-8で改めて A → C を作り直しています。",
  },
  {
    id: "conjunction-simplify", title: "連言・選言操作の簡略化",
    description: "連言の分解と再構成が冗長です。不要な中間結果を取り除いてください。",
    steps: [
      S(1, "P ∧ Q", "仮定", false), S(2, "P", "1 より ∧除去（左）", false),
      S(3, "Q", "1 より ∧除去（右）", false), S(4, "P ∨ R", "2 より ∨導入", true),
      S(5, "Q ∨ S", "3 より ∨導入", true),
      S(6, "(P ∨ R) ∧ (Q ∨ S)", "4, 5 より ∧導入", true),
      S(7, "Q ∧ P", "3, 2 より ∧導入", false),
    ],
    replacements: [], optimalLength: 4,
    hint: "ステップ4-6の結果は最終結論（Q ∧ P）の導出に使われていません。",
  },
  {
    id: "complex-redundancy", title: "複合的な冗長性",
    description: "複数の冗長パターンが含まれています。すべて見つけて取り除いてください。",
    steps: [
      S(1, "A → B", "仮定", false), S(2, "B → C", "仮定", false), S(3, "A", "仮定", false),
      S(4, "¬¬A", "3 より 二重否定導入", true), S(5, "A", "4 より 二重否定除去", true),
      S(6, "B", "1, 5 より →除去", false), S(7, "B ∨ D", "6 より ∨導入", true),
      S(8, "C", "2, 6 より →除去", false),
      S(9, "¬¬C", "8 より 二重否定導入", true), S(10, "C", "9 より 二重否定除去", true),
    ],
    replacements: [], optimalLength: 5,
    hint: "二重否定の往復が2箇所、使われない ∨導入が1箇所あります。",
  },
]

function stepStyle(revealed: boolean, isRemoved: boolean, isReplacedByGroup: boolean, isRedundant: boolean): string {
  if (isReplacedByGroup) return "opacity-30 bg-muted border-border cursor-default line-through"
  if (revealed && isRemoved && isRedundant) return "bg-truth/10 border-truth text-foreground line-through opacity-60"
  if (revealed && isRemoved && !isRedundant) return "bg-falsehood/10 border-falsehood text-foreground"
  if (revealed && isRedundant && !isRemoved) return "bg-[oklch(0.85_0.15_85)]/15 border-[oklch(0.85_0.15_85)] text-foreground"
  if (isRemoved) return "opacity-40 bg-muted border-border line-through"
  if (revealed && !isRedundant) return "bg-truth/10 border-truth/40 text-foreground"
  return "bg-background border-border hover:border-primary/50 text-foreground"
}

export function ProofRefactoring({ caption }: ProofRefactoringProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [removedIds, setRemovedIds] = useState<ReadonlySet<number>>(new Set())
  const [appliedReplacements, setAppliedReplacements] = useState<ReadonlySet<number>>(new Set())
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<readonly number[]>([])

  const exercise = EXERCISES[currentIndex]
  const isComplete = scores.length === EXERCISES.length

  const activeSteps = exercise.steps.filter((s) => {
    if (removedIds.has(s.id)) return false
    if (s.replacementGroupId !== undefined && appliedReplacements.has(s.replacementGroupId)) return false
    return true
  })
  const appliedRules = exercise.replacements.filter((r) => appliedReplacements.has(r.groupId) && r.formula !== "")
  const currentLength = activeSteps.length + appliedRules.length

  const handleToggleRemove = useCallback((stepId: number) => {
    if (revealed) return
    setRemovedIds((prev) => {
      const next = new Set(prev)
      if (next.has(stepId)) { next.delete(stepId) } else { next.add(stepId) }
      return next
    })
  }, [revealed])

  const handleApplyReplacement = useCallback((groupId: number) => {
    if (revealed) return
    setAppliedReplacements((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) { next.delete(groupId) } else { next.add(groupId) }
      return next
    })
  }, [revealed])

  const handleSubmit = useCallback(() => {
    if (revealed) return
    setRevealed(true)
    const redundantIds = new Set(exercise.steps.filter((s) => s.isRedundant).map((s) => s.id))
    const removedArr = Array.from(removedIds)
    const redundantArr = Array.from(redundantIds)
    const correct = removedArr.filter((id) => redundantIds.has(id)).length
    const incorrect = removedArr.filter((id) => !redundantIds.has(id)).length
    const missed = redundantArr.filter((id) => !removedIds.has(id)).length
    const replIds = new Set(exercise.replacements.map((r) => r.groupId))
    const correctRepl = Array.from(appliedReplacements).filter((g) => replIds.has(g)).length
    const total = redundantIds.size
    const raw = ((correct + correctRepl) / Math.max(total, 1)) * 100 - incorrect * 20 - missed * 10
    setScores((prev) => [...prev, Math.min(100, Math.max(0, Math.round(raw)))])
  }, [revealed, exercise, removedIds, appliedReplacements])

  const handleNext = useCallback(() => {
    if (currentIndex >= EXERCISES.length - 1) return
    setCurrentIndex((prev) => prev + 1)
    setRemovedIds(new Set())
    setAppliedReplacements(new Set())
    setRevealed(false)
  }, [currentIndex])

  const handleReset = useCallback(() => {
    setCurrentIndex(0)
    setRemovedIds(new Set())
    setAppliedReplacements(new Set())
    setRevealed(false)
    setScores([])
  }, [])

  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">証明のリファクタリング演習</div>
          <div className="text-xs text-muted-foreground">{currentIndex + 1} / {EXERCISES.length}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {EXERCISES.map((ex, i) => (
            <div key={ex.id} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < scores.length ? (scores[i] >= 80 ? "bg-truth" : scores[i] >= 40 ? "bg-primary" : "bg-falsehood")
                : i === currentIndex ? "bg-primary/50" : "bg-border"
            }`} />
          ))}
        </div>

        {isComplete ? (
          <div className="text-center space-y-4 py-4">
            <div className="text-2xl font-bold text-foreground">平均スコア: {avg}%</div>
            <p className="text-sm text-muted-foreground">
              {avg >= 80 ? "素晴らしい！証明を効率的に簡約する力があります。"
                : avg >= 50 ? "よくできました。冗長パターンの認識をさらに鍛えましょう。"
                : "証明の各ステップが本当に必要か、常に問いかけましょう。"}
            </p>
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer">
              もう一度挑戦する
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{exercise.title}</h3>
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">元: <span className="font-mono font-bold text-foreground">{exercise.steps.length}</span></span>
              <span className="text-muted-foreground">現在: <span className={`font-mono font-bold ${currentLength <= exercise.optimalLength ? "text-truth" : currentLength < exercise.steps.length ? "text-primary" : "text-foreground"}`}>{currentLength}</span></span>
              <span className="text-muted-foreground">最適: <span className="font-mono font-bold text-truth">{exercise.optimalLength}</span></span>
            </div>
            <div className="space-y-1.5">
              {exercise.steps.map((step) => {
                const isRemoved = removedIds.has(step.id)
                const isReplaced = step.replacementGroupId !== undefined && appliedReplacements.has(step.replacementGroupId)
                return (
                  <button key={step.id} type="button" onClick={() => handleToggleRemove(step.id)} disabled={revealed || isReplaced}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-all duration-300 border ${stepStyle(revealed, isRemoved, isReplaced, step.isRedundant)} ${revealed || isReplaced ? "cursor-default" : "cursor-pointer"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="shrink-0 text-xs text-muted-foreground font-mono mt-0.5">{step.id}.</span>
                        <span className="font-mono font-medium">{step.formula}</span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground mt-0.5 text-right max-w-[45%]">{step.justification}</span>
                    </div>
                    {revealed && step.isRedundant && !isRemoved && (
                      <div className="mt-1 text-[10px] text-[oklch(0.65_0.15_85)] font-medium">冗長なステップ（削除すべき）</div>
                    )}
                  </button>
                )
              })}
              {appliedRules.map((r) => (
                <div key={`repl-${r.groupId}`} className="px-4 py-2 rounded-md text-sm border border-primary bg-primary/10 text-foreground">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="shrink-0 text-xs text-primary font-mono mt-0.5">+</span>
                      <span className="font-mono font-medium">{r.formula}</span>
                    </div>
                    <span className="shrink-0 text-xs text-primary mt-0.5 text-right max-w-[45%]">{r.justification}</span>
                  </div>
                </div>
              ))}
            </div>
            {exercise.replacements.filter((r) => r.formula !== "").length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">置換ルール（クリックで適用/解除）</div>
                {exercise.replacements.filter((r) => r.formula !== "").map((r) => (
                  <button key={r.groupId} type="button" onClick={() => handleApplyReplacement(r.groupId)} disabled={revealed}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-all duration-300 border ${appliedReplacements.has(r.groupId) ? "bg-primary/10 border-primary" : "bg-background border-border hover:border-primary/50"} ${revealed ? "cursor-default" : "cursor-pointer"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary font-semibold">{r.label}:</span>
                      <span className="font-mono">{r.formula}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{r.justification}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground transition-colors">ヒントを表示</summary>
              <p className="mt-1 pl-4">{exercise.hint}</p>
            </details>
            {!revealed && (
              <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer">
                リファクタリングを確定する
              </button>
            )}
            {revealed && (
              <div className="space-y-3">
                <div className={`rounded-md px-4 py-3 text-sm transition-all duration-300 ${
                  scores[scores.length - 1] >= 80 ? "bg-truth/10 text-truth"
                    : scores[scores.length - 1] >= 40 ? "bg-primary/10 text-primary" : "bg-falsehood/10 text-falsehood"
                }`}>
                  <p className="font-medium mb-1">スコア: {scores[scores.length - 1]}%</p>
                  <p className="text-sm opacity-90">
                    {currentLength <= exercise.optimalLength
                      ? `最適な長さ（${exercise.optimalLength}ステップ）に到達しました！`
                      : `最適な長さは ${exercise.optimalLength}ステップです。さらに簡約できる部分があります。`}
                  </p>
                </div>
                {currentIndex < EXERCISES.length - 1 && (
                  <button type="button" onClick={handleNext} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer">
                    次の問題へ
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {caption && <figcaption className="text-xs text-muted-foreground text-center mt-2">{caption}</figcaption>}
    </figure>
  )
}
