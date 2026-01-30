# Logos MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a logic learning web app with Chapter 1 (Propositions & Logical Connectives) featuring theory lessons, interactive quizzes, practice scenarios, a philosophy column, and localStorage progress tracking.

**Architecture:** Next.js 15 App Router with static MDX content. Quiz data in JSON files. Client-side progress persistence via localStorage with a custom React hook. All rendering is client-side for quiz interactivity; lessons use MDX with embedded quiz components.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, MDX (@next/mdx), Vitest + React Testing Library

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Create Next.js project**

Run:
```bash
cd /Users/toshiki.matsukuma/Documents/logos
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --turbopack
```

Choose defaults when prompted. This initializes the full Next.js 15 project with App Router.

**Step 2: Verify project runs**

Run:
```bash
pnpm dev
```

Open http://localhost:3000 — confirm default Next.js page loads. Stop dev server.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project with TypeScript and Tailwind"
```

---

## Task 2: Install Dependencies & Configure shadcn/ui

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Create: `src/lib/utils.ts`
- Create: `components.json`

**Step 1: Initialize shadcn/ui**

Run:
```bash
pnpm dlx shadcn@latest init
```

Select: New York style, Zinc base color, CSS variables = yes.

**Step 2: Add shadcn components we need**

Run:
```bash
pnpm dlx shadcn@latest add button card progress badge separator tabs
```

**Step 3: Install test dependencies**

Run:
```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Step 4: Create Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Create `src/test/setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest"
```

**Step 5: Add test script to package.json**

Add to `scripts`:
```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 6: Run tests to verify setup**

Run:
```bash
pnpm test:run
```

Expected: "No test files found" (no tests yet — that's correct).

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: add shadcn/ui, Vitest, and testing dependencies"
```

---

## Task 3: Type Definitions

**Files:**
- Create: `src/types/content.ts`
- Create: `src/types/progress.ts`

**Step 1: Write content types**

Create `src/types/content.ts`:

```typescript
// --- Quiz Types ---

export interface MultipleChoiceQuiz {
  readonly id: string
  readonly type: "multiple-choice"
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

export interface TruthTableQuiz {
  readonly id: string
  readonly type: "truth-table"
  readonly expression: string
  readonly variables: readonly string[]
  readonly expectedTable: readonly (readonly boolean[])[]
  readonly blanks: readonly number[]
}

export type Quiz = MultipleChoiceQuiz | TruthTableQuiz

// --- Section Types ---

export interface TheorySection {
  readonly slug: string
  readonly quizzes: readonly Quiz[]
}

export interface PracticeSection {
  readonly slug: string
  readonly quizzes: readonly Quiz[]
}

export interface PhilosophySection {
  readonly slug: string
}

// --- Chapter Types ---

export interface ChapterMeta {
  readonly slug: string
  readonly title: string
  readonly order: number
  readonly description: string
}
```

**Step 2: Write progress types**

Create `src/types/progress.ts`:

```typescript
export interface QuizAttempt {
  readonly quizId: string
  readonly correct: boolean
  readonly timestamp: string
}

export interface SectionProgress {
  readonly completed: boolean
  readonly attempts: readonly QuizAttempt[]
}

export interface ChapterProgress {
  readonly theory: SectionProgress
  readonly practice: SectionProgress
  readonly philosophy: { readonly read: boolean }
}

export interface UserProgress {
  readonly chapters: Readonly<Record<string, ChapterProgress>>
  readonly streak: {
    readonly currentDays: number
    readonly lastActiveDate: string
  }
}

export const EMPTY_SECTION_PROGRESS: SectionProgress = {
  completed: false,
  attempts: [],
}

export const EMPTY_CHAPTER_PROGRESS: ChapterProgress = {
  theory: EMPTY_SECTION_PROGRESS,
  practice: EMPTY_SECTION_PROGRESS,
  philosophy: { read: false },
}

export const EMPTY_PROGRESS: UserProgress = {
  chapters: {},
  streak: {
    currentDays: 0,
    lastActiveDate: "",
  },
}
```

**Step 3: Commit**

```bash
git add src/types/
git commit -m "feat: add content and progress type definitions"
```

---

## Task 4: Progress Persistence (localStorage)

**Files:**
- Create: `src/lib/progress.ts`
- Test: `src/lib/__tests__/progress.test.ts`

**Step 1: Write the failing tests**

Create `src/lib/__tests__/progress.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest"
import {
  loadProgress,
  saveProgress,
  recordQuizAttempt,
  markPhilosophyRead,
  updateStreak,
} from "../progress"
import {
  EMPTY_PROGRESS,
  type UserProgress,
} from "@/types/progress"

beforeEach(() => {
  localStorage.clear()
})

describe("loadProgress", () => {
  it("returns empty progress when nothing is stored", () => {
    const result = loadProgress()
    expect(result).toEqual(EMPTY_PROGRESS)
  })

  it("returns stored progress", () => {
    const stored: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 3, lastActiveDate: "2025-01-30" },
    }
    localStorage.setItem("logos-progress", JSON.stringify(stored))
    expect(loadProgress()).toEqual(stored)
  })
})

describe("saveProgress", () => {
  it("persists progress to localStorage", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 1, lastActiveDate: "2025-01-30" },
    }
    saveProgress(progress)
    const raw = localStorage.getItem("logos-progress")
    expect(JSON.parse(raw!)).toEqual(progress)
  })
})

describe("recordQuizAttempt", () => {
  it("adds attempt to chapter theory section", () => {
    const result = recordQuizAttempt(
      EMPTY_PROGRESS,
      "01-propositions",
      "theory",
      { quizId: "q1", correct: true, timestamp: "2025-01-30T10:00:00Z" }
    )
    expect(result.chapters["01-propositions"].theory.attempts).toHaveLength(1)
    expect(result.chapters["01-propositions"].theory.attempts[0].correct).toBe(true)
  })

  it("does not mutate original progress", () => {
    const original = EMPTY_PROGRESS
    recordQuizAttempt(
      original,
      "01-propositions",
      "theory",
      { quizId: "q1", correct: true, timestamp: "2025-01-30T10:00:00Z" }
    )
    expect(original.chapters["01-propositions"]).toBeUndefined()
  })
})

describe("markPhilosophyRead", () => {
  it("marks philosophy section as read", () => {
    const result = markPhilosophyRead(EMPTY_PROGRESS, "01-propositions")
    expect(result.chapters["01-propositions"].philosophy.read).toBe(true)
  })
})

describe("updateStreak", () => {
  it("increments streak for consecutive day", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 2, lastActiveDate: "2025-01-29" },
    }
    const result = updateStreak(progress, "2025-01-30")
    expect(result.streak.currentDays).toBe(3)
    expect(result.streak.lastActiveDate).toBe("2025-01-30")
  })

  it("resets streak if more than 1 day gap", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 5, lastActiveDate: "2025-01-27" },
    }
    const result = updateStreak(progress, "2025-01-30")
    expect(result.streak.currentDays).toBe(1)
  })

  it("keeps streak same if same day", () => {
    const progress: UserProgress = {
      ...EMPTY_PROGRESS,
      streak: { currentDays: 3, lastActiveDate: "2025-01-30" },
    }
    const result = updateStreak(progress, "2025-01-30")
    expect(result.streak.currentDays).toBe(3)
  })
})
```

