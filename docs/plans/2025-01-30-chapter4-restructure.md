# 第4章 述語論理 — 1単元1概念への分割リストラクチャ Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 第4章を6つの独立したサブチャプター（04a〜04f）に分割し、各単元で1つの概念だけを深く掘り下げる教育コンテンツを構築する。

**Architecture:** 既存の `04-predicate-logic` を `04a-predicates` 〜 `04f-sql-connection` の6つの独立チャプターに分割。各チャプターは既存パターンに従い theory.tsx + theory-quizzes.json + practice-quizzes.json を持つ。content-registry.ts と content.ts に新チャプターを登録。各単元の構成は: ①定義 → ②具体例 → ③成り立たない例 → ④使われる分野・学ぶメリット・ないとどう困るか → ⑤よくある誤解と実際。

**Tech Stack:** React 19, TypeScript, Next.js 16, Vitest

---

## サブチャプター設計

| サブ章 | slug | 概念 |
|--------|------|------|
| 4a | `04a-predicates` | 述語と項 — 命題論理の限界と述語の導入 |
| 4b | `04b-universal` | 全称量化子（∀） |
| 4c | `04c-existential` | 存在量化子（∃） |
| 4d | `04d-negation` | 量化子の否定 — ド・モルガンの一般化 |
| 4e | `04e-multiple-quantifiers` | 多重量化 — 量化子の順序 |
| 4f | `04f-sql-connection` | 述語論理とSQL — 理論と実務の接続 |

## 各単元の共通構成（theory.tsx）

```
<h1>タイトル</h1>

<h2>定義</h2>
明確な定義。1文で言い切る。次にその意味を噛み砕いて説明。

<h2>具体例</h2>
日常・数学・プログラミングからの具体例を3-4個。

<h2>成り立たない例（反例）</h2>
一見正しそうだが実は異なるケース。なぜ間違いかを説明。

<h2>どこで使われるか / なぜ学ぶのか</h2>
数学・計算機科学・法律・ビジネスでの応用。
この概念がないとどう困るか。社会的・学問的影響。

<h2>よくある誤解</h2>
なぜその誤解が生まれるか。実際はどうなのか。
```

---

### Task 1: 旧 Chapter 4 の削除と新チャプター構造の準備

**Files:**
- Delete content from: `content/chapters/04-predicate-logic/theory.tsx` (replace with redirect notice)
- Modify: `src/lib/content.ts` (replace old ch4 with 6 new entries)
- Modify: `src/lib/content-registry.ts` (remove old ch4, add 6 new)
- Create directories: `content/chapters/04a-predicates/` through `04f-sql-connection/`

**Step 1: Create new chapter directories**

```bash
mkdir -p content/chapters/04a-predicates
mkdir -p content/chapters/04b-universal
mkdir -p content/chapters/04c-existential
mkdir -p content/chapters/04d-negation
mkdir -p content/chapters/04e-multiple-quantifiers
mkdir -p content/chapters/04f-sql-connection
```

**Step 2: Update CHAPTERS array in content.ts**

Replace the old `04-predicate-logic` entry (lines 24-28) in `src/lib/content.ts` with:

```typescript
  {
    slug: "04a-predicates",
    title: "述語と項",
    order: 4,
    description: "命題論理の限界を知り、述語と項という新しい道具を手に入れる",
  },
  {
    slug: "04b-universal",
    title: "全称量化子（∀）",
    order: 5,
    description: "「すべての」を厳密に表現する — 全称量化子の定義と使い方",
  },
  {
    slug: "04c-existential",
    title: "存在量化子（∃）",
    order: 6,
    description: "「存在する」を厳密に表現する — 存在量化子の定義と使い方",
  },
  {
    slug: "04d-negation",
    title: "量化子の否定",
    order: 7,
    description: "∀と∃の否定関係 — ド・モルガンの法則の一般化",
  },
  {
    slug: "04e-multiple-quantifiers",
    title: "多重量化",
    order: 8,
    description: "量化子の順序が意味を変える — 入れ子の量化子を読み解く",
  },
  {
    slug: "04f-sql-connection",
    title: "述語論理とSQL",
    order: 9,
    description: "述語論理がデータベースの基盤である理由 — 理論と実務の接続",
  },
```

