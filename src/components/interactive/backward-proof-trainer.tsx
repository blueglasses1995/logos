"use client"

import { useState, useCallback } from "react"

interface ProofNode {
  readonly id: string
  readonly label: string
  readonly rule?: string
  readonly children: readonly string[]
  readonly isGoal?: boolean
  readonly options?: readonly string[]
  readonly correctLabel?: string
}

interface ProofExercise {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly conclusion: string
  readonly nodes: readonly ProofNode[]
  readonly explanation: string
}

interface BackwardProofTrainerProps {
  readonly exerciseIndex?: number
}

const EXERCISES: readonly ProofExercise[] = [
  {
    id: "bp-modus-ponens",
    title: "モーダスポネンス（逆方向）",
    description:
      "結論 Q を証明するために、必要な前提を逆方向に特定してください。",
    conclusion: "Q",
    nodes: [
      {
        id: "n1",
        label: "Q",
        rule: "モーダスポネンス",
        children: ["n2", "n3"],
        isGoal: true,
      },
      {
        id: "n2",
        label: "",
        children: [],
        options: ["P \u2192 Q", "Q \u2192 P", "P \u2227 Q", "\u00acP"],
        correctLabel: "P \u2192 Q",
      },
      {
        id: "n3",
        label: "",
        children: [],
        options: ["Q", "P", "\u00acP", "\u00acQ"],
        correctLabel: "P",
      },
    ],
    explanation:
      "Q を導くには、モーダスポネンス（MP）を使います。P \u2192 Q と P が前提として必要です。結論から逆に辿ると、「何があれば Q が出るか？」を考えることになります。",
  },
  {
    id: "bp-chain",
    title: "連鎖推論（逆方向）",
    description:
      "結論 C を証明するために、推論の連鎖を逆方向に構築してください。",
    conclusion: "C",
    nodes: [
      {
        id: "c1",
        label: "C",
        rule: "モーダスポネンス",
        children: ["c2", "c3"],
        isGoal: true,
      },
      {
        id: "c2",
        label: "",
        children: [],
        options: ["A \u2192 C", "B \u2192 C", "C \u2192 B", "A \u2227 C"],
        correctLabel: "B \u2192 C",
      },
      {
        id: "c3",
        label: "B",
        rule: "モーダスポネンス",
        children: ["c4", "c5"],
      },
      {
        id: "c4",
        label: "",
        children: [],
        options: ["B \u2192 A", "A \u2192 B", "A \u2228 B", "\u00acA"],
        correctLabel: "A \u2192 B",
      },
      {
        id: "c5",
        label: "",
        children: [],
        options: ["B", "C", "A", "\u00acA"],
        correctLabel: "A",
      },
    ],
    explanation:
      "C を導くには B \u2192 C と B が必要です。さらに B を導くには A \u2192 B と A が必要です。このように結論から前提へ逆方向に辿る手法を「ゴール指向推論」と呼びます。",
  },
  {
    id: "bp-disjunctive",
    title: "選言的三段論法（逆方向）",
    description:
      "結論 Q が導かれた根拠を、逆方向に特定してください。",
    conclusion: "Q",
    nodes: [
      {
        id: "d1",
        label: "Q",
        rule: "選言的三段論法",
        children: ["d2", "d3"],
        isGoal: true,
      },
      {
        id: "d2",
        label: "",
        children: [],
        options: ["P \u2228 Q", "P \u2227 Q", "P \u2192 Q", "\u00acP \u2228 \u00acQ"],
        correctLabel: "P \u2228 Q",
      },
      {
        id: "d3",
        label: "",
        children: [],
        options: ["\u00acQ", "P", "\u00acP", "Q"],
        correctLabel: "\u00acP",
      },
    ],
    explanation:
      "選言的三段論法（DS）では、P \u2228 Q と \u00acP から Q を導きます。逆方向に考えると「Q を得るには、P \u2228 Q を知っていて、P でないことを示す」という2つのサブゴールに分解されます。",
  },
  {
    id: "bp-contradiction",
    title: "背理法（逆方向）",
    description:
      "\u00acP を証明するために、背理法の構造を逆方向に構築してください。",
    conclusion: "\u00acP",
    nodes: [
      {
        id: "r1",
        label: "\u00acP",
        rule: "背理法",
        children: ["r2"],
        isGoal: true,
      },
      {
        id: "r2",
        label: "矛盾 (\u22a5)",
        rule: "矛盾の導出",
        children: ["r3", "r4"],
      },
      {
        id: "r3",
        label: "",
        children: [],
        options: ["P（仮定）", "\u00acP（仮定）", "Q（仮定）", "P \u2192 Q"],
        correctLabel: "P（仮定）",
      },
      {
        id: "r4",
        label: "",
        children: [],
        options: [
          "P から導かれる矛盾",
          "Q から導かれる矛盾",
          "\u00acP の証拠",
          "P の証拠",
        ],
        correctLabel: "P から導かれる矛盾",
      },
    ],
    explanation:
      "\u00acP を背理法で証明するには、P を仮定して矛盾を導きます。逆方向に見ると、ゴール \u00acP は「P を仮定したら矛盾が出る」というサブゴールに分解されます。",
  },
  {
    id: "bp-mixed",
    title: "複合推論（逆方向）",
    description:
      "結論 R を証明するために、複数の推論規則を組み合わせて逆方向に構築してください。",
    conclusion: "R",
    nodes: [
      {
        id: "m1",
        label: "R",
        rule: "モーダスポネンス",
        children: ["m2", "m3"],
        isGoal: true,
      },
      {
        id: "m2",
        label: "",
        children: [],
        options: ["Q \u2192 R", "P \u2192 R", "R \u2192 Q", "\u00acQ"],
        correctLabel: "Q \u2192 R",
      },
      {
        id: "m3",
        label: "Q",
        rule: "選言的三段論法",
        children: ["m4", "m5"],
      },
      {
        id: "m4",
        label: "",
        children: [],
        options: ["P \u2228 Q", "P \u2227 Q", "\u00acP \u2228 Q", "P \u2192 Q"],
        correctLabel: "P \u2228 Q",
      },
      {
        id: "m5",
        label: "",
        children: [],
        options: ["\u00acQ", "P", "\u00acP", "Q"],
        correctLabel: "\u00acP",
      },
    ],
    explanation:
      "R のためには Q \u2192 R と Q が必要（MP）。Q のためには P \u2228 Q と \u00acP が必要（DS）。このように複数の規則を組み合わせた逆方向推論では、各ノードが独立したサブゴールになります。",
  },
]

