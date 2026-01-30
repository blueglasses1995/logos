# Wikipedia風用語リンク（Glossary Auto-Link）Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 哲学コラム内の専門用語を自動検出し、クリックするとモーダルで補足説明を表示するWikipedia風リンク機能を構築する。

**Architecture:** 全章共通の用語辞典（`glossary.ts`）に用語・説明・関連章を定義。`<AutoLinkedArticle>` コンポーネントがReactのJSXツリーを再帰的に走査し、テキストノード中のglossary用語を `<GlossaryTerm>` に自動置換する。段落ごとに初出のみリンク化。クリックでRadix UI Dialogモーダルが開き、説明と関連章リンクを表示。

**Tech Stack:** React 19, Next.js 16, Radix UI Dialog, Tailwind CSS 4, TypeScript, Vitest

---

### Task 1: Radix UI Dialog のインストールと Dialog UIコンポーネント作成

**Files:**
- Modify: `package.json` (add `@radix-ui/react-dialog`)
- Create: `src/components/ui/dialog.tsx`

**Step 1: Install Radix UI Dialog**

```bash
pnpm add @radix-ui/react-dialog
```

**Step 2: Create Dialog UI component**

Create `src/components/ui/dialog.tsx` following the existing UI component pattern (CVA + Radix + cn utility):

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

function Dialog({ ...props }: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props} />
}

