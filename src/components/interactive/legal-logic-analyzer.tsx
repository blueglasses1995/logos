"use client"

import { useState, useCallback } from "react"

interface LegalExercise {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly majorPremise: string
  readonly majorPremiseLabel: string
  readonly minorPremise: string
  readonly minorPremiseLabel: string
  readonly conclusionOptions: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
  readonly logicForm: string
}

interface LegalLogicAnalyzerProps {
  readonly caption?: string
}

const EXERCISES: readonly LegalExercise[] = [
  {
    id: "contract-capacity",
    title: "未成年者の契約取消し",
    category: "民法",
    majorPremise:
      "未成年者が法定代理人の同意を得ずにした法律行為は、取り消すことができる（民法5条2項）",
    majorPremiseLabel: "法律要件（大前提）",
    minorPremise: "Aは17歳（未成年者）であり、法定代理人の同意を得ずに高額な商品を購入した",
    minorPremiseLabel: "事実認定（小前提）",
    conclusionOptions: [
      "Aの購入契約は当然に無効である",
      "Aの購入契約は取り消すことができる",
      "Aの購入契約は法定代理人が追認しなければならない",
      "Aの購入契約には影響がない",
    ],
    correctIndex: 1,
    explanation:
      "民法5条2項により、未成年者が法定代理人の同意なく行った法律行為は「取り消すことができる」とされています。無効ではなく取消可能である点が重要です。三段論法として: 大前提（法規範）に小前提（事実）を当てはめ、結論（法律効果）を導出します。",
    logicForm: "∀x (未成年者(x) ∧ 無同意行為(x) → 取消可能(x))",
  },
  {
    id: "tax-income",
    title: "給与所得の課税",
    category: "税法",
    majorPremise:
      "居住者が支払を受ける給与等は、給与所得として所得税の課税対象となる（所得税法28条）",
    majorPremiseLabel: "法律要件（大前提）",
    minorPremise: "Bは日本居住者であり、会社から月額30万円の給与の支払を受けている",
    minorPremiseLabel: "事実認定（小前提）",
    conclusionOptions: [
      "Bの給与は非課税である",
      "Bの給与は事業所得として課税される",
      "Bの給与は給与所得として所得税の課税対象となる",
      "Bの給与は雑所得として課税される",
    ],
    correctIndex: 2,
    explanation:
      "所得税法28条に基づき、居住者が受ける給与は給与所得に分類されます。法的三段論法では、法規範（大前提）に事実（小前提）を当てはめて法律効果（結論）を導きます。Bは居住者であり給与を受けているため、給与所得として課税されます。",
    logicForm: "∀x (居住者(x) ∧ 給与受領(x) → 給与所得課税(x))",
  },
  {
    id: "tort-liability",
    title: "不法行為の損害賠償",
    category: "民法",
    majorPremise:
      "故意又は過失によって他人の権利又は法律上保護される利益を侵害した者は、これによって生じた損害を賠償する責任を負う（民法709条）",
    majorPremiseLabel: "法律要件（大前提）",
    minorPremise:
      "Cは不注意（過失）により交通事故を起こし、Dの車両を損壊させた",
    minorPremiseLabel: "事実認定（小前提）",
    conclusionOptions: [
      "CはDに対して損害賠償責任を負う",
      "Cは刑事罰のみを受ける",
      "DはCに対して損害賠償を請求できない",
      "Cの責任は保険会社に移転する",
    ],
    correctIndex: 0,
    explanation:
      "民法709条の不法行為の成立要件は、(1)故意・過失、(2)権利侵害、(3)損害の発生、(4)因果関係です。Cには過失があり、Dの財産権を侵害し、損害が発生しているため、CはDに対して損害賠償責任を負います。",
    logicForm:
      "∀x∀y (過失(x) ∧ 権利侵害(x,y) ∧ 損害(y) ∧ 因果関係(x,y) → 賠償責任(x,y))",
  },
  {
    id: "contract-formation",
    title: "契約の成立",
    category: "民法",
    majorPremise:
      "契約は、契約の内容を示してその締結を申し入れる意思表示に対して、相手方が承諾をしたときに成立する（民法522条1項）",
    majorPremiseLabel: "法律要件（大前提）",
    minorPremise:
      "EはFに対して土地の売買を申し込み、Fは当該申込みに対して承諾の意思表示をした",
    minorPremiseLabel: "事実認定（小前提）",
    conclusionOptions: [
      "契約は書面が作成されるまで成立しない",
      "契約は登記が完了した時点で成立する",
      "EとFの間で売買契約が成立する",
      "契約は第三者の承認を得て成立する",
    ],
    correctIndex: 2,
    explanation:
      "民法522条1項により、申込みと承諾の意思表示の合致により契約は成立します。売買契約は諾成契約であり、書面や登記は成立要件ではありません。法的三段論法の典型例として、要件を事実に当てはめ効果を導出します。",
    logicForm: "∀x∀y (申込み(x,y) ∧ 承諾(y,x) → 契約成立(x,y))",
  },
  {
    id: "lease-termination",
    title: "賃貸借契約の解除",
    category: "民法",
    majorPremise:
      "当事者の一方がその債務を履行しない場合において、相手方が相当の期間を定めてその履行の催告をし、その期間内に履行がないときは、相手方は契約の解除をすることができる（民法541条）",
    majorPremiseLabel: "法律要件（大前提）",
    minorPremise:
      "賃借人Gは3ヶ月間賃料を滞納し、賃貸人Hは相当期間を定めて催告したが、期間内に支払がなかった",
    minorPremiseLabel: "事実認定（小前提）",
    conclusionOptions: [
      "Hは直ちに強制退去させることができる",
      "Hは賃貸借契約を解除することができる",
      "Gの滞納は自動的に免除される",
      "HはGに対して追加の催告が必要である",
    ],
    correctIndex: 1,
    explanation:
      "民法541条により、債務不履行がある場合、相当期間を定めた催告の後に契約解除が可能です。Gは賃料支払義務を履行せず、Hは催告を行い期間内に履行がなかったため、解除の要件を満たします。ただし、解除と強制退去は別の法的手続きです。",
    logicForm:
      "∀x∀y (債務不履行(x) ∧ 催告(y,x) ∧ 期間内不履行(x) → 解除可能(y))",
  },
] as const

