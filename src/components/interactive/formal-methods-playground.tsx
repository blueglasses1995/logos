"use client"

import { useState, useCallback, useMemo } from "react"

// --- Types ---

interface State {
  readonly id: string
  readonly label: string
}

interface Transition {
  readonly from: string
  readonly to: string
  readonly label: string
}

interface Exercise {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly states: readonly State[]
  readonly transitions: readonly Transition[]
  readonly initialState: string
  readonly checkType: "invariant" | "reachability" | "deadlock" | "transition"
  readonly propertyDescription: string
  readonly badStates?: readonly string[]
  readonly invariantFn?: (stateId: string) => boolean
  readonly expectedAnswer: boolean
  readonly explanation: string
}

interface FormalMethodsPlaygroundProps {
  readonly caption?: string
}

// --- Built-in exercises ---

const EXERCISES: readonly Exercise[] = [
  {
    id: "traffic-light",
    title: "状態遷移: 信号機",
    description:
      "信号機は「青→黄→赤→青」と遷移します。「青から直接赤に変わることはない」は正しいですか？",
    states: [
      { id: "green", label: "青" },
      { id: "yellow", label: "黄" },
      { id: "red", label: "赤" },
    ],
    transitions: [
      { from: "green", to: "yellow", label: "変化" },
      { from: "yellow", to: "red", label: "変化" },
      { from: "red", to: "green", label: "変化" },
    ],
    initialState: "green",
    checkType: "transition",
    propertyDescription: "青から直接赤には遷移しない",
    expectedAnswer: true,
    explanation:
      "青→黄→赤の順序で遷移するため、青から直接赤への遷移は存在しません。モデル検査で全遷移を確認すると、この性質が成り立つことが分かります。",
  },
  {
    id: "counter-invariant",
    title: "不変条件: カウンター",
    description:
      "0から始まり +1 または +2 できるカウンター。「値は常に 0 以上」は不変条件として成り立ちますか？",
    states: [
      { id: "s0", label: "0" },
      { id: "s1", label: "1" },
      { id: "s2", label: "2" },
      { id: "s3", label: "3" },
    ],
    transitions: [
      { from: "s0", to: "s1", label: "+1" },
      { from: "s0", to: "s2", label: "+2" },
      { from: "s1", to: "s2", label: "+1" },
      { from: "s1", to: "s3", label: "+2" },
      { from: "s2", to: "s3", label: "+1" },
    ],
    initialState: "s0",
    checkType: "invariant",
    propertyDescription: "全ての到達可能な状態で値 >= 0",
    invariantFn: (stateId: string) => {
      const val = parseInt(stateId.replace("s", ""), 10)
      return val >= 0
    },
    expectedAnswer: true,
    explanation:
      "初期状態が0で、遷移は +1 か +2 のみです。全ての到達可能な状態（0, 1, 2, 3）で値は0以上なので、この不変条件は成り立ちます。",
  },
  {
    id: "reachability-error",
    title: "到達可能性: エラー状態",
    description:
      "ログイン→認証→メイン画面のフロー。「エラー状態」に到達する可能性はありますか？",
    states: [
      { id: "login", label: "ログイン" },
      { id: "auth", label: "認証中" },
      { id: "main", label: "メイン" },
      { id: "error", label: "エラー" },
    ],
    transitions: [
      { from: "login", to: "auth", label: "送信" },
      { from: "auth", to: "main", label: "成功" },
      { from: "auth", to: "error", label: "失敗" },
      { from: "error", to: "login", label: "再試行" },
    ],
    initialState: "login",
    checkType: "reachability",
    propertyDescription: "「エラー」状態に到達可能か",
    badStates: ["error"],
    expectedAnswer: true,
    explanation:
      "ログイン→認証中→エラーという経路が存在するため、エラー状態には到達可能です。モデル検査では、初期状態から幅優先探索で全ての到達可能な状態を列挙します。",
  },
  {
    id: "deadlock-detect",
    title: "デッドロック検出: プロセス",
    description:
      "2つのプロセスがリソースを待ち合う状況。デッドロック（遷移先がない状態）は発生しますか？",
    states: [
      { id: "start", label: "開始" },
      { id: "p1_wait", label: "P1待機" },
      { id: "p2_wait", label: "P2待機" },
      { id: "stuck", label: "停止" },
    ],
    transitions: [
      { from: "start", to: "p1_wait", label: "P1要求" },
      { from: "start", to: "p2_wait", label: "P2要求" },
      { from: "p1_wait", to: "stuck", label: "P2要求" },
      { from: "p2_wait", to: "stuck", label: "P1要求" },
    ],
    initialState: "start",
    checkType: "deadlock",
    propertyDescription: "遷移先がない状態（デッドロック）が存在するか",
    expectedAnswer: true,
    explanation:
      "「停止」状態には出ていく遷移がありません。開始→P1待機→停止、または開始→P2待機→停止の経路でデッドロックに陥ります。形式手法ではこのような状態を自動検出できます。",
  },
]

