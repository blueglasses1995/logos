import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
  MotivationSection,
} from "@/components/content"
import {
  VennDiagram,
  ExampleMapping,
  InlineMiniQuiz,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第21章: 様相論理入門</h1>

      <MotivationSection
        icon="🌐"
        realWorldExample="「このシステムは必ずクラッシュしない」「データが破損する可能性がある」——ソフトウェア仕様書の必然性・可能性の表現は、様相論理そのもの。"
        nextChapterConnection="認識論理・義務論理への応用で、AIの知識表現や倫理的推論へ"
      />

      <h2>「必然的に」と「可能的に」</h2>

      <p>
        古典論理では、命題は「真」か「偽」のどちらかです。
        しかし日常的な推論では、それだけでは不十分な場面があります。
      </p>

      <ComparisonTable
        headers={["日常表現", "論理的な意味"]}
        rows={[
          ["「2+2は必ず4である」", "どのような状況でも真"],
          ["「明日雨が降るかもしれない」", "ある状況では真になりうる"],
          ["「三角形の内角の和は180度でなければならない」", "数学的に必然"],
          ["「宝くじに当たる可能性がある」", "少なくとも一つの状況で真"],
        ]}
      />

      <p>
        様相論理（modal logic）は、「必然的に（necessarily）」と「可能的に（possibly）」
        という2つの概念を形式的に扱うための論理体系です。
      </p>

      <Callout variant="definition" label="基本記号">
        <strong>□P</strong>（ボックスP）:「Pは必然的に真である」<br />
        <strong>◇P</strong>（ダイヤモンドP）:「Pは可能的に真である」
      </Callout>

      <FormulaBlock caption="日常語との対応">
        □P = 「必ずPである」「Pでなければならない」{"\n"}
        ◇P = 「Pかもしれない」「Pでありうる」
      </FormulaBlock>

      <ExampleMapping
        formula="□（水は100°Cで沸騰する）"
        example="どの可能世界でも物理法則が同じなら、水は必ず100°Cで沸騰する"
        variables={{ "□": "必然的に", "P": "水は100°Cで沸騰する" }}
      />

      <InlineMiniQuiz
        question="「このバグは直せるかもしれない」を様相記号で表すと？"
        options={["◇P", "□P", "¬□P", "□¬P"]}
        correctIndex={0}
        explanation="「かもしれない」は可能性を表すので◇Pです。□Pは「必ず直せる」になります。"
      />

      <KeyPoint>
        □（必然）と◇（可能）は、古典論理にない「真の強さの度合い」を表現する。
        日常言語の「必ず」「かもしれない」を形式化したものである。
      </KeyPoint>

      <SectionDivider />

      <h2>可能世界意味論</h2>

      <p>
        □Pや◇Pの正確な意味を定めるために、
        ソール・クリプキ（Saul Kripke）は1959年に<strong>可能世界意味論</strong>を提案しました。
        このアイデアは驚くほどシンプルです。
      </p>

      <Callout variant="definition" label="可能世界意味論の3要素">
        <strong>W</strong>: 可能世界の集合（考えられる状況の全体）<br />
        <strong>R</strong>: 到達可能性関係（世界間の「アクセス可能」関係）<br />
        <strong>V</strong>: 付値関数（各世界で各命題変数が真か偽かを決める）
      </Callout>

      <p>
        直感的には、「可能世界」とは「ありえた状況」のことです。
        現実の世界w₀だけでなく、「もし雨が降らなかったら」「もし自分が別の職業だったら」
        といった仮想的な状況も、それぞれ一つの「世界」として扱います。
      </p>

      <VennDiagram
        labelA="現実世界 w₀"
        labelB="可能世界 w₁, w₂"
        highlight={["a-only", "intersection", "b-only"]}
        caption="可能世界意味論: 世界間の到達可能性"
      />

      <p>
        到達可能性関係Rは、ある世界から別の世界が「見える」かどうかを決めます。
        世界w₀からw₁が到達可能とは、w₀にいる人が
        「w₁の状況はありえる」と認める、ということです。
      </p>

      <KeyPoint>
        可能世界意味論のキーアイデア: 必然性と可能性は、
        複数の「可能世界」の間の関係として定義される。
      </KeyPoint>

      <SectionDivider />

      <h2>クリプキフレーム</h2>

      <Callout variant="definition" label="定義">
        <strong>クリプキフレーム</strong>とは、対 (W, R) のことです。
        Wは空でない世界の集合、Rは W 上の二項関係（到達可能性関係）です。
        フレームに付値Vを加えたもの (W, R, V) を<strong>クリプキモデル</strong>と呼びます。
      </Callout>

      <p>
        クリプキフレームの構造は、関係Rの性質によって様々な論理体系に対応します。
        たとえば、Rが反射的（すべてのwについてwRw）なら、
        「必然的にPならば、実際にPである」（□P → P）が成り立ちます。
      </p>

      <FormulaBlock caption="クリプキモデルの表記">
        M = (W, R, V) において、世界wでの命題Pの真偽を M, w ⊨ P と書く
      </FormulaBlock>

      <SectionDivider />

      <h2>□Pと◇Pの正確な意味</h2>

      <Callout variant="definition" label="□Pの意味">
        M, w ⊨ □P ⟺ wから到達可能なすべての世界w'について M, w' ⊨ P
      </Callout>

      <p>
        つまり、□Pが世界wで真であるとは、
        wから「見える」あらゆる世界でPが真であることを意味します。
        一つでもPが偽の世界があれば、□Pは偽です。
      </p>

      <Callout variant="definition" label="◇Pの意味">
        M, w ⊨ ◇P ⟺ wから到達可能なある世界w'について M, w' ⊨ P
      </Callout>

      <p>
        ◇Pが世界wで真であるとは、
        wから「見える」世界の中に、Pが真であるものが少なくとも一つ存在することです。
      </p>

      <Callout variant="example" label="具体例">
        3つの世界 W = &#123;w₀, w₁, w₂&#125; を考える。<br />
        到達可能性: w₀Rw₁, w₀Rw₂<br />
        付値: V(P, w₁) = 真, V(P, w₂) = 偽<br />
        このとき w₀ で:<br />
        ・◇P は真（w₁でPが真だから）<br />
        ・□P は偽（w₂でPが偽だから）
      </Callout>

      <InlineMiniQuiz
        question="世界wから到達可能な世界が w₁ と w₂ の2つで、両方でPが真のとき、wにおける□Pの真偽は？"
        options={["真", "偽", "決定不能", "Pの内容による"]}
        correctIndex={0}
        explanation="□Pは到達可能な全ての世界でPが真のとき真です。w₁とw₂の両方でPが真なので、□Pも真です。"
      />

      <KeyPoint>
        □Pは「到達可能な全ての世界でP」、◇Pは「到達可能なある世界でP」。
        全称量化と存在量化の世界版と考えるとわかりやすい。
      </KeyPoint>

      <SectionDivider />

      <h2>□と◇の関係</h2>

      <p>
        □と◇は、全称量化子∀と存在量化子∃の関係に似ています。
        両者の間には、以下の重要な双対性が成り立ちます。
      </p>

      <FormulaBlock caption="□と◇の双対性">
        □P ⟺ ¬◇¬P{"\n"}
        ◇P ⟺ ¬□¬P
      </FormulaBlock>

      <p>
        「Pは必然的に真である」は「Pが偽である可能性はない」と同じです。
        「Pは可能的に真である」は「Pが偽であることは必然ではない」と同じです。
      </p>

      <ComparisonTable
        headers={["述語論理との対応", "様相論理"]}
        rows={[
          ["∀xP(x) ⟺ ¬∃x¬P(x)", "□P ⟺ ¬◇¬P"],
          ["∃xP(x) ⟺ ¬∀x¬P(x)", "◇P ⟺ ¬□¬P"],
          ["∀は「すべてのxについて」", "□は「すべての可能世界で」"],
          ["∃は「あるxについて」", "◇は「ある可能世界で」"],
        ]}
      />

      <Callout variant="warning" label="よくある誤解">
        □P → ◇P は直感的に正しく見えますが、
        到達可能な世界が一つも存在しない場合、□Pは空虚に真だが◇Pは偽になります。
        多くの公理系ではRの性質として反射性などを仮定し、この問題を回避します。
      </Callout>

      <InlineMiniQuiz
        question="¬◇¬P と同値なのは次のうちどれ？"
        options={["□P", "◇P", "□¬P", "¬□P"]}
        correctIndex={0}
        explanation="「Pが偽である可能性がない」（¬◇¬P）は「Pは必然的に真」（□P）と同じです。"
      />

      <SectionDivider />

      <h2>様相論理の公理系</h2>

      <p>
        到達可能性関係Rにどのような性質を仮定するかによって、
        異なる公理系（論理体系）が得られます。
        以下は代表的な4つの体系です。
      </p>

      <Callout variant="definition" label="公理K（分配公理）">
        □(P → Q) → (□P → □Q){"\n\n"}
        「Pが必然的にQを含意するなら、Pが必然的なときQも必然的」{"\n"}
        これはすべての正規様相論理の基本公理です。Rに特別な条件は不要。
      </Callout>

      <ComparisonTable
        headers={["公理系", "追加公理", "Rの性質", "直感的意味"]}
        rows={[
          ["K", "（なし）", "制約なし", "最小の正規様相論理"],
          ["T", "□P → P", "反射的", "必然なら実際に真"],
          ["S4", "□P → □□P", "反射的＋推移的", "必然は必然的に必然"],
          ["S5", "◇P → □◇P", "同値関係", "可能なら必然的に可能"],
        ]}
      />

      <Callout variant="example" label="各公理の直感">
        <strong>T (□P → P)</strong>: もし「2+2=4」が必然的に真なら、実際に2+2=4である。当然に思えるが、これはRが反射的（各世界が自分自身に到達可能）であることに依存する。{"\n\n"}
        <strong>S4 (□P → □□P)</strong>: もしPが必然的なら、「Pが必然的であること」もまた必然的。数学的真理にふさわしい性質。{"\n\n"}
        <strong>S5 (◇P → □◇P)</strong>: もしPが可能なら、「Pが可能であること」はどの世界から見ても成り立つ。形而上学的な必然性のモデル。
      </Callout>

      <ExampleMapping
        formula="□P → P"
        example="「数学的に証明された定理は、実際に成り立つ」"
        variables={{ "□P": "Pは証明済み（必然）", "P": "Pは実際に真" }}
      />

      <InlineMiniQuiz
        question="到達可能性関係Rが反射的かつ推移的であるとき、対応する公理系は？"
        options={["S4", "K", "T", "S5"]}
        correctIndex={0}
        explanation="反射的→公理T、推移的→□P→□□P。両方を合わせたものがS4です。"
      />

      <KeyPoint>
        様相論理の公理系は、到達可能性関係Rの性質と一対一に対応する。
        K（最小）→ T（反射的）→ S4（反射的＋推移的）→ S5（同値関係）と
        公理を追加するほど、Rへの制約が強くなり、より多くの定理が証明できる。
      </KeyPoint>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="18-modal-logic" />
    </div>
    </>
  )
}
