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
      <h1>第15章: 関係</h1>

      <MotivationSection
        icon="🔗"
        realWorldExample="データベースのテーブル間の外部キー、SNSのフォロー関係、ファイルシステムの親子構造——すべて「関係」で記述できる。"
        nextChapterConnection="関数は特殊な関係。関数の性質を理解する準備"
      />

      <h2>二項関係の定義</h2>

      <Callout variant="definition" label="定義">
        集合 A から集合 B への<strong>二項関係（binary relation）</strong>R とは、
        直積 A × B の部分集合です。(a, b) ∈ R のとき、a と b は関係 R にある（<code>aRb</code>）といいます。
      </Callout>

      <FormulaBlock caption="二項関係の定義">
        R ⊆ A × B　　　aRb ⟺ (a, b) ∈ R
      </FormulaBlock>

      <ExampleMapping
        formula="R ⊆ A × B"
        example="「xはyの倍数」: R = {(4,2), (6,3), (9,3), ...} ⊆ ℕ × ℕ"
        variables={{ A: "ℕ（自然数）", B: "ℕ（自然数）", R: "倍数関係" }}
        caption="二項関係の具体例"
      />

      <p>
        特に A = B のとき、つまり同じ集合上の関係を<strong>A上の関係</strong>と呼びます。
        多くの重要な関係（等号、順序、同値など）はこの形式です。
      </p>

      <KeyPoint>
        関係は「順序対の集合」として形式化される。
        2つの要素の間に何らかのつながりがあるかどうかを厳密に定義できる。
      </KeyPoint>

      <SectionDivider />

      <h2>関係の性質</h2>

      <h3>反射性（Reflexivity）</h3>

      <FormulaBlock caption="反射性">
        ∀a ∈ A: aRa
      </FormulaBlock>

      <p>
        すべての要素が自分自身と関係を持つ性質です。
        例: 「≤」は反射的（a ≤ a は常に成り立つ）。
        「＜」は反射的でない（a ＜ a は成り立たない）。
      </p>

      <h3>対称性（Symmetry）</h3>

      <FormulaBlock caption="対称性">
        ∀a, b ∈ A: aRb → bRa
      </FormulaBlock>

      <p>
        a から b への関係があれば、b から a への関係もある性質です。
        例: 「=」は対称的。「友達関係」（SNSの相互フォロー）は対称的。
      </p>

      <h3>反対称性（Antisymmetry）</h3>

      <FormulaBlock caption="反対称性">
        ∀a, b ∈ A: (aRb ∧ bRa) → a = b
      </FormulaBlock>

      <p>
        互いに関係があるなら同じ要素である性質です。
        例: 「≤」は反対称的（a ≤ b かつ b ≤ a ならば a = b）。
      </p>

      <Callout variant="warning" label="よくある誤解">
        「対称的でない」と「反対称的」は異なる概念です。
        対称的でないとは「aRb → bRa が常に成り立つとは限らない」こと。
        反対称的とは「aRb ∧ bRa → a = b」という積極的な条件です。
        関係は対称的でも反対称的でもないことがあります。
      </Callout>

      <h3>推移性（Transitivity）</h3>

      <FormulaBlock caption="推移性">
        ∀a, b, c ∈ A: (aRb ∧ bRc) → aRc
      </FormulaBlock>

      <p>
        関係が「連鎖」する性質です。
        例: 「＜」は推移的（a ＜ b かつ b ＜ c ならば a ＜ c）。
      </p>

      <ComparisonTable
        headers={["関係", "反射性", "対称性", "反対称性", "推移性"]}
        rows={[
          ["= (等号)", "○", "○", "○", "○"],
          ["≤ (以下)", "○", "×", "○", "○"],
          ["< (未満)", "×", "×", "○", "○"],
          ["≠ (不等号)", "×", "○", "×", "×"],
          ["⊆ (部分集合)", "○", "×", "○", "○"],
        ]}
      />

      <InlineMiniQuiz
        question="「a は b の兄弟である」（自分自身は含まない）という関係は、どの性質を持ちますか？"
        options={["対称的かつ推移的だが反射的でない", "反射的かつ対称的かつ推移的", "対称的だが推移的でも反射的でもない", "反射的かつ推移的だが対称的でない"]}
        correctIndex={0}
        explanation="兄弟関係は対称的（aがbの兄弟ならbもaの兄弟）で推移的（aとbが兄弟、bとcが兄弟ならaとcも兄弟）ですが、自分自身の兄弟ではないので反射的ではありません。"
      />

      <SectionDivider />

      <h2>同値関係と同値類</h2>

      <Callout variant="definition" label="定義">
        集合 A 上の関係 R が<strong>同値関係（equivalence relation）</strong>であるとは、
        R が反射的、対称的、かつ推移的であることです。
        同値関係を <code>∼</code> で表すことが多い。
      </Callout>

      <FormulaBlock caption="同値関係の3条件">
        反射性: a ∼ a　　対称性: a ∼ b → b ∼ a　　推移性: (a ∼ b ∧ b ∼ c) → a ∼ c
      </FormulaBlock>

      <Callout variant="definition" label="定義">
        要素 a の<strong>同値類（equivalence class）</strong>とは、
        a と同値な要素の集合です: [a] = {'{'}x ∈ A | x ∼ a{'}'}。
        同値類全体の集合 A/∼ を<strong>商集合（quotient set）</strong>と呼びます。
      </Callout>

      <ExampleMapping
        formula="[a] = {x ∈ A | x ∼ a}"
        example="整数の mod 3 同値類: [0] = {..., -3, 0, 3, 6, ...}, [1] = {..., -2, 1, 4, 7, ...}"
        variables={{ A: "ℤ（整数）", "∼": "mod 3 で合同" }}
        caption="同値類の具体例"
      />

      <Callout variant="example" label="プログラミングの例">
        ハッシュ関数は同値関係を定義します。
        同じハッシュ値を持つオブジェクトは「同値」であり、
        ハッシュバケットは同値類に対応します。
      </Callout>

      <KeyPoint>
        同値関係は集合を互いに排他的なグループ（同値類）に分割する。
        これは分類やカテゴリ分けの数学的基盤である。
      </KeyPoint>

      <VennDiagram
        labelA="[0]₃"
        labelB="[1]₃"
        highlight={["a-only", "b-only"]}
        formulaLabel="同値類は互いに素"
        caption="mod 3 の同値類は重なりを持たない"
      />

      <SectionDivider />

      <h2>順序関係</h2>

      <h3>半順序（Partial Order）</h3>

      <Callout variant="definition" label="定義">
        集合 A 上の関係 ≤ が<strong>半順序（partial order）</strong>であるとは、
        反射的、反対称的、かつ推移的であることです。
        半順序集合 (A, ≤) を<strong>poset</strong>と呼びます。
      </Callout>

      <FormulaBlock caption="半順序の3条件">
        反射性: a ≤ a　　反対称性: (a ≤ b ∧ b ≤ a) → a = b　　推移性: (a ≤ b ∧ b ≤ c) → a ≤ c
      </FormulaBlock>

      <h3>全順序（Total Order）</h3>

      <Callout variant="definition" label="定義">
        半順序 ≤ が<strong>全順序（total order）</strong>であるとは、
        任意の2要素が比較可能であること、つまり ∀a, b ∈ A: a ≤ b ∨ b ≤ a が成り立つことです。
      </Callout>

      <ComparisonTable
        headers={["半順序", "全順序"]}
        rows={[
          ["反射的 + 反対称的 + 推移的", "半順序 + 全比較可能"],
          ["比較不能な要素対がありえる", "任意の2要素が比較可能"],
          ["例: 集合の包含関係 ⊆", "例: 自然数の ≤"],
          ["ハッセ図で複数の枝", "ハッセ図は一直線"],
        ]}
      />

      <InlineMiniQuiz
        question="集合 {1, 2, 3} のべき集合上の包含関係 ⊆ は全順序ですか？"
        options={["いいえ（{1} と {2} は比較不能）", "はい（すべての部分集合が比較可能）", "順序関係ではない", "半順序でも全順序でもない"]}
        correctIndex={0}
        explanation="{1} ⊈ {2} かつ {2} ⊈ {1} なので、この2つの部分集合は比較不能です。よって全順序ではありません。しかし反射性・反対称性・推移性は満たすので半順序です。"
      />

      <SectionDivider />

      <h2>ハッセ図による可視化</h2>

      <p>
        <strong>ハッセ図（Hasse diagram）</strong>は半順序を視覚的に表現する方法です。
        要素を点で表し、a ≤ b（a ≠ b）かつ a と b の間に他の要素がないとき、
        a から b への線分を引きます（a を下に描きます）。
      </p>

      <Callout variant="example" label="ハッセ図の例">
        <p>{'{'}1, 2, 3{'}'} のべき集合を ⊆ で半順序づけると:</p>
        <pre className="text-sm">
{`        {1,2,3}
       / | \\
    {1,2} {1,3} {2,3}
       \\ | /
    {1}  {2}  {3}
       \\ | /
         ∅`}
        </pre>
        <p>上に行くほど「大きい」（多くの要素を含む）集合です。</p>
      </Callout>

      <KeyPoint>
        ハッセ図では推移的な関係（a ⊆ b ⊆ c のときの a から c への線）を省略し、
        直接的な包含関係だけを描く。これにより構造が見やすくなる。
      </KeyPoint>

      <SectionDivider />

      <h2>実用例: データベースと関係</h2>

      <p>
        リレーショナルデータベースの「リレーション」は、数学的な関係から直接来ています。
        テーブルの各行は順序対（タプル）であり、テーブル全体は関係（順序対の集合）です。
      </p>

      <ComparisonTable
        headers={["数学の用語", "データベースの用語"]}
        rows={[
          ["集合 A × B", "テーブル（スキーマ）"],
          ["順序対 (a, b)", "行（レコード）"],
          ["関係 R ⊆ A × B", "テーブルの内容"],
          ["A ∩ B", "INNER JOIN"],
          ["A ∪ B", "UNION"],
        ]}
      />

      <ExampleMapping
        formula="R ⊆ Students × Courses"
        example="履修関係: {(田中, 数学), (田中, 物理), (鈴木, 数学)}"
        variables={{ Students: "学生の集合", Courses: "科目の集合", R: "履修テーブル" }}
        caption="データベースと関係の対応"
      />

      <Callout variant="example" label="グラフ理論との関連">
        グラフ G = (V, E) も関係です。頂点集合 V 上の二項関係 E ⊆ V × V が辺の集合です。
        無向グラフの辺は対称的な関係、有向グラフの辺は一般の関係に対応します。
      </Callout>

      <InlineMiniQuiz
        question="SNSの「フォロー関係」は一般にどの性質を持ちますか？"
        options={["反射的でも対称的でも推移的でもない（一般的には）", "反射的かつ対称的かつ推移的（同値関係）", "反射的かつ反対称的かつ推移的（半順序）", "対称的かつ推移的だが反射的でない"]}
        correctIndex={0}
        explanation="自分自身をフォローするかは設定次第（反射性不定）、フォローは一方向（非対称）、AがBを、BがCをフォローしてもAがCをフォローするとは限りません（非推移的）。"
      />

      <KeyPoint>
        関係の抽象的な性質を理解することで、データベース設計やグラフアルゴリズムなど
        様々な応用分野の構造を統一的に捉えることができる。
      </KeyPoint>

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="12-relations" />
    </div>
    </>
  )
}
