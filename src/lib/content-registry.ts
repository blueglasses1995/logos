import type { ComponentType } from "react"
import type { Quiz } from "@/types/content"

export interface ChapterContent {
  readonly TheoryContent: ComponentType
  readonly PhilosophyContent: ComponentType
  readonly theoryQuizzes: readonly Quiz[]
  readonly practiceQuizzes: readonly Quiz[]
}

// Static imports for all chapters
import { TheoryContent as Ch01Theory } from "../../content/chapters/01-propositions/theory"
import { PhilosophyContent as Ch01Philosophy } from "../../content/chapters/01-propositions/philosophy"
import ch01TheoryQuizzes from "../../content/chapters/01-propositions/theory-quizzes.json"
import ch01PracticeQuizzes from "../../content/chapters/01-propositions/practice-quizzes.json"

const CONTENT_REGISTRY: Readonly<Record<string, ChapterContent>> = {
  "01-propositions": {
    TheoryContent: Ch01Theory,
    PhilosophyContent: Ch01Philosophy,
    theoryQuizzes: ch01TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch01PracticeQuizzes as unknown as Quiz[],
  },
}

export function getChapterContent(slug: string): ChapterContent | undefined {
  return CONTENT_REGISTRY[slug]
}
