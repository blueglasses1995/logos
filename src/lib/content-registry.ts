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

// New chapters (07-25)
import { TheoryContent as Ch07Theory } from "../../content/chapters/07-natural-deduction-prop/theory"
import { PhilosophyContent as Ch07Philosophy } from "../../content/chapters/07-natural-deduction-prop/philosophy"
import ch07TheoryQuizzes from "../../content/chapters/07-natural-deduction-prop/theory-quizzes.json"
import ch07PracticeQuizzes from "../../content/chapters/07-natural-deduction-prop/practice-quizzes.json"

import { TheoryContent as Ch08Theory } from "../../content/chapters/08-propositional-semantics/theory"
import { PhilosophyContent as Ch08Philosophy } from "../../content/chapters/08-propositional-semantics/philosophy"
import ch08TheoryQuizzes from "../../content/chapters/08-propositional-semantics/theory-quizzes.json"
import ch08PracticeQuizzes from "../../content/chapters/08-propositional-semantics/practice-quizzes.json"

import { TheoryContent as Ch09Theory } from "../../content/chapters/09-natural-deduction-pred/theory"
import { PhilosophyContent as Ch09Philosophy } from "../../content/chapters/09-natural-deduction-pred/philosophy"
import ch09TheoryQuizzes from "../../content/chapters/09-natural-deduction-pred/theory-quizzes.json"
import ch09PracticeQuizzes from "../../content/chapters/09-natural-deduction-pred/practice-quizzes.json"

import { TheoryContent as Ch10Theory } from "../../content/chapters/10-identity-uniqueness/theory"
import { PhilosophyContent as Ch10Philosophy } from "../../content/chapters/10-identity-uniqueness/philosophy"
import ch10TheoryQuizzes from "../../content/chapters/10-identity-uniqueness/theory-quizzes.json"
import ch10PracticeQuizzes from "../../content/chapters/10-identity-uniqueness/practice-quizzes.json"

import { TheoryContent as Ch11Theory } from "../../content/chapters/11-sets/theory"
import { PhilosophyContent as Ch11Philosophy } from "../../content/chapters/11-sets/philosophy"
import ch11TheoryQuizzes from "../../content/chapters/11-sets/theory-quizzes.json"
import ch11PracticeQuizzes from "../../content/chapters/11-sets/practice-quizzes.json"

import { TheoryContent as Ch12Theory } from "../../content/chapters/12-relations/theory"
import { PhilosophyContent as Ch12Philosophy } from "../../content/chapters/12-relations/philosophy"
import ch12TheoryQuizzes from "../../content/chapters/12-relations/theory-quizzes.json"
import ch12PracticeQuizzes from "../../content/chapters/12-relations/practice-quizzes.json"

import { TheoryContent as Ch13Theory } from "../../content/chapters/13-functions/theory"
import { PhilosophyContent as Ch13Philosophy } from "../../content/chapters/13-functions/philosophy"
import ch13TheoryQuizzes from "../../content/chapters/13-functions/theory-quizzes.json"
import ch13PracticeQuizzes from "../../content/chapters/13-functions/practice-quizzes.json"

import { TheoryContent as Ch14Theory } from "../../content/chapters/14-infinity/theory"
import { PhilosophyContent as Ch14Philosophy } from "../../content/chapters/14-infinity/philosophy"
import ch14TheoryQuizzes from "../../content/chapters/14-infinity/theory-quizzes.json"
import ch14PracticeQuizzes from "../../content/chapters/14-infinity/practice-quizzes.json"

import { TheoryContent as Ch15Theory } from "../../content/chapters/15-mathematical-induction/theory"
import { PhilosophyContent as Ch15Philosophy } from "../../content/chapters/15-mathematical-induction/philosophy"
import ch15TheoryQuizzes from "../../content/chapters/15-mathematical-induction/theory-quizzes.json"
import ch15PracticeQuizzes from "../../content/chapters/15-mathematical-induction/practice-quizzes.json"

import { TheoryContent as Ch16Theory } from "../../content/chapters/16-strong-structural-induction/theory"
import { PhilosophyContent as Ch16Philosophy } from "../../content/chapters/16-strong-structural-induction/philosophy"
import ch16TheoryQuizzes from "../../content/chapters/16-strong-structural-induction/theory-quizzes.json"
import ch16PracticeQuizzes from "../../content/chapters/16-strong-structural-induction/practice-quizzes.json"

