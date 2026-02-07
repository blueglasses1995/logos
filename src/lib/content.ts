import type { Quiz, ChapterMeta } from "@/types/content"
import { getChapterContent } from "./content-registry"

const CHAPTERS: readonly ChapterMeta[] = [
  // Part 1: 命題論理
  {
    slug: "01-propositions",
    title: "命題と論理結合子",
    order: 1,
    description: "AND, OR, NOT, IF-THEN — 論理の基本的な結合子を学ぶ",
  },
  {
    slug: "02-truth-tables",
    title: "真理値表と恒真式",
    order: 2,
    description: "真理値表の構築、トートロジー、ド・モルガンの法則、対偶",
  },
  {
    slug: "03-validity",
    title: "論証の妥当性と健全性",
    order: 3,
    description: "演繹的妥当性、健全性、主要な推論規則、反例による否定",
  },
  {
    slug: "07-natural-deduction-prop",
    title: "自然演繹（命題論理）",
    order: 4,
    description: "導入・除去規則の体系、仮定の導入と解除、形式的証明の構築",
  },
  {
    slug: "08-propositional-semantics",
    title: "命題論理の意味論と完全性",
    order: 5,
    description: "構文と意味論の区別、健全性定理と完全性定理、決定可能性",
  },
  // Part 2: 述語論理
  {
    slug: "04a-predicates",
    title: "述語と項",
    order: 6,
    description: "命題論理の限界を知り、述語と項という新しい道具を手に入れる",
  },
  {
    slug: "04b-universal",
    title: "全称量化子（∀）",
    order: 7,
    description: "「すべての」を厳密に表現する — 全称量化子の定義と使い方",
  },
  {
    slug: "04c-existential",
    title: "存在量化子（∃）",
    order: 8,
    description: "「存在する」を厳密に表現する — 存在量化子の定義と使い方",
  },
  {
    slug: "04d-negation",
    title: "量化子の否定",
    order: 9,
    description: "∀と∃の否定関係 — ド・モルガンの法則の一般化",
  },
  {
    slug: "04e-multiple-quantifiers",
    title: "多重量化",
    order: 10,
    description: "量化子の順序が意味を変える — 入れ子の量化子を読み解く",
  },
  {
    slug: "04f-sql-connection",
    title: "述語論理とSQL",
    order: 11,
    description: "述語論理がデータベースの基盤である理由 — 理論と実務の接続",
  },
  {
    slug: "09-natural-deduction-pred",
    title: "自然演繹（述語論理）",
    order: 12,
    description: "量化子の推論規則、固有変数条件、述語論理での形式的証明",
  },
  {
    slug: "10-identity-uniqueness",
    title: "等号と一意性",
    order: 13,
    description: "等号の公理、一意的存在、定記述、ラッセルのパラドックス入門",
  },
  // Part 3: 集合と構造
  {
    slug: "11-sets",
    title: "集合の基礎",
    order: 14,
    description: "集合演算、部分集合、べき集合、ド・モルガンの法則（集合版）",
  },
  {
    slug: "12-relations",
    title: "関係",
    order: 15,
    description: "二項関係の性質、同値関係と同値類、順序関係とハッセ図",
  },
  {
    slug: "13-functions",
    title: "関数",
    order: 16,
    description: "単射・全射・全単射、合成関数と逆関数、集合の濃度",
  },
  {
    slug: "14-infinity",
    title: "無限と対角線論法",
    order: 17,
    description: "可算無限と非可算無限、カントールの対角線論法、べき集合定理",
  },
  // Part 4: 帰納と再帰
  {
    slug: "15-mathematical-induction",
    title: "数学的帰納法",
    order: 18,
    description: "ドミノ原理、基底ケースと帰納ステップ、弱い帰納法の実践",
  },
  {
    slug: "16-strong-structural-induction",
    title: "強帰納法と構造帰納法",
    order: 19,
    description: "強帰納法、リストと木の構造帰納法、再帰関数の正しさ証明",
  },
  {
    slug: "17-recursion-induction",
    title: "再帰と帰納",
    order: 20,
    description: "再帰的定義と帰納的証明の対応、整礎関係、ループ不変条件",
  },
  // Part 5: 様相・時相論理
  {
    slug: "18-modal-logic",
    title: "様相論理入門",
    order: 21,
    description: "必然性と可能性、可能世界意味論、クリプキフレーム、公理系",
  },
  {
    slug: "19-modal-applications",
    title: "様相論理の応用",
    order: 22,
    description: "認識論理、義務論理、日常推論での様相、AIの知識表現",
  },
  {
    slug: "20-temporal-logic",
    title: "時相論理",
    order: 23,
    description: "LTLの基本演算子、パス意味論、CTL、モデル検査の直感",
  },
  // Part 6: 批判的思考と確率
  {
    slug: "05-fallacies",
    title: "非形式的誤謬",
    order: 24,
    description: "人身攻撃、藁人形論法、偽の二択など主要な誤謬の分類と識別",
  },
  {
    slug: "21-probabilistic-reasoning",
    title: "確率的推論とベイズ",
    order: 25,
    description: "条件付き確率、ベイズの定理、基準率錯誤、帰納的強さ",
  },
  {
    slug: "22-intuitionistic-logic",
    title: "直観主義論理",
    order: 26,
    description: "構成的証明、BHK解釈、排中律の否定、型理論との関連",
  },
  // Part 7: 計算と論理
  {
    slug: "23-boolean-circuits",
    title: "ブール代数と回路",
    order: 27,
    description: "ブール代数の公理、論理ゲート、組み合わせ回路、カルノー図",
  },
  {
    slug: "24-curry-howard",
    title: "Curry-Howard対応",
    order: 28,
    description: "命題＝型、証明＝プログラム、TypeScriptの型と論理の統一",
  },
  // Part 8: メタ論理と総合
  {
    slug: "25-metalogic",
    title: "メタ論理：限界と可能性",
    order: 29,
    description: "ゲーデルの不完全性定理、停止問題、計算可能性の限界",
  },
  {
    slug: "06-synthesis",
    title: "総合演習",
    order: 30,
    description: "全章の知識を統合した議論分析フレームワークと総合演習",
  },
]

export function getAllChapters(): readonly ChapterMeta[] {
  return CHAPTERS
}

export function getChapterMeta(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug)
}

export function getChapterQuizzes(
  chapterSlug: string,
  section: "theory" | "practice"
): readonly Quiz[] {
  const content = getChapterContent(chapterSlug)
  if (!content) return []
  return section === "theory" ? content.theoryQuizzes : content.practiceQuizzes
}
