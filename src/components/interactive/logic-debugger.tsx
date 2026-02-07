"use client"

import { useState, useCallback } from "react"

interface Premise {
  readonly text: string
  readonly isValid: boolean
}

interface DetectedFallacy {
  readonly name: string
  readonly description: string
}

interface AnalysisResult {
  readonly premises: readonly Premise[]
  readonly conclusion: string
  readonly structure: string
  readonly fallacies: readonly DetectedFallacy[]
  readonly isSound: boolean
}

interface PrebuiltArgument {
  readonly id: string
  readonly label: string
  readonly source: string
  readonly premises: readonly string[]
  readonly conclusion: string
}

interface LogicDebuggerProps {
  readonly caption?: string
}

const PREBUILT_ARGUMENTS: readonly PrebuiltArgument[] = [
  { id: "celebrity-ad", label: "有名人の推薦", source: "広告",
    premises: ["有名な俳優Xがこのサプリを飲んでいる", "Xは健康そうに見える"],
    conclusion: "このサプリは効果がある" },
  { id: "slippery-slope", label: "滑り坂論法", source: "SNS",
    premises: ["AIが一部の仕事を自動化し始めた", "自動化が進めば全ての仕事がなくなる"],
    conclusion: "AIのせいで人間は全員失業する" },
  { id: "false-dilemma", label: "誤った二分法", source: "ニュース討論",
    premises: ["経済成長を優先するか環境保護を優先するかの二択である", "環境保護を優先すると経済が崩壊する"],
    conclusion: "経済成長を選ぶしかない" },
  { id: "ad-populum", label: "多数論証", source: "口コミサイト",
    premises: ["この商品のレビューは1万件以上ある", "多くの人が高評価をつけている"],
    conclusion: "この商品は確実に高品質である" },
  { id: "hasty-gen", label: "早まった一般化", source: "日常会話",
    premises: ["先週行ったイタリア料理店は美味しくなかった", "先月行った別のイタリア料理店も微妙だった"],
    conclusion: "イタリア料理は全部まずい" },
  { id: "valid-mp", label: "妥当な論証（肯定式）", source: "教科書",
    premises: ["雨が降れば地面が濡れる", "今、雨が降っている"],
    conclusion: "したがって、地面は濡れている" },
]

const FALLACY_RULES: readonly {
  readonly pattern: RegExp
  readonly name: string
  readonly description: string
}[] = [
  { pattern: /有名|人気|推薦|芸能|俳優/,
    name: "権威への訴え（Ad Verecundiam）",
    description: "専門外の人物の権威を根拠にしています。有名であることと専門知識は別です。" },
  { pattern: /全員|全部|全て|すべて|必ず|絶対|確実/,
    name: "早まった一般化（Hasty Generalization）",
    description: "限られた事例から全体に対する結論を導いています。例外の可能性を考慮しましょう。" },
  { pattern: /しかない|二択|どちらか|一方/,
    name: "誤った二分法（False Dilemma）",
    description: "選択肢を不当に二つに限定しています。実際にはより多くの選択肢が存在する可能性があります。" },
  { pattern: /崩壊|滅び|全滅|失業する/,
    name: "滑り坂論法（Slippery Slope）",
    description: "中間段階の根拠なく極端な結論に飛躍しています。各段階の因果関係を検証する必要があります。" },
  { pattern: /多く|大勢|みんな|1万|万件/,
    name: "多数論証（Ad Populum）",
    description: "多くの人が支持しているという事実を正しさの根拠にしています。多数意見が常に正しいとは限りません。" },
]

function analyzeArgument(premises: readonly string[], conclusion: string): AnalysisResult {
  const joinedText = [...premises, conclusion].join(" ")
  const fallacies: DetectedFallacy[] = FALLACY_RULES
    .filter((r) => r.pattern.test(joinedText))
    .map((r) => ({ name: r.name, description: r.description }))

  const hasModusPonens =
    premises.some((p) => /れば|ならば|なら|場合/.test(p)) && premises.length >= 2
  const structure = hasModusPonens
    ? fallacies.length === 0 ? "肯定式（Modus Ponens）: P→Q, P ∴ Q" : "条件付き推論（前提に問題あり）"
    : "一般的な帰納的推論"

  const analyzedPremises: Premise[] = premises.map((text) => ({
    text,
    isValid: !/(全員|全部|必ず|絶対|確実|崩壊|しかない)/.test(text),
  }))

  return { premises: analyzedPremises, conclusion, structure, fallacies, isSound: fallacies.length === 0 }
}

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-md text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"

