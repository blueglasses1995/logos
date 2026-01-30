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

export type Quiz = MultipleChoiceQuiz | TruthTableQuiz

// --- Chapter Types ---

export interface ChapterMeta {
  readonly slug: string
  readonly title: string
  readonly order: number
  readonly description: string
}
