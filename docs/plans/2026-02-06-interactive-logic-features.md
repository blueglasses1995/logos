# Interactive Logic Learning Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 10 interactive features to Logos that transform passive reading into active learning — visualizations, new quiz types, and inline interactivity across all 11 chapters.

**Architecture:** Each feature is a self-contained React component following existing patterns (content components for theory pages, quiz components for QuizRunner). New quiz types extend the `Quiz` union type in `src/types/content.ts` and are dispatched in `QuizRunner.tsx`. Interactive content components are embedded directly in `theory.tsx` files alongside existing `Callout`, `FormulaBlock`, etc. All state is local (no new global state).

**Tech Stack:** React 19 + Next.js 16, Tailwind CSS 4, `@dnd-kit/core` (~16kB) for drag-and-drop, pure SVG for diagrams, CSS transitions for animation.

**New Dependency:** `@dnd-kit/core` + `@dnd-kit/sortable` (only dependency added)

---

## Feature Overview

| # | Feature | Type | Category |
|---|---------|------|----------|
| F1 | TruthValueAnimator | Interactive content component | Visualization |
| F2 | ArgumentTree | Interactive content component | Visualization |
| F3 | VennDiagram | Interactive content component | Visualization |
| F4 | ExampleMapping | Content component | Visualization |
| F5 | InlineMiniQuiz | Interactive content component | Theory interactivity |
| F6 | LogicSandbox | Interactive content component | Theory interactivity |
| F7 | ProofBuilder | New quiz type | Quiz |
| F8 | FallacySpotter | New quiz type | Quiz |
| F9 | CounterexampleChallenge | New quiz type | Quiz |
| F10 | GapFillProof | New quiz type | Quiz |

---

## Task 1: Install @dnd-kit dependency

**Files:**
- Modify: `package.json`

**Step 1: Install**

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Step 2: Verify build**

```bash
pnpm build
```

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @dnd-kit for drag-and-drop quiz interactions"
```

---

## Task 2: Extend Quiz type system for 4 new quiz types

**Files:**
- Modify: `src/types/content.ts`
- Test: `src/types/__tests__/content-types.test.ts`

**Step 1: Write the type test**

Create `src/types/__tests__/content-types.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import type {
  Quiz,
  ProofBuilderQuiz,
  FallacySpotterQuiz,
  CounterexampleQuiz,
  GapFillProofQuiz,
} from "@/types/content"

