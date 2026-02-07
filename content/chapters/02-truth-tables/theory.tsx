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
  TruthValueAnimator,
  InlineMiniQuiz,
  LogicPuzzleChallenge,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第2章: 真理値表と恒真式</h1>

      <MotivationSection
        icon="📊"
        realWorldExample="バグの原因は論理条件の見落とし。真理値表で全パターンを網羅的にチェック。"
        nextChapterConnection="論証の妥当性で推論全体を評価"
      />

      <h2>真理値表とは</h2>

      <Callout variant="definition" label="定義">
        <strong>真理値表（truth table）</strong>は、命題の全ての可能な真偽の組み合わせに対して、
        複合命題の真偽値を体系的に列挙する表です。
        第1章で学んだ論理結合子の意味を正確に把握する基本ツールです。
      </Callout>

      <p>
        変数がn個あるとき、真理値表の行数は2<sup>n</sup>行になります。
        2変数なら4行、3変数なら8行です。
      </p>

      <h3>真理値表の構築手順</h3>

      <ol>
        <li>含まれる命題変数を列挙する（P, Q, R, ...）</li>
        <li>全ての真偽の組み合わせを行として並べる</li>
        <li>部分式ごとに列を追加し、最終的な複合命題の値を求める</li>
      </ol>

      <h3>例: ¬(P ∧ Q) の真理値表</h3>

      <table>
        <thead>
          <tr><th>P</th><th>Q</th><th>P ∧ Q</th><th>¬(P ∧ Q)</th></tr>
        </thead>
        <tbody>
          <tr><td>T</td><td>T</td><td>T</td><td>F</td></tr>
          <tr><td>T</td><td>F</td><td>F</td><td>T</td></tr>
          <tr><td>F</td><td>T</td><td>F</td><td>T</td></tr>
          <tr><td>F</td><td>F</td><td>F</td><td>T</td></tr>
        </tbody>
      </table>

      <KeyPoint>
        真理値表は全ての入力パターンを網羅的に検証する。
        変数n個に対して2<sup>n</sup>行が必要になる。
      </KeyPoint>

      <LogicSandbox
        variables={["P", "Q"]}
        formulas={[
          { label: "P ∧ Q", evaluate: (v) => v.P && v.Q },
          { label: "P ∨ Q", evaluate: (v) => v.P || v.Q },
          { label: "P → Q", evaluate: (v) => !v.P || v.Q },
        ]}
        caption="変数の値を切り替えて、各論理式の真理値の変化を確認しましょう"
      />

      <SectionDivider />

      <h2>恒真式（トートロジー）</h2>

      <Callout variant="definition" label="定義">
        <strong>恒真式（tautology）</strong>とは、命題変数にどのような真偽値を代入しても
        常に真になる論理式のことです。
      </Callout>

      <FormulaBlock caption="排中律（恒真式の例）">P ∨ ¬P</FormulaBlock>

      <p>
        排中律は「Pであるか、Pでないか」のどちらかは必ず成り立つことを示します。
        真理値表で確認すると、すべての行で結果が真になります。
      </p>

      <InlineMiniQuiz
        question="トートロジーとは何ですか？"
        options={["常に真になる論理式", "常に偽になる論理式", "真にも偽にもなる論理式", "変数を含まない論理式"]}
        correctIndex={0}
        explanation="トートロジーは変数の値に関係なく常に真になる論理式です。例: P ∨ ¬P"
      />

      <SectionDivider />

      <h2>矛盾式と充足可能式</h2>

      <Callout variant="definition" label="定義">
        <strong>矛盾式（contradiction）</strong>は、常に偽になる論理式です。
        <strong>充足可能式（contingency）</strong>は、真になる場合も偽になる場合もある論理式です。
      </Callout>

      <FormulaBlock caption="矛盾式の例">P ∧ ¬P</FormulaBlock>

      <p>
        多くの日常的な命題は充足可能式に該当します。
        恒真式と矛盾式は特殊なケースです。
      </p>

      <ComparisonTable
        headers={["恒真式（トートロジー）", "矛盾式"]}
        rows={[
          ["常に真", "常に偽"],
          ["例: P ∨ ¬P", "例: P ∧ ¬P"],
          ["真理値表の全行がT", "真理値表の全行がF"],
        ]}
      />

      <KeyPoint>
        論理式は「恒真式」「矛盾式」「充足可能式」の3種類に分類できる。
        真理値表の全行を確認することで判別が可能。
      </KeyPoint>

      <SectionDivider />

      <h2>重要な恒真式</h2>

      <h3>ド・モルガンの法則</h3>

      <FormulaBlock caption="ド・モルガンの法則">
        ¬(P ∧ Q) ≡ ¬P ∨ ¬Q{"\n"}
        ¬(P ∨ Q) ≡ ¬P ∧ ¬Q
      </FormulaBlock>

      <p>
        「PかつQでない」は「PでないまたはQでない」と同値です。
        「PまたはQでない」は「PでないかつQでない」と同値です。
      </p>

      <Callout variant="tip">
        プログラミングでは条件分岐の簡略化に頻繁に使います。
        例えば <code>!(a &amp;&amp; b)</code> は <code>!a || !b</code> と同値です。
      </Callout>

      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="¬(P ∧ Q) ↔ (¬P ∨ ¬Q)"
        evaluate={(v) => !(v.P && v.Q) === (!v.P || !v.Q)}
        caption="ド・モルガンの法則: どの値の組み合わせでも結果が同じことを確認しましょう"
      />

      <h3>二重否定除去</h3>

      <FormulaBlock caption="二重否定除去">¬¬P ≡ P</FormulaBlock>

      <p>否定の否定は元に戻ります。</p>

      <h3>対偶</h3>

      <FormulaBlock caption="対偶の法則">
        (P → Q) ≡ (¬Q → ¬P)
      </FormulaBlock>

      <p>
        「PならばQ」と「QでないならばPでない」は論理的に同値です。
        これは証明や議論で非常に強力なツールです。
      </p>

      <h3>含意の定義</h3>

      <FormulaBlock caption="含意の書き換え">
        (P → Q) ≡ (¬P ∨ Q)
      </FormulaBlock>

      <p>
        条件文は否定と論理和で表せます。
        直感に反するかもしれませんが、真理値表で確認できます。
      </p>

      <KeyPoint>
        ド・モルガンの法則、二重否定除去、対偶、含意の定義は論理学の基本変換規則。
        これらを使いこなすことで複雑な論理式を簡略化できる。
      </KeyPoint>

      <SectionDivider />
      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: 論理パズルチャレンジ</h2>
        <LogicPuzzleChallenge />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="02-truth-tables" />
    </div>
    </>
  )
}
