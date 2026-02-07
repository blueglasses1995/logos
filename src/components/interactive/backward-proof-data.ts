export interface ProofNode {
  readonly id: string
  readonly label: string
  readonly rule?: string
  readonly children: readonly string[]
  readonly isGoal?: boolean
  readonly options?: readonly string[]
  readonly correctLabel?: string
}

export interface ProofExercise {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly conclusion: string
  readonly nodes: readonly ProofNode[]
  readonly explanation: string
}

export const BACKWARD_PROOF_EXERCISES: readonly ProofExercise[] = [
  {
    id: "bp-modus-ponens",
    title: "モーダスポネンス（逆方向）",
    description:
      "結論 Q を証明するために、必要な前提を逆方向に特定してください。",
    conclusion: "Q",
    nodes: [
      {
        id: "n1",
        label: "Q",
        rule: "モーダスポネンス",
        children: ["n2", "n3"],
        isGoal: true,
      },
      {
        id: "n2",
        label: "",
        children: [],
        options: ["P \u2192 Q", "Q \u2192 P", "P \u2227 Q", "\u00acP"],
        correctLabel: "P \u2192 Q",
      },
      {
        id: "n3",
        label: "",
        children: [],
        options: ["Q", "P", "\u00acP", "\u00acQ"],
        correctLabel: "P",
      },
    ],
    explanation:
      "Q を導くには、モーダスポネンス（MP）を使います。P \u2192 Q と P が前提として必要です。結論から逆に辿ると、「何があれば Q が出るか？」を考えることになります。",
  },
  {
    id: "bp-chain",
    title: "連鎖推論（逆方向）",
    description:
      "結論 C を証明するために、推論の連鎖を逆方向に構築してください。",
    conclusion: "C",
    nodes: [
      {
        id: "c1",
        label: "C",
        rule: "モーダスポネンス",
        children: ["c2", "c3"],
        isGoal: true,
      },
      {
        id: "c2",
        label: "",
        children: [],
        options: ["A \u2192 C", "B \u2192 C", "C \u2192 B", "A \u2227 C"],
        correctLabel: "B \u2192 C",
      },
      {
        id: "c3",
        label: "B",
        rule: "モーダスポネンス",
        children: ["c4", "c5"],
      },
      {
        id: "c4",
        label: "",
        children: [],
        options: ["B \u2192 A", "A \u2192 B", "A \u2228 B", "\u00acA"],
        correctLabel: "A \u2192 B",
      },
      {
        id: "c5",
        label: "",
        children: [],
        options: ["B", "C", "A", "\u00acA"],
        correctLabel: "A",
      },
    ],
    explanation:
      "C を導くには B \u2192 C と B が必要です。さらに B を導くには A \u2192 B と A が必要です。このように結論から前提へ逆方向に辿る手法を「ゴール指向推論」と呼びます。",
  },
  {
    id: "bp-disjunctive",
    title: "選言的三段論法（逆方向）",
    description:
      "結論 Q が導かれた根拠を、逆方向に特定してください。",
    conclusion: "Q",
    nodes: [
      {
        id: "d1",
        label: "Q",
        rule: "選言的三段論法",
        children: ["d2", "d3"],
        isGoal: true,
      },
      {
        id: "d2",
        label: "",
        children: [],
        options: [
          "P \u2228 Q",
          "P \u2227 Q",
          "P \u2192 Q",
          "\u00acP \u2228 \u00acQ",
        ],
        correctLabel: "P \u2228 Q",
      },
      {
        id: "d3",
        label: "",
        children: [],
        options: ["\u00acQ", "P", "\u00acP", "Q"],
        correctLabel: "\u00acP",
      },
    ],
    explanation:
      "選言的三段論法（DS）では、P \u2228 Q と \u00acP から Q を導きます。逆方向に考えると「Q を得るには、P \u2228 Q を知っていて、P でないことを示す」という2つのサブゴールに分解されます。",
  },
  {
    id: "bp-contradiction",
    title: "背理法（逆方向）",
    description:
      "\u00acP を証明するために、背理法の構造を逆方向に構築してください。",
    conclusion: "\u00acP",
    nodes: [
      {
        id: "r1",
        label: "\u00acP",
        rule: "背理法",
        children: ["r2"],
        isGoal: true,
      },
      {
        id: "r2",
        label: "矛盾 (\u22a5)",
        rule: "矛盾の導出",
        children: ["r3", "r4"],
      },
      {
        id: "r3",
        label: "",
        children: [],
        options: [
          "P（仮定）",
          "\u00acP（仮定）",
          "Q（仮定）",
          "P \u2192 Q",
        ],
        correctLabel: "P（仮定）",
      },
      {
        id: "r4",
        label: "",
        children: [],
        options: [
          "P から導かれる矛盾",
          "Q から導かれる矛盾",
          "\u00acP の証拠",
          "P の証拠",
        ],
        correctLabel: "P から導かれる矛盾",
      },
    ],
    explanation:
      "\u00acP を背理法で証明するには、P を仮定して矛盾を導きます。逆方向に見ると、ゴール \u00acP は「P を仮定したら矛盾が出る」というサブゴールに分解されます。",
  },
  {
    id: "bp-mixed",
    title: "複合推論（逆方向）",
    description:
      "結論 R を証明するために、複数の推論規則を組み合わせて逆方向に構築してください。",
    conclusion: "R",
    nodes: [
      {
        id: "m1",
        label: "R",
        rule: "モーダスポネンス",
        children: ["m2", "m3"],
        isGoal: true,
      },
      {
        id: "m2",
        label: "",
        children: [],
        options: ["Q \u2192 R", "P \u2192 R", "R \u2192 Q", "\u00acQ"],
        correctLabel: "Q \u2192 R",
      },
      {
        id: "m3",
        label: "Q",
        rule: "選言的三段論法",
        children: ["m4", "m5"],
      },
      {
        id: "m4",
        label: "",
        children: [],
        options: [
          "P \u2228 Q",
          "P \u2227 Q",
          "\u00acP \u2228 Q",
          "P \u2192 Q",
        ],
        correctLabel: "P \u2228 Q",
      },
      {
        id: "m5",
        label: "",
        children: [],
        options: ["\u00acQ", "P", "\u00acP", "Q"],
        correctLabel: "\u00acP",
      },
    ],
    explanation:
      "R のためには Q \u2192 R と Q が必要（MP）。Q のためには P \u2228 Q と \u00acP が必要（DS）。このように複数の規則を組み合わせた逆方向推論では、各ノードが独立したサブゴールになります。",
  },
]
