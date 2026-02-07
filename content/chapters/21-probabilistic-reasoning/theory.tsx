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
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第25章: 確率的推論とベイズ</h1>

      <MotivationSection
        icon="🎲"
        realWorldExample="医療検査の偽陽性、スパムフィルタ、天気予報。不確実な世界で合理的に判断する力がベイズ推論。"
        nextChapterConnection="直観主義論理で「証明」の意味を再考する"
      />

      <h2>1. 演繹と帰納の違い（復習）</h2>

      <Callout variant="definition" label="復習">
        <strong>演繹的推論</strong>は前提が真なら結論が<strong>必ず</strong>真になる推論です。
        一方、<strong>帰納的推論</strong>は前提が結論を<strong>確からしく</strong>するが、
        100%の保証はない推論です。
      </Callout>

      <p>
        第3章で学んだ「妥当性」は演繹的推論に対する概念でした。
        しかし、現実世界の推論の多くは帰納的です。
        「過去10年間、この地域で12月に雪が降った。だから今年の12月も雪が降るだろう」
        ——この推論は妥当ではありませんが、合理的に見えます。
      </p>

      <ComparisonTable
        headers={["演繹的推論", "帰納的推論"]}
        rows={[
          ["前提が真なら結論は必ず真", "前提が真でも結論は確率的にしか支持されない"],
          ["真理保存的", "内容拡張的"],
          ["反例が一つでもあれば無効", "反例があっても確率が下がるだけ"],
          ["例: モーダスポネンス", "例: 統計的一般化、類推"],
        ]}
      />

      <KeyPoint>
        帰納的推論の「良さ」は妥当性ではなく<strong>帰納的強さ（inductive strength）</strong>で評価する。
        前提が真であるときに結論が真である確率が高いほど、帰納的に強い推論である。
      </KeyPoint>

      <SectionDivider />

      <h2>2. 条件付き確率</h2>

      <Callout variant="definition" label="定義">
        事象Bが起きたという条件のもとで事象Aが起きる確率を
        <strong>条件付き確率</strong>と呼び、P(A|B) と書きます。
      </Callout>

      <FormulaBlock caption="条件付き確率の定義">
        P(A|B) = P(A ∩ B) / P(B)　（ただし P(B) &gt; 0）
      </FormulaBlock>

      <p>
        直感的には、「全体」をBが起きた場合に限定し、
        その中でAも起きている割合を求めるものです。
      </p>

      <Callout variant="tip" label="例: カード">
        52枚のトランプから1枚引くとき、
        「ハートである」確率は P(ハート) = 13/52 = 1/4。
        「引いたカードが絵札である」という情報が与えられたとき、
        「ハートである」確率は P(ハート|絵札) = 3/12 = 1/4。
        この場合、絵札であるという情報はハートの確率を変えません（独立）。
      </Callout>

      <Callout variant="warning" label="注意">
        P(A|B) と P(B|A) は一般に異なります。
        「雨の日に地面が濡れている確率」と「地面が濡れているとき雨が降っている確率」は別物です。
        この混同は<strong>条件の逆転の誤り</strong>と呼ばれ、日常的に頻発します。
      </Callout>

      <ExampleMapping
        formula="P(A|B) ≠ P(B|A)"
        example="P(犯人|証拠一致) ≠ P(証拠一致|犯人)"
        variables={{
          "P(A|B)": "証拠が一致したとき犯人である確率",
          "P(B|A)": "犯人であるとき証拠が一致する確率",
        }}
        caption="条件の逆転の誤り: 検察官の誤謬"
      />

      <InlineMiniQuiz
        question="P(A|B) = P(B|A) が成り立つのはどんなとき？"
        options={[
          "P(A) = P(B) のとき",
          "A と B が独立のとき",
          "A = B のとき",
          "常に成り立つ",
        ]}
        correctIndex={0}
        explanation="ベイズの定理 P(A|B) = P(B|A)P(A)/P(B) より、P(A|B) = P(B|A) が成り立つのは P(A) = P(B) のときです。独立性とは異なる条件であることに注意してください。"
      />

      <SectionDivider />

      <h2>3. ベイズの定理</h2>

      <Callout variant="definition" label="定義">
        <strong>ベイズの定理</strong>は、新しい証拠を得たときに仮説の確率をどう更新すべきかを示す定理です。
      </Callout>

      <FormulaBlock caption="ベイズの定理">
        P(H|E) = P(E|H) × P(H) / P(E)
      </FormulaBlock>

      <p>
        各項の意味を整理しましょう:
      </p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">記号</th>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">名前</th>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">意味</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">P(H)</td>
              <td className="px-4 py-2 border border-border text-foreground/80">事前確率</td>
              <td className="px-4 py-2 border border-border text-foreground/80">証拠を見る前の仮説Hの確率</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">P(E|H)</td>
              <td className="px-4 py-2 border border-border text-foreground/80">尤度</td>
              <td className="px-4 py-2 border border-border text-foreground/80">仮説Hが真のとき証拠Eが観測される確率</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">P(E)</td>
              <td className="px-4 py-2 border border-border text-foreground/80">周辺尤度</td>
              <td className="px-4 py-2 border border-border text-foreground/80">証拠Eが観測される全体的な確率</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border text-foreground/80">P(H|E)</td>
              <td className="px-4 py-2 border border-border text-foreground/80">事後確率</td>
              <td className="px-4 py-2 border border-border text-foreground/80">証拠Eを見た後の仮説Hの確率</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        ベイズの定理の本質は「<strong>信念の更新</strong>」です。
        新しいデータが得られるたびに、仮説の確率（信念の強さ）を合理的に修正できます。
      </p>

      <FormulaBlock caption="全確率の公式（P(E)の展開）">
        P(E) = P(E|H) × P(H) + P(E|¬H) × P(¬H)
      </FormulaBlock>

      <KeyPoint>
        ベイズの定理は「証拠を得た後に仮説の確率をどう修正すべきか」を厳密に定める。
        事前確率 × 尤度 → 事後確率 という更新プロセスが核心。
      </KeyPoint>

      <SectionDivider />

      <h2>4. 事前確率と事後確率</h2>

      <p>
        ベイズ推論の流れを具体例で追いましょう。
      </p>

      <Callout variant="tip" label="例: 天気予報">
        朝、天気予報を見る前のあなたの「今日雨が降る」という信念は
        過去の統計に基づいて P(雨) = 0.3（事前確率）だとします。
        天気予報が「雨」と言ったとき、この予報が正確である確率は
        P(予報「雨」|実際に雨) = 0.9、P(予報「雨」|実際は晴れ) = 0.1 です。
      </Callout>

      <FormulaBlock caption="天気の例でのベイズ更新">
        P(雨|予報「雨」) = (0.9 × 0.3) / (0.9 × 0.3 + 0.1 × 0.7) = 0.27 / 0.34 ≈ 0.794
      </FormulaBlock>

      <p>
        事前確率 0.3 が、天気予報という証拠によって事後確率 0.794 に更新されました。
        証拠が仮説を支持するほど、事後確率は上がります。
      </p>

      <Callout variant="warning" label="重要">
        事前確率の選び方がベイズ推論の結果に大きく影響します。
        事前確率が極端に低い仮説は、強力な証拠があっても事後確率が大きく上がらないことがあります。
        これは弱点ではなく、合理的な推論の特徴です。
      </Callout>

      <InlineMiniQuiz
        question="事前確率 P(H) = 0.01 の仮説に対し、P(E|H) = 1.0、P(E|¬H) = 0.05 の証拠が得られた。事後確率 P(H|E) は？"
        options={[
          "約 0.17",
          "約 0.50",
          "約 0.95",
          "約 0.01",
        ]}
        correctIndex={0}
        explanation="P(H|E) = (1.0 × 0.01) / (1.0 × 0.01 + 0.05 × 0.99) = 0.01 / 0.0595 ≈ 0.168。事前確率が非常に低いと、強力な証拠でも事後確率はそこまで高くなりません。"
      />

      <SectionDivider />

      <h2>5. 基準率錯誤（Base Rate Fallacy）</h2>

      <Callout variant="definition" label="定義">
        <strong>基準率錯誤</strong>とは、事前確率（基準率）を無視または軽視し、
        個別の証拠だけに基づいて判断してしまう認知バイアスです。
      </Callout>

      <Callout variant="tip" label="例: 検査の偽陽性問題">
        ある病気の有病率は 0.1%（1000人に1人）です。
        検査の性能は以下の通りです:
        感度（病気の人を陽性と判定する確率）= 99%、
        特異度（健康な人を陰性と判定する確率）= 95%。
        検査で陽性が出た人が実際に病気である確率はいくつでしょうか？
      </Callout>

      <p>
        直感的に「99%」と答えたくなりますが、これが基準率錯誤です。
        ベイズの定理で正確に計算しましょう。
      </p>

      <FormulaBlock caption="偽陽性問題のベイズ計算">
        P(病気|陽性) = P(陽性|病気) × P(病気) / P(陽性) = (0.99 × 0.001) / (0.99 × 0.001 + 0.05 × 0.999) = 0.00099 / 0.05094 ≈ 0.019
      </FormulaBlock>

      <p>
        <strong>わずか約 1.9%</strong> です。
        陽性結果が出ても、実際に病気である確率は 2% にも満たないのです。
      </p>

      <p>
        なぜこうなるのか？ 1000人中、病気の人は1人（陽性になる）。
        健康な999人のうち 5%（約50人）が偽陽性になる。
        つまり陽性51人のうち本当に病気なのは1人だけです。
      </p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border"></th>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">病気（1人）</th>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">健康（999人）</th>
              <th className="text-left px-4 py-2 bg-muted font-medium border border-border">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-border font-medium text-foreground/80">検査陽性</td>
              <td className="px-4 py-2 border border-border text-foreground/80">0.99人</td>
              <td className="px-4 py-2 border border-border text-foreground/80">49.95人</td>
              <td className="px-4 py-2 border border-border text-foreground/80">50.94人</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-border font-medium text-foreground/80">検査陰性</td>
              <td className="px-4 py-2 border border-border text-foreground/80">0.01人</td>
              <td className="px-4 py-2 border border-border text-foreground/80">949.05人</td>
              <td className="px-4 py-2 border border-border text-foreground/80">949.06人</td>
            </tr>
          </tbody>
        </table>
      </div>

      <KeyPoint>
        基準率（事前確率）が低い場合、検査の精度が高くても偽陽性の割合が大きくなる。
        P(陽性|病気) と P(病気|陽性) を混同しないこと。これは「条件の逆転の誤り」の実例。
      </KeyPoint>

      <ExampleMapping
        formula="P(H|E) ≪ P(E|H) when P(H) ≪ 1"
        example="検査感度 99% でも、有病率 0.1% なら陽性的中率は約 2%"
        variables={{
          "H": "病気である",
          "E": "検査で陽性",
          "P(H)": "有病率 = 0.001",
          "P(E|H)": "感度 = 0.99",
        }}
        caption="基準率錯誤の構造"
      />

      <SectionDivider />

      <h2>6. 確率的論証の評価: 帰納的強さ</h2>

      <Callout variant="definition" label="定義">
        帰納的論証の<strong>帰納的強さ</strong>とは、
        前提が真であると仮定したときに結論が真である確率の高さです。
        帰納的に強い論証の前提がすべて真であるとき、その論証は<strong>説得的（cogent）</strong>であると言います。
      </Callout>

      <ComparisonTable
        headers={["演繹的論証の評価", "帰納的論証の評価"]}
        rows={[
          ["妥当 / 非妥当", "帰納的に強い / 弱い"],
          ["健全 / 非健全", "説得的 / 非説得的"],
          ["確実性", "確率的な支持"],
        ]}
      />

      <p>
        帰納的強さを評価する際の重要なポイント:
      </p>

      <ul>
        <li><strong>標本の大きさ</strong>: 大きな標本ほど一般化が強くなる</li>
        <li><strong>標本の代表性</strong>: 偏った標本からの一般化は弱い</li>
        <li><strong>反例の有無</strong>: 既知の反例があれば弱まる</li>
        <li><strong>結論の控えめさ</strong>: 「すべて」より「多く」の方が帰納的に強い</li>
      </ul>

      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P → Q（演繹 vs 帰納）"
        evaluate={(v) => !v.P || v.Q}
        caption="演繹では P→Q は厳密に成立するが、帰納では確率的な傾向として解釈される"
      />

      <InlineMiniQuiz
        question="「調査した100社のうち95社がこの手法で生産性が向上した。よって、すべての企業でこの手法は有効だ」——この推論の帰納的強さを弱めている要因は？"
        options={[
          "結論が「すべての企業」と過度に一般化している",
          "100社は標本として小さすぎる",
          "95%は低すぎる割合である",
          "帰納的推論自体が無効である",
        ]}
        correctIndex={0}
        explanation="95/100は強い帰納的証拠ですが、結論が「すべての企業」と言い切っている点が弱さの原因です。「多くの企業で有効である可能性が高い」とすれば帰納的に強い推論になります。"
      />

      <SectionDivider />

      <h2>7. 頻度主義 vs ベイズ主義（紹介）</h2>

      <p>
        確率の解釈には大きく二つの立場があります。
        この対立は統計学・科学哲学で現在も議論が続いています。
      </p>

      <Callout variant="definition" label="頻度主義">
        確率とは、同じ実験を無限回繰り返したときの相対頻度の極限である。
        「このコインの表が出る確率は 0.5」とは、
        無限回投げたとき表の割合が 0.5 に収束することを意味する。
      </Callout>

      <Callout variant="definition" label="ベイズ主義">
        確率とは、ある命題に対する<strong>信念の度合い</strong>である。
        「明日の降水確率は 60%」とは、
        利用可能な情報に基づく主観的な信念の強さを表す。
      </Callout>

      <ComparisonTable
        headers={["頻度主義", "ベイズ主義"]}
        rows={[
          ["確率 = 長期的な頻度", "確率 = 信念の度合い"],
          ["繰り返し可能な実験が前提", "一回限りの事象にも確率を適用可能"],
          ["事前確率を使わない", "事前確率を明示的に使う"],
          ["p値、信頼区間", "事後確率、信用区間"],
          ["フィッシャー、ネイマン、ピアソン", "ベイズ、ラプラス、デ・フィネッティ"],
        ]}
      />

      <Callout variant="warning" label="論争のポイント">
        頻度主義は事前確率に依存しない客観性を重視しますが、
        一回限りの事象（「この被告が有罪である確率」など）を扱えません。
        ベイズ主義は柔軟ですが、事前確率の主観性が批判されます。
        現代の統計学では両者の長所を活かすアプローチも増えています。
      </Callout>

      <KeyPoint>
        頻度主義は「確率＝頻度」、ベイズ主義は「確率＝信念」。
        どちらが正しいかではなく、どの文脈でどちらが有用かを考えることが重要。
      </KeyPoint>

      <InlineMiniQuiz
        question="「この隕石が明日地球に衝突する確率は0.001%」という文は、頻度主義とベイズ主義のどちらの解釈が自然？"
        options={[
          "ベイズ主義（一回限りの事象に対する信念の度合い）",
          "頻度主義（繰り返し実験の相対頻度）",
          "どちらの解釈でも同じ",
          "どちらの解釈でも意味をなさない",
        ]}
        correctIndex={0}
        explanation="隕石の衝突は繰り返し実験できない一回限りの事象です。頻度主義では「長期的頻度」として解釈しにくいため、ベイズ主義の「信念の度合い」として理解する方が自然です。"
      />

    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="21-probabilistic-reasoning" />
    </div>
    </>
  )
}