type ViewMode = "backward" | "forward"

export function BackwardProofTrainer({
  exerciseIndex = 0,
}: BackwardProofTrainerProps) {
  const [currentExercise, setCurrentExercise] = useState(
    Math.min(exerciseIndex, EXERCISES.length - 1)
  )
  const [userAnswers, setUserAnswers] = useState<
    Readonly<Record<string, string>>
  >({})
  const [checkedNodes, setCheckedNodes] = useState<ReadonlySet<string>>(
    new Set()
  )
  const [viewMode, setViewMode] = useState<ViewMode>("backward")
  const [showExplanation, setShowExplanation] = useState(false)

  const exercise = EXERCISES[currentExercise]
  const nodeMap = new Map(exercise.nodes.map((n) => [n.id, n]))

  const handleSelect = useCallback(
    (nodeId: string, value: string) => {
      if (checkedNodes.has(nodeId)) return
      setUserAnswers((prev) => ({ ...prev, [nodeId]: value }))
    },
    [checkedNodes]
  )

  const handleCheck = useCallback(
    (nodeId: string) => {
      setCheckedNodes((prev) => new Set([...prev, nodeId]))
    },
    []
  )

  const handleReset = useCallback(() => {
    setUserAnswers({})
    setCheckedNodes(new Set())
    setShowExplanation(false)
  }, [])

  const handleChangeExercise = useCallback(
    (index: number) => {
      setCurrentExercise(index)
      setUserAnswers({})
      setCheckedNodes(new Set())
      setShowExplanation(false)
      setViewMode("backward")
    },
    []
  )

  const fillableNodes = exercise.nodes.filter((n) => n.options)
  const allChecked = fillableNodes.every((n) => checkedNodes.has(n.id))
  const allCorrect = fillableNodes.every(
    (n) => userAnswers[n.id] === n.correctLabel
  )

  const getNodeLabel = (node: ProofNode): string => {
    if (node.options) {
      return userAnswers[node.id] ?? "?"
    }
    return node.label
  }

  const getNodeStatus = (
    node: ProofNode
  ): "correct" | "wrong" | "active" | "pending" | "fixed" => {
    if (!node.options) return "fixed"
    if (!checkedNodes.has(node.id)) {
      return userAnswers[node.id] ? "active" : "pending"
    }
    return userAnswers[node.id] === node.correctLabel ? "correct" : "wrong"
  }

  const renderNode = (nodeId: string, depth: number) => {
    const node = nodeMap.get(nodeId)
    if (!node) return null

    const status = getNodeStatus(node)
    const label = getNodeLabel(node)
    const isChecked = checkedNodes.has(nodeId)
    const isCorrect = userAnswers[nodeId] === node.correctLabel

    return (
      <div key={nodeId} className="flex flex-col items-center">
        {/* Node */}
        <div
          className={`
            relative px-4 py-2 rounded-lg border-2 text-sm font-mono
            transition-all duration-300 min-w-[100px] text-center
            ${
              status === "correct"
                ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                : status === "wrong"
                  ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                  : status === "active"
                    ? "bg-primary/10 border-primary text-foreground"
                    : status === "pending"
                      ? "bg-background border-dashed border-border text-muted-foreground"
                      : "bg-background/50 border-border text-foreground"
            }
          `}
        >
          {node.isGoal && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-semibold px-1.5 py-0 rounded bg-primary text-primary-foreground">
              GOAL
            </span>
          )}
          {label}
          {node.rule && (
            <div className="text-[10px] text-muted-foreground italic mt-0.5">
              [{node.rule}]
            </div>
          )}
        </div>

        {/* Selection UI for fillable nodes */}
        {node.options && !isChecked && (
          <div className="mt-2 flex flex-col items-center gap-1">
            <select
              value={userAnswers[nodeId] ?? ""}
              onChange={(e) => handleSelect(nodeId, e.target.value)}
              className="text-xs font-mono px-2 py-1 rounded border border-border bg-background text-foreground cursor-pointer"
            >
              <option value="">選択...</option>
              {node.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {userAnswers[nodeId] && (
              <button
                type="button"
                onClick={() => handleCheck(nodeId)}
                className="text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                確認
              </button>
            )}
          </div>
        )}

        {/* Feedback for checked fillable nodes */}
        {node.options && isChecked && !isCorrect && (
          <div className="mt-1 text-[10px] text-red-600 dark:text-red-400">
            正解: {node.correctLabel}
          </div>
        )}

        {/* Connector lines and children */}
        {node.children.length > 0 && (
          <>
            <div className="w-px h-4 bg-border" />
            {node.children.length === 1 ? (
              renderNode(node.children[0], depth + 1)
            ) : (
              <div className="relative">
                {/* Horizontal connector */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border" />
                <div className="flex items-start gap-4">
                  {node.children.map((childId, i) => (
                    <div key={childId} className="flex flex-col items-center">
                      <div className="w-px h-4 bg-border" />
                      {renderNode(childId, depth + 1)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  const renderForwardView = () => {
    const leaves = exercise.nodes.filter((n) => n.children.length === 0)
    const root = exercise.nodes.find((n) => n.isGoal)

    return (
      <div className="flex flex-col items-center gap-2">
        {/* Premises at top */}
        <div className="flex flex-wrap gap-3 justify-center">
          {leaves.map((node) => {
            const label =
              node.correctLabel ?? node.label
            return (
              <div
                key={node.id}
                className="px-3 py-1.5 rounded-md border border-border bg-background/50 text-sm font-mono text-foreground"
              >
                {label}
              </div>
            )
          })}
        </div>
        <div className="text-muted-foreground text-lg">\u2193</div>
        {/* Intermediate nodes */}
        {exercise.nodes
          .filter((n) => !n.isGoal && n.children.length > 0)
          .map((node) => (
            <div key={node.id} className="flex flex-col items-center gap-2">
              <div className="px-3 py-1.5 rounded-md border border-border bg-background/50 text-sm font-mono text-foreground">
                {node.label}
                {node.rule && (
                  <span className="text-[10px] text-muted-foreground ml-2 italic">
                    [{node.rule}]
                  </span>
                )}
              </div>
              <div className="text-muted-foreground text-lg">\u2193</div>
            </div>
          ))}
        {/* Conclusion at bottom */}
        {root && (
          <div className="px-4 py-2 rounded-lg border-2 border-primary bg-primary/10 text-sm font-mono font-bold text-foreground">
            \u2234 {root.label}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 bg-secondary/30">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            逆方向証明トレーニング
          </span>
        </div>

        {/* Exercise selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {EXERCISES.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleChangeExercise(i)}
              className={`
                text-xs px-3 py-1 rounded-full border transition-all duration-200
                ${
                  i === currentExercise
                    ? "bg-primary/15 border-primary text-primary font-medium"
                    : "bg-background border-border text-muted-foreground hover:border-primary/50 cursor-pointer"
                }
              `}
            >
              {i + 1}. {ex.title}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="text-sm text-foreground mb-4 bg-background/50 rounded-md px-4 py-3 border border-border/50">
          {exercise.description}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setViewMode("backward")}
            className={`
              text-xs px-3 py-1.5 rounded-md border transition-all duration-200
              ${
                viewMode === "backward"
                  ? "bg-primary/15 border-primary text-primary font-medium"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 cursor-pointer"
              }
            `}
          >
            逆方向（ゴール \u2192 前提）
          </button>
          <button
            type="button"
            onClick={() => setViewMode("forward")}
            className={`
              text-xs px-3 py-1.5 rounded-md border transition-all duration-200
              ${
                viewMode === "forward"
                  ? "bg-primary/15 border-primary text-primary font-medium"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 cursor-pointer"
              }
            `}
          >
            順方向（前提 \u2192 結論）
          </button>
        </div>

        {/* Proof tree */}
        <div className="bg-background/30 rounded-md border border-border/50 px-4 py-6 mb-4 overflow-x-auto">
          {viewMode === "backward" ? (
            <div className="flex justify-center">
              {renderNode(exercise.nodes[0].id, 0)}
            </div>
          ) : (
            renderForwardView()
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">進捗:</span>
          <div className="flex gap-1">
            {fillableNodes.map((node) => {
              const st = getNodeStatus(node)
              return (
                <div
                  key={node.id}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${
                      st === "correct"
                        ? "bg-emerald-500"
                        : st === "wrong"
                          ? "bg-red-400"
                          : st === "active"
                            ? "bg-primary"
                            : "bg-border"
                    }
                  `}
                />
              )
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            {checkedNodes.size}/{fillableNodes.length}
          </span>
        </div>

        {/* Completion */}
        {allChecked && (
          <div
            className={`text-sm rounded-md px-4 py-3 mb-4 ${
              allCorrect
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {allCorrect ? "完璧！" : "惜しい！"}
            </div>
            {allCorrect
              ? "すべてのノードを正しく特定できました。"
              : "いくつかのノードが正しくありません。正解を確認してください。"}
          </div>
        )}

        {/* Explanation toggle */}
        {allChecked && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExplanation((prev) => !prev)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {showExplanation ? "解説を閉じる" : "解説を見る"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-background text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              もう一度挑戦する
            </button>
          </div>
        )}

        {showExplanation && (
          <div className="mt-4 text-sm text-foreground bg-primary/5 rounded-md px-4 py-3 border border-primary/20">
            <span className="font-medium text-primary">解説: </span>
            {exercise.explanation}
          </div>
        )}
      </div>
    </div>
  )
}
