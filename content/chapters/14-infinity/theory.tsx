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
      <h1>第17章: 無限と対角線論法</h1>

      <MotivationSection
        icon="∞"
        realWorldExample="「数えられる無限」と「数えられない無限」の違いは、計算可能性の理論やデータ圧縮の限界に直結する。"
        nextChapterConnection="数学的帰納法で無限に対する証明手法を学ぶ"
      />

      <h2>有限集合と無限集合</h2>

      <Callout variant="definition" label="定義">
        集合 A が<strong>有限（finite）</strong>であるとは、
        ある自然数 n に対して |A| = n（A と {'{'}1, 2, ..., n{'}'} の間に全単射が存在する）であることです。
        有限でない集合を<strong>無限（infinite）</strong>集合と呼びます。
      </Callout>

      <p>
        無限集合には直感に反する性質があります。
        たとえば、自然数の集合 ℕ とその真部分集合である偶数の集合は「同じ大きさ」です。
        これは有限集合では絶対に起こらないことです。
      </p>

      <FormulaBlock caption="偶数と自然数の全単射">
        f: ℕ → {'{'}偶数{'}'}, f(n) = 2n　（0↦0, 1↦2, 2↦4, 3↦6, ...）
      </FormulaBlock>

      <Callout variant="warning" label="無限集合の特徴">
        デデキントは無限集合を「自身の真部分集合と同じ濃度を持つ集合」と定義しました。
        有限集合ではこれは不可能ですが、無限集合ではむしろ本質的な特徴です。
      </Callout>

      <KeyPoint>
        無限集合は「その一部」と同じ大きさになりうる。
        これが有限集合との根本的な違いであり、直感が通用しない世界の入口。
      </KeyPoint>

      <SectionDivider />

      <h2>可算無限</h2>

      <Callout variant="definition" label="定義">
        集合 A が<strong>可算無限（countably infinite）</strong>であるとは、
        A と自然数 ℕ の間に全単射が存在することです。
        可算無限集合の濃度を <code>ℵ₀</code>（アレフ・ゼロ）と書きます。
      </Callout>

      <h3>整数 ℤ の可算性</h3>

      <p>
        整数は正と負の両方向に無限に広がります。
        しかし、巧みに番号を振ることで自然数と一対一に対応させることができます。
      </p>

      <FormulaBlock caption="ℕ から ℤ への全単射">
        f(0)=0, f(1)=1, f(2)=−1, f(3)=2, f(4)=−2, f(5)=3, f(6)=−3, ...
      </FormulaBlock>

      <ExampleMapping
        formula="|ℕ| = |ℤ| = ℵ₀"
        example="0→0, 1→1, 2→−1, 3→2, 4→−2, ...（ジグザグに数える）"
        variables={{ "ℕ": "{0, 1, 2, 3, ...}", "ℤ": "{..., −2, −1, 0, 1, 2, ...}" }}
        caption="整数と自然数は同じ濃度"
      />

      <h3>有理数 ℚ の可算性</h3>

      <p>
        有理数（分数で表せる数）は、自然数や整数よりも「密に」分布しています。
        任意の2つの有理数の間にも無限に多くの有理数があります。
        しかし驚くべきことに、有理数も可算無限です。
      </p>

      <Callout variant="example" label="カントールの対角線的列挙">
        <p>正の有理数を格子状に並べ、対角線に沿って数え上げます:</p>
        <pre className="text-sm">
{`  1/1  1/2  1/3  1/4  ...
  2/1  2/2  2/3  2/4  ...
  3/1  3/2  3/3  3/4  ...
  4/1  4/2  4/3  4/4  ...
  ...`}
        </pre>
        <p>
          対角線状に 1/1, 1/2, 2/1, 1/3, 2/2, 3/1, ... と辿り、
          既出の分数（2/2 = 1/1 など）を飛ばすと、すべての正の有理数に番号がつきます。
        </p>
      </Callout>

      <InlineMiniQuiz
        question="次のうち可算無限集合はどれですか？"
        options={["すべてのコンピュータプログラムの集合", "実数の集合 ℝ", "区間 [0, 1] の実数の集合", "ℝ のべき集合 P(ℝ)"]}
        correctIndex={0}
        explanation="プログラムは有限長の文字列であり、有限のアルファベットからなる有限文字列の集合は可算です。実数やその部分集合、べき集合は非可算です。"
      />

      <KeyPoint>
        ℕ, ℤ, ℚ はすべて同じ濃度 ℵ₀ を持つ。
        「数え上げ方を工夫すれば番号を振れる」のが可算無限の特徴。
      </KeyPoint>

      <SectionDivider />

      <h2>カントールの対角線論法: ℝ の非可算性</h2>

      <p>
        すべての無限集合が可算なのでしょうか？
        カントールは1891年に、実数の集合 ℝ が可算でないことを証明しました。
        この証明に用いた手法が、数学史上最も美しい証明のひとつとされる
        <strong>対角線論法（diagonal argument）</strong>です。
      </p>

      <Callout variant="definition" label="定理">
        <strong>カントールの定理</strong>: 実数の集合 ℝ は非可算である。
        すなわち、ℕ から ℝ への全単射は存在しない。
      </Callout>

      <Callout variant="example" label="対角線論法の証明">
        <p><strong>背理法で証明</strong>: ℝ が可算だと仮定し、矛盾を導きます。</p>
        <p><strong>ステップ1</strong>: 区間 [0, 1) の実数がすべて列挙できると仮定します:</p>
        <pre className="text-sm">
{`  r₁ = 0. d₁₁ d₁₂ d₁₃ d₁₄ ...
  r₂ = 0. d₂₁ d₂₂ d₂₃ d₂₄ ...
  r₃ = 0. d₃₁ d₃₂ d₃₃ d₃₄ ...
  r₄ = 0. d₄₁ d₄₂ d₄₃ d₄₄ ...
  ...`}
        </pre>
        <p><strong>ステップ2</strong>: 対角線上の数字 d₁₁, d₂₂, d₃₃, d₄₄, ... を取り出し、
        各桁を変更した新しい実数 s を構成します。具体的に、sの第n桁を dₙₙ ≠ eₙ となるよう選びます。</p>
        <p><strong>ステップ3</strong>: この s はリストのどの rₙ とも異なります。
        なぜなら、s と rₙ は少なくとも第n桁が異なるからです。</p>
        <p><strong>結論</strong>: リストに含まれない実数が存在するため、
        「すべての実数を列挙できる」という仮定に矛盾。よって ℝ は非可算です。</p>
      </Callout>

      <ExampleMapping
        formula="|ℝ| > |ℕ| = ℵ₀"
        example="実数の「無限」は自然数の「無限」よりも真に大きい"
        variables={{ "ℝ": "実数（非可算）", "ℕ": "自然数（可算）", ">": "真に大きい濃度" }}
        caption="無限にも大小がある"
      />

      <InlineMiniQuiz
        question="対角線論法の核心的なアイデアはどれですか？"
        options={[
          "仮定されたリストに含まれない要素を構成して矛盾を導く",
          "すべての要素を1つずつ数え上げる",
          "鳩の巣原理を用いる",
          "帰納法で無限を扱う"
        ]}
        correctIndex={0}
        explanation="対角線論法は「もし完全なリストが存在するなら、そのリストに含まれない要素を具体的に構成できる」という背理法です。"
      />

      <SectionDivider />

      <h2>べき集合定理</h2>

      <Callout variant="definition" label="定理">
        <strong>カントールのべき集合定理</strong>: 任意の集合 A に対して |P(A)| &gt; |A|。
        すなわち、べき集合は元の集合よりも真に大きい濃度を持つ。
      </Callout>

      <FormulaBlock caption="べき集合定理">
        |P(A)| &gt; |A|　（A から P(A) への全単射は存在しない）
      </FormulaBlock>

      <p>
        この定理は、有限集合では明らかです（|P(A)| = 2ⁿ &gt; n）。
        しかし無限集合でも成り立つことが、対角線論法によって証明されます。
      </p>

      <Callout variant="example" label="証明の概略">
        <p>A から P(A) への全単射 f が存在すると仮定します。</p>
        <p>D = {'{'}a ∈ A | a ∉ f(a){'}'} を定義します（対角線集合）。</p>
        <p>D ∈ P(A) なので、ある d ∈ A に対して f(d) = D のはずです。</p>
        <p>d ∈ D ならば定義より d ∉ f(d) = D。矛盾。</p>
        <p>d ∉ D ならば定義より d ∈ f(d) = D。矛盾。</p>
        <p>よって全単射 f は存在しません。</p>
      </Callout>

      <KeyPoint>
        べき集合定理により、無限に「レベル」がある。
        ℵ₀ &lt; |P(ℕ)| &lt; |P(P(ℕ))| &lt; ... と、限りなく大きな無限が存在する。
      </KeyPoint>

      <SectionDivider />

      <h2>連続体仮説</h2>

      <p>
        |ℕ| = ℵ₀ と |ℝ| = |P(ℕ)| の間に、中間の大きさの無限集合は存在するでしょうか？
        カントールはこの問いに「存在しない」と予想し、
        これは<strong>連続体仮説（Continuum Hypothesis）</strong>と呼ばれます。
      </p>

      <FormulaBlock caption="連続体仮説">
        ℵ₀ と |ℝ| の間の濃度を持つ集合は存在しない（|ℝ| = ℵ₁）
      </FormulaBlock>

      <Callout variant="warning" label="未解決ではなく独立">
        ゲーデル（1940年）は連続体仮説がZFC公理系と無矛盾であることを、
        コーエン（1963年）は連続体仮説の否定もZFC公理系と無矛盾であることを証明しました。
        つまり連続体仮説はZFC公理系から<strong>独立</strong>しており、証明も反証もできません。
        これは数学の限界を示す驚くべき結果です。
      </Callout>

      <SectionDivider />

      <h2>ラッセルのパラドックスとの関連</h2>

      <p>
        カントールの対角線論法と深く関連するのが、
        バートランド・ラッセルが1901年に発見した<strong>ラッセルのパラドックス</strong>です。
      </p>

      <FormulaBlock caption="ラッセルのパラドックス">
        R = {'{'}x | x ∉ x{'}'} とすると、R ∈ R ⟺ R ∉ R（矛盾）
      </FormulaBlock>

      <p>
        「自分自身を含まない集合すべての集合」を考えると矛盾が生じます。
        これはべき集合定理の証明と同じ構造を持っています。
        対角線集合 D = {'{'}a ∈ A | a ∉ f(a){'}'} も、
        「自分自身を含まない」という自己言及的な条件を使っていました。
      </p>

      <ComparisonTable
        headers={["対角線論法", "ラッセルのパラドックス"]}
        rows={[
          ["D = {a ∈ A | a ∉ f(a)}", "R = {x | x ∉ x}"],
          ["d ∈ D ⟺ d ∉ f(d) = D", "R ∈ R ⟺ R ∉ R"],
          ["全単射の非存在を証明", "素朴集合論の矛盾を露呈"],
          ["対角線的構成法", "自己言及による矛盾"],
        ]}
      />

      <Callout variant="example" label="計算可能性への応用">
        対角線論法はチューリングの停止問題の証明でも用いられます。
        「すべてのプログラムについて停止するかを判定するプログラム」は存在しない——
        これもカントールの対角線論法と本質的に同じ構造を持つ証明です。
      </Callout>

      <InlineMiniQuiz
        question="べき集合定理 |P(A)| > |A| の証明で使われる手法はどれですか？"
        options={[
          "対角線論法（A から P(A) への全単射を仮定し、対角線集合で矛盾を導く）",
          "数学的帰納法",
          "鳩の巣原理",
          "背理法を使わない直接証明"
        ]}
        correctIndex={0}
        explanation="べき集合定理の証明では、全単射 f の存在を仮定し、D = {a ∈ A | a ∉ f(a)} という対角線集合を構成して矛盾を導きます。"
      />

      <KeyPoint>
        対角線論法は数学の最も強力な証明手法のひとつ。
        非可算性、べき集合定理、停止問題の証明に共通する本質は
        「仮定されたリスト/写像から、それに含まれない/対応しないものを構成する」こと。
      </KeyPoint>

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="14-infinity" />
    </div>
    </>
  )
}