**Step 2: Run tests to verify they fail**

Run:
```bash
pnpm test:run src/lib/__tests__/progress.test.ts
```

Expected: FAIL — module `../progress` not found.

**Step 3: Implement progress lib**

Create `src/lib/progress.ts`:

```typescript
import {
  EMPTY_CHAPTER_PROGRESS,
  EMPTY_PROGRESS,
  type ChapterProgress,
  type QuizAttempt,
  type SectionProgress,
  type UserProgress,
} from "@/types/progress"

const STORAGE_KEY = "logos-progress"

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    return JSON.parse(raw) as UserProgress
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function recordQuizAttempt(
  progress: UserProgress,
  chapterSlug: string,
  section: "theory" | "practice",
  attempt: QuizAttempt
): UserProgress {
  const chapter: ChapterProgress =
    progress.chapters[chapterSlug] ?? EMPTY_CHAPTER_PROGRESS

  const sectionProgress: SectionProgress = chapter[section]
  const updatedSection: SectionProgress = {
    ...sectionProgress,
    attempts: [...sectionProgress.attempts, attempt],
  }

  return {
    ...progress,
    chapters: {
      ...progress.chapters,
      [chapterSlug]: {
        ...chapter,
        [section]: updatedSection,
      },
    },
  }
}

export function markPhilosophyRead(
  progress: UserProgress,
  chapterSlug: string
): UserProgress {
  const chapter: ChapterProgress =
    progress.chapters[chapterSlug] ?? EMPTY_CHAPTER_PROGRESS

  return {
    ...progress,
    chapters: {
      ...progress.chapters,
      [chapterSlug]: {
        ...chapter,
        philosophy: { read: true },
      },
    },
  }
}

export function updateStreak(
  progress: UserProgress,
  today: string
): UserProgress {
  const { lastActiveDate, currentDays } = progress.streak

  if (lastActiveDate === today) return progress

  const lastDate = new Date(lastActiveDate)
  const todayDate = new Date(today)
  const diffMs = todayDate.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const newDays = diffDays === 1 ? currentDays + 1 : 1

  return {
    ...progress,
    streak: {
      currentDays: newDays,
      lastActiveDate: today,
    },
  }
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
pnpm test:run src/lib/__tests__/progress.test.ts
```

Expected: All 7 tests PASS.

**Step 5: Commit**

```bash
git add src/lib/progress.ts src/lib/__tests__/progress.test.ts
git commit -m "feat: add progress persistence with localStorage"
```

---

## Task 5: useProgress React Hook

**Files:**
- Create: `src/hooks/use-progress.ts`
- Test: `src/hooks/__tests__/use-progress.test.tsx`

**Step 1: Write the failing test**

Create `src/hooks/__tests__/use-progress.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import { useProgress } from "../use-progress"
import { EMPTY_PROGRESS } from "@/types/progress"

beforeEach(() => {
  localStorage.clear()
})

describe("useProgress", () => {
  it("returns empty progress initially", () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.progress).toEqual(EMPTY_PROGRESS)
  })

  it("records quiz attempt and persists", () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.recordAttempt("01-propositions", "theory", {
        quizId: "q1",
        correct: true,
        timestamp: "2025-01-30T10:00:00Z",
      })
    })

    expect(
      result.current.progress.chapters["01-propositions"].theory.attempts
    ).toHaveLength(1)

    const stored = JSON.parse(localStorage.getItem("logos-progress")!)
    expect(stored.chapters["01-propositions"].theory.attempts).toHaveLength(1)
  })
})
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test:run src/hooks/__tests__/use-progress.test.tsx
```

Expected: FAIL — module not found.

**Step 3: Implement the hook**

Create `src/hooks/use-progress.ts`:

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  loadProgress,
  saveProgress,
  recordQuizAttempt,
  markPhilosophyRead,
  updateStreak,
} from "@/lib/progress"
import { EMPTY_PROGRESS, type QuizAttempt, type UserProgress } from "@/types/progress"

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)

  useEffect(() => {
    const loaded = loadProgress()
    const today = new Date().toISOString().split("T")[0]
    const updated = updateStreak(loaded, today)
    setProgress(updated)
    saveProgress(updated)
  }, [])

  const persist = useCallback((next: UserProgress) => {
    setProgress(next)
    saveProgress(next)
  }, [])

  const recordAttempt = useCallback(
    (
      chapterSlug: string,
      section: "theory" | "practice",
      attempt: QuizAttempt
    ) => {
      setProgress((prev) => {
        const next = recordQuizAttempt(prev, chapterSlug, section, attempt)
        saveProgress(next)
        return next
      })
    },
    []
  )

  const markPhilosophy = useCallback((chapterSlug: string) => {
    setProgress((prev) => {
      const next = markPhilosophyRead(prev, chapterSlug)
      saveProgress(next)
      return next
    })
  }, [])

  return {
    progress,
    recordAttempt,
    markPhilosophy,
    persist,
  }
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
pnpm test:run src/hooks/__tests__/use-progress.test.tsx
```

Expected: All 2 tests PASS.

**Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useProgress hook for client-side progress management"
```

