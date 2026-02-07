"use client"

import { useState, useCallback, useEffect } from "react"
import {
  type Project,
  type StepTask,
  type StepState,
  type ProjectState,
  PROJECTS,
  loadProjectState,
  saveProjectState,
} from "./integration-project-data"

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({
  steps,
  currentStep,
  stepStates,
}: {
  readonly steps: readonly StepTask[]
  readonly currentStep: number
  readonly stepStates: ProjectState
}) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((step, i) => {
        const state = stepStates[i]
        const isCurrent = i === currentStep
        const completed = state?.completed ?? false
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                transition-all duration-300 border-2
                ${
                  completed
                    ? "bg-truth/20 border-truth text-truth"
                    : isCurrent
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-muted border-border text-muted-foreground"
                }
              `}
            >
              {completed ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  completed ? "bg-truth/50" : "bg-border"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepView({
  step,
  state,
  onSelect,
}: {
  readonly step: StepTask
  readonly state: StepState
  readonly onSelect: (index: number) => void
}) {
  const [showHint, setShowHint] = useState(false)

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">
        参照: {step.chapterRef}
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-4">
        {step.instruction}
      </p>

      <div className="space-y-2 mb-4">
        {step.options.map((option, i) => {
          const isSelected = state.selectedIndex === i
          const isCorrect = i === step.correctIndex
          const showCorrectStyle = state.completed && isCorrect
          const showWrongStyle = isSelected && !state.completed && !isCorrect

          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (!state.completed) onSelect(i)
              }}
              disabled={state.completed}
              className={`
                w-full text-left px-4 py-2.5 rounded-md text-sm font-mono
                transition-all duration-200 border
                ${
                  showCorrectStyle
                    ? "bg-truth/10 border-truth text-truth"
                    : showWrongStyle
                      ? "bg-falsehood/10 border-falsehood text-falsehood"
                      : isSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-background border-border hover:border-primary/50"
                }
                ${state.completed ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {option}
            </button>
          )
        })}
      </div>

      {!state.completed && state.attempts > 0 && (
        <div className="text-sm text-falsehood mb-3">
          不正解 — もう一度考えてみましょう（試行回数: {state.attempts}）
        </div>
      )}

      {!state.completed && !showHint && state.attempts >= 1 && (
        <button
          type="button"
          onClick={() => setShowHint(true)}
          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors mb-3"
        >
          ヒントを見る
        </button>
      )}

      {!state.completed && showHint && (
        <div className="text-sm bg-primary/5 border border-primary/20 rounded-md px-4 py-3 mb-3 text-foreground">
          {step.hint}
        </div>
      )}

      {state.completed && (
        <div className="text-sm bg-truth/5 border border-truth/30 rounded-md px-4 py-3 text-truth">
          {step.successMessage}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Project selection                                                  */
/* ------------------------------------------------------------------ */

function ProjectSelector({
  onSelect,
}: {
  readonly onSelect: (id: string) => void
}) {
  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          統合プロジェクト
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          複数章の知識を組み合わせて、実践的な論理分析に挑戦しましょう。
        </p>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {PROJECTS.map((p) => {
            const saved = loadProjectState(p.id)
            const completed =
              saved &&
              saved.length === p.steps.length &&
              saved.every((s) => s.completed)
            const inProgress =
              saved &&
              saved.length === p.steps.length &&
              saved.some((s) => s.completed) &&
              !completed
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className="text-left border border-border rounded-lg p-4 bg-background hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {p.title}
                  </h3>
                  {completed && (
                    <span className="text-xs bg-truth/10 text-truth px-2 py-0.5 rounded-full">
                      完了
                    </span>
                  )}
                  {inProgress && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      進行中
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {p.steps.length} ステップ
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Project detail                                                     */
/* ------------------------------------------------------------------ */

function ProjectDetail({
  project,
  onBack,
}: {
  readonly project: Project
  readonly onBack: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStates, setStepStates] = useState<ProjectState>([])

  useEffect(() => {
    const saved = loadProjectState(project.id)
    if (saved && saved.length === project.steps.length) {
      setStepStates(saved)
      const firstIncomplete = saved.findIndex((s) => !s.completed)
      setCurrentStep(
        firstIncomplete === -1 ? project.steps.length - 1 : firstIncomplete
      )
    } else {
      const initial: ProjectState = project.steps.map(() => ({
        selectedIndex: null,
        completed: false,
        attempts: 0,
      }))
      setStepStates(initial)
      setCurrentStep(0)
    }
  }, [project])

  const handleSelect = useCallback(
    (optionIndex: number) => {
      const step = project.steps[currentStep]
      if (!step) return
      const current = stepStates[currentStep]
      if (!current || current.completed) return

      const isCorrect = optionIndex === step.correctIndex
      const updated: StepState = {
        selectedIndex: optionIndex,
        completed: isCorrect,
        attempts: current.attempts + 1,
      }
      const newStates: ProjectState = stepStates.map((s, i) =>
        i === currentStep ? updated : s
      )
      setStepStates(newStates)
      saveProjectState(project.id, newStates)
    },
    [project, currentStep, stepStates]
  )

  const handleNextStep = useCallback(() => {
    if (currentStep < project.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [project.steps.length, currentStep])

  const handleReset = useCallback(() => {
    const initial: ProjectState = project.steps.map(() => ({
      selectedIndex: null,
      completed: false,
      attempts: 0,
    }))
    setStepStates(initial)
    setCurrentStep(0)
    saveProjectState(project.id, initial)
  }, [project])

  const allCompleted =
    stepStates.length > 0 && stepStates.every((s) => s.completed)
  const currentStepData = project.steps[currentStep]
  const currentStepState = stepStates[currentStep]

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            統合プロジェクト
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← プロジェクト一覧
          </button>
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {project.title}
        </h2>

        <div className="bg-muted/50 border border-border rounded-md px-4 py-3 mb-5 text-sm text-foreground leading-relaxed">
          <span className="text-xs font-semibold text-muted-foreground block mb-1">
            シナリオ
          </span>
          {project.scenario}
        </div>

        <StepIndicator
          steps={project.steps}
          currentStep={currentStep}
          stepStates={stepStates}
        />

        {currentStepData && currentStepState && (
          <div className="border border-border rounded-md bg-background/60 px-5 py-4">
            <div className="text-xs font-semibold text-primary mb-3">
              ステップ {currentStep + 1} / {project.steps.length}
            </div>
            <StepView
              step={currentStepData}
              state={currentStepState}
              onSelect={handleSelect}
            />
            {currentStepState.completed &&
              currentStep < project.steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  次のステップへ →
                </button>
              )}
          </div>
        )}

        {allCompleted && (
          <div className="mt-5 border border-truth/30 bg-truth/5 rounded-md px-5 py-4 text-center">
            <div className="text-lg font-semibold text-truth mb-1">
              プロジェクト完了！
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              すべてのステップを正しく完了しました。複数章の知識を統合して活用できています。
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
            >
              もう一度挑戦する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function IntegrationProject() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  )
  const project = PROJECTS.find((p) => p.id === selectedProjectId) ?? null

  if (!project) {
    return <ProjectSelector onSelect={setSelectedProjectId} />
  }

  return (
    <ProjectDetail
      project={project}
      onBack={() => setSelectedProjectId(null)}
    />
  )
}
