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
      <h1>第4章: 自然演繹（命題論理）</h1>

      <MotivationSection
        icon="🔗"
        realWorldExample="真理値表では「正しい」とわかっても、なぜ正しいかを説明できない。自然演繹は推論の各ステップを明示する証明技法。"
        nextChapterConnection="意味論と完全性で「証明」と「真理」の関係を解明"
      />

      <h2>形式的証明とは何か</h2>

      <p>
        これまで真理値表を使って論理式の性質を調べてきました。
        真理値表は全ての真偽の組み合わせを列挙するため、
        命題変数が増えると行数が指数的に増加します。
        3変数で8行、10変数で1024行にもなります。
      </p>

      <p>
        <strong>自然演繹（natural deduction）</strong>は、
        真理値表に頼らず、推論規則の連鎖として証明を構築する方法です。
        ゲルハルト・ゲンツェンが1934年に導入したこの体系は、
        人間が実際に行う推論のパターンを形式化したものです。
      </p>

      <Callout variant="definition" label="定義">
        <strong>形式的証明（formal proof）</strong>とは、
        前提から出発し、各ステップで明示的な推論規則を適用して
        結論に到達する有限の推論列のことです。
        各ステップには根拠（使用した規則と参照する行）が明記されます。
      </Callout>

      <p>
        形式的証明の利点は、各ステップが機械的に検証可能であることです。
        真理値表が「結果」を示すのに対し、証明は「なぜそうなるか」を示します。
      </p>

      <ComparisonTable
        headers={["真理値表", "自然演繹"]}
        rows={[
          ["全パターンを列挙", "推論規則を連鎖"],
          ["変数が増えると爆発的に増大", "変数の数に依存しない"],
          ["「正しいか」を判定", "「なぜ正しいか」を説明"],
          ["機械的だが洞察がない", "推論の構造を明示"],
        ]}
      />

      <KeyPoint>
        自然演繹は、推論規則を一つずつ適用して結論に至る証明方法。
        真理値表と違い、推論の「理由」を明示的に示すことができる。
      </KeyPoint>

      <SectionDivider />

      <h2>導入規則と除去規則</h2>

      <p>
        自然演繹の規則は、各論理結合子に対して
        <strong>導入規則（introduction rule）</strong>と
        <strong>除去規則（elimination rule）</strong>の対で構成されます。
        導入規則はその結合子を含む式を新たに作る規則、
        除去規則はその結合子を含む式から情報を取り出す規則です。
      </p>

      <Callout variant="tip" label="直感的な理解">
        導入規則は「箱に入れる」操作、除去規則は「箱から出す」操作と考えられます。
        例えば「P」と「Q」を「P ∧ Q」という箱に入れるのが ∧I（連言導入）、
        「P ∧ Q」の箱から「P」を取り出すのが ∧E（連言除去）です。
      </Callout>

      <h3>連言（∧）の規則</h3>

      <FormulaBlock caption="連言導入 (∧I)">
        P{"\n"}
        Q{"\n"}
        ────{"\n"}
        P ∧ Q
      </FormulaBlock>

      <p>
        PとQがそれぞれ証明されていれば、P ∧ Q を導けます。
      </p>

      <FormulaBlock caption="連言除去 (∧E)">
        P ∧ Q{"\n"}
        ────{"\n"}
        P（左除去）  Q（右除去）
      </FormulaBlock>

      <p>
        P ∧ Q が証明されていれば、PまたはQを個別に取り出せます。
      </p>

      <ArgumentTree
        premises={["P ∧ Q"]}
        conclusion="P"
        rule="∧E（連言除去・左）"
        caption="連言除去: P ∧ Q から P を取り出す"
      />

      <h3>選言（∨）の規則</h3>

      <FormulaBlock caption="選言導入 (∨I)">
        P{"\n"}
        ────{"\n"}
        P ∨ Q（左導入）  Q ∨ P（右導入）
      </FormulaBlock>

      <p>
        Pが証明されていれば、任意のQに対して P ∨ Q を導けます。
        「少なくとも一方が真」を主張するのに、一方が真であれば十分です。
      </p>

      <FormulaBlock caption="選言除去 (∨E)">
        P ∨ Q{"\n"}
        P → R（Pを仮定してRを導く）{"\n"}
        Q → R（Qを仮定してRを導く）{"\n"}
        ────{"\n"}
        R
      </FormulaBlock>

      <p>
        P ∨ Q が成り立つとき、「Pの場合もQの場合もRが導ける」ことを示せば、
        Rが成り立つと結論できます。
        場合分けの推論に対応します。
      </p>

      <Callout variant="warning" label="よくある間違い">
        ∨E では、PからRを導く場合分けとQからRを導く場合分けの
        <strong>両方</strong>が必要です。片方だけでは証明になりません。
      </Callout>

      <h3>含意（→）の規則</h3>

      <FormulaBlock caption="条件付き証明 / 含意導入 (→I)">
        [P を仮定]{"\n"}
        ⋮{"\n"}
        Q を導く{"\n"}
        ────{"\n"}
        P → Q（仮定Pを解除）
      </FormulaBlock>

      <p>
        Pを仮定して（一時的に前提に加えて）Qが導けることを示せば、
        P → Q が証明されます。
        このとき仮定Pは「解除」され、最終的な証明ではPに依存しなくなります。
        これを<strong>条件付き証明（Conditional Proof, CP）</strong>と呼びます。
      </p>

      <FormulaBlock caption="含意除去 / モーダスポネンス (→E / MP)">
        P → Q{"\n"}
        P{"\n"}
        ────{"\n"}
        Q
      </FormulaBlock>

      <p>
        P → Q とPが証明されていれば、Qを導けます。
        第3章で学んだモーダスポネンスそのものです。
      </p>

      <ArgumentTree
        premises={["P → Q", "P"]}
        conclusion="Q"
        rule="→E（モーダスポネンス）"
        caption="含意除去: 最も基本的な推論規則"
      />

      <InlineMiniQuiz
        question="P ∧ Q から Q ∧ P を導くために必要な規則の組み合わせはどれですか？"
        options={[
          "∧E（2回）と ∧I",
          "→E と ∧I",
          "∨I と ∧E",
          "→I と ∨E"
        ]}
        correctIndex={0}
        explanation="P ∧ Q から ∧E で P と Q をそれぞれ取り出し、∧I で Q ∧ P として組み立て直します。"
      />

      <SectionDivider />

      <h2>否定の規則と背理法</h2>

      <h3>否定導入 (¬I) / 背理法</h3>

      <FormulaBlock caption="否定導入 (¬I)">
        [P を仮定]{"\n"}
        ⋮{"\n"}
        矛盾（⊥）を導く{"\n"}
        ────{"\n"}
        ¬P（仮定Pを解除）
      </FormulaBlock>

      <p>
        Pを仮定すると矛盾が生じることを示せば、¬Pが証明されます。
        これは<strong>背理法（Proof by Contradiction）</strong>の形式化です。
        矛盾とは、ある命題Aと¬Aの両方が同時に成り立つ状態（A ∧ ¬A、すなわち ⊥）です。
      </p>

      <Callout variant="tip" label="背理法の直感">
        「もしPが真だとしたら、おかしなこと（矛盾）が起きる。
        だからPは真ではない（¬P）」という推論パターンです。
        数学の「背理法による証明」と同じ発想です。
      </Callout>

      <h3>否定除去 / 二重否定除去 (¬E / DNE)</h3>

      <FormulaBlock caption="二重否定除去 (¬E)">
        ¬¬P{"\n"}
        ────{"\n"}
        P
      </FormulaBlock>

      <p>
        二重否定を取り除く規則です。
        「Pでないことはない」ならば「Pである」と結論できます。
      </p>

      <h3>帰謬法 (RAA: Reductio ad Absurdum)</h3>

      <FormulaBlock caption="帰謬法 (RAA)">
        [¬P を仮定]{"\n"}
        ⋮{"\n"}
        矛盾（⊥）を導く{"\n"}
        ────{"\n"}
        P（仮定¬Pを解除）
      </FormulaBlock>

      <p>
        ¬Pを仮定して矛盾を導けば、Pが証明されます。
        ¬I が「¬Pを証明する方法」であるのに対し、
        RAA は「Pを証明する方法」です。
        両者は対称的な関係にあります。
      </p>

      <ComparisonTable
        headers={["¬I（否定導入）", "RAA（帰謬法）"]}
        rows={[
          ["P を仮定", "¬P を仮定"],
          ["矛盾（⊥）を導く", "矛盾（⊥）を導く"],
          ["結論: ¬P", "結論: P"],
        ]}
      />

      <Callout variant="warning" label="古典論理と直観主義論理">
        二重否定除去（¬E）と帰謬法（RAA）は古典論理では認められますが、
        直観主義論理では認められません。
        直観主義論理では「¬Pでないこと」と「Pであること」は区別されます。
        この違いは後の章で詳しく扱います。
      </Callout>

      <KeyPoint>
        否定の規則は「仮定して矛盾を導く」パターンに基づく。
        ¬I は P の仮定から矛盾を導いて ¬P を証明し、
        RAA は ¬P の仮定から矛盾を導いて P を証明する。
      </KeyPoint>

      <SectionDivider />

      <h2>仮定の導入と解除（サブ証明）</h2>

      <p>
        自然演繹の最も特徴的な概念は<strong>仮定のスコープ</strong>です。
        →I、¬I、RAA では一時的な仮定を導入します。
        この仮定は証明の一部（サブ証明）の中でのみ有効で、
        規則の適用によって「解除」されます。
      </p>

      <Callout variant="definition" label="定義">
        <strong>サブ証明（subproof）</strong>とは、
        一時的な仮定のもとで行われる証明の部分構造です。
        サブ証明内で導かれた結論は、サブ証明の外では直接使用できません。
        ただし、規則（→I、¬I、RAA）を通じて仮定を解除した結果は使用できます。
      </Callout>

      <FormulaBlock caption="サブ証明の構造">
        1. A          前提{"\n"}
        2. | B        仮定（サブ証明開始）{"\n"}
        3. | ...      推論{"\n"}
        4. | C        サブ証明内の結論{"\n"}
        5. B → C      →I, 2-4（仮定Bを解除）
      </FormulaBlock>

      <p>
        縦線 "|" で囲まれた部分がサブ証明です。
        行2で仮定Bを導入し、行4でCを導き、
        行5で →I を適用して B → C を得ます。
        行5の時点で仮定Bは解除されています。
      </p>

      <Callout variant="warning" label="よくある間違い">
        サブ証明内の行をサブ証明の外で参照してはいけません。
        例えば、行4のCをサブ証明の外で直接使用するのは誤りです。
        仮定Bに依存するCは、Bが仮定されていない場所では無効です。
      </Callout>

      <InlineMiniQuiz
        question="→I（条件付き証明）を適用するとき、何が起こりますか？"
        options={[
          "仮定が解除され、条件文が導かれる",
          "新しい仮定が追加される",
          "前提が削除される",
          "結論が否定される"
        ]}
        correctIndex={0}
        explanation="→I では、サブ証明で仮定した P から Q を導いた後、仮定 P を解除して P → Q を得ます。"
      />

      <SectionDivider />

      <h2>完全な証明の例</h2>

      <h3>例1: P ∧ Q → Q ∧ P（連言の交換律）</h3>

      <FormulaBlock caption="証明: P ∧ Q → Q ∧ P">
        1. | P ∧ Q      仮定{"\n"}
        2. | P           ∧E 左, 1{"\n"}
        3. | Q           ∧E 右, 1{"\n"}
        4. | Q ∧ P       ∧I, 3, 2{"\n"}
        5. P ∧ Q → Q ∧ P  →I, 1-4
      </FormulaBlock>

      <p>
        P ∧ Q を仮定し、∧E で P と Q を取り出し、
        ∧I で順序を入れ替えて Q ∧ P を作り、
        →I で仮定を解除します。前提なしの定理です。
      </p>

      <ArgumentTree
        premises={["P ∧ Q（仮定）"]}
        conclusion="Q ∧ P"
        rule="∧E + ∧I"
        caption="連言の交換律の証明構造"
      />

      <h3>例2: P → Q, Q → R ⊢ P → R（仮言三段論法）</h3>

      <FormulaBlock caption="証明: P → Q, Q → R ⊢ P → R">
        1. P → Q          前提{"\n"}
        2. Q → R          前提{"\n"}
        3. | P             仮定{"\n"}
        4. | Q             →E, 1, 3{"\n"}
        5. | R             →E, 2, 4{"\n"}
        6. P → R           →I, 3-5
      </FormulaBlock>

      <p>
        Pを仮定し、前提1の P → Q に →E を適用して Q を得て、
        前提2の Q → R に →E を適用して R を得ます。
        →I で仮定Pを解除し、P → R が証明されます。
      </p>

      <h3>例3: P → Q, ¬Q ⊢ ¬P（モーダストレンス）</h3>

      <FormulaBlock caption="証明: P → Q, ¬Q ⊢ ¬P">
        1. P → Q          前提{"\n"}
        2. ¬Q              前提{"\n"}
        3. | P             仮定{"\n"}
        4. | Q             →E, 1, 3{"\n"}
        5. | ⊥             矛盾, 4, 2（QとQ）{"\n"}
        6. ¬P              ¬I, 3-5
      </FormulaBlock>

      <p>
        Pを仮定すると、→E で Q が導かれますが、
        前提2の ¬Q と矛盾します。
        この矛盾から ¬I を適用して ¬P を得ます。
        モーダストレンスが自然演繹で「導出可能」であることが示されました。
      </p>

      <h3>例4: ¬(P ∧ Q), P ⊢ ¬Q</h3>

      <FormulaBlock caption="証明: ¬(P ∧ Q), P ⊢ ¬Q">
        1. ¬(P ∧ Q)       前提{"\n"}
        2. P               前提{"\n"}
        3. | Q             仮定{"\n"}
        4. | P ∧ Q         ∧I, 2, 3{"\n"}
        5. | ⊥             矛盾, 4, 1{"\n"}
        6. ¬Q              ¬I, 3-5
      </FormulaBlock>

      <p>
        Qを仮定すると、前提2のPと合わせて P ∧ Q が作れますが、
        これは前提1の ¬(P ∧ Q) と矛盾します。
        よって ¬I により ¬Q が導かれます。
      </p>

      <KeyPoint>
        自然演繹の証明は、前提と仮定から規則を適用して結論に至る段階的なプロセス。
        サブ証明（仮定の導入と解除）を使いこなすことが鍵となる。
      </KeyPoint>

      <InlineMiniQuiz
        question="P → Q, Q → R から P → R を証明するとき、最初に行うべき操作は？"
        options={[
          "P を仮定してサブ証明を開始する",
          "前提 P → Q に ∧E を適用する",
          "¬R を仮定して背理法を始める",
          "P ∨ Q に ∨E を適用する"
        ]}
        correctIndex={0}
        explanation="P → R という条件文を証明するには、→I を使うため、まず P を仮定してサブ証明を開始します。"
      />

      <SectionDivider />

      <h2>推論規則の一覧</h2>

      <FormulaBlock caption="推論規則の一覧">
        ∧I:  P, Q → P ∧ Q（連言導入）{"\n"}
        ∧E:  P ∧ Q → P / Q（連言除去）{"\n"}
        ∨I:  P → P ∨ Q（選言導入）{"\n"}
        ∨E:  P ∨ Q, P→R, Q→R → R（選言除去）{"\n"}
        →I:  [P] ... Q → P → Q（条件付き証明）{"\n"}
        →E:  P → Q, P → Q（モーダスポネンス）{"\n"}
        ¬I:  [P] ... ⊥ → ¬P（背理法）{"\n"}
        ¬E:  ¬¬P → P（二重否定除去）{"\n"}
        RAA: [¬P] ... ⊥ → P（帰謬法）
      </FormulaBlock>

      <ComparisonTable
        headers={["導入規則", "除去規則"]}
        rows={[
          ["∧I: P, Q から P ∧ Q", "∧E: P ∧ Q から P / Q"],
          ["∨I: P から P ∨ Q", "∨E: P ∨ Q と場合分けから R"],
          ["→I: [P]...Q から P → Q", "→E: P → Q, P から Q"],
          ["¬I: [P]...⊥ から ¬P", "¬E: ¬¬P から P"],
        ]}
      />

      <SectionDivider />

      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: ステップ式証明ビルダー</h2>
        <SteppedProofBuilder />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="07-natural-deduction-prop" />
    </div>
    </>
  )
}