---

## Task 6: Chapter 1 Content — Quiz Data

**Files:**
- Create: `content/chapters/01-propositions/theory-quizzes.json`
- Create: `content/chapters/01-propositions/practice-quizzes.json`
- Create: `src/lib/content.ts`
- Test: `src/lib/__tests__/content.test.ts`

**Step 1: Create theory quiz data**

Create `content/chapters/01-propositions/theory-quizzes.json`:

```json
[
  {
    "id": "ch1-t1",
    "type": "multiple-choice",
    "question": "命題「PかつQ」（P ∧ Q）が真になるのはどのような場合ですか？",
    "options": [
      "PとQの両方が真のとき",
      "PまたはQの少なくとも一方が真のとき",
      "Pが真のとき",
      "PとQの少なくとも一方が偽のとき"
    ],
    "correctIndex": 0,
    "explanation": "論理積（AND）は、両方の命題が真である場合にのみ真になります。PかQのどちらか一方でも偽であれば、P ∧ Qは偽です。"
  },
  {
    "id": "ch1-t2",
    "type": "multiple-choice",
    "question": "命題「PまたはQ」（P ∨ Q）が偽になるのはどのような場合ですか？",
    "options": [
      "PとQの両方が偽のとき",
      "PとQの両方が真のとき",
      "Pだけが偽のとき",
      "Qだけが偽のとき"
    ],
    "correctIndex": 0,
    "explanation": "論理和（OR）は、両方の命題が偽である場合にのみ偽になります。どちらか一方でも真であれば、P ∨ Qは真です。"
  },
  {
    "id": "ch1-t3",
    "type": "multiple-choice",
    "question": "「PならばQ」（P → Q）が偽になるのはどのような場合ですか？",
    "options": [
      "Pが真でQが偽のとき",
      "Pが偽でQが真のとき",
      "PとQの両方が偽のとき",
      "PとQの両方が真のとき"
    ],
    "correctIndex": 0,
    "explanation": "条件文（IF-THEN）は、前件Pが真で後件Qが偽の場合にのみ偽になります。前件が偽の場合、結論が何であれ条件文全体は真です（空真）。"
  },
  {
    "id": "ch1-t4",
    "type": "truth-table",
    "expression": "P ∧ Q",
    "variables": ["P", "Q"],
    "expectedTable": [
      [true, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, false]
    ],
    "blanks": [2, 5, 8, 11]
  },
  {
    "id": "ch1-t5",
    "type": "truth-table",
    "expression": "P → Q",
    "variables": ["P", "Q"],
    "expectedTable": [
      [true, true, true],
      [true, false, false],
      [false, true, true],
      [false, false, true]
    ],
    "blanks": [2, 5, 8, 11]
  }
]
```

**Step 2: Create practice quiz data**

Create `content/chapters/01-propositions/practice-quizzes.json`:

```json
[
  {
    "id": "ch1-p1",
    "type": "multiple-choice",
    "question": "税務署から「売上が1000万円を超えており、かつ消費税の届出がない」と指摘されました。この論理構造はどれですか？",
    "options": [
      "P ∧ Q（PかつQ）",
      "P ∨ Q（PまたはQ）",
      "P → Q（PならばQ）",
      "¬P（Pではない）"
    ],
    "correctIndex": 0,
    "explanation": "「〜であり、かつ〜」は論理積（AND）です。この場合、P=「売上が1000万円超」かつQ=「届出がない」という2つの条件が同時に成り立っていることを主張しています。"
  },
  {
    "id": "ch1-p2",
    "type": "multiple-choice",
    "question": "営業先で「このサービスを導入すれば、コスト削減ができます」と提案しました。相手が「でも導入しなくてもコスト削減できるかもしれないよね」と返しました。この返答は論理的に正しいですか？",
    "options": [
      "正しい。「PならばQ」が真でも「Pでないならば Qでない」は必ずしも真ではない",
      "正しくない。導入しなければコスト削減できない",
      "正しくない。条件文の逆は常に真である",
      "判断できない。情報が不足している"
    ],
    "correctIndex": 0,
    "explanation": "「P→Q」（導入すればコスト削減）が真であっても、「¬P→¬Q」（導入しなければコスト削減できない）が真とは限りません。これは「裏」であり、元の命題とは論理的に独立です。相手の指摘は論理的に正当です。"
  },
  {
    "id": "ch1-p3",
    "type": "multiple-choice",
    "question": "コードレビューで「この関数はnullを返すか、またはエラーを投げる」という仕様を見ました。実際にnullを返してエラーも投げた場合、仕様を満たしていますか？",
    "options": [
      "論理学的にはYes（論理和は包含的OR）",
      "No（両方同時に起きてはいけない）",
      "仕様の記述が曖昧で判断できない",
      "プログラミング言語による"
    ],
    "correctIndex": 2,
    "explanation": "論理学の「または」（P ∨ Q）は包含的ORで、両方真でも真です。しかし日常言語やプログラミングの仕様書では排他的ORの意味で使われることもあります。この曖昧さに気づけることが、論理学の基礎を学ぶ価値です。"
  }
]
```

**Step 3: Write content loader with tests**

