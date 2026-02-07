"use client"

import { useState, useCallback, useMemo } from "react"
import {
  TOPICS,
  STEPS,
  INITIAL_STATE,
  loadDraft,
  saveDraft,
  createPremiseId,
} from "./essay-builder/types"
import type { EssayState, StepId } from "./essay-builder/types"
import {
  StepIndicator,
  TopicStep,
  PremisesStep,
  RuleStep,
  ConclusionStep,
  CounterStep,
  ReviewStep,
} from "./essay-builder/essay-steps"

interface LogicEssayBuilderProps {
  readonly caption?: string
}

export function LogicEssayBuilder({ caption }: LogicEssayBuilderProps) {
  const [state, setState] = useState<EssayState>(INITIAL_STATE)
  const [currentStep, setCurrentStep] = useState<StepId>("topic")
  const [saved, setSaved] = useState(false)

  const topic = useMemo(
    () => TOPICS.find((t) => t.id === state.topicId) ?? null,
    [state.topicId]
  )

  const handleSelectTopic = useCallback((topicId: string) => {
    const draft = loadDraft(topicId)
    if (draft) {
      setState(draft)
    } else {
      setState({ ...INITIAL_STATE, topicId })
    }
    setCurrentStep("premises")
    setSaved(false)
  }, [])

  const handleToggleSuggested = useCallback((text: string) => {
    setState((prev) => {
      const exists = prev.premises.find((p) => !p.isCustom && p.text === text)
      return exists
        ? { ...prev, premises: prev.premises.filter((p) => p.id !== exists.id) }
        : {
            ...prev,
            premises: [
              ...prev.premises,
              { id: createPremiseId(), text, isCustom: false },
            ],
          }
    })
    setSaved(false)
  }, [])

  const handleAddCustomPremise = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      premises: [
        ...prev.premises,
        { id: createPremiseId(), text, isCustom: true },
      ],
    }))
    setSaved(false)
  }, [])

  const handleRemoveCustomPremise = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      premises: prev.premises.filter((p) => p.id !== id),
    }))
    setSaved(false)
  }, [])

  const handleSelectRule = useCallback((rule: string) => {
    setState((prev) => ({ ...prev, selectedRule: rule }))
    setSaved(false)
  }, [])

  const handleConclusionChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, conclusion: value }))
    setSaved(false)
  }, [])

  const handleToggleCounter = useCallback((arg: string) => {
    setState((prev) => {
      const exists = prev.selectedCounterArgs.includes(arg)
      return {
        ...prev,
        selectedCounterArgs: exists
          ? prev.selectedCounterArgs.filter((a) => a !== arg)
          : [...prev.selectedCounterArgs, arg],
      }
    })
    setSaved(false)
  }, [])

  const handleCustomCounterChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, customCounterArg: value }))
    setSaved(false)
  }, [])

  const handleSave = useCallback(() => {
    saveDraft(state)
    setSaved(true)
  }, [state])

  const handleNext = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.id === currentStep)
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1].id)
    }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.id === currentStep)
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1].id)
    }
  }, [currentStep])

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "topic":
        return state.topicId !== null
      case "premises":
        return state.premises.length >= 2
      case "rule":
        return state.selectedRule !== null
      case "conclusion":
        return state.conclusion.trim().length > 0
      case "counter":
        return true
      case "review":
        return true
      default:
        return false
    }
  }, [currentStep, state])

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-5">
        {/* Header */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            論理エッセイビルダー
          </div>
          <p className="text-sm text-muted-foreground">
            構造化されたテンプレートを使って、論理的な議論を段階的に構築します。
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

        {/* Step content */}
        <div className="min-h-[200px]">
          {currentStep === "topic" && (
            <TopicStep
              topics={TOPICS}
              selectedId={state.topicId}
              onSelect={handleSelectTopic}
            />
          )}
          {currentStep === "premises" && topic && (
            <PremisesStep
              topic={topic}
              premises={state.premises}
              onToggleSuggested={handleToggleSuggested}
              onAddCustom={handleAddCustomPremise}
              onRemoveCustom={handleRemoveCustomPremise}
            />
          )}
          {currentStep === "rule" && topic && (
            <RuleStep
              topic={topic}
              selectedRule={state.selectedRule}
              onSelect={handleSelectRule}
            />
          )}
          {currentStep === "conclusion" && (
            <ConclusionStep
              conclusion={state.conclusion}
              onChange={handleConclusionChange}
            />
          )}
          {currentStep === "counter" && topic && (
            <CounterStep
              topic={topic}
              selectedCounterArgs={state.selectedCounterArgs}
              customCounterArg={state.customCounterArg}
              onToggleCounter={handleToggleCounter}
              onCustomChange={handleCustomCounterChange}
            />
          )}
          {currentStep === "review" && topic && (
            <ReviewStep state={state} topic={topic} />
          )}
          {!topic && currentStep !== "topic" && (
            <p className="text-sm text-muted-foreground">
              まずトピックを選択してください。
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            type="button"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            戻る
          </button>
          <div className="flex items-center gap-2">
            {state.topicId && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-all"
              >
                {saved ? "保存済み" : "下書き保存"}
              </button>
            )}
            {stepIndex < STEPS.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-opacity"
              >
                次へ
              </button>
            )}
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