function DialogTrigger({
  className,
  ...props
}: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger className={className} {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="size-4" />
          <span className="sr-only">閉じる</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
```

**Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/dialog.tsx
git commit -m "feat: add Radix UI Dialog component"
```

---

### Task 2: 用語辞典データ（glossary.ts）の作成とテスト

**Files:**
- Create: `content/glossary.ts`
- Create: `src/lib/__tests__/glossary.test.ts`

**Step 1: Write the failing test**

Create `src/lib/__tests__/glossary.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { GLOSSARY, getGlossaryEntry, getMatchableTerms } from "../../../content/glossary"

describe("glossary", () => {
  it("exports a non-empty array of glossary entries", () => {
    expect(GLOSSARY.length).toBeGreaterThan(0)
  })

  it("each entry has required fields", () => {
    for (const entry of GLOSSARY) {
      expect(entry.term).toBeTruthy()
      expect(entry.description).toBeTruthy()
      expect(Array.isArray(entry.relatedChapters)).toBe(true)
    }
  })

  it("getGlossaryEntry finds entry by term", () => {
    const entry = getGlossaryEntry("述語論理")
    expect(entry).toBeDefined()
    expect(entry?.term).toBe("述語論理")
  })

  it("getGlossaryEntry returns undefined for unknown term", () => {
    expect(getGlossaryEntry("存在しない用語")).toBeUndefined()
  })

  it("getMatchableTerms returns terms sorted by length descending", () => {
    const terms = getMatchableTerms()
    for (let i = 1; i < terms.length; i++) {
      expect(terms[i - 1].length).toBeGreaterThanOrEqual(terms[i].length)
    }
  })

  it("has no duplicate terms", () => {
    const terms = GLOSSARY.map((e) => e.term)
    expect(new Set(terms).size).toBe(terms.length)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/glossary.test.ts`
Expected: FAIL (module not found)

**Step 3: Create glossary data**

Create `content/glossary.ts`:

```typescript
export interface GlossaryEntry {
  readonly term: string
  readonly reading?: string
  readonly description: string
  readonly relatedChapters: readonly {
    readonly slug: string
    readonly label: string
  }[]
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  // 第1章: 命題論理
  {
    term: "命題",
    description:
      "真か偽のいずれか一方の値を持つ文のこと。「東京は日本の首都である」は真の命題、「2+2=5」は偽の命題。疑問文や命令文は命題ではない。命題論理の最も基本的な構成要素。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 命題と論理結合子" },
    ],
  },
  {
    term: "論理結合子",
    description:
      "命題を結合して複合命題を作る演算子の総称。¬（否定）、∧（連言）、∨（選言）、→（条件法）、↔（双条件法）の5つが基本。ブール代数ではAND・OR・NOTに対応し、デジタル回路の設計原理でもある。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 命題と論理結合子" },
      { slug: "02-truth-tables", label: "第2章: 真理値表" },
    ],
  },
  {
    term: "アリストテレス",
    description:
      "紀元前384-322年。プラトンの弟子で、西洋論理学の創始者。著作群『オルガノン（道具）』で三段論法を体系化し、約2000年間にわたって論理学の標準的体系を確立した。論理学を哲学の一部門ではなく、あらゆる学問に先立つ「道具」と位置づけた。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 哲学コラム" },
    ],
  },
  {
    term: "三段論法",
    description:
      "アリストテレスが定式化した推論形式。2つの前提から1つの結論を導く。例:「すべての人間は死すべきものである。ソクラテスは人間である。ゆえにソクラテスは死すべきものである。」約2000年間、論理学の中核として使われた。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 哲学コラム" },
      { slug: "04-predicate-logic", label: "第4章: 述語論理" },
    ],
  },

  // 第2章: 真理値表
  {
    term: "真理値表",
    description:
      "複合命題のすべての可能な真偽の組み合わせを一覧にした表。命題変数がn個あれば2^n行になる。トートロジーや論理的同値の判定に使われる。ライプニッツの「計算しましょう（calculemus）」の夢の部分的実現。",
    relatedChapters: [
      { slug: "02-truth-tables", label: "第2章: 真理値表とトートロジー" },
    ],
  },
  {
    term: "トートロジー",
    description:
      "命題変数にどのような真偽値を代入しても常に真になる論理式。例: P ∨ ¬P（排中律）。トートロジーは論理法則であり、世界についての情報を含まないが、推論の妥当性を保証する基盤となる。",
    relatedChapters: [
      { slug: "02-truth-tables", label: "第2章: 真理値表とトートロジー" },
    ],
  },
  {
    term: "ライプニッツ",
    reading: "ゴットフリート・ヴィルヘルム・ライプニッツ",
    description:
      "1646-1716年。ドイツの哲学者・数学者。30年戦争の記憶から「争いを計算で解決する」という普遍的記号法（characteristica universalis）を構想した。「計算しましょう（calculemus）」の宣言は有名。微積分をニュートンと独立に発見した人物でもある。",
    relatedChapters: [
      { slug: "02-truth-tables", label: "第2章: 哲学コラム" },
    ],
  },

  // 第3章: 妥当性と健全性
  {
    term: "妥当性",
    description:
      "推論の形式的な正しさ。前提がすべて真であると仮定した場合に、結論も必ず真になる推論形式を「妥当」と呼ぶ。前提の内容が実際に真かどうかは問わない。妥当かつ前提が実際に真である推論は「健全」と呼ばれる。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
    ],
  },
  {
    term: "健全性",
    description:
      "推論が妥当であり、かつすべての前提が実際に真であること。健全な推論の結論は必ず真である。論理学において最も信頼できる推論の形式。「妥当だが不健全」な推論は形式は正しいが前提が偽。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
    ],
  },
  {
    term: "モーダスポネンス",
    description:
      "最も基本的な妥当な推論形式の一つ。「PならばQ」と「P」から「Q」を導く。前件肯定（modus ponens）とも呼ばれる。日常の推論でも頻繁に使われる形式。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
    ],
  },
  {
    term: "モーダストレンス",
    description:
      "「PならばQ」と「Qでない」から「Pでない」を導く妥当な推論形式。後件否定（modus tollens）とも呼ばれる。ポパーの反証主義の論理構造そのもの——仮説Hから予測Oを導き、Oが観察されなければHは偽。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
      { slug: "03-validity", label: "第3章: 哲学コラム（ポパー）" },
    ],
  },
  {
    term: "反証可能性",
    description:
      "カール・ポパーが提唱した科学と非科学の区別基準。科学的理論は、どのような観察がなされたら理論が間違っていると結論できるかを明確に述べられなければならない。反証不可能な理論（どのような結果でも説明できる理論）は科学ではない。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 哲学コラム（ポパー）" },
    ],
  },
  {
    term: "ポパー",
    reading: "カール・ポパー",
    description:
      "1902-1994年。オーストリア出身の科学哲学者。1919年のウィーンでアドラー心理学の「何でも説明できる」性質に疑問を持ち、反証可能性を科学の基準として提唱。アインシュタインの理論がリスクのある予測を出すことと対比した。著書『開かれた社会とその敵』で全体主義を批判。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 哲学コラム" },
    ],
  },

  // 第4章: 述語論理
  {
    term: "述語論理",
    description:
      "命題論理を拡張し、個体・述語・量化子を導入した論理体系。「すべてのxについてP(x)」（∀x P(x)）や「あるxが存在してP(x)」（∃x P(x)）を形式的に表現できる。フレーゲが1879年の『概念記法』で創始した。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 述語論理の基礎" },
    ],
  },
  {
    term: "量化子",
    description:
      "変数の範囲を指定する記号。全称量化子∀（すべての）と存在量化子∃（ある...が存在する）の2つがある。フレーゲが『概念記法』で導入し、ワイエルシュトラスのε-δ論法のような数学的推論を形式化することを可能にした。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 述語論理の基礎" },
    ],
  },
  {
    term: "フレーゲ",
    reading: "ゴットロープ・フレーゲ",
    description:
      "1848-1925年。ドイツの数学者・論理学者。イエナ大学教授。算術を純粋な論理から導出する「論理主義」を目指し、1879年に述語論理を創始する革命的著作『概念記法』を出版。しかし1902年、ラッセルのパラドックスにより主著の体系が崩壊する悲劇を経験した。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 哲学コラム" },
    ],
  },
  {
    term: "ラッセル",
    reading: "バートランド・ラッセル",
    description:
      "1872-1970年。イギリスの哲学者・数学者・論理学者。1902年にフレーゲの体系に致命的な矛盾（ラッセルのパラドックス）を発見。その対処として「型理論」を考案した。ホワイトヘッドとの共著『プリンキピア・マテマティカ』は論理学の金字塔。ノーベル文学賞受賞者でもある。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 哲学コラム" },
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
  {
    term: "型理論",
    description:
      "ラッセルがパラドックスへの対処として考案した理論。集合を「型（レベル）」に分類し、自分自身を要素として含むことを禁止する。現代のプログラミング言語の型システム（TypeScript、Haskell、Rust）は型理論の直系の子孫である。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 哲学コラム" },
    ],
  },

  // 第5章: 誤謬
  {
    term: "誤謬",
    description:
      "論理的に不正な推論。もっともらしく聞こえるが、前提から結論を正当に導いていない議論のこと。形式的誤謬（推論形式自体が不正）と非形式的誤謬（内容や文脈の問題）に大別される。アリストテレスが『詭弁論駁論』で初めて体系的に分類した。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 非形式的誤謬" },
    ],
  },
  {
    term: "後件肯定",
    description:
      "形式的誤謬の一つ。「PならばQ」と「Q」から「P」を結論する誤った推論。例:「雨が降れば地面が濡れる。地面が濡れている。ゆえに雨が降った」——スプリンクラーの可能性を無視している。科学における「検証」の論理的不完全性の根拠。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 非形式的誤謬" },
      { slug: "03-validity", label: "第3章: 哲学コラム（ポパー）" },
    ],
  },
  {
    term: "人身攻撃",
    description:
      "非形式的誤謬の一つ。議論の内容ではなく、主張者の人格・動機・属性を攻撃することで反論に代える論法。ラテン語でad hominem。SNSで最も頻繁に見られる誤謬の一つ。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 非形式的誤謬" },
    ],
  },
  {
    term: "ソフィスト",
    description:
      "紀元前5世紀のギリシャで弁論術を教えた職業教師たち。アテネの民主制が生んだ「弁論の技術」への需要に応えた。プロタゴラスが最も有名で「人間は万物の尺度」と宣言した。プラトンから激しく批判されたが、民主制という政治体制が彼らを必要としていた。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 哲学コラム" },
      { slug: "01-propositions", label: "第1章: 哲学コラム" },
    ],
  },
  {
    term: "プラトン",
    description:
      "紀元前427-347年。ソクラテスの弟子、アリストテレスの師。対話篇『ゴルギアス』でソフィストの弁論術を「料理術」に喩え、真理の追求なき説得を批判した。アカデメイアを創設し、「哲学は真理を追求するが、弁論術は見かけの真理を追求する」と論じた。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 哲学コラム" },
    ],
  },

  // 第6章: 総合
  {
    term: "ウィトゲンシュタイン",
    reading: "ルートヴィヒ・ウィトゲンシュタイン",
    description:
      "1889-1951年。オーストリア出身の哲学者。前期の『論理哲学論考』で論理によって世界を完全に記述しようとし、後期の『哲学探究』でその理論を自ら否定した。「語りえぬものについては沈黙しなければならない」は最も有名な一文。",
    relatedChapters: [
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
  {
    term: "論理哲学論考",
    reading: "Tractatus Logico-Philosophicus",
    description:
      "ウィトゲンシュタインの前期主著（1921年出版）。第一次世界大戦中の塹壕と捕虜収容所で書かれた。「世界は事実の総体である」から始まり、命題は現実の像（写像）であるとする。フレーゲとラッセルの論理学を極限まで推し進めた論理的世界観の表現。",
    relatedChapters: [
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
  {
    term: "言語ゲーム",
    description:
      "後期ウィトゲンシュタインの中心概念。言葉の意味は固定的な対象への対応ではなく、その言葉がどのように使われるかによって決まるとする。「ゲーム」という語自体に共通の本質はなく、「家族的類似性」で結ばれた多様な活動がある。",
    relatedChapters: [
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
]

const termIndex = new Map<string, GlossaryEntry>(
  GLOSSARY.map((entry) => [entry.term, entry])
)

export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return termIndex.get(term)
}

export function getMatchableTerms(): readonly string[] {
  return [...termIndex.keys()].sort((a, b) => b.length - a.length)
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/__tests__/glossary.test.ts`
Expected: All 6 tests PASS

**Step 5: Commit**

```bash
git add content/glossary.ts src/lib/__tests__/glossary.test.ts
git commit -m "feat: add glossary data with 24 logic/philosophy terms"
```

---

### Task 3: autoLinkText ユーティリティ関数の作成とテスト

用語の自動検出ロジックをReactコンポーネントから分離した純粋関数として実装する。

**Files:**
- Create: `src/lib/auto-link.ts`
- Create: `src/lib/__tests__/auto-link.test.ts`

**Step 1: Write the failing test**

Create `src/lib/__tests__/auto-link.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { splitTextByTerms } from "../auto-link"

describe("splitTextByTerms", () => {
  const terms = ["述語論理", "論理", "フレーゲ"]

  it("returns original text as single segment when no terms match", () => {
    const result = splitTextByTerms("関係のないテキスト", terms)
    expect(result).toEqual([{ type: "text", value: "関係のないテキスト" }])
  })

  it("splits text around a matching term", () => {
    const result = splitTextByTerms("フレーゲは偉大だ", terms)
    expect(result).toEqual([
      { type: "term", value: "フレーゲ" },
      { type: "text", value: "は偉大だ" },
    ])
  })

  it("matches longer terms first (述語論理 before 論理)", () => {
    const result = splitTextByTerms("述語論理を学ぶ", terms)
    expect(result).toEqual([
      { type: "term", value: "述語論理" },
      { type: "text", value: "を学ぶ" },
    ])
  })

  it("marks only the first occurrence per term in a single call", () => {
    const result = splitTextByTerms(
      "フレーゲはフレーゲの著作を書いた",
      terms
    )
    const termSegments = result.filter((s) => s.type === "term")
    expect(termSegments).toHaveLength(1)
    expect(termSegments[0].value).toBe("フレーゲ")
  })

  it("handles multiple different terms in one text", () => {
    const result = splitTextByTerms(
      "フレーゲは述語論理を作った",
      terms
    )
    const termSegments = result.filter((s) => s.type === "term")
    expect(termSegments).toHaveLength(2)
    expect(termSegments.map((s) => s.value)).toContain("フレーゲ")
    expect(termSegments.map((s) => s.value)).toContain("述語論理")
  })

  it("handles empty text", () => {
    const result = splitTextByTerms("", terms)
    expect(result).toEqual([])
  })

  it("handles text that is exactly a term", () => {
    const result = splitTextByTerms("フレーゲ", terms)
    expect(result).toEqual([{ type: "term", value: "フレーゲ" }])
  })

  it("respects alreadyLinked set to skip terms", () => {
    const alreadyLinked = new Set(["フレーゲ"])
    const result = splitTextByTerms("フレーゲは述語論理を作った", terms, alreadyLinked)
    const termSegments = result.filter((s) => s.type === "term")
    expect(termSegments).toHaveLength(1)
    expect(termSegments[0].value).toBe("述語論理")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/auto-link.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement splitTextByTerms**

Create `src/lib/auto-link.ts`:

```typescript
export interface TextSegment {
  readonly type: "text" | "term"
  readonly value: string
}

/**
 * Split text into segments, identifying glossary terms.
 * Terms are matched longest-first. Each term is only matched once per call.
 * Pass alreadyLinked to skip terms that were already linked in a prior paragraph.
 */
export function splitTextByTerms(
  text: string,
  sortedTerms: readonly string[],
  alreadyLinked: ReadonlySet<string> = new Set()
): readonly TextSegment[] {
  if (text.length === 0) return []

  const linkedInThisCall = new Set<string>(alreadyLinked)
  const segments: TextSegment[] = []
  let remaining = text

  while (remaining.length > 0) {
    let earliestIndex = Infinity
    let matchedTerm: string | undefined

    for (const term of sortedTerms) {
      if (linkedInThisCall.has(term)) continue
      const idx = remaining.indexOf(term)
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx
        matchedTerm = term
      }
    }

    if (matchedTerm === undefined || earliestIndex === Infinity) {
      segments.push({ type: "text", value: remaining })
      break
    }

    if (earliestIndex > 0) {
      segments.push({ type: "text", value: remaining.slice(0, earliestIndex) })
    }

    segments.push({ type: "term", value: matchedTerm })
    linkedInThisCall.add(matchedTerm)
    remaining = remaining.slice(earliestIndex + matchedTerm.length)
  }

  return segments
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/__tests__/auto-link.test.ts`
Expected: All 8 tests PASS

**Step 5: Commit**

```bash
git add src/lib/auto-link.ts src/lib/__tests__/auto-link.test.ts
git commit -m "feat: add splitTextByTerms utility for glossary term detection"
```

---

### Task 4: GlossaryModal コンポーネントの作成

**Files:**
- Create: `src/components/glossary/glossary-modal.tsx`

**Step 1: Create GlossaryModal component**

Create `src/components/glossary/glossary-modal.tsx`:

```tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type GlossaryEntry } from "../../../content/glossary"
import Link from "next/link"

interface GlossaryModalProps {
  readonly entry: GlossaryEntry | null
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export function GlossaryModal({ entry, open, onOpenChange }: GlossaryModalProps) {
  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry.term}
            {entry.reading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                （{entry.reading}）
              </span>
            )}
          </DialogTitle>
          <DialogDescription>{entry.description}</DialogDescription>
        </DialogHeader>
        {entry.relatedChapters.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              関連する章:
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.relatedChapters.map((ch) => (
                <Link key={`${ch.slug}-${ch.label}`} href={`/chapters/${ch.slug}`}>
                  <Button variant="outline" size="sm">
                    {ch.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/glossary/glossary-modal.tsx
git commit -m "feat: add GlossaryModal component with term info and chapter links"
```

---

### Task 5: AutoLinkedArticle コンポーネントの作成とテスト

JSXツリーを再帰的に走査し、テキストノード中のglossary用語を自動リンク化するコンポーネント。

**Files:**
- Create: `src/components/glossary/auto-linked-article.tsx`
- Create: `src/components/glossary/__tests__/auto-linked-article.test.tsx`

**Step 1: Write the failing test**

Create `src/components/glossary/__tests__/auto-linked-article.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AutoLinkedArticle } from "../auto-linked-article"

describe("AutoLinkedArticle", () => {
  it("renders children without modification when no terms match", () => {
    render(
      <AutoLinkedArticle>
        <article>
          <p>関係のないテキスト</p>
        </article>
      </AutoLinkedArticle>
    )
    expect(screen.getByText("関係のないテキスト")).toBeInTheDocument()
  })

  it("converts glossary terms into clickable links", () => {
    render(
      <AutoLinkedArticle>
        <article>
          <p>フレーゲは述語論理を作った。</p>
        </article>
      </AutoLinkedArticle>
    )
    const termButton = screen.getByRole("button", { name: "フレーゲ" })
    expect(termButton).toBeInTheDocument()
    expect(termButton).toHaveClass("glossary-term")
  })

  it("opens modal when a term is clicked", async () => {
    const user = userEvent.setup()
    render(
      <AutoLinkedArticle>
        <article>
          <p>フレーゲは述語論理を作った。</p>
        </article>
      </AutoLinkedArticle>
    )
    await user.click(screen.getByRole("button", { name: "フレーゲ" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(/ドイツの数学者・論理学者/)).toBeInTheDocument()
  })

  it("links only the first occurrence of a term per paragraph", () => {
    render(
      <AutoLinkedArticle>
        <article>
          <p>フレーゲはフレーゲの著作を書いた。</p>
        </article>
      </AutoLinkedArticle>
    )
    const buttons = screen.getAllByRole("button", { name: "フレーゲ" })
    expect(buttons).toHaveLength(1)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/glossary/__tests__/auto-linked-article.test.tsx`
Expected: FAIL (module not found)

**Step 3: Implement AutoLinkedArticle**

Create `src/components/glossary/auto-linked-article.tsx`:

```tsx
"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactNode,
  type ReactElement,
} from "react"
import { getGlossaryEntry, getMatchableTerms } from "../../../content/glossary"
import { splitTextByTerms } from "@/lib/auto-link"
import { GlossaryModal } from "./glossary-modal"
import type { GlossaryEntry } from "../../../content/glossary"

const PARAGRAPH_TAGS = new Set(["p", "li", "blockquote", "td"])

export function AutoLinkedArticle({
  children,
}: {
  readonly children: ReactNode
}) {
  const [modalEntry, setModalEntry] = useState<GlossaryEntry | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const terms = getMatchableTerms()

  function handleTermClick(term: string) {
    const entry = getGlossaryEntry(term)
    if (entry) {
      setModalEntry(entry)
      setModalOpen(true)
    }
  }

  function processNode(node: ReactNode, linkedInScope: Set<string>): ReactNode {
    if (typeof node === "string") {
      return renderLinkedText(node, terms, linkedInScope, handleTermClick)
    }

    if (!isValidElement(node)) return node

    const element = node as ReactElement<{ children?: ReactNode }>
    const tag =
      typeof element.type === "string" ? element.type : null

    // For paragraph-level elements, reset per-paragraph tracking
    const scopeForChildren = tag && PARAGRAPH_TAGS.has(tag)
      ? new Set<string>()
      : linkedInScope

    const newChildren = Children.map(
      element.props.children,
      (child) => processNode(child, scopeForChildren)
    )

    return cloneElement(element, {}, newChildren)
  }

  const processed = Children.map(children, (child) =>
    processNode(child, new Set())
  )

  return (
    <>
      {processed}
      <GlossaryModal
        entry={modalEntry}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}

function renderLinkedText(
  text: string,
  terms: readonly string[],
  linkedInScope: Set<string>,
  onClick: (term: string) => void
): ReactNode {
  const segments = splitTextByTerms(text, terms, linkedInScope)

  // Track which terms were linked
  for (const seg of segments) {
    if (seg.type === "term") {
      linkedInScope.add(seg.value)
    }
  }

  if (segments.length === 1 && segments[0].type === "text") {
    return text
  }

  return segments.map((seg, i) =>
    seg.type === "term" ? (
      <button
        key={`${seg.value}-${i}`}
        type="button"
        className="glossary-term text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
        onClick={() => onClick(seg.value)}
      >
        {seg.value}
      </button>
    ) : (
      <span key={i}>{seg.value}</span>
    )
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/glossary/__tests__/auto-linked-article.test.tsx`
Expected: All 4 tests PASS

**Step 5: Commit**

```bash
git add src/components/glossary/auto-linked-article.tsx src/components/glossary/__tests__/auto-linked-article.test.tsx
git commit -m "feat: add AutoLinkedArticle component for automatic glossary linking"
```

---

### Task 6: 哲学コラムページへの統合

`<PhilosophyContent />` を `<AutoLinkedArticle>` でラップする。

**Files:**
- Modify: `src/app/chapters/[slug]/philosophy/page.tsx`

**Step 1: Update philosophy page**

Modify `src/app/chapters/[slug]/philosophy/page.tsx`:

Add import at top:
```tsx
import { AutoLinkedArticle } from "@/components/glossary/auto-linked-article"
```

Wrap `<PhilosophyContent />` (line 40) with `<AutoLinkedArticle>`:
```tsx
<AutoLinkedArticle>
  <PhilosophyContent />
</AutoLinkedArticle>
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Run all tests**

Run: `pnpm vitest run`
Expected: All tests pass (existing 39 + new glossary/auto-link tests).

**Step 4: Commit**

```bash
git add src/app/chapters/[slug]/philosophy/page.tsx
git commit -m "feat: integrate glossary auto-linking into philosophy pages"
```

---

### Task 7: 全体検証

**Step 1: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass.

**Step 2: Run production build**

Run: `pnpm build`
Expected: Build succeeds with all routes generated.

**Step 3: Verify no TypeScript errors**

Run: `pnpm tsc --noEmit`
Expected: No errors.
