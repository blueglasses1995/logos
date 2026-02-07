"use client"

import { useState, useCallback } from "react"

type Category = "technology" | "education" | "environment" | "health"

interface Premise { readonly id: string; readonly text: string; readonly plausibility: number }
interface Rule { readonly id: string; readonly name: string; readonly desc: string }
interface Conclusion { readonly id: string; readonly text: string }
interface WorkshopExercise {
  readonly id: string; readonly category: Category; readonly title: string; readonly context: string
  readonly premises: readonly Premise[]; readonly correctPremiseIds: readonly string[]
  readonly rules: readonly Rule[]; readonly correctRuleId: string
  readonly conclusions: readonly Conclusion[]; readonly correctConclusionId: string
  readonly counter: string; readonly ideal: string
}
interface EvalResult {
  readonly validity: number; readonly plausibility: number; readonly vulnerability: number
  readonly total: number; readonly feedback: string; readonly suggestions: readonly string[]
}

const CATS: Readonly<Record<Category, string>> = {
  technology: "テクノロジー", education: "教育", environment: "環境", health: "健康",
}

const RULES: readonly Rule[] = [
  { id: "mp", name: "モーダスポネンス", desc: "P→Q, P ならば Q" },
  { id: "hs", name: "仮言三段論法", desc: "P→Q, Q→R ならば P→R" },
  { id: "ds", name: "選言三段論法", desc: "P∨Q, ¬P ならば Q" },
  { id: "conj", name: "連言導入", desc: "P, Q ならば P∧Q" },
] as const