// --- Model checking engine ---

function findReachable(
  states: readonly State[],
  transitions: readonly Transition[],
  initial: string
): ReadonlySet<string> {
  const visited = new Set<string>()
  const queue = [initial]
  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current)) continue
    visited.add(current)
    for (const t of transitions) {
      if (t.from === current && !visited.has(t.to)) {
        queue.push(t.to)
      }
    }
  }
  return visited
}

function checkProperty(exercise: Exercise): {
  readonly holds: boolean
  readonly trace: readonly string[]
} {
  const reachable = findReachable(
    exercise.states,
    exercise.transitions,
    exercise.initialState
  )

  switch (exercise.checkType) {
    case "transition": {
      // Verify no direct transition from green to red exists
      const directExists = exercise.transitions.some(
        (t) =>
          t.from === exercise.initialState &&
          t.to ===
            exercise.states.find((s) => s.id !== exercise.initialState && s.id !== exercise.transitions.find((tr) => tr.from === exercise.initialState)?.to)?.id
      )
      return {
        holds: !directExists,
        trace: Array.from(reachable),
      }
    }
    case "invariant": {
      const fn = exercise.invariantFn ?? (() => true)
      const violating = Array.from(reachable).find((s) => !fn(s))
      return {
        holds: !violating,
        trace: violating ? [exercise.initialState, violating] : Array.from(reachable),
      }
    }
    case "reachability": {
      const bad = exercise.badStates ?? []
      const reachableBad = bad.filter((s) => reachable.has(s))
      return {
        holds: reachableBad.length > 0,
        trace: reachableBad.length > 0
          ? findPathTo(exercise.transitions, exercise.initialState, reachableBad[0])
          : Array.from(reachable),
      }
    }
    case "deadlock": {
      const deadlocked = Array.from(reachable).filter(
        (s) => !exercise.transitions.some((t) => t.from === s)
      )
      return {
        holds: deadlocked.length > 0,
        trace: deadlocked.length > 0
          ? findPathTo(exercise.transitions, exercise.initialState, deadlocked[0])
          : Array.from(reachable),
      }
    }
  }
}

function findPathTo(
  transitions: readonly Transition[],
  from: string,
  to: string
): readonly string[] {
  const visited = new Set<string>()
  const parent = new Map<string, string>()
  const queue = [from]
  visited.add(from)

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current === to) break
    for (const t of transitions) {
      if (t.from === current && !visited.has(t.to)) {
        visited.add(t.to)
        parent.set(t.to, current)
        queue.push(t.to)
      }
    }
  }

  const path: string[] = []
  let node: string | undefined = to
  while (node !== undefined) {
    path.unshift(node)
    node = parent.get(node)
  }
  return path
}

// --- SVG diagram ---