export function LegalLogicAnalyzer({ caption }: LegalLogicAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<ReadonlySet<number>>(
    new Set()
  )
  const [showLogicForm, setShowLogicForm] = useState(false)

  const exercise = EXERCISES[currentStep]
  const isCompleted = completedSteps.has(currentStep)
  const allCompleted = completedSteps.size === EXERCISES.length

  const handleSelect = useCallback(
    (index: number) => {
      if (isCompleted) return
      setSelectedIndex(index)
      if (index === exercise.correctIndex) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]))
      }
    },
    [isCompleted, exercise.correctIndex, currentStep]
  )

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < EXERCISES.length) {
        setCurrentStep(step)
        setSelectedIndex(null)
        setShowLogicForm(false)
      }
    },
    []
  )

  const toggleLogicForm = useCallback(() => {
    setShowLogicForm((prev) => !prev)
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            法的三段論法
          </span>
          <span className="text-xs text-muted-foreground">
            {completedSteps.size} / {EXERCISES.length} 完了
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-5">
          {EXERCISES.map((_, i) => (
            <button
              key={EXERCISES[i].id}
              type="button"
              onClick={() => goToStep(i)}
              aria-label={`問題 ${i + 1}: ${EXERCISES[i].title}`}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer
                ${
                  i === currentStep
                    ? "bg-primary scale-125"
                    : completedSteps.has(i)
                      ? "bg-emerald-500"
                      : "bg-border"
                }
              `}
            />
          ))}
        </div>

        {/* Exercise header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-foreground">
            {exercise.title}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {exercise.category}
          </span>
        </div>

        {/* Syllogism structure */}
        <div className="space-y-3 mb-5">
          {/* Major premise */}
          <div className="border border-border rounded-md overflow-hidden">
            <div className="px-4 py-1.5 bg-primary/5 border-b border-border">
              <span className="text-xs font-semibold text-primary">
                {exercise.majorPremiseLabel}
              </span>
            </div>
            <div className="px-4 py-3">
              <div className="text-sm text-foreground leading-relaxed">
                {exercise.majorPremise}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <span className="text-muted-foreground text-lg">+</span>
          </div>

          {/* Minor premise */}
          <div className="border border-border rounded-md overflow-hidden">
            <div className="px-4 py-1.5 bg-emerald-500/5 border-b border-border">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {exercise.minorPremiseLabel}
              </span>
            </div>
            <div className="px-4 py-3">
              <div className="text-sm text-foreground leading-relaxed">
                {exercise.minorPremise}
              </div>
            </div>
          </div>

          {/* Arrow to conclusion */}
          <div className="flex justify-center">
            <span className="text-muted-foreground text-lg">↓</span>
          </div>

          {/* Conclusion selection */}
          <div className="border border-border rounded-md overflow-hidden">
            <div className="px-4 py-1.5 bg-background border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground">
                結論（法律効果）-- 正しいものを選んでください
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              {exercise.conclusionOptions.map((option, i) => {
                const isSelected = selectedIndex === i
                const showCorrect = isCompleted && i === exercise.correctIndex
                const showWrong =
                  isSelected && selectedIndex !== exercise.correctIndex

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(i)}
                    disabled={isCompleted}
                    className={`
                      w-full text-left px-4 py-2 rounded-md text-sm
                      transition-all duration-200 border
                      ${
                        showCorrect
                          ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                          : showWrong
                            ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                            : isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-background border-border hover:border-primary/50"
                      }
                      ${isCompleted ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Wrong answer feedback */}
        {selectedIndex !== null &&
          selectedIndex !== exercise.correctIndex &&
          !isCompleted && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400">
              不正解 -- 法律要件と事実を照らし合わせて考えてみましょう
            </div>
          )}

        {/* Correct answer explanation */}
        {isCompleted && (
          <div className="mb-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-4 py-3">
            {exercise.explanation}
          </div>
        )}

        {/* Logic form toggle */}
        {isCompleted && (
          <div className="mb-4">
            <button
              type="button"
              onClick={toggleLogicForm}
              className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {showLogicForm ? "論理式を閉じる" : "論理式で表示"}
            </button>
            {showLogicForm && (
              <div className="mt-2 px-4 py-2 rounded-md bg-background/50 border border-border/50">
                <code className="text-sm font-mono text-foreground">
                  {exercise.logicForm}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
          >
            ← 前の問題
          </button>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} / {EXERCISES.length}
          </span>
          <button
            type="button"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === EXERCISES.length - 1}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
          >
            次の問題 →
          </button>
        </div>

        {/* All complete message */}
        {allCompleted && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              全問正解です！法的三段論法の基本構造を理解できました。
            </div>
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
