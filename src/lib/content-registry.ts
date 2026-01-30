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

import { TheoryContent as Ch02Theory } from "../../content/chapters/02-truth-tables/theory"
import { PhilosophyContent as Ch02Philosophy } from "../../content/chapters/02-truth-tables/philosophy"
import ch02TheoryQuizzes from "../../content/chapters/02-truth-tables/theory-quizzes.json"
import ch02PracticeQuizzes from "../../content/chapters/02-truth-tables/practice-quizzes.json"

import { TheoryContent as Ch03Theory } from "../../content/chapters/03-validity/theory"
import { PhilosophyContent as Ch03Philosophy } from "../../content/chapters/03-validity/philosophy"
import ch03TheoryQuizzes from "../../content/chapters/03-validity/theory-quizzes.json"
import ch03PracticeQuizzes from "../../content/chapters/03-validity/practice-quizzes.json"

import { TheoryContent as Ch04Theory } from "../../content/chapters/04-predicate-logic/theory"
import { PhilosophyContent as Ch04Philosophy } from "../../content/chapters/04-predicate-logic/philosophy"
import ch04TheoryQuizzes from "../../content/chapters/04-predicate-logic/theory-quizzes.json"
import ch04PracticeQuizzes from "../../content/chapters/04-predicate-logic/practice-quizzes.json"

import { TheoryContent as Ch05Theory } from "../../content/chapters/05-fallacies/theory"
import { PhilosophyContent as Ch05Philosophy } from "../../content/chapters/05-fallacies/philosophy"
import ch05TheoryQuizzes from "../../content/chapters/05-fallacies/theory-quizzes.json"
import ch05PracticeQuizzes from "../../content/chapters/05-fallacies/practice-quizzes.json"

const CONTENT_REGISTRY: Readonly<Record<string, ChapterContent>> = {
  "01-propositions": {
    TheoryContent: Ch01Theory,
    PhilosophyContent: Ch01Philosophy,
    theoryQuizzes: ch01TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch01PracticeQuizzes as unknown as Quiz[],
  },
  "02-truth-tables": {
    TheoryContent: Ch02Theory,
    PhilosophyContent: Ch02Philosophy,
    theoryQuizzes: ch02TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch02PracticeQuizzes as unknown as Quiz[],
  },
  "03-validity": {
    TheoryContent: Ch03Theory,
    PhilosophyContent: Ch03Philosophy,
    theoryQuizzes: ch03TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch03PracticeQuizzes as unknown as Quiz[],
  },
  "04-predicate-logic": {
    TheoryContent: Ch04Theory,
    PhilosophyContent: Ch04Philosophy,
    theoryQuizzes: ch04TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04PracticeQuizzes as unknown as Quiz[],
  },
  "05-fallacies": {
    TheoryContent: Ch05Theory,
    PhilosophyContent: Ch05Philosophy,
    theoryQuizzes: ch05TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch05PracticeQuizzes as unknown as Quiz[],
  },
}

export function getChapterContent(slug: string): ChapterContent | undefined {
  return CONTENT_REGISTRY[slug]
}
