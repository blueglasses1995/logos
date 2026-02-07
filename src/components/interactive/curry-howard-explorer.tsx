"use client"

import { useState, useCallback } from "react"

type ExerciseType = "match" | "prove" | "never" | "syllogism" | "generic"

interface Exercise {
  readonly id: string
  readonly type: ExerciseType
  readonly title: string
  readonly prompt: string
  readonly items: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

const MAPPINGS: readonly { readonly logic: string; readonly ts: string; readonly desc: string }[] = [
  { logic: "命題 (Proposition)", ts: "型 (Type)", desc: "命題は型に対応する" },
  { logic: "証明 (Proof)", ts: "値 (Value)", desc: "証明は値に対応する" },
  { logic: "A ∧ B（連言）", ts: "A & B / [A, B]", desc: "論理積はタプル/交差型に対応" },
  { logic: "A ∨ B（選言）", ts: "A | B", desc: "論理和はユニオン型に対応" },
  { logic: "A → B（含意）", ts: "(a: A) => B", desc: "含意は関数型に対応" },
  { logic: "⊥（矛盾/偽）", ts: "never", desc: "偽は never 型に対応（値なし）" },
  { logic: "⊤（トートロジー/真）", ts: "unknown", desc: "真は unknown 型に対応（常に値あり）" },
  { logic: "∀x. P(x)（全称量化）", ts: "<T>(x: T) => ...", desc: "全称はジェネリクスに対応" },
] as const

const EXERCISES: readonly Exercise[] = [
  { id: "match-types", type: "match", title: "型と命題の対応",
    prompt: "TypeScript の A | B（ユニオン型）に対応する論理結合子はどれですか？",
    items: ["A ∧ B（連言 / AND）", "A ∨ B（選言 / OR）", "A → B（含意）", "¬A（否定）"],
    correctIndex: 1,
    explanation: "A | B（ユニオン型）は論理和 A ∨ B に対応します。「A 型の値」か「B 型の値」のどちらかが存在すれば、A | B 型の値として成り立ちます。" },
  { id: "prove-type", type: "prove", title: "型の「証明」を構築する",
    prompt: "型 (a: string) => number の値（＝証明）として正しいものはどれですか？",
    items: ["const f = (a: string) => a.length", "const f = (a: number) => String(a)", "const f: never = undefined as never", 'const f = "hello"'],
    correctIndex: 0,
    explanation: "string → number という命題の証明は、string を受け取って number を返す関数です。a.length は string から number を生成するため有効な証明です。" },
  { id: "never-absurd", type: "never", title: "never 型 = 矛盾の不在証明",
    prompt: "never 型について正しい説明はどれですか？",
    items: ["never 型の値は undefined である", "never 型の値は null である", "never 型の値は存在しない（矛盾の証明は不可能）", 'never 型の値は空文字列 "" である'],
    correctIndex: 2,
    explanation: "never 型は値を持たない型です。カリー=ハワード対応では ⊥（矛盾/偽）に対応します。矛盾は証明できないのと同様に、never 型の値を正当に構築することは不可能です。" },
  { id: "syllogism", type: "syllogism", title: "関数合成 = 三段論法",
    prompt: "f: A → B と g: B → C の合成 g(f(x)) は、どの推論規則に対応しますか？",
    items: ["背理法（矛盾からは何でも導ける）", "三段論法（A→B, B→C ならば A→C）", "選言除去（A∨B のとき場合分け）", "全称例化（∀x.P(x) から P(a) を導く）"],
    correctIndex: 1,
    explanation: "関数合成 g(f(x)): A → C は仮言三段論法に正確に対応します。「A ならば B」と「B ならば C」から「A ならば C」を導く推論です。" },
  { id: "generic-universal", type: "generic", title: "ジェネリクス = 全称量化",
    prompt: "function identity<T>(x: T): T { return x } は、どの論理的原理に対応しますか？",
    items: ["∀T. T → T（任意の命題について、自身から自身を証明できる）", "∃T. T → T（ある命題について、自身から自身を証明できる）", "¬¬T → T（二重否定除去）", "T ∨ ¬T（排中律）"],
    correctIndex: 0,
    explanation: "ジェネリクス <T> は全称量化 ∀T に対応します。identity 関数は「すべての型 T について、T → T が成り立つ」ことの証明です。" },
] as const

const TYPE_LABELS: Readonly<Record<ExerciseType, string>> = {
  match: "マッチング", prove: "証明構築", never: "矛盾の理解", syllogism: "三段論法", generic: "全称量化",
}

const EXAMPLES: readonly { readonly id: string; readonly label: string; readonly logic: string; readonly code: string }[] = [
  { id: "pair", label: "連言の証明", logic: "A ∧ B の証明 = A の証明と B の証明の対", code: 'const proof: [string, number] = ["hello", 42]' },
  { id: "union", label: "選言の証明", logic: "A ∨ B の証明 = A か B いずれかの証明", code: 'const proof: string | number = "hello"' },
  { id: "function", label: "含意の証明", logic: "A → B の証明 = A を受け取り B を返す関数", code: "const proof = (s: string): number => s.length" },
  { id: "compose", label: "三段論法", logic: "(A→B) ∧ (B→C) → (A→C)", code: "const compose = <A,B,C>(f: (a:A)=>B, g: (b:B)=>C) => (a:A) => g(f(a))" },
] as const

const optionStyle = (showCorrect: boolean, showWrong: boolean, isSelected: boolean, revealed: boolean) =>
  `w-full text-left px-4 py-2.5 rounded-md text-sm font-mono transition-all duration-200 border ${
    showCorrect ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
    : showWrong ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
    : isSelected ? "bg-primary/10 border-primary"
    : "bg-background border-border hover:border-primary/50"
  } ${revealed ? "cursor-default" : "cursor-pointer"}`

export function CurryHowardExplorer() {
  const [activeTab, setActiveTab] = useState<"table" | "exercises" | "examples">("table")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<readonly boolean[]>([])

  const exercise = EXERCISES[currentIndex]
  const isComplete = scores.length === EXERCISES.length
  const correctCount = scores.filter(Boolean).length

  const handleSelect = useCallback((i: number) => { if (!revealed) setSelectedOption(i) }, [revealed])

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || revealed) return
    setRevealed(true)
    setScores((prev) => [...prev, selectedOption === exercise.correctIndex])
  }, [selectedOption, revealed, exercise.correctIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentIndex((p) => p + 1); setSelectedOption(null); setRevealed(false)
    }
  }, [currentIndex])

  const handleReset = useCallback(() => {
    setCurrentIndex(0); setSelectedOption(null); setRevealed(false); setScores([])
  }, [])

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          カリー=ハワード対応エクスプローラー
        </div>
        {/* Tab switcher */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {(["table", "exercises", "examples"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              {tab === "table" ? "対応表" : tab === "exercises" ? "演習" : "コード例"}
            </button>
          ))}
        </div>

        {/* Correspondence Table */}
        {activeTab === "table" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              カリー=ハワード対応は「論理の命題」と「型」、「証明」と「値」が同じ構造を持つことを示す深い関係です。
            </p>
            <div className="border border-border rounded-md overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-border bg-secondary/50">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">論理（Logic）</div>
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">TypeScript</div>
              </div>
              {MAPPINGS.map((m) => (
                <div key={m.logic} className="grid grid-cols-2 divide-x divide-border border-t border-border transition-colors duration-200 hover:bg-primary/5">
                  <div className="px-4 py-3"><code className="text-sm font-mono text-foreground">{m.logic}</code></div>
                  <div className="px-4 py-3">
                    <code className="text-sm font-mono text-primary">{m.ts}</code>
                    <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises */}
        {activeTab === "exercises" && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              {EXERCISES.map((ex, i) => (
                <div key={ex.id} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < scores.length ? (scores[i] ? "bg-emerald-500 dark:bg-emerald-400" : "bg-red-500 dark:bg-red-400")
                  : i === currentIndex ? "bg-primary/50" : "bg-border"
                }`} />
              ))}
            </div>

            {isComplete ? (
              <div className="text-center space-y-4 py-4">
                <div className="text-2xl font-bold text-foreground">{correctCount} / {EXERCISES.length} 正解</div>
                <p className="text-sm text-muted-foreground">
                  {correctCount === EXERCISES.length ? "全問正解！カリー=ハワード対応を深く理解しています。"
                   : correctCount >= 3 ? "よくできました。型と命題の対応関係をさらに深めましょう。"
                   : "型と論理の対応をもう一度確認してから再挑戦しましょう。"}
                </p>
                <button type="button" onClick={handleReset}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer">
                  もう一度挑戦する
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary">
                    {TYPE_LABELS[exercise.type]}
                  </span>
                  <span className="text-xs text-muted-foreground">{currentIndex + 1} / {EXERCISES.length}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground">{exercise.title}</h3>
                  <p className="text-sm text-foreground">{exercise.prompt}</p>
                </div>
                <div className="space-y-2">
                  {exercise.items.map((item, i) => {
                    const isSel = selectedOption === i
                    const isCorr = i === exercise.correctIndex
                    return (
                      <button key={item} type="button" onClick={() => handleSelect(i)} disabled={revealed}
                        className={optionStyle(revealed && isCorr, revealed && isSel && !isCorr, isSel, revealed)}>
                        <span className="inline-flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">{String.fromCharCode(65 + i)}</span>
                          {item}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {!revealed && (
                  <button type="button" onClick={handleSubmit} disabled={selectedOption === null}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      selectedOption !== null ? "bg-primary text-primary-foreground cursor-pointer hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}>
                    回答する
                  </button>
                )}
                {revealed && (
                  <div className={`rounded-md px-4 py-3 text-sm transition-all duration-300 ${
                    selectedOption === exercise.correctIndex
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300"
                      : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                  }`}>
                    <p className="font-medium mb-1">{selectedOption === exercise.correctIndex ? "正解！" : "不正解"}</p>
                    <p className="text-sm opacity-90">{exercise.explanation}</p>
                  </div>
                )}
                {revealed && currentIndex < EXERCISES.length - 1 && (
                  <button type="button" onClick={handleNext}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer">
                    次の問題へ
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Code Examples */}
        {activeTab === "examples" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">各論理概念が TypeScript でどのように表現されるか確認しましょう。</p>
            {EXAMPLES.map((ex) => (
              <div key={ex.id} className="border border-border rounded-md overflow-hidden">
                <div className="px-4 py-2 bg-secondary/50 border-b border-border">
                  <span className="text-xs font-semibold text-primary">{ex.label}</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">論理</div>
                    <code className="text-sm font-mono text-foreground">{ex.logic}</code>
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">TypeScript</div>
                    <code className="text-sm font-mono text-primary break-all">{ex.code}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