const EXERCISES: readonly WorkshopExercise[] = [
  { id: "tech-ai", category: "technology", title: "AI導入の是非",
    context: "ある企業が業務へのAI導入を検討しています。以下の前提から論証を構築してください。",
    premises: [
      { id: "t1", text: "AIは定型業務の処理速度を人間の10倍に向上させる", plausibility: 85 },
      { id: "t2", text: "定型業務の自動化により従業員は創造的業務に集中できる", plausibility: 70 },
      { id: "t3", text: "AI導入には初期投資が必要だが2年で回収可能である", plausibility: 60 },
      { id: "t4", text: "AIは全ての業務で人間より優れている", plausibility: 15 },
      { id: "t5", text: "技術の進歩は常に社会にとって良いことである", plausibility: 25 },
    ],
    correctPremiseIds: ["t1", "t2", "t3"], rules: RULES, correctRuleId: "hs",
    conclusions: [
      { id: "c1", text: "AI導入により業務効率と従業員の創造性の両方が向上し、投資回収も見込める" },
      { id: "c2", text: "AIは万能なので直ちに全面導入すべきである" },
      { id: "c3", text: "AI導入は不要である" },
    ],
    correctConclusionId: "c1",
    counter: "AI導入による雇用喪失やAIの判断ミスによるリスクが考慮されていない。また、2年での投資回収は市場環境の変化により不確実である。",
    ideal: "速度向上→創造的業務への集中→投資回収という連鎖推論（仮言三段論法）により、AI導入の合理性が段階的に導かれます。" },
  { id: "edu-online", category: "education", title: "オンライン教育の効果",
    context: "オンライン教育の普及について、その効果を論証してください。",
    premises: [
      { id: "e1", text: "オンライン教育は地理的制約なく学習機会を提供できる", plausibility: 90 },
      { id: "e2", text: "学習機会の平等化は教育格差の縮小につながる", plausibility: 75 },
      { id: "e3", text: "自己ペースでの学習は理解度を向上させる研究結果がある", plausibility: 65 },
      { id: "e4", text: "対面授業は完全に不要になる", plausibility: 10 },
      { id: "e5", text: "全ての学生がオンライン学習に適応できる", plausibility: 20 },
    ],
    correctPremiseIds: ["e1", "e2", "e3"], rules: RULES, correctRuleId: "hs",
    conclusions: [
      { id: "c1", text: "オンライン教育は学習機会の平等化と理解度向上の両面で教育改善に寄与する" },
      { id: "c2", text: "オンライン教育は対面教育を完全に置き換えるべきである" },
      { id: "c3", text: "オンライン教育には効果がない" },
    ],
    correctConclusionId: "c1",
    counter: "デジタルデバイドによりアクセス自体が不平等な可能性がある。また、社会性の発達や実技科目には対面が不可欠である。",
    ideal: "地理的制約の解消→教育格差の縮小という因果連鎖に、自己ペース学習の効果を加えて総合的価値を導きます。" },
  { id: "env-renewable", category: "environment", title: "再生可能エネルギーの推進",
    context: "再生可能エネルギーへの転換について論証を構築してください。",
    premises: [
      { id: "v1", text: "化石燃料の燃焼はCO2を排出し気候変動を加速させる", plausibility: 90 },
      { id: "v2", text: "再生可能エネルギーは発電時にCO2をほぼ排出しない", plausibility: 85 },
      { id: "v3", text: "太陽光・風力の発電コストは過去10年で70%以上低下した", plausibility: 80 },
      { id: "v4", text: "再生可能エネルギーだけで全電力を賄える", plausibility: 20 },
      { id: "v5", text: "環境問題は経済成長より常に優先されるべきである", plausibility: 30 },
    ],
    correctPremiseIds: ["v1", "v2", "v3"], rules: RULES, correctRuleId: "conj",
    conclusions: [
      { id: "c1", text: "再生可能エネルギーはCO2削減と経済性の両面から推進する合理的根拠がある" },
      { id: "c2", text: "化石燃料を直ちに全面禁止すべきである" },
      { id: "c3", text: "エネルギー政策の転換は不要である" },
    ],
    correctConclusionId: "c1",
    counter: "再生可能エネルギーには間欠性の問題があり蓄電技術が未成熟。太陽光パネルの製造・廃棄時の環境負荷も考慮が必要。",
    ideal: "化石燃料の問題点、CO2削減効果、コスト低下という3つの前提を連言導入で統合し推進の合理性を導きます。" },
  { id: "health-sleep", category: "health", title: "睡眠時間と健康の関係",
    context: "適切な睡眠時間の確保について論証を構築してください。",
    premises: [
      { id: "h1", text: "7-9時間の睡眠は認知機能と免疫機能を最適に維持する", plausibility: 85 },
      { id: "h2", text: "慢性的な睡眠不足は心疾患リスクを40%増加させる", plausibility: 75 },
      { id: "h3", text: "十分な睡眠は記憶の定着と学習効率を向上させる", plausibility: 80 },
      { id: "h4", text: "短時間睡眠で十分な人は存在しない", plausibility: 15 },
      { id: "h5", text: "睡眠時間だけが健康を決定する唯一の要因である", plausibility: 10 },
    ],
    correctPremiseIds: ["h1", "h2", "h3"], rules: RULES, correctRuleId: "conj",
    conclusions: [
      { id: "c1", text: "適切な睡眠時間の確保は認知・免疫・心臓の健康維持に多面的に寄与する" },
      { id: "c2", text: "睡眠さえ十分にとれば全ての健康問題は解決する" },
      { id: "c3", text: "睡眠時間と健康に有意な関係はない" },
    ],
    correctConclusionId: "c1",
    counter: "睡眠の質（深さ・連続性）が時間以上に重要な可能性がある。個人差や年齢による必要睡眠時間の変動も考慮されていない。",
    ideal: "認知・免疫維持、心疾患リスク低減、学習効率向上という3つの根拠を連言導入で組み合わせ多面的な健康効果を結論づけます。" },
] as const

