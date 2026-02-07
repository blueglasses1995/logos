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
  LogicSandbox,
  InlineMiniQuiz,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第27章: ブール代数と回路</h1>

      <MotivationSection
        icon="💡"
        realWorldExample="スマートフォンの中には数十億個の論理ゲートが詰まっている。命題論理の演算が、物理的な電子回路として実現されている。"
        nextChapterConnection="Curry-Howard対応で論理と型システムの深い統一を学ぶ"
      />

      <h2>ブール代数の公理</h2>

      <p>
        ジョージ・ブール（1815-1864）は、論理を代数的に扱う体系を構築しました。
        ブール代数は集合 {"{0, 1}"} 上の二つの演算 ∧（AND）と ∨（OR）、
        および補元演算 ¬（NOT）からなる代数構造です。
        この体系が命題論理と完全に対応することで、
        論理の計算が機械的に行えるようになりました。
      </p>

      <Callout variant="definition" label="ブール代数の公理">
        集合 B = {"{0, 1}"} と演算 ∧, ∨, ¬ に対して、以下の公理が成り立ちます。
        <ul>
          <li><strong>交換律</strong>: a ∧ b = b ∧ a、a ∨ b = b ∨ a</li>
          <li><strong>結合律</strong>: (a ∧ b) ∧ c = a ∧ (b ∧ c)、(a ∨ b) ∨ c = a ∨ (b ∨ c)</li>
          <li><strong>分配律</strong>: a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c)、a ∨ (b ∧ c) = (a ∨ b) ∧ (a ∨ c)</li>
          <li><strong>単位元</strong>: a ∧ 1 = a、a ∨ 0 = a</li>
          <li><strong>補元律</strong>: a ∧ ¬a = 0、a ∨ ¬a = 1</li>
        </ul>
      </Callout>

      <p>
        注目すべき点は、∨ に対する分配律 a ∨ (b ∧ c) = (a ∨ b) ∧ (a ∨ c) です。
        通常の算術では加法が乗法に分配されることはありませんが、
        ブール代数では ∨ が ∧ に分配されます。
        これはブール代数に固有の性質です。
      </p>

      <FormulaBlock caption="ド・モルガンの法則（ブール代数版）">
        ¬(a ∧ b) = ¬a ∨ ¬b{"\n"}
        ¬(a ∨ b) = ¬a ∧ ¬b
      </FormulaBlock>

      <p>
        ド・モルガンの法則は、第2章で真理値表を使って確認しました。
        ブール代数ではこれが代数的な等式として扱えます。
        公理から演繹的に導出できるのです。
      </p>

      <KeyPoint>
        ブール代数は命題論理を代数的に定式化した体系。
        交換律・結合律・分配律・ド・モルガン・補元律の5つの公理群で
        論理演算の全てが記述できる。
      </KeyPoint>

      <SectionDivider />

      <h2>命題論理とブール代数の対応</h2>

      <p>
        命題論理の各要素は、ブール代数の要素に正確に対応します。
        命題変数は 0 または 1 の値を取る変数に、
        論理結合子はブール演算に翻訳されます。
      </p>

      <ComparisonTable
        headers={["命題論理", "ブール代数", "意味"]}
        rows={[
          ["真（T）", "1", "成り立つ"],
          ["偽（F）", "0", "成り立たない"],
          ["P ∧ Q", "P · Q", "論理積（AND）"],
          ["P ∨ Q", "P + Q", "論理和（OR）"],
          ["¬P", "P̄", "否定（NOT）"],
          ["P → Q", "P̄ + Q", "含意（条件文）"],
          ["P ↔ Q", "P · Q + P̄ · Q̄", "双条件文"],
        ]}
      />

      <p>
        この対応により、命題論理の恒真式はブール代数の恒等式に、
        論理的同値はブール代数の等式に翻訳されます。
        例えば、排中律 P ∨ ¬P は P + P̄ = 1 という恒等式に対応します。
      </p>

      <Callout variant="example" label="含意のブール代数表現">
        P → Q は ¬P ∨ Q と同値でした（第2章）。
        ブール代数では P̄ + Q と書けます。
        これにより、条件文を含む論理式も加法と乗法の計算として扱えます。
      </Callout>

      <InlineMiniQuiz
        question="命題論理の P → Q をブール代数で表すとどうなりますか？"
        options={[
          "P̄ + Q（¬P ∨ Q に対応）",
          "P · Q（P ∧ Q に対応）",
          "P + Q̄（P ∨ ¬Q に対応）",
          "P̄ · Q̄（¬P ∧ ¬Q に対応）"
        ]}
        correctIndex={0}
        explanation="P → Q ≡ ¬P ∨ Q なので、ブール代数では P̄ + Q と表現されます。"
      />

      <SectionDivider />

      <h2>論理ゲート</h2>

      <p>
        ブール代数の演算は、電子回路として物理的に実現できます。
        電圧の高低（High/Low）を 1/0 に対応させることで、
        トランジスタの組み合わせで論理演算を行う<strong>論理ゲート</strong>が構成されます。
      </p>

      <h3>基本ゲート: AND, OR, NOT</h3>

      <Callout variant="definition" label="AND ゲート">
        2つの入力が両方とも 1 のときだけ出力が 1 になるゲート。
        ブール代数の乗法 a · b に対応します。
      </Callout>

      <Callout variant="definition" label="OR ゲート">
        2つの入力のうち少なくとも一方が 1 なら出力が 1 になるゲート。
        ブール代数の加法 a + b に対応します。
      </Callout>

      <Callout variant="definition" label="NOT ゲート（インバータ）">
        1つの入力を反転させるゲート。0 を 1 に、1 を 0 にします。
        ブール代数の補元 ā に対応します。
      </Callout>

      <LogicSandbox
        variables={["A", "B"]}
        formulas={[
          { label: "A AND B", evaluate: (v) => v.A && v.B },
          { label: "A OR B", evaluate: (v) => v.A || v.B },
          { label: "NOT A", evaluate: (v) => !v.A },
        ]}
        caption="基本論理ゲートの動作を確認しましょう。変数を切り替えて出力の変化を観察してください。"
      />

      <h3>複合ゲート: NAND, NOR, XOR</h3>

      <p>
        基本ゲートを組み合わせて、より複雑な論理演算を行うゲートが定義されます。
        中でも NAND ゲートは特別な重要性を持ちます。
      </p>

      <ComparisonTable
        headers={["ゲート", "定義", "出力が 1 になる条件"]}
        rows={[
          ["NAND", "¬(A ∧ B)", "少なくとも一方が 0"],
          ["NOR", "¬(A ∨ B)", "両方とも 0"],
          ["XOR", "(A ∧ ¬B) ∨ (¬A ∧ B)", "一方だけが 1"],
        ]}
      />

      <Callout variant="warning" label="NANDの万能性">
        NAND ゲートだけで、AND, OR, NOT を含む全ての論理演算が実現できます。
        これを<strong>機能的完全性（functional completeness）</strong>と呼びます。
        <ul>
          <li>NOT A = A NAND A</li>
          <li>A AND B = (A NAND B) NAND (A NAND B)</li>
          <li>A OR B = (A NAND A) NAND (B NAND B)</li>
        </ul>
        実際の集積回路では、製造コストの観点から NAND ゲートが最も多用されます。
      </Callout>

      <TruthValueAnimator
        variables={["A", "B"]}
        formula="A NAND B = ¬(A ∧ B)"
        evaluate={(v) => !(v.A && v.B)}
        caption="NAND ゲート: AND の否定。全パターンで動作を確認しましょう。"
      />

      <LogicSandbox
        variables={["A", "B"]}
        formulas={[
          { label: "A NAND B", evaluate: (v) => !(v.A && v.B) },
          { label: "A NOR B", evaluate: (v) => !(v.A || v.B) },
          { label: "A XOR B", evaluate: (v) => (v.A && !v.B) || (!v.A && v.B) },
        ]}
        caption="複合ゲートの動作を確認しましょう。XOR は排他的論理和で、一方だけが真のときに真になります。"
      />

      <InlineMiniQuiz
        question="NAND ゲートが「万能ゲート」と呼ばれる理由は何ですか？"
        options={[
          "NAND ゲートだけで全ての論理演算を実現できるから",
          "NAND ゲートが最も高速だから",
          "NAND ゲートが最も消費電力が小さいから",
          "NAND ゲートが最も直感的だから"
        ]}
        correctIndex={0}
        explanation="NAND ゲートは機能的完全性を持ちます。NOT, AND, OR の全てを NAND の組み合わせで構成できるため、万能ゲートと呼ばれます。"
      />

      <SectionDivider />

      <h2>組み合わせ回路: 加算器</h2>

      <p>
        論理ゲートを組み合わせることで、算術演算を行う回路を構成できます。
        最も基本的な例は、二進数の足し算を行う<strong>加算器</strong>です。
      </p>

      <h3>半加算器（Half Adder）</h3>

      <Callout variant="definition" label="半加算器">
        1ビット同士の足し算を行う回路。
        2つの入力 A, B から、和（Sum）と桁上げ（Carry）を出力します。
        <ul>
          <li><strong>Sum</strong> = A XOR B</li>
          <li><strong>Carry</strong> = A AND B</li>
        </ul>
      </Callout>

      <p>
        例えば、A = 1, B = 1 のとき、Sum = 0, Carry = 1 です。
        これは二進数の 1 + 1 = 10（十進数の2）に対応します。
        半加算器は下位桁からの桁上げ入力を受け付けないため、
        最下位ビットの加算にのみ使えます。
      </p>

      <LogicSandbox
        variables={["A", "B"]}
        formulas={[
          { label: "Sum (A XOR B)", evaluate: (v) => (v.A && !v.B) || (!v.A && v.B) },
          { label: "Carry (A AND B)", evaluate: (v) => v.A && v.B },
        ]}
        caption="半加算器: 1ビット加算の結果を確認しましょう。A=1, B=1 のとき Sum=0, Carry=1 になることに注目。"
      />

      <h3>全加算器（Full Adder）</h3>

      <p>
        全加算器は、下位桁からの桁上げ入力（Cin）も考慮した加算回路です。
        3つの入力 A, B, Cin から Sum と Cout を出力します。
      </p>

      <FormulaBlock caption="全加算器の論理式">
        Sum = A XOR B XOR Cin{"\n"}
        Cout = (A AND B) OR (Cin AND (A XOR B))
      </FormulaBlock>

      <p>
        全加算器を n 個直列に繋ぐことで、n ビットの加算器（リプルキャリー加算器）が構成できます。
        現代のCPUの演算ユニットは、この原理の高度に最適化されたバージョンです。
      </p>

      <ComparisonTable
        headers={["A", "B", "Cin", "Sum", "Cout"]}
        rows={[
          ["0", "0", "0", "0", "0"],
          ["0", "0", "1", "1", "0"],
          ["0", "1", "0", "1", "0"],
          ["0", "1", "1", "0", "1"],
          ["1", "0", "0", "1", "0"],
          ["1", "0", "1", "0", "1"],
          ["1", "1", "0", "0", "1"],
          ["1", "1", "1", "1", "1"],
        ]}
      />

      <KeyPoint>
        論理ゲートを組み合わせることで算術演算が実現できる。
        半加算器は XOR と AND の2つのゲートだけで構成され、
        全加算器を連結すれば任意のビット幅の加算が可能になる。
      </KeyPoint>

      <SectionDivider />

      <h2>論理式の最適化とカルノー図</h2>

      <p>
        回路を設計する際、論理式を最もシンプルな形に変換することが重要です。
        ゲート数が減ればコストが下がり、速度も向上します。
        <strong>カルノー図（Karnaugh Map）</strong>は、
        最大4変数までの論理式を視覚的に最適化するための手法です。
      </p>

      <Callout variant="definition" label="カルノー図（K-map）">
        真理値表を2次元のグリッドに配置し、
        隣接するセル間で1ビットだけ異なるように並べた図。
        「1」のセルを矩形のグループにまとめることで、
        共通因子を括り出し、論理式を簡略化します。
      </Callout>

      <p>
        例えば、F(A, B) = A̅B + AB̅ + AB という論理式を考えます。
        カルノー図で「1」のセルをまとめると、
        F = A + B と簡略化できます（A̅B + AB = B、AB̅ + AB = A より）。
      </p>

      <FormulaBlock caption="カルノー図による簡略化の例">
        元の式: F = ¬A·B + A·¬B + A·B{"\n"}
        簡略化: F = A + B{"\n"}
        （3つのゲートから1つに削減）
      </FormulaBlock>

      <Callout variant="example" label="簡略化のアルゴリズム">
        <ol>
          <li>真理値表からカルノー図を作成する</li>
          <li>「1」のセルを、できるだけ大きな矩形グループにまとめる</li>
          <li>各グループから共通変数を読み取る</li>
          <li>全グループを OR で結合して最適化された式を得る</li>
        </ol>
      </Callout>

      <InlineMiniQuiz
        question="論理式 F = A·B + A·¬B を簡略化すると何になりますか？"
        options={[
          "F = A",
          "F = B",
          "F = A + B",
          "F = A · B"
        ]}
        correctIndex={0}
        explanation="A·B + A·¬B = A·(B + ¬B) = A·1 = A です。B の値に関係なく、A が 1 なら F は 1 になります。"
      />

      <SectionDivider />

      <h2>デジタル回路とコンピュータの基礎</h2>

      <p>
        ここまで学んだ論理ゲートと回路は、コンピュータの心臓部を構成します。
        クロード・シャノン（1916-2001）は1937年の修士論文で、
        ブール代数とリレー回路の対応を示しました。
        これは20世紀で最も重要な修士論文と呼ばれることがあります。
      </p>

      <ComparisonTable
        headers={["コンピュータの構成要素", "使われている論理回路"]}
        rows={[
          ["CPU（演算ユニット）", "加算器、比較器、シフタ"],
          ["メモリ（フリップフロップ）", "NAND/NOR ゲートのフィードバック"],
          ["条件分岐", "マルチプレクサ（選択回路）"],
          ["バス制御", "トライステートバッファ"],
        ]}
      />

      <p>
        コンピュータが行う全ての計算は、最終的にはブール演算の組み合わせに還元されます。
        テキストの表示も、画像の処理も、AIの推論も、
        根底には AND, OR, NOT の三つの演算があるのです。
      </p>

      <Callout variant="example" label="身近な例: CPU の加算">
        64ビット整数の加算は、64個の全加算器を直列に繋いだ回路で実行されます。
        各全加算器は約5個の論理ゲートで構成されるため、
        1回の加算に約320個のゲートが関与します。
        現代のCPUでは桁上げ先見加算器（Carry-Lookahead Adder）を用いて
        遅延を削減していますが、原理は同じです。
      </Callout>

      <KeyPoint>
        ブール代数と論理ゲートは、コンピュータの物理的基盤を形成する。
        シャノンの洞察により、論理（思考の法則）と回路（物理的装置）が統一された。
        全てのデジタル計算は、AND・OR・NOT の組み合わせに帰着する。
      </KeyPoint>

      <TruthValueAnimator
        variables={["A", "B"]}
        formula="A XOR B（排他的論理和）"
        evaluate={(v) => (v.A && !v.B) || (!v.A && v.B)}
        caption="XOR ゲート: コンピュータの加算器の中核。Sum ビットの計算に使われます。"
      />
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="23-boolean-circuits" />
    </div>
    </>
  )
}
