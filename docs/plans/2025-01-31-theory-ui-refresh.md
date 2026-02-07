# Theory Content UI Refresh — 集中力が持続するコンテンツ構成

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 全11章のtheory.tsxを、視覚リズムと情報構造の改善により「読み続けられる」コンテンツに再構成する。ポップにはせず、学術書の落ち着いた品格を保つ。

**Architecture:** 4つの再利用可能なコンテンツコンポーネント（Callout, FormulaBlock, ComparisonTable, KeyPoint）を作成し、theory.tsxの各セクションタイプに適切なコンポーネントを割り当てる。prose本文と構造化ブロックの交互配置で視覚リズムを作る。全11章に統一的に適用。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, @tailwindcss/typography

---

## 現状の問題分析

1. **単調なビジュアルリズム** — h2 → p → ul → p → h3 → p → ul が延々と続き、どこがキーポイントかわからない
2. **定義・公式が埋もれている** — 重要な公式や定義が通常の段落と同じスタイルで表示される
3. **対比構造が可視化されていない** — 「正しい例 vs 間違い例」が箇条書きの中に埋没
4. **文章が長い** — 一段落に複数の概念が詰め込まれている箇所がある
5. **視覚的区切りがない** — セクション間の区切りが見出しだけに依存

## デザイン方針

- **落ち着いたアカデミックトーン**: ポップな色彩やアニメーションは使わない
- **ボーダーとbackground-subtleで区別**: 薄いグレーの背景、左ボーダーの色で情報タイプを区分
- **4種類のコンテンツブロック**:
  - `Callout` — 定義・注意・ヒントなど（左ボーダー + 薄い背景、variant: definition/warning/tip）
  - `FormulaBlock` — 数式・論理式のハイライト（中央配置、等幅フォント、薄い背景）
  - `ComparisonTable` — 正解 vs 間違い、概念A vs B の対比（2カラム）
  - `KeyPoint` — セクション末のまとめ・要点（ボーダー上下、太字）
- **文章の分割ルール**: 1段落は最大3文。4文以上は分割する。

---

### Task 1: Callout コンポーネント作成

**Files:**
- Create: `src/components/content/callout.tsx`
- Test: `src/components/content/__tests__/callout.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/content/__tests__/callout.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Callout } from "../callout"

describe("Callout", () => {
  it("renders children with definition variant", () => {
    render(<Callout variant="definition" label="定義">述語とは何か</Callout>)
    expect(screen.getByText("定義")).toBeInTheDocument()
    expect(screen.getByText("述語とは何か")).toBeInTheDocument()
  })

  it("renders warning variant", () => {
    render(<Callout variant="warning" label="注意">よくある間違い</Callout>)
    expect(screen.getByText("注意")).toBeInTheDocument()
  })

  it("renders tip variant without label", () => {
    render(<Callout variant="tip">ヒント内容</Callout>)
    expect(screen.getByText("ヒント内容")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/content/__tests__/callout.test.tsx`
Expected: FAIL with "Cannot find module"

**Step 3: Write implementation**

```tsx
// src/components/content/callout.tsx
import type { ReactNode } from "react"

const VARIANT_STYLES = {
  definition: {
    border: "border-l-zinc-400",
    bg: "bg-zinc-50 dark:bg-zinc-900/50",
    labelColor: "text-zinc-600 dark:text-zinc-400",
  },
  warning: {
    border: "border-l-amber-400 dark:border-l-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    labelColor: "text-amber-700 dark:text-amber-400",
  },
  tip: {
    border: "border-l-blue-400 dark:border-l-blue-500",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    labelColor: "text-blue-700 dark:text-blue-400",
  },
} as const

interface CalloutProps {
  readonly variant: keyof typeof VARIANT_STYLES
  readonly label?: string
  readonly children: ReactNode
}

export function Callout({ variant, label, children }: CalloutProps) {
  const styles = VARIANT_STYLES[variant]
  return (
    <div
      className={`not-prose my-6 border-l-4 ${styles.border} ${styles.bg} rounded-r-md px-5 py-4`}
    >
      {label && (
        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${styles.labelColor}`}>
          {label}
        </div>
      )}
      <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/content/__tests__/callout.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/content/callout.tsx src/components/content/__tests__/callout.test.tsx
git commit -m "feat: add Callout content component (definition/warning/tip)"
```

---

### Task 2: FormulaBlock コンポーネント作成

**Files:**
- Create: `src/components/content/formula-block.tsx`
- Test: `src/components/content/__tests__/formula-block.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/content/__tests__/formula-block.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FormulaBlock } from "../formula-block"

