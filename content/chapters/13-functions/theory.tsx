import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
  MotivationSection,
} from "@/components/content"
import {
  ExampleMapping,
  InlineMiniQuiz,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第16章: 関数</h1>

      <MotivationSection
        icon="⚙️"
        realWorldExample="プログラミングの関数は数学の関数と同じ構造。入力と出力の対応関係を厳密に定義する。"
        nextChapterConnection="関数の全単射性を使って無限集合の大きさを比較する"
      />

      <h2>関数の定義</h2>

      <Callout variant="definition" label="定義">
        集合 A から集合 B への<strong>関数（function）</strong>f とは、
        A × B の部分集合で、各 a ∈ A に対して f(a) = b となる b ∈ B がちょうど一つ存在する関係です。
        <code>f: A → B</code> と書きます。
      </Callout>

      <FormulaBlock caption="関数の条件">
        f ⊆ A × B かつ ∀a ∈ A, ∃!b ∈ B: (a, b) ∈ f
      </FormulaBlock>

      <p>
        関数は「特殊な関係」です。一般の関係 R ⊆ A × B では、
        ある a に対して複数の b が対応することも、対応する b がないこともありえます。
        関数では、各 a に対する対応が一意に定まることが要求されます。
      </p>

      <ComparisonTable
        headers={["関係（一般）", "関数（特殊な関係）"]}
        rows={[
          ["1つの入力に複数の出力が可能", "1つの入力に出力は必ず1つ"],
          ["入力に対応がなくてもよい", "すべての入力に出力がある"],
          ["R ⊆ A × B", "f ⊆ A × B で一意性条件を満たす"],
        ]}
      />

      <KeyPoint>
        関数とは「すべての入力に対して出力が一意に定まる関係」。
        関係の特殊ケースとして理解できる。
      </KeyPoint>

      <SectionDivider />

      <h2>定義域・値域・全域性</h2>

      <Callout variant="definition" label="定義">
        <p><strong>定義域（domain）</strong>: 関数の入力となりうる値の集合 A。</p>
        <p><strong>終域（codomain）</strong>: 関数の出力として宣言された集合 B。</p>
        <p><strong>値域（range / image）</strong>: 実際に出力として現れる値の集合 f(A) = {'{'}f(a) | a ∈ A{'}'}。</p>
      </Callout>

      <FormulaBlock caption="値域は終域の部分集合">
        f(A) ⊆ B（値域 ⊆ 終域）
      </FormulaBlock>

      <ExampleMapping
        formula="f: ℤ → ℤ, f(x) = x²"
        example="定義域 = ℤ, 終域 = ℤ, 値域 = {0, 1, 4, 9, 16, ...}"
        variables={{ "定義域": "ℤ（すべての整数）", "終域": "ℤ", "値域": "0以上の完全平方数" }}
        caption="値域と終域は異なりうる"
      />

      <Callout variant="example" label="プログラミングの対応">
        TypeScript の <code>function square(x: number): number</code> では、
        <code>number</code> が定義域と終域に対応します。
        しかし実際に返される値（値域）は非負の数のみです。
        型システムは終域を宣言しますが、値域を完全には表現できません。
      </Callout>

      <SectionDivider />

      <h2>単射・全射・全単射</h2>

      <h3>単射（Injection）</h3>

      <Callout variant="definition" label="定義">
        関数 f: A → B が<strong>単射（injective / one-to-one）</strong>であるとは、
        異なる入力が異なる出力に対応すること、つまり f(a₁) = f(a₂) → a₁ = a₂ です。
      </Callout>

      <FormulaBlock caption="単射の定義">
        ∀a₁, a₂ ∈ A: f(a₁) = f(a₂) → a₁ = a₂
      </FormulaBlock>

      <p>
        単射は「情報を失わない写像」です。
        異なる入力は必ず異なる出力を生むため、出力から入力を一意に復元できます。
      </p>

      <h3>全射（Surjection）</h3>

      <Callout variant="definition" label="定義">
        関数 f: A → B が<strong>全射（surjective / onto）</strong>であるとは、
        B のすべての要素が f の出力として現れること、つまり ∀b ∈ B, ∃a ∈ A: f(a) = b です。
      </Callout>

      <FormulaBlock caption="全射の定義">
        ∀b ∈ B, ∃a ∈ A: f(a) = b　　（値域 = 終域）
      </FormulaBlock>

      <h3>全単射（Bijection）</h3>

      <Callout variant="definition" label="定義">
        関数 f が<strong>全単射（bijective）</strong>であるとは、
        単射かつ全射であることです。全単射は A と B の間に完全な一対一対応を与えます。
      </Callout>

      <ComparisonTable
        headers={["性質", "条件", "直感的な意味"]}
        rows={[
          ["単射", "f(a₁) = f(a₂) → a₁ = a₂", "異なる入力 → 異なる出力"],
          ["全射", "∀b ∈ B, ∃a: f(a) = b", "すべての出力が使われる"],
          ["全単射", "単射 ∧ 全射", "完全な一対一対応"],
        ]}
      />

      <InlineMiniQuiz
        question="f: ℤ → ℤ, f(x) = 2x はどの性質を持ちますか？"
        options={["単射だが全射ではない", "全射だが単射ではない", "全単射", "単射でも全射でもない"]}
        correctIndex={0}
        explanation="f(a) = f(b) → 2a = 2b → a = b なので単射です。しかし奇数（例: 3）は値域に含まれないので全射ではありません。"
      />

      <SectionDivider />

      <h2>合成関数と逆関数</h2>

      <h3>合成関数</h3>

      <Callout variant="definition" label="定義">
        f: A → B と g: B → C の<strong>合成（composition）</strong>は
        (g ∘ f): A → C で、(g ∘ f)(a) = g(f(a)) と定義されます。
      </Callout>

      <FormulaBlock caption="合成関数">
        (g ∘ f)(a) = g(f(a))　　　g ∘ f: A → C
      </FormulaBlock>

      <ExampleMapping
        formula="g ∘ f"
        example="f(x) = x + 1, g(x) = x² のとき (g ∘ f)(3) = g(f(3)) = g(4) = 16"
        variables={{ f: "1を足す", g: "二乗する", "g ∘ f": "1を足してから二乗" }}
        caption="合成関数の計算例"
      />

      <Callout variant="warning" label="注意">
        合成の順序は重要です。一般に g ∘ f ≠ f ∘ g です。
        上の例で (f ∘ g)(3) = f(g(3)) = f(9) = 10 ≠ 16 = (g ∘ f)(3) です。
      </Callout>

      <h3>逆関数</h3>

      <Callout variant="definition" label="定義">
        全単射 f: A → B の<strong>逆関数（inverse function）</strong>f⁻¹: B → A は、
        f⁻¹(b) = a ⟺ f(a) = b を満たす関数です。
      </Callout>

      <FormulaBlock caption="逆関数の性質">
        f⁻¹ ∘ f = id_A　　　f ∘ f⁻¹ = id_B
      </FormulaBlock>

      <KeyPoint>
        逆関数が存在するための必要十分条件は f が全単射であること。
        単射でなければ逆写像が一意に定まらず、全射でなければ逆写像の定義域が不足する。
      </KeyPoint>

      <InlineMiniQuiz
        question="f: ℝ → ℝ, f(x) = x³ に逆関数は存在しますか？"
        options={["存在する（f は全単射だから）", "存在しない（単射でないから）", "存在しない（全射でないから）", "定義できない"]}
        correctIndex={0}
        explanation="f(x) = x³ は単射（x₁³ = x₂³ → x₁ = x₂）かつ全射（任意の y に対して x = ∛y が存在）なので全単射です。逆関数は f⁻¹(y) = ∛y です。"
      />

      <SectionDivider />

      <h2>関数としてのプログラム</h2>

      <p>
        プログラミングにおける「純粋関数」は、数学の関数と同じ性質を持ちます。
        同じ入力に対して常に同じ出力を返し、副作用を持ちません。
      </p>

      <Callout variant="definition" label="参照透過性">
        <strong>参照透過性（referential transparency）</strong>とは、
        式をその値で置き換えてもプログラムの振る舞いが変わらない性質です。
        これは関数が「入力のみに基づいて出力を決定する」ことの表れです。
      </Callout>

      <ComparisonTable
        headers={["純粋関数（数学の関数）", "不純な関数（副作用あり）"]}
        rows={[
          ["同じ入力 → 常に同じ出力", "同じ入力でも異なる出力がありえる"],
          ["外部状態を読み書きしない", "外部状態に依存・変更する"],
          ["参照透過的", "参照透過でない"],
          ["例: Math.sqrt(x)", "例: Math.random()"],
        ]}
      />

      <ExampleMapping
        formula="f(x) = x²"
        example="const square = (x: number): number => x * x"
        variables={{ f: "square 関数", "x²": "x * x（副作用なし）" }}
        caption="数学の関数とプログラムの関数"
      />

      <Callout variant="example" label="map と関数の合成">
        <code>[1, 2, 3].map(f).map(g)</code> は <code>[1, 2, 3].map(x =&gt; g(f(x)))</code> と等価です。
        これは合成関数 g ∘ f の性質そのものです。
        関数型プログラミングでは、この数学的な性質を積極的に活用します。
      </Callout>

      <SectionDivider />

      <h2>集合の濃度と全単射</h2>

      <Callout variant="definition" label="定義">
        2つの集合 A と B が<strong>同じ濃度（cardinality）</strong>を持つとは、
        A から B への全単射が存在することです。<code>|A| = |B|</code> と書きます。
      </Callout>

      <FormulaBlock caption="濃度の定義">
        |A| = |B| ⟺ ∃f: A → B が全単射
      </FormulaBlock>

      <p>
        有限集合の場合、濃度は単に「要素の個数」です。
        しかし無限集合では「数える」ことができないため、
        全単射の存在が「同じ大きさ」の唯一の定義になります。
      </p>

      <ExampleMapping
        formula="|ℕ| = |ℤ|"
        example="f: ℕ → ℤ を f(0)=0, f(1)=1, f(2)=-1, f(3)=2, f(4)=-2, ... と定義すると全単射"
        variables={{ "ℕ": "自然数 {0,1,2,...}", "ℤ": "整数 {...,-2,-1,0,1,2,...}" }}
        caption="自然数と整数は同じ濃度"
      />

      <InlineMiniQuiz
        question="|A| ≤ |B| とはどういう意味ですか？"
        options={["A から B への単射が存在する", "A から B への全射が存在する", "A ⊆ B", "|A| の要素数が |B| の要素数以下"]}
        correctIndex={0}
        explanation="集合の濃度の大小は、単射の存在で定義されます。A から B への単射があれば、A の要素を B の中に「重複なく埋め込める」ので |A| ≤ |B| です。"
      />

      <KeyPoint>
        集合の「大きさ」を比較する道具が全単射と単射。
        この概念は次章の「無限」の議論で中心的な役割を果たす。
      </KeyPoint>

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="13-functions" />
    </div>
    </>
  )
}