describe("Quiz type system", () => {
  it("narrows ProofBuilderQuiz by type field", () => {
    const quiz: Quiz = {
      id: "test-pb1",
      type: "proof-builder",
      conclusion: "Q",
      availablePremises: [
        { id: "p1", label: "P → Q", rule: "given" },
        { id: "p2", label: "P", rule: "given" },
      ],
      correctOrder: ["p2", "p1"],
      explanation: "Modus ponens: P and P→Q gives Q",
    }
    if (quiz.type === "proof-builder") {
      expect(quiz.conclusion).toBe("Q")
      expect(quiz.availablePremises).toHaveLength(2)
      expect(quiz.correctOrder).toEqual(["p2", "p1"])
    }
  })

  it("narrows FallacySpotterQuiz by type field", () => {
    const quiz: Quiz = {
      id: "test-fs1",
      type: "fallacy-spotter",
      passage: "He's young, so his proposal is unreliable.",
      fallacyType: "ad-hominem",
      distractors: ["straw-man", "false-dilemma", "slippery-slope"],
      explanation: "Attacks the person, not the argument",
    }
    if (quiz.type === "fallacy-spotter") {
      expect(quiz.fallacyType).toBe("ad-hominem")
    }
  })

  it("narrows CounterexampleQuiz by type field", () => {
    const quiz: Quiz = {
      id: "test-ce1",
      type: "counterexample",
      argument: "All birds can fly. Penguins are birds. Therefore penguins can fly.",
      premises: ["All birds can fly", "Penguins are birds"],
      conclusion: "Penguins can fly",
      vulnerablePremiseIndex: 0,
      counterexamples: [
        { id: "ce1", text: "Penguins cannot fly", isValid: true },
        { id: "ce2", text: "Some fish can fly", isValid: false },
      ],
      explanation: "The first premise is false — not all birds can fly",
    }
    if (quiz.type === "counterexample") {
      expect(quiz.vulnerablePremiseIndex).toBe(0)
    }
  })

  it("narrows GapFillProofQuiz by type field", () => {
    const quiz: Quiz = {
      id: "test-gf1",
      type: "gap-fill-proof",
      steps: [
        { id: "s1", content: "P → Q", type: "given" },
        { id: "s2", content: "___", type: "gap", correctValue: "P", options: ["P", "Q", "¬P", "¬Q"] },
        { id: "s3", content: "Q", type: "derived", rule: "Modus Ponens (s1, s2)" },
      ],
      explanation: "Fill in the missing premise for modus ponens",
    }
    if (quiz.type === "gap-fill-proof") {
      expect(quiz.steps).toHaveLength(3)
    }
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm vitest run src/types/__tests__/content-types.test.ts
```
Expected: FAIL — types don't exist yet

**Step 3: Add the types to content.ts**

Modify `src/types/content.ts`:

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

// --- New Quiz Types ---

export interface PremiseCard {
  readonly id: string
  readonly label: string
  readonly rule: string
}

export interface ProofBuilderQuiz {
  readonly id: string
  readonly type: "proof-builder"
  readonly conclusion: string
  readonly availablePremises: readonly PremiseCard[]
  readonly correctOrder: readonly string[]
  readonly explanation: string
}

export type FallacyType =
  | "ad-hominem"
  | "straw-man"
  | "false-dilemma"
  | "slippery-slope"
  | "appeal-to-authority"
  | "appeal-to-emotion"
  | "appeal-to-popularity"
  | "begging-the-question"
  | "correlation-causation"

export interface FallacySpotterQuiz {
  readonly id: string
  readonly type: "fallacy-spotter"
  readonly passage: string
  readonly fallacyType: FallacyType
  readonly distractors: readonly FallacyType[]
  readonly explanation: string
}

export interface CounterexampleOption {
  readonly id: string
  readonly text: string
  readonly isValid: boolean
}

export interface CounterexampleQuiz {
  readonly id: string
  readonly type: "counterexample"
  readonly argument: string
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly vulnerablePremiseIndex: number
  readonly counterexamples: readonly CounterexampleOption[]
  readonly explanation: string
}

export interface ProofStep {
  readonly id: string
  readonly content: string
  readonly type: "given" | "gap" | "derived"
  readonly rule?: string
  readonly correctValue?: string
  readonly options?: readonly string[]
}

export interface GapFillProofQuiz {
  readonly id: string
  readonly type: "gap-fill-proof"
  readonly steps: readonly ProofStep[]
  readonly explanation: string
}

export type Quiz =
  | MultipleChoiceQuiz
  | TruthTableQuiz
  | ProofBuilderQuiz
  | FallacySpotterQuiz
  | CounterexampleQuiz
  | GapFillProofQuiz

// --- Chapter Types ---

export interface ChapterMeta {
  readonly slug: string
  readonly title: string
  readonly order: number
  readonly description: string
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm vitest run src/types/__tests__/content-types.test.ts
```
Expected: PASS

**Step 5: Run full tests**

```bash
pnpm vitest run
```
Expected: All 64+ tests pass

**Step 6: Commit**

```bash
git add src/types/content.ts src/types/__tests__/content-types.test.ts
git commit -m "feat: add ProofBuilder, FallacySpotter, Counterexample, GapFillProof quiz types"
```

---

## Task 3: TruthValueAnimator — Interactive truth value toggling

Users toggle P and Q values and see the entire formula's truth value update in real-time with animation.

**Files:**
- Create: `src/components/interactive/truth-value-animator.tsx`
- Create: `src/components/interactive/__tests__/truth-value-animator.test.tsx`
- Create: `src/components/interactive/index.ts`

**Step 1: Write the test**

Create `src/components/interactive/__tests__/truth-value-animator.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TruthValueAnimator } from "../truth-value-animator"

describe("TruthValueAnimator", () => {
  it("renders variable toggle buttons", () => {
    render(
      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(vals) => vals.P && vals.Q}
      />
    )
    expect(screen.getByRole("button", { name: /P/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Q/ })).toBeInTheDocument()
  })

  it("shows initial values as True", () => {
    render(
      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(vals) => vals.P && vals.Q}
      />
    )
    expect(screen.getByTestId("result-value")).toHaveTextContent("T")
  })

  it("updates result when toggling a variable", async () => {
    const user = userEvent.setup()
    render(
      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(vals) => vals.P && vals.Q}
      />
    )
    // Toggle P to false → P ∧ Q becomes false
    await user.click(screen.getByRole("button", { name: /P/ }))
    expect(screen.getByTestId("result-value")).toHaveTextContent("F")
  })

  it("displays the formula", () => {
    render(
      <TruthValueAnimator
        variables={["P"]}
        formula="¬P"
        evaluate={(vals) => !vals.P}
      />
    )
    expect(screen.getByText("¬P")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm vitest run src/components/interactive/__tests__/truth-value-animator.test.tsx
```

**Step 3: Implement the component**

Create `src/components/interactive/truth-value-animator.tsx`:

```tsx
"use client"

import { useState, useCallback } from "react"

interface TruthValueAnimatorProps {
  readonly variables: readonly string[]
  readonly formula: string
  readonly evaluate: (values: Readonly<Record<string, boolean>>) => boolean
  readonly caption?: string
}

export function TruthValueAnimator({
  variables,
  formula,
  evaluate,
  caption,
}: TruthValueAnimatorProps) {
  const [values, setValues] = useState<Readonly<Record<string, boolean>>>(() =>
    Object.fromEntries(variables.map((v) => [v, true]))
  )

  const result = evaluate(values)

  const toggle = useCallback((variable: string) => {
    setValues((prev) => ({ ...prev, [variable]: !prev[variable] }))
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-6 py-5">
        <div className="flex items-center justify-center gap-4 mb-4">
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              aria-label={`${v}: ${values[v] ? "True" : "False"} — クリックで切替`}
              onClick={() => toggle(v)}
              className={`
                px-4 py-2 rounded-md font-mono text-base font-semibold
                transition-all duration-300 ease-out
                border-2 cursor-pointer select-none
                ${
                  values[v]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                    : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                }
              `}
            >
              {v} = {values[v] ? "T" : "F"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <code className="text-base font-mono text-foreground">{formula}</code>
          <span className="text-muted-foreground">=</span>
          <span
            data-testid="result-value"
            className={`
              text-xl font-mono font-bold
              transition-all duration-300 ease-out
              ${
                result
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }
            `}
          >
            {result ? "T" : "F"}
          </span>
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

Create `src/components/interactive/index.ts`:

```typescript
export { TruthValueAnimator } from "./truth-value-animator"
```

**Step 4: Run test**

```bash
pnpm vitest run src/components/interactive/__tests__/truth-value-animator.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/interactive/
git commit -m "feat: add TruthValueAnimator interactive component"
```

---

## Task 4: ArgumentTree — SVG-based argument structure visualization

Renders premises → conclusion as an SVG tree with connecting lines.

**Files:**
- Create: `src/components/interactive/argument-tree.tsx`
- Create: `src/components/interactive/__tests__/argument-tree.test.tsx`

**Step 1: Write the test**

Create `src/components/interactive/__tests__/argument-tree.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ArgumentTree } from "../argument-tree"

describe("ArgumentTree", () => {
  it("renders premises and conclusion", () => {
    render(
      <ArgumentTree
        premises={["P → Q", "P"]}
        conclusion="Q"
        rule="Modus Ponens"
      />
    )
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("P")).toBeInTheDocument()
    expect(screen.getByText("Q")).toBeInTheDocument()
    expect(screen.getByText("Modus Ponens")).toBeInTheDocument()
  })

  it("renders the SVG element", () => {
    const { container } = render(
      <ArgumentTree
        premises={["A", "B"]}
        conclusion="C"
        rule="Rule"
      />
    )
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders a caption when provided", () => {
    render(
      <ArgumentTree
        premises={["P"]}
        conclusion="Q"
        rule="Rule"
        caption="Example argument"
      />
    )
    expect(screen.getByText("Example argument")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm vitest run src/components/interactive/__tests__/argument-tree.test.tsx
```

**Step 3: Implement**

Create `src/components/interactive/argument-tree.tsx`:

```tsx
interface ArgumentTreeProps {
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly rule: string
  readonly caption?: string
}

const NODE_WIDTH = 140
const NODE_HEIGHT = 40
const VERTICAL_GAP = 60
const HORIZONTAL_GAP = 16

export function ArgumentTree({
  premises,
  conclusion,
  rule,
  caption,
}: ArgumentTreeProps) {
  const totalWidth = premises.length * NODE_WIDTH + (premises.length - 1) * HORIZONTAL_GAP
  const svgWidth = Math.max(totalWidth, NODE_WIDTH) + 40
  const svgHeight = NODE_HEIGHT * 2 + VERTICAL_GAP + 60

  const premiseY = 20
  const conclusionY = premiseY + NODE_HEIGHT + VERTICAL_GAP
  const conclusionX = svgWidth / 2

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-4 py-4 flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-lg"
          role="img"
          aria-label={`論証構造: ${premises.join(", ")} → ${conclusion}`}
        >
          {/* Premises */}
          {premises.map((premise, i) => {
            const x =
              (svgWidth - totalWidth) / 2 +
              i * (NODE_WIDTH + HORIZONTAL_GAP) +
              NODE_WIDTH / 2
            return (
              <g key={premise}>
                {/* Premise box */}
                <rect
                  x={x - NODE_WIDTH / 2}
                  y={premiseY}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={6}
                  className="fill-primary/10 stroke-primary/40"
                  strokeWidth={1.5}
                />
                <text
                  x={x}
                  y={premiseY + NODE_HEIGHT / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-mono fill-foreground"
                >
                  {premise}
                </text>
                {/* Connecting line */}
                <line
                  x1={x}
                  y1={premiseY + NODE_HEIGHT}
                  x2={conclusionX}
                  y2={conclusionY}
                  className="stroke-primary/30"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              </g>
            )
          })}

          {/* Rule label */}
          <text
            x={conclusionX + NODE_WIDTH / 2 + 8}
            y={(premiseY + NODE_HEIGHT + conclusionY) / 2}
            className="text-[10px] fill-muted-foreground italic"
            dominantBaseline="middle"
          >
            {rule}
          </text>

          {/* Conclusion box */}
          <rect
            x={conclusionX - NODE_WIDTH / 2}
            y={conclusionY}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx={6}
            className="fill-primary/20 stroke-primary"
            strokeWidth={2}
          />
          <text
            x={conclusionX}
            y={conclusionY + NODE_HEIGHT / 2 + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-mono font-bold fill-foreground"
          >
            ∴ {conclusion}
          </text>
        </svg>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

**Step 4: Run test**

```bash
pnpm vitest run src/components/interactive/__tests__/argument-tree.test.tsx
```

**Step 5: Update barrel export**

Add to `src/components/interactive/index.ts`:

```typescript
export { TruthValueAnimator } from "./truth-value-animator"
export { ArgumentTree } from "./argument-tree"
```

**Step 6: Commit**

```bash
git add src/components/interactive/
git commit -m "feat: add ArgumentTree SVG visualization component"
```

---

## Task 5: VennDiagram — Interactive set visualization

SVG-based Venn/Euler diagram for visualizing quantifiers and set operations.

**Files:**
- Create: `src/components/interactive/venn-diagram.tsx`
- Create: `src/components/interactive/__tests__/venn-diagram.test.tsx`

**Step 1: Write the test**

Create `src/components/interactive/__tests__/venn-diagram.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { VennDiagram } from "../venn-diagram"

describe("VennDiagram", () => {
  it("renders two circle labels", () => {
    render(<VennDiagram labelA="Dogs" labelB="Pets" />)
    expect(screen.getByText("Dogs")).toBeInTheDocument()
    expect(screen.getByText("Pets")).toBeInTheDocument()
  })

  it("renders SVG element", () => {
    const { container } = render(<VennDiagram labelA="A" labelB="B" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("highlights a region when clicked", async () => {
    const user = userEvent.setup()
    render(<VennDiagram labelA="A" labelB="B" interactive />)
    const regionButton = screen.getByRole("button", { name: /A ∩ B/ })
    await user.click(regionButton)
    expect(regionButton).toHaveAttribute("aria-pressed", "true")
  })

  it("shows a formula label when provided", () => {
    render(
      <VennDiagram
        labelA="P(x)"
        labelB="Q(x)"
        formulaLabel="∀x (P(x) → Q(x))"
      />
    )
    expect(screen.getByText("∀x (P(x) → Q(x))")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm vitest run src/components/interactive/__tests__/venn-diagram.test.tsx
```

**Step 3: Implement**

Create `src/components/interactive/venn-diagram.tsx`:

```tsx
"use client"

import { useState, useCallback } from "react"

type Region = "a-only" | "intersection" | "b-only" | "outside"

interface VennDiagramProps {
  readonly labelA: string
  readonly labelB: string
  readonly highlight?: readonly Region[]
  readonly interactive?: boolean
  readonly formulaLabel?: string
  readonly caption?: string
}

export function VennDiagram({
  labelA,
  labelB,
  highlight: initialHighlight,
  interactive = false,
  formulaLabel,
  caption,
}: VennDiagramProps) {
  const [highlighted, setHighlighted] = useState<ReadonlySet<Region>>(
    new Set(initialHighlight ?? [])
  )

  const toggleRegion = useCallback((region: Region) => {
    setHighlighted((prev) => {
      const next = new Set(prev)
      if (next.has(region)) {
        next.delete(region)
      } else {
        next.add(region)
      }
      return next
    })
  }, [])

  const regionFill = (region: Region) =>
    highlighted.has(region) ? "fill-primary/30" : "fill-transparent"

  const CX_A = 115
  const CX_B = 195
  const CY = 110
  const R = 70

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-4 py-4 flex flex-col items-center">
        {formulaLabel && (
          <div className="text-sm font-mono text-foreground mb-3">
            {formulaLabel}
          </div>
        )}
        <svg viewBox="0 0 310 220" className="w-full max-w-sm" role="img" aria-label={`ベン図: ${labelA} と ${labelB}`}>
          <defs>
            <clipPath id="clip-a">
              <circle cx={CX_A} cy={CY} r={R} />
            </clipPath>
            <clipPath id="clip-b">
              <circle cx={CX_B} cy={CY} r={R} />
            </clipPath>
          </defs>

          {/* Circle A background */}
          <circle
            cx={CX_A} cy={CY} r={R}
            className={`${regionFill("a-only")} stroke-blue-500 transition-all duration-300`}
            strokeWidth={2}
          />

          {/* Circle B background */}
          <circle
            cx={CX_B} cy={CY} r={R}
            className={`${regionFill("b-only")} stroke-red-500 transition-all duration-300`}
            strokeWidth={2}
          />

          {/* Intersection: circle B clipped to circle A */}
          <circle
            cx={CX_B} cy={CY} r={R}
            clipPath="url(#clip-a)"
            className={`${regionFill("intersection")} transition-all duration-300`}
          />

          {/* Circle outlines (on top) */}
          <circle cx={CX_A} cy={CY} r={R} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth={2} />
          <circle cx={CX_B} cy={CY} r={R} fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth={2} />

          {/* Labels */}
          <text x={CX_A - 30} y={CY - 5} className="text-sm fill-blue-700 dark:fill-blue-300 font-medium" textAnchor="middle">{labelA}</text>
          <text x={CX_B + 30} y={CY - 5} className="text-sm fill-red-700 dark:fill-red-300 font-medium" textAnchor="middle">{labelB}</text>

          {/* Interactive overlay buttons */}
          {interactive && (
            <>
              <foreignObject x={CX_A - 40} y={CY + 10} width={40} height={30}>
                <button
                  type="button"
                  aria-label={`${labelA} のみ`}
                  aria-pressed={highlighted.has("a-only")}
                  onClick={() => toggleRegion("a-only")}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </foreignObject>
              <foreignObject x={(CX_A + CX_B) / 2 - 20} y={CY + 10} width={40} height={30}>
                <button
                  type="button"
                  aria-label={`${labelA} ∩ ${labelB}`}
                  aria-pressed={highlighted.has("intersection")}
                  onClick={() => toggleRegion("intersection")}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </foreignObject>
              <foreignObject x={CX_B} y={CY + 10} width={40} height={30}>
                <button
                  type="button"
                  aria-label={`${labelB} のみ`}
                  aria-pressed={highlighted.has("b-only")}
                  onClick={() => toggleRegion("b-only")}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </foreignObject>
            </>
          )}
        </svg>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

**Step 4: Run test, update barrel export, commit**

```bash
pnpm vitest run src/components/interactive/__tests__/venn-diagram.test.tsx
```

Add to `src/components/interactive/index.ts`:
```typescript
export { VennDiagram } from "./venn-diagram"
```

```bash
git add src/components/interactive/
git commit -m "feat: add VennDiagram interactive SVG component"
```

---

## Task 6: ExampleMapping — Abstract ↔ Concrete side-by-side display

**Files:**
- Create: `src/components/interactive/example-mapping.tsx`
- Create: `src/components/interactive/__tests__/example-mapping.test.tsx`

**Step 1: Write the test**

Create `src/components/interactive/__tests__/example-mapping.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ExampleMapping } from "../example-mapping"

describe("ExampleMapping", () => {
  it("renders formula and example side by side", () => {
    render(
      <ExampleMapping
        formula="P → Q"
        example="雨が降る → 傘を持つ"
        variables={{ P: "雨が降る", Q: "傘を持つ" }}
      />
    )
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("雨が降る → 傘を持つ")).toBeInTheDocument()
  })

  it("renders variable mappings", () => {
    render(
      <ExampleMapping
        formula="P ∧ Q"
        example="晴れかつ暖かい"
        variables={{ P: "晴れ", Q: "暖かい" }}
      />
    )
    expect(screen.getByText(/P/)).toBeInTheDocument()
    expect(screen.getByText(/晴れ/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify failure**

**Step 3: Implement**

Create `src/components/interactive/example-mapping.tsx`:

```tsx
interface ExampleMappingProps {
  readonly formula: string
  readonly example: string
  readonly variables: Readonly<Record<string, string>>
  readonly caption?: string
}

export function ExampleMapping({
  formula,
  example,
  variables,
  caption,
}: ExampleMappingProps) {
  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Abstract */}
          <div className="px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              抽象（論理式）
            </div>
            <code className="text-base font-mono text-foreground">{formula}</code>
          </div>
          {/* Concrete */}
          <div className="px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              具体（日常例）
            </div>
            <div className="text-base text-foreground">{example}</div>
          </div>
        </div>
        {/* Variable mapping */}
        <div className="border-t border-border px-5 py-3 flex flex-wrap gap-3">
          {Object.entries(variables).map(([symbol, meaning]) => (
            <span key={symbol} className="text-xs text-muted-foreground">
              <code className="font-mono text-foreground">{symbol}</code> = {meaning}
            </span>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

**Step 4: Run test, update barrel, commit**

```bash
pnpm vitest run src/components/interactive/__tests__/example-mapping.test.tsx
git add src/components/interactive/
git commit -m "feat: add ExampleMapping abstract-concrete component"
```

---

## Task 7: InlineMiniQuiz — Embedded single-question quiz in theory pages

A lightweight single-question quiz component for theory pages. NOT registered in QuizRunner — it's a standalone content component.

**Files:**
- Create: `src/components/interactive/inline-mini-quiz.tsx`
- Create: `src/components/interactive/__tests__/inline-mini-quiz.test.tsx`

**Step 1: Write the test**

Create `src/components/interactive/__tests__/inline-mini-quiz.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InlineMiniQuiz } from "../inline-mini-quiz"

describe("InlineMiniQuiz", () => {
  const props = {
    question: "P ∧ Q が偽になるのは？",
    options: ["両方偽", "P偽", "Q偽", "どれか1つ偽"],
    correctIndex: 3,
    explanation: "どちらか片方が偽なら ∧ は偽",
  }

  it("renders the question", () => {
    render(<InlineMiniQuiz {...props} />)
    expect(screen.getByText("P ∧ Q が偽になるのは？")).toBeInTheDocument()
  })

  it("shows options as buttons", () => {
    render(<InlineMiniQuiz {...props} />)
    expect(screen.getByRole("button", { name: /両方偽/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /どれか1つ偽/ })).toBeInTheDocument()
  })

  it("reveals explanation after correct answer", async () => {
    const user = userEvent.setup()
    render(<InlineMiniQuiz {...props} />)
    await user.click(screen.getByRole("button", { name: /どれか1つ偽/ }))
    expect(screen.getByText(/どちらか片方が偽なら/)).toBeInTheDocument()
  })

  it("shows incorrect feedback then allows retry", async () => {
    const user = userEvent.setup()
    render(<InlineMiniQuiz {...props} />)
    await user.click(screen.getByRole("button", { name: /両方偽/ }))
    expect(screen.getByText(/不正解/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify failure**

**Step 3: Implement**

Create `src/components/interactive/inline-mini-quiz.tsx`:

```tsx
"use client"

import { useState } from "react"

interface InlineMiniQuizProps {
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

export function InlineMiniQuiz({
  question,
  options,
  correctIndex,
  explanation,
}: InlineMiniQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const isCorrect = selectedIndex === correctIndex

  const handleSelect = (index: number) => {
    if (revealed) return
    setSelectedIndex(index)
    if (index === correctIndex) {
      setRevealed(true)
    }
  }

  return (
    <div className="not-prose my-6 border border-border rounded-md bg-secondary/50 px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          確認
        </span>
      </div>
      <div className="text-sm font-medium text-foreground mb-3">{question}</div>
      <div className="space-y-2">
        {options.map((option, i) => {
          const isSelected = selectedIndex === i
          const showCorrect = revealed && i === correctIndex
          const showWrong = isSelected && !isCorrect && !revealed

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`
                w-full text-left px-4 py-2 rounded-md text-sm
                transition-all duration-200 border
                ${
                  showCorrect
                    ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                    : showWrong
                      ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                      : isSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-background border-border hover:border-primary/50"
                }
                ${revealed ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
      {selectedIndex !== null && !isCorrect && !revealed && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          不正解 — もう一度考えてみましょう
        </div>
      )}
      {revealed && (
        <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-4 py-3">
          {explanation}
        </div>
      )}
    </div>
  )
}
```

**Step 4: Run test, update barrel, commit**

```bash
pnpm vitest run src/components/interactive/__tests__/inline-mini-quiz.test.tsx
git add src/components/interactive/
git commit -m "feat: add InlineMiniQuiz for embedded theory questions"
```

---

## Task 8: LogicSandbox — Free-form truth value experimentation

Users can toggle multiple variables and see results for multiple formulas simultaneously.

**Files:**
- Create: `src/components/interactive/logic-sandbox.tsx`
- Create: `src/components/interactive/__tests__/logic-sandbox.test.tsx`

**Step 1: Write the test**

Create `src/components/interactive/__tests__/logic-sandbox.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LogicSandbox } from "../logic-sandbox"

describe("LogicSandbox", () => {
  const formulas = [
    { label: "P ∧ Q", evaluate: (v: Record<string, boolean>) => v.P && v.Q },
    { label: "P ∨ Q", evaluate: (v: Record<string, boolean>) => v.P || v.Q },
    { label: "P → Q", evaluate: (v: Record<string, boolean>) => !v.P || v.Q },
  ]

  it("renders variable toggles", () => {
    render(<LogicSandbox variables={["P", "Q"]} formulas={formulas} />)
    expect(screen.getByRole("button", { name: /P/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Q/ })).toBeInTheDocument()
  })

  it("renders all formula labels", () => {
    render(<LogicSandbox variables={["P", "Q"]} formulas={formulas} />)
    expect(screen.getByText("P ∧ Q")).toBeInTheDocument()
    expect(screen.getByText("P ∨ Q")).toBeInTheDocument()
    expect(screen.getByText("P → Q")).toBeInTheDocument()
  })

  it("updates all results when toggling a variable", async () => {
    const user = userEvent.setup()
    render(<LogicSandbox variables={["P", "Q"]} formulas={formulas} />)
    // Initially P=T, Q=T → all formulas true
    const results = screen.getAllByTestId("sandbox-result")
    expect(results[0]).toHaveTextContent("T") // P ∧ Q
    expect(results[1]).toHaveTextContent("T") // P ∨ Q
    expect(results[2]).toHaveTextContent("T") // P → Q

    // Toggle Q → P=T, Q=F
    await user.click(screen.getByRole("button", { name: /Q/ }))
    const updatedResults = screen.getAllByTestId("sandbox-result")
    expect(updatedResults[0]).toHaveTextContent("F") // P ∧ Q = F
    expect(updatedResults[1]).toHaveTextContent("T") // P ∨ Q = T
    expect(updatedResults[2]).toHaveTextContent("F") // P → Q = F
  })
})
```

**Step 2: Run test to verify failure**

**Step 3: Implement**

Create `src/components/interactive/logic-sandbox.tsx`:

```tsx
"use client"

import { useState, useCallback } from "react"

interface SandboxFormula {
  readonly label: string
  readonly evaluate: (values: Readonly<Record<string, boolean>>) => boolean
}

interface LogicSandboxProps {
  readonly variables: readonly string[]
  readonly formulas: readonly SandboxFormula[]
  readonly caption?: string
}

export function LogicSandbox({
  variables,
  formulas,
  caption,
}: LogicSandboxProps) {
  const [values, setValues] = useState<Readonly<Record<string, boolean>>>(() =>
    Object.fromEntries(variables.map((v) => [v, true]))
  )

  const toggle = useCallback((variable: string) => {
    setValues((prev) => ({ ...prev, [variable]: !prev[variable] }))
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-5 py-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
          ロジック・サンドボックス
        </div>

        {/* Variable toggles */}
        <div className="flex items-center gap-3 mb-4">
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              aria-label={`${v}: ${values[v] ? "True" : "False"} — クリックで切替`}
              onClick={() => toggle(v)}
              className={`
                px-3 py-1.5 rounded-md font-mono text-sm font-semibold
                transition-all duration-300 border-2 cursor-pointer select-none
                ${
                  values[v]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                    : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                }
              `}
            >
              {v} = {values[v] ? "T" : "F"}
            </button>
          ))}
        </div>

        {/* Formula results */}
        <div className="space-y-2">
          {formulas.map((f) => {
            const result = f.evaluate(values)
            return (
              <div
                key={f.label}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-background/50 border border-border/50"
              >
                <code className="text-sm font-mono text-foreground">
                  {f.label}
                </code>
                <span
                  data-testid="sandbox-result"
                  className={`
                    font-mono font-bold text-sm
                    transition-all duration-300
                    ${result ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                  `}
                >
                  {result ? "T" : "F"}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

**Step 4: Run test, update barrel, commit**

```bash
pnpm vitest run src/components/interactive/__tests__/logic-sandbox.test.tsx
git add src/components/interactive/
git commit -m "feat: add LogicSandbox multi-formula experimentation component"
```

---

## Task 9: ProofBuilderQuiz — Drag-and-drop proof construction

Uses @dnd-kit to let users arrange premise cards in the correct order to form a valid proof.

**Files:**
- Create: `src/components/quiz/ProofBuilderQuiz.tsx`
- Create: `src/components/quiz/__tests__/ProofBuilderQuiz.test.tsx`
- Modify: `src/components/quiz/QuizRunner.tsx` (add dispatch)

**Step 1: Write the test**

Create `src/components/quiz/__tests__/ProofBuilderQuiz.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProofBuilderQuiz } from "../ProofBuilderQuiz"
import type { ProofBuilderQuiz as ProofBuilderQuizType } from "@/types/content"

describe("ProofBuilderQuiz", () => {
  const quiz: ProofBuilderQuizType = {
    id: "pb-test",
    type: "proof-builder",
    conclusion: "Q",
    availablePremises: [
      { id: "p1", label: "P → Q", rule: "前提" },
      { id: "p2", label: "P", rule: "前提" },
    ],
    correctOrder: ["p2", "p1"],
    explanation: "モーダスポネンス: PとP→QからQを導く",
  }

  it("renders all premise cards", () => {
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("P")).toBeInTheDocument()
  })

  it("renders the conclusion", () => {
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText(/∴ Q/)).toBeInTheDocument()
  })

  it("has a submit button", () => {
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("button", { name: /提出/ })).toBeInTheDocument()
  })

  it("shows explanation after submission", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /提出/ }))
    expect(screen.getByText(/モーダスポネンス/)).toBeInTheDocument()
    expect(onAnswer).toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify failure**

**Step 3: Implement ProofBuilderQuiz**

Create `src/components/quiz/ProofBuilderQuiz.tsx`:

```tsx
"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ProofBuilderQuiz as ProofBuilderQuizType } from "@/types/content"

function SortablePremise({
  id,
  label,
  rule,
  disabled,
  status,
}: {
  id: string
  label: string
  rule: string
  disabled: boolean
  status?: "correct" | "wrong"
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        px-4 py-3 rounded-md border-2 font-mono text-sm
        transition-colors duration-200 select-none
        ${disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
        ${
          status === "correct"
            ? "bg-emerald-100 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-400"
            : status === "wrong"
              ? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-400"
              : "bg-background border-border hover:border-primary/50"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-xs text-muted-foreground ml-3">{rule}</span>
      </div>
    </div>
  )
}

interface Props {
  readonly quiz: ProofBuilderQuizType
  readonly onAnswer: (correct: boolean) => void
}

export function ProofBuilderQuiz({ quiz, onAnswer }: Props) {
  const [items, setItems] = useState(() =>
    quiz.availablePremises.map((p) => p.id)
  )
  const [submitted, setSubmitted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const isCorrect =
    items.length === quiz.correctOrder.length &&
    items.every((id, i) => id === quiz.correctOrder[i])

  const handleSubmit = () => {
    setSubmitted(true)
    onAnswer(isCorrect)
  }

  const premiseMap = new Map(
    quiz.availablePremises.map((p) => [p.id, p])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          以下の前提を正しい順序に並べ替えて、結論を導いてください
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((id, index) => {
                const premise = premiseMap.get(id)!
                const status = submitted
                  ? id === quiz.correctOrder[index]
                    ? "correct"
                    : "wrong"
                  : undefined
                return (
                  <SortablePremise
                    key={id}
                    id={id}
                    label={premise.label}
                    rule={premise.rule}
                    disabled={submitted}
                    status={status}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>

        <div className="border-t border-border pt-3">
          <div className="font-mono text-base font-bold text-foreground">
            ∴ {quiz.conclusion}
          </div>
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} aria-label="提出">
            提出
          </Button>
        )}

        {submitted && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${
              isCorrect
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {isCorrect ? "正解！" : "不正解"}
            </div>
            {quiz.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Step 4: Run test**

```bash
pnpm vitest run src/components/quiz/__tests__/ProofBuilderQuiz.test.tsx
```

**Step 5: Add dispatch in QuizRunner.tsx**

Modify `src/components/quiz/QuizRunner.tsx`:
- Add import: `import { ProofBuilderQuiz } from "./ProofBuilderQuiz"`
- Add dispatch block after truth-table dispatch:

```tsx
{currentQuiz.type === "proof-builder" && (
  <ProofBuilderQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
)}
```

**Step 6: Run full tests, commit**

```bash
pnpm vitest run
git add src/components/quiz/ src/types/content.ts
git commit -m "feat: add ProofBuilderQuiz with drag-and-drop proof construction"
```

---

## Task 10: FallacySpotterQuiz — Identify fallacy in a passage

**Files:**
- Create: `src/components/quiz/FallacySpotterQuiz.tsx`
- Create: `src/components/quiz/__tests__/FallacySpotterQuiz.test.tsx`
- Modify: `src/components/quiz/QuizRunner.tsx`

**Step 1: Write the test**

Create `src/components/quiz/__tests__/FallacySpotterQuiz.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FallacySpotterQuiz } from "../FallacySpotterQuiz"
import type { FallacySpotterQuiz as FallacySpotterQuizType } from "@/types/content"

describe("FallacySpotterQuiz", () => {
  const quiz: FallacySpotterQuizType = {
    id: "fs-test",
    type: "fallacy-spotter",
    passage: "彼は若いから、提案は信用できない。",
    fallacyType: "ad-hominem",
    distractors: ["straw-man", "false-dilemma", "slippery-slope"],
    explanation: "人の属性で議論を退けるのは人身攻撃",
  }

  it("renders the passage", () => {
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText(/彼は若いから/)).toBeInTheDocument()
  })

  it("renders fallacy options", () => {
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("button", { name: /人身攻撃/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /藁人形論法/ })).toBeInTheDocument()
  })

  it("shows correct feedback on right answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /人身攻撃/ }))
    expect(onAnswer).toHaveBeenCalledWith(true)
    expect(screen.getByText(/人の属性で/)).toBeInTheDocument()
  })

  it("shows incorrect feedback on wrong answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /藁人形論法/ }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
```

**Step 2: Run test to verify failure**

**Step 3: Implement**

Create `src/components/quiz/FallacySpotterQuiz.tsx`:

```tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FallacySpotterQuiz as FallacySpotterQuizType, FallacyType } from "@/types/content"

const FALLACY_LABELS: Readonly<Record<FallacyType, string>> = {
  "ad-hominem": "人身攻撃",
  "straw-man": "藁人形論法",
  "false-dilemma": "偽の二択",
  "slippery-slope": "滑りやすい坂論法",
  "appeal-to-authority": "権威への訴え",
  "appeal-to-emotion": "感情への訴え",
  "appeal-to-popularity": "多数への訴え",
  "begging-the-question": "循環論法",
  "correlation-causation": "相関と因果の混同",
}

interface Props {
  readonly quiz: FallacySpotterQuizType
  readonly onAnswer: (correct: boolean) => void
}

export function FallacySpotterQuiz({ quiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<FallacyType | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const options = useMemo(() => {
    const all = [quiz.fallacyType, ...quiz.distractors]
    // Deterministic shuffle based on quiz id
    return [...all].sort((a, b) => {
      const hashA = quiz.id.length + a.charCodeAt(0)
      const hashB = quiz.id.length + b.charCodeAt(0)
      return hashA - hashB
    })
  }, [quiz])

  const handleSelect = (fallacy: FallacyType) => {
    if (submitted) return
    setSelected(fallacy)
    setSubmitted(true)
    onAnswer(fallacy === quiz.fallacyType)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          以下の文章に含まれる誤謬を特定してください
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="border-l-4 border-primary/30 pl-4 py-2 text-foreground/80 italic">
          {quiz.passage}
        </blockquote>

        <div className="grid grid-cols-2 gap-2">
          {options.map((fallacy) => {
            const isSelected = selected === fallacy
            const isCorrectAnswer = fallacy === quiz.fallacyType
            const showCorrect = submitted && isCorrectAnswer
            const showWrong = submitted && isSelected && !isCorrectAnswer

            return (
              <button
                key={fallacy}
                type="button"
                onClick={() => handleSelect(fallacy)}
                disabled={submitted}
                aria-label={FALLACY_LABELS[fallacy]}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium text-left
                  transition-all duration-200 border
                  ${
                    showCorrect
                      ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                      : showWrong
                        ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                        : submitted
                          ? "bg-muted border-border text-muted-foreground cursor-default"
                          : "bg-background border-border hover:border-primary/50 cursor-pointer"
                  }
                `}
              >
                {FALLACY_LABELS[fallacy]}
              </button>
            )
          })}
        </div>

        {submitted && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${
              selected === quiz.fallacyType
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {selected === quiz.fallacyType ? "正解！" : `不正解 — 正解: ${FALLACY_LABELS[quiz.fallacyType]}`}
            </div>
            {quiz.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Step 4: Add dispatch in QuizRunner.tsx, run tests, commit**

Add to QuizRunner dispatch:
```tsx
{currentQuiz.type === "fallacy-spotter" && (
  <FallacySpotterQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
)}
```

```bash
pnpm vitest run
git add src/components/quiz/
git commit -m "feat: add FallacySpotterQuiz for identifying logical fallacies"
```

---

## Task 11: CounterexampleQuiz — Refute an argument with a counterexample

**Files:**
- Create: `src/components/quiz/CounterexampleQuiz.tsx`
- Create: `src/components/quiz/__tests__/CounterexampleQuiz.test.tsx`
- Modify: `src/components/quiz/QuizRunner.tsx`

**Step 1: Write the test**

Create `src/components/quiz/__tests__/CounterexampleQuiz.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CounterexampleQuiz } from "../CounterexampleQuiz"
import type { CounterexampleQuiz as CounterexampleQuizType } from "@/types/content"

describe("CounterexampleQuiz", () => {
  const quiz: CounterexampleQuizType = {
    id: "ce-test",
    type: "counterexample",
    argument: "すべての鳥は飛べる。ペンギンは鳥だ。よってペンギンは飛べる。",
    premises: ["すべての鳥は飛べる", "ペンギンは鳥だ"],
    conclusion: "ペンギンは飛べる",
    vulnerablePremiseIndex: 0,
    counterexamples: [
      { id: "ce1", text: "ペンギンは飛べない鳥である", isValid: true },
      { id: "ce2", text: "タカは速く飛べる", isValid: false },
      { id: "ce3", text: "ダチョウは飛べない鳥である", isValid: true },
      { id: "ce4", text: "飛行機は飛べる", isValid: false },
    ],
    explanation: "「すべての鳥は飛べる」は偽。ペンギンやダチョウは反例。",
  }

  it("renders the argument", () => {
    render(<CounterexampleQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText(/すべての鳥は飛べる/)).toBeInTheDocument()
  })

  it("renders premise labels with highlight on vulnerable one", () => {
    render(<CounterexampleQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText("すべての鳥は飛べる")).toBeInTheDocument()
    expect(screen.getByText("ペンギンは鳥だ")).toBeInTheDocument()
  })

  it("renders counterexample options", () => {
    render(<CounterexampleQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("button", { name: /ペンギンは飛べない鳥/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /タカは速く飛べる/ })).toBeInTheDocument()
  })

  it("correct answer triggers onAnswer(true)", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<CounterexampleQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /ペンギンは飛べない鳥/ }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("wrong answer triggers onAnswer(false)", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<CounterexampleQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /タカは速く飛べる/ }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
```

**Step 2-4: Implement, test, dispatch**

Create `src/components/quiz/CounterexampleQuiz.tsx` following the same Card pattern as other quizzes:
- Displays the argument as a blockquote
- Lists premises (vulnerable one highlighted)
- Shows counterexample options as selectable buttons
- On submit: green/red feedback + explanation
- Calls `onAnswer(isValid)` where `isValid` comes from the selected counterexample

Add dispatch in QuizRunner:
```tsx
{currentQuiz.type === "counterexample" && (
  <CounterexampleQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
)}
```

**Step 5: Commit**

```bash
git add src/components/quiz/
git commit -m "feat: add CounterexampleQuiz for argument refutation"
```

---

## Task 12: GapFillProofQuiz — Fill blanks in a proof

**Files:**
- Create: `src/components/quiz/GapFillProofQuiz.tsx`
- Create: `src/components/quiz/__tests__/GapFillProofQuiz.test.tsx`
- Modify: `src/components/quiz/QuizRunner.tsx`

**Step 1: Write the test**

Create `src/components/quiz/__tests__/GapFillProofQuiz.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GapFillProofQuiz } from "../GapFillProofQuiz"
import type { GapFillProofQuiz as GapFillProofQuizType } from "@/types/content"

describe("GapFillProofQuiz", () => {
  const quiz: GapFillProofQuizType = {
    id: "gf-test",
    type: "gap-fill-proof",
    steps: [
      { id: "s1", content: "P → Q", type: "given" },
      { id: "s2", content: "___", type: "gap", correctValue: "P", options: ["P", "Q", "¬P", "¬Q"] },
      { id: "s3", content: "Q", type: "derived", rule: "モーダスポネンス (1, 2)" },
    ],
    explanation: "モーダスポネンスにはP→QとPが必要",
  }

  it("renders given steps", () => {
    render(<GapFillProofQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("Q")).toBeInTheDocument()
  })

  it("renders gap with dropdown options", () => {
    render(<GapFillProofQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("correct selection yields correct answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<GapFillProofQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.selectOptions(screen.getByRole("combobox"), "P")
    await user.click(screen.getByRole("button", { name: /提出/ }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("incorrect selection yields incorrect answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<GapFillProofQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.selectOptions(screen.getByRole("combobox"), "¬Q")
    await user.click(screen.getByRole("button", { name: /提出/ }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
```

**Step 2-4: Implement, test, dispatch**

Create `src/components/quiz/GapFillProofQuiz.tsx`:
- Renders proof as numbered steps
- Given steps shown in monospace
- Gap steps show a `<select>` dropdown with options
- Derived steps show content + inference rule label
- Submit checks all gap values match `correctValue`
- Green/red feedback + explanation

Add dispatch in QuizRunner:
```tsx
{currentQuiz.type === "gap-fill-proof" && (
  <GapFillProofQuiz key={currentQuiz.id} quiz={currentQuiz} onAnswer={handleAnswer} />
)}
```

**Step 5: Commit**

```bash
git add src/components/quiz/
git commit -m "feat: add GapFillProofQuiz for fill-in-the-blank proofs"
```

---

## Task 13: Add quiz content for new quiz types

Add new quiz data to existing chapter JSON files.

**Files to modify:**
- `content/chapters/03-validity/theory-quizzes.json` — Add proof-builder and gap-fill quizzes
- `content/chapters/03-validity/practice-quizzes.json` — Add counterexample quiz
- `content/chapters/05-fallacies/theory-quizzes.json` — Add fallacy-spotter quizzes
- `content/chapters/05-fallacies/practice-quizzes.json` — Add fallacy-spotter quizzes
- `content/chapters/06-synthesis/theory-quizzes.json` — Add mixed quiz types
- `content/chapters/06-synthesis/practice-quizzes.json` — Add mixed quiz types

**Proof Builder quiz examples (add to ch3 theory):**

```json
{
  "id": "ch3-t6",
  "type": "proof-builder",
  "conclusion": "Q",
  "availablePremises": [
    { "id": "p1", "label": "P → Q", "rule": "前提" },
    { "id": "p2", "label": "P", "rule": "前提" }
  ],
  "correctOrder": ["p2", "p1"],
  "explanation": "モーダスポネンス: 「P」と「P → Q」から「Q」を導きます。前提Pを先に置き、次にP→Qを適用します。"
},
{
  "id": "ch3-t7",
  "type": "proof-builder",
  "conclusion": "¬P",
  "availablePremises": [
    { "id": "p1", "label": "¬Q", "rule": "前提" },
    { "id": "p2", "label": "P → Q", "rule": "前提" }
  ],
  "correctOrder": ["p1", "p2"],
  "explanation": "モーダストレンス: 「¬Q」と「P → Q」から「¬P」を導きます。結論の否定を先に置きます。"
}
```

**Gap-Fill quiz examples (add to ch3 theory):**

```json
{
  "id": "ch3-t8",
  "type": "gap-fill-proof",
  "steps": [
    { "id": "s1", "content": "P → Q", "type": "given" },
    { "id": "s2", "content": "Q → R", "type": "given" },
    { "id": "s3", "content": "___", "type": "gap", "correctValue": "P → R", "options": ["P → R", "R → P", "P ∧ R", "Q → P"] },
  ],
  "explanation": "仮言三段論法: P→QとQ→RからP→Rを導きます。"
}
```

**Fallacy Spotter quiz examples (add to ch5 theory):**

```json
{
  "id": "ch5-t6",
  "type": "fallacy-spotter",
  "passage": "この新しいフレームワークは有名なテックリーダーXが推薦しています。だから採用すべきです。",
  "fallacyType": "appeal-to-authority",
  "distractors": ["ad-hominem", "false-dilemma", "begging-the-question"],
  "explanation": "有名人の推薦は技術的根拠にはなりません。フレームワークの採用はプロジェクト要件に基づくべきです。"
},
{
  "id": "ch5-t7",
  "type": "fallacy-spotter",
  "passage": "テストカバレッジ100%を目指さないなら、品質など気にしていないのと同じだ。",
  "fallacyType": "false-dilemma",
  "distractors": ["slippery-slope", "straw-man", "ad-hominem"],
  "explanation": "100%か0%かの二択に見せていますが、適切なカバレッジ目標は中間に存在します。"
}
```

**Counterexample quiz examples (add to ch3 practice):**

```json
{
  "id": "ch3-p5",
  "type": "counterexample",
  "argument": "成功した起業家はみな大学を中退している。太郎は大学を中退した。よって太郎は成功する起業家になる。",
  "premises": ["成功した起業家はみな大学を中退している", "太郎は大学を中退した"],
  "conclusion": "太郎は成功する起業家になる",
  "vulnerablePremiseIndex": 0,
  "counterexamples": [
    { "id": "ce1", "text": "大学を卒業して成功した起業家もいる（例: ラリー・ペイジ）", "isValid": true },
    { "id": "ce2", "text": "太郎は優秀な学生だった", "isValid": false },
    { "id": "ce3", "text": "マーク・ザッカーバーグは中退して成功した", "isValid": false },
    { "id": "ce4", "text": "ほとんどの大学中退者は起業しない", "isValid": true }
  ],
  "explanation": "「成功した起業家はみな中退」は偽。多くの成功した起業家は大学を卒業しています。また前提が真でも後件肯定の誤謬です。"
}
```

**Step 1: Add quizzes to JSON files**

Add the above quiz data to the appropriate JSON files.

**Step 2: Verify build**

```bash
pnpm build
```

**Step 3: Run full test suite**

```bash
pnpm vitest run
```

**Step 4: Commit**

```bash
git add content/chapters/
git commit -m "feat: add proof-builder, fallacy-spotter, counterexample, gap-fill quiz content"
```

---

## Task 14: Embed interactive components in theory pages

Add TruthValueAnimator, ArgumentTree, VennDiagram, ExampleMapping, InlineMiniQuiz, and LogicSandbox to appropriate theory.tsx files.

**Files to modify:**

| Chapter | Components to embed |
|---------|-------------------|
| `01-propositions/theory.tsx` | TruthValueAnimator, ExampleMapping, InlineMiniQuiz |
| `02-truth-tables/theory.tsx` | LogicSandbox, TruthValueAnimator, InlineMiniQuiz |
| `03-validity/theory.tsx` | ArgumentTree, ExampleMapping, InlineMiniQuiz |
| `04a-predicates/theory.tsx` | ExampleMapping, InlineMiniQuiz |
| `04b-universal/theory.tsx` | VennDiagram, ExampleMapping, InlineMiniQuiz |
| `04c-existential/theory.tsx` | VennDiagram, ExampleMapping, InlineMiniQuiz |
| `04d-negation/theory.tsx` | VennDiagram, InlineMiniQuiz |
| `04e-multiple-quantifiers/theory.tsx` | VennDiagram, InlineMiniQuiz |
| `04f-sql-connection/theory.tsx` | ExampleMapping, InlineMiniQuiz |
| `05-fallacies/theory.tsx` | ExampleMapping, InlineMiniQuiz |
| `06-synthesis/theory.tsx` | ArgumentTree, LogicSandbox, InlineMiniQuiz |

**Step 1: For each chapter, add imports and embed components**

Example for `01-propositions/theory.tsx` — add after existing imports:

```tsx
import {
  TruthValueAnimator,
  ExampleMapping,
  InlineMiniQuiz,
} from "@/components/interactive"
```

Insert after the section on logical connectives:

```tsx
<TruthValueAnimator
  variables={["P", "Q"]}
  formula="P ∧ Q"
  evaluate={(v) => v.P && v.Q}
  caption="P と Q の値を切り替えて、論理積の動作を確認しましょう"
/>

<ExampleMapping
  formula="P → Q"
  example="雨が降る → 傘を持つ"
  variables={{ P: "雨が降る", Q: "傘を持つ" }}
/>

<InlineMiniQuiz
  question="P → Q が偽になるのはどのような場合？"
  options={["P真かつQ偽", "P偽かつQ真", "両方偽", "両方真"]}
  correctIndex={0}
  explanation="条件文は前件が真で後件が偽のときのみ偽になります。"
/>
```

Example for `03-validity/theory.tsx` — add after modus ponens section:

```tsx
<ArgumentTree
  premises={["P → Q", "P"]}
  conclusion="Q"
  rule="モーダスポネンス"
  caption="前提から結論への推論構造"
/>
```

Example for `04b-universal/theory.tsx`:

```tsx
<VennDiagram
  labelA="P(x)"
  labelB="Q(x)"
  highlight={["a-only", "intersection"]}
  formulaLabel="∀x (P(x) → Q(x)): P の全体が Q に含まれる"
/>
```

**Step 2: Verify build and tests after each chapter modification**

```bash
pnpm build && pnpm vitest run
```

**Step 3: Commit per batch (chapters 1-3, 4a-4f, 5-6)**

```bash
git add content/chapters/01-propositions/ content/chapters/02-truth-tables/ content/chapters/03-validity/
git commit -m "feat: embed interactive components in chapters 01-03 theory pages"

git add content/chapters/04a-predicates/ content/chapters/04b-universal/ content/chapters/04c-existential/ content/chapters/04d-negation/ content/chapters/04e-multiple-quantifiers/ content/chapters/04f-sql-connection/
git commit -m "feat: embed interactive components in chapters 04a-04f theory pages"

git add content/chapters/05-fallacies/ content/chapters/06-synthesis/
git commit -m "feat: embed interactive components in chapters 05-06 theory pages"
```

---

## Task 15: Final integration test and build verification

**Step 1: Run full test suite**

```bash
pnpm vitest run
```
Expected: All tests pass (64 existing + ~30 new tests)

**Step 2: Run production build**

```bash
pnpm build
```
Expected: Build succeeds with no errors

**Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No type errors

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete interactive logic learning features - 10 new components"
```

---

## Summary

| Task | Feature | Type |
|------|---------|------|
| T1 | Install @dnd-kit | Setup |
| T2 | Extend Quiz types | Types |
| T3 | TruthValueAnimator | Interactive content |
| T4 | ArgumentTree | Interactive content |
| T5 | VennDiagram | Interactive content |
| T6 | ExampleMapping | Content component |
| T7 | InlineMiniQuiz | Interactive content |
| T8 | LogicSandbox | Interactive content |
| T9 | ProofBuilderQuiz | New quiz type |
| T10 | FallacySpotterQuiz | New quiz type |
| T11 | CounterexampleQuiz | New quiz type |
| T12 | GapFillProofQuiz | New quiz type |
| T13 | Quiz content data | Content |
| T14 | Embed in theory pages | Integration |
| T15 | Final verification | QA |

**New dependencies:** `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (~16kB gzipped)
**New files:** ~20 files (10 components + 10 tests)
**Modified files:** ~15 files (content.ts, QuizRunner.tsx, 11 theory.tsx, barrel exports)
**Estimated new tests:** ~30 test cases