Create `src/lib/__tests__/content.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { getChapterQuizzes, getAllChapters } from "../content"

describe("getChapterQuizzes", () => {
  it("loads theory quizzes for chapter 01", () => {
    const quizzes = getChapterQuizzes("01-propositions", "theory")
    expect(quizzes.length).toBeGreaterThan(0)
    expect(quizzes[0].id).toBe("ch1-t1")
  })

  it("loads practice quizzes for chapter 01", () => {
    const quizzes = getChapterQuizzes("01-propositions", "practice")
    expect(quizzes.length).toBeGreaterThan(0)
    expect(quizzes[0].id).toBe("ch1-p1")
  })
})

describe("getAllChapters", () => {
  it("returns chapter metadata list", () => {
    const chapters = getAllChapters()
    expect(chapters).toHaveLength(1)
    expect(chapters[0].slug).toBe("01-propositions")
  })
})
```

**Step 4: Run test to verify it fails**

Run:
```bash
pnpm test:run src/lib/__tests__/content.test.ts
```

Expected: FAIL — module not found.

**Step 5: Implement content loader**

Create `src/lib/content.ts`:

```typescript
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
```

Note: You may need to add `"resolveJsonModule": true` to `tsconfig.json` if not already present.

**Step 6: Run tests to verify they pass**

Run:
```bash
pnpm test:run src/lib/__tests__/content.test.ts
```

Expected: All 3 tests PASS.

**Step 7: Commit**

```bash
git add content/ src/lib/content.ts src/lib/__tests__/content.test.ts
git commit -m "feat: add Chapter 1 quiz data and content loader"
```

---

## Task 7: MultipleChoiceQuiz Component

**Files:**
- Create: `src/components/quiz/MultipleChoiceQuiz.tsx`
- Test: `src/components/quiz/__tests__/MultipleChoiceQuiz.test.tsx`

**Step 1: Write the failing test**

Create `src/components/quiz/__tests__/MultipleChoiceQuiz.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { MultipleChoiceQuiz } from "../MultipleChoiceQuiz"
import type { MultipleChoiceQuiz as MCQuiz } from "@/types/content"

const QUIZ: MCQuiz = {
  id: "test-1",
  type: "multiple-choice",
  question: "1 + 1 = ?",
  options: ["1", "2", "3", "4"],
  correctIndex: 1,
  explanation: "1 + 1 equals 2.",
}

describe("MultipleChoiceQuiz", () => {
  it("renders question and options", () => {
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={vi.fn()} />)
    expect(screen.getByText("1 + 1 = ?")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("calls onAnswer with true when correct option selected", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))

    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("shows explanation after answering", async () => {
    const user = userEvent.setup()
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={vi.fn()} />)

    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))

    expect(screen.getByText("1 + 1 equals 2.")).toBeInTheDocument()
  })

  it("calls onAnswer with false when wrong option selected", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    await user.click(screen.getByText("3"))
    await user.click(screen.getByRole("button", { name: /回答/i }))

    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test:run src/components/quiz/__tests__/MultipleChoiceQuiz.test.tsx
```

Expected: FAIL.

**Step 3: Implement the component**

Create `src/components/quiz/MultipleChoiceQuiz.tsx`:

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MultipleChoiceQuiz as MCQuiz } from "@/types/content"
import { cn } from "@/lib/utils"

interface Props {
  readonly quiz: MCQuiz
  readonly onAnswer: (correct: boolean) => void
}

