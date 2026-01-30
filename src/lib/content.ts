import type { Quiz, ChapterMeta } from "@/types/content"
import { getChapterContent } from "./content-registry"

const CHAPTERS: readonly ChapterMeta[] = [
  {
    slug: "01-propositions",
    title: "命題と論理結合子",
    order: 1,
    description: "AND, OR, NOT, IF-THEN — 論理の基本的な結合子を学ぶ",
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