function evaluate(ex: WorkshopExercise, prems: ReadonlySet<string>, ruleId: string | null, conclId: string | null): EvalResult {
  const correct = new Set(ex.correctPremiseIds)
  const matched = [...prems].filter((id) => correct.has(id)).length
  const hasWrong = [...prems].some((id) => !correct.has(id))
  const selPrems = ex.premises.filter((p) => prems.has(p.id))
  const avgPlaus = selPrems.length > 0 ? selPrems.reduce((s, p) => s + p.plausibility, 0) / selPrems.length : 0
  const vBase = (matched / correct.size) * 60
  const rBonus = ruleId === ex.correctRuleId ? 20 : 0
  const cBonus = conclId === ex.correctConclusionId ? 20 : 0
  const penalty = hasWrong ? 15 : 0
  const validity = Math.min(100, Math.max(0, Math.round(vBase + rBonus + cBonus - penalty)))
  const plausibility = Math.round(avgPlaus)
  const vulnerability = hasWrong ? 70 : matched < correct.size ? 50 : 20
  const total = Math.round(validity * 0.5 + plausibility * 0.3 + (100 - vulnerability) * 0.2)
  const suggestions: string[] = []
  if (matched < correct.size) suggestions.push("妥当な前提が不足しています。根拠の網羅性を高めましょう。")
  if (hasWrong) suggestions.push("妥当性の低い前提が含まれています。過度な一般化を避けましょう。")
  if (ruleId !== ex.correctRuleId) suggestions.push("推論規則の選択を見直しましょう。")
  if (conclId !== ex.correctConclusionId) suggestions.push("結論が前提から論理的に導かれるか確認しましょう。")
  const feedback = total >= 80 ? "優れた論証です！" : total >= 60 ? "良い論証ですが改善の余地があります。" : total >= 40 ? "論証に弱点があります。" : "論証を根本から見直しましょう。"
  return { validity, plausibility, vulnerability, total, feedback, suggestions }
}