export function MultipleChoiceQuiz({ quiz, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedIndex === null) return
    setSubmitted(true)
    onAnswer(selectedIndex === quiz.correctIndex)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{quiz.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {quiz.options.map((option, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelectedIndex(i)}
              disabled={submitted}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                selectedIndex === i && !submitted && "border-primary bg-primary/5",
                submitted && i === quiz.correctIndex && "border-green-500 bg-green-50",
                submitted && selectedIndex === i && i !== quiz.correctIndex && "border-red-500 bg-red-50"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} disabled={selectedIndex === null}>
            回答する
          </Button>
        )}

        {submitted && (
          <div className={cn(
            "rounded-lg p-4 text-sm",
            selectedIndex === quiz.correctIndex
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          )}>
            <p className="font-medium mb-1">
              {selectedIndex === quiz.correctIndex ? "正解！" : "不正解"}
            </p>
            <p>{quiz.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
pnpm test:run src/components/quiz/__tests__/MultipleChoiceQuiz.test.tsx
```

Expected: All 4 tests PASS.

**Step 5: Commit**

```bash
git add src/components/quiz/
git commit -m "feat: add MultipleChoiceQuiz component with tests"
```

---

## Task 8: TruthTableQuiz Component

**Files:**
- Create: `src/components/quiz/TruthTableQuiz.tsx`
- Test: `src/components/quiz/__tests__/TruthTableQuiz.test.tsx`

**Step 1: Write the failing test**

Create `src/components/quiz/__tests__/TruthTableQuiz.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TruthTableQuiz } from "../TruthTableQuiz"
import type { TruthTableQuiz as TTQuiz } from "@/types/content"

const QUIZ: TTQuiz = {
  id: "tt-test-1",
  type: "truth-table",
  expression: "P ∧ Q",
  variables: ["P", "Q"],
  expectedTable: [
    [true, true, true],
    [true, false, false],
    [false, true, false],
    [false, false, false],
  ],
  blanks: [2, 5, 8, 11],
}

describe("TruthTableQuiz", () => {
  it("renders expression and variable headers", () => {
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={vi.fn()} />)
    expect(screen.getByText("P ∧ Q")).toBeInTheDocument()
    expect(screen.getByText("P")).toBeInTheDocument()
    expect(screen.getByText("Q")).toBeInTheDocument()
  })

  it("renders blank cells as toggle buttons", () => {
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={vi.fn()} />)
    const toggleButtons = screen.getAllByRole("button", { name: /^[TF?]$/i })
    expect(toggleButtons.length).toBeGreaterThanOrEqual(4)
  })

  it("calls onAnswer with true when all blanks correct", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    // Toggle all blank cells to correct values: T, F, F, F
    const toggleButtons = screen.getAllByRole("button", { name: /^\?$/ })
    // First blank: expected true → click once for T
    await user.click(toggleButtons[0])
    // Second blank: expected false → click twice (? → T → F)
    await user.click(toggleButtons[1])
    await user.click(toggleButtons[1])
    // Third blank: expected false → click twice
    await user.click(toggleButtons[2])
    await user.click(toggleButtons[2])
    // Fourth blank: expected false → click twice
    await user.click(toggleButtons[3])
    await user.click(toggleButtons[3])

    await user.click(screen.getByRole("button", { name: /回答/i }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })
})
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test:run src/components/quiz/__tests__/TruthTableQuiz.test.tsx
```

Expected: FAIL.

**Step 3: Implement the component**

Create `src/components/quiz/TruthTableQuiz.tsx`:

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TruthTableQuiz as TTQuiz } from "@/types/content"
import { cn } from "@/lib/utils"

interface Props {
  readonly quiz: TTQuiz
  readonly onAnswer: (correct: boolean) => void
}

type CellState = null | true | false

function cycleCellState(state: CellState): CellState {
  if (state === null) return true
  if (state === true) return false
  return null
}

function displayCellState(state: CellState): string {
  if (state === null) return "?"
  return state ? "T" : "F"
}

export function TruthTableQuiz({ quiz, onAnswer }: Props) {
  const [blanks, setBlanks] = useState<CellState[]>(
    () => quiz.blanks.map(() => null)
  )
  const [submitted, setSubmitted] = useState(false)

  const colCount = quiz.variables.length + 1
  const flatTable = quiz.expectedTable.flat()

  const handleToggle = (blankIndex: number) => {
    if (submitted) return
    setBlanks((prev) => {
      const next = [...prev]
      next[blankIndex] = cycleCellState(prev[blankIndex])
      return next
    })
  }

  const handleSubmit = () => {
    if (blanks.some((b) => b === null)) return
    setSubmitted(true)
    const allCorrect = quiz.blanks.every((flatIdx, blankIdx) => {
      return blanks[blankIdx] === flatTable[flatIdx]
    })
    onAnswer(allCorrect)
  }

  const blankSet = new Set(quiz.blanks)

  let blankCounter = 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          真理値表を完成させてください: {quiz.expression}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              {quiz.variables.map((v) => (
                <th key={v} className="border p-2 bg-muted">
                  {v}
                </th>
              ))}
              <th className="border p-2 bg-muted">{quiz.expression}</th>
            </tr>
          </thead>
          <tbody>
            {quiz.expectedTable.map((row, rowIdx) => {
              let rowBlankCounter = 0
              // Count blanks before this row
              const blanksBeforeRow = quiz.blanks.filter(
                (idx) => idx < rowIdx * colCount
              ).length

              return (
                <tr key={rowIdx}>
                  {row.map((cellValue, colIdx) => {
                    const flatIdx = rowIdx * colCount + colIdx
                    const isBlank = blankSet.has(flatIdx)
                    const currentBlankIdx = isBlank
                      ? blanksBeforeRow +
                        quiz.blanks
                          .filter(
                            (idx) =>
                              idx >= rowIdx * colCount &&
                              idx <= flatIdx
                          )
                          .length -
                        1
                      : -1

                    if (isBlank) {
                      const userValue = blanks[currentBlankIdx]
                      const isCorrect = submitted && userValue === cellValue

                      return (
                        <td key={colIdx} className="border p-2">
                          <button
                            onClick={() => handleToggle(currentBlankIdx)}
                            disabled={submitted}
                            className={cn(
                              "w-10 h-10 rounded font-mono font-bold",
                              !submitted && "bg-primary/10 hover:bg-primary/20",
                              submitted && isCorrect && "bg-green-100 text-green-800",
                              submitted && !isCorrect && "bg-red-100 text-red-800"
                            )}
                          >
                            {displayCellState(userValue)}
                          </button>
                        </td>
                      )
                    }

                    return (
                      <td key={colIdx} className="border p-2 font-mono">
                        {cellValue ? "T" : "F"}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={blanks.some((b) => b === null)}
            className="mt-4"
          >
            回答する
          </Button>
        )}

        {submitted && (
          <div
            className={cn(
              "mt-4 rounded-lg p-4 text-sm",
              blanks.every(
                (b, i) => b === flatTable[quiz.blanks[i]]
              )
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            )}
          >
            {blanks.every((b, i) => b === flatTable[quiz.blanks[i]])
              ? "正解！全ての値が正しいです。"
              : "不正解。赤いセルを確認してください。"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
pnpm test:run src/components/quiz/__tests__/TruthTableQuiz.test.tsx
```

Expected: All 3 tests PASS.

**Step 5: Commit**

```bash
git add src/components/quiz/TruthTableQuiz.tsx src/components/quiz/__tests__/TruthTableQuiz.test.tsx
git commit -m "feat: add TruthTableQuiz interactive component with tests"
```

---

## Task 9: QuizRunner Component (Orchestrates Quiz Sequence)

**Files:**
- Create: `src/components/quiz/QuizRunner.tsx`
- Test: `src/components/quiz/__tests__/QuizRunner.test.tsx`

**Step 1: Write the failing test**

Create `src/components/quiz/__tests__/QuizRunner.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { QuizRunner } from "../QuizRunner"
import type { Quiz } from "@/types/content"

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "Q1: What is 1+1?",
    options: ["1", "2"],
    correctIndex: 1,
    explanation: "It's 2.",
  },
  {
    id: "q2",
    type: "multiple-choice",
    question: "Q2: What is 2+2?",
    options: ["3", "4"],
    correctIndex: 1,
    explanation: "It's 4.",
  },
]

describe("QuizRunner", () => {
  it("shows first quiz initially", () => {
    render(<QuizRunner quizzes={QUIZZES} onComplete={vi.fn()} />)
    expect(screen.getByText("Q1: What is 1+1?")).toBeInTheDocument()
  })

  it("shows progress indicator", () => {
    render(<QuizRunner quizzes={QUIZZES} onComplete={vi.fn()} />)
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("advances to next quiz after answering", async () => {
    const user = userEvent.setup()
    render(<QuizRunner quizzes={QUIZZES} onComplete={vi.fn()} />)

    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))
    await user.click(screen.getByRole("button", { name: /次へ/i }))

    expect(screen.getByText("Q2: What is 2+2?")).toBeInTheDocument()
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
  })

  it("calls onComplete with results after last quiz", async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    render(<QuizRunner quizzes={QUIZZES} onComplete={onComplete} />)

    // Answer Q1
    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))
    await user.click(screen.getByRole("button", { name: /次へ/i }))

    // Answer Q2
    await user.click(screen.getByText("4"))
    await user.click(screen.getByRole("button", { name: /回答/i }))
    await user.click(screen.getByRole("button", { name: /完了/i }))

    expect(onComplete).toHaveBeenCalledWith([
      { quizId: "q1", correct: true },
      { quizId: "q2", correct: true },
    ])
  })
})
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test:run src/components/quiz/__tests__/QuizRunner.test.tsx
```

Expected: FAIL.

**Step 3: Implement the component**

Create `src/components/quiz/QuizRunner.tsx`:

```tsx
"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz"
import { TruthTableQuiz } from "./TruthTableQuiz"
import type { Quiz } from "@/types/content"

interface QuizResult {
  readonly quizId: string
  readonly correct: boolean
}

interface Props {
  readonly quizzes: readonly Quiz[]
  readonly onComplete: (results: readonly QuizResult[]) => void
}

export function QuizRunner({ quizzes, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])
  const [answered, setAnswered] = useState(false)

  const currentQuiz = quizzes[currentIndex]
  const isLast = currentIndex === quizzes.length - 1

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setResults((prev) => [
        ...prev,
        { quizId: currentQuiz.id, correct },
      ])
      setAnswered(true)
    },
    [currentQuiz.id]
  )

  const handleNext = () => {
    if (isLast) {
      onComplete(results)
      return
    }
    setCurrentIndex((prev) => prev + 1)
    setAnswered(false)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {currentIndex + 1} / {quizzes.length}
      </div>

      {currentQuiz.type === "multiple-choice" && (
        <MultipleChoiceQuiz quiz={currentQuiz} onAnswer={handleAnswer} />
      )}
      {currentQuiz.type === "truth-table" && (
        <TruthTableQuiz quiz={currentQuiz} onAnswer={handleAnswer} />
      )}

      {answered && (
        <Button onClick={handleNext}>
          {isLast ? "完了" : "次へ"}
        </Button>
      )}
    </div>
  )
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
pnpm test:run src/components/quiz/__tests__/QuizRunner.test.tsx
```

Expected: All 4 tests PASS.

**Step 5: Commit**

```bash
git add src/components/quiz/QuizRunner.tsx src/components/quiz/__tests__/QuizRunner.test.tsx
git commit -m "feat: add QuizRunner component for quiz sequence orchestration"
```

---

## Task 10: Chapter Theory Page

**Files:**
- Create: `src/app/chapters/[slug]/theory/page.tsx`
- Create: `content/chapters/01-propositions/theory.tsx` (JSX content, not MDX for MVP simplicity)

**Step 1: Create theory lesson content**

Create `content/chapters/01-propositions/theory.tsx`:

```tsx
export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第1章: 命題と論理結合子</h1>

      <h2>命題とは何か</h2>
      <p>
        <strong>命題（proposition）</strong>とは、真か偽のいずれか一方の値を持つ文のことです。
      </p>
      <ul>
        <li>「東京は日本の首都である」→ 命題（真）</li>
        <li>「2 + 3 = 6」→ 命題（偽）</li>
        <li>「今日は良い天気ですね」→ 命題ではない（真偽が不確定）</li>
      </ul>

      <h2>論理結合子（Logical Connectives）</h2>
      <p>
        複数の命題を組み合わせるための記号を<strong>論理結合子</strong>と呼びます。
      </p>

      <h3>否定（NOT）: ¬P</h3>
      <p>
        命題Pの真偽を反転させます。Pが真なら¬Pは偽、Pが偽なら¬Pは真です。
      </p>

      <h3>論理積（AND）: P ∧ Q</h3>
      <p>
        PとQの<strong>両方が真</strong>のときだけ真になります。
        日常語では「PかつQ」「PでありQ」に対応します。
      </p>

      <h3>論理和（OR）: P ∨ Q</h3>
      <p>
        PとQの<strong>少なくとも一方が真</strong>なら真になります。
        注意：論理学のORは「包含的OR」です。両方真でも真です。
      </p>

      <h3>条件文（IF-THEN）: P → Q</h3>
      <p>
        「PならばQ」を表します。<strong>Pが真でQが偽のときだけ偽</strong>になります。
        直感に反するかもしれませんが、Pが偽のとき、P → Qは常に真です（空真、vacuous truth）。
      </p>

      <h3>双条件文（IFF）: P ↔ Q</h3>
      <p>
        「PならばQであり、かつQならばP」を表します。
        PとQの真偽が<strong>一致するとき</strong>に真になります。
      </p>
    </article>
  )
}
```

**Step 2: Create theory page**

Create `src/app/chapters/[slug]/theory/page.tsx`:

```tsx
"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { TheoryContent } from "../../../../../content/chapters/01-propositions/theory"
import Link from "next/link"

export default function TheoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const quizzes = getChapterQuizzes(slug, "theory")
  const { recordAttempt } = useProgress()

  const handleComplete = (
    results: readonly { quizId: string; correct: boolean }[]
  ) => {
    const timestamp = new Date().toISOString()
    for (const result of results) {
      recordAttempt(slug, "theory", {
        quizId: result.quizId,
        correct: result.correct,
        timestamp,
      })
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        <Link href={`/chapters/${slug}`} className="hover:underline">{chapter.title}</Link>
        {" / "}
        学問編
      </div>

      <TheoryContent />

      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-4">確認クイズ</h2>
        <QuizRunner quizzes={quizzes} onComplete={handleComplete} />
      </div>

      <div className="flex justify-between pt-4">
        <Link href={`/chapters/${slug}`}>
          <Button variant="outline">チャプターに戻る</Button>
        </Link>
        <Link href={`/chapters/${slug}/practice`}>
          <Button>実践編へ →</Button>
        </Link>
      </div>
    </div>
  )
}
```

**Step 3: Verify page renders**

Run:
```bash
pnpm dev
```

Open http://localhost:3000/chapters/01-propositions/theory — verify lesson content and quizzes render.

**Step 4: Commit**

```bash
git add content/chapters/01-propositions/theory.tsx src/app/chapters/
git commit -m "feat: add Chapter 1 theory page with lesson content and quizzes"
```

---

## Task 11: Chapter Practice Page

**Files:**
- Create: `src/app/chapters/[slug]/practice/page.tsx`

**Step 1: Create practice page**

Create `src/app/chapters/[slug]/practice/page.tsx`:

```tsx
"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizRunner } from "@/components/quiz/QuizRunner"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import Link from "next/link"

export default function PracticePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const quizzes = getChapterQuizzes(slug, "practice")
  const { recordAttempt } = useProgress()

  const handleComplete = (
    results: readonly { quizId: string; correct: boolean }[]
  ) => {
    const timestamp = new Date().toISOString()
    for (const result of results) {
      recordAttempt(slug, "practice", {
        quizId: result.quizId,
        correct: result.correct,
        timestamp,
      })
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        <Link href={`/chapters/${slug}`} className="hover:underline">{chapter.title}</Link>
        {" / "}
        実践編
      </div>

      <div className="prose prose-zinc max-w-none">
        <h1>実践編: {chapter.title}</h1>
        <p>
          学問編で学んだ論理結合子を、ビジネスや日常生活の場面に適用してみましょう。
          税務署との対話、営業トーク、コードレビューなど、実際のシナリオで論理的に考える練習です。
        </p>
      </div>

      <QuizRunner quizzes={quizzes} onComplete={handleComplete} />

      <div className="flex justify-between pt-4">
        <Link href={`/chapters/${slug}/theory`}>
          <Button variant="outline">← 学問編に戻る</Button>
        </Link>
        <Link href={`/chapters/${slug}/philosophy`}>
          <Button>哲学コラムへ →</Button>
        </Link>
      </div>
    </div>
  )
}
```

**Step 2: Verify page renders**

Run dev server and open http://localhost:3000/chapters/01-propositions/practice.

**Step 3: Commit**

```bash
git add src/app/chapters/
git commit -m "feat: add Chapter 1 practice page with scenario-based quizzes"
```

---

## Task 12: Chapter Philosophy Page

**Files:**
- Create: `content/chapters/01-propositions/philosophy.tsx`
- Create: `src/app/chapters/[slug]/philosophy/page.tsx`

**Step 1: Create philosophy content**

Create `content/chapters/01-propositions/philosophy.tsx`:

```tsx
export function PhilosophyContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>哲学コラム: 論理学の起源</h1>

      <h2>アリストテレスの三段論法</h2>
      <p>
        西洋論理学の祖とされるアリストテレス（紀元前384-322年）は、
        『オルガノン』（道具）と総称される一連の著作で形式論理学の基礎を築きました。
      </p>
      <p>
        最も有名な三段論法の例を見てみましょう：
      </p>
      <blockquote>
        <p>すべての人間は死すべきものである（大前提）</p>
        <p>ソクラテスは人間である（小前提）</p>
        <p>ゆえに、ソクラテスは死すべきものである（結論）</p>
      </blockquote>
      <p>
        これは「P → Q、P、ゆえにQ」というモーダスポネンス（肯定式）の原型です。
        あなたが第1章で学んだ条件文（P → Q）が、2400年前にすでに形式化されていたのです。
      </p>

      <h2>ストア派の命題論理</h2>
      <p>
        アリストテレスが項の論理（述語論理の原型）を扱ったのに対し、
        ストア派の哲学者クリュシッポス（紀元前279-206年）は
        命題全体を単位とする論理学を発展させました。
      </p>
      <p>
        ストア派は5つの基本的な推論規則（不可証明推論）を定め、
        これが現代の命題論理の先駆けとなりました。
        第1章で学んだ ∧（AND）、∨（OR）、→（IF-THEN）の操作は、
        このストア派の伝統に直接つながっています。
      </p>

      <h2>なぜ論理学を学ぶのか — 哲学的視点から</h2>
      <p>
        古代ギリシャの哲学者たちが論理学を重視した理由は、
        「正しく考えること」こそが「正しく生きること」の前提だと考えたからです。
        論理は単なる道具ではなく、理性（ロゴス）そのものの表現です。
      </p>
      <p>
        このアプリの名前「Logos」には、そのような意味が込められています。
      </p>
    </article>
  )
}
```

**Step 2: Create philosophy page**

Create `src/app/chapters/[slug]/philosophy/page.tsx`:

```tsx
"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getChapterMeta } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { PhilosophyContent } from "../../../../../content/chapters/01-propositions/philosophy"
import Link from "next/link"
import { useEffect } from "react"

export default function PhilosophyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const { markPhilosophy } = useProgress()

  useEffect(() => {
    markPhilosophy(slug)
  }, [slug, markPhilosophy])

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        <Link href={`/chapters/${slug}`} className="hover:underline">{chapter.title}</Link>
        {" / "}
        哲学コラム
      </div>

      <PhilosophyContent />

      <div className="flex justify-between pt-4">
        <Link href={`/chapters/${slug}/practice`}>
          <Button variant="outline">← 実践編に戻る</Button>
        </Link>
        <Link href="/">
          <Button>ダッシュボードへ</Button>
        </Link>
      </div>
    </div>
  )
}
```

**Step 3: Verify page renders**

Open http://localhost:3000/chapters/01-propositions/philosophy.

**Step 4: Commit**

```bash
git add content/chapters/01-propositions/philosophy.tsx src/app/chapters/
git commit -m "feat: add Chapter 1 philosophy column with historical context"
```

---

## Task 13: Chapter Landing Page

**Files:**
- Create: `src/app/chapters/[slug]/page.tsx`

**Step 1: Create chapter landing page**

Create `src/app/chapters/[slug]/page.tsx`:

```tsx
"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getChapterMeta } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"

const SECTIONS = [
  {
    key: "theory" as const,
    title: "学問編",
    description: "形式論理学の基礎概念と確認クイズ",
    path: "theory",
    emoji: "📐",
  },
  {
    key: "practice" as const,
    title: "実践編",
    description: "ビジネス・日常生活での応用シナリオ",
    path: "practice",
    emoji: "💼",
  },
  {
    key: "philosophy" as const,
    title: "哲学コラム",
    description: "論理学の哲学的背景と歴史",
    path: "philosophy",
    emoji: "🏛️",
  },
]

export default function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const { progress } = useProgress()
  const chapterProgress =
    progress.chapters[slug] ?? EMPTY_CHAPTER_PROGRESS

  function getSectionStatus(key: "theory" | "practice" | "philosophy") {
    if (key === "philosophy") {
      return chapterProgress.philosophy.read ? "完了" : "未読"
    }
    const section = chapterProgress[key]
    if (section.attempts.length === 0) return "未着手"
    if (section.completed) return "完了"
    return "進行中"
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        {chapter.title}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
        <p className="text-muted-foreground mt-2">{chapter.description}</p>
      </div>

      <div className="grid gap-4">
        {SECTIONS.map((section) => {
          const status = getSectionStatus(section.key)
          return (
            <Link key={section.key} href={`/chapters/${slug}/${section.path}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {section.emoji} {section.title}
                  </CardTitle>
                  <Badge
                    variant={status === "完了" ? "default" : "secondary"}
                  >
                    {status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Link href="/" className="block">
        <p className="text-sm text-muted-foreground hover:underline">
          ← ダッシュボードに戻る
        </p>
      </Link>
    </div>
  )
}
```

**Step 2: Verify page renders**

Open http://localhost:3000/chapters/01-propositions.

**Step 3: Commit**

```bash
git add src/app/chapters/
git commit -m "feat: add chapter landing page with 3-section navigation"
```

---

## Task 14: Dashboard (Home Page)

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Implement dashboard**

Replace `src/app/page.tsx` with:

```tsx
"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getAllChapters } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"

export default function HomePage() {
  const chapters = getAllChapters()
  const { progress } = useProgress()

  function getChapterCompletion(slug: string): number {
    const cp = progress.chapters[slug] ?? EMPTY_CHAPTER_PROGRESS
    let completed = 0
    if (cp.theory.attempts.length > 0) completed++
    if (cp.practice.attempts.length > 0) completed++
    if (cp.philosophy.read) completed++
    return Math.round((completed / 3) * 100)
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Logos</h1>
        <p className="text-muted-foreground mt-2">
          論理学の基礎を学び、実務に活かす
        </p>
      </div>

      {progress.streak.currentDays > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-orange-500 font-bold">🔥</span>
          <span>{progress.streak.currentDays}日連続学習中</span>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">チャプター</h2>
        {chapters.map((chapter) => {
          const completion = getChapterCompletion(chapter.slug)
          return (
            <Link key={chapter.slug} href={`/chapters/${chapter.slug}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{chapter.title}</CardTitle>
                  <Badge variant={completion === 100 ? "default" : "secondary"}>
                    {completion}%
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {chapter.description}
                  </p>
                  <Progress value={completion} className="h-2" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 2: Update layout for clean styling**

Modify `src/app/layout.tsx` — ensure the body has clean typography. The exact content depends on what create-next-app generated, but ensure:
- `className` on `<body>` includes the font and `antialiased`
- No unnecessary default Next.js template content

**Step 3: Verify page renders**

Open http://localhost:3000 — verify dashboard shows Chapter 1 with progress bar and streak.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add dashboard with chapter progress and streak display"
```

---

## Task 15: End-to-End Smoke Test

**Files:**
- No new files

**Step 1: Build the project**

Run:
```bash
pnpm build
```

Expected: Build succeeds with no errors.

**Step 2: Run all tests**

Run:
```bash
pnpm test:run
```

Expected: All tests pass.

**Step 3: Manual smoke test**

Run `pnpm dev` and verify:
1. Dashboard loads at `/` showing Chapter 1
2. Click Chapter 1 → landing page with 3 sections
3. Click 学問編 → theory content + quizzes work
4. Answer quizzes → feedback shown
5. Navigate to 実践編 → scenario quizzes work
6. Navigate to 哲学コラム → content loads
7. Return to dashboard → progress percentage updated
8. Refresh page → progress persisted in localStorage

**Step 4: Commit any fixes from smoke testing**

```bash
git add -A
git commit -m "fix: address issues found during smoke testing"
```

(Only if fixes were needed.)

---

## Summary

| Task | Description | Tests |
|------|-------------|-------|
| 1 | Project scaffolding | - |
| 2 | Dependencies & shadcn/ui | - |
| 3 | Type definitions | - |
| 4 | Progress persistence | 7 tests |
| 5 | useProgress hook | 2 tests |
| 6 | Chapter 1 quiz data + content loader | 3 tests |
| 7 | MultipleChoiceQuiz component | 4 tests |
| 8 | TruthTableQuiz component | 3 tests |
| 9 | QuizRunner component | 4 tests |
| 10 | Theory page | manual |
| 11 | Practice page | manual |
| 12 | Philosophy page | manual |
| 13 | Chapter landing page | manual |
| 14 | Dashboard | manual |
| 15 | E2E smoke test | manual |

**Total automated tests: 23**
