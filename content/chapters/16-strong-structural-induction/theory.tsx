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
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第19章: 強帰納法と構造帰納法</h1>

      <MotivationSection
        icon="🌳"
        realWorldExample="再帰的なデータ構造（リスト、木、JSON）に対する操作の正しさを証明するには、構造帰納法が不可欠。"
        nextChapterConnection="再帰と帰納の対応関係でプログラムの正しさを証明"
      />

      <h2>強帰納法: すべての先行者を仮定する</h2>

      <p>
        前章で学んだ通常の帰納法（弱帰納法）では、帰納ステップにおいて
        P(n) だけを仮定して P(n+1) を示しました。
        しかし、場合によっては P(n) だけでなく、P(0), P(1), ..., P(n-1) のすべてを
        仮定できた方が証明しやすいことがあります。
      </p>

      <Callout variant="definition" label="強帰納法（Strong Induction）">
        自然数 n に関する命題 P(n) について、
        「すべての k &lt; n について P(k) が成り立つ」と仮定して P(n) を示すことができれば、
        すべての自然数 n について P(n) が成り立つ。
      </Callout>

      <FormulaBlock caption="強帰納法の形式化">
        ∀n(∀k(k &lt; n → P(k)) → P(n)) → ∀n P(n)
      </FormulaBlock>

      <p>
        強帰納法では基底ケースが帰納ステップに含まれます。
        n = 0 の場合、「すべての k &lt; 0 について P(k)」は空真（vacuous truth）なので、
        P(0) を直接示す必要があります。
        これが実質的な基底ケースとなります。
      </p>

      <KeyPoint>
        強帰納法では P(n) を示すために P(0), P(1), ..., P(n-1) のすべてを
        帰納仮定として使える。直前の値だけでなく、任意の先行する値を参照できる。
      </KeyPoint>

      <SectionDivider />

      <h2>弱帰納法との比較</h2>

      <ComparisonTable
        headers={["弱帰納法（通常の帰納法）", "強帰納法"]}
        rows={[
          ["帰納仮定: P(n) のみ", "帰納仮定: P(0), P(1), ..., P(n-1) すべて"],
          ["P(n) → P(n+1) を証明", "∀k<n P(k) → P(n) を証明"],
          ["基底ケースを別途示す", "基底ケースが帰納ステップに含まれる"],
          ["直前の値から決まる場合に有効", "複数の先行値を参照する場合に有効"],
          ["例: 和の公式", "例: 素因数分解の一意性"],
        ]}
      />

      <Callout variant="warning" label="等価性に注意">
        弱帰納法と強帰納法は<strong>論理的に等価</strong>です。
        一方で証明できることは、もう一方でも必ず証明できます。
        しかし、実際の証明では強帰納法の方が自然で簡潔になる場合があります。
      </Callout>

      <h3>強帰納法の実例: 素因数分解の存在</h3>

      <Callout variant="tip" label="定理">
        2以上のすべての自然数は、素数の積として表せる。
      </Callout>

      <p>
        <strong>証明（強帰納法）:</strong>
        n ≧ 2 とする。2以上 n 未満のすべての自然数が素因数分解を持つと仮定する（帰納仮定）。
      </p>
      <ul>
        <li><strong>n が素数の場合:</strong> n 自身が素因数分解（長さ1の積）である。</li>
        <li>
          <strong>n が合成数の場合:</strong> n = a &middot; b（2 ≦ a, b &lt; n）と書ける。
          帰納仮定より a と b はそれぞれ素因数分解を持つ。
          よって n = a &middot; b も素数の積として表せる。
        </li>
      </ul>

      <p>
        この証明では、n のすぐ前の値 n-1 だけでなく、
        a と b という n より小さい任意の値に帰納仮定を適用しています。
        これは弱帰納法では直接扱いにくい構造です。
      </p>

      <ArgumentTree
        premises={["∀k (2 ≦ k < n → k は素因数分解を持つ)", "n が素数 ∨ n = a·b (2 ≦ a,b < n)"]}
        conclusion="n は素因数分解を持つ"
        rule="強帰納法"
        caption="素因数分解の存在証明の構造"
      />

      <InlineMiniQuiz
        question="強帰納法で素因数分解の存在を証明するとき、帰納仮定として使えるのはどれですか？"
        options={[
          "2以上 n未満のすべての自然数が素因数分解を持つ",
          "n-1 のみが素因数分解を持つ",
          "n が素因数分解を持つ",
          "すべての自然数が素因数分解を持つ"
        ]}
        correctIndex={0}
        explanation="強帰納法では、n より小さいすべての値について命題が成り立つことを帰納仮定として使えます。合成数 n = a·b の a, b は n より小さい任意の値なので、この強い帰納仮定が必要です。"
      />

      <SectionDivider />

      <h2>構造帰納法: データ構造への拡張</h2>

      <p>
        数学的帰納法は自然数に関する命題を証明する手法でした。
        しかし、プログラミングでは自然数だけでなく、
        リスト、木、式（expression）など、再帰的に定義されたデータ構造を扱います。
        <strong>構造帰納法（structural induction）</strong>は、
        帰納法をこれらのデータ構造に拡張したものです。
      </p>

      <Callout variant="definition" label="構造帰納法">
        再帰的に定義されたデータ構造 D について、性質 P を証明するには、
        (1) すべての基底ケース（最小の構造）で P が成り立つことを示し、
        (2) 部分構造で P が成り立つと仮定して、より大きな構造でも P が成り立つことを示す。
      </Callout>

      <KeyPoint>
        構造帰納法の考え方: データ構造の定義に沿って帰納法を行う。
        基底ケースは最小の構造、帰納ステップは構築規則に対応する。
      </KeyPoint>

      <SectionDivider />

      <h2>リストの構造帰納法</h2>

      <p>
        リストは次のように再帰的に定義されます。
      </p>

      <Callout variant="definition" label="リストの再帰的定義">
        <strong>基底ケース:</strong> 空リスト [] はリストである。<br />
        <strong>帰納ステップ:</strong> x がリストの要素、L がリストならば、x :: L（cons）もリストである。
      </Callout>

      <p>
        リストに関する性質 P を構造帰納法で証明するには、次の2ステップを示します。
      </p>

      <ComparisonTable
        headers={["ステップ", "内容"]}
        rows={[
          ["基底ケース", "P([]) が成り立つことを示す"],
          ["帰納ステップ", "任意の x と L について、P(L) を仮定して P(x :: L) を示す"],
        ]}
      />

      <h3>実例: リストの連結の長さ</h3>

      <Callout variant="tip" label="定理">
        任意のリスト A, B について、length(A ++ B) = length(A) + length(B) が成り立つ。
      </Callout>

      <p>
        リスト A についての構造帰納法で証明します。
      </p>
      <p>
        <strong>基底ケース (A = []):</strong><br />
        length([] ++ B) = length(B) = 0 + length(B) = length([]) + length(B) ✓
      </p>
      <p>
        <strong>帰納ステップ (A = x :: A&apos;):</strong><br />
        帰納仮定: length(A&apos; ++ B) = length(A&apos;) + length(B)。<br />
        length((x :: A&apos;) ++ B) = length(x :: (A&apos; ++ B)) = 1 + length(A&apos; ++ B)<br />
        = 1 + length(A&apos;) + length(B)（帰納仮定）<br />
        = length(x :: A&apos;) + length(B) = length(A) + length(B) ✓
      </p>

      <SectionDivider />

      <h2>木の構造帰納法</h2>

      <p>
        二分木は次のように再帰的に定義されます。
      </p>

      <Callout variant="definition" label="二分木の再帰的定義">
        <strong>基底ケース:</strong> 葉（Leaf）は二分木である。<br />
        <strong>帰納ステップ:</strong> L, R が二分木ならば、Node(L, v, R) も二分木である。
      </Callout>

      <p>
        木に関する性質 P を構造帰納法で証明するには、次のステップを示します。
      </p>

      <ComparisonTable
        headers={["ステップ", "内容"]}
        rows={[
          ["基底ケース", "P(Leaf) が成り立つことを示す"],
          ["帰納ステップ", "P(L) と P(R) を仮定して P(Node(L, v, R)) を示す"],
        ]}
      />

      <h3>実例: ノード数と葉の関係</h3>

      <Callout variant="tip" label="定理">
        完全二分木において、葉の数 = 内部ノードの数 + 1 が成り立つ。
      </Callout>

      <p>
        <strong>基底ケース (Leaf):</strong><br />
        葉の数 = 1, 内部ノードの数 = 0。1 = 0 + 1 ✓
      </p>
      <p>
        <strong>帰納ステップ (Node(L, v, R)):</strong><br />
        帰納仮定: L の葉数 = L の内部ノード数 + 1、R の葉数 = R の内部ノード数 + 1。<br />
        Node(L, v, R) の葉数 = L の葉数 + R の葉数<br />
        = (L の内部ノード数 + 1) + (R の内部ノード数 + 1)（帰納仮定）<br />
        = (L の内部ノード数 + R の内部ノード数 + 1) + 1<br />
        = Node(L, v, R) の内部ノード数 + 1 ✓
      </p>

      <InlineMiniQuiz
        question="二分木の構造帰納法の帰納ステップで仮定するのはどれですか？"
        options={[
          "左部分木と右部分木の両方で命題が成り立つ",
          "親ノードで命題が成り立つ",
          "木全体で命題が成り立つ",
          "葉のみで命題が成り立つ"
        ]}
        correctIndex={0}
        explanation="構造帰納法では、部分構造について命題が成り立つことを仮定します。二分木の場合、Node(L, v, R) の部分構造は左部分木 L と右部分木 R なので、両方について P が成り立つと仮定して P(Node(L, v, R)) を示します。"
      />

      <SectionDivider />

      <h2>プログラミングとの対応: 再帰関数の正しさ証明</h2>

      <p>
        構造帰納法は、再帰関数の正しさを証明するための自然な方法です。
        再帰的なデータ構造に対する再帰関数は、
        構造帰納法とまったく同じ構造を持っています。
      </p>

      <ComparisonTable
        headers={["構造帰納法", "再帰関数"]}
        rows={[
          ["基底ケースの証明", "基底ケースの処理（再帰の停止条件）"],
          ["帰納仮定", "再帰呼び出しが正しく動作するという仮定"],
          ["帰納ステップの証明", "再帰呼び出しの結果を使って正しい値を返す"],
          ["帰納原理により全体が証明される", "再帰の停止性と正当性が保証される"],
        ]}
      />

      <Callout variant="tip" label="例: リストの反転">
        <code>reverse([]) = []</code>（基底ケース）<br />
        <code>reverse(x :: L) = reverse(L) ++ [x]</code>（帰納ステップ）<br /><br />
        この定義自体が構造帰納法の構造を反映しています。
        <code>reverse(L)</code> が正しいと仮定すれば（帰納仮定）、
        <code>reverse(x :: L) = reverse(L) ++ [x]</code> も正しいことが示せます。
      </Callout>

      <KeyPoint>
        再帰関数の正しさは構造帰納法で証明できる。
        基底ケースの処理が正しく、帰納ステップで再帰呼び出しの結果を正しく使っていれば、
        すべての入力に対して関数は正しく動作する。
      </KeyPoint>

      <ArgumentTree
        premises={["reverse([]) = [] は正しい", "reverse(L) が正しいと仮定すると reverse(x::L) も正しい"]}
        conclusion="すべてのリスト L について reverse(L) は正しい"
        rule="構造帰納法"
        caption="再帰関数の正しさの証明構造"
      />

      <InlineMiniQuiz
        question="再帰関数の停止条件は、構造帰納法のどの部分に対応しますか？"
        options={[
          "基底ケース",
          "帰納ステップ",
          "帰納仮定",
          "結論"
        ]}
        correctIndex={0}
        explanation="再帰関数の停止条件（空リスト、葉ノードなど）は、構造帰納法の基底ケースに対応します。最小の構造で正しく動作することが、帰納法の出発点です。"
      />

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="16-strong-structural-induction" />
    </div>
    </>
  )
}
