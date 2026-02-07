export interface MotivationData {
  readonly slug: string
  readonly icon: string
  readonly realWorldExample: string
  readonly nextChapterConnection: string
}

export const MOTIVATION_DATA: readonly MotivationData[] = [
  {
    slug: "01-propositions",
    icon: "💡",
    realWorldExample:
      "プログラミングの条件分岐は命題論理そのもの。if文を書くたびに論理結合子を使っている。",
    nextChapterConnection: "真理値表で体系的に分析",
  },
  {
    slug: "02-truth-tables",
    icon: "📊",
    realWorldExample:
      "バグの原因は論理条件の見落とし。真理値表で全パターンを網羅的にチェック。",
    nextChapterConnection: "論証の妥当性で推論全体を評価",
  },
  {
    slug: "03-validity",
    icon: "⚖️",
    realWorldExample:
      "「この推論は正しいか？」はコードレビューの核心。妥当性の判定方法を学ぶ。",
    nextChapterConnection: "述語論理でより精密な表現へ",
  },
  {
    slug: "04a-predicates",
    icon: "🔍",
    realWorldExample:
      "「全てのユーザー」「あるエラーが存在する」— 命題論理では言えないことを述語で表現。",
    nextChapterConnection: "全称量化子で「全て」を厳密に",
  },
  {
    slug: "04b-universal",
    icon: "🌐",
    realWorldExample:
      "「全てのテストがパスする」を厳密に。テスト駆動開発の論理的基盤。",
    nextChapterConnection: "存在量化子で「存在する」を厳密に",
  },
  {
    slug: "04c-existential",
    icon: "🎯",
    realWorldExample:
      "「バグが存在する」「解が存在する」— 存在の証明方法を学ぶ。",
    nextChapterConnection: "量化子の否定で「全て」と「存在」の関係を深める",
  },
  {
    slug: "04d-negation",
    icon: "🔄",
    realWorldExample:
      "「全員が賛成でない」≠「全員が反対」— この違いが分からないと議論で負ける。",
    nextChapterConnection: "多重量化で複雑な文を読み解く",
  },
  {
    slug: "04e-multiple-quantifiers",
    icon: "🧩",
    realWorldExample:
      "データベースの複雑なクエリ、数学の定理。量化子の順序で意味が変わる世界。",
    nextChapterConnection: "SQLとの対応で実務に接続",
  },
  {
    slug: "04f-sql-connection",
    icon: "🗄️",
    realWorldExample:
      "述語論理の知識がSQLの理解を根本的に変える。WHERE句は述語そのもの。",
    nextChapterConnection: "非形式的誤謬で日常の議論を分析",
  },
  {
    slug: "05-fallacies",
    icon: "🛡️",
    realWorldExample:
      "ニュース、SNS、会議。誤謬は日常に溢れている。見抜く力は最強の武器。",
    nextChapterConnection: "総合演習で全てを統合",
  },
  {
    slug: "06-synthesis",
    icon: "🏆",
    realWorldExample:
      "全章の知識を統合して実践的な議論分析力を完成させる。",
    nextChapterConnection: "これがゴール！",
  },
] as const

export function getMotivationBySlug(
  slug: string,
): MotivationData | undefined {
  return MOTIVATION_DATA.find((m) => m.slug === slug)
}