Also update chapters 05 and 06 order numbers to 10 and 11.

**Step 3: Create placeholder theory.tsx for each new chapter**

Each new chapter needs a minimal `theory.tsx` (will be filled in subsequent tasks). Create all 6 with a placeholder:

```tsx
export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>準備中</h1>
      <p>このセクションは準備中です。</p>
    </article>
  )
}
```

Also create empty `theory-quizzes.json` and `practice-quizzes.json` (just `[]`) for each.

**Step 4: Update content-registry.ts**

Remove old `04-predicate-logic` import block and registry entry. Add imports and registry entries for all 6 new chapters. The existing philosophy content stays at `04a-predicates` (since it's about Frege/predicates).

Move the existing philosophy.tsx from `04-predicate-logic/` to `04a-predicates/`. The other 5 sub-chapters won't have philosophy columns (they share the Frege column via 04a).

**Step 5: Run tests and build**

Run: `pnpm vitest run`
Expected: Tests pass (content test may need update for new chapter count).

Run: `pnpm build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: split chapter 4 into 6 sub-chapters (04a-04f) with placeholders"
```

---

### Task 2: 04a — 述語と項（Predicates and Terms）

**Files:**
- Create: `content/chapters/04a-predicates/theory.tsx`
- Create: `content/chapters/04a-predicates/theory-quizzes.json`
- Create: `content/chapters/04a-predicates/practice-quizzes.json`

**Step 1: Write theory content**

Create `content/chapters/04a-predicates/theory.tsx` with the following structure:

```tsx
export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第4a章: 述語と項 — 命題の内部構造を分析する</h1>

      <h2>定義</h2>
      <p>
        <strong>述語（predicate）</strong>とは、
        対象を受け取って命題を返す関数のことです。
      </p>
      <p>
        もう少し噛み砕くと：命題は「真か偽か判定できる文」でした（第1章）。
        述語は「何か（対象）を入れると命題になる、穴の空いた文」です。
        たとえば「___は人間である」は述語です。
        「ソクラテス」を入れると「ソクラテスは人間である」という命題になります。
      </p>
      <p>
        記号では H(x) と書きます。
        H は述語（Human）、x は<strong>項（term）</strong>＝穴に入る対象です。
        H(ソクラテス) は真の命題、H(東京タワー) は偽の命題になります。
      </p>

      <h3>述語の引数の数（アリティ）</h3>
      <p>
        述語が受け取る引数の数を<strong>アリティ</strong>と呼びます。
      </p>
      <ul>
        <li><strong>一項述語</strong>: H(x)「xは人間である」— 対象の性質を表す</li>
        <li><strong>二項述語</strong>: G(x, y)「xはyより大きい」— 2つの対象の関係を表す</li>
        <li><strong>三項述語</strong>: S(x, y, z)「xはyにzを送った」— 3つの対象の関係を表す</li>
      </ul>

      <h2>なぜ命題論理では足りないのか — 具体例</h2>
      <p>
        命題論理（第1〜3章）では、
        「すべての人間は死すべきものである」を一つの命題Pとしか扱えません。
        「ソクラテスは人間である」はまた別の命題Qです。
        この2つの命題の間に構造的な関係（「人間」が共通している）があることを、
        命題論理は表現できません。
      </p>
      <p>
        述語を使うと構造が見えます:
      </p>
      <ul>
        <li>「すべてのxについて、H(x) ならば M(x)」（すべての人間は死すべき）</li>
        <li>「H(ソクラテス)」（ソクラテスは人間）</li>
        <li>したがって「M(ソクラテス)」（ソクラテスは死すべき）</li>
      </ul>
      <p>
        この推論は命題論理では表現不可能ですが、
        述語論理では形式的に証明できます。
        これがアリストテレスの三段論法の現代的な定式化です。
      </p>

      <h2>成り立たない例 — これは述語ではない</h2>
      <ul>
        <li>
          <strong>「おはよう」は述語ではありません。</strong>
          対象を受け取っても命題にならない。真偽を判定できないからです。
        </li>
        <li>
          <strong>「x + 3」は述語ではありません。</strong>
          これは関数（数を入れると数が返る）であって、
          命題（真偽値が返る）ではありません。
          一方「x + 3 = 7」は述語です（xに4を入れると真、それ以外は偽）。
        </li>
        <li>
          <strong>「雨が降っている」は述語ではなく命題です。</strong>
          穴（変数）がないので、すでに真偽が判定できる完成した文です。
        </li>
      </ul>

      <h2>どこで使われるか / なぜ学ぶのか</h2>
      <h3>データベース（SQL）</h3>
      <p>
        SQLの WHERE 句は述語そのものです。
        <code>WHERE age &gt; 20</code> は一項述語「xの年齢は20より大きい」、
        <code>WHERE a.id = b.user_id</code> は二項述語「xのidはyのuser_idと等しい」です。
        データベースの理論的基盤である関係代数は、述語論理の直接的な応用です。
      </p>
      <h3>プログラミングの型システム</h3>
      <p>
        TypeScriptの型ガード <code>function isString(x: unknown): x is string</code> は
        まさに一項述語です。「xはstring型であるか」を真偽で返します。
      </p>
      <h3>法律</h3>
      <p>
        契約書の「甲は乙に対して」という構造は二項述語です。
        法律文は述語の構造を明示的に持っており、
        「誰が」「何を」「誰に対して」を曖昧にすると法的に無効になります。
      </p>

      <h3>述語を知らないとどう困るか</h3>
      <p>
        命題論理しか使えないと、
        「すべての顧客が満足している」と「ある顧客が満足している」の
        構造的な違いを表現できません。
        SQLのWHERE句が書けても、なぜそのように書くのかの論理的根拠がわからない。
        型システムの「型述語」が何をしているのか理解できない。
        述語は「命題の内部構造を見る眼」であり、
        これなしでは複雑な推論を形式化できません。
      </p>

      <h2>よくある誤解</h2>
      <h3>誤解:「述語」＝「動詞」</h3>
      <p>
        日本語の文法では「述語＝動詞や形容詞」ですが、
        論理学の述語はもっと広い概念です。
        「xは素数である」の述語は「素数である」という性質全体であり、
        特定の品詞に限定されません。
        「xの年齢は20以上かつ東京在住」のような複合条件も一つの述語です。
      </p>
      <h3>誤解: 述語には変数が必ず1つだけ</h3>
      <p>
        一項述語が最も単純ですが、述語は任意個の引数を取れます。
        二項述語（関係）、三項述語は実務で頻繁に登場します。
        SQLのJOIN条件は二項述語の典型例です。
      </p>
    </article>
  )
}
```

**Step 2: Write theory quizzes**

Create `content/chapters/04a-predicates/theory-quizzes.json` with 5 questions focused only on predicates/terms (not quantifiers):

```json
[
  {
    "id": "ch4a-t1",
    "type": "multiple-choice",
    "question": "次のうち述語（predicate）はどれですか？",
    "options": [
      "「xは偶数である」",
      "「こんにちは」",
      "「x + 5」",
      "「3は素数である」"
    ],
    "correctIndex": 0,
    "explanation": "「xは偶数である」は対象xを受け取って命題を返す述語です。「こんにちは」は挨拶で命題ではない。「x + 5」は数を返す関数で命題ではない。「3は素数である」は変数がないので命題（述語ではない）です。"
  },
  {
    "id": "ch4a-t2",
    "type": "multiple-choice",
    "question": "「xはyにメールを送った」の述語のアリティ（引数の数）は？",
    "options": [
      "2（二項述語）",
      "1（一項述語）",
      "3（三項述語）",
      "0（命題）"
    ],
    "correctIndex": 0,
    "explanation": "「xはyにメールを送った」はxとyの2つの変数を持つ二項述語です。Send(x, y) と表現します。もし「xはyにzを送った」なら三項述語 Send(x, y, z) になります。"
  },
  {
    "id": "ch4a-t3",
    "type": "multiple-choice",
    "question": "命題論理では「すべての鳥は飛べる」「ペンギンは鳥である」から「ペンギンは飛べる」を導けません。なぜですか？",
    "options": [
      "命題論理は命題の内部構造（主語と述語）を分析できないから",
      "命題論理は誤った推論を許さないから",
      "「すべての」は命題論理で表現できるから",
      "ペンギンは実際には飛べないから"
    ],
    "correctIndex": 0,
    "explanation": "命題論理では「すべての鳥は飛べる」をP、「ペンギンは鳥である」をQとして扱うしかなく、PとQの間に「鳥」という共通の構造があることを表現できません。述語論理ではBird(x)、Fly(x)という述語を使って内部構造を分析できます。"
  },
  {
    "id": "ch4a-t4",
    "type": "multiple-choice",
    "question": "SQLの WHERE age > 20 AND city = 'Tokyo' は論理学的に何ですか？",
    "options": [
      "2つの一項述語の連言（∧）",
      "一つの二項述語",
      "命題（変数なし）",
      "一つの一項述語"
    ],
    "correctIndex": 0,
    "explanation": "age > 20 は「xの年齢が20より大きい」という一項述語、city = 'Tokyo' は「xの都市が東京である」という一項述語です。AND で結合しているので、2つの一項述語の連言（∧）です。"
  },
  {
    "id": "ch4a-t5",
    "type": "multiple-choice",
    "question": "次のうち正しいのはどれですか？",
    "options": [
      "述語は「穴の空いた文」であり、穴に対象を入れると命題になる",
      "述語と命題は同じものである",
      "述語は必ず1つだけの変数を持つ",
      "日本語の文法の「述語」と論理学の「述語」は完全に同じ概念である"
    ],
    "correctIndex": 0,
    "explanation": "述語は変数（穴）を持つ文であり、具体的な対象を入れると真偽が定まる命題になります。述語≠命題（命題は穴がない）、述語は複数変数を持てる、日本語文法の述語は品詞の概念で論理学の述語とは異なります。"
  }
]
```

**Step 3: Write practice quizzes**

Create `content/chapters/04a-predicates/practice-quizzes.json`:

```json
[
  {
    "id": "ch4a-p1",
    "type": "multiple-choice",
    "question": "TypeScriptの型ガード function isArray(x: unknown): x is Array<unknown> は論理学的に何に相当しますか？",
    "options": [
      "一項述語 — 対象xを受け取り「xは配列である」という命題を返す",
      "命題 — 常に真または偽の固定値",
      "二項述語 — xと配列の関係を表す",
      "論理結合子 — 命題を結合する演算子"
    ],
    "correctIndex": 0,
    "explanation": "型ガードは対象xを受け取って「xは○○型か」を判定する一項述語そのものです。IsArray(x) という述語がtrue/falseを返します。"
  },
  {
    "id": "ch4a-p2",
    "type": "multiple-choice",
    "question": "契約書に「甲は乙に対して本件製品を引き渡す」と書かれています。この文の論理構造として最も適切なのは？",
    "options": [
      "三項述語 Deliver(甲, 乙, 製品)",
      "一項述語 Deliver(甲)",
      "命題（変数なし）",
      "二項述語 Deliver(甲, 乙)"
    ],
    "correctIndex": 0,
    "explanation": "「誰が」「誰に」「何を」の3つの要素があるので三項述語です。法律文書では主語・対象・目的語を曖昧にすると法的効力に影響するため、述語構造の明確さが重要です。"
  },
  {
    "id": "ch4a-p3",
    "type": "multiple-choice",
    "question": "SQLのJOIN条件 ON users.id = orders.user_id は論理学的に何ですか？",
    "options": [
      "二項述語 — 2つのテーブルの行の間の関係を表す",
      "一項述語 — 1つの行の性質を表す",
      "命題 — 固定の真偽値を持つ",
      "量化子 — 変数の範囲を指定する"
    ],
    "correctIndex": 0,
    "explanation": "ON users.id = orders.user_id は「usersの行xのidとordersの行yのuser_idが等しい」という二項述語 Equal(x.id, y.user_id) です。JOINはこの述語が真になるペアを見つける操作です。"
  }
]
```

**Step 4: Verify build and tests**

Run: `pnpm vitest run && pnpm build`
Expected: All pass.

**Step 5: Commit**

```bash
git add content/chapters/04a-predicates/
git commit -m "content: add 04a predicates — deep focus on predicates and terms"
```

---

### Task 3: 04b — 全称量化子（∀）

**Files:**
- Create: `content/chapters/04b-universal/theory.tsx`
- Create: `content/chapters/04b-universal/theory-quizzes.json`
- Create: `content/chapters/04b-universal/practice-quizzes.json`

**Step 1: Write theory content**

Each section follows the standard pattern: 定義 → 具体例 → 反例 → 使われる分野 → よくある誤解。

Key content for ∀:
- **定義**: 「すべてのxについてP(x)」— 全称量化子は「例外なくすべて」を主張する
- **具体例**: 日常（「すべての社員は研修済み」）、数学（「すべての偶数は2で割り切れる」）、法律（「すべての国民は納税義務を負う」）、プログラミング（配列のeveryメソッド）
- **∀の形式化パターン**: ∀x (P(x) → Q(x)) が標準形。なぜ∧ではなく→を使うか — ドメイン全体から条件で絞り込む
- **反例**: 「すべての白鳥は白い」は1697年にオーストラリアで黒い白鳥が発見されて反証された。一つの反例で全称命題は崩れる
- **使われる分野**: 数学の定理証明（∀の証明は任意の対象で示す）、契約書の「すべての条項」、品質保証の「すべてのテストが通る」
- **ないと困ること**: 「全部」と「一部」の区別がつかない。法律文書で「すべての従業員」と「一部の従業員」を混同すると契約違反に
- **よくある誤解**:
  - 「∀x (P(x) ∧ Q(x))」と書きがち → 正しくは「∀x (P(x) → Q(x))」。∧だとドメインの全要素がPかつQであるという意味になる
  - 有限回の確認で「すべて」を証明できると思いがち → ∀は無限にも適用される

Quizzes: 5 theory + 3 practice, すべて∀のみに集中。

**Step 2: Verify and commit**

```bash
git add content/chapters/04b-universal/
git commit -m "content: add 04b universal quantifier — deep focus on ∀"
```

---

### Task 4: 04c — 存在量化子（∃）

**Files:**
- Create: `content/chapters/04c-existential/theory.tsx`
- Create: `content/chapters/04c-existential/theory-quizzes.json`
- Create: `content/chapters/04c-existential/practice-quizzes.json`

**Step 1: Write theory content**

Key content for ∃:
- **定義**: 「P(x)が成り立つxが少なくとも一つ存在する」— 存在量化子は「少なくとも一つ」を主張する
- **∃の形式化パターン**: ∃x (P(x) ∧ Q(x)) が標準形。なぜ→ではなく∧を使うか — 存在を主張するには条件と性質の両方を持つ対象が「実在」しなければならない
- **∀との対比**: ∀は→、∃は∧。これが最も混乱しやすいポイント。理由を深掘り
- **具体例**: 日常（「バグが存在する」）、数学（「ある素数は偶数である」→ 2のこと）、プログラミング（配列のsomeメソッド、SQLのEXISTS）
- **反例**: 「∃x (P(x) → Q(x))」は「PでないxまたはQなxが存在する」であり、意図と全く違う結果になることが多い
- **ないと困ること**: 存在の主張が曖昧になる。「バグがある」と「すべてにバグがある」の区別。科学で「反例が存在する」は理論を覆す
- **よくある誤解**:
  - ∃は「ちょうど1つ」ではない → 「少なくとも1つ」であり100個でもよい
  - 「∃x (P(x) → Q(x))」と書きがち → 正しくは∧。→だと空虚に真になりうる

**Step 2: Verify and commit**

```bash
git add content/chapters/04c-existential/
git commit -m "content: add 04c existential quantifier — deep focus on ∃"
```

---

### Task 5: 04d — 量化子の否定

**Files:**
- Create: `content/chapters/04d-negation/theory.tsx`
- Create: `content/chapters/04d-negation/theory-quizzes.json`
- Create: `content/chapters/04d-negation/practice-quizzes.json`

**Step 1: Write theory content**

Key content:
- **定義**: ¬∀x P(x) ≡ ∃x ¬P(x) と ¬∃x P(x) ≡ ∀x ¬P(x)
- **なぜこうなるか**: ∀は「巨大な∧」、∃は「巨大な∨」。ド・モルガンの法則 ¬(A∧B) ≡ ¬A∨¬B の一般化
- **具体例**: 「すべてのテストが通っているわけではない」→「通っていないテストが存在する」、ポパーの反証「この理論は反証された」≡「反例が存在する」
- **反例**: 「¬∀xP(x)」は「∀x¬P(x)」ではない！「すべてが真ではない」≠「すべてが偽」。これは最も危険な誤解
- **使われる分野**: ポパーの反証主義（第3章との接続）、SQLのNOT EXISTS、バグ報告（「全部動かない」vs「一部動かない」）
- **よくある誤解**: 「すべてではない」を「すべてが〜でない」と読み替えてしまう

**Step 2: Verify and commit**

```bash
git add content/chapters/04d-negation/
git commit -m "content: add 04d quantifier negation — De Morgan generalization"
```

---

### Task 6: 04e — 多重量化

**Files:**
- Create: `content/chapters/04e-multiple-quantifiers/theory.tsx`
- Create: `content/chapters/04e-multiple-quantifiers/theory-quizzes.json`
- Create: `content/chapters/04e-multiple-quantifiers/practice-quizzes.json`

**Step 1: Write theory content**

Key content:
- **定義**: 量化子を複数入れ子にすること。順序が意味を変える
- **核心**: ∀x ∃y vs ∃y ∀x — 「各xに対してyが存在」vs「あるyがすべてのxに対して」
- **具体例**: 「すべての人に親がいる」∀x∃y Parent(y,x) vs 「全人類の親が一人いる」∃y∀x Parent(y,x)、「すべてのユーザーが少なくとも1つのロールを持つ」∀x(U(x)→∃y R(x,y))
- **ε-δ論法**: ∀ε>0 ∃δ>0 ... — フレーゲが述語論理を必要とした直接の理由
- **よくある誤解**: 量化子の順序は交換可能だと思いがち → 全く違う意味になる

**Step 2: Verify and commit**

```bash
git add content/chapters/04e-multiple-quantifiers/
git commit -m "content: add 04e multiple quantifiers — order matters"
```

---

### Task 7: 04f — 述語論理とSQL

**Files:**
- Create: `content/chapters/04f-sql-connection/theory.tsx`
- Create: `content/chapters/04f-sql-connection/theory-quizzes.json`
- Create: `content/chapters/04f-sql-connection/practice-quizzes.json`

**Step 1: Write theory content**

Key content:
- **定義**: SQLは述語論理の実装である。関係代数（Codd, 1970）は述語論理に基づく
- **対応表**: WHERE = 述語の適用、EXISTS = ∃、NOT EXISTS (WHERE NOT) = ∀、JOIN ON = 二項述語、SELECT = 射影
- **具体例**: 各対応をSQL実例で示す
- **型理論との接続**: ラッセルの型理論 → 現代のTypeScript/Haskell/Rustの型システム。なぜ「自分自身を含む型」が禁止されるか
- **ないと困ること**: SQLを「暗記」するだけになる。なぜNOT EXISTSで∀を表すかの論理的根拠がないとSQLが呪文になる
- **よくある誤解**: 「SQLは実用的なツールで理論は関係ない」→ 実はSQLの設計者Coddは論理学者であり、SQLは述語論理の直接的実装

**Step 2: Verify and commit**

```bash
git add content/chapters/04f-sql-connection/
git commit -m "content: add 04f SQL connection — theory meets practice"
```

---

### Task 8: content-registry と content.ts の最終更新・テスト修正

**Files:**
- Modify: `src/lib/content-registry.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/__tests__/content.test.ts`
- Modify: `content/glossary.ts` (update relatedChapters slugs for 04-predicate-logic → 04a-predicates etc.)

**Step 1: Update content-registry with actual imports**

Replace placeholder imports with actual component imports for all 6 sub-chapters.

**Step 2: Update glossary related chapter slugs**

Change all `slug: "04-predicate-logic"` references in `content/glossary.ts` to appropriate new slugs (e.g., `04a-predicates` for Frege).

**Step 3: Update content tests**

Fix content test assertions for new chapter count (was 6, now 11).

**Step 4: Run full test suite and build**

Run: `pnpm vitest run`
Expected: All tests pass.

Run: `pnpm build`
Expected: Build succeeds with all routes.

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete chapter 4 restructure — 6 focused sub-chapters with registry"
```
