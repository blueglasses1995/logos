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
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第20章: 再帰と帰納</h1>

      <MotivationSection
        icon="🔄"
        realWorldExample="再帰関数が正しく停止するか、ループ不変条件が常に成り立つか — プログラムの正しさを数学的に証明する手法を学ぶ。"
        nextChapterConnection="様相論理で「可能性」と「必然性」を形式化する"
      />

      <h2>再帰的定義: 基底ケース + 帰納ステップ</h2>

      <p>
        再帰的定義とは、定義しようとする対象を、より小さな同種の対象を使って定義する方法です。
        帰納法と同じく、基底ケースと帰納ステップの2つから構成されます。
      </p>

      <Callout variant="definition" label="再帰的定義の構造">
        <strong>基底ケース:</strong> 最小の入力に対する値を直接定義する。<br />
        <strong>帰納ステップ:</strong> より小さい入力に対する値を用いて、現在の入力に対する値を定義する。
      </Callout>

      <Callout variant="tip" label="階乗の再帰的定義">
        <code>0! = 1</code>（基底ケース）<br />
        <code>n! = n &times; (n-1)!</code>（帰納ステップ、n ≧ 1）
      </Callout>

      <p>
        この定義は、計算可能な手続きとしても読めます。
        5! を求めるには 4! が必要で、4! を求めるには 3! が必要で...
        と基底ケースの 0! = 1 まで辿り着いたら、巻き戻しながら計算します。
      </p>

      <FormulaBlock caption="階乗の展開">
        5! = 5 &times; 4! = 5 &times; 4 &times; 3! = ... = 5 &times; 4 &times; 3 &times; 2 &times; 1 &times; 1 = 120
      </FormulaBlock>

      <KeyPoint>
        再帰的定義は「基底ケース + 自分自身を使った定義」で構成される。
        帰納法と表裏一体の関係にある。
      </KeyPoint>

      <SectionDivider />

      <h2>再帰的定義と帰納的証明の対応</h2>

      <p>
        再帰的定義と帰納法による証明は、驚くほど対称的な構造を持っています。
        関数を再帰的に<strong>定義</strong>し、その性質を帰納法で<strong>証明</strong>するのです。
      </p>

      <ComparisonTable
        headers={["再帰的定義", "帰納的証明"]}
        rows={[
          ["基底ケース: f(0) の値を直接定義", "基底ケース: P(0) を直接証明"],
          ["帰納ステップ: f(n) を f(n-1) 等で定義", "帰納ステップ: P(n) を P(n-1) 等から証明"],
          ["定義が正しく値を決定する", "命題がすべての n で成り立つ"],
          ["再帰の停止を保証する必要がある", "帰納ステップの正当性を保証する必要がある"],
        ]}
      />

      <Callout variant="tip" label="対応の実例: 階乗">
        <strong>再帰的定義:</strong> 0! = 1, n! = n &times; (n-1)!<br />
        <strong>帰納法で示す性質:</strong> n! ≧ 2^(n-1)（n ≧ 1）<br /><br />
        基底ケース (n=1): 1! = 1 ≧ 2^0 = 1 ✓<br />
        帰納ステップ: n! ≧ 2^(n-1) と仮定。(n+1)! = (n+1) &times; n! ≧ (n+1) &times; 2^(n-1) ≧ 2 &times; 2^(n-1) = 2^n ✓
      </Callout>

      <InlineMiniQuiz
        question="再帰的定義と帰納法の関係について正しいのはどれですか？"
        options={[
          "再帰的定義の構造に沿って帰納法で性質を証明できる",
          "再帰的定義には帰納法は使えない",
          "帰納法は再帰的定義の特殊な場合である",
          "再帰的定義は帰納法より弱い"
        ]}
        correctIndex={0}
        explanation="再帰的に定義された関数の性質は、定義と同じ構造の帰納法で証明できます。基底ケースの定義に対して基底ケースの証明、帰納ステップの定義に対して帰納ステップの証明が対応します。"
      />

      <SectionDivider />

      <h2>整礎関係と停止性</h2>

      <p>
        再帰関数が正しく定義されるためには、再帰が<strong>必ず停止する</strong>ことが保証されなければなりません。
        無限に再帰が続く関数は、値を定義しません。
      </p>

      <Callout variant="definition" label="整礎関係（Well-founded Relation）">
        集合 A 上の関係 ≺ が<strong>整礎（well-founded）</strong>であるとは、
        A の空でない任意の部分集合が ≺ に関する最小元を持つことです。
        同値な条件として、≺ に関する無限降下列が存在しないことがあります。
      </Callout>

      <p>
        自然数上の通常の大小関係 &lt; は整礎関係です。
        任意の空でない自然数の部分集合には最小元が存在し、
        0 &gt; -1 &gt; -2 &gt; ... のような無限降下列は自然数では起こりません。
      </p>

      <ComparisonTable
        headers={["整礎関係の例", "整礎でない関係の例"]}
        rows={[
          ["自然数上の <", "整数上の < (... < -2 < -1 < 0)"],
          ["リストの「真の部分リスト」関係", "循環参照のあるデータ構造"],
          ["木の「部分木」関係", "無限に深い木"],
        ]}
      />

      <FormulaBlock caption="整礎帰納法の原理">
        ∀x(∀y(y ≺ x → P(y)) → P(x)) → ∀x P(x)
      </FormulaBlock>

      <p>
        整礎関係を持つ集合では、帰納法が使えます。
        これが自然数の帰納法（数学的帰納法）、リストや木の帰納法（構造帰納法）の
        すべてを統一する一般原理です。
      </p>

      <KeyPoint>
        再帰関数が停止するには、各再帰呼び出しで引数が整礎関係に沿って「小さく」なる必要がある。
        整礎帰納法は、数学的帰納法と構造帰納法を統一する一般原理である。
      </KeyPoint>

      <SectionDivider />

      <h2>プログラムの部分正当性と全正当性</h2>

      <p>
        プログラムの正しさには2つのレベルがあります。
      </p>

      <Callout variant="definition" label="部分正当性と全正当性">
        <strong>部分正当性（partial correctness）:</strong>
        プログラムが停止<strong>したならば</strong>、正しい結果を返す。<br />
        <strong>全正当性（total correctness）:</strong>
        プログラムが必ず停止<strong>し</strong>、正しい結果を返す。
      </Callout>

      <ComparisonTable
        headers={["部分正当性", "全正当性"]}
        rows={[
          ["停止を仮定する", "停止を証明する"],
          ["結果が正しいことを証明", "停止 + 結果が正しいことを証明"],
          ["無限ループのプログラムでも部分正当は成立しうる", "無限ループのプログラムは全正当でない"],
          ["証明が比較的容易", "停止性の証明も必要"],
        ]}
      />

      <FormulaBlock caption="ホーア論理の記法">
        {"{"}P{"}"} S {"{"}Q{"}"}
      </FormulaBlock>

      <p>
        ホーア論理では、前条件 P のもとでプログラム S を実行すると後条件 Q が成り立つことを
        上のように表記します。
        これは部分正当性の主張です。
        全正当性を表す場合は [P] S [Q] と角括弧を使います。
      </p>

      <InlineMiniQuiz
        question="プログラムが無限ループする場合でも成り立ちうるのはどちらですか？"
        options={[
          "部分正当性",
          "全正当性",
          "どちらも成り立たない",
          "どちらも成り立つ"
        ]}
        correctIndex={0}
        explanation="部分正当性は「停止したならば結果が正しい」という条件付きの主張なので、プログラムが停止しない場合でも空真として成立します。全正当性は停止を要求するため、無限ループするプログラムは全正当ではありません。"
      />

      <SectionDivider />

      <h2>ループ不変条件</h2>

      <p>
        ループの正しさを証明する鍵となるのが<strong>ループ不変条件（loop invariant）</strong>です。
        ループの各反復の前後で常に成り立つ性質のことです。
      </p>

      <Callout variant="definition" label="ループ不変条件">
        <strong>ループ不変条件 I</strong> とは、以下を満たす命題のことです。<br />
        (1) <strong>初期化:</strong> ループ開始前に I が成り立つ。<br />
        (2) <strong>保存:</strong> ループ本体を実行する前に I が成り立てば、実行後も I が成り立つ。<br />
        (3) <strong>終了:</strong> ループ終了時に I とループ条件の否定から、目的の性質が導ける。
      </Callout>

      <p>
        ループ不変条件の3つの性質は、帰納法とまったく同じ構造です。
      </p>

      <ComparisonTable
        headers={["ループ不変条件", "帰納法"]}
        rows={[
          ["初期化: ループ前に I が成立", "基底ケース: P(0) の証明"],
          ["保存: I が保たれる", "帰納ステップ: P(n) → P(n+1)"],
          ["終了: I + ¬条件 → 目的の性質", "結論: ∀n P(n)"],
        ]}
      />

      <h3>実例: 線形探索</h3>

      <Callout variant="tip" label="線形探索のループ不変条件">
        配列 A[0..n-1] で値 target を探索するプログラム:<br /><br />
        <code>i = 0</code><br />
        <code>while i &lt; n and A[i] != target:</code><br />
        <code>&nbsp;&nbsp;i = i + 1</code><br /><br />
        <strong>ループ不変条件 I:</strong> 「A[0], A[1], ..., A[i-1] のいずれも target ではない」<br /><br />
        <strong>初期化:</strong> i=0 のとき、チェック済みの要素は0個なので I は空真として成立。<br />
        <strong>保存:</strong> A[i] != target かつ I が成り立てば、i を i+1 に更新後も I が成立。<br />
        <strong>終了:</strong> ループ終了時、i = n なら target は配列に存在しない。
        A[i] = target なら i が target の位置。
      </Callout>

      <SectionDivider />

      <h2>実例: フィボナッチ数列</h2>

      <Callout variant="definition" label="フィボナッチ数列の再帰的定義">
        F(0) = 0, F(1) = 1<br />
        F(n) = F(n-1) + F(n-2)（n ≧ 2）
      </Callout>

      <p>
        フィボナッチ数列は2つの基底ケースと、
        直前の<strong>2つの</strong>値を参照する帰納ステップを持ちます。
        このため、性質の証明には<strong>強帰納法</strong>が自然です。
      </p>

      <h3>性質の証明例: F(n) &lt; 2^n</h3>

      <p>
        <strong>基底ケース:</strong> F(0) = 0 &lt; 1 = 2^0 ✓, F(1) = 1 &lt; 2 = 2^1 ✓
      </p>
      <p>
        <strong>帰納ステップ（強帰納法）:</strong>
        k &lt; n なるすべての k で F(k) &lt; 2^k と仮定する。
      </p>

      <FormulaBlock caption="フィボナッチの不等式の証明">
        F(n) = F(n-1) + F(n-2) &lt; 2^(n-1) + 2^(n-2) &lt; 2^(n-1) + 2^(n-1) = 2^n
      </FormulaBlock>

      <Callout variant="warning" label="計算量に注意">
        フィボナッチ数列の素朴な再帰実装は指数時間がかかります。
        F(n) を求めるのに F(n-1) と F(n-2) を再帰呼び出しするため、
        同じ値を何度も計算してしまいます。
        動的計画法やメモ化で O(n) に改善できます。
      </Callout>

      <SectionDivider />

      <h2>実例: ユークリッドの互除法</h2>

      <Callout variant="definition" label="ユークリッドの互除法">
        gcd(a, 0) = a<br />
        gcd(a, b) = gcd(b, a mod b)（b &gt; 0）
      </Callout>

      <p>
        ユークリッドの互除法は、2つの自然数の最大公約数を求める最古のアルゴリズムの一つです。
        この関数が正しく停止し、正しい結果を返すことを証明しましょう。
      </p>

      <h3>停止性の証明</h3>
      <p>
        再帰呼び出しの第2引数に注目します。
        b &gt; 0 のとき a mod b &lt; b なので、
        第2引数は各ステップで厳密に減少します。
        自然数上の &lt; は整礎関係なので、再帰は必ず停止します。
      </p>

      <h3>正当性の証明（強帰納法）</h3>
      <p>
        <strong>帰納仮定:</strong> b より小さい第2引数に対して gcd が正しい結果を返すと仮定。<br />
        <strong>キーとなる性質:</strong> gcd(a, b) = gcd(b, a mod b)。
        なぜなら、a と b の共通の約数は b と a mod b の共通の約数でもあるからです。<br />
        帰納仮定より gcd(b, a mod b) は正しいので、gcd(a, b) も正しい。
      </p>

      <InlineMiniQuiz
        question="ユークリッドの互除法の停止性は何によって保証されますか？"
        options={[
          "第2引数が各ステップで厳密に減少し、自然数の < が整礎関係であること",
          "第1引数が各ステップで減少すること",
          "再帰の深さに上限があること",
          "引数の積が減少すること"
        ]}
        correctIndex={0}
        explanation="gcd(a, b) → gcd(b, a mod b) の再帰呼び出しで、第2引数は b から a mod b に変わります。a mod b < b なので第2引数は厳密に減少し、自然数上の < は整礎関係なので有限回で 0 に達して停止します。"
      />

      <KeyPoint>
        再帰的定義と帰納的証明は表裏一体の関係にある。
        再帰の停止性は整礎関係で保証され、
        正当性は帰納法で証明される。
        ループ不変条件もまた帰納法の一形態である。
      </KeyPoint>

      <SectionDivider />

      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: ロジックサンドボックス</h2>
        <LogicSandbox
          variables={["P", "Q"]}
          formulas={[
            { label: "P → Q (条件文)", evaluate: (v) => !v.P || v.Q },
            { label: "P ∧ Q (論理積)", evaluate: (v) => v.P && v.Q },
            { label: "P ↔ Q (双条件文)", evaluate: (v) => v.P === v.Q },
          ]}
          caption="再帰と帰納の基礎となる論理式を確認しましょう"
        />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="17-recursion-induction" />
    </div>
    </>
  )
}
