"use client"

import { useState, useCallback } from "react"

interface BusinessExercise {
  readonly id: string
  readonly title: string
  readonly type: "decision-tree" | "risk-matrix" | "kpi-logic" | "swot-logic" | "incomplete-info"
  readonly scenario: string
  readonly premises: readonly string[]
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

const EXERCISES: readonly BusinessExercise[] = [
  {
    id: "dt-1",
    title: "意思決定ツリー分析",
    type: "decision-tree",
    scenario: "あるIT企業が新市場への参入を検討しています。",
    premises: [
      "前提1: 新市場の成長率が年20%以上なら参入すべきである",
      "前提2: 新市場の成長率は年25%である",
    ],
    question: "この論証から導かれる結論として正しいものはどれですか？",
    options: [
      "新市場に参入すべきである",
      "新市場に参入すべきではない",
      "成長率だけでは判断できない",
      "他の市場も検討すべきである",
    ],
    correctIndex: 0,
    explanation:
      "前提1（条件）と前提2（事実）から、肯定式（モーダスポネンス）により「参入すべき」が論理的に導かれます。ただし実務では前提1自体の妥当性も検証が必要です。",
  },
  {
    id: "rm-1",
    title: "リスク評価の論理",
    type: "risk-matrix",
    scenario:
      "プロジェクトマネージャーがリスク評価を行っています。リスクは「発生確率 × 影響度」で評価します。",
    premises: [
      "前提1: 発生確率が高く影響度が大きいリスクは最優先で対処すべきである",
      "前提2: サーバー障害の発生確率は高い",
      "前提3: サーバー障害の影響度は大きい",
    ],
    question: "論理的に正しい結論はどれですか？",
    options: [
      "サーバー障害は無視してよい",
      "サーバー障害は最優先で対処すべきである",
      "サーバー障害の確率を下げれば影響度は小さくなる",
      "他のリスクの方が重要である",
    ],
    correctIndex: 1,
    explanation:
      "三段論法により、前提1の条件（高確率かつ大影響）が前提2・3で満たされるため、「最優先で対処すべき」が結論として導かれます。選択肢3は確率と影響度の独立性を無視した誤りです。",
  },
  {
    id: "kpi-1",
    title: "KPI設計の論理関係",
    type: "kpi-logic",
    scenario:
      "ECサイトのKPI設計において、指標間の論理関係を分析します。",
    premises: [
      "前提1: 売上 = 訪問者数 × コンバージョン率 × 客単価",
      "前提2: 訪問者数が増加した",
      "前提3: コンバージョン率と客単価は変化していない",
    ],
    question: "論理的に確実に言えることはどれですか？",
    options: [
      "利益が増加した",
      "売上が増加した",
      "顧客満足度が向上した",
      "市場シェアが拡大した",
    ],
    correctIndex: 1,
    explanation:
      "前提1の等式と前提2・3から、訪問者数の増加は売上の増加を必然的に導きます。利益は売上だけでなくコストにも依存するため確実には言えません。顧客満足度や市場シェアは前提から導けません。",
  },
  {
    id: "swot-1",
    title: "SWOT分析の論理構造",
    type: "swot-logic",
    scenario:
      "飲食チェーンのSWOT分析で、次の情報が得られています。",
    premises: [
      "強み: 独自のレシピと高いブランド認知度",
      "機会: 健康志向の食品市場が拡大している",
      "弱み: デリバリー体制が未整備",
    ],
    question: "SWOT分析の論理として、「強み × 機会」から導かれる戦略はどれですか？",
    options: [
      "デリバリーサービスを開始する",
      "ブランド力を活かした健康メニューを開発する",
      "コスト削減のためレシピを簡略化する",
      "新規市場から撤退する",
    ],
    correctIndex: 1,
    explanation:
      "SWOT分析の「SO戦略」は強みを活かして機会を捉えるものです。独自レシピ（強み）と健康志向市場（機会）を組み合わせると、健康メニュー開発が論理的に導かれます。デリバリーは弱みの克服（WO戦略）に該当します。",
  },
  {
    id: "ii-1",
    title: "不完全情報下の意思決定",
    type: "incomplete-info",
    scenario:
      "新製品の発売を検討しています。市場調査の結果は以下の通りです。",
    premises: [
      "情報1: 調査対象の60%が「購入したい」と回答",
      "情報2: 調査対象は都市部の20代のみ（500人）",
      "情報3: 製品のターゲットは全年齢層・全地域",
    ],
    question: "この情報から論理的に正しい判断はどれですか？",
    options: [
      "60%が購入意向なので発売すべきである",
      "調査結果はターゲット全体を代表していないため、追加調査が必要",
      "20代に好評なので全年齢層にも受け入れられる",
      "500人の調査は十分なサンプルサイズである",
    ],
    correctIndex: 1,
    explanation:
      "情報2と情報3から、調査対象（都市部20代）はターゲット（全年齢層・全地域）の一部に過ぎません。標本の代表性が不足しているため、全体への一般化は論理的に妥当ではありません。これは「早まった一般化」の誤謬に該当します。",
  },
] as const

const TYPE_LABELS: Readonly<Record<BusinessExercise["type"], string>> = {
  "decision-tree": "意思決定ツリー",
  "risk-matrix": "リスク評価",
  "kpi-logic": "KPI論理",
  "swot-logic": "SWOT分析",
  "incomplete-info": "不完全情報",
}

export function BusinessLogicLab() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<readonly boolean[]>([])

