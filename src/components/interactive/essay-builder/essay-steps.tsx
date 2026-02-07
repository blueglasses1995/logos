"use client"

import { useState } from "react"
import type { EssayTopic, EssayState, Premise, StepId } from "./types"
import { STEPS } from "./types"

// --- Step Indicator ---

export function StepIndicator({
  currentStep,
  onStepClick,
}: {
  readonly currentStep: StepId
  readonly onStepClick: (step: StepId) => void
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {STEPS.map((step, i) => {
        const isActive = step.id === currentStep
        const isPast = i < currentIndex
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick(step.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-colors whitespace-nowrap cursor-pointer
              ${isActive ? "bg-primary text-primary-foreground" : ""}
              ${isPast ? "bg-primary/10 text-primary" : ""}
              ${!isActive && !isPast ? "bg-muted text-muted-foreground" : ""}
            `}
          >
            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] tabular-nums">
              {i + 1}
            </span>
            {step.label}
          </button>
        )
      })}
    </div>
  )
}

// --- Topic Step ---

export function TopicStep({
  topics,
  selectedId,
  onSelect,
}: {
  readonly topics: readonly EssayTopic[]
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        論証を構築するトピックを選択してください。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.id)}
            className={`
              text-left border rounded-xl p-4 transition-all cursor-pointer
              ${
                selectedId === topic.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }
            `}
          >
            <div className="text-sm font-semibold text-foreground">
              {topic.title}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {topic.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// --- Premises Step ---

export function PremisesStep({
  topic,
  premises,
  onToggleSuggested,
  onAddCustom,
  onRemoveCustom,
}: {
  readonly topic: EssayTopic
  readonly premises: readonly Premise[]
  readonly onToggleSuggested: (text: string) => void
  readonly onAddCustom: (text: string) => void
  readonly onRemoveCustom: (id: string) => void
}) {
  const [customInput, setCustomInput] = useState("")

  const handleAddCustom = () => {
    const trimmed = customInput.trim()
    if (trimmed.length === 0) return
    onAddCustom(trimmed)
    setCustomInput("")
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        論証の前提を選択・追加してください。少なくとも2つの前提を設定しましょう。
      </p>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          候補の前提
        </div>
        {topic.suggestedPremises.map((sp) => {
          const isSelected = premises.some((p) => !p.isCustom && p.text === sp)
          return (
            <button
              key={sp}
              type="button"
              onClick={() => onToggleSuggested(sp)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer
                ${
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }
              `}
            >
              <span className="mr-2">{isSelected ? "✓" : "○"}</span>
              {sp}
            </button>
          )
        })}
      </div>

      {premises.filter((p) => p.isCustom).length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            追加した前提
          </div>
          {premises
            .filter((p) => p.isCustom)
            .map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary bg-primary/5 text-sm"
              >
                <span className="flex-1 text-foreground">{p.text}</span>
                <button
                  type="button"
                  onClick={() => onRemoveCustom(p.id)}
                  className="text-muted-foreground hover:text-falsehood transition-colors cursor-pointer text-xs"
                  aria-label="前提を削除"
                >
                  削除
                </button>
              </div>
            ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddCustom()
          }}
          placeholder="独自の前提を追加..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={customInput.trim().length === 0}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-opacity"
        >
          追加
        </button>
      </div>
    </div>
  )
}

// --- Rule Step ---

export function RuleStep({
  topic,
  selectedRule,
  onSelect,
}: {
  readonly topic: EssayTopic
  readonly selectedRule: string | null
  readonly onSelect: (rule: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        前提から結論を導く際に使用する推論規則を選択してください。
      </p>
      <div className="space-y-2">
        {topic.inferenceRules.map((rule) => (
          <button
            key={rule}
            type="button"
            onClick={() => onSelect(rule)}
            className={`
              w-full text-left px-4 py-3 rounded-lg border text-sm font-mono transition-all cursor-pointer
              ${
                selectedRule === rule
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }
            `}
          >
            <span className="mr-2">{selectedRule === rule ? "●" : "○"}</span>
            {rule}
          </button>
        ))}
      </div>
    </div>
  )
}

// --- Conclusion Step ---

export function ConclusionStep({
  conclusion,
  onChange,
}: {
  readonly conclusion: string
  readonly onChange: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        選択した前提と推論規則に基づいて、導き出される結論を記述してください。
      </p>
      <textarea
        value={conclusion}
        onChange={(e) => onChange(e.target.value)}
        placeholder="したがって、..."
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
      />
    </div>
  )
}

// --- Counter Step ---

export function CounterStep({
  topic,
  selectedCounterArgs,
  customCounterArg,
  onToggleCounter,
  onCustomChange,
}: {
  readonly topic: EssayTopic
  readonly selectedCounterArgs: readonly string[]
  readonly customCounterArg: string
  readonly onToggleCounter: (arg: string) => void
  readonly onCustomChange: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        自分の論証に対する反論を検討することで、議論を強化します。
      </p>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          想定される反論
        </div>
        {topic.counterArguments.map((ca) => {
          const isSelected = selectedCounterArgs.includes(ca)
          return (
            <button
              key={ca}
              type="button"
              onClick={() => onToggleCounter(ca)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer
                ${
                  isSelected
                    ? "border-falsehood bg-falsehood/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-falsehood/40"
                }
              `}
            >
              <span className="mr-2">{isSelected ? "✓" : "○"}</span>
              {ca}
            </button>
          )
        })}
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          独自の反論
        </div>
        <textarea
          value={customCounterArg}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="他に考えられる反論があれば記述..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
        />
      </div>
    </div>
  )
}

// --- Review Step ---

export function ReviewStep({
  state,
  topic,
}: {
  readonly state: EssayState
  readonly topic: EssayTopic
}) {
  const allCounterArgs = [
    ...state.selectedCounterArgs,
    ...(state.customCounterArg.trim() ? [state.customCounterArg.trim()] : []),
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        構築した論証の全体像を確認してください。
      </p>

      <div className="border border-border rounded-xl p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          論題
        </div>
        <div className="text-sm font-semibold text-foreground">{topic.title}</div>
      </div>

      <div className="border border-primary/30 rounded-xl p-4 bg-primary/5 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          論理構造
        </div>

        <div className="space-y-1">
          {state.premises.map((p, i) => (
            <div key={p.id} className="text-sm text-foreground font-mono">
              <span className="text-primary mr-2">P{i + 1}.</span>
              {p.text}
            </div>
          ))}
        </div>

        {state.selectedRule && (
          <div className="text-sm text-muted-foreground font-mono border-t border-primary/20 pt-2">
            <span className="text-primary mr-2">規則:</span>
            {state.selectedRule}
          </div>
        )}

        {state.conclusion.trim() && (
          <div className="text-sm font-semibold text-foreground font-mono border-t border-primary/20 pt-2">
            <span className="text-primary mr-2">∴</span>
            {state.conclusion}
          </div>
        )}
      </div>

      {allCounterArgs.length > 0 && (
        <div className="border border-falsehood/30 rounded-xl p-4 bg-falsehood/5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-falsehood">
            検討した反論
          </div>
          {allCounterArgs.map((ca) => (
            <div key={ca} className="text-sm text-foreground">
              <span className="text-falsehood mr-2">-</span>
              {ca}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
