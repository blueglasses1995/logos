"use client"

import { useState, useCallback } from "react"

// --- Types ---

type Formula =
  | { readonly kind: "var"; readonly name: string }
  | { readonly kind: "implies"; readonly left: Formula; readonly right: Formula }
  | { readonly kind: "and"; readonly left: Formula; readonly right: Formula }
  | { readonly kind: "or"; readonly left: Formula; readonly right: Formula }
  | { readonly kind: "not"; readonly inner: Formula }

interface Hypothesis {
  readonly name: string
  readonly formula: Formula
}

interface ProofGoal {
  readonly hypotheses: readonly Hypothesis[]
  readonly target: Formula
}

interface TacticResult {
  readonly success: boolean
  readonly message: string
  readonly newGoals: readonly ProofGoal[]
  readonly completed: boolean
}

interface ProofStep {
  readonly tactic: string
  readonly detail: string
}

interface ProofProblem {
  readonly id: string
  readonly title: string
  readonly formula: string
  readonly difficulty: "easy" | "medium"
  readonly initialGoal: ProofGoal
  readonly hint: string
}

// --- Formula helpers ---

function fVar(name: string): Formula {
  return { kind: "var", name }
}

function fImplies(left: Formula, right: Formula): Formula {
  return { kind: "implies", left, right }
}

function fAnd(left: Formula, right: Formula): Formula {
  return { kind: "and", left, right }
}

function fOr(left: Formula, right: Formula): Formula {
  return { kind: "or", left, right }
}

function formatFormula(f: Formula): string {
  switch (f.kind) {
    case "var":
      return f.name
    case "implies": {
      const l = f.left.kind === "implies" || f.left.kind === "or" ? `(${formatFormula(f.left)})` : formatFormula(f.left)
      const r = formatFormula(f.right)
      return `${l} → ${r}`
    }
    case "and": {
      const l = f.left.kind === "implies" || f.left.kind === "or" ? `(${formatFormula(f.left)})` : formatFormula(f.left)
      const r = f.right.kind === "implies" || f.right.kind === "or" ? `(${formatFormula(f.right)})` : formatFormula(f.right)
      return `${l} ∧ ${r}`
    }
    case "or": {
      const l = f.left.kind === "implies" ? `(${formatFormula(f.left)})` : formatFormula(f.left)
      const r = f.right.kind === "implies" ? `(${formatFormula(f.right)})` : formatFormula(f.right)
      return `${l} ∨ ${r}`
    }
    case "not":
      return f.inner.kind === "var" ? `¬${formatFormula(f.inner)}` : `¬(${formatFormula(f.inner)})`
  }
}

function formulasEqual(a: Formula, b: Formula): boolean {
  if (a.kind !== b.kind) return false
  switch (a.kind) {
    case "var":
      return a.name === (b as { kind: "var"; name: string }).name
    case "implies":
    case "and":
    case "or": {
      const bBinary = b as { kind: typeof a.kind; left: Formula; right: Formula }
      return formulasEqual(a.left, bBinary.left) && formulasEqual(a.right, bBinary.right)
    }
    case "not":
      return formulasEqual(a.inner, (b as { kind: "not"; inner: Formula }).inner)
  }
}

// --- Tactic engine ---

function applyIntro(goal: ProofGoal): TacticResult {
  if (goal.target.kind !== "implies") {
    return { success: false, message: "intro: ゴールが含意 (→) の形ではありません。", newGoals: [], completed: false }
  }
  const hypoName = `H${goal.hypotheses.length + 1}`
  const newHypo: Hypothesis = { name: hypoName, formula: goal.target.left }
  const newGoal: ProofGoal = {
    hypotheses: [...goal.hypotheses, newHypo],
    target: goal.target.right,
  }
  return {
    success: true,
    message: `仮定 ${hypoName}: ${formatFormula(goal.target.left)} を導入しました。`,
    newGoals: [newGoal],
    completed: false,
  }
}

function applyExact(goal: ProofGoal, hypoName: string): TacticResult {
  const hypo = goal.hypotheses.find((h) => h.name === hypoName)
  if (!hypo) {
    return { success: false, message: `exact: 仮定 ${hypoName} が見つかりません。`, newGoals: [], completed: false }
  }
  if (!formulasEqual(hypo.formula, goal.target)) {
    return {
      success: false,
      message: `exact: 仮定 ${hypoName} (${formatFormula(hypo.formula)}) はゴール (${formatFormula(goal.target)}) と一致しません。`,
      newGoals: [],
      completed: false,
    }
  }
  return { success: true, message: `仮定 ${hypoName} でゴールを証明しました。`, newGoals: [], completed: true }
}