import { TheoryContent as Ch17Theory } from "../../content/chapters/17-recursion-induction/theory"
import { PhilosophyContent as Ch17Philosophy } from "../../content/chapters/17-recursion-induction/philosophy"
import ch17TheoryQuizzes from "../../content/chapters/17-recursion-induction/theory-quizzes.json"
import ch17PracticeQuizzes from "../../content/chapters/17-recursion-induction/practice-quizzes.json"

import { TheoryContent as Ch18Theory } from "../../content/chapters/18-modal-logic/theory"
import { PhilosophyContent as Ch18Philosophy } from "../../content/chapters/18-modal-logic/philosophy"
import ch18TheoryQuizzes from "../../content/chapters/18-modal-logic/theory-quizzes.json"
import ch18PracticeQuizzes from "../../content/chapters/18-modal-logic/practice-quizzes.json"

import { TheoryContent as Ch19Theory } from "../../content/chapters/19-modal-applications/theory"
import { PhilosophyContent as Ch19Philosophy } from "../../content/chapters/19-modal-applications/philosophy"
import ch19TheoryQuizzes from "../../content/chapters/19-modal-applications/theory-quizzes.json"
import ch19PracticeQuizzes from "../../content/chapters/19-modal-applications/practice-quizzes.json"

import { TheoryContent as Ch20Theory } from "../../content/chapters/20-temporal-logic/theory"
import { PhilosophyContent as Ch20Philosophy } from "../../content/chapters/20-temporal-logic/philosophy"
import ch20TheoryQuizzes from "../../content/chapters/20-temporal-logic/theory-quizzes.json"
import ch20PracticeQuizzes from "../../content/chapters/20-temporal-logic/practice-quizzes.json"

import { TheoryContent as Ch21Theory } from "../../content/chapters/21-probabilistic-reasoning/theory"
import { PhilosophyContent as Ch21Philosophy } from "../../content/chapters/21-probabilistic-reasoning/philosophy"
import ch21TheoryQuizzes from "../../content/chapters/21-probabilistic-reasoning/theory-quizzes.json"
import ch21PracticeQuizzes from "../../content/chapters/21-probabilistic-reasoning/practice-quizzes.json"

import { TheoryContent as Ch22Theory } from "../../content/chapters/22-intuitionistic-logic/theory"
import { PhilosophyContent as Ch22Philosophy } from "../../content/chapters/22-intuitionistic-logic/philosophy"
import ch22TheoryQuizzes from "../../content/chapters/22-intuitionistic-logic/theory-quizzes.json"
import ch22PracticeQuizzes from "../../content/chapters/22-intuitionistic-logic/practice-quizzes.json"

import { TheoryContent as Ch23Theory } from "../../content/chapters/23-boolean-circuits/theory"
import { PhilosophyContent as Ch23Philosophy } from "../../content/chapters/23-boolean-circuits/philosophy"
import ch23TheoryQuizzes from "../../content/chapters/23-boolean-circuits/theory-quizzes.json"
import ch23PracticeQuizzes from "../../content/chapters/23-boolean-circuits/practice-quizzes.json"

import { TheoryContent as Ch24Theory } from "../../content/chapters/24-curry-howard/theory"
import { PhilosophyContent as Ch24Philosophy } from "../../content/chapters/24-curry-howard/philosophy"
import ch24TheoryQuizzes from "../../content/chapters/24-curry-howard/theory-quizzes.json"
import ch24PracticeQuizzes from "../../content/chapters/24-curry-howard/practice-quizzes.json"