describe("FormulaBlock", () => {
  it("renders formula text", () => {
    render(<FormulaBlock>∀x (P(x) → Q(x))</FormulaBlock>)
    expect(screen.getByText("∀x (P(x) → Q(x))")).toBeInTheDocument()
  })

  it("renders with caption", () => {
    render(<FormulaBlock caption="ド・モルガンの法則">¬(A ∧ B) ≡ ¬A ∨ ¬B</FormulaBlock>)
    expect(screen.getByText("ド・モルガンの法則")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/content/__tests__/formula-block.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```tsx
// src/components/content/formula-block.tsx
import type { ReactNode } from "react"

interface FormulaBlockProps {
  readonly children: ReactNode
  readonly caption?: string
}

export function FormulaBlock({ children, caption }: FormulaBlockProps) {
  return (
    <figure className="not-prose my-6">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-6 py-4 text-center">
        <code className="text-base font-mono text-zinc-800 dark:text-zinc-200">
          {children}
        </code>
      </div>
      {caption && (
        <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/content/__tests__/formula-block.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/content/formula-block.tsx src/components/content/__tests__/formula-block.test.tsx
git commit -m "feat: add FormulaBlock content component"
```

---

### Task 3: ComparisonTable コンポーネント作成

**Files:**
- Create: `src/components/content/comparison-table.tsx`
- Test: `src/components/content/__tests__/comparison-table.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/content/__tests__/comparison-table.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ComparisonTable } from "../comparison-table"

describe("ComparisonTable", () => {
  it("renders two columns with headers and rows", () => {
    render(
      <ComparisonTable
        headers={["正しい", "間違い"]}
        rows={[
          ["∀x(P(x) → Q(x))", "∀x(P(x) ∧ Q(x))"],
          ["→ で条件を絞る", "∧ で全対象に適用"],
        ]}
      />
    )
    expect(screen.getByText("正しい")).toBeInTheDocument()
    expect(screen.getByText("間違い")).toBeInTheDocument()
    expect(screen.getByText("∀x(P(x) → Q(x))")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/content/__tests__/comparison-table.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```tsx
// src/components/content/comparison-table.tsx

interface ComparisonTableProps {
  readonly headers: readonly [string, string]
  readonly rows: readonly (readonly [string, string])[]
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium border border-zinc-200 dark:border-zinc-700">
              {headers[0]}
            </th>
            <th className="text-left px-4 py-2 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300 font-medium border border-zinc-200 dark:border-zinc-700">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                {row[0]}
              </td>
              <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                {row[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/content/__tests__/comparison-table.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/content/comparison-table.tsx src/components/content/__tests__/comparison-table.test.tsx
git commit -m "feat: add ComparisonTable content component"
```

---

### Task 4: KeyPoint コンポーネント作成

**Files:**
- Create: `src/components/content/key-point.tsx`
- Test: `src/components/content/__tests__/key-point.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/content/__tests__/key-point.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { KeyPoint } from "../key-point"

describe("KeyPoint", () => {
  it("renders key point content", () => {
    render(<KeyPoint>∀は例外なくすべてを要求する。</KeyPoint>)
    expect(screen.getByText("∀は例外なくすべてを要求する。")).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/content/__tests__/key-point.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```tsx
// src/components/content/key-point.tsx
import type { ReactNode } from "react"

interface KeyPointProps {
  readonly children: ReactNode
}

export function KeyPoint({ children }: KeyPointProps) {
  return (
    <div className="not-prose my-6 border-y border-zinc-200 dark:border-zinc-700 py-4 px-1">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
        {children}
      </p>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/content/__tests__/key-point.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/content/key-point.tsx src/components/content/__tests__/key-point.test.tsx
git commit -m "feat: add KeyPoint content component"
```

---

### Task 5: barrel export + SectionDivider

**Files:**
- Create: `src/components/content/index.ts`
- Create: `src/components/content/section-divider.tsx`

**Step 1: Create barrel export**

```ts
// src/components/content/index.ts
export { Callout } from "./callout"
export { FormulaBlock } from "./formula-block"
export { ComparisonTable } from "./comparison-table"
export { KeyPoint } from "./key-point"
export { SectionDivider } from "./section-divider"
```

**Step 2: Create SectionDivider (simple visual break between major sections)**

```tsx
// src/components/content/section-divider.tsx
export function SectionDivider() {
  return (
    <div className="not-prose my-10 flex justify-center">
      <div className="w-12 border-t border-zinc-300 dark:border-zinc-600" />
    </div>
  )
}
```

**Step 3: Run all component tests**

Run: `pnpm vitest run src/components/content/`
Expected: All pass

**Step 4: Commit**

```bash
git add src/components/content/index.ts src/components/content/section-divider.tsx
git commit -m "feat: add barrel export and SectionDivider for content components"
```

---

### Task 6: Chapter 04f theory.tsx のリライト（パイロット章）

**Files:**
- Modify: `content/chapters/04f-sql-connection/theory.tsx`

04fをパイロットとして、新コンポーネントを使って書き直す。以下のルールに従う:

**リライト方針:**
1. 各セクションの冒頭に1-2文の要約（h2直後に短いリード文）
2. 定義は `<Callout variant="definition">` で囲む
3. 重要な公式・SQL文は `<FormulaBlock>` でハイライト
4. 正しい/間違いの対比は `<ComparisonTable>` を使う
5. 段落は最大3文。4文以上は分割
6. セクション末に `<KeyPoint>` で要点をまとめる
7. 大セクション間に `<SectionDivider />` を入れる
8. 誤解セクションは `<Callout variant="warning">` を使う
9. 実用的なヒントは `<Callout variant="tip">` を使う

**重要な内容の変更:**
- 文章を短く刻む（1段落3文以内）
- 結論を先に言い、理由を後に述べる構成に
- 抽象→具体の流れを明確にする
- 長い箇条書きは小見出し（h3）で分割

**Step 1: Rewrite the content**

theory.tsxを新コンポーネントを活用して全面リライト。内容は同じだが構成とUI表現を刷新。具体的なコードは実装時にライターエージェントが判断する。

**Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add content/chapters/04f-sql-connection/theory.tsx
git commit -m "refactor: rewrite 04f theory with content components for readability"
```

---

### Task 7: Chapter 04a theory.tsx のリライト

**Files:**
- Modify: `content/chapters/04a-predicates/theory.tsx`

04aを同じルールで書き直す。パイロット（04f）のパターンを踏襲する。

**Step 1: Rewrite content using components**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/04a-predicates/theory.tsx
git commit -m "refactor: rewrite 04a theory with content components for readability"
```

---

### Task 8: Chapter 04b theory.tsx のリライト

**Files:**
- Modify: `content/chapters/04b-universal/theory.tsx`

**Step 1: Rewrite content using components**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/04b-universal/theory.tsx
git commit -m "refactor: rewrite 04b theory with content components for readability"
```

---

### Task 9: Chapter 04c theory.tsx のリライト

**Files:**
- Modify: `content/chapters/04c-existential/theory.tsx`

**Step 1: Rewrite content using components**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/04c-existential/theory.tsx
git commit -m "refactor: rewrite 04c theory with content components for readability"
```

---

### Task 10: Chapter 04d theory.tsx のリライト

**Files:**
- Modify: `content/chapters/04d-negation/theory.tsx`

**Step 1: Rewrite content using components**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/04d-negation/theory.tsx
git commit -m "refactor: rewrite 04d theory with content components for readability"
```

---

### Task 11: Chapter 04e theory.tsx のリライト

**Files:**
- Modify: `content/chapters/04e-multiple-quantifiers/theory.tsx`

**Step 1: Rewrite content using components**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/04e-multiple-quantifiers/theory.tsx
git commit -m "refactor: rewrite 04e theory with content components for readability"
```

---

### Task 12: Chapter 01-03 theory.tsx のリライト

**Files:**
- Modify: `content/chapters/01-propositions/theory.tsx`
- Modify: `content/chapters/02-truth-tables/theory.tsx`
- Modify: `content/chapters/03-validity/theory.tsx`

3つまとめてリライト。パイロットと同じルールを適用。

**Step 1: Rewrite all three chapters**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/01-propositions/theory.tsx content/chapters/02-truth-tables/theory.tsx content/chapters/03-validity/theory.tsx
git commit -m "refactor: rewrite chapters 01-03 theory with content components"
```

---

### Task 13: Chapter 05-06 theory.tsx のリライト

**Files:**
- Modify: `content/chapters/05-fallacies/theory.tsx`
- Modify: `content/chapters/06-synthesis/theory.tsx`

**Step 1: Rewrite both chapters**
**Step 2: Verify build** — `pnpm build`
**Step 3: Commit**

```bash
git add content/chapters/05-fallacies/theory.tsx content/chapters/06-synthesis/theory.tsx
git commit -m "refactor: rewrite chapters 05-06 theory with content components"
```

---

### Task 14: 最終検証 — テスト・ビルド・TypeScript

**Files:** None (verification only)

**Step 1: Run all tests**

Run: `pnpm vitest run`
Expected: All tests pass (既存57 + 新4 = 61+)

**Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Run TypeScript check**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 4: Commit any final fixes**

```bash
git commit -m "chore: verify all chapters pass build and tests after UI refresh"
```