function applyHypothesis(goal: ProofGoal, hypoName: string): TacticResult {
  const hypo = goal.hypotheses.find((h) => h.name === hypoName)
  if (!hypo) {
    return { success: false, message: `apply: 仮定 ${hypoName} が見つかりません。`, newGoals: [], completed: false }
  }
  if (hypo.formula.kind !== "implies") {
    return { success: false, message: `apply: 仮定 ${hypoName} は含意 (→) の形ではありません。`, newGoals: [], completed: false }
  }
  if (!formulasEqual(hypo.formula.right, goal.target)) {
    return {
      success: false,
      message: `apply: 仮定 ${hypoName} の結論 (${formatFormula(hypo.formula.right)}) がゴール (${formatFormula(goal.target)}) と一致しません。`,
      newGoals: [],
      completed: false,
    }
  }
  const newGoal: ProofGoal = { hypotheses: goal.hypotheses, target: hypo.formula.left }
  return {
    success: true,
    message: `仮定 ${hypoName} を適用しました。新しいゴール: ${formatFormula(hypo.formula.left)}`,
    newGoals: [newGoal],
    completed: false,
  }
}

function applySplit(goal: ProofGoal): TacticResult {
  if (goal.target.kind !== "and") {
    return { success: false, message: "split: ゴールが連言 (∧) の形ではありません。", newGoals: [], completed: false }
  }
  const goal1: ProofGoal = { hypotheses: goal.hypotheses, target: goal.target.left }
  const goal2: ProofGoal = { hypotheses: goal.hypotheses, target: goal.target.right }
  return {
    success: true,
    message: `ゴールを2つに分割しました: ${formatFormula(goal.target.left)} と ${formatFormula(goal.target.right)}`,
    newGoals: [goal1, goal2],
    completed: false,
  }
}

function applyLeft(goal: ProofGoal): TacticResult {
  if (goal.target.kind !== "or") {
    return { success: false, message: "left: ゴールが選言 (∨) の形ではありません。", newGoals: [], completed: false }
  }
  const newGoal: ProofGoal = { hypotheses: goal.hypotheses, target: goal.target.left }
  return {
    success: true,
    message: `左側を選択しました。新しいゴール: ${formatFormula(goal.target.left)}`,
    newGoals: [newGoal],
    completed: false,
  }
}

function applyRight(goal: ProofGoal): TacticResult {
  if (goal.target.kind !== "or") {
    return { success: false, message: "right: ゴールが選言 (∨) の形ではありません。", newGoals: [], completed: false }
  }
  const newGoal: ProofGoal = { hypotheses: goal.hypotheses, target: goal.target.right }
  return {
    success: true,
    message: `右側を選択しました。新しいゴール: ${formatFormula(goal.target.right)}`,
    newGoals: [newGoal],
    completed: false,
  }
}

function applyAndElim(goal: ProofGoal, hypoName: string, side: "left" | "right"): TacticResult {
  const hypo = goal.hypotheses.find((h) => h.name === hypoName)
  if (!hypo) {
    return { success: false, message: `destruct: 仮定 ${hypoName} が見つかりません。`, newGoals: [], completed: false }
  }
  if (hypo.formula.kind !== "and") {
    return { success: false, message: `destruct: 仮定 ${hypoName} は連言 (∧) の形ではありません。`, newGoals: [], completed: false }
  }
  const extracted = side === "left" ? hypo.formula.left : hypo.formula.right
  const newHypoName = `H${goal.hypotheses.length + 1}`
  const newGoal: ProofGoal = {
    hypotheses: [...goal.hypotheses, { name: newHypoName, formula: extracted }],
    target: goal.target,
  }
  return {
    success: true,
    message: `仮定 ${hypoName} の${side === "left" ? "左" : "右"}側を取り出しました: ${newHypoName}: ${formatFormula(extracted)}`,
    newGoals: [newGoal],
    completed: false,
  }
}

// --- Problems ---

const P = fVar("P")
const Q = fVar("Q")

