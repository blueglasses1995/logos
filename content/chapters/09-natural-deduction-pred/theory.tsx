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
  VennDiagram,
  InlineMiniQuiz,
  SteppedProofBuilder,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第12章: 自然演繹（述語論理）</h1>

      <MotivationSection
        icon="🔬"
        realWorldExample="「すべてのユーザーが認証済みである」ことを証明する。述語論理の推論規則がソフトウェア検証の基盤。"
        nextChapterConnection="等号と一意性で「ただ一つ」を厳密に扱う"
      />

      <h2>命題論理から述語論理へ: 推論規則の拡張</h2>

      <p>
        第4章（命題論理の自然演繹）では、→I、→E、∧I、∧E、∨I、∨E、¬I、¬E などの推論規則を学びました。
        これらの規則はそのまま述語論理でも使えます。
        しかし、述語論理には量化子（∀ と ∃）が登場するため、
        これらを導入・除去するための<strong>4つの新しい規則</strong>が必要になります。
      </p>

      <ComparisonTable
        headers={["規則", "意味"]}
        rows={[
          ["∀I（全称導入）", "任意の対象について成り立つことを示す → 一般化"],
          ["∀E（全称除去）", "全称命題から特定の対象に適用する → 具体化"],
          ["∃I（存在導入）", "具体例から存在命題を導く → 存在の主張"],
          ["∃E（存在除去）", "存在命題から仮定を置いて推論する → 仮名で推論"],
        ]}
      />

      <KeyPoint>
        述語論理の自然演繹 = 命題論理の規則 + 量化子の4規則（∀I, ∀E, ∃I, ∃E）
      </KeyPoint>

      <SectionDivider />

      <h2>∀E（全称除去）: 全体から個別へ</h2>

      <Callout variant="definition" label="∀E（Universal Elimination）">
        <strong>∀E</strong>は、全称命題 <code>∀x P(x)</code> が成り立つとき、
        任意の項 <code>t</code> について <code>P(t)</code> を導く規則です。
        形式的には: <code>∀x P(x) ⊢ P(t)</code>（tは任意の項）
      </Callout>

      <FormulaBlock caption="∀E の形式">
        ∀x P(x) ⊢ P(a)
      </FormulaBlock>

      <p>
        これは最も直感的な規則です。
        「すべてのxについてP(x)が成り立つ」なら、当然「特定のaについてもP(a)が成り立つ」はずです。
        具体例で考えましょう。
      </p>

      <p>
        前提: 「すべての学生は試験に合格した」（∀x (Student(x) → Passed(x))）
      </p>
      <p>
        結論: 「太郎は学生である」（Student(太郎)）が分かっているなら、
        ∀E で Student(太郎) → Passed(太郎) を得て、
        →E（モーダスポネンス）で Passed(太郎) を導けます。
      </p>

      <ArgumentTree
        premises={["∀x (Student(x) → Passed(x))", "Student(太郎)"]}
        conclusion="Passed(太郎)"
        rule="∀E + →E"
      />

      <Callout variant="tip" label="プログラミングとの対応">
        <p>
          TypeScriptの型パラメータと同じ考え方です。
          <code>{"function identity<T>(x: T): T"}</code> は「すべての型Tについて、T → T」です。
          <code>identity(42)</code> と呼ぶとき、Tにnumberを代入します。
          これが∀E（型変数の具体化）です。
        </p>
      </Callout>

      <SectionDivider />

      <h2>∀I（全称導入）: 個別から全体へ</h2>

      <Callout variant="definition" label="∀I（Universal Introduction）">
        <strong>∀I</strong>は、任意に選んだ対象 <code>a</code> について <code>P(a)</code> を証明できたとき、
        <code>∀x P(x)</code> を導く規則です。
        ただし、<code>a</code> は<strong>固有変数（eigenvariable）</strong>でなければなりません。
      </Callout>

      <FormulaBlock caption="∀I の形式">
        {"P(a) ⊢ ∀x P(x)   （aは固有変数）"}
      </FormulaBlock>

      <p>
        直感的には「何の仮定も置いていない一般的なaについてP(a)を示せたのだから、
        すべてのxについてP(x)が成り立つ」ということです。
        数学の証明で「任意のxを取る。... したがってP(x)が成り立つ。
        xは任意だったから、∀x P(x)」と書くのがまさにこれです。
      </p>

      <Callout variant="warning" label="固有変数条件（Eigenvariable Condition）">
        <p>
          ∀Iを適用するとき、変数 <code>a</code> は以下の条件を満たす必要があります:
        </p>
        <ul>
          <li><code>a</code> は前提（仮定）のどこにも現れていないこと</li>
          <li><code>a</code> は結論の中で自由変数として現れないこと</li>
          <li><code>a</code> は「たまたまその名前だった」だけで、特別な性質を持たない一般的な対象であること</li>
        </ul>
        <p>
          この条件を破ると、誤った推論が可能になります。
        </p>
      </Callout>

      <h3>固有変数条件に違反する例</h3>

      <p>
        もし固有変数条件を無視すると、次のような明らかに不正な推論ができてしまいます:
      </p>

      <FormulaBlock caption="誤った推論（固有変数条件違反）">
        {"前提: Even(2)\n∀Iを不正に適用: ∀x Even(x)  ← 間違い!"}
      </FormulaBlock>

      <p>
        2は偶数ですが、「すべてのxは偶数である」は明らかに偽です。
        2は<strong>特定の対象</strong>であり、何の仮定も置いていない一般的な変数ではありません。
        固有変数条件が「aは特別な性質を持たない」ことを要求する理由がここにあります。
      </p>

      <KeyPoint>
        ∀I の固有変数条件は「特定の事例から不当に一般化すること」を防ぐ安全装置。
        これがないと「2は偶数」から「すべては偶数」が導けてしまう。
      </KeyPoint>

      <InlineMiniQuiz
        question="次のうち、∀I の固有変数条件に違反しているのはどれですか？"
        options={[
          "前提「P(a)」からaについて証明し、∀x P(x) を導く（aは前提に現れない）",
          "前提「a > 0」から証明し、∀x (x > 0) を導く",
          "任意のaを取り、P(a) → P(a) を示して、∀x (P(x) → P(x)) を導く",
          "任意のaを取り、P(a) ∨ ¬P(a) を示して、∀x (P(x) ∨ ¬P(x)) を導く",
        ]}
        correctIndex={1}
        explanation="前提に「a > 0」としてaが現れているため、aは固有変数条件を満たしません。aは「0より大きい」という特別な性質を持つ特定の対象であり、一般化の根拠にはなりません。"
      />

      <SectionDivider />

      <h2>∃I（存在導入）: 具体例から存在へ</h2>

      <Callout variant="definition" label="∃I（Existential Introduction）">
        <strong>∃I</strong>は、特定の項 <code>a</code> について <code>P(a)</code> が成り立つとき、
        <code>∃x P(x)</code> を導く規則です。
        形式的には: <code>P(a) ⊢ ∃x P(x)</code>
      </Callout>

      <FormulaBlock caption="∃I の形式">
        P(a) ⊢ ∃x P(x)
      </FormulaBlock>

      <p>
        これも直感的です。
        「aがPを満たす」なら、当然「Pを満たすものが存在する」と言えます。
        具体例があるのに「存在しない」とは言えません。
      </p>

      <ArgumentTree
        premises={["Prime(7)", "7 > 5"]}
        conclusion="∃x (Prime(x) ∧ x > 5)"
        rule="∧I + ∃I"
      />

      <p>
        7は素数であり、7は5より大きい。
        よって、5より大きい素数が存在する（∃x (Prime(x) ∧ x &gt; 5)）。
        この推論は∧Iで Prime(7) ∧ 7 &gt; 5 を作り、∃Iで存在命題にします。
      </p>

      <Callout variant="tip" label="プログラミングとの対応">
        <p>
          JavaScriptの <code>Array.some()</code> は∃の検証です。
          <code>{"[3, 7, 11].some(x => x > 5)"}</code> は
          「配列に5より大きい要素が存在する」を確認します。
          7という具体例が見つかれば true を返す — これが∃Iです。
        </p>
      </Callout>

      <SectionDivider />

      <h2>∃E（存在除去）: 存在から推論へ</h2>

      <Callout variant="definition" label="∃E（Existential Elimination）">
        <strong>∃E</strong>は、<code>∃x P(x)</code> が成り立つとき、
        仮に <code>P(a)</code> を満たすある <code>a</code> が存在すると仮定して推論を進め、
        結論 <code>C</code> を導く規則です。
        ただし、<code>a</code> は<strong>固有変数</strong>でなければなりません。
      </Callout>

      <FormulaBlock caption="∃E の形式">
        {"∃x P(x),  [P(a)]...C  ⊢  C   （aは固有変数）"}
      </FormulaBlock>

      <p>
        ∃E は4つの規則の中で最も注意が必要です。
        「P(a)を満たすaが存在する」と分かっているとき、そのaを<strong>仮に</strong>取り出して推論します。
        ただし、結論 <code>C</code> の中にaが残ってはいけません。
        なぜなら、aは「P(a)を満たす何か」であって、具体的に誰（何）かは分からないからです。
      </p>

      <h3>∃E の具体例</h3>

      <p>次の推論を考えましょう:</p>

      <FormulaBlock caption="∃E を使った推論の例">
        {"前提1: ∃x (Student(x) ∧ Failed(x))\n前提2: ∀x (Failed(x) → NeedsReview(x))\n結論: ∃x (Student(x) ∧ NeedsReview(x))"}
      </FormulaBlock>

      <p>証明の流れ:</p>
      <ol>
        <li>∃x (Student(x) ∧ Failed(x)) — 前提1</li>
        <li>[Student(a) ∧ Failed(a)] — 仮定（∃Eのため、aを固有変数として取り出す）</li>
        <li>Failed(a) — ∧E（2より）</li>
        <li>Failed(a) → NeedsReview(a) — ∀E（前提2より）</li>
        <li>NeedsReview(a) — →E（3, 4より）</li>
        <li>Student(a) — ∧E（2より）</li>
        <li>Student(a) ∧ NeedsReview(a) — ∧I（6, 5より）</li>
        <li>∃x (Student(x) ∧ NeedsReview(x)) — ∃I（7より）</li>
        <li>∃x (Student(x) ∧ NeedsReview(x)) — ∃E（1, 2-8より）</li>
      </ol>

      <p>
        ポイントは、仮定 [Student(a) ∧ Failed(a)] の中で推論を進め、
        最終的に結論 ∃x (Student(x) ∧ NeedsReview(x)) にはaが残っていないことです。
        aはあくまで「試験に不合格だった学生の一人」を仮に名付けただけです。
      </p>

      <Callout variant="warning" label="∃E の固有変数条件">
        <p>
          ∃Eの固有変数条件は∀Iの条件と同様に重要です:
        </p>
        <ul>
          <li><code>a</code> は ∃x P(x) 以外の前提に現れてはいけない</li>
          <li><code>a</code> は結論 C に現れてはいけない</li>
          <li><code>a</code> は ∃x P(x) の仮定ブロックの外で使われてはいけない</li>
        </ul>
        <p>
          これを破ると、「存在するもの」の正体を特定したかのような誤った推論が可能になります。
        </p>
      </Callout>

      <KeyPoint>
        ∃E では「存在するもの」に仮の名前aを付けて推論するが、
        結論にaが残ってはならない。aの正体は不明だからである。
      </KeyPoint>

      <InlineMiniQuiz
        question="∃E（存在除去）について正しい説明はどれですか？"
        options={[
          "∃x P(x) から直接 P(a) を導き、aを自由に使える",
          "∃x P(x) から仮の名前aでP(a)を仮定し、結論にaが残らないように推論する",
          "∃x P(x) から ∀x P(x) を導く規則",
          "P(a) から ∃x P(x) を導く規則",
        ]}
        correctIndex={1}
        explanation="∃Eは仮の名前aでP(a)を仮定して推論しますが、結論にaが残ってはいけません。直接P(a)を取り出して自由に使えるわけではなく、固有変数条件を満たす必要があります。選択肢4は∃I（存在導入）の説明です。"
      />

      <SectionDivider />

      <h2>4つの規則の関係を整理する</h2>

      <ComparisonTable
        headers={["導入（Introduction）", "除去（Elimination）"]}
        rows={[
          ["∀I: P(a) ⊢ ∀x P(x)（aは固有変数）", "∀E: ∀x P(x) ⊢ P(t)（tは任意の項）"],
          ["∃I: P(a) ⊢ ∃x P(x)（aは任意の項）", "∃E: ∃x P(x), [P(a)]...C ⊢ C（aは固有変数）"],
        ]}
      />

      <p>
        興味深い対称性があります:
      </p>
      <ul>
        <li><strong>固有変数条件が必要な規則</strong>: ∀I と ∃E — 一般性を保つために制約が必要</li>
        <li><strong>固有変数条件が不要な規則</strong>: ∀E と ∃I — 具体化するだけなので制約不要</li>
      </ul>

      <p>
        ∀I は「個別から全体へ」一般化するので、特定の事例に依存していないことを保証する必要があります。
        ∃E は「存在するもの」を仮定して推論するので、その仮のものに依存しない結論を出す必要があります。
        どちらも「不当な特定化」を防ぐための安全装置です。
      </p>

      <VennDiagram
        labelA="固有変数条件が必要"
        labelB="導入規則"
        highlight={["a-only", "intersection"]}
        formulaLabel="∀I（導入+固有変数）と ∃E（除去+固有変数）: 一般性を保つ規則"
      />

      <KeyPoint>
        ∀I と ∃E には固有変数条件が必要（一般性の保証）。∀E と ∃I には不要（具体化のみ）。
        この対称性を理解すれば、どの規則で注意が必要か一目でわかる。
      </KeyPoint>

      <SectionDivider />

      <h2>固有変数条件の重要性 — 間違いやすいポイント</h2>

      <p>
        固有変数条件は形式的な制約に見えますが、
        これがなければ論理体系が崩壊します。
        典型的な間違いを見てみましょう。
      </p>

      <h3>間違い1: 特定の事例から不当な一般化</h3>

      <FormulaBlock caption="誤った∀I の適用">
        {"1. Even(2)          — 前提（2は偶数）\n2. ∀x Even(x)        — ∀I（1より）← 不正!"}
      </FormulaBlock>
      <p>
        2は固有変数ではなく定数です。2の特殊な性質を使っているのに、
        「すべてのxについて」と一般化するのは不正です。
      </p>

      <h3>間違い2: ∃Eで仮定した変数が結論に残る</h3>

      <FormulaBlock caption="誤った∃E の適用">
        {"1. ∃x Genius(x)     — 前提（天才が存在する）\n2. [Genius(a)]       — 仮定（∃E）\n3. a = アインシュタイン — これは導けない!\n4. Genius(アインシュタイン) — 不正な結論"}
      </FormulaBlock>
      <p>
        「天才が存在する」からは「天才がいる」しか分かりません。
        その天才が誰であるかは特定できません。
        aの正体を決めてしまうのは固有変数条件の違反です。
      </p>

      <h3>間違い3: ∃Eの仮定変数が他の前提に干渉する</h3>

      <FormulaBlock caption="もう一つの誤った∃E">
        {"前提1: ∃x Tall(x)    — 背の高い人がいる\n前提2: Short(a)       — aは背が低い\n仮定: [Tall(a)]       — aは背が高い（∃E）← aが前提2に登場!"}
      </FormulaBlock>
      <p>
        前提2で既にaが使われているのに、∃Eでaを固有変数として使おうとしています。
        これだと「aは背が低い」かつ「aは背が高い」という矛盾が生じます。
        固有変数は他の前提に現れてはいけません。
      </p>

      <KeyPoint>
        固有変数条件の違反パターン: (1)定数からの不当な一般化、(2)仮定した変数の正体の特定、(3)他の前提との干渉。
        これらを避ければ、述語論理の証明は安全に進められる。
      </KeyPoint>

      <InlineMiniQuiz
        question="次の推論は正しいですか？「∃x (Dog(x) ∧ Clever(x)) から、∃Eで Dog(a) ∧ Clever(a) を仮定し、Clever(a) を導き、∃x Clever(x) を結論する」"
        options={[
          "正しい。結論 ∃x Clever(x) にaが残っておらず、固有変数条件を満たしている",
          "正しくない。Dog(a) を使っていないから不正",
          "正しくない。∃Iの適用が不正",
          "正しくない。∃Eでは ∧E を使えない",
        ]}
        correctIndex={0}
        explanation="∃Eで Dog(a) ∧ Clever(a) を仮定し、∧E で Clever(a) を得て、∃I で ∃x Clever(x) を導いています。結論にaは残っておらず、aは他の前提にも現れていないので、固有変数条件を満たしています。Dog(a) を使わなくても問題ありません（仮定のすべてを使う必要はありません）。"
      />

      <SectionDivider />

      <h2>述語論理での完全な証明例</h2>

      <p>
        ここまでの規則を組み合わせた、やや複雑な証明例を見てみましょう。
      </p>

      <Callout variant="tip" label="証明例">
        <p><strong>定理:</strong> ∀x (P(x) → Q(x)), ∀x (Q(x) → R(x)) ⊢ ∀x (P(x) → R(x))</p>
        <p>（「PならばQ」かつ「QならばR」がすべてのxで成り立つなら、「PならばR」もすべてのxで成り立つ）</p>
      </Callout>

      <FormulaBlock caption="証明">
        {"1. ∀x (P(x) → Q(x))      — 前提\n2. ∀x (Q(x) → R(x))      — 前提\n3.   [P(a)]               — 仮定（→I のため）\n4.   P(a) → Q(a)          — ∀E（1より）\n5.   Q(a)                 — →E（3, 4より）\n6.   Q(a) → R(a)          — ∀E（2より）\n7.   R(a)                 — →E（5, 6より）\n8. P(a) → R(a)            — →I（3-7より）\n9. ∀x (P(x) → R(x))      — ∀I（8より、aは固有変数）"}
      </FormulaBlock>

      <p>
        この証明では、命題論理の規則（→I, →E）と述語論理の規則（∀I, ∀E）を組み合わせています。
        ステップ9で∀Iを適用していますが、aは前提1, 2には現れていないため、固有変数条件を満たします。
      </p>

      <ArgumentTree
        premises={["∀x (P(x) → Q(x))", "∀x (Q(x) → R(x))"]}
        conclusion="∀x (P(x) → R(x))"
        rule="∀E + →E + →I + ∀I"
        caption="仮言三段論法の述語論理版"
      />

      <SectionDivider />

      <h2>もう一つの証明例: ∃を含む推論</h2>

      <Callout variant="tip" label="証明例2">
        <p><strong>定理:</strong> ∀x (P(x) → Q(x)), ∃x P(x) ⊢ ∃x Q(x)</p>
        <p>（「PならばQ」がすべてのxで成り立ち、Pを満たすxが存在するなら、Qを満たすxも存在する）</p>
      </Callout>

      <FormulaBlock caption="証明">
        {"1. ∀x (P(x) → Q(x))   — 前提\n2. ∃x P(x)              — 前提\n3.   [P(a)]              — 仮定（∃Eのため、aは固有変数）\n4.   P(a) → Q(a)         — ∀E（1より）\n5.   Q(a)                — →E（3, 4より）\n6.   ∃x Q(x)             — ∃I（5より）\n7. ∃x Q(x)               — ∃E（2, 3-6より）"}
      </FormulaBlock>

      <p>
        ∃E の構造がよく分かる証明です。
        ステップ3でP(a)を仮定し、ステップ6で∃x Q(x)を導きます。
        結論にはaが含まれないため、ステップ7で∃Eを完了できます。
      </p>

      <KeyPoint>
        述語論理の証明では、命題論理の規則と量化子の規則を自由に組み合わせる。
        ∀E で全称命題を具体化し、∃I で具体例から存在命題を作り、
        ∀I で一般化し、∃E で存在命題から推論する。
      </KeyPoint>

      <InlineMiniQuiz
        question="証明 ∀x (P(x) → Q(x)), ∃x P(x) ⊢ ∃x Q(x) で、∃Eの仮定として正しいのは？"
        options={[
          "P(a)（aは固有変数で、他の前提に現れない）",
          "P(x)（xを自由変数のまま使う）",
          "∀x P(x)（全称に強める）",
          "Q(a)（結論の述語を仮定する）",
        ]}
        correctIndex={0}
        explanation="∃x P(x)から∃Eを行う際、固有変数aを導入してP(a)を仮定します。aは前提1には現れていない新しい変数です。∃Eの仮定は∃x P(x)のP(x)のxをaで置き換えたものです。"
      />

      <SectionDivider />

      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: ステップ式証明ビルダー</h2>
        <SteppedProofBuilder />
      </div>

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="09-natural-deduction-pred" />
    </div>
    </>
  )
}
