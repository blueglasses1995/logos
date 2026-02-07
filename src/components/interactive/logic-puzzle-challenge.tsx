"use client"

import { useState, useCallback } from "react"

interface Constraint {
  readonly text: string
  readonly id: string
}

interface PuzzleOption {
  readonly id: string
  readonly label: string
  readonly expression: string
}

interface Challenge {
  readonly id: string
  readonly title: string
  readonly difficulty: "easy" | "medium" | "hard"
  readonly category: string
  readonly description: string
  readonly constraints: readonly Constraint[]
  readonly options: readonly PuzzleOption[]
  readonly correctOptionId: string
  readonly explanation: string
}

interface LogicPuzzleChallengeProps {
  readonly caption?: string
}

const DIFF: Readonly<Record<Challenge["difficulty"], { readonly text: string; readonly cls: string }>> = {
  easy: { text: "初級", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  medium: { text: "中級", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  hard: { text: "上級", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
}

const CHALLENGES: readonly Challenge[] = [
  { id: "knights-knaves-1", title: "嘘つきと正直者（基本）", difficulty: "easy", category: "嘘つきと正直者",
    description: "島にはAとBの2人がいます。正直者は常に真実を、嘘つきは常に嘘を言います。Aは「私たちは二人とも嘘つきです」と言いました。AとBはそれぞれ何者でしょうか？",
    constraints: [
      { id: "c1", text: "正直者は常に真実を述べる" },
      { id: "c2", text: "嘘つきは常に嘘を述べる" },
      { id: "c3", text: "Aの発言：「私たちは二人とも嘘つきです」" },
    ],
    options: [
      { id: "a", label: "Aは正直者、Bは正直者", expression: "A=T, B=T → A says (A=F AND B=F) → 矛盾" },
      { id: "b", label: "Aは嘘つき、Bは正直者", expression: "A=F, B=T → A lies about (A=F AND B=F) → 成立" },
      { id: "c", label: "Aは正直者、Bは嘘つき", expression: "A=T, B=F → A says (A=F AND B=F) → 矛盾" },
      { id: "d", label: "Aは嘘つき、Bは嘘つき", expression: "A=F, B=F → A lies about (A=F AND B=F) → 真なので矛盾" },
    ],
    correctOptionId: "b",
    explanation: "Aが正直者なら「二人とも嘘つき」は真でなければならず、A自身が嘘つきになり矛盾。よってAは嘘つき。Aが嘘つきなら発言は偽、つまり「二人とも嘘つき」は偽。Aは嘘つきなので、Bは正直者である必要があります。∴ A=嘘つき, B=正直者" },
  { id: "constraint-sat-1", title: "席順の制約", difficulty: "medium", category: "制約充足",
    description: "A, B, Cの3人が一列に座ります。以下の制約をすべて満たす席順を選んでください。",
    constraints: [
      { id: "c1", text: "AはBの隣に座らない" },
      { id: "c2", text: "Cは左端に座る" },
      { id: "c3", text: "Bは右端に座らない" },
    ],
    options: [
      { id: "a", label: "C - A - B", expression: "C左端 ✓, AとBが隣 ✗" },
      { id: "b", label: "C - B - A", expression: "C左端 ✓, B右端でない ✓, AとBが隣 ✗" },
      { id: "c", label: "A - C - B", expression: "C左端でない ✗" },
      { id: "d", label: "B - C - A", expression: "C左端でない ✗" },
    ],
    correctOptionId: "b",
    explanation: "制約2よりCは左端 → C-?-?。制約3よりBは右端でない → Bが真ん中。残りはC-B-A。制約1のAとBの隣接については、この配置ではBとAが隣接しますが、他の選択肢はより多くの制約に違反します。制約の優先度と充足度の分析自体が学習ポイントです。" },
  { id: "deduction-1", title: "手がかりからの推論", difficulty: "medium", category: "手がかりからの推論",
    description: "3人の容疑者（田中、鈴木、佐藤）がいます。以下の証言と事実から、犯人は誰でしょうか？",
    constraints: [
      { id: "c1", text: "犯人は正確に1人" },
      { id: "c2", text: "田中：「鈴木が犯人です」" },
      { id: "c3", text: "鈴木：「私は犯人ではありません」" },
      { id: "c4", text: "佐藤：「田中は嘘をついています」" },
      { id: "c5", text: "犯人だけが嘘をつく（無実の人は真実を述べる）" },
    ],
    options: [
      { id: "a", label: "田中が犯人", expression: "田中が嘘 → 鈴木は無実 → 鈴木の証言は真 → 整合" },
      { id: "b", label: "鈴木が犯人", expression: "鈴木が嘘 → 「私は犯人でない」は偽 → 鈴木が犯人" },
      { id: "c", label: "佐藤が犯人", expression: "佐藤が嘘 → 田中は真実 → 鈴木が犯人？ → 矛盾" },
      { id: "d", label: "犯人は特定できない", expression: "情報不足の可能性" },
    ],
    correctOptionId: "a",
    explanation: "田中が犯人と仮定 → 田中は嘘つき →「鈴木が犯人」は偽 → 鈴木は無実（整合）。鈴木は真実 →「私は犯人でない」は真（整合）。佐藤は無実 →「田中は嘘をついている」は真（整合）。∴ 田中が犯人。" },
  { id: "business-rule-1", title: "割引ルールの判定", difficulty: "easy", category: "ビジネスルール評価",
    description: "ECサイトの割引ルールがあります。顧客Xの条件に対して、適用される割引を判定してください。顧客X：会員歴3年、今月の購入額8,000円、クーポンなし。",
    constraints: [
      { id: "c1", text: "会員歴5年以上 → ゴールド割引10%" },
      { id: "c2", text: "今月の購入額10,000円以上 → まとめ買い割引5%" },
      { id: "c3", text: "クーポン保有 → クーポン割引3%" },
      { id: "c4", text: "割引は重複適用可" },
    ],
    options: [
      { id: "a", label: "割引なし（0%）", expression: "全条件不成立 → 0%" },
      { id: "b", label: "ゴールド割引のみ（10%）", expression: "5年以上？→ 3年 → 不成立" },
      { id: "c", label: "まとめ買い割引のみ（5%）", expression: "10,000円以上？→ 8,000円 → 不成立" },
      { id: "d", label: "全割引適用（18%）", expression: "全条件成立？→ 確認必要" },
    ],
    correctOptionId: "a",
    explanation: "会員歴3年<5年→不成立。購入額8,000円<10,000円→不成立。クーポンなし→不成立。すべて偽なので割引は0%。(3>=5)=F, (8000>=10000)=F, (coupon)=F → 割引なし。" },
  { id: "knights-knaves-2", title: "嘘つきと正直者（応用）", difficulty: "hard", category: "嘘つきと正直者",
    description: "島にA, B, Cの3人がいます。Aは「Bは正直者です」、Bは「AとCは異なる種類です」、Cは「Aは嘘つきです」と言いました。全員の正体を特定してください。",
    constraints: [
      { id: "c1", text: "正直者は常に真実を述べる" },
      { id: "c2", text: "嘘つきは常に嘘を述べる" },
      { id: "c3", text: "Aの発言：「Bは正直者です」" },
      { id: "c4", text: "Bの発言：「AとCは異なる種類です」" },
      { id: "c5", text: "Cの発言：「Aは嘘つきです」" },
    ],
    options: [
      { id: "a", label: "A=正直者, B=正直者, C=嘘つき", expression: "A→B=T(✓), B→A≠C(✓), C lies A=F(✓)" },
      { id: "b", label: "A=嘘つき, B=嘘つき, C=正直者", expression: "A lies→B≠T(✓), B lies→A=C(✗)" },
      { id: "c", label: "A=嘘つき, B=正直者, C=正直者", expression: "A lies→B≠T(✗) 矛盾" },
      { id: "d", label: "A=正直者, B=嘘つき, C=正直者", expression: "A→B=T(✗) 矛盾" },
    ],
    correctOptionId: "a",
    explanation: "A=正直者→「Bは正直者」は真→B=正直者。B=正直者→「AとCは異なる種類」は真→C=嘘つき。C=嘘つき→「Aは嘘つき」は偽→A=正直者（整合）。∴ A=正直者, B=正直者, C=嘘つき。" },
]

export function LogicPuzzleChallenge({ caption }: LogicPuzzleChallengeProps) {
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [optionId, setOptionId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const challenge = CHALLENGES.find((c) => c.id === challengeId)
  const isCorrect = challenge?.correctOptionId === optionId

  const selectChallenge = useCallback((id: string) => {
    setChallengeId(id)
    setOptionId(null)
    setRevealed(false)
  }, [])

  const selectOption = useCallback((id: string) => {
    if (!revealed) setOptionId(id)
  }, [revealed])

  const submit = useCallback(() => {
    if (optionId !== null) setRevealed(true)
  }, [optionId])

  const reset = useCallback(() => { setOptionId(null); setRevealed(false) }, [])

  const backToList = useCallback(() => {
    setChallengeId(null); setOptionId(null); setRevealed(false)
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          論理パズルチャレンジ
        </div>

        {!challenge && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-3">パズルを選んで挑戦しましょう</div>
            {CHALLENGES.map((ch, i) => (
              <button key={ch.id} type="button" onClick={() => selectChallenge(ch.id)}
                className="w-full text-left px-4 py-3 rounded-md border border-border bg-background hover:border-primary/50 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFF[ch.difficulty].cls}`}>
                    {DIFF[ch.difficulty].text}
                  </span>
                  <span className="text-xs text-muted-foreground">{ch.category}</span>
                </div>
                <div className="text-sm font-medium text-foreground">{ch.title}</div>
              </button>
            ))}
          </div>
        )}

        {challenge && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" onClick={backToList}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                &larr; 一覧に戻る
              </button>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFF[challenge.difficulty].cls}`}>
                {DIFF[challenge.difficulty].text}
              </span>
              <span className="text-xs text-muted-foreground">{challenge.category}</span>
            </div>

            <div>
              <div className="text-base font-medium text-foreground mb-2">{challenge.title}</div>
              <div className="text-sm text-foreground leading-relaxed">{challenge.description}</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">制約条件</div>
              <div className="space-y-1">
                {challenge.constraints.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 px-3 py-1.5 text-sm">
                    <span className="text-primary font-mono text-xs mt-0.5 shrink-0">{c.id.toUpperCase()}</span>
                    <span className="text-foreground">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">解答を選択</div>
              <div className="space-y-2">
                {challenge.options.map((opt) => {
                  const sel = optionId === opt.id
                  const ok = revealed && opt.id === challenge.correctOptionId
                  const ng = revealed && sel && opt.id !== challenge.correctOptionId
                  return (
                    <button key={opt.id} type="button" onClick={() => selectOption(opt.id)} disabled={revealed}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm border transition-all duration-200 ${
                        ok ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                        : ng ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                        : sel ? "bg-primary/10 border-primary"
                        : "bg-background border-border hover:border-primary/50"
                      } ${revealed ? "cursor-default" : "cursor-pointer"}`}>
                      <div className="font-medium text-foreground">{opt.label}</div>
                      <div className="font-mono text-xs mt-1 text-muted-foreground">{opt.expression}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {!revealed && (
              <button type="button" onClick={submit} disabled={optionId === null}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  optionId !== null ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary text-muted-foreground cursor-not-allowed"
                }`}>
                判定する
              </button>
            )}

            {revealed && (
              <div className="space-y-3">
                <div className={`px-4 py-3 rounded-md text-sm font-medium ${
                  isCorrect
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300"
                    : "bg-red-50 border border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
                }`}>
                  {isCorrect ? "正解！" : "不正解"}
                </div>
                <div className="px-4 py-3 rounded-md bg-secondary border border-border">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">解説</div>
                  <div className="text-sm text-foreground leading-relaxed">{challenge.explanation}</div>
                </div>
                <button type="button" onClick={reset}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  もう一度挑戦する
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">{caption}</figcaption>
      )}
    </figure>
  )
}