function Meter({ value, label }: { readonly value: number; readonly label: string }) {
  const c = value >= 70 ? "bg-emerald-500 dark:bg-emerald-400" : value >= 40 ? "bg-amber-500 dark:bg-amber-400" : "bg-red-500 dark:bg-red-400"
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${c}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function ArgumentWorkshop() {
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState<"premises" | "rule" | "conclusion" | "result">("premises")
  const [selPrems, setSelPrems] = useState<ReadonlySet<string>>(new Set())
  const [selRule, setSelRule] = useState<string | null>(null)
  const [selConcl, setSelConcl] = useState<string | null>(null)
  const [result, setResult] = useState<EvalResult | null>(null)
  const [showCounter, setShowCounter] = useState(false)

  const ex = EXERCISES[idx]
  const stepKeys = ["premises", "rule", "conclusion", "result"] as const
  const stepLabels = ["前提選択", "推論規則", "結論", "評価"] as const
  const stepIdx = stepKeys.indexOf(step)

  const togglePrem = useCallback((id: string) => {
    setSelPrems((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }, [])

  const nextStep = useCallback(() => {
    if (step === "premises" && selPrems.size > 0) setStep("rule")
    else if (step === "rule" && selRule) setStep("conclusion")
    else if (step === "conclusion" && selConcl) { setResult(evaluate(ex, selPrems, selRule, selConcl)); setStep("result") }
  }, [step, selPrems, selRule, selConcl, ex])

  const prevStep = useCallback(() => {
    if (step === "rule") setStep("premises")
    else if (step === "conclusion") setStep("rule")
    else if (step === "result") { setStep("conclusion"); setResult(null); setShowCounter(false) }
  }, [step])

  const nextEx = useCallback(() => {
    if (idx < EXERCISES.length - 1) {
      setIdx((p) => p + 1); setStep("premises"); setSelPrems(new Set()); setSelRule(null); setSelConcl(null); setResult(null); setShowCounter(false)
    }
  }, [idx])

  const reset = useCallback(() => {
    setStep("premises"); setSelPrems(new Set()); setSelRule(null); setSelConcl(null); setResult(null); setShowCounter(false)
  }, [])

  const canNext = (step === "premises" && selPrems.size > 0) || (step === "rule" && selRule !== null) || (step === "conclusion" && selConcl !== null)

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">論証ワークショップ</div>
          <div className="text-xs text-muted-foreground">{idx + 1} / {EXERCISES.length}</div>
        </div>
        <div className="space-y-2">
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary">{CATS[ex.category]}</span>
          <h3 className="text-base font-bold text-foreground">{ex.title}</h3>
          <p className="text-sm text-muted-foreground">{ex.context}</p>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {stepLabels.map((l, i) => (
            <div key={l} className="flex-1 space-y-1">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${i <= stepIdx ? "bg-primary" : "bg-border"}`} />
              <div className={`text-[10px] text-center ${i <= stepIdx ? "text-primary" : "text-muted-foreground"}`}>{l}</div>
            </div>
          ))}
        </div>

        {/* Premises */}
        {step === "premises" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">論証に使用する前提を選択してください（複数選択可）</p>
            <div className="space-y-2">
              {ex.premises.map((p) => {
                const sel = selPrems.has(p.id)
                return (
                  <button key={p.id} type="button" onClick={() => togglePrem(p.id)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 border cursor-pointer ${sel ? "bg-primary/10 border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span>{p.text}</span>
                      <span className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${sel ? "bg-primary border-primary" : "border-border"}`}>
                        {sel && <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Rule */}
        {step === "rule" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">推論規則を選択してください</p>
            <div className="space-y-2">
              {ex.rules.map((r) => (
                <button key={r.id} type="button" onClick={() => setSelRule(r.id)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 border cursor-pointer ${selRule === r.id ? "bg-primary/10 border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion */}
        {step === "conclusion" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">前提と推論規則から導かれる結論を選択してください</p>
            <div className="bg-secondary/50 rounded-md px-4 py-3 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground mb-2">選択した前提:</div>
              {ex.premises.filter((p) => selPrems.has(p.id)).map((p) => (
                <div key={p.id} className="text-xs text-foreground">{p.text}</div>
              ))}
              <div className="text-xs text-primary mt-2">推論規則: {ex.rules.find((r) => r.id === selRule)?.name}</div>
            </div>
            <div className="space-y-2">
              {ex.conclusions.map((c) => (
                <button key={c.id} type="button" onClick={() => setSelConcl(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 border cursor-pointer ${selConcl === c.id ? "bg-primary/10 border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && result !== null && (
          <div className="space-y-4">
            <div className="text-center py-3">
              <div className="text-3xl font-bold text-foreground">{result.total}</div>
              <div className="text-xs text-muted-foreground mt-1">論証強度スコア</div>
            </div>
            <div className="space-y-3">
              <Meter value={result.validity} label="論理的妥当性" />
              <Meter value={result.plausibility} label="前提の妥当性" />
              <Meter value={100 - result.vulnerability} label="反論耐性" />
            </div>
            <div className={`rounded-md px-4 py-3 text-sm ${result.total >= 70 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300" : result.total >= 40 ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"}`}>
              <p className="font-medium mb-1">{result.feedback}</p>
              {result.suggestions.length > 0 && (
                <ul className="space-y-1 mt-2">{result.suggestions.map((s) => <li key={s} className="text-xs opacity-90">- {s}</li>)}</ul>
              )}
            </div>
            <div className="bg-secondary/50 rounded-md px-4 py-3">
              <div className="text-xs font-semibold text-primary mb-1">模範的な論証構造:</div>
              <p className="text-sm text-foreground">{ex.ideal}</p>
            </div>
            <button type="button" onClick={() => setShowCounter((p) => !p)} className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">
              {showCounter ? "反論を閉じる" : "想定される反論を表示"}
            </button>
            {showCounter && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md px-4 py-3">
                <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">反論可能性:</div>
                <p className="text-sm text-red-800 dark:text-red-300">{ex.counter}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {step !== "premises" && step !== "result" ? (
            <button type="button" onClick={prevStep} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">← 戻る</button>
          ) : step === "result" ? (
            <button type="button" onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">やり直す</button>
          ) : <span />}
          {step !== "result" ? (
            <button type="button" onClick={nextStep} disabled={!canNext}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${canNext ? "bg-primary text-primary-foreground cursor-pointer hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
              {step === "conclusion" ? "評価する" : "次へ →"}
            </button>
          ) : idx < EXERCISES.length - 1 ? (
            <button type="button" onClick={nextEx} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer">次の演習へ</button>
          ) : <span className="text-xs text-muted-foreground">全演習完了</span>}
        </div>
      </div>
    </div>
  )
}
