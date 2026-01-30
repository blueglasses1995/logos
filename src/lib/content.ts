import type { Quiz, ChapterMeta } from "@/types/content"

import ch01TheoryQuizzes from "../../content/chapters/01-propositions/theory-quizzes.json"
import ch01PracticeQuizzes from "../../content/chapters/01-propositions/practice-quizzes.json"

const CHAPTERS: readonly ChapterMeta[] = [
  {
    slug: "01-propositions",
    title: "命題と論理結合子",
    order: 1,
    description: "AND, OR, NOT, IF-THEN — 論理の基本的な結合子を学ぶ",
  },
]

const QUIZ_MAP: Record<string, Record<string, readonly Quiz[]>> = {
  "01-propositions": {
    theory: ch01TheoryQuizzes as unknown as Quiz[],
    practice: ch01PracticeQuizzes as unknown as Quiz[],
  },
}

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
  return QUIZ_MAP[chapterSlug]?.[section] ?? []
}
