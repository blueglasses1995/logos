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
    slug: "04-predicate-logic",
    title: "述語論理の基礎",
    order: 4,
    description: "述語と量化子（∀, ∃）、量化子の否定、多重量化",
  },
  {
    slug: "05-fallacies",
    title: "非形式的誤謬",
    order: 5,
    description: "人身攻撃、藁人形論法、偽の二択など主要な誤謬の分類と識別",
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