const PROBLEMS: readonly ProofProblem[] = [
  {
    id: "identity",
    title: "恒等関数",
    formula: "P → P",
    difficulty: "easy",
    initialGoal: { hypotheses: [], target: fImplies(P, P) },
    hint: "intro で仮定を導入し、exact でゴールと一致する仮定を使いましょう。",
  },
  {
    id: "weakening",
    title: "弱化",
    formula: "P → (Q → P)",
    difficulty: "easy",
    initialGoal: { hypotheses: [], target: fImplies(P, fImplies(Q, P)) },
    hint: "intro を2回使って仮定を導入し、最初の仮定を exact で使いましょう。",
  },
  {
    id: "conj-elim",
    title: "連言除去",
    formula: "(P ∧ Q) → P",
    difficulty: "medium",
    initialGoal: { hypotheses: [], target: fImplies(fAnd(P, Q), P) },
    hint: "intro で仮定を導入し、destruct で連言の左側を取り出し、exact で証明しましょう。",
  },
  {
    id: "disj-intro",
    title: "選言導入",
    formula: "P → (P ∨ Q)",
    difficulty: "medium",
    initialGoal: { hypotheses: [], target: fImplies(P, fOr(P, Q)) },
    hint: "intro で仮定を導入し、left で左側を選択し、exact で証明しましょう。",
  },
]

