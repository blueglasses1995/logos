export interface Premise {
  readonly id: string
  readonly text: string
  readonly isCustom: boolean
}

export interface EssayTopic {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly suggestedPremises: readonly string[]
  readonly inferenceRules: readonly string[]
  readonly counterArguments: readonly string[]
}

export interface EssayState {
  readonly topicId: string | null
  readonly premises: readonly Premise[]
  readonly selectedRule: string | null
  readonly conclusion: string
  readonly selectedCounterArgs: readonly string[]
  readonly customCounterArg: string
}

export type StepId =
  | "topic"
  | "premises"
  | "rule"
  | "conclusion"
  | "counter"
  | "review"

export const STEPS: readonly { readonly id: StepId; readonly label: string }[] = [
  { id: "topic", label: "トピック選択" },
  { id: "premises", label: "前提の設定" },
  { id: "rule", label: "推論規則の選択" },
  { id: "conclusion", label: "結論の導出" },
  { id: "counter", label: "反論の検討" },
  { id: "review", label: "最終論証" },
]

export const INITIAL_STATE: EssayState = {
  topicId: null,
  premises: [],
  selectedRule: null,
  conclusion: "",
  selectedCounterArgs: [],
  customCounterArg: "",
}

export const TOPICS: readonly EssayTopic[] = [
  {
    id: "remote-work",
    title: "リモートワークは生産性を向上させるか",
    description:
      "テクノロジーと働き方の変化が生産性に与える影響を論理的に分析する",
    suggestedPremises: [
      "通勤時間の削減により、労働者は平均1-2時間の追加時間を得る",
      "自宅環境では集中を妨げる要因（同僚の会話、会議の中断）が少ない",
      "リモートワークは対面でのコミュニケーション機会を減少させる",
      "デジタルツールにより非同期コミュニケーションが可能になった",
      "自己管理能力には個人差が大きい",
    ],
    inferenceRules: [
      "モーダス・ポネンス（P→Q, P ∴ Q）",
      "仮説演繹法（仮説→予測、予測を検証）",
      "帰納的一般化（複数の事例→一般的結論）",
      "類推（類似事例からの推論）",
    ],
    counterArguments: [
      "孤立感やチームの一体感の低下が長期的な生産性を下げる可能性",
      "すべての職種がリモートワークに適しているわけではない",
      "自宅環境が仕事に適していない労働者も多い",
    ],
  },
  {
    id: "ai-education",
    title: "AIは教育を改善するか",
    description:
      "人工知能技術が教育の質とアクセシビリティに与える影響を考察する",
    suggestedPremises: [
      "AIは個々の学習者の進度に合わせた適応的学習を提供できる",
      "教師の負担を軽減し、個別指導の時間を増やせる",
      "AI生成コンテンツの正確性は完全ではない",
      "テクノロジーへのアクセスには地域間格差がある",
      "批判的思考力の育成にはAIだけでは不十分な可能性がある",
    ],
    inferenceRules: [
      "モーダス・ポネンス（P→Q, P ∴ Q）",
      "条件付き三段論法（P→Q, Q→R ∴ P→R）",
      "帰納的一般化（複数の事例→一般的結論）",
      "費用便益分析（メリットとデメリットの比較考量）",
    ],
    counterArguments: [
      "AIへの過度な依存が自主的な思考力を弱める可能性",
      "デジタルデバイドによる教育格差の拡大",
      "人間の教師による感情的サポートはAIでは代替できない",
    ],
  },
  {
    id: "environment-economy",
    title: "環境保護と経済成長は両立するか",
    description: "持続可能な発展の可能性を論理的に検討する",
    suggestedPremises: [
      "再生可能エネルギー産業は新しい雇用を創出する",
      "環境規制は短期的に企業のコストを増加させる",
      "グリーンテクノロジーの市場規模は年々拡大している",
      "気候変動の経済的損失は対策コストを上回る可能性がある",
      "循環型経済モデルは資源効率を向上させる",
    ],
    inferenceRules: [
      "仮説演繹法（仮説→予測、予測を検証）",
      "費用便益分析（メリットとデメリットの比較考量）",
      "帰納的一般化（複数の事例→一般的結論）",
      "背理法（結論の否定から矛盾を導く）",
    ],
    counterArguments: [
      "発展途上国にとって環境規制は経済成長の障壁となりうる",
      "グリーンテクノロジーへの移行コストが高すぎる産業がある",
      "短期的な経済的犠牲を受け入れる政治的合意が困難",
    ],
  },
  {
    id: "university-necessity",
    title: "大学教育は必要か",
    description: "高等教育の価値と代替手段について論理的に議論する",
    suggestedPremises: [
      "大学卒業者の平均生涯賃金は非大卒者より高い統計がある",
      "オンライン学習プラットフォームが同等の知識を低コストで提供している",
      "大学は学問だけでなく社会的ネットワークを形成する場である",
      "多くの職種で実務経験が学位より重視されつつある",
      "学費の高騰により学生の借金問題が深刻化している",
    ],
    inferenceRules: [
      "モーダス・ポネンス（P→Q, P ∴ Q）",
      "帰納的一般化（複数の事例→一般的結論）",
      "類推（類似事例からの推論）",
      "費用便益分析（メリットとデメリットの比較考量）",
    ],
    counterArguments: [
      "統計的な賃金差は他の要因（家庭環境など）で説明できる可能性",
      "オンライン学習では対面での深い議論や研究体験が得られない",
      "大学教育の価値は経済的利益だけでは測れない",
    ],
  },
]

const STORAGE_KEY = "logos-essay-drafts"

export function loadDraft(topicId: string): EssayState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const drafts = JSON.parse(raw) as Record<string, EssayState>
    return drafts[topicId] ?? null
  } catch {
    return null
  }
}

export function saveDraft(state: EssayState): void {
  if (typeof window === "undefined" || !state.topicId) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const drafts: Record<string, EssayState> = raw ? JSON.parse(raw) : {}
    const updated = { ...drafts, [state.topicId]: state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail on storage errors
  }
}

let nextPremiseId = 0
export function createPremiseId(): string {
  nextPremiseId += 1
  return `p-${Date.now()}-${nextPremiseId}`
}