export function LogicDebugger({ caption }: LogicDebuggerProps) {
  const [mode, setMode] = useState<"select" | "manual">("select")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [manualPremises, setManualPremises] = useState<readonly string[]>(["", ""])
  const [manualConclusion, setManualConclusion] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleSelectArgument = useCallback((id: string) => {
    const arg = PREBUILT_ARGUMENTS.find((a) => a.id === id)
    if (!arg) return
    setSelectedId(id)
    setResult(analyzeArgument(arg.premises, arg.conclusion))
  }, [])

  const handleManualAnalyze = useCallback(() => {
    const filled = manualPremises.filter((p) => p.trim() !== "")
    if (filled.length === 0 || manualConclusion.trim() === "") return
    setResult(analyzeArgument(filled, manualConclusion))
  }, [manualPremises, manualConclusion])

  const handleUpdatePremise = useCallback((index: number, value: string) => {
    setManualPremises((prev) => prev.map((p, i) => (i === index ? value : p)))
  }, [])

  const handleReset = useCallback(() => {
    setSelectedId(null)
    setResult(null)
    setManualPremises(["", ""])
    setManualConclusion("")
  }, [])

  const modeBtn = (target: "select" | "manual", label: string) => (
    <button
      type="button"
      onClick={() => { setMode(target); handleReset() }}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
        mode === target ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          論理デバッガー
        </div>

        <div className="flex gap-2">
          {modeBtn("select", "例題から選ぶ")}
          {modeBtn("manual", "手動入力")}
        </div>

        {mode === "select" && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PREBUILT_ARGUMENTS.map((arg) => (
              <button
                key={arg.id}
                type="button"
                onClick={() => handleSelectArgument(arg.id)}
                className={`text-left px-3 py-2 rounded-md text-sm border transition-all duration-200 ${
                  selectedId === arg.id
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-background border-border hover:border-primary/50 text-foreground"
                }`}
              >
                <div className="font-medium">{arg.label}</div>
                <div className="text-xs text-muted-foreground">{arg.source}</div>
              </button>
            ))}
          </div>
        )}

        {mode === "manual" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground">前提</div>
            {manualPremises.map((premise, i) => (
              <input key={i} type="text" value={premise}
                onChange={(e) => handleUpdatePremise(i, e.target.value)}
                placeholder={`前提 ${i + 1}`} className={INPUT_CLASS} />
            ))}
            <button type="button" onClick={() => setManualPremises((prev) => [...prev, ""])}
              className="text-xs text-primary hover:underline">
              + 前提を追加
            </button>
            <div className="text-sm font-medium text-foreground">結論</div>
            <input type="text" value={manualConclusion}
              onChange={(e) => setManualConclusion(e.target.value)}
              placeholder="結論を入力" className={INPUT_CLASS} />
            <button type="button" onClick={handleManualAnalyze}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90">
              分析する
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">前提</div>
              <div className="space-y-2">
                {result.premises.map((premise, i) => (
                  <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-md text-sm border transition-all duration-300 ${
                    premise.isValid
                      ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700"
                      : "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700"
                  }`}>
                    <span className={`shrink-0 mt-0.5 text-xs font-mono font-bold ${
                      premise.isValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}>P{i + 1}</span>
                    <span className="text-foreground">{premise.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">結論</div>
              <div className="px-3 py-2 rounded-md text-sm border border-primary/40 bg-primary/5">
                <span className="font-mono font-bold text-primary text-xs mr-2">C</span>
                <span className="text-foreground">{result.conclusion}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">論理構造</div>
              <div className="px-3 py-2 rounded-md text-sm bg-secondary border border-border font-mono text-foreground">
                {result.structure}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">診断結果</div>
              {result.isSound ? (
                <div className="px-4 py-3 rounded-md bg-emerald-50 border border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700">
                  <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">論理的に妥当な論証です</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">前提から結論が正しく導かれています。</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {result.fallacies.map((f) => (
                    <div key={f.name} className="px-4 py-3 rounded-md bg-red-50 border border-red-300 dark:bg-red-900/20 dark:border-red-700">
                      <div className="text-sm font-medium text-red-700 dark:text-red-300">{f.name}</div>
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">{f.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              リセット
            </button>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">{caption}</figcaption>
      )}
    </figure>
  )
}
