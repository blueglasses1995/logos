import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
  MotivationSection,
} from "@/components/content"
import {
  LogicSandbox,
  InlineMiniQuiz,
  ExampleMapping,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第26章: 直観主義論理</h1>

      <MotivationSection
        icon="🔨"
        realWorldExample="「存在を示すには構成せよ」——プログラマが関数を書いて型を満たすのと同じ発想。構成的証明の世界へ。"
        nextChapterConnection="ブール回路で論理とハードウェアの接点へ"
      />

      <h2>1. 排中律の否定: 哲学的動機</h2>

      <p>
        これまで学んできた古典論理では、<strong>排中律（Law of Excluded Middle）</strong>が無条件に成立しました。
        任意の命題 P について「P ∨ ¬P」は常に真です。
        つまり、すべての命題は真か偽のどちらかであり、第三の可能性はない——
        これが古典論理の大前提でした。
      </p>

      <FormulaBlock caption="排中律（古典論理）">
        P ∨ ¬P　（常に真——トートロジー）
      </FormulaBlock>

      <p>
        しかし、20世紀初頭にオランダの数学者L.E.J.ブラウワーは、
        この原則に根本的な疑問を投げかけました。
      </p>

      <Callout variant="tip" label="ブラウワーの問題提起">
        「リーマン予想は真であるか偽である」と主張することは正しいか？
        リーマン予想はまだ証明も反証もされていない。
        「真か偽のどちらかだ」と言うだけでは、どちらであるか分からない。
        では、この「主張」に意味はあるのか？
      </Callout>

      <p>
        ブラウワーの答えは明確でした。
        <strong>P ∨ ¬P を主張するには、P の証明か ¬P の証明のどちらかを実際に持っていなければならない</strong>。
        どちらも持っていないのに「どちらかだ」と言うのは、空虚な主張だ——と。
      </p>

      <KeyPoint>
        直観主義論理では、排中律 P ∨ ¬P は公理ではない。
        「P または ¬P」を主張するには、P の証明か ¬P の証明を構成的に提示する必要がある。
      </KeyPoint>

      <InlineMiniQuiz
        question="直観主義論理において「P ∨ ¬P」はどのような扱いですか？"
        options={[
          "公理ではなく、P か ¬P の具体的な証明が必要",
          "常に偽とされる",
          "古典論理と同様に公理として認められる",
          "矛盾とみなされる",
        ]}
        correctIndex={0}
        explanation="直観主義論理では排中律は否定されるのではなく、無条件には認められません。具体的な証明なしに「P か ¬P のどちらか」と主張することはできません。ただし、特定の P について P か ¬P を証明できれば、その場合は成立します。"
      />

      <SectionDivider />

      <h2>2. 構成的証明: 存在を示すには具体例を構成する</h2>

      <Callout variant="definition" label="定義">
        <strong>構成的証明（constructive proof）</strong>とは、
        存在を主張するときに具体的な対象を構成し、
        選言を主張するときにどちらの選言肢が成り立つかを明示する証明方法です。
      </Callout>

      <p>
        古典論理では以下のような「非構成的証明」が許されます:
      </p>

      <Callout variant="tip" label="非構成的存在証明の例">
        <strong>定理:</strong> 無理数 a, b で a<sup>b</sup> が有理数になるものが存在する。
        <br /><br />
        <strong>古典的証明:</strong> √2<sup>√2</sup> を考える。
        これが有理数ならば a = b = √2 で証明完了。
        有理数でない（無理数である）ならば、a = √2<sup>√2</sup>, b = √2 とすると
        a<sup>b</sup> = (√2<sup>√2</sup>)<sup>√2</sup> = √2<sup>2</sup> = 2（有理数）で証明完了。
        いずれの場合も存在する。∎
      </Callout>

      <p>
        この証明は排中律（√2<sup>√2</sup> は有理数であるか、そうでないか）に依存しています。
        <strong>しかし、a と b の具体的な値を確定していません</strong>。
        直観主義者にとって、これは「存在証明」として不十分です。
      </p>

      <ComparisonTable
        headers={["構成的証明", "非構成的証明"]}
        rows={[
          ["具体的な対象を構成する", "存在しないと仮定して矛盾を導く"],
          ["「これが答えだ」と示す", "「答えがないはずがない」と示す"],
          ["直観主義で有効", "古典論理でのみ有効な場合がある"],
          ["計算可能性と直結", "必ずしもアルゴリズムに対応しない"],
        ]}
      />

      <KeyPoint>
        構成的証明は「存在するものを実際に見せる」。
        非構成的証明は「存在しないと矛盾する」ことを示す。
        直観主義論理は前者のみを正当な証明と認める。
      </KeyPoint>

      <SectionDivider />

      <h2>3. BHK解釈: 証明 ＝ 構成</h2>

      <p>
        直観主義論理の意味論を明確にしたのが、
        ブラウワー＝ハイティング＝コルモゴロフによる<strong>BHK解釈</strong>です。
        これは各論理結合子の意味を「証明をどう構成するか」によって定義します。
      </p>

      <Callout variant="definition" label="BHK解釈">
        <ul>
          <li><strong>A ∧ B の証明</strong> = A の証明と B の証明の対</li>
          <li><strong>A ∨ B の証明</strong> = A の証明、または B の証明（どちらかを明示）</li>
          <li><strong>A → B の証明</strong> = A の証明を B の証明に変換する手続き（関数）</li>
          <li><strong>¬A の証明</strong> = A の証明から矛盾（⊥）を導く手続き</li>
          <li><strong>∃x.P(x) の証明</strong> = 具体的な t と P(t) の証明の対</li>
          <li><strong>∀x.P(x) の証明</strong> = 任意の t に対して P(t) の証明を返す手続き</li>
        </ul>
      </Callout>

      <p>
        注目すべきは「A → B の証明」が<strong>関数</strong>として定義されていることです。
        「A が証明されたら B を証明できる方法」——
        これはプログラムの関数と同じ構造です。
      </p>

      <ExampleMapping
        formula="A → B ≅ (A の証明) → (B の証明)"
        example="型 A を受け取り型 B を返す関数 f: A → B"
        variables={{
          "A → B": "含意の証明",
          "関数 f": "A型の値からB型の値への変換",
        }}
        caption="BHK解釈と関数の対応"
      />

      <FormulaBlock caption="BHK解釈での A ∨ B">
        A ∨ B の証明 = inl(a) （a は A の証明）または inr(b) （b は B の証明）
      </FormulaBlock>

      <p>
        A ∨ B を証明するには、A の証明を持っているか B の証明を持っているかを
        <strong>明示的に示す</strong>必要があります。
        これが排中律が自明でない理由です。
        P ∨ ¬P を証明するには、P の証明か ¬P の証明を実際に構成しなければなりません。
      </p>

      <KeyPoint>
        BHK解釈は論理の意味を「証明の構成方法」で定義する。
        含意は関数、選言はタグ付き和、連言は対。
        証明 ＝ プログラム という対応（Curry-Howard対応）の土台がここにある。
      </KeyPoint>

      <SectionDivider />

      <h2>4. 二重否定除去の不採用</h2>

      <Callout variant="definition" label="定義">
        <strong>二重否定除去（Double Negation Elimination, DNE）</strong>とは、
        ¬¬P から P を導く推論規則です。古典論理では有効ですが、直観主義論理では採用されません。
      </Callout>

      <FormulaBlock caption="二重否定除去（古典論理では有効、直観主義では不採用）">
        ¬¬P ⊬ P　（直観主義論理）
      </FormulaBlock>

      <p>
        なぜ ¬¬P から P を導けないのでしょうか？ BHK解釈で考えてみましょう。
      </p>

      <ul>
        <li>¬P = P → ⊥（P の証明から矛盾を導く手続き）</li>
        <li>¬¬P = (P → ⊥) → ⊥（「P の証明から矛盾を導く手続き」から矛盾を導く手続き）</li>
      </ul>

      <p>
        ¬¬P は「P を否定すると矛盾する」ことを意味します。
        しかし、これだけでは<strong>P の具体的な証明を構成できません</strong>。
        「否定できない」ことと「証明できる」ことは、直観主義では異なるのです。
      </p>

      <Callout variant="warning" label="注意">
        逆方向の<strong>二重否定導入</strong>（P → ¬¬P）は直観主義論理でも成立します。
        P の証明 p があれば、(P → ⊥) の証明 f に p を適用して f(p): ⊥ を得られます。
        つまり、P → ¬¬P は構成的に証明可能です。
      </Callout>

      <FormulaBlock caption="二重否定導入（直観主義でも有効）">
        P ⊢ ¬¬P　（直観主義論理でも成立）
      </FormulaBlock>

      <InlineMiniQuiz
        question="直観主義論理で ¬¬P → P が成り立たない理由は？"
        options={[
          "「P を否定すると矛盾する」ことから P の具体的な証明を構成できないため",
          "二重否定は常に矛盾を生むため",
          "¬P と P が同値だと見なされるため",
          "否定の定義が古典論理と異なるため",
        ]}
        correctIndex={0}
        explanation="BHK解釈では、¬¬P は「P の否定から矛盾を導ける」ことを意味しますが、それだけでは P そのものの証明（構成）を与えることはできません。証明 ＝ 構成 という原則から、¬¬P → P は一般には成り立ちません。"
      />

      <SectionDivider />

      <h2>5. 直観主義と古典論理の比較</h2>

      <p>
        直観主義論理は古典論理の<strong>部分体系</strong>です。
        古典論理で証明できることのうち、一部は直観主義論理でも証明できますが、
        排中律や二重否定除去に依存する定理は直観主義では証明できません。
      </p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">原理</th>
              <th className="text-left px-4 py-2 bg-truth/10 text-truth font-medium border border-border">古典論理</th>
              <th className="text-left px-4 py-2 bg-falsehood/10 text-falsehood font-medium border border-border">直観主義論理</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">P ∨ ¬P（排中律）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立（公理）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">一般には不成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">¬¬P → P（二重否定除去）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">不成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">P → ¬¬P（二重否定導入）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">¬(P ∧ ¬P)（矛盾律）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">(P → Q) → (¬Q → ¬P)（対偶）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">(¬Q → ¬P) → (P → Q)（逆対偶）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">不成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">¬(P ∧ Q) → (¬P ∨ ¬Q)（ド・モルガン）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">不成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">(¬P ∨ ¬Q) → ¬(P ∧ Q)（ド・モルガン逆）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
              <td className="px-4 py-2 border border-border text-foreground/80">成立</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">背理法（帰謬法）</td>
              <td className="px-4 py-2 border border-border text-foreground/80">¬¬P → P で結論を導く</td>
              <td className="px-4 py-2 border border-border text-foreground/80">¬P を導くことのみ可能</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout variant="warning" label="背理法について">
        直観主義論理でも「矛盾から任意の命題を導く」（爆発原理 ⊥ → A）は成立します。
        また、P を仮定して矛盾を導くことで ¬P を証明すること（帰謬法の弱い形）も有効です。
        しかし、¬P を仮定して矛盾を導き P を結論する（帰謬法の強い形）は、
        二重否定除去に依存するため直観主義では使えません。
      </Callout>

      <LogicSandbox
        variables={["P", "Q"]}
        formulas={[
          { label: "P ∨ ¬P（排中律）", evaluate: (v: Record<string, boolean>) => v.P || !v.P },
          { label: "¬¬P → P（DNE）", evaluate: (v: Record<string, boolean>) => !(!(v.P)) ? v.P : true },
          { label: "P → ¬¬P（DNI）", evaluate: (v: Record<string, boolean>) => !v.P || !(!v.P) },
          { label: "(P → Q) → (¬Q → ¬P)", evaluate: (v: Record<string, boolean>) => !(!v.P || v.Q) || (!v.Q ? !v.P : true) },
        ]}
        caption="古典論理の真理値表ではすべてトートロジーだが、直観主義では排中律と DNE は公理として認めない"
      />

      <KeyPoint>
        直観主義論理は古典論理の部分体系。
        矛盾律、二重否定導入、対偶は成立するが、
        排中律、二重否定除去、逆対偶、一部のド・モルガン則は成立しない。
      </KeyPoint>

      <SectionDivider />

      <h2>6. プログラミングとの関連: 型理論とCurry-Howard対応への布石</h2>

      <p>
        直観主義論理は、一見すると古典論理の「弱い版」に見えるかもしれません。
        しかし、コンピュータサイエンスの観点からは、
        直観主義論理は古典論理よりも<strong>計算的に自然</strong>な体系です。
      </p>

      <Callout variant="definition" label="Curry-Howard対応（予告）">
        <strong>Curry-Howard対応（命題＝型、証明＝プログラム）</strong>は、
        直観主義論理とプログラミング言語の型システムの間の深い対応関係です。
        詳細は次章以降で学びますが、ここでは基本的な対応を紹介します。
      </Callout>

      <ComparisonTable
        headers={["直観主義論理", "プログラミング（型理論）"]}
        rows={[
          ["命題 A", "型 A"],
          ["A の証明", "型 A の値（プログラム）"],
          ["A → B", "関数型 A → B"],
          ["A ∧ B", "直積型（タプル）(A, B)"],
          ["A ∨ B", "直和型（Either A B, union型）"],
          ["⊥（矛盾）", "空型（値を持たない型）"],
          ["∀x.P(x)", "多相型（ジェネリクス）"],
          ["∃x.P(x)", "依存対型"],
        ]}
      />

      <p>
        なぜ直観主義なのでしょうか？
        古典論理を対応させようとすると、排中律に対応するプログラムが必要です。
        P ∨ ¬P に対応する値は、任意の型 P について
        「P 型の値」か「P → ⊥ 型の値」のどちらかを返す必要があります。
        しかし、そのような<strong>汎用的なプログラムは書けません</strong>。
      </p>

      <ExampleMapping
        formula="A → B ≅ fn(a: A): B"
        example="TypeScript: (a: A) => B"
        variables={{
          "A → B": "含意（命題の世界）",
          "fn(a: A): B": "関数（プログラムの世界）",
        }}
        caption="含意の証明と関数の対応"
      />

      <Callout variant="tip" label="例: 構成的存在証明 ≅ 値の構築">
        <strong>命題:</strong> 3より大きい偶数が存在する（∃n. n &gt; 3 ∧ even(n)）
        <br /><br />
        <strong>構成的証明:</strong> n = 4 とする。4 &gt; 3 かつ 4 は偶数。∎
        <br /><br />
        <strong>対応するプログラム:</strong> 具体的な値 4 を返し、条件を満たすことを確認する。
      </Callout>

      <KeyPoint>
        直観主義論理の証明はプログラムに、命題は型に対応する（Curry-Howard対応）。
        構成的証明の要求は「プログラムが実際に値を返すこと」に対応する。
        排中律が不採用なのは、任意の型に対して値を「魔法のように」生成できないのと同じ。
      </KeyPoint>

      <InlineMiniQuiz
        question="Curry-Howard対応で、A ∧ B の証明に対応するプログラミングの構造は何ですか？"
        options={[
          "タプル（直積型）: A 型の値と B 型の値の対",
          "条件分岐: if-else 文",
          "ループ: for 文",
          "例外処理: try-catch 文",
        ]}
        correctIndex={0}
        explanation="A ∧ B の証明は「A の証明と B の証明の対」（BHK解釈）です。プログラムの世界では、A 型の値と B 型の値を組にしたタプル（直積型、ペア）がこれに対応します。"
      />

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="22-intuitionistic-logic" />
    </div>
    </>
  )
}
