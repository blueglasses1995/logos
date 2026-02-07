"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { loadProgress } from "@/lib/progress"
import type { UserProgress } from "@/types/progress"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RelationType = "requires" | "extends" | "contrasts"

interface ConceptNode {
  readonly id: string
  readonly label: string
  readonly chapter: string
  readonly description: string
  readonly x: number
  readonly y: number
}

interface ConceptEdge {
  readonly from: string
  readonly to: string
  readonly relation: RelationType
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NODES: readonly ConceptNode[] = [
  { id: "propositions", label: "命題", chapter: "01-propositions", description: "真偽が定まる文。論理学の最も基本的な単位。", x: 120, y: 60 },
  { id: "connectives", label: "論理結合子", chapter: "01-propositions", description: "AND(∧), OR(∨), NOT(¬), IF-THEN(→) で命題を組み合わせる。", x: 320, y: 60 },
  { id: "truth-tables", label: "真理値表", chapter: "02-truth-tables", description: "すべての真偽の組み合わせを網羅的に列挙し、論理式の意味を確定する。", x: 520, y: 60 },
  { id: "tautology", label: "恒真式", chapter: "02-truth-tables", description: "どんな真偽の組み合わせでも常に真になる論理式（トートロジー）。", x: 520, y: 180 },
  { id: "validity", label: "妥当性", chapter: "03-validity", description: "前提がすべて真なら結論も必ず真になる論証の性質。", x: 320, y: 180 },
  { id: "soundness", label: "健全性", chapter: "03-validity", description: "妥当であり、かつ前提がすべて事実として真である論証。", x: 120, y: 180 },
  { id: "predicates", label: "述語と項", chapter: "04a-predicates", description: "「xは人間である」のように、対象の性質や関係を表す。", x: 120, y: 300 },
  { id: "universal", label: "全称量化子 ∀", chapter: "04b-universal", description: "「すべてのxについて」— 領域全体に関する主張を表現する。", x: 320, y: 300 },
  { id: "existential", label: "存在量化子 ∃", chapter: "04c-existential", description: "「あるxが存在して」— 少なくとも一つの対象についての主張。", x: 520, y: 300 },
  { id: "negation", label: "量化子の否定", chapter: "04d-negation", description: "¬∀x P(x) ≡ ∃x ¬P(x) — ド・モルガンの法則の一般化。", x: 420, y: 420 },
  { id: "multiple-q", label: "多重量化", chapter: "04e-multiple-quantifiers", description: "量化子を入れ子にする。順序によって意味が変わる。", x: 220, y: 420 },
  { id: "sql", label: "述語論理とSQL", chapter: "04f-sql-connection", description: "WHERE句は述語、EXISTS句は∃、全件検索は∀に対応する。", x: 120, y: 540 },
  { id: "fallacies", label: "非形式的誤謬", chapter: "05-fallacies", description: "論理的に見えるが実は不正な推論パターン。", x: 520, y: 540 },
  { id: "synthesis", label: "実践総合演習", chapter: "06-synthesis", description: "全章の知識を統合した議論分析と論証構築。", x: 320, y: 540 },
]

const EDGES: readonly ConceptEdge[] = [
  { from: "propositions", to: "connectives", relation: "extends" },
  { from: "connectives", to: "truth-tables", relation: "extends" },
  { from: "truth-tables", to: "tautology", relation: "extends" },
  { from: "truth-tables", to: "validity", relation: "requires" },
  { from: "validity", to: "soundness", relation: "extends" },
  { from: "propositions", to: "predicates", relation: "extends" },
  { from: "predicates", to: "universal", relation: "extends" },
  { from: "predicates", to: "existential", relation: "extends" },
  { from: "universal", to: "negation", relation: "extends" },
  { from: "existential", to: "negation", relation: "extends" },
  { from: "universal", to: "multiple-q", relation: "extends" },
  { from: "existential", to: "multiple-q", relation: "extends" },
  { from: "predicates", to: "sql", relation: "extends" },
  { from: "multiple-q", to: "sql", relation: "extends" },
  { from: "validity", to: "fallacies", relation: "contrasts" },
  { from: "soundness", to: "fallacies", relation: "contrasts" },
  { from: "validity", to: "synthesis", relation: "requires" },
  { from: "fallacies", to: "synthesis", relation: "requires" },
  { from: "predicates", to: "synthesis", relation: "requires" },
]

const RELATION_COLORS: Readonly<Record<RelationType, string>> = {
  requires: "stroke-primary/50",
  extends: "stroke-truth/50",
  contrasts: "stroke-falsehood/50",
}

const RELATION_LABELS: Readonly<Record<RelationType, string>> = {
  requires: "必要",
  extends: "発展",
  contrasts: "対比",
}

const SVG_WIDTH = 660
const SVG_HEIGHT = 620
const NODE_RX = 12
const NODE_W = 120
const NODE_H = 44

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isChapterUnlocked(
  progress: UserProgress,
  chapterSlug: string
): boolean {
  const chapter = progress.chapters[chapterSlug]
  if (!chapter) return false
  return (
    chapter.theory.attempts.length > 0 ||
    chapter.practice.attempts.length > 0 ||
    chapter.philosophy.read
  )
}

function getNodeById(id: string): ConceptNode | undefined {
  return NODES.find((n) => n.id === id)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConceptMap() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const unlockedSet = useMemo(() => {
    if (!progress) return new Set<string>()
    const set = new Set<string>()
    for (const node of NODES) {
      if (isChapterUnlocked(progress, node.chapter)) {
        set.add(node.id)
      }
    }
    return set
  }, [progress])

  const connectedSet = useMemo(() => {
    const active = hoveredId ?? selectedId
    if (!active) return new Set<string>()
    const set = new Set<string>()
    set.add(active)
    for (const edge of EDGES) {
      if (edge.from === active) set.add(edge.to)
      if (edge.to === active) set.add(edge.from)
    }
    return set
  }, [hoveredId, selectedId])

  const handleNodeClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const selectedNode = selectedId ? getNodeById(selectedId) : null

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 bg-secondary/30">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
          コンセプトマップ
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-truth/20 border border-truth/50" />
            学習済み
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-muted border border-border" />
            未学習
          </span>
          {(["extends", "requires", "contrasts"] as const).map((rel) => (
            <span key={rel} className="flex items-center gap-1.5">
              <svg width={20} height={10} className="shrink-0">
                <line
                  x1={0} y1={5} x2={20} y2={5}
                  className={RELATION_COLORS[rel]}
                  strokeWidth={2}
                  strokeDasharray={rel === "contrasts" ? "4 3" : undefined}
                />
              </svg>
              {RELATION_LABELS[rel]}
            </span>
          ))}
        </div>

        {/* SVG Map */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full max-w-[660px] mx-auto"
            role="img"
            aria-label="論理学コンセプトマップ"
          >
            {/* Edges */}
            {EDGES.map((edge) => {
              const fromNode = getNodeById(edge.from)
              const toNode = getNodeById(edge.to)
              if (!fromNode || !toNode) return null
              const active = connectedSet.size > 0
              const isConnected =
                connectedSet.has(edge.from) && connectedSet.has(edge.to)
              const opacity = active ? (isConnected ? 1 : 0.15) : 0.6
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={RELATION_COLORS[edge.relation]}
                  strokeWidth={isConnected ? 2.5 : 1.5}
                  strokeDasharray={edge.relation === "contrasts" ? "6 4" : undefined}
                  opacity={opacity}
                  style={{ transition: "opacity 200ms, stroke-width 200ms" }}
                />
              )
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const unlocked = unlockedSet.has(node.id)
              const active = connectedSet.size > 0
              const isConnected = connectedSet.has(node.id)
              const isSelected = selectedId === node.id
              const dimmed = active && !isConnected
              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}${unlocked ? "" : "（未学習）"}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleNodeClick(node.id)
                    }
                  }}
                >
                  <rect
                    x={node.x - NODE_W / 2}
                    y={node.y - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    rx={NODE_RX}
                    className={
                      isSelected
                        ? "fill-primary/20 stroke-primary"
                        : unlocked
                          ? "fill-truth/10 stroke-truth/50"
                          : "fill-muted stroke-border"
                    }
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeDasharray={unlocked ? undefined : "4 3"}
                    opacity={dimmed ? 0.3 : 1}
                    style={{ transition: "opacity 200ms" }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-xs font-medium select-none ${
                      unlocked
                        ? "fill-foreground"
                        : "fill-muted-foreground"
                    }`}
                    opacity={dimmed ? 0.3 : 1}
                    style={{ transition: "opacity 200ms" }}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Detail panel */}
        {selectedNode && (
          <div className="mt-4 border border-border rounded-md bg-background/60 px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                {selectedNode.label}
              </h3>
              {unlockedSet.has(selectedNode.id) ? (
                <span className="text-xs bg-truth/10 text-truth px-2 py-0.5 rounded-full">
                  学習済み
                </span>
              ) : (
                <span className="text-xs bg-falsehood/10 text-falsehood px-2 py-0.5 rounded-full">
                  未学習
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedNode.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EDGES.filter(
                (e) => e.from === selectedNode.id || e.to === selectedNode.id
              ).map((edge) => {
                const otherId =
                  edge.from === selectedNode.id ? edge.to : edge.from
                const other = getNodeById(otherId)
                if (!other) return null
                const direction =
                  edge.from === selectedNode.id ? "→" : "←"
                return (
                  <button
                    key={`${edge.from}-${edge.to}`}
                    type="button"
                    onClick={() => setSelectedId(otherId)}
                    className="text-xs px-2 py-1 rounded border border-border bg-background hover:border-primary/50 transition-colors"
                  >
                    {direction} {other.label}
                    <span className="text-muted-foreground ml-1">
                      ({RELATION_LABELS[edge.relation]})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