function StateDiagram({
  states,
  transitions,
  highlightPath,
  initialState,
}: {
  readonly states: readonly State[]
  readonly transitions: readonly Transition[]
  readonly highlightPath: readonly string[]
  readonly initialState: string
}) {
  const n = states.length
  const cx = 160
  const cy = 120
  const radius = n <= 3 ? 70 : 85
  const nodeR = 28

  const positions = useMemo(
    () =>
      states.map((_, i) => ({
        x: cx + radius * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
        y: cy + radius * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
      })),
    [n, cx, cy, radius]
  )

  const highlightSet = new Set(highlightPath)

  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full max-w-xs mx-auto"
      role="img"
      aria-label="状態遷移図"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            className="fill-muted-foreground"
          />
        </marker>
        <marker
          id="arrowhead-highlight"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" className="fill-primary" />
        </marker>
      </defs>

      {/* Transitions */}
      {transitions.map((t) => {
        const fromIdx = states.findIndex((s) => s.id === t.from)
        const toIdx = states.findIndex((s) => s.id === t.to)
        if (fromIdx === -1 || toIdx === -1) return null

        const p1 = positions[fromIdx]
        const p2 = positions[toIdx]
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const nx = dx / dist
        const ny = dy / dist

        const startX = p1.x + nx * nodeR
        const startY = p1.y + ny * nodeR
        const endX = p2.x - nx * (nodeR + 6)
        const endY = p2.y - ny * (nodeR + 6)

        // Curve offset for parallel edges
        const midX = (startX + endX) / 2 - ny * 14
        const midY = (startY + endY) / 2 + nx * 14

        const isHL =
          highlightPath.length > 1 &&
          highlightSet.has(t.from) &&
          highlightSet.has(t.to)

        return (
          <g key={`${t.from}-${t.to}`}>
            <path
              d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
              fill="none"
              className={isHL ? "stroke-primary" : "stroke-muted-foreground/50"}
              strokeWidth={isHL ? 2 : 1.5}
              markerEnd={
                isHL ? "url(#arrowhead-highlight)" : "url(#arrowhead)"
              }
            />
            <text
              x={midX}
              y={midY - 6}
              textAnchor="middle"
              className="text-[9px] fill-muted-foreground"
            >
              {t.label}
            </text>
          </g>
        )
      })}

      {/* States */}
      {states.map((s, i) => {
        const pos = positions[i]
        const isHighlighted = highlightSet.has(s.id)
        const isInitial = s.id === initialState

        return (
          <g key={s.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeR}
              className={
                isHighlighted
                  ? "fill-primary/20 stroke-primary"
                  : "fill-secondary stroke-border"
              }
              strokeWidth={isInitial ? 2.5 : 1.5}
            />
            {isInitial && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeR + 4}
                fill="none"
                className="stroke-primary/40"
                strokeWidth={1}
                strokeDasharray="3 2"
              />
            )}
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-medium ${
                isHighlighted ? "fill-primary" : "fill-foreground"
              }`}
            >
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// --- Main component ---

export function FormalMethodsPlayground({
  caption,
}: FormalMethodsPlaygroundProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)

  const selectedExercise = EXERCISES.find((e) => e.id === selectedId) ?? null

  const result = useMemo(
    () => (selectedExercise ? checkProperty(selectedExercise) : null),
    [selectedExercise]
  )

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setUserAnswer(null)
    setShowResult(false)
  }, [])

  const handleAnswer = useCallback(
    (answer: boolean) => {
      setUserAnswer(answer)
      setShowResult(true)
    },
    []
  )

  const handleReset = useCallback(() => {
    setSelectedId(null)
    setUserAnswer(null)
    setShowResult(false)
  }, [])

  const isCorrect =
    selectedExercise !== null &&
    userAnswer !== null &&
    userAnswer === selectedExercise.expectedAnswer

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          形式手法プレイグラウンド
        </div>
        <p className="text-sm text-muted-foreground">
          モデル検査の考え方を体験しましょう。状態遷移モデルの性質を予想し、検証結果と比べてみてください。
        </p>

        {/* Exercise selector */}
        {selectedId === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXERCISES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelect(ex.id)}
                className="text-left px-4 py-3 rounded-md text-sm border border-border bg-background hover:border-primary/50 transition-all duration-200"
              >
                <div className="font-medium text-foreground">{ex.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {ex.checkType === "invariant" && "不変条件の検証"}
                  {ex.checkType === "reachability" && "到達可能性の検証"}
                  {ex.checkType === "deadlock" && "デッドロック検出"}
                  {ex.checkType === "transition" && "遷移の検証"}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active exercise */}
        {selectedExercise && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground">
              {selectedExercise.title}
            </div>
            <p className="text-sm text-foreground">
              {selectedExercise.description}
            </p>

            {/* State diagram */}
            <div className="bg-secondary rounded-md p-4">
              <StateDiagram
                states={selectedExercise.states}
                transitions={selectedExercise.transitions}
                highlightPath={
                  showResult && result ? result.trace : []
                }
                initialState={selectedExercise.initialState}
              />
            </div>

            {/* Property being checked */}
            <div className="px-3 py-2 rounded-md text-sm bg-secondary border border-border">
              <span className="font-mono text-xs text-primary font-semibold mr-2">
                検証する性質:
              </span>
              <span className="text-foreground font-mono">
                {selectedExercise.propertyDescription}
              </span>
            </div>

            {/* User answer */}
            {!showResult && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">
                  あなたの予想は？
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAnswer(true)}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-border bg-truth/10 text-truth hover:bg-truth/20 transition-all duration-200"
                  >
                    はい（成り立つ）
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-border bg-falsehood/10 text-falsehood hover:bg-falsehood/20 transition-all duration-200"
                  >
                    いいえ（成り立たない）
                  </button>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && result && (
              <div className="space-y-3">
                {/* Correct/Incorrect badge */}
                <div
                  className={`px-4 py-3 rounded-md border ${
                    isCorrect
                      ? "bg-truth/10 border-truth/30"
                      : "bg-falsehood/10 border-falsehood/30"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isCorrect ? "text-truth" : "text-falsehood"
                    }`}
                  >
                    {isCorrect ? "正解！" : "不正解"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    検証結果:{" "}
                    <span className="font-mono font-semibold">
                      {selectedExercise.expectedAnswer
                        ? "成り立つ"
                        : "成り立たない"}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="px-4 py-3 rounded-md bg-secondary border border-border">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    解説
                  </div>
                  <p className="text-sm text-foreground">
                    {selectedExercise.explanation}
                  </p>
                </div>

                {/* Trace */}
                {result.trace.length > 1 && (
                  <div className="px-4 py-3 rounded-md bg-secondary border border-border">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      探索経路
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      {result.trace.map((stateId, i) => {
                        const state = selectedExercise.states.find(
                          (s) => s.id === stateId
                        )
                        return (
                          <span key={`${stateId}-${i}`} className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono font-medium">
                              {state?.label ?? stateId}
                            </span>
                            {i < result.trace.length - 1 && (
                              <span className="text-muted-foreground text-xs">
                                →
                              </span>
                            )}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Back button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  別の演習を選ぶ
                </button>
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
