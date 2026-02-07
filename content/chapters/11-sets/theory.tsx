import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
  MotivationSection,
} from "@/components/content"
import {
  VennDiagram,
  ExampleMapping,
  InlineMiniQuiz,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第14章: 集合の基礎</h1>

      <MotivationSection
        icon="📦"
        realWorldExample="データベースのテーブル、プログラムの型、検索フィルタ——あらゆるものは「集合」で理解できる。"
        nextChapterConnection="関係と関数で集合間のつながりを分析"
      />

      <h2>集合の直感的定義</h2>

      <Callout variant="definition" label="定義">
        <strong>集合（set）</strong>とは、明確に定まった対象の集まりです。
        集合を構成する個々の対象を<strong>要素（element）</strong>と呼び、
        a が集合 A の要素であることを <code>a ∈ A</code> と書きます。
      </Callout>

      <p>
        集合の記法には2つの方法があります。
      </p>

      <ComparisonTable
        headers={["外延的記法（列挙）", "内包的記法（条件）"]}
        rows={[
          ["A = {1, 2, 3}", "A = {x | x は 3 以下の自然数}"],
          ["B = {赤, 青, 緑}", "B = {x | x は光の三原色}"],
          ["要素を直接列挙", "要素が満たす条件を記述"],
        ]}
      />

      <Callout variant="warning" label="注意">
        集合では<strong>順序は無関係</strong>であり、<strong>重複は無視</strong>されます。
        したがって {'{'}1, 2, 3{'}'} = {'{'}3, 1, 2{'}'} = {'{'}1, 1, 2, 3{'}'} です。
      </Callout>

      <KeyPoint>
        集合は「何が含まれるか」だけで決まる。順序や重複は意味を持たない。
      </KeyPoint>

      <SectionDivider />

      <h2>部分集合と真部分集合</h2>

      <Callout variant="definition" label="定義">
        A のすべての要素が B にも含まれるとき、A は B の<strong>部分集合（subset）</strong>であるといい、
        <code>A ⊆ B</code> と書きます。
        さらに A ⊆ B かつ A ≠ B のとき、A は B の<strong>真部分集合（proper subset）</strong>であるといい、
        <code>A ⊊ B</code> と書きます。
      </Callout>

      <FormulaBlock caption="部分集合の定義">
        A ⊆ B ⟺ ∀x(x ∈ A → x ∈ B)
      </FormulaBlock>

      <ExampleMapping
        formula="A ⊆ B"
        example="{1, 2} ⊆ {1, 2, 3}"
        variables={{ A: "{1, 2}", B: "{1, 2, 3}" }}
        caption="部分集合の具体例"
      />

      <InlineMiniQuiz
        question="{1, 2, 3} ⊆ {1, 2, 3} は正しいですか？"
        options={["正しい（部分集合は自分自身を含む）", "正しくない（真部分集合でなければならない）", "定義されていない", "集合が等しいときは ⊆ は使えない"]}
        correctIndex={0}
        explanation="部分集合の定義では A ⊆ A は常に成り立ちます。A ⊊ A が偽になるのです。"
      />

      <SectionDivider />

      <h2>べき集合と空集合</h2>

      <Callout variant="definition" label="定義">
        <strong>空集合（empty set）</strong>∅ は要素を一つも持たない集合です。
        空集合はすべての集合の部分集合です: ∀A(∅ ⊆ A)。
      </Callout>

      <Callout variant="definition" label="定義">
        集合 A の<strong>べき集合（power set）</strong>P(A) は、A のすべての部分集合を要素とする集合です。
      </Callout>

      <FormulaBlock caption="べき集合の例">
        A = {'{'}1, 2{'}'} のとき P(A) = {'{'}∅, {'{'}1{'}'}, {'{'}2{'}'}, {'{'}1, 2{'}'}{'}'} で |P(A)| = 4 = 2²
      </FormulaBlock>

      <KeyPoint>
        |A| = n のとき |P(A)| = 2ⁿ。要素が1つ増えるだけでべき集合のサイズは2倍になる。
      </KeyPoint>

      <SectionDivider />

      <h2>集合演算</h2>

      <h3>和集合（Union）</h3>

      <FormulaBlock caption="和集合の定義">
        A ∪ B = {'{'}x | x ∈ A ∨ x ∈ B{'}'}
      </FormulaBlock>

      <VennDiagram
        labelA="A"
        labelB="B"
        highlight={["a-only", "intersection", "b-only"]}
        formulaLabel="A ∪ B"
        caption="和集合: 両方の集合に属する要素すべて"
      />

      <h3>共通部分（Intersection）</h3>

      <FormulaBlock caption="共通部分の定義">
        A ∩ B = {'{'}x | x ∈ A ∧ x ∈ B{'}'}
      </FormulaBlock>

      <VennDiagram
        labelA="A"
        labelB="B"
        highlight={["intersection"]}
        formulaLabel="A ∩ B"
        caption="共通部分: 両方の集合に共通する要素"
      />

      <h3>差集合（Difference）</h3>

      <FormulaBlock caption="差集合の定義">
        A \ B = {'{'}x | x ∈ A ∧ x ∉ B{'}'}
      </FormulaBlock>

      <VennDiagram
        labelA="A"
        labelB="B"
        highlight={["a-only"]}
        formulaLabel="A \ B"
        caption="差集合: A に属し B に属さない要素"
      />

      <h3>対称差（Symmetric Difference）</h3>

      <FormulaBlock caption="対称差の定義">
        A △ B = (A \ B) ∪ (B \ A) = {'{'}x | x ∈ A ⊕ x ∈ B{'}'}
      </FormulaBlock>

      <VennDiagram
        labelA="A"
        labelB="B"
        highlight={["a-only", "b-only"]}
        formulaLabel="A △ B"
        caption="対称差: どちらか一方だけに属する要素"
      />

      <h3>補集合（Complement）</h3>

      <FormulaBlock caption="補集合の定義">
        Aᶜ = U \ A = {'{'}x ∈ U | x ∉ A{'}'}（U は全体集合）
      </FormulaBlock>

      <InlineMiniQuiz
        question="A = {1, 3, 5}, B = {2, 3, 4} のとき、A ∩ B はどれですか？"
        options={["{3}", "{1, 2, 3, 4, 5}", "{1, 5}", "{2, 4}"]}
        correctIndex={0}
        explanation="共通部分は両方の集合に含まれる要素です。3だけが A と B の両方に含まれています。"
      />

      <KeyPoint>
        集合演算は命題論理の結合子と対応する。
        ∪ は ∨（OR）、∩ は ∧（AND）、補集合は ¬（NOT）に相当する。
      </KeyPoint>

      <SectionDivider />

      <h2>ド・モルガンの法則（集合版）</h2>

      <FormulaBlock caption="ド・モルガンの法則">
        (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ　　　(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ
      </FormulaBlock>

      <ComparisonTable
        headers={["命題論理版", "集合論版"]}
        rows={[
          ["¬(P ∨ Q) ≡ ¬P ∧ ¬Q", "(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ"],
          ["¬(P ∧ Q) ≡ ¬P ∨ ¬Q", "(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ"],
          ["結合子の否定", "集合演算の補集合"],
        ]}
      />

      <ExampleMapping
        formula="(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ"
        example="「犬も猫も飼っていない」=「犬を飼っていない」かつ「猫を飼っていない」"
        variables={{ A: "犬を飼っている人", B: "猫を飼っている人" }}
        caption="ド・モルガンの法則の日常例"
      />

      <Callout variant="example" label="プログラミングとの対応">
        <code>!(a || b)</code> は <code>!a && !b</code> と等価。
        集合論のド・モルガンと命題論理のド・モルガンは同じ原理です。
      </Callout>

      <SectionDivider />

      <h2>集合の等しさの証明</h2>

      <FormulaBlock caption="集合の等しさ">
        A = B ⟺ A ⊆ B ∧ B ⊆ A
      </FormulaBlock>

      <p>
        2つの集合が等しいことを示すには、「A ⊆ B（A の任意の要素は B にも属する）」と
        「B ⊆ A（B の任意の要素は A にも属する）」の両方向を証明します。
      </p>

      <Callout variant="example" label="証明の例">
        <p><strong>主張</strong>: (Aᶜ)ᶜ = A</p>
        <p><strong>(⊆)</strong>: x ∈ (Aᶜ)ᶜ と仮定する。すると x ∉ Aᶜ、つまり ¬(x ∉ A)、よって x ∈ A。</p>
        <p><strong>(⊇)</strong>: x ∈ A と仮定する。すると x ∉ Aᶜ、よって x ∈ (Aᶜ)ᶜ。</p>
        <p>両方向が示されたので (Aᶜ)ᶜ = A が成り立つ。</p>
      </Callout>

      <KeyPoint>
        集合の等しさは「双方向の部分集合関係」で証明する。
        これは述語論理での ∀x(P(x) ↔ Q(x)) の証明と同じ構造。
      </KeyPoint>

      <SectionDivider />

      <h2>述語論理と集合の対応</h2>

      <p>
        集合は述語論理と深く結びついています。
        述語 P(x) が与えられたとき、P(x) を満たすすべての x の集まりは集合です。
      </p>

      <FormulaBlock caption="述語と集合の対応">
        {'{'}x | P(x){'}'} は「P(x) を満たす x の集合」
      </FormulaBlock>

      <ComparisonTable
        headers={["集合の記法", "述語論理の対応"]}
        rows={[
          ["x ∈ A", "P(x)"],
          ["A ⊆ B", "∀x(P(x) → Q(x))"],
          ["A ∩ B", "{x | P(x) ∧ Q(x)}"],
          ["A ∪ B", "{x | P(x) ∨ Q(x)}"],
          ["Aᶜ", "{x | ¬P(x)}"],
        ]}
      />

      <InlineMiniQuiz
        question="A = {x | x は偶数}, B = {x | x は 3 の倍数} のとき A ∩ B はどう表現できますか？"
        options={["{x | x は 6 の倍数}", "{x | x は偶数または 3 の倍数}", "{x | x は奇数}", "{x | x は素数}"]}
        correctIndex={0}
        explanation="偶数かつ3の倍数を同時に満たすのは6の倍数です。2と3の最小公倍数は6です。"
      />

      <KeyPoint>
        集合論と述語論理は表裏一体。
        集合の操作を述語論理の式に翻訳できることが、形式的な証明の基礎になる。
      </KeyPoint>

      <VennDiagram
        labelA="P(x)"
        labelB="Q(x)"
        highlight={["intersection"]}
        interactive
        formulaLabel="{x | P(x) ∧ Q(x)}"
        caption="述語論理と集合の対応を視覚的に確認しましょう"
      />

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="11-sets" />
    </div>
    </>
  )
}
