import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
} from "@/components/content"
import { VennDiagram, ExampleMapping, InlineMiniQuiz } from "@/components/interactive"

export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第4b章: 全称量化子（∀） — 「すべての」を厳密に表現する</h1>

      <h2>定義: 全称量化子とは何か</h2>

      <Callout variant="definition" label="定義">
        <strong>全称量化子（universal quantifier）</strong>は、記号 <code>∀</code> で表され、
        「すべてのxについてP(x)が成り立つ」ことを主張します。
        形式的には <code>∀x P(x)</code> と書きます。
      </Callout>

      <FormulaBlock caption="全称量化の基本形">
        ∀x P(x)
      </FormulaBlock>

      <p>
        これは「一つ残らず全部を確認した。例外は一切ない」という最も強い主張です。
        100万個の対象があれば、100万個すべてについてP(x)が真でなければなりません。
        たった1つでも反例が見つかれば、∀x P(x) は即座に偽になります。
      </p>
      <p>
        日常会話の「みんな」や「全部」は曖昧さを含みますが、∀はその曖昧さを排除します。
        「すべてのxについて」と言ったら、本当にすべてです。
        議論の対象領域（domain）に含まれるあらゆるxについて、例外なく成立することを意味します。
      </p>

      <KeyPoint>
        ∀x P(x) は対象領域のすべてのxについてP(x)が真であることを要求する。1つでも反例があれば偽。
      </KeyPoint>

      <VennDiagram
        labelA="P(x)"
        labelB="Q(x)"
        highlight={["a-only", "intersection"]}
        formulaLabel="∀x (P(x) → Q(x)): P の全体が Q に含まれる"
      />

      <SectionDivider />

      <h2>形式化パターン: なぜ → であって ∧ ではないのか</h2>

      <p>
        全称量化子を使うとき、最も標準的なパターンは次の形です。
      </p>

      <FormulaBlock caption="全称量化の標準パターン">
        ∀x (P(x) → Q(x))
      </FormulaBlock>

      <p>
        これは「すべてのxについて、P(x)ならばQ(x)である」と読みます。
        具体的な日本語に訳すと「P(x)を満たすものはすべてQ(x)を満たす」ということです。
      </p>

      <h3>∧ を使うとなぜダメなのか</h3>

      <p>
        よくある間違いとして、<code>∀x (P(x) ∧ Q(x))</code> と書いてしまうことがあります。
        「すべての学生は試験に合格した」を形式化する例で、なぜ問題なのか見てみましょう。
      </p>
      <ul>
        <li><code>S(x)</code>: xは学生である</li>
        <li><code>P(x)</code>: xは試験に合格した</li>
      </ul>

      <ComparisonTable
        headers={["正しい形式化（→）", "間違った形式化（∧）"]}
        rows={[
          ["∀x (S(x) → P(x))", "∀x (S(x) ∧ P(x))"],
          [
            "「もしxが学生であるならば、xは試験に合格した」",
            "「宇宙のすべてのxは学生であり、かつ試験に合格した」",
          ],
          [
            "学生でないもの（机、犬、太陽）は S(x) が偽なので自動的に真",
            "机も犬も太陽も「学生であり合格した」ことになり、明らかに偽",
          ],
          ["意図通りの限定", "過剰な主張"],
        ]}
      />

      <p>
        → (含意) を使うことで、<strong>対象を限定</strong>しています。
        学生ではないものについては、S(x)が偽なので S(x) → P(x) は自動的に真です。
        これは第3章で学んだ空真（vacuous truth）です。
      </p>
      <p>
        したがって、実質的に「学生であるものに限って、合格している」という意味になります。
        ∀は対象領域のすべてに適用されるため、→ を使って「関心のある対象」を絞り込む必要があるのです。
      </p>

      <KeyPoint>
        全称量化の標準パターンは ∀x (P(x) → Q(x))。∧ ではなく → を使うことで対象を限定する。
      </KeyPoint>

      <SectionDivider />

      <h2>具体例: ∀ は日常のあらゆる場所にある</h2>

      <h3>日常・ビジネス</h3>
      <p>
        「すべての社員は研修を受講済みである」
      </p>
      <FormulaBlock caption="ビジネスルールの形式化">
        ∀x (Employee(x) → Trained(x))
      </FormulaBlock>
      <p>
        この主張は、社員が1000人いれば1000人全員が研修済みであることを要求します。
        999人が受講済みでも、1人でも未受講なら偽です。
      </p>

      <h3>数学</h3>
      <p>
        「すべての偶数は2で割り切れる」
      </p>
      <FormulaBlock caption="数学的定理の形式化">
        ∀x (Even(x) → DivisibleByTwo(x))
      </FormulaBlock>
      <p>
        これは数学的定理であり、無限個の偶数すべてについて成り立ちます。
        2, 4, 6, 8, ... どれを取っても2で割り切れます。
        反例は存在しません。
      </p>

      <h3>法律</h3>
      <p>
        「すべての国民は法律の定めるところにより、納税の義務を負う」
      </p>
      <FormulaBlock caption="法律条文の形式化">
        ∀x (Citizen(x) → TaxObligation(x))
      </FormulaBlock>
      <p>
        法律の条文では「すべての」が頻出します。
        一人でも例外を認めてしまうと、法の下の平等が崩れます。
        全称量化は法律の根幹をなす概念です。
      </p>

      <h3>プログラミング</h3>
      <p>
        JavaScriptの <code>Array.every()</code> は全称量化子の直接的な実装です。
      </p>
      <FormulaBlock caption="JavaScriptによる全称量化">
        {"students.every(s => s.score >= 60)"}
      </FormulaBlock>
      <p>
        これは「students配列のすべての要素sについて、s.score &gt;= 60 が真である」ことを検証します。
        1つでも60点未満があれば <code>false</code> を返します。
        まさに ∀x P(x) のプログラミング的表現です。
      </p>
      <p>
        TypeScriptでは <code>{"Required<T>"}</code> 型が全称量化に近い概念です。
        「Tのすべてのプロパティが必須である」ことを意味し、一つでもオプショナルなプロパティがあることを許しません。
      </p>

      <KeyPoint>
        ∀ はビジネスルール、数学、法律、プログラミング（Array.every、Required型）など、あらゆる場面に登場する。
      </KeyPoint>

      <ExampleMapping
        formula="∀x (Student(x) → Studies(x))"
        example="すべての学生は勉強する"
        variables={{ "∀x": "すべてのxについて", "Student(x)": "xは学生", "Studies(x)": "xは勉強する" }}
      />

      <SectionDivider />

      <h2>反例の破壊力: 黒い白鳥</h2>

      <p>
        1697年以前のヨーロッパでは、「すべての白鳥は白い」は疑いようのない真実でした。
        何千年にもわたり、誰も白くない白鳥を見たことがなかったのです。
      </p>

      <FormulaBlock caption="かつて真と信じられていた命題">
        ∀x (Swan(x) → White(x))
      </FormulaBlock>

      <p>
        しかし1697年、オランダの探検家がオーストラリアで黒い白鳥を発見しました。
        たった一羽の黒い白鳥が、何千年もの観察に基づく全称命題を破壊したのです。
      </p>
      <p>
        これが∀の本質です。
        <strong>どれだけ多くの確認例があっても、∀は保証されません。
        しかし、たった1つの反例で∀は崩壊します。</strong>
      </p>

      <h3>重要な注意: ¬∀x P(x) と ∀x ¬P(x) は異なる</h3>

      <p>
        「すべての白鳥が白い」が偽 — つまり <code>¬∀x (Swan(x) → White(x))</code> — であることが分かっても、
        「すべての白鳥は白くない」<code>∀x (Swan(x) → ¬White(x))</code> が成り立つわけではありません。
      </p>

      <FormulaBlock caption="否定と全称の関係">
        ¬∀x P(x) ≡ ∃x ¬P(x)
      </FormulaBlock>

      <p>
        ∀x P(x) が偽であるとは、「少なくとも1つの例外が存在する」ということです。
        ∃ については次章で詳しく学びます。
        「すべてではない」は「一つも〜ない」とは全く異なる主張です。
      </p>

      <KeyPoint>
        たった1つの反例で ∀ は崩壊する。また ¬∀x P(x)（すべてではない）と ∀x ¬P(x)（一つもない）は全く別の主張。
      </KeyPoint>

      <InlineMiniQuiz
        question="∀x P(x) を否定すると？"
        options={["∃x ¬P(x)", "¬∀x P(x)", "∀x ¬P(x)", "∃x P(x)"]}
        correctIndex={0}
        explanation="「すべてのxがPを満たす」の否定は「Pを満たさないxが存在する」です。"
      />

      <SectionDivider />

      <h2>どこで使われるか</h2>

      <h3>数学の証明</h3>
      <p>
        数学で ∀x P(x) を証明するとき、「任意のxを取る」という手法を使います。
        特定のxではなく、何の仮定も置かない一般的なxについて P(x) を示すことで、すべてのxについて成り立つことを証明します。
        これを<strong>普遍化（universal generalization）</strong>と呼びます。
      </p>

      <h3>契約書</h3>
      <p>
        「本契約のすべての条項は、甲乙双方を拘束する」のように、契約書では全称量化が法的効力の範囲を決定します。
        「すべての条項」に例外があると、契約の効力に穴が生じます。
      </p>

      <h3>品質保証（QA）</h3>
      <FormulaBlock caption="CI/CDの合格基準">
        ∀x (TestCase(x) → Passed(x))
      </FormulaBlock>
      <p>
        「すべてのテストケースが通った」はまさにこの形式です。
        CI/CDパイプラインでは、1つでもテストが失敗すればビルドは失敗扱いになります。
        これはまさに全称量化の原理です。
      </p>

      <h3>SQL: NOT EXISTS</h3>
      <p>
        SQLには ∀ を直接表現するキーワードはありませんが、<code>NOT EXISTS</code> を使って全称量化を表現できます。
        「すべての注文が出荷済みである」は「未出荷の注文が存在しない」と同値です。
      </p>
      <FormulaBlock caption="SQLによる全称量化の表現">
        {"SELECT * FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.shipped = false)"}
      </FormulaBlock>
      <p>
        これは「未出荷の注文が1つも存在しない顧客」を取得するクエリです。
        論理学的には ∀x (Order(x, c) → Shipped(x)) を表現しています。
      </p>

      <KeyPoint>
        全称量化は数学の証明（普遍化）、契約書、QA（CI/CD）、SQL（NOT EXISTS）など幅広い分野で活用される。
      </KeyPoint>

      <SectionDivider />

      <h2>ないと困ること</h2>

      <h3>「すべて」と「一部」を混同する危険</h3>
      <p>
        全称量化子がなければ、「すべての従業員に適用される規則」と「一部の従業員に適用される規則」を形式的に区別できません。
        法律や契約の文脈では、この混同は致命的です。
      </p>
      <p>
        「全従業員に残業規制が適用される」と「一部の従業員に残業規制が適用される」では、法的効果がまったく異なります。
      </p>

      <h3>テスト結果の解釈が曖昧になる</h3>
      <p>
        「テストが通った」と報告されたとき、それは「すべてのテストが通った」のか「いくつかのテストが通った」のか。
        ∀の概念がなければ、この区別を厳密に表現できません。
      </p>
      <p>
        CI/CDで100個中99個のテストが通っていても、1個失敗すればリリースすべきではありません。
        「すべて通った」（∀）と「ほとんど通った」は根本的に異なります。
      </p>

      <h3>数学的証明が不可能になる</h3>
      <p>
        ∀がなければ、「すべての偶数は2で割り切れる」のような定理を述べることすらできません。
        個別の事例（2は割り切れる、4は割り切れる...）を列挙するしかなく、無限に存在する偶数すべてについての主張を表現する手段がなくなります。
      </p>

      <KeyPoint>
        ∀ がなければ「すべて」と「一部」の区別が曖昧になり、法律・テスト・数学の厳密な議論が不可能になる。
      </KeyPoint>

      <SectionDivider />

      <h2>よくある誤解</h2>

      <Callout variant="warning" label="よくある誤解">
        <p><strong>誤解1: ∀x(P(x) ∧ Q(x)) と ∀x(P(x) → Q(x)) は同じ</strong></p>
        <p>
          これは全称量化でもっとも危険な罠です。
          ∧ を使うと「宇宙のすべてのものがP(x)かつQ(x)」という意味になり、ほぼ確実に偽になります。
          → を使えば「P(x)であるものに限ってQ(x)が言える」という適切な限定になります。
        </p>
        <ul>
          <li><code>∀x (Cat(x) ∧ HasTail(x))</code> = 「万物は猫であり尻尾を持つ」（偽）</li>
          <li><code>∀x (Cat(x) → HasTail(x))</code> = 「猫であるなら尻尾を持つ」（意図通り）</li>
        </ul>
      </Callout>

      <Callout variant="warning" label="よくある誤解">
        <p><strong>誤解2: 有限個の確認で ∀ が証明できる</strong></p>
        <p>
          「100個調べてすべて成り立ったから、∀x P(x)は真だ」 — これは誤りです。
          ∀は対象領域のすべてについて述べており、対象領域が無限であれば、有限回の確認では証明になりません。
          黒い白鳥の例が示すように、何千年の観察も ∀ を保証しません。
        </p>
        <p>
          ただし、対象領域が有限の場合（例: 配列の要素、社員リスト）は、すべてを確認すれば ∀ が成り立つことを確認できます。
          <code>Array.every()</code> が機能するのは、配列が有限だからです。
        </p>
      </Callout>

      <Callout variant="warning" label="よくある誤解">
        <p><strong>誤解3: ¬∀x P(x) は ∀x ¬P(x) を意味する</strong></p>
        <p>
          「すべてのxについてP(x)が成り立つわけではない」は、「すべてのxについてP(x)が成り立たない」とは全く異なります。
        </p>
        <ul>
          <li><code>¬∀x P(x)</code> = 「P(x)が成り立たないxが少なくとも1つ存在する」= <code>∃x ¬P(x)</code></li>
          <li><code>∀x ¬P(x)</code> = 「どのxについてもP(x)は成り立たない」</li>
        </ul>
        <p>
          「全員が賛成しているわけではない」は「1人以上の反対者がいる」であって、「全員が反対している」ではありません。
          この区別は日常会話でも、論理学でも、プログラミングでも極めて重要です。
        </p>
      </Callout>
    </article>
  )
}
