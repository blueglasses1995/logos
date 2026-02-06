// --- Quiz Types ---

export interface MultipleChoiceQuiz {
  readonly id: string
  readonly type: "multiple-choice"
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

export interface TruthTableQuiz {
  readonly id: string
  readonly type: "truth-table"
  readonly expression: string
  readonly variables: readonly string[]
  readonly expectedTable: readonly (readonly boolean[])[]
  readonly blanks: readonly number[]
}

// --- New Quiz Types ---

export interface PremiseCard {
  readonly id: string
  readonly label: string
  readonly rule: string
}

export interface ProofBuilderQuiz {
  readonly id: string
  readonly type: "proof-builder"
  readonly conclusion: string
  readonly availablePremises: readonly PremiseCard[]
  readonly correctOrder: readonly string[]
  readonly explanation: string
}

export type FallacyType =
  | "ad-hominem"
  | "straw-man"
  | "false-dilemma"
  | "slippery-slope"
  | "appeal-to-authority"
  | "appeal-to-emotion"
  | "appeal-to-popularity"
  | "begging-the-question"
  | "correlation-causation"

export interface FallacySpotterQuiz {
  readonly id: string
  readonly type: "fallacy-spotter"
  readonly passage: string
  readonly fallacyType: FallacyType
  readonly distractors: readonly FallacyType[]
  readonly explanation: string
}

export interface CounterexampleOption {
  readonly id: string
  readonly text: string
  readonly isValid: boolean
}

export interface CounterexampleQuiz {
  readonly id: string
  readonly type: "counterexample"
  readonly argument: string
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly vulnerablePremiseIndex: number
  readonly counterexamples: readonly CounterexampleOption[]
  readonly explanation: string
}

export interface ProofStep {
  readonly id: string
  readonly content: string
  readonly type: "given" | "gap" | "derived"
  readonly rule?: string
  readonly correctValue?: string
  readonly options?: readonly string[]
}

export interface GapFillProofQuiz {
  readonly id: string
  readonly type: "gap-fill-proof"
  readonly steps: readonly ProofStep[]
  readonly explanation: string
}

export type Quiz =
  | MultipleChoiceQuiz
  | TruthTableQuiz
  | ProofBuilderQuiz
  | FallacySpotterQuiz
  | CounterexampleQuiz
  | GapFillProofQuiz

// --- Chapter Types ---

export interface ChapterMeta {
  readonly slug: string
  readonly title: string
  readonly order: number
  readonly description: string
}
