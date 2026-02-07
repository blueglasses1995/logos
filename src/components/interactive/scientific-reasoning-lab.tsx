"use client"

import { useState, useCallback } from "react"

interface ScienceExercise {
  readonly id: string
  readonly title: string
  readonly type:
    | "correlation-causation"
    | "confounding"
    | "experimental-design"
    | "necessary-sufficient"
    | "mills-methods"
  readonly scenario: string
  readonly details: readonly string[]
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

const EXERCISES: readonly ScienceExercise[] = [
  {
    id: "cc-1",
    title: "相関と因果の区別",
    type: "correlation-causation",
    scenario:
      "ある研究で、アイスクリームの売上と水難事故の件数に強い正の相関が見つかりました。",
    details: [
      "観察: アイスクリームの売上が増えると水難事故も増える（r = 0.85）",
      "仮説H: アイスクリームの消費が水難事故を引き起こす",
    ],
    question: "この仮説について論理的に正しい評価はどれですか？",
    options: [
      "相関が強いので因果関係があると結論できる",
      "第三の変数（気温）が両方に影響する疑似相関の可能性がある",
      "r = 0.85 は因果関係の証明に十分である",
      "逆因果（水難事故がアイスクリーム消費を増やす）が正しい",
    ],
    correctIndex: 1,
    explanation:
      "相関関係は因果関係を意味しません（cum hoc ergo propter hoc の誤謬）。気温という交絡変数が、アイスクリーム売上と水難事故の両方を増加させている疑似相関です。因果を主張するには、交絡変数を統制した実験が必要です。",
  },
  {
    id: "cv-1",
    title: "交絡変数の特定",
    type: "confounding",
    scenario:
      "ある製薬会社が新薬の臨床試験を行いました。",
    details: [
      "実験群（新薬投与）: 若い患者が多く、回復率80%",
      "対照群（プラセボ）: 高齢患者が多く、回復率50%",
      "結論: 新薬は回復率を30%改善する",
    ],
    question: "この実験設計の論理的な問題点はどれですか？",
    options: [
      "サンプルサイズが不十分である",
      "プラセボ効果が考慮されていない",
      "年齢が交絡変数として統制されていない（シンプソンのパラドックス）",
      "二重盲検法が使われていない",
    ],
    correctIndex: 2,
    explanation:
      "実験群と対照群で年齢構成が異なるため、回復率の差が新薬の効果なのか年齢の影響なのか区別できません。これはシンプソンのパラドックスの典型例です。無作為割付（ランダム化）により交絡変数を統制する必要があります。",
  },
  {
    id: "ed-1",
    title: "実験設計の論理的欠陥",
    type: "experimental-design",
    scenario:
      "ある教育研究者が新しい学習法の効果を検証しています。",
    details: [
      "方法: A高校で新学習法を導入し、B高校では従来の方法を継続",
      "結果: A高校の平均点が10点上昇、B高校は変化なし",
      "結論: 新学習法は学力を向上させる",
    ],
    question: "この実験の論理的欠陥として最も重要なものはどれですか？",
    options: [
      "被験者数が少なすぎる",
      "学校間の差異（教員の質、生徒の学力水準）が統制されていない",
      "テストの難易度が異なる可能性がある",
      "学習期間が短すぎる",
    ],
    correctIndex: 1,
    explanation:
      "異なる学校間の比較では、教員の質・生徒の初期学力・学校環境など多くの変数が統制されていません。論理的には「新学習法の効果」と「学校間の元々の差異」を区別できません。同一校内でのランダム化比較試験が必要です。",
  },
  {
    id: "ns-1",
    title: "必要条件と十分条件",
    type: "necessary-sufficient",
    scenario:
      "感染症の研究で以下のことが判明しました。",
    details: [
      "事実1: ウイルスXに感染した全員が発症するわけではない",
      "事実2: 発症した患者全員からウイルスXが検出される",
      "事実3: ウイルスXに感染していない人は発症しない",
    ],
    question: "ウイルスXの感染は発症にとって何ですか？",
    options: [
      "十分条件である（感染すれば必ず発症する）",
      "必要条件である（発症には感染が必要だが、感染だけでは不十分）",
      "必要十分条件である（感染と発症は同値）",
      "必要条件でも十分条件でもない",
    ],
    correctIndex: 1,
    explanation:
      "事実2・3から「発症 → 感染」が成り立ち、感染は発症の必要条件です。しかし事実1から「感染 → 発症」は成り立たないため、十分条件ではありません。論理式では：発症するならばウイルスXに感染している（必要条件）が、感染しても必ずしも発症しない（十分条件ではない）。",
  },
  {
    id: "mm-1",
    title: "ミルの方法（一致法と差異法）",
    type: "mills-methods",
    scenario:
      "食中毒の原因を調査しています。4人がレストランで食事をしました。",
    details: [
      "Aさん: サラダ・スープ・ステーキ → 発症",
      "Bさん: サラダ・パスタ・デザート → 発症",
      "Cさん: スープ・ステーキ・デザート → 発症なし",
      "Dさん: サラダ・ステーキ・デザート → 発症",
    ],
    question: "ミルの一致法を適用すると、食中毒の原因として最も疑わしい食品はどれですか？",
    options: ["スープ", "ステーキ", "サラダ", "デザート"],
    correctIndex: 2,
    explanation:
      "ミルの一致法では、結果（発症）が生じた全事例に共通する要因を探します。発症したA・B・Dの全員がサラダを食べています。さらに差異法の観点から、発症しなかったCだけがサラダを食べていません。よってサラダが原因として最も疑わしいと論理的に推論できます。",
  },
] as const

const TYPE_LABELS: Readonly<Record<ScienceExercise["type"], string>> = {
  "correlation-causation": "相関と因果",
  confounding: "交絡変数",
  "experimental-design": "実験設計",
  "necessary-sufficient": "必要十分条件",
  "mills-methods": "ミルの方法",
}

const TYPE_ICONS: Readonly<Record<ScienceExercise["type"], string>> = {
  "correlation-causation": "~",
  confounding: "?",
  "experimental-design": "!",
  "necessary-sufficient": "↔",
  "mills-methods": "∴",
}

export function ScientificReasoningLab() {
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
            科学推論ラボ
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
                ? "全問正解です！科学的推論の基礎を十分に理解しています。"
                : correctCount >= 3
                  ? "よくできました。因果推論と実験設計の考え方をさらに深めましょう。"
                  : "科学的推論の基本に立ち返り、もう一度挑戦してみましょう。"}
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
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary">
                <span className="font-mono">{TYPE_ICONS[exercise.type]}</span>
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

            {/* Details / Evidence */}
            <div className="space-y-1.5 bg-secondary/50 rounded-md px-4 py-3">
              {exercise.details.map((detail) => (
                <div
                  key={detail}
                  className="text-sm text-foreground font-mono leading-relaxed"
                >
                  {detail}
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

            {/* Submit */}
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

            {/* Feedback */}
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
