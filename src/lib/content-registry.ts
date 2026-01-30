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

import { TheoryContent as Ch04aTheory } from "../../content/chapters/04a-predicates/theory"
import { PhilosophyContent as Ch04aPhilosophy } from "../../content/chapters/04a-predicates/philosophy"
import ch04aTheoryQuizzes from "../../content/chapters/04a-predicates/theory-quizzes.json"
import ch04aPracticeQuizzes from "../../content/chapters/04a-predicates/practice-quizzes.json"

import { TheoryContent as Ch04bTheory } from "../../content/chapters/04b-universal/theory"
import { PhilosophyContent as Ch04bPhilosophy } from "../../content/chapters/04b-universal/philosophy"
import ch04bTheoryQuizzes from "../../content/chapters/04b-universal/theory-quizzes.json"
import ch04bPracticeQuizzes from "../../content/chapters/04b-universal/practice-quizzes.json"

import { TheoryContent as Ch04cTheory } from "../../content/chapters/04c-existential/theory"
import { PhilosophyContent as Ch04cPhilosophy } from "../../content/chapters/04c-existential/philosophy"
import ch04cTheoryQuizzes from "../../content/chapters/04c-existential/theory-quizzes.json"
import ch04cPracticeQuizzes from "../../content/chapters/04c-existential/practice-quizzes.json"

import { TheoryContent as Ch04dTheory } from "../../content/chapters/04d-negation/theory"
import { PhilosophyContent as Ch04dPhilosophy } from "../../content/chapters/04d-negation/philosophy"
import ch04dTheoryQuizzes from "../../content/chapters/04d-negation/theory-quizzes.json"
import ch04dPracticeQuizzes from "../../content/chapters/04d-negation/practice-quizzes.json"

import { TheoryContent as Ch04eTheory } from "../../content/chapters/04e-multiple-quantifiers/theory"
import { PhilosophyContent as Ch04ePhilosophy } from "../../content/chapters/04e-multiple-quantifiers/philosophy"
import ch04eTheoryQuizzes from "../../content/chapters/04e-multiple-quantifiers/theory-quizzes.json"
import ch04ePracticeQuizzes from "../../content/chapters/04e-multiple-quantifiers/practice-quizzes.json"

import { TheoryContent as Ch04fTheory } from "../../content/chapters/04f-sql-connection/theory"
import { PhilosophyContent as Ch04fPhilosophy } from "../../content/chapters/04f-sql-connection/philosophy"
import ch04fTheoryQuizzes from "../../content/chapters/04f-sql-connection/theory-quizzes.json"
import ch04fPracticeQuizzes from "../../content/chapters/04f-sql-connection/practice-quizzes.json"

import { TheoryContent as Ch05Theory } from "../../content/chapters/05-fallacies/theory"
import { PhilosophyContent as Ch05Philosophy } from "../../content/chapters/05-fallacies/philosophy"
import ch05TheoryQuizzes from "../../content/chapters/05-fallacies/theory-quizzes.json"
import ch05PracticeQuizzes from "../../content/chapters/05-fallacies/practice-quizzes.json"

import { TheoryContent as Ch06Theory } from "../../content/chapters/06-synthesis/theory"
import { PhilosophyContent as Ch06Philosophy } from "../../content/chapters/06-synthesis/philosophy"
import ch06TheoryQuizzes from "../../content/chapters/06-synthesis/theory-quizzes.json"
import ch06PracticeQuizzes from "../../content/chapters/06-synthesis/practice-quizzes.json"

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
  "04a-predicates": {
    TheoryContent: Ch04aTheory,
    PhilosophyContent: Ch04aPhilosophy,
    theoryQuizzes: ch04aTheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04aPracticeQuizzes as unknown as Quiz[],
  },
  "04b-universal": {
    TheoryContent: Ch04bTheory,
    PhilosophyContent: Ch04bPhilosophy,
    theoryQuizzes: ch04bTheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04bPracticeQuizzes as unknown as Quiz[],
  },
  "04c-existential": {
    TheoryContent: Ch04cTheory,
    PhilosophyContent: Ch04cPhilosophy,
    theoryQuizzes: ch04cTheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04cPracticeQuizzes as unknown as Quiz[],
  },
  "04d-negation": {
    TheoryContent: Ch04dTheory,
    PhilosophyContent: Ch04dPhilosophy,
    theoryQuizzes: ch04dTheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04dPracticeQuizzes as unknown as Quiz[],
  },
  "04e-multiple-quantifiers": {
    TheoryContent: Ch04eTheory,
    PhilosophyContent: Ch04ePhilosophy,
    theoryQuizzes: ch04eTheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04ePracticeQuizzes as unknown as Quiz[],
  },
  "04f-sql-connection": {
    TheoryContent: Ch04fTheory,
    PhilosophyContent: Ch04fPhilosophy,
    theoryQuizzes: ch04fTheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch04fPracticeQuizzes as unknown as Quiz[],
  },
  "05-fallacies": {
    TheoryContent: Ch05Theory,
    PhilosophyContent: Ch05Philosophy,
    theoryQuizzes: ch05TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch05PracticeQuizzes as unknown as Quiz[],
  },
  "06-synthesis": {
    TheoryContent: Ch06Theory,
    PhilosophyContent: Ch06Philosophy,
    theoryQuizzes: ch06TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch06PracticeQuizzes as unknown as Quiz[],
  },
}

export function getChapterContent(slug: string): ChapterContent | undefined {
  return CONTENT_REGISTRY[slug]
}
