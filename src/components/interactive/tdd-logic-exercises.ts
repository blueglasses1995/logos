export interface MatchPair {
  readonly id: string
  readonly tddConcept: string
  readonly tddDescription: string
  readonly logicConcept: string
  readonly logicDescription: string
}

export interface Exercise {
  readonly id: string
  readonly title: string
  readonly prompt: string
  readonly type: "match" | "select"
  readonly pairs?: readonly MatchPair[]
  readonly scenario?: string
  readonly options?: readonly string[]
  readonly correctIndex?: number
  readonly explanation: string
}

export const EXERCISES: readonly Exercise[] = [
  {
    id: "test-as-counterexample",
    title: "テストケース＝反例を探す行為",
    prompt:
      "「すべての偶数は4より大きい」という主張に対して、テストケース（反例）を選んでください。",
    type: "select",
    scenario: "∀x (Even(x) → x > 4)",
    options: [
      "x = 6（偶数かつ6 > 4 → テスト通過）",
      "x = 2（偶数かつ2 ≤ 4 → 反例発見！）",
      "x = 7（奇数なので対象外）",
      "x = 100（偶数かつ100 > 4 → テスト通過）",
    ],
    correctIndex: 1,
    explanation:
      "TDD ではテストケースを書いて仕様の穴を見つけます。論理学では反例を探して全称命題を反駁します。x = 2 は偶数なのに 4 より大きくないため、主張の反例です。テストを書く行為は、まさに反例を探す行為と同じです。",
  },
  {
    id: "test-suite-verification",
    title: "テストスイート＝検証の試み",
    prompt:
      "「すべての正の整数 n に対して n² ≥ n」を検証するためのテストスイートとして、最も適切な組み合わせはどれですか？",
    type: "select",
    scenario: "∀n (n > 0 → n² ≥ n)",
    options: [
      "n = 1, 2, 3 のみテスト",
      "n = 1, 2, 10, 100, 1000（境界値＋代表値）",
      "n = 100 だけで十分",
      "テストは不要（自明だから）",
    ],
    correctIndex: 1,
    explanation:
      "テストスイートは全称命題の「有限検証」です。すべてのケースを調べることはできませんが、境界値（n=1）と代表値を含めることで信頼性を高めます。テストの通過は「反例が見つからなかった」ことを意味し、完全な証明ではありません。",
  },
  {
    id: "red-green-refactor",
    title: "Red-Green-Refactor ＝ 予想-反例-修正",
    prompt:
      "TDD の Red-Green-Refactor サイクルに対応する論理的プロセスをマッチさせてください。",
    type: "match",
    pairs: [
      {
        id: "red",
        tddConcept: "🔴 Red（テスト失敗）",
        tddDescription: "まだ実装がない状態でテストを書く",
        logicConcept: "予想の提示",
        logicDescription: "仮説を立てて、まだ証明されていない状態",
      },
      {
        id: "green",
        tddConcept: "🟢 Green（テスト通過）",
        tddDescription: "テストを通す最小限の実装を書く",
        logicConcept: "反例なし＝暫定的な検証",
        logicDescription: "反例が見つからず、仮説が現時点で正しいと確認",
      },
      {
        id: "refactor",
        tddConcept: "🔵 Refactor（改善）",
        tddDescription: "動作を変えずにコードを整理する",
        logicConcept: "論証の洗練",
        logicDescription: "同値な命題に書き換えて、論証をより明確にする",
      },
    ],
    explanation:
      "TDD のサイクルは論理的思考のプロセスそのものです。Red = まだ証明されていない仮説、Green = テストによる暫定的な確認、Refactor = 論理的に同値な形への変換。",
  },
  {
    id: "edge-cases-boundary",
    title: "エッジケース＝境界条件の論理",
    prompt:
      "関数 isAdult(age) のエッジケーステストが論理学のどの概念に対応するか選んでください。",
    type: "select",
    scenario: "isAdult(age) = age ≥ 18\nテストケース: age = 17, 18, 19",
    options: [
      "三段論法の適用",
      "真理値表の境界行の検査",
      "背理法による証明",
      "存在量化の確認",
    ],
    correctIndex: 1,
    explanation:
      "エッジケースのテスト（17, 18, 19）は、述語 age ≥ 18 の真偽が切り替わる境界を検査しています。これは真理値表で T と F が切り替わる境界行を確認することと同じです。",
  },
  {
    id: "correspondence-overview",
    title: "TDD ↔ 論理学 対応表",
    prompt:
      "各 TDD 概念に対応する論理学の概念をマッチさせてください。",
    type: "match",
    pairs: [
      {
        id: "test-case",
        tddConcept: "テストケース",
        tddDescription: "特定の入力で期待する出力を定義",
        logicConcept: "反例の候補",
        logicDescription: "全称命題を反駁しうる具体的な事例",
      },
      {
        id: "test-pass",
        tddConcept: "テスト通過",
        tddDescription: "実装が仕様を満たしている",
        logicConcept: "命題の検証（部分的）",
        logicDescription: "有限個の事例で命題が偽でないことを確認",
      },
      {
        id: "test-fail",
        tddConcept: "テスト失敗",
        tddDescription: "実装が仕様を満たしていない",
        logicConcept: "反例の発見",
        logicDescription: "全称命題を偽にする具体例が見つかった",
      },
      {
        id: "full-coverage",
        tddConcept: "100% カバレッジ",
        tddDescription: "すべてのコードパスをテスト",
        logicConcept: "完全な場合分け（証明）",
        logicDescription: "すべての場合を網羅的に検証",
      },
    ],
    explanation:
      "テストを書く＝反例を探す。テストが通る＝反例が見つからない。テストが落ちる＝反例発見。100% カバレッジ＝全ケースの場合分けによる証明。",
  },
] as const
