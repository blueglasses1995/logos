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
  LogicSandbox,
  InlineMiniQuiz,
  CurryHowardExplorer,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第28章: Curry-Howard対応</h1>

      <MotivationSection
        icon="🔗"
        realWorldExample="TypeScript の型エラーは、実は論理的な矛盾の検出。型システムと論理学は同じものの二つの顔。"
        nextChapterConnection="メタ論理学でゲーデルの不完全性定理と論理の限界を学ぶ"
      />

      <h2>命題 = 型、証明 = プログラム</h2>

      <p>
        論理学とプログラミングは、一見まったく異なる分野に見えます。
        しかし1969年、ウィリアム・アルヴィン・ハワードが発見した対応関係により、
        この二つが深いレベルで同一であることが明らかになりました。
        ハスケル・カリーの先行研究（1958年）と合わせて、
        この対応は<strong>Curry-Howard対応</strong>
        （カリー＝ハワード同型対応）と呼ばれます。
      </p>

      <Callout variant="definition" label="Curry-Howard対応の核心">
        <ul>
          <li><strong>命題</strong>は<strong>型</strong>に対応する</li>
          <li><strong>証明</strong>は<strong>プログラム（値）</strong>に対応する</li>
          <li>命題が「証明可能」であることは、対応する型に「値が存在する」ことと同じ</li>
        </ul>
      </Callout>

      <p>
        これは単なるアナロジーではなく、数学的に厳密な同型（isomorphism）です。
        論理学の全ての概念がプログラミングの概念に翻訳可能であり、
        その逆もまた成り立ちます。
      </p>

      <ComparisonTable
        headers={["論理学", "プログラミング（型理論）"]}
        rows={[
          ["命題 A", "型 A"],
          ["証明", "プログラム（値）"],
          ["A → B（含意）", "(a: A) => B（関数型）"],
          ["A ∧ B（連言）", "[A, B]（タプル / 積型）"],
          ["A ∨ B（選言）", "A | B（ユニオン / 直和型）"],
          ["⊤（真）", "unknown / unit（常に値あり）"],
          ["⊥（偽）", "never（値が存在しない型）"],
          ["∀x. P(x)（全称）", "<T>(x: T) => ...（ジェネリクス）"],
        ]}
      />

      <KeyPoint>
        Curry-Howard対応は、論理学と型理論の間の完全な翻訳辞書。
        命題が型に、証明がプログラムに対応する。
        型が付くプログラムは、対応する命題の証明を構成している。
      </KeyPoint>

      <SectionDivider />

      <h2>含意と関数: →I = 関数抽象、→E = 関数適用</h2>

      <p>
        Curry-Howard対応の最も直感的な例は、含意（→）と関数の対応です。
        「A ならば B」という命題は、「A 型の値を受け取り B 型の値を返す関数の型」に対応します。
      </p>

      <h3>→I（含意導入）= 関数抽象</h3>

      <p>
        自然演繹の含意導入規則（→I）を思い出しましょう（第7章）。
        「A を仮定して B を導けたなら、A → B が成り立つ」という規則です。
      </p>

      <FormulaBlock caption="→I（含意導入）">
        [A を仮定]{"\n"}
        ⋮{"\n"}
        B を導く{"\n"}
        ────{"\n"}
        A → B
      </FormulaBlock>

      <p>
        これはプログラミングでは、まさに関数の定義に対応します。
      </p>

      <FormulaBlock caption="TypeScript での関数抽象">
        {"// A を仮定 → A 型の引数を受け取る"}{"\n"}
        {"// B を導く → B 型の値を返す"}{"\n"}
        {"const proof: (a: A) => B = (a) => { ... return b }"}
      </FormulaBlock>

      <ExampleMapping
        formula="→I: [A] ... B ⊢ A → B"
        example="(a: string) => a.length"
        variables={{
          "A": "string（仮定 = 引数の型）",
          "B": "number（結論 = 戻り値の型）",
          "→I": "関数定義 (a) => { ... }",
        }}
        caption="含意導入は関数の定義に対応する"
      />

      <h3>→E（含意除去 / モーダスポネンス）= 関数適用</h3>

      <p>
        →E は「A → B と A があれば B が得られる」という規則です。
        これは関数適用そのものです。
      </p>

      <FormulaBlock caption="→E（モーダスポネンス）と関数適用">
        {"論理: A → B, A ⊢ B"}{"\n"}
        {"TS:   f(a)   // f: (a: A) => B, a: A → 結果: B"}
      </FormulaBlock>

      <ExampleMapping
        formula="→E: A → B, A ⊢ B"
        example="parseInt('42') → 42"
        variables={{
          "A → B": "parseInt: (s: string) => number",
          "A": "'42': string（引数）",
          "B": "42: number（適用結果）",
        }}
        caption="モーダスポネンスは関数適用に対応する"
      />

      <Callout variant="example" label="仮言三段論法 = 関数合成">
        A → B と B → C から A → C を導く仮言三段論法は、
        関数合成 (a: A) =&gt; g(f(a)) に対応します。
        <br />
        f: (a: A) =&gt; B と g: (b: B) =&gt; C を合成すると
        (a: A) =&gt; C が得られます。
      </Callout>

      <InlineMiniQuiz
        question="自然演繹の →E（モーダスポネンス）に対応するプログラミングの操作は何ですか？"
        options={[
          "関数適用 f(x)",
          "関数定義 (x) => ...",
          "変数宣言 const x = ...",
          "型注釈 x: A"
        ]}
        correctIndex={0}
        explanation="→E は「A → B と A から B を得る」規則で、これは関数 f: A → B に引数 x: A を渡して f(x): B を得ることに対応します。"
      />

      <SectionDivider />

      <h2>連言と積型: ∧ = タプル</h2>

      <p>
        論理学の連言（A ∧ B）は、型理論の積型（タプル、レコード）に対応します。
        「A かつ B が成り立つ」ことは、「A 型の値と B 型の値を両方持っている」ことです。
      </p>

      <FormulaBlock caption="∧ と積型の対応">
        {"論理: A ∧ B（A と B が両方成り立つ）"}{"\n"}
        {"TS:   [A, B]（タプル）または { fst: A, snd: B }（レコード）"}
      </FormulaBlock>

      <ComparisonTable
        headers={["自然演繹の規則", "プログラミングの操作"]}
        rows={[
          ["∧I（連言導入）: A, B ⊢ A ∧ B", "タプル構築: [a, b]"],
          ["∧E左（連言除去）: A ∧ B ⊢ A", "タプルの第一要素取得: pair[0]"],
          ["∧E右（連言除去）: A ∧ B ⊢ B", "タプルの第二要素取得: pair[1]"],
        ]}
      />

      <ExampleMapping
        formula="∧I: A, B ⊢ A ∧ B"
        example="const pair: [string, number] = ['hello', 42]"
        variables={{
          "A": "string",
          "B": "number",
          "A ∧ B": "[string, number]（タプル型）",
        }}
        caption="連言導入はタプルの構築に対応する"
      />

      <Callout variant="example" label="連言除去 = 分割代入">
        TypeScript の分割代入は連言除去の直感的な表現です。
        <br />
        const [name, age]: [string, number] = pair;
        <br />
        pair から name: string（∧E左）と age: number（∧E右）を取り出します。
      </Callout>

      <SectionDivider />

      <h2>選言と直和型: ∨ = ユニオン</h2>

      <p>
        論理学の選言（A ∨ B）は、型理論の直和型（ユニオン型）に対応します。
        「A または B が成り立つ」ことは、「A 型の値か B 型の値のどちらかが存在する」ことです。
      </p>

      <FormulaBlock caption="∨ と直和型の対応">
        {"論理: A ∨ B（A か B の少なくとも一方が成り立つ）"}{"\n"}
        {"TS:   A | B（ユニオン型）"}
      </FormulaBlock>

      <ComparisonTable
        headers={["自然演繹の規則", "プログラミングの操作"]}
        rows={[
          ["∨I左: A ⊢ A ∨ B", "型の拡大: a as A | B"],
          ["∨I右: B ⊢ A ∨ B", "型の拡大: b as A | B"],
          ["∨E: A ∨ B, A→C, B→C ⊢ C", "パターンマッチ / 型ガード"],
        ]}
      />

      <p>
        選言除去（∨E）は最も興味深い対応です。
        「A ∨ B が成り立ち、A からも B からも C が導ける場合、C が成り立つ」
        という規則は、TypeScript ではパターンマッチや型ガードに対応します。
      </p>

      <FormulaBlock caption="選言除去 = パターンマッチ">
        {"// A ∨ B = string | number"}{"\n"}
        {"// A の場合も B の場合も C（boolean）を導ける"}{"\n"}
        {"function handle(x: string | number): boolean {"}{"\n"}
        {"  if (typeof x === 'string') return x.length > 0  // A → C"}{"\n"}
        {"  else return x > 0                               // B → C"}{"\n"}
        {"}"}
      </FormulaBlock>

      <InlineMiniQuiz
        question="TypeScript の型ガード（typeof チェック）は、自然演繹のどの規則に対応しますか？"
        options={[
          "∨E（選言除去 / 場合分け）",
          "∧I（連言導入）",
          "→I（含意導入）",
          "¬I（否定導入）"
        ]}
        correctIndex={0}
        explanation="型ガードは「この値が A 型なら ... 、B 型なら ...」という場合分けであり、∨E（選言除去）に正確に対応します。"
      />

      <SectionDivider />

      <h2>偽と never 型: ⊥ = never</h2>

      <p>
        論理学の偽（⊥、矛盾）は、TypeScript の never 型に対応します。
        never 型は「値が存在しない型」です。
        矛盾は証明できない命題であり、never 型は値を構築できない型です。
      </p>

      <Callout variant="definition" label="⊥ と never の対応">
        <ul>
          <li><strong>⊥（矛盾）</strong>: 証明が存在しない命題。偽を表す。</li>
          <li><strong>never</strong>: 値が存在しない型。到達不能なコードの型。</li>
          <li><strong>Ex Falso Quodlibet</strong>（矛盾からは何でも導ける）: never 型の値があれば任意の型の値が得られる。</li>
        </ul>
      </Callout>

      <FormulaBlock caption="Ex Falso = never からの型変換">
        {"// 矛盾（never）からは何でも導ける"}{"\n"}
        {"function absurd(x: never): string {"}{"\n"}
        {"  return x  // never は全ての型のサブタイプ"}{"\n"}
        {"}"}
      </FormulaBlock>

      <p>
        この関数は呼び出されることがありません。
        never 型の値は存在しないため、引数を渡すことができないからです。
        しかし型チェックは通ります。
        これは「矛盾から何でも導ける」（Ex Falso Quodlibet）という
        論理学の原理と完全に対応します。
      </p>

      <ExampleMapping
        formula="⊥ → A（矛盾から何でも導ける）"
        example="function absurd(x: never): A { return x }"
        variables={{
          "⊥": "never（値が存在しない）",
          "A": "任意の型",
          "⊥ → A": "(x: never) => A（定義可能だが呼べない）",
        }}
        caption="Ex Falso Quodlibet: 矛盾が前提なら結論は何でもよい"
      />

      <SectionDivider />

      <h2>TypeScriptの型システムを通じた直感的理解</h2>

      <p>
        Curry-Howard対応の理解を深めるために、
        TypeScript の日常的なコードを論理学の視点から読み直してみましょう。
      </p>

      <FormulaBlock caption="日常のコードに潜む論理">
        {"// 恒等関数 = P → P の証明（同一律）"}{"\n"}
        {"const id = <T>(x: T): T => x"}{"\n"}
        {"\n"}
        {"// 関数合成 = 仮言三段論法の証明"}{"\n"}
        {"const compose = <A, B, C>("}{"\n"}
        {"  f: (a: A) => B,"}{"\n"}
        {"  g: (b: B) => C"}{"\n"}
        {"): (a: A) => C => (a) => g(f(a))"}{"\n"}
        {"\n"}
        {"// タプルのスワップ = P ∧ Q → Q ∧ P の証明（連言の交換律）"}{"\n"}
        {"const swap = <A, B>(pair: [A, B]): [B, A] =>"}{"\n"}
        {"  [pair[1], pair[0]]"}
      </FormulaBlock>

      <Callout variant="warning" label="型エラー = 論理的矛盾">
        TypeScript の型チェッカーが型エラーを報告するとき、
        それは「対応する命題の証明が構成できない」ことを意味します。
        型エラーは論理的な矛盾の検出です。
        <br /><br />
        例えば、(x: string) =&gt; number を要求する場所に
        (x: string) =&gt; string を渡すと型エラーになります。
        これは「string → number の証明として
        string → string の証明は使えない」ということです。
      </Callout>

      <LogicSandbox
        variables={["P", "Q"]}
        formulas={[
          { label: "P → P（恒等関数）", evaluate: (v) => !v.P || v.P },
          { label: "P ∧ Q → Q ∧ P（スワップ）", evaluate: (v) => !(v.P && v.Q) || (v.Q && v.P) },
          { label: "P → P ∨ Q（型の拡大）", evaluate: (v) => !v.P || (v.P || v.Q) },
        ]}
        caption="各命題は恒真式です。対応する関数が常に型安全であることを確認しましょう。"
      />

      <InlineMiniQuiz
        question="TypeScript で const id = <T>(x: T): T => x が常に型安全なのはなぜですか？"
        options={[
          "P → P（同一律）が恒真式であり、対応する型に常に値が存在するから",
          "ジェネリクスが任意の型を許可するから",
          "TypeScript のコンパイラが特別扱いするから",
          "恒等関数は引数を返すだけで副作用がないから"
        ]}
        correctIndex={0}
        explanation="Curry-Howard対応により、P → P は恒真式（常に証明可能）なので、対応する型 (x: T) => T には常に値（= x を返す関数）が存在します。"
      />

      <SectionDivider />

      <h2>依存型の世界: Agda と Coq</h2>

      <p>
        TypeScript の型システムは強力ですが、
        Curry-Howard対応を完全に活用するには限界があります。
        例えば、「長さ n のリスト」や「n が素数であることの証明」を
        型で表現することはできません。
      </p>

      <p>
        <strong>依存型（dependent types）</strong>を持つ言語では、
        型が値に依存できます。
        これにより、より豊かな命題を型として表現し、
        プログラムの正しさをコンパイル時に証明できます。
      </p>

      <Callout variant="definition" label="依存型">
        <strong>依存型</strong>とは、値に依存する型のことです。
        例えば Vec(n, A) は「A 型の要素を n 個持つベクトル」を表す型です。
        ここで n は自然数の値であり、型の一部として使われます。
      </Callout>

      <ComparisonTable
        headers={["TypeScript（単純型）", "Agda/Coq（依存型）", "対応する命題"]}
        rows={[
          ["number[]", "Vec n A", "「長さ n のリスト」"],
          ["表現不可", "isPrime n", "「n は素数である」"],
          ["表現不可", "a + b ≡ b + a", "「加法の交換律」"],
          ["<T>(x: T) => T", "(A : Type) → A → A", "∀A. A → A"],
        ]}
      />

      <p>
        Agda や Coq といった証明支援系では、
        プログラムを書くことが数学的な定理の証明と同義になります。
        Coq は四色定理の形式的証明に使われ、
        コンパイラの正しさの証明（CompCert プロジェクト）にも活用されています。
      </p>

      <Callout variant="example" label="Agda での証明の例">
        Agda では自然数の加法の交換律 a + b = b + a を、
        再帰関数として「証明」します。
        型チェッカーが証明の正しさを検証するため、
        証明に誤りがあればコンパイルエラーになります。
        数学の証明がプログラムのコンパイルと同じになるのです。
      </Callout>

      <KeyPoint>
        Curry-Howard対応は単なるアナロジーではなく、数学的に厳密な同型。
        TypeScript の型チェックは命題の証明検証に対応し、
        依存型を持つ言語では数学の定理をプログラムとして証明できる。
        論理とプログラミングは、根底で同一の構造を共有している。
      </KeyPoint>

      <SectionDivider />

      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: Curry-Howard エクスプローラー</h2>
        <CurryHowardExplorer />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="24-curry-howard" />
    </div>
    </>
  )
}
