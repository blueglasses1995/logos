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
  ExampleMapping,
  InlineMiniQuiz,
  ArgumentWorkshop,
  LogicDebugger,
  ProofErrorDetector,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第3章: 論証の妥当性と健全性</h1>

      <MotivationSection
        icon="⚖️"
        realWorldExample="「この推論は正しいか？」はコードレビューの核心。妥当性の判定方法を学ぶ。"
        nextChapterConnection="述語論理でより精密な表現へ"
      />

      <h2>論証とは</h2>

      <Callout variant="definition" label="定義">
        <strong>論証（argument）</strong>とは、一つ以上の<strong>前提（premise）</strong>から
        <strong>結論（conclusion）</strong>を導く推論の構造です。
      </Callout>

      <blockquote>
        <p>前提1: すべての哺乳類は温血動物である</p>
        <p>前提2: クジラは哺乳類である</p>
        <p>結論: ゆえに、クジラは温血動物である</p>
      </blockquote>

      <KeyPoint>
        論証は「前提」と「結論」の組み合わせで構成される。
        前提から結論への推論が正しいかどうかを評価するのが論理学の中心的な課題。
      </KeyPoint>

      <SectionDivider />

      <h2>妥当性（Validity）</h2>

      <Callout variant="definition" label="定義">
        論証が<strong>妥当（valid）</strong>であるとは、前提がすべて真であると仮定した場合に
        結論が必ず真になることです。
        つまり「前提が真で結論が偽」という組み合わせが不可能であることです。
      </Callout>

      <p>
        重要なのは、妥当性は論証の<strong>形式</strong>についての性質だという点です。
        前提や結論の内容が実際に真かどうかは問いません。
      </p>

      <blockquote>
        <p>前提1: すべての魚は空を飛べる（偽）</p>
        <p>前提2: サメは魚である（真）</p>
        <p>結論: ゆえに、サメは空を飛べる（偽）</p>
      </blockquote>

      <p>
        この論証は前提1が偽ですが、形式としては妥当です。
        「前提がすべて真なら結論も真」という条件を満たしています。
        前提がすべて真になることがないため、空真として成立します。
      </p>

      <Callout variant="warning" label="よくある誤解">
        「妥当な論証の結論は必ず真」ではありません。
        妥当性が保証するのは「前提が真なら結論も真」という形式的な関係だけです。
        前提が偽であれば、結論の真偽は問われません。
      </Callout>

      <SectionDivider />

      <h2>健全性（Soundness）</h2>

      <Callout variant="definition" label="定義">
        論証が<strong>健全（sound）</strong>であるとは、
        (1) 論証が妥当であり、かつ (2) すべての前提が実際に真であることです。
        健全な論証の結論は必ず真です。
      </Callout>

      <ComparisonTable
        headers={["妥当（valid）", "健全（sound）"]}
        rows={[
          ["形式が正しい", "形式が正しい＋前提が真"],
          ["前提の真偽は問わない", "すべての前提が実際に真"],
          ["結論が偽でもあり得る", "結論は必ず真"],
        ]}
      />

      <KeyPoint>
        健全性 = 妥当性 + 前提がすべて真。
        健全な論証だけが「確実に正しい結論」を保証する。
      </KeyPoint>

      <ExampleMapping
        formula="前提が真 ∧ 妥当 → 結論が真"
        example="論証が健全であれば、結論は必ず真"
        variables={{ "前提が真": "前提の内容が事実", "妥当": "論理構造が正しい", "結論が真": "結論も事実" }}
        caption="健全性の条件"
      />

      <SectionDivider />

      <h2>主要な推論規則</h2>

      <h3>モーダスポネンス（肯定式）</h3>

      <FormulaBlock caption="モーダスポネンス">P → Q, P ∴ Q</FormulaBlock>

      <p>
        「PならばQ」が成り立ち、Pが真なら、Qも真です。
        最も基本的で直感的な推論規則です。
      </p>

      <ArgumentTree
        premises={["P → Q", "P"]}
        conclusion="Q"
        rule="モーダスポネンス"
        caption="前提から結論への推論構造"
      />

      <h3>モーダストレンス（否定式）</h3>

      <FormulaBlock caption="モーダストレンス">P → Q, ¬Q ∴ ¬P</FormulaBlock>

      <p>
        「PならばQ」が成り立ち、Qが偽なら、Pも偽です。
        対偶の応用として理解できます。
      </p>

      <ArgumentTree
        premises={["P → Q", "¬Q"]}
        conclusion="¬P"
        rule="モーダストレンス"
        caption="否定式による推論構造"
      />

      <h3>仮言三段論法</h3>

      <FormulaBlock caption="仮言三段論法">P → Q, Q → R ∴ P → R</FormulaBlock>

      <p>
        条件文を連鎖させることで、新しい条件文を導けます。
        「AならばB、BならばC、ゆえにAならばC」という推論です。
      </p>

      <h3>選言三段論法</h3>

      <FormulaBlock caption="選言三段論法">P ∨ Q, ¬P ∴ Q</FormulaBlock>

      <p>
        「PまたはQ」が成り立ち、Pが偽なら、Qが真です。
        消去法として日常的にも使われる推論パターンです。
      </p>

      <KeyPoint>
        4つの基本推論規則（モーダスポネンス、モーダストレンス、仮言三段論法、選言三段論法）は
        妥当な論証の典型的パターン。これらを組み合わせて複雑な推論を構築できる。
      </KeyPoint>

      <SectionDivider />

      <h2>反例による妥当性の否定</h2>

      <p>
        論証が妥当でないことを示すには、
        <strong>前提がすべて真で結論が偽</strong>になる具体例（反例）を一つ見つければ十分です。
      </p>

      <FormulaBlock caption="後件肯定の誤謬（妥当でない推論）">
        P → Q, Q ∴ P
      </FormulaBlock>

      <p>
        反例: P = 偽, Q = 真のとき、P → Qは真、Qは真ですが、Pは偽です。
        これにより「前提が真で結論が偽」が成立するため、この推論形式は妥当ではありません。
      </p>

      <Callout variant="warning" label="よくある誤解">
        「P → Q かつ Q が真」から「P が真」とは結論できません。
        これは<strong>後件肯定の誤謬（affirming the consequent）</strong>と呼ばれる典型的な誤りです。
        「雨が降れば地面が濡れる。地面が濡れている。ゆえに雨が降った。」は妥当ではありません。
      </Callout>

      <KeyPoint>
        妥当でない論証を証明するには反例が一つあれば十分。
        「前提すべて真かつ結論偽」のケースを探すのが基本戦略。
      </KeyPoint>

      <InlineMiniQuiz
        question="妥当だが健全ではない論証の例はどれ？"
        options={["前提が偽だが論理構造は正しい", "前提が真だが論理が飛躍している", "結論が真で前提も真", "前提も結論も偽"]}
        correctIndex={0}
        explanation="妥当性は論理構造の正しさ、健全性は前提の真実性も要求します。前提が偽でも論理が正しければ妥当です。"
      />

      <SectionDivider />
      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: 論証ワークショップ</h2>
        <ArgumentWorkshop />
      </div>

      <SectionDivider />
      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: ロジックデバッガー</h2>
        <LogicDebugger />
      </div>

      <SectionDivider />
      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: 証明エラー検出</h2>
        <ProofErrorDetector />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="03-validity" />
    </div>
    </>
  )
}
