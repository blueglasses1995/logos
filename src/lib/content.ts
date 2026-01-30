import type { Quiz, ChapterMeta } from "@/types/content"
import { getChapterContent } from "./content-registry"

const CHAPTERS: readonly ChapterMeta[] = [
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
    slug: "04a-predicates",
    title: "述語と項",
    order: 4,
    description: "命題論理の限界を知り、述語と項という新しい道具を手に入れる",
  },
  {
    slug: "04b-universal",
    title: "全称量化子（∀）",
    order: 5,
    description: "「すべての」を厳密に表現する — 全称量化子の定義と使い方",
  },
  {
    slug: "04c-existential",
    title: "存在量化子（∃）",
    order: 6,
    description: "「存在する」を厳密に表現する — 存在量化子の定義と使い方",
  },
  {
    slug: "04d-negation",
    title: "量化子の否定",
    order: 7,
    description: "∀と∃の否定関係 — ド・モルガンの法則の一般化",
  },
  {
    slug: "04e-multiple-quantifiers",
    title: "多重量化",
    order: 8,
    description: "量化子の順序が意味を変える — 入れ子の量化子を読み解く",
  },
  {
    slug: "04f-sql-connection",
    title: "述語論理とSQL",
    order: 9,
    description: "述語論理がデータベースの基盤である理由 — 理論と実務の接続",
  },
  {
    slug: "05-fallacies",
    title: "非形式的誤謬",
    order: 10,
    description: "人身攻撃、藁人形論法、偽の二択など主要な誤謬の分類と識別",
  },
  {
    slug: "06-synthesis",
    title: "実践総合演習",
    order: 11,
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