  const exercise = EXERCISES[currentIndex]
  const isComplete = scores.length === EXERCISES.length

  const handleSelect = useCallback(
    (index: number) => {
      if (revealed) return
      setSelectedOption(index)
    },
    [revealed],
  )

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || revealed) return
    setRevealed(true)
    setScores((prev) => [...prev, selectedOption === exercise.correctIndex])
  }, [selectedOption, revealed, exercise.correctIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setRevealed(false)
    }
  }, [currentIndex])

  const handleReset = useCallback(() => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setRevealed(false)
    setScores([])
  }, [])

  const correctCount = scores.filter(Boolean).length

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            ビジネスロジック・ラボ
          </div>
          <div className="text-xs text-muted-foreground">
            {currentIndex + 1} / {EXERCISES.length}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {EXERCISES.map((ex, i) => (
            <div
              key={ex.id}
              className={`
                h-1.5 flex-1 rounded-full transition-all duration-300
                ${
                  i < scores.length
                    ? scores[i]
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-red-500 dark:bg-red-400"
                    : i === currentIndex
                      ? "bg-primary/50"
                      : "bg-border"
                }
              `}
            />
          ))}
        </div>

        {isComplete ? (
          <div className="text-center space-y-4 py-4">
            <div className="text-2xl font-bold text-foreground">
              {correctCount} / {EXERCISES.length} 正解
            </div>
            <p className="text-sm text-muted-foreground">
              {correctCount === EXERCISES.length
                ? "全問正解です！ビジネスにおける論理的思考を十分に理解しています。"
                : correctCount >= 3
                  ? "よくできました。間違えた問題を復習して、論理的な分析力をさらに高めましょう。"
                  : "ビジネスにおける論理構造をもう一度見直してみましょう。"}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
            >
              もう一度挑戦する
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Type badge + title */}
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary">
                {TYPE_LABELS[exercise.type]}
              </span>
              <h3 className="text-base font-bold text-foreground">
                {exercise.title}
              </h3>
            </div>

            {/* Scenario */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {exercise.scenario}
            </p>

            {/* Premises */}
            <div className="space-y-1.5 bg-secondary/50 rounded-md px-4 py-3">
              {exercise.premises.map((premise) => (
                <div
                  key={premise}
                  className="text-sm text-foreground font-mono leading-relaxed"
                >
                  {premise}
                </div>
              ))}
            </div>

            {/* Question */}
            <p className="text-sm font-medium text-foreground">
              {exercise.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {exercise.options.map((option, i) => {
                const isSelected = selectedOption === i
                const isCorrectOption = i === exercise.correctIndex
                const showCorrect = revealed && isCorrectOption
                const showWrong = revealed && isSelected && !isCorrectOption

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(i)}
                    disabled={revealed}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-md text-sm
                      transition-all duration-300 border
                      ${
                        showCorrect
                          ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                          : showWrong
                            ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                            : isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-background border-border hover:border-primary/50"
                      }
                      ${revealed ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Submit / Feedback */}
            {!revealed && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${
                    selectedOption !== null
                      ? "bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                回答する
              </button>
            )}

            {revealed && (
              <div
                className={`
                  rounded-md px-4 py-3 text-sm transition-all duration-300
                  ${
                    selectedOption === exercise.correctIndex
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300"
                      : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                  }
                `}
              >
                <p className="font-medium mb-1">
                  {selectedOption === exercise.correctIndex
                    ? "正解！"
                    : "不正解"}
                </p>
                <p className="text-sm opacity-90">{exercise.explanation}</p>
              </div>
            )}

            {revealed && currentIndex < EXERCISES.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
              >
                次の問題へ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