const DIFFICULTY_LABELS: Readonly<Record<ProofProblem["difficulty"], { readonly text: string; readonly className: string }>> = {
  easy: {
    text: "基本",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  medium: {
    text: "応用",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
}

// --- Tactic definitions for UI ---

interface TacticDef {
  readonly id: string
  readonly name: string
  readonly label: string
  readonly description: string
  readonly needsHypo: boolean
  readonly needsSide?: boolean
}

const TACTICS: readonly TacticDef[] = [
  { id: "intro", name: "intro", label: "仮定の導入", description: "含意 (→) のゴールに対し、左辺を仮定に加える", needsHypo: false },
  { id: "exact", name: "exact", label: "直接証明", description: "仮定がゴールと一致するとき証明完了", needsHypo: true },
  { id: "apply", name: "apply", label: "規則の適用", description: "含意の仮定を使い、ゴールを変換する", needsHypo: true },
  { id: "split", name: "split", label: "場合分け", description: "連言 (∧) のゴールを2つに分割する", needsHypo: false },
  { id: "left", name: "left", label: "左を選択", description: "選言 (∨) のゴールの左側を証明する", needsHypo: false },
  { id: "right", name: "right", label: "右を選択", description: "選言 (∨) のゴールの右側を証明する", needsHypo: false },
  { id: "destruct", name: "destruct", label: "分解", description: "連言の仮定から片側を取り出す", needsHypo: true, needsSide: true },
]

// --- Component ---

export function ProofAssistant() {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  const [goalStack, setGoalStack] = useState<readonly ProofGoal[]>([])
  const [steps, setSteps] = useState<readonly ProofStep[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null)
  const [selectedHypo, setSelectedHypo] = useState<string | null>(null)
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(null)

  const problem = PROBLEMS.find((p) => p.id === selectedProblemId)
  const currentGoal = goalStack.length > 0 ? goalStack[0] : null
  const tactic = TACTICS.find((t) => t.id === selectedTactic)

  const handleSelectProblem = useCallback((id: string) => {
    const prob = PROBLEMS.find((p) => p.id === id)
    if (!prob) return
    setSelectedProblemId(id)
    setGoalStack([prob.initialGoal])
    setSteps([])
    setMessage(null)
    setIsComplete(false)
    setShowHint(false)
    setSelectedTactic(null)
    setSelectedHypo(null)
    setSelectedSide(null)
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedProblemId(null)
    setGoalStack([])
    setSteps([])
    setMessage(null)
    setIsComplete(false)
    setShowHint(false)
    setSelectedTactic(null)
    setSelectedHypo(null)
    setSelectedSide(null)
  }, [])

  const handleReset = useCallback(() => {
    if (!problem) return
    setGoalStack([problem.initialGoal])
    setSteps([])
    setMessage(null)
    setIsComplete(false)
    setShowHint(false)
    setSelectedTactic(null)
    setSelectedHypo(null)
    setSelectedSide(null)
  }, [problem])

  const handleSelectTactic = useCallback((tacticId: string) => {
    setSelectedTactic(tacticId)
    setSelectedHypo(null)
    setSelectedSide(null)
    setMessage(null)
  }, [])

  const handleApplyTactic = useCallback(() => {
    if (!currentGoal || !selectedTactic) return

    let result: TacticResult

    switch (selectedTactic) {
      case "intro":
        result = applyIntro(currentGoal)
        break
      case "exact":
        if (!selectedHypo) {
          setMessage("仮定を選択してください。")
          setMessageType("error")
          return
        }
        result = applyExact(currentGoal, selectedHypo)
        break
      case "apply":
        if (!selectedHypo) {
          setMessage("適用する仮定を選択してください。")
          setMessageType("error")
          return
        }
        result = applyHypothesis(currentGoal, selectedHypo)
        break
      case "split":
        result = applySplit(currentGoal)
        break
      case "left":
        result = applyLeft(currentGoal)
        break
      case "right":
        result = applyRight(currentGoal)
        break
      case "destruct":
        if (!selectedHypo) {
          setMessage("分解する仮定を選択してください。")
          setMessageType("error")
          return
        }
        if (!selectedSide) {
          setMessage("取り出す側（左/右）を選択してください。")
          setMessageType("error")
          return
        }
        result = applyAndElim(currentGoal, selectedHypo, selectedSide)
        break
      default:
        return
    }

    if (!result.success) {
      setMessage(result.message)
      setMessageType("error")
      return
    }

    const tacticLabel = TACTICS.find((t) => t.id === selectedTactic)?.label ?? selectedTactic
    const detail = selectedHypo
      ? selectedSide
        ? `${selectedTactic} ${selectedHypo} (${selectedSide === "left" ? "左" : "右"})`
        : `${selectedTactic} ${selectedHypo}`
      : selectedTactic

    setSteps((prev) => [...prev, { tactic: tacticLabel, detail }])
    setMessage(result.message)
    setMessageType("success")
    setSelectedTactic(null)
    setSelectedHypo(null)
    setSelectedSide(null)

    if (result.completed) {
      const remaining = goalStack.slice(1)
      if (remaining.length === 0) {
        setGoalStack([])
        setIsComplete(true)
        setMessage("証明完了！ すべてのゴールを証明しました。")
      } else {
        setGoalStack(remaining)
        setMessage(`サブゴールを1つ証明しました。残り ${remaining.length} 個のゴール。`)
      }
    } else {
      const remaining = goalStack.slice(1)
      setGoalStack([...result.newGoals, ...remaining])
    }
  }, [currentGoal, selectedTactic, selectedHypo, selectedSide, goalStack])

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          対話型証明アシスタント
        </div>

        {/* Problem selection */}
        {!problem && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-3">
              証明する命題を選択してください。タクティクスを使って一歩ずつ証明を構築します。
            </div>
            {PROBLEMS.map((prob, i) => {
              const diff = DIFFICULTY_LABELS[prob.difficulty]
              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => handleSelectProblem(prob.id)}
                  className="w-full text-left px-4 py-3 rounded-md border border-border bg-background hover:border-primary/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">
                      #{i + 1}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.className}`}>
                      {diff.text}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {prob.title}
                  </div>
                  <code className="text-sm font-mono text-primary">
                    {prob.formula}
                  </code>
                </button>
              )
            })}
          </div>
        )}

        {/* Active proof */}
        {problem && !isComplete && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  &larr; 一覧に戻る
                </button>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_LABELS[problem.difficulty].className}`}>
                  {DIFFICULTY_LABELS[problem.difficulty].text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showHint ? "ヒントを隠す" : "ヒントを見る"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  リセット
                </button>
              </div>
            </div>

            {/* Problem statement */}
            <div className="px-4 py-3 rounded-md bg-primary/10 border border-primary/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                証明する命題
              </div>
              <code className="text-base font-mono font-bold text-foreground">
                {problem.formula}
              </code>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="px-4 py-3 rounded-md bg-secondary border border-border">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  ヒント
                </div>
                <div className="text-sm text-foreground">{problem.hint}</div>
              </div>
            )}

            {/* Current goal */}
            {currentGoal && (
              <div className="px-4 py-3 rounded-md border border-border bg-background space-y-3">
                {/* Goal count */}
                {goalStack.length > 1 && (
                  <div className="text-xs text-muted-foreground">
                    ゴール {1} / {goalStack.length}
                  </div>
                )}

                {/* Hypotheses */}
                {currentGoal.hypotheses.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      コンテキスト（仮定）
                    </div>
                    <div className="space-y-1">
                      {currentGoal.hypotheses.map((h) => (
                        <div key={h.name} className="flex items-center gap-2 px-2 py-1 rounded bg-secondary/50">
                          <span className="text-xs font-bold font-mono text-primary">{h.name}</span>
                          <span className="text-xs text-muted-foreground">:</span>
                          <code className="text-sm font-mono text-foreground">{formatFormula(h.formula)}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Separator line */}
                <div className="border-t border-border" />

                {/* Goal */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    ゴール
                  </div>
                  <code className="text-sm font-mono font-bold text-primary">
                    {formatFormula(currentGoal.target)}
                  </code>
                </div>
              </div>
            )}

            {/* Tactic buttons */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                タクティクス
              </div>
              <div className="flex flex-wrap gap-2">
                {TACTICS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTactic(t.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium border transition-all duration-200 cursor-pointer ${
                      selectedTactic === t.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactic detail & parameter selection */}
            {tactic && (
              <div className="px-4 py-3 rounded-md bg-secondary/50 border border-border space-y-3">
                <div>
                  <span className="text-xs font-bold font-mono text-primary">{tactic.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {tactic.description}</span>
                </div>

                {/* Hypothesis selection */}
                {tactic.needsHypo && currentGoal && currentGoal.hypotheses.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">仮定を選択:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentGoal.hypotheses.map((h) => (
                        <button
                          key={h.name}
                          type="button"
                          onClick={() => setSelectedHypo(h.name)}
                          className={`px-2 py-1 rounded text-xs font-mono border transition-all duration-200 cursor-pointer ${
                            selectedHypo === h.name
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-background border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {h.name}: {formatFormula(h.formula)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tactic.needsHypo && currentGoal && currentGoal.hypotheses.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    利用可能な仮定がありません。まず intro で仮定を導入してください。
                  </div>
                )}

                {/* Side selection for destruct */}
                {tactic.needsSide && selectedHypo && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">取り出す側:</div>
                    <div className="flex gap-2">
                      {(["left", "right"] as const).map((side) => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => setSelectedSide(side)}
                          className={`px-3 py-1 rounded text-xs font-mono border transition-all duration-200 cursor-pointer ${
                            selectedSide === side
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-background border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {side === "left" ? "左" : "右"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply tactic button */}
                <button
                  type="button"
                  onClick={handleApplyTactic}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
                >
                  適用する
                </button>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`px-4 py-3 rounded-md text-sm ${
                messageType === "success"
                  ? "bg-truth/10 border border-truth/30 text-truth"
                  : messageType === "error"
                    ? "bg-falsehood/10 border border-falsehood/30 text-falsehood"
                    : "bg-secondary border border-border text-foreground"
              }`}>
                {message}
              </div>
            )}

            {/* Proof steps so far */}
            {steps.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  証明ステップ
                </div>
                <div className="space-y-1">
                  {steps.map((step, i) => (
                    <div
                      key={`step-${problem.id}-${i}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary/50 border border-border/50"
                    >
                      <span className="text-xs font-mono text-muted-foreground w-5 text-right shrink-0">
                        {i + 1}.
                      </span>
                      <code className="text-xs font-mono text-primary">{step.detail}</code>
                      <span className="text-xs text-muted-foreground">({step.tactic})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Proof complete */}
        {isComplete && problem && (
          <div className="space-y-4">
            <div className="text-center space-y-3 py-4">
              <div className="text-lg font-bold text-truth">
                証明完了！
              </div>
              <code className="text-base font-mono text-foreground">
                {problem.formula}
              </code>
              <div className="text-sm text-muted-foreground">
                {steps.length}ステップで証明しました。
              </div>
            </div>

            {/* Proof record */}
            <div className="px-4 py-3 rounded-md bg-truth/5 border border-truth/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-truth mb-2">
                証明の記録
              </div>
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <div
                    key={`complete-step-${problem.id}-${i}`}
                    className="flex items-center gap-2 px-2 py-1"
                  >
                    <span className="text-xs font-mono text-muted-foreground w-5 text-right shrink-0">
                      {i + 1}.
                    </span>
                    <code className="text-xs font-mono text-foreground">{step.detail}</code>
                  </div>
                ))}
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="text-xs font-mono text-muted-foreground w-5 text-right shrink-0" />
                  <span className="text-xs font-bold font-mono text-truth">Qed.</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
              >
                もう一度挑戦する
              </button>
              <button
                type="button"
                onClick={handleBackToList}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                他の命題を選ぶ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