import { TheoryContent as Ch25Theory } from "../../content/chapters/25-metalogic/theory"
import { PhilosophyContent as Ch25Philosophy } from "../../content/chapters/25-metalogic/philosophy"
import ch25TheoryQuizzes from "../../content/chapters/25-metalogic/theory-quizzes.json"
import ch25PracticeQuizzes from "../../content/chapters/25-metalogic/practice-quizzes.json"

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
  "07-natural-deduction-prop": {
    TheoryContent: Ch07Theory,
    PhilosophyContent: Ch07Philosophy,
    theoryQuizzes: ch07TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch07PracticeQuizzes as unknown as Quiz[],
  },
  "08-propositional-semantics": {
    TheoryContent: Ch08Theory,
    PhilosophyContent: Ch08Philosophy,
    theoryQuizzes: ch08TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch08PracticeQuizzes as unknown as Quiz[],
  },
  "09-natural-deduction-pred": {
    TheoryContent: Ch09Theory,
    PhilosophyContent: Ch09Philosophy,
    theoryQuizzes: ch09TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch09PracticeQuizzes as unknown as Quiz[],
  },
  "10-identity-uniqueness": {
    TheoryContent: Ch10Theory,
    PhilosophyContent: Ch10Philosophy,
    theoryQuizzes: ch10TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch10PracticeQuizzes as unknown as Quiz[],
  },
  "11-sets": {
    TheoryContent: Ch11Theory,
    PhilosophyContent: Ch11Philosophy,
    theoryQuizzes: ch11TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch11PracticeQuizzes as unknown as Quiz[],
  },
  "12-relations": {
    TheoryContent: Ch12Theory,
    PhilosophyContent: Ch12Philosophy,
    theoryQuizzes: ch12TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch12PracticeQuizzes as unknown as Quiz[],
  },
  "13-functions": {
    TheoryContent: Ch13Theory,
    PhilosophyContent: Ch13Philosophy,
    theoryQuizzes: ch13TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch13PracticeQuizzes as unknown as Quiz[],
  },
  "14-infinity": {
    TheoryContent: Ch14Theory,
    PhilosophyContent: Ch14Philosophy,
    theoryQuizzes: ch14TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch14PracticeQuizzes as unknown as Quiz[],
  },
  "15-mathematical-induction": {
    TheoryContent: Ch15Theory,
    PhilosophyContent: Ch15Philosophy,
    theoryQuizzes: ch15TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch15PracticeQuizzes as unknown as Quiz[],
  },
  "16-strong-structural-induction": {
    TheoryContent: Ch16Theory,
    PhilosophyContent: Ch16Philosophy,
    theoryQuizzes: ch16TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch16PracticeQuizzes as unknown as Quiz[],
  },
  "17-recursion-induction": {
    TheoryContent: Ch17Theory,
    PhilosophyContent: Ch17Philosophy,
    theoryQuizzes: ch17TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch17PracticeQuizzes as unknown as Quiz[],
  },
  "18-modal-logic": {
    TheoryContent: Ch18Theory,
    PhilosophyContent: Ch18Philosophy,
    theoryQuizzes: ch18TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch18PracticeQuizzes as unknown as Quiz[],
  },
  "19-modal-applications": {
    TheoryContent: Ch19Theory,
    PhilosophyContent: Ch19Philosophy,
    theoryQuizzes: ch19TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch19PracticeQuizzes as unknown as Quiz[],
  },
  "20-temporal-logic": {
    TheoryContent: Ch20Theory,
    PhilosophyContent: Ch20Philosophy,
    theoryQuizzes: ch20TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch20PracticeQuizzes as unknown as Quiz[],
  },
  "21-probabilistic-reasoning": {
    TheoryContent: Ch21Theory,
    PhilosophyContent: Ch21Philosophy,
    theoryQuizzes: ch21TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch21PracticeQuizzes as unknown as Quiz[],
  },
  "22-intuitionistic-logic": {
    TheoryContent: Ch22Theory,
    PhilosophyContent: Ch22Philosophy,
    theoryQuizzes: ch22TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch22PracticeQuizzes as unknown as Quiz[],
  },
  "23-boolean-circuits": {
    TheoryContent: Ch23Theory,
    PhilosophyContent: Ch23Philosophy,
    theoryQuizzes: ch23TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch23PracticeQuizzes as unknown as Quiz[],
  },
  "24-curry-howard": {
    TheoryContent: Ch24Theory,
    PhilosophyContent: Ch24Philosophy,
    theoryQuizzes: ch24TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch24PracticeQuizzes as unknown as Quiz[],
  },
  "25-metalogic": {
    TheoryContent: Ch25Theory,
    PhilosophyContent: Ch25Philosophy,
    theoryQuizzes: ch25TheoryQuizzes as unknown as Quiz[],
    practiceQuizzes: ch25PracticeQuizzes as unknown as Quiz[],
  },
}

export function getChapterContent(slug: string): ChapterContent | undefined {
  return CONTENT_REGISTRY[slug]
}
