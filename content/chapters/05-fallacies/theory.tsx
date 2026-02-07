import { Callout, FormulaBlock, ComparisonTable, KeyPoint, SectionDivider } from "@/components/content"
import { ExampleMapping, InlineMiniQuiz } from "@/components/interactive"

export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第5章: 非形式的誤謬</h1>

      <h2>誤謬とは</h2>

      <Callout variant="definition" label="定義">
        <strong>誤謬（fallacy）</strong>とは、一見もっともらしく見えるが、
        実際には論理的に不正な推論のことです。
      </Callout>

      <p>
        形式的には妥当に見えても、推論の過程に隠された問題がある場合を
        <strong>非形式的誤謬</strong>と呼びます。
        形式的誤謬が論理構造そのものの誤りであるのに対し、非形式的誤謬は内容や文脈に起因します。
      </p>

      <ComparisonTable
        headers={["形式的誤謬", "非形式的誤謬"]}
        rows={[
          ["論理構造そのものが不正", "構造は正しく見えるが内容に問題"],
          ["真理値表で検出可能", "内容・文脈の分析が必要"],
          ["例: 後件肯定", "例: 人身攻撃、藁人形論法"],
        ]}
      />

      <KeyPoint>
        誤謬は「もっともらしさ」を武器にしています。見抜くには、論理構造だけでなく議論の内容にも注意を払う必要があります。
      </KeyPoint>

      <SectionDivider />

      <h2>関連性の誤謬</h2>

      <h3>人身攻撃（Ad Hominem）</h3>

      <Callout variant="definition" label="定義">
        議論の内容ではなく、主張者の人格・属性を攻撃することで
        主張を退けようとする誤謬です。
      </Callout>

      <FormulaBlock caption="人身攻撃の構造">
        Aが主張Pを述べる → Aの人格を攻撃 → よってPは誤りだ
      </FormulaBlock>

      <p>例: 「あの人は若いから、この提案は信用できない」</p>

      <Callout variant="warning" label="よくある誤解">
        主張者の属性を指摘すること自体が常に誤謬とは限りません。
        その属性が議論の内容に直接関係する場合は、正当な論点になりえます。
      </Callout>

      <h3>権威への訴え（Appeal to Authority）</h3>

      <Callout variant="definition" label="定義">
        関連する専門知識を持たない権威者の意見を根拠にする誤謬です。
      </Callout>

      <p>
        専門家の意見は参考になりますが、専門外の発言は論証にはなりません。
        権威者の発言が誤謬になるかどうかは、その権威が議論の分野と一致するかで判断します。
      </p>

      <p>例: 「有名な物理学者がこの投資は安全だと言っている」</p>

      <h3>多数への訴え（Ad Populum）</h3>

      <Callout variant="definition" label="定義">
        多くの人が信じているから正しい、とする誤謬です。
      </Callout>

      <p>例: 「みんなが使っているフレームワークだから最善だ」</p>

      <Callout variant="tip">
        多数派の意見が結果として正しいこともあります。しかし「多数が支持している」こと自体は、論理的な根拠にはなりません。
      </Callout>

      <ExampleMapping
        formula="P(x) は信頼できない → P(x) の主張は偽"
        example="「彼は若いから、彼の提案は信頼できない」"
        variables={{ "P(x)": "発言者", "信頼できない": "属性への攻撃", "主張は偽": "不当な結論" }}
        caption="人身攻撃の誤謬の構造"
      />

      <KeyPoint>
        関連性の誤謬では、結論と無関係な情報（人格・権威・人気）が根拠として使われます。
        「その根拠は結論と論理的に関係しているか？」と問うことで見抜けます。
      </KeyPoint>

      <SectionDivider />

      <h2>不当な前提の誤謬</h2>

      <h3>藁人形論法（Straw Man）</h3>

      <Callout variant="definition" label="定義">
        相手の主張を歪めて（弱い形に変えて）反論する誤謬です。
      </Callout>

      <p>
        例: A「テストカバレッジを上げるべきだ」→
        B「すべてのコードにテストを書くのは非現実的だ」
        （Aは100%とは言っていない）
      </p>

      <FormulaBlock caption="藁人形論法の構造">
        相手の主張P → Pを歪めたP'を作る → P'に反論 → よってPは誤りだ
      </FormulaBlock>

      <InlineMiniQuiz
        question="藁人形論法とは何ですか？"
        options={["相手の主張を歪めて攻撃する", "権威に訴える", "因果関係を混同する", "二択に追い込む"]}
        correctIndex={0}
        explanation="藁人形論法は、相手の実際の主張ではなく、歪めた弱い版を攻撃する誤謬です。"
      />

      <h3>滑りやすい坂論法（Slippery Slope）</h3>

      <Callout variant="definition" label="定義">
        ある行為が連鎖的に悪い結果を生むと主張するが、
        その因果関係を証明しない誤謬です。
      </Callout>

      <p>例: 「この例外を許すと、全員が例外を要求し、ルールが崩壊する」</p>

      <Callout variant="warning" label="よくある誤解">
        連鎖的な影響がすべて誤謬というわけではありません。
        各ステップの因果関係が十分に証明されていれば、正当な議論です。
      </Callout>

      <h3>偽の二択（False Dilemma）</h3>

      <Callout variant="definition" label="定義">
        実際には他の選択肢があるのに、2つの選択肢しかないかのように提示する誤謬です。
      </Callout>

      <p>例: 「品質を取るか、スピードを取るか、どちらかだ」</p>

      <Callout variant="tip">
        「本当にこの2つしか選択肢がないのか？」と問いかけることで、偽の二択を見抜けます。
      </Callout>

      <KeyPoint>
        不当な前提の誤謬では、議論の出発点（前提）に問題があります。
        相手の主張の歪曲、根拠なき因果連鎖、選択肢の不当な制限に注意しましょう。
      </KeyPoint>

      <SectionDivider />

      <h2>曖昧さの誤謬</h2>

      <h3>循環論法（Begging the Question）</h3>

      <Callout variant="definition" label="定義">
        結論を前提に含めてしまう誤謬です。
        証明すべきことを前提としています。
      </Callout>

      <FormulaBlock caption="循環論法の構造">
        PだからPである（結論 = 前提）
      </FormulaBlock>

      <p>例: 「この製品は最高品質だ。なぜなら、最高の品質だからだ」</p>

      <h3>感情への訴え（Appeal to Emotion）</h3>

      <Callout variant="definition" label="定義">
        論理的根拠ではなく、感情に訴えて説得しようとする誤謬です。
      </Callout>

      <p>
        恐怖、同情、怒りなど、様々な感情が利用されます。
        感情的な反応を引き起こすことで、論理的な検討を回避させます。
      </p>

      <p>例: 「この機能を削除すると、ユーザーは絶望するでしょう」</p>

      <KeyPoint>
        曖昧さの誤謬では、論証の構造や言葉の使い方に不明瞭さがあります。
        「前提と結論が独立しているか」「根拠は論理的か感情的か」を常に確認しましょう。
      </KeyPoint>
    </article>
  )
}
