// --- Types ---

export type ProofLevel = 1 | 2 | 3

export interface ProofStepData {
  readonly id: string
  readonly content: string
  readonly rule: string
}

export interface StepSelectionExercise {
  readonly level: 1
  readonly id: string
  readonly title: string
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly options: readonly ProofStepData[]
  readonly correctStepIds: readonly string[]
  readonly explanation: string
}

export interface BlockArrangeExercise {
  readonly level: 2
  readonly id: string
  readonly title: string
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly blocks: readonly ProofStepData[]
  readonly correctOrder: readonly string[]
  readonly explanation: string
}

export interface StructureExercise {
  readonly level: 3
  readonly id: string
  readonly title: string
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly steps: readonly {
    readonly id: string
    readonly content: string
  }[]
  readonly ruleOptions: readonly string[]
  readonly correctAssignments: Readonly<Record<string, string>>
  readonly explanation: string
}

export type Exercise = StepSelectionExercise | BlockArrangeExercise | StructureExercise

// --- Built-in Exercises ---

export const EXERCISES: readonly Exercise[] = [
  {
    level: 1,
    id: "mp-select",
    title: "モーダスポネンス (Modus Ponens)",
    premises: ["P → Q", "P"],
    conclusion: "Q",
    options: [
      { id: "s1", content: "P → Q を前提とする", rule: "前提" },
      { id: "s2", content: "P を前提とする", rule: "前提" },
      { id: "s3", content: "P → Q と P より Q を導く", rule: "MP" },
      { id: "s4", content: "Q → P を導く", rule: "逆" },
      { id: "s5", content: "¬P を仮定する", rule: "背理法" },
    ],
    correctStepIds: ["s1", "s2", "s3"],
    explanation:
      "モーダスポネンス: P → Q と P が成り立つとき、Q を導けます。不要なステップ（逆、背理法）は含めません。",
  },
  {
    level: 1,
    id: "mt-select",
    title: "モーダストレンス (Modus Tollens)",
    premises: ["P → Q", "¬Q"],
    conclusion: "¬P",
    options: [
      { id: "s1", content: "P → Q を前提とする", rule: "前提" },
      { id: "s2", content: "¬Q を前提とする", rule: "前提" },
      { id: "s3", content: "P → Q と ¬Q より ¬P を導く", rule: "MT" },
      { id: "s4", content: "Q を仮定する", rule: "仮定" },
      { id: "s5", content: "P ∧ Q を導く", rule: "連言導入" },
    ],
    correctStepIds: ["s1", "s2", "s3"],
    explanation:
      "モーダストレンス: P → Q と ¬Q が成り立つとき、¬P を導けます。対偶を利用した推論規則です。",
  },
  {
    level: 2,
    id: "hs-arrange",
    title: "仮言三段論法 (Hypothetical Syllogism)",
    premises: ["P → Q", "Q → R"],
    conclusion: "P → R",
    blocks: [
      { id: "b1", content: "P → Q を前提とする", rule: "前提" },
      { id: "b2", content: "Q → R を前提とする", rule: "前提" },
      { id: "b3", content: "P を仮定する", rule: "仮定" },
      { id: "b4", content: "P → Q と P より Q を導く", rule: "MP" },
      { id: "b5", content: "Q → R と Q より R を導く", rule: "MP" },
      { id: "b6", content: "P → R を結論する", rule: "条件証明" },
    ],
    correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6"],
    explanation:
      "仮言三段論法: P → Q と Q → R から P → R を導きます。仮定 P のもとで MP を2回使い、条件証明で締めくくります。",
  },
  {
    level: 2,
    id: "ds-arrange",
    title: "選言三段論法 (Disjunctive Syllogism)",
    premises: ["P ∨ Q", "¬P"],
    conclusion: "Q",
    blocks: [
      { id: "b1", content: "P ∨ Q を前提とする", rule: "前提" },
      { id: "b2", content: "¬P を前提とする", rule: "前提" },
      { id: "b3", content: "P ∨ Q と ¬P より Q を導く", rule: "DS" },
    ],
    correctOrder: ["b1", "b2", "b3"],
    explanation:
      "選言三段論法: P ∨ Q と ¬P が成り立つとき、Q を導けます。選言の一方を否定すると他方が成立します。",
  },
  {
    level: 3,
    id: "raa-structure",
    title: "背理法 (Reductio ad Absurdum)",
    premises: ["P → Q", "P → ¬Q"],
    conclusion: "¬P",
    steps: [
      { id: "r1", content: "P → Q を前提とする" },
      { id: "r2", content: "P → ¬Q を前提とする" },
      { id: "r3", content: "P を仮定する" },
      { id: "r4", content: "P → Q と P より Q を導く" },
      { id: "r5", content: "P → ¬Q と P より ¬Q を導く" },
      { id: "r6", content: "Q ∧ ¬Q は矛盾" },
      { id: "r7", content: "仮定 P を否定して ¬P を結論する" },
    ],
    ruleOptions: ["前提", "仮定", "MP", "MT", "矛盾", "背理法"],
    correctAssignments: {
      r1: "前提",
      r2: "前提",
      r3: "仮定",
      r4: "MP",
      r5: "MP",
      r6: "矛盾",
      r7: "背理法",
    },
    explanation:
      "背理法: 結論の否定を仮定し、矛盾を導くことで結論を証明します。P を仮定すると Q と ¬Q が同時に成立し矛盾するため、¬P が結論されます。",
  },
]

export const LEVEL_LABELS: Readonly<Record<ProofLevel, string>> = {
  1: "ステップ選択",
  2: "ブロック組立",
  3: "構造指定",
}
