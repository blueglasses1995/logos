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
  LogicSandbox,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第13章: 等号と一意性</h1>

      <MotivationSection
        icon="🎯"
        realWorldExample="「この関数の戻り値はただ一つ」「主キーは一意」— 一意性はソフトウェアの根幹。"
        nextChapterConnection="集合論で数学の基盤を構築する"
      />

      <h2>等号（=）の公理</h2>

      <p>
        述語論理に<strong>等号（identity, equality）</strong>を追加すると、
        「同じものである」ことを厳密に表現できるようになります。
        等号は特別な二項述語であり、以下の公理を満たします。
      </p>

      <Callout variant="definition" label="等号の公理">
        <ul>
          <li><strong>反射性（Reflexivity）:</strong> ∀x (x = x) — すべてのものは自分自身と等しい</li>
          <li><strong>対称性（Symmetry）:</strong> ∀x ∀y (x = y → y = x) — 等しさは対称的</li>
          <li><strong>推移性（Transitivity）:</strong> ∀x ∀y ∀z (x = y ∧ y = z → x = z) — 等しさは推移的</li>
          <li><strong>代入原理（Substitution）:</strong> ∀x ∀y (x = y → (P(x) → P(y))) — 等しいものは同じ性質を持つ</li>
        </ul>
      </Callout>

      <p>
        反射性・対称性・推移性は「同値関係」の3条件です。
        等号はこの3つに加えて、代入原理を持つ最も強い同値関係です。
      </p>

      <ComparisonTable
        headers={["公理", "意味"]}
        rows={[
          ["反射性: a = a", "自分は自分と同じ（当たり前だが重要）"],
          ["対称性: a = b → b = a", "順序を入れ替えても等しい"],
          ["推移性: a = b ∧ b = c → a = c", "間接的に等しいものも等しい"],
          ["代入原理: a = b → (P(a) ↔ P(b))", "等しいものは入れ替え可能"],
        ]}
      />

      <KeyPoint>
        等号の4つの性質 — 反射性、対称性、推移性、代入原理 — を理解すれば、
        「同じ」の意味を完全に形式化できる。
      </KeyPoint>

      <ExampleMapping
        formula="a = b → (P(a) → P(b))"
        example="太郎 = 社長 ならば、太郎が出席 → 社長が出席"
        variables={{ "a": "太郎", "b": "社長", "P(x)": "xが出席する" }}
      />

      <SectionDivider />

      <h2>等号の推論規則: =I と =E</h2>

      <Callout variant="definition" label="=I（等号導入）">
        <strong>=I（Identity Introduction）</strong>は反射性の規則です。
        何の前提もなく <code>t = t</code> を導けます。
        形式的には: <code>⊢ t = t</code>（tは任意の項）
      </Callout>

      <FormulaBlock caption="=I の形式">
        ⊢ t = t
      </FormulaBlock>

      <p>
        =I は最もシンプルな規則です。「aはaと等しい」は常に成り立ちます。
        これは些末に見えるかもしれませんが、証明の中で自己同一性を確認するときに使います。
      </p>

      <Callout variant="definition" label="=E（等号除去 / ライプニッツの法則）">
        <strong>=E（Identity Elimination）</strong>は代入原理の規則です。
        <code>a = b</code> と <code>P(a)</code> が成り立つとき、
        <code>P(b)</code> を導きます。
        これを<strong>ライプニッツの法則（Leibniz&apos;s Law）</strong>とも呼びます。
      </Callout>

      <FormulaBlock caption="=E の形式（ライプニッツの法則）">
        {"a = b,  P(a)  ⊢  P(b)"}
      </FormulaBlock>

      <p>
        ライプニッツは「区別不可能なものの同一性（Identity of Indiscernibles）」を提唱しました。
        すべての性質が一致するなら、それらは同じものである——
        =E はこの原理の一方向（同じものはすべての性質を共有する）の形式化です。
      </p>

      <Callout variant="tip" label="等号の推論の具体例">
        <p>
          前提1: morning_star = evening_star（明けの明星 = 宵の明星）
        </p>
        <p>
          前提2: Bright(morning_star)（明けの明星は明るい）
        </p>
        <p>
          結論: Bright(evening_star)（宵の明星は明るい）— =E による
        </p>
        <p>
          明けの明星と宵の明星が同じ天体（金星）であるなら、
          一方について成り立つ性質は他方についても成り立ちます。
        </p>
      </Callout>

      <InlineMiniQuiz
        question="=E（ライプニッツの法則）を正しく表しているのはどれですか？"
        options={[
          "a = b かつ P(a) ならば P(b)",
          "P(a) かつ P(b) ならば a = b",
          "a = b ならば a = a",
          "P(a) ならば ∃x (x = a)",
        ]}
        correctIndex={0}
        explanation="=E（ライプニッツの法則）は「a = b かつ P(a) ならば P(b)」です。等しいものは任意の述語Pについて入れ替え可能であることを保証します。選択肢2は逆方向で、これはライプニッツの「区別不可能なものの同一性」に対応しますが、=Eとは異なります。"
      />

      <SectionDivider />

      <h2>一意的存在（∃!x P(x)）</h2>

      <p>
        数学やプログラミングでは、「存在する」だけでなく
        「<strong>ただ一つだけ</strong>存在する」ことが重要な場面が多くあります。
      </p>

      <Callout variant="definition" label="一意的存在量化子">
        <strong>∃!x P(x)</strong>（「P(x)を満たすxがただ一つ存在する」）は、
        次のように定義されます:
        <br />
        <code>∃x (P(x) ∧ ∀y (P(y) → y = x))</code>
        <br />
        つまり、「P(x)を満たすxが存在し、かつ、P(y)を満たす任意のyはそのxと等しい」。
      </Callout>

      <FormulaBlock caption="一意的存在の定義">
        ∃!x P(x)  ≡  ∃x (P(x) ∧ ∀y (P(y) → y = x))
      </FormulaBlock>

      <p>
        この定義は2つの部分から成ります:
      </p>
      <ol>
        <li><strong>存在</strong>: P(x) を満たす x が少なくとも1つ存在する（∃x P(x)）</li>
        <li><strong>一意性</strong>: P を満たすものが2つ以上あることはない（∀y (P(y) → y = x)）</li>
      </ol>

      <p>
        「少なくとも1つ」と「多くとも1つ」を合わせて「ちょうど1つ」になります。
      </p>

      <ComparisonTable
        headers={["表現", "意味"]}
        rows={[
          ["∃x P(x)", "少なくとも1つ存在（存在のみ）"],
          ["∃!x P(x)", "ちょうど1つ存在（存在 + 一意性）"],
          ["∀y ∀z (P(y) ∧ P(z) → y = z)", "多くとも1つ（一意性のみ、存在は保証しない）"],
        ]}
      />

      <ExampleMapping
        formula="∃!x (P(x))"
        example="この方程式の解はちょうど1つ"
        variables={{ "P(x)": "xはこの方程式の解である", "∃!": "ただ一つ存在する" }}
      />

      <Callout variant="tip" label="プログラミングでの一意性">
        <ul>
          <li><strong>主キー（Primary Key）:</strong> ∃!x (id(x) = 42) — ID=42のレコードはちょうど1つ</li>
          <li><strong>関数の一価性:</strong> ∀x ∃!y (f(x) = y) — 各入力に対して出力はちょうど1つ</li>
          <li><strong>シングルトンパターン:</strong> ∃!x Instance(x) — インスタンスはちょうど1つ</li>
        </ul>
      </Callout>

      <KeyPoint>
        ∃!x P(x) = 存在 + 一意性。「少なくとも1つ」と「多くとも1つ」を組み合わせて「ちょうど1つ」を表現する。
        データベースの主キー、関数の一価性、シングルトンパターンなど、プログラミングの至る所に現れる概念。
      </KeyPoint>

      <InlineMiniQuiz
        question="∃!x P(x) の正しい展開はどれですか？"
        options={[
          "∃x (P(x) ∧ ∀y (P(y) → y = x))",
          "∀x P(x) ∧ ∃x P(x)",
          "∃x P(x) ∧ ¬∃y (P(y) ∧ y ≠ x)",
          "∃x ∀y (P(x) ∧ P(y))",
        ]}
        correctIndex={0}
        explanation="∃!x P(x) は「P(x)を満たすxが存在し（∃x P(x)）、かつそのxは唯一である（∀y (P(y) → y = x)）」と展開されます。選択肢3は直感的には近いですが、xのスコープが不正確（∃x の外で x を使っている）です。"
      />

      <SectionDivider />

      <h2>定記述（the x such that P(x)）</h2>

      <p>
        日常言語では「〜であるところのもの」という表現を頻繁に使います。
        「日本の首相」「この方程式の解」「その会議の議長」——
        これらは特定の一つのものを指し示す表現であり、
        <strong>定記述（definite description）</strong>と呼ばれます。
      </p>

      <Callout variant="definition" label="定記述">
        <strong>定記述</strong> <code>ιx P(x)</code>（「P(x)を満たすそのx」）は、
        ∃!x P(x) が成り立つとき、そのただ一つのxを指す表現です。
        「the」に相当する論理的概念です。
      </Callout>

      <FormulaBlock caption="定記述の使用条件">
        {"ιx P(x) が意味を持つ ⟺ ∃!x P(x)"}
      </FormulaBlock>

      <p>
        定記述が意味を持つためには、対象がちょうど1つ存在する必要があります。
        次の3つのケースを考えましょう:
      </p>

      <ComparisonTable
        headers={["ケース", "定記述の扱い"]}
        rows={[
          ["ちょうど1つ存在（例: 日本の首相）", "定記述は意味を持つ"],
          ["存在しない（例: フランスの現在の王）", "定記述は参照先がない"],
          ["複数存在（例: 素数）", "定記述はどれを指すか曖昧"],
        ]}
      />

      <p>
        「フランスの現在の王」は存在しないため、
        「フランスの現在の王は禿げている」が真か偽かは自明ではありません。
        この問題をラッセルは体系的に分析しました。
      </p>

      <KeyPoint>
        定記述は∃!x P(x)（一意的存在）が前提。
        対象が存在しない場合や複数存在する場合、定記述は問題を引き起こす。
      </KeyPoint>

      <SectionDivider />

      <h2>ラッセルのパラドックス入門</h2>

      <p>
        バートランド・ラッセル（1872-1970）は1901年に、
        集合論の根本に潜む矛盾を発見しました。
        これが<strong>ラッセルのパラドックス</strong>です。
      </p>

      <Callout variant="warning" label="ラッセルのパラドックス">
        <p>
          次の集合Rを考えます:
        </p>
        <p>
          <code>R = {"{ x | x ∉ x }"}</code>（自分自身を要素として含まない集合全体の集合）
        </p>
        <p>
          <strong>R ∈ R か？</strong>
        </p>
        <ul>
          <li>R ∈ R と仮定すると、Rの定義により R ∉ R（矛盾）</li>
          <li>R ∉ R と仮定すると、Rの定義により R ∈ R（矛盾）</li>
        </ul>
        <p>
          どちらに転んでも矛盾が生じます。
        </p>
      </Callout>

      <FormulaBlock caption="ラッセルのパラドックスの形式化">
        {"R ∈ R ↔ R ∉ R"}
      </FormulaBlock>

      <p>
        このパラドックスは「自分自身に言及する」構造（自己参照）から生じます。
        日常的な例で考えてみましょう。
      </p>

      <Callout variant="tip" label="日常版: 床屋のパラドックス">
        <p>
          ある村に一人の床屋がいて、「自分で髭を剃らないすべての村人の髭を剃る」と宣言した。
        </p>
        <p>
          <strong>床屋は自分の髭を剃るか？</strong>
        </p>
        <ul>
          <li>自分で剃る → 「自分で剃らない人の髭を剃る」に矛盾</li>
          <li>自分で剃らない → 「自分で剃らない人の髭を剃る」に該当し、自分で剃るはず → 矛盾</li>
        </ul>
        <p>
          実際の答えは「そのような床屋は存在しえない」です。
          同様に、集合Rは存在しえません。
        </p>
      </Callout>

      <p>
        ラッセルのパラドックスは、「任意の性質Pに対して {"{ x | P(x) }"} が集合である」
        という素朴な仮定（無制限の内包公理）が矛盾を導くことを示しました。
        この発見は数学の基礎を揺るがし、
        公理的集合論（ZFC集合論）や型理論の発展を促しました。
      </p>

      <KeyPoint>
        ラッセルのパラドックスは自己参照と無制限の集合構成から生じる。
        解決策として型理論（ラッセル）や公理的集合論（ツェルメロ）が提案された。
        これらの理論はプログラミング言語の型システムの源流でもある。
      </KeyPoint>

      <InlineMiniQuiz
        question="ラッセルのパラドックスが示したことは何ですか？"
        options={[
          "「任意の性質Pについて {x | P(x)} は集合である」という仮定は矛盾を導く",
          "すべての集合は自分自身を要素として含む",
          "空集合は存在しない",
          "等号の代入原理は成り立たない",
        ]}
        correctIndex={0}
        explanation="ラッセルのパラドックスは、無制限の内包公理（任意の性質で集合を作れる）が矛盾を引き起こすことを示しました。R = {x | x ∉ x} という集合を考えると R ∈ R ↔ R ∉ R という矛盾が生じます。これにより、集合を作る規則に制約が必要であることが分かりました。"
      />

      <SectionDivider />

      <h2>等号の実用例</h2>

      <h3>関数の一価性</h3>
      <p>
        関数 f の定義の核心は「各入力に対して出力がちょうど一つ」であることです。
        これは一意的存在を使って次のように書けます:
      </p>

      <FormulaBlock caption="関数の一価性">
        ∀x ∃!y (f(x) = y)
      </FormulaBlock>

      <p>
        「同じ入力には同じ出力」を等号で表現すると:
      </p>

      <FormulaBlock caption="関数の一価性（等号版）">
        ∀x ∀y₁ ∀y₂ (f(x) = y₁ ∧ f(x) = y₂ → y₁ = y₂)
      </FormulaBlock>

      <p>
        プログラミングでは、純粋関数（pure function）がこの性質を持ちます。
        同じ引数で同じ関数を呼び出せば、常に同じ結果を返します。
        副作用のある関数（乱数生成、現在時刻取得など）はこの性質を持ちません。
      </p>

      <h3>最大値の存在と一意性</h3>

      <p>
        「集合Sの最大値」は定記述の典型例です。
        最大値が存在し、かつ一意であることを証明するには:
      </p>

      <FormulaBlock caption="最大値の一意的存在">
        {"∃!m (m ∈ S ∧ ∀x (x ∈ S → x ≤ m))"}
      </FormulaBlock>

      <p>
        存在: S に上界があり S が有限（または適切な完備性条件を満たす）なら最大値は存在する。
        一意性: m₁ と m₂ がどちらも最大値なら、m₁ ≤ m₂ かつ m₂ ≤ m₁ なので m₁ = m₂。
      </p>

      <Callout variant="tip" label="一意性の証明パターン">
        <p>
          一意性を証明する典型的なテクニックは次の通りです:
        </p>
        <ol>
          <li>条件を満たすもの a と b が2つ存在すると仮定する</li>
          <li>両方が条件を満たすことから a = b を導く</li>
          <li>よって条件を満たすものは多くとも1つ</li>
        </ol>
        <p>
          これに「少なくとも1つ存在する」を加えれば、∃!の証明が完了します。
        </p>
      </Callout>

      <LogicSandbox
        variables={["P_a", "P_b", "a_eq_b"]}
        formulas={[
          { label: "∃!条件: P(a) ∧ (P(b) → b=a)", evaluate: (v) => v.P_a && (!v.P_b || v.a_eq_b) },
          { label: "存在: P(a)", evaluate: (v) => v.P_a },
          { label: "一意性: P(b) → b=a", evaluate: (v) => !v.P_b || v.a_eq_b },
        ]}
        caption="一意的存在の構造を確認。P(a)が真で、P(b)が真ならb=aが必要"
      />

      <SectionDivider />

      <h2>等号と不等号の使い分け</h2>

      <p>
        「等しくない」は <code>a ≠ b</code> と書き、これは <code>¬(a = b)</code> の略記です。
        日常的には当たり前ですが、述語論理で正確に扱うには注意が必要です。
      </p>

      <ComparisonTable
        headers={["表現", "意味"]}
        rows={[
          ["a = b", "aとbは同一の対象（代入原理により完全に交換可能）"],
          ["a ≠ b（= ¬(a = b)）", "aとbは異なる対象"],
          ["∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))", "Pを満たすものが少なくとも2つ存在"],
        ]}
      />

      <FormulaBlock caption="「少なくとも2つ」の表現">
        ∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))
      </FormulaBlock>

      <p>
        「少なくともn個存在する」を等号と不等号で表現できます。
        n=3 なら ∃x ∃y ∃z (x ≠ y ∧ y ≠ z ∧ x ≠ z ∧ P(x) ∧ P(y) ∧ P(z)) です。
        nが大きくなると式は爆発的に複雑になりますが、原理的にはすべて表現可能です。
      </p>

      <KeyPoint>
        等号は「同一性」を、≠ は「区別」を表す。
        ∃!（ちょうど1つ）、「少なくとも2つ」、「ちょうどn個」など、
        個数に関する精密な主張は等号を使って初めて表現できる。
      </KeyPoint>

      <InlineMiniQuiz
        question="「P(x)を満たすxがちょうど2つ存在する」を正しく表現しているのはどれですか？"
        options={[
          "∃x ∃y (x ≠ y ∧ P(x) ∧ P(y) ∧ ∀z (P(z) → z = x ∨ z = y))",
          "∃x ∃y (P(x) ∧ P(y))",
          "∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))",
          "∀x ∀y (P(x) ∧ P(y) → x = y)",
        ]}
        correctIndex={0}
        explanation="「ちょうど2つ」は「少なくとも2つ（x ≠ y ∧ P(x) ∧ P(y)）」かつ「多くとも2つ（∀z (P(z) → z = x ∨ z = y)）」です。選択肢2はx = yの可能性があり「少なくとも1つ」になりえます。選択肢3は「少なくとも2つ」で、3つ以上の可能性を排除しません。選択肢4は「多くとも1つ」（一意性条件）です。"
      />

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="10-identity-uniqueness" />
    </div>
    </>
  )
}
