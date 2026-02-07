import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
  MotivationSection,
} from "@/components/content"
import {
  ArgumentTree,
  InlineMiniQuiz,
  SteppedProofBuilder,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第18章: 数学的帰納法</h1>

      <MotivationSection
        icon="🎯"
        realWorldExample="ループの正しさを保証するとき、「初回は正しい」「k回目が正しければk+1回目も正しい」と示すのは帰納法そのもの。"
        nextChapterConnection="強帰納法と構造帰納法でより強力な証明手法へ"
      />

      <h2>ドミノ原理としての帰納法</h2>

      <p>
        無限に並んだドミノを想像してください。
        すべてのドミノが倒れることを証明するには、次の2つを示せば十分です。
      </p>

      <ol>
        <li><strong>最初のドミノが倒れる</strong>（基底ケース）</li>
        <li><strong>あるドミノが倒れたら、次のドミノも倒れる</strong>（帰納ステップ）</li>
      </ol>

      <p>
        この直感こそが数学的帰納法の本質です。
        無限個の命題を一度に証明できる、非常に強力な手法です。
      </p>

      <Callout variant="tip" label="日常の例">
        「はしごのすべての段に登れる」ことを証明するには、
        (1) 最初の段に登れることと、
        (2) ある段に登れたら次の段にも登れることを示せばよい。
      </Callout>

      <KeyPoint>
        数学的帰納法は「基底ケース」と「帰納ステップ」の2段階で、
        無限個の命題を一挙に証明する手法である。
      </KeyPoint>

      <SectionDivider />

      <h2>形式的定義</h2>

      <Callout variant="definition" label="数学的帰納法の原理">
        自然数 n に関する命題 P(n) について、以下の2つが成り立てば、
        すべての自然数 n について P(n) が成り立つ。
      </Callout>

      <FormulaBlock caption="数学的帰納法の形式化">
        P(0) ∧ ∀n(P(n) → P(n+1)) → ∀n P(n)
      </FormulaBlock>

      <p>
        この式を分解すると、次の2つの条件で構成されています。
      </p>

      <ComparisonTable
        headers={["条件", "意味"]}
        rows={[
          ["P(0)", "基底ケース: n = 0 のとき P が成り立つ"],
          ["∀n(P(n) → P(n+1))", "帰納ステップ: P(n) が成り立てば P(n+1) も成り立つ"],
        ]}
      />

      <p>
        この2つが証明されれば、P(0), P(1), P(2), P(3), ... とドミノが倒れるように
        すべての自然数について P(n) が成り立つと結論できます。
      </p>

      <ArgumentTree
        premises={["P(0)", "∀n(P(n) → P(n+1))"]}
        conclusion="∀n P(n)"
        rule="数学的帰納法"
        caption="帰納法の推論構造"
      />

      <SectionDivider />

      <h2>基底ケースと帰納ステップ</h2>

      <h3>基底ケース（Base Case）</h3>

      <p>
        帰納法の出発点です。通常は n = 0 または n = 1 について
        命題が成り立つことを直接確認します。
        ドミノの「最初の1枚を倒す」操作に相当します。
      </p>

      <Callout variant="warning" label="注意">
        基底ケースを省略してはいけません。
        帰納ステップだけでは、最初の命題が成り立つ保証がないため、
        証明全体が成立しません。
      </Callout>

      <h3>帰納ステップ（Inductive Step）</h3>

      <p>
        「P(n) が成り立つと<strong>仮定して</strong>（帰納仮定）、P(n+1) が成り立つことを<strong>証明する</strong>」
        という手順です。ここで重要なのは、P(n) は仮定であり、
        まだ証明されていないという点です。
      </p>

      <Callout variant="definition" label="帰納仮定（Induction Hypothesis）">
        帰納ステップにおいて「P(n) が成り立つ」と仮定すること。
        この仮定を<strong>帰納仮定</strong>（IH: Induction Hypothesis）と呼ぶ。
        帰納仮定を適切に使って P(n+1) を導くことが帰納ステップの核心である。
      </Callout>

      <InlineMiniQuiz
        question="帰納法で「P(n)が成り立つ」と仮定するのは何と呼ばれますか？"
        options={["帰納仮定", "基底ケース", "帰結", "公理"]}
        correctIndex={0}
        explanation="帰納ステップで P(n) を仮定することを帰納仮定（Induction Hypothesis）と呼びます。この仮定を使って P(n+1) を導きます。"
      />

      <SectionDivider />

      <h2>弱い帰納法（通常の帰納法）</h2>

      <p>
        ここまで説明してきた帰納法は、正確には<strong>弱い帰納法（weak induction）</strong>と呼ばれます。
        「弱い」という名前がついていますが、十分に強力な証明手法です。
      </p>

      <ComparisonTable
        headers={["特徴", "弱い帰納法（通常の帰納法）"]}
        rows={[
          ["帰納仮定", "P(n) のみを仮定"],
          ["帰納ステップ", "P(n) → P(n+1) を証明"],
          ["基底ケース", "通常 P(0) または P(1)"],
          ["使用場面", "直前の値から次の値が決まる場合"],
        ]}
      />

      <p>
        次章で学ぶ<strong>強帰納法</strong>では、P(0), P(1), ..., P(n-1) の
        すべてを帰納仮定として使えるようになります。
      </p>

      <SectionDivider />

      <h2>実践例1: 和の公式</h2>

      <Callout variant="tip" label="定理">
        すべての自然数 n について、1 + 2 + ... + n = n(n+1)/2 が成り立つ。
      </Callout>

      <h3>基底ケース: n = 1</h3>
      <p>
        左辺: 1。右辺: 1(1+1)/2 = 1。
        左辺 = 右辺なので、n = 1 のとき成立。
      </p>

      <h3>帰納ステップ: P(n) → P(n+1)</h3>
      <p>
        <strong>帰納仮定（IH）:</strong> 1 + 2 + ... + n = n(n+1)/2 が成り立つと仮定する。
      </p>
      <p>
        P(n+1) を示す。すなわち、1 + 2 + ... + n + (n+1) = (n+1)(n+2)/2 を証明する。
      </p>

      <FormulaBlock caption="帰納仮定を用いた変形">
        1 + 2 + ... + n + (n+1) = n(n+1)/2 + (n+1) = (n+1)(n/2 + 1) = (n+1)(n+2)/2
      </FormulaBlock>

      <p>
        これで P(n+1) が示されました。基底ケースと帰納ステップの両方が成立したので、
        すべての自然数 n について命題が成り立ちます。
      </p>

      <ArgumentTree
        premises={["P(1): 1 = 1(1+1)/2 = 1 ✓", "IH: 1+...+n = n(n+1)/2 と仮定", "1+...+n+(n+1) = n(n+1)/2 + (n+1) = (n+1)(n+2)/2"]}
        conclusion="∀n: 1+2+...+n = n(n+1)/2"
        rule="数学的帰納法"
        caption="和の公式の帰納法による証明構造"
      />

      <SectionDivider />

      <h2>実践例2: 不等式の証明</h2>

      <Callout variant="tip" label="定理">
        n ≧ 4 のすべての自然数 n について、2^n &gt; n^2 が成り立つ。
      </Callout>

      <h3>基底ケース: n = 4</h3>
      <p>
        2^4 = 16, 4^2 = 16。16 &gt; 16 は偽なので...
        実はこれは等号付きで 2^4 = 4^2 = 16 であるため、
        n = 5 を基底ケースとするか、命題を n ≧ 5 に修正します。
      </p>
      <p>
        n = 5: 2^5 = 32 &gt; 25 = 5^2。成立します。
      </p>

      <h3>帰納ステップ</h3>
      <p>
        <strong>帰納仮定:</strong> 2^n &gt; n^2 と仮定（n ≧ 5）。
      </p>
      <p>
        2^(n+1) = 2 &middot; 2^n &gt; 2n^2（帰納仮定より）。
        n ≧ 5 のとき 2n^2 ≧ n^2 + 2n + 1 = (n+1)^2 であることを示せば完了です。
        2n^2 - (n+1)^2 = n^2 - 2n - 1 = (n-1)^2 - 2 ≧ 0（n ≧ 3 のとき）。
      </p>

      <Callout variant="warning" label="基底ケースの重要性">
        この例では n ≧ 5 という条件が重要です。
        n = 1, 2, 3, 4 では 2^n &gt; n^2 は成り立ちません。
        基底ケースを適切に設定しないと、偽の命題を「証明」してしまう危険があります。
      </Callout>

      <InlineMiniQuiz
        question="n ≧ 5 で 2^n > n^2 の帰納法による証明で、基底ケースをn = 0にしたらどうなりますか？"
        options={[
          "基底ケースで失敗する（2^0 = 1 > 0 = 0^2 は真だが、n=1,2,3,4で成り立たないため不適切）",
          "問題なく証明できる",
          "帰納ステップが成り立たなくなる",
          "証明の結論が変わる"
        ]}
        correctIndex={0}
        explanation="基底ケースが成立しても、帰納ステップが n ≧ 5 を前提としているため、n = 0 から始めると n = 1〜4 の部分をカバーできません。基底ケースは帰納ステップの前提と整合する必要があります。"
      />

      <SectionDivider />

      <h2>よくある間違い</h2>

      <h3>間違い1: 基底ケースの省略</h3>

      <Callout variant="warning" label="危険な誤り">
        基底ケースなしで帰納ステップだけを示しても、証明にはなりません。
        帰納ステップは「ドミノの並べ方」を保証するだけで、
        最初のドミノを倒す（基底ケース）がなければ何も倒れません。
      </Callout>

      <p>
        <strong>偽の「証明」の例:</strong>
        「すべての馬は同じ色である」を帰納法で「証明」しようとする有名な例があります。
        n頭の馬が同じ色だと仮定して n+1 頭も同じ色だと示す帰納ステップは、
        実は n = 1 から n = 2 への移行で失敗します。
        1頭の集合と2頭の集合では「重なる馬」が存在しないためです。
      </p>

      <h3>間違い2: 帰納仮定の誤用</h3>

      <ComparisonTable
        headers={["正しい使い方", "誤った使い方"]}
        rows={[
          ["P(n)を仮定してP(n+1)を導く", "P(n+1)を仮定してP(n+1)を示す（循環論法）"],
          ["帰納仮定を変形に利用する", "示すべき結論を前提として使う"],
          ["P(n)の式を代入する", "P(n)とP(n+1)を混同する"],
        ]}
      />

      <KeyPoint>
        帰納法の証明では、(1) 基底ケースを忘れない、(2) 帰納仮定は P(n) であり P(n+1) ではない、
        (3) 帰納ステップで帰納仮定を正しく使う、の3点が重要。
      </KeyPoint>

      <SectionDivider />

      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: ステップ式証明ビルダー</h2>
        <SteppedProofBuilder />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="15-mathematical-induction" />
    </div>
    </>
  )
}
