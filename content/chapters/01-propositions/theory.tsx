import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
  MotivationSection,
} from "@/components/content"
import {
  TruthValueAnimator,
  ExampleMapping,
  InlineMiniQuiz,
  FormalMethodsPlayground,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第1章: 命題と論理結合子</h1>

      <MotivationSection
        icon="💡"
        realWorldExample="プログラミングの条件分岐は命題論理そのもの。if文を書くたびに論理結合子を使っている。"
        nextChapterConnection="真理値表で体系的に分析"
      />

      <h2>命題とは何か</h2>

      <Callout variant="definition" label="定義">
        <strong>命題（proposition）</strong>とは、真か偽のいずれか一方の値を持つ文のことです。
        曖昧さを含まず、明確に真偽を判定できる文だけが命題です。
      </Callout>

      <ComparisonTable
        headers={["命題である", "命題ではない"]}
        rows={[
          ["「東京は日本の首都である」（真）", "「今日は良い天気ですね」（真偽が不確定）"],
          ["「2 + 3 = 6」（偽）", "「ドアを閉めてください」（命令文）"],
        ]}
      />

      <KeyPoint>
        命題とは「真または偽のどちらか一方に確定する文」のこと。
        感想・命令・疑問文は命題ではない。
      </KeyPoint>

      <SectionDivider />

      <h2>論理結合子（Logical Connectives）</h2>

      <p>
        複数の命題を組み合わせるための記号を<strong>論理結合子</strong>と呼びます。
        ここでは5つの基本的な結合子を学びます。
      </p>

      <h3>否定（NOT）</h3>

      <FormulaBlock caption="否定の記法">¬P</FormulaBlock>

      <p>
        命題Pの真偽を反転させます。
        Pが真なら¬Pは偽、Pが偽なら¬Pは真です。
      </p>

      <h3>論理積（AND）</h3>

      <FormulaBlock caption="論理積の記法">P ∧ Q</FormulaBlock>

      <p>
        PとQの<strong>両方が真</strong>のときだけ真になります。
        日常語では「PかつQ」「PでありQ」に対応します。
      </p>

      <h3>論理和（OR）</h3>

      <FormulaBlock caption="論理和の記法">P ∨ Q</FormulaBlock>

      <p>
        PとQの<strong>少なくとも一方が真</strong>なら真になります。
      </p>

      <Callout variant="warning" label="よくある誤解">
        論理学のORは「包含的OR（inclusive or）」です。
        PとQの両方が真でも結果は真になります。
        日常語の「または」は排他的に使われることが多いため、混同に注意してください。
      </Callout>

      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(v) => v.P && v.Q}
        caption="P と Q の値を切り替えて、論理積の動作を確認しましょう"
      />

      <h3>条件文（IF-THEN）</h3>

      <FormulaBlock caption="条件文の記法">P → Q</FormulaBlock>

      <p>
        「PならばQ」を表します。
        <strong>Pが真でQが偽のときだけ偽</strong>になります。
      </p>

      <ExampleMapping
        formula="P → Q"
        example="雨が降る → 傘を持つ"
        variables={{ P: "雨が降る", Q: "傘を持つ" }}
      />

      <Callout variant="warning" label="よくある誤解">
        Pが偽のとき、P → Qは常に真です。
        これを<strong>空真（vacuous truth）</strong>と呼びます。
        直感に反しますが、「前提が成り立たないなら約束は破られない」と考えると理解しやすくなります。
      </Callout>

      <InlineMiniQuiz
        question="P → Q が偽になるのはどのような場合？"
        options={["P真かつQ偽", "P偽かつQ真", "両方偽", "両方真"]}
        correctIndex={0}
        explanation="条件文は前件が真で後件が偽のときのみ偽になります。"
      />

      <h3>双条件文（IFF）</h3>

      <FormulaBlock caption="双条件文の記法">P ↔ Q</FormulaBlock>

      <p>
        「PならばQであり、かつQならばP」を表します。
        PとQの真偽が<strong>一致するとき</strong>に真になります。
      </p>

      <KeyPoint>
        5つの論理結合子（¬, ∧, ∨, →, ↔）を使い、単純な命題から複雑な複合命題を構築できる。
        それぞれの真偽条件を正確に覚えることが論理学の基礎となる。
      </KeyPoint>

      <SectionDivider />
      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: 形式手法プレイグラウンド</h2>
        <FormalMethodsPlayground />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="01-propositions" />
    </div>
    </>
  )
}
