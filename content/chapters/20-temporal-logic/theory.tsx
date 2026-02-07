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
  ExampleMapping,
  InlineMiniQuiz,
  StudyNotes,
} from "@/components/interactive"

export function TheoryContent() {
  return (
    <>
    <article className="prose prose-zinc max-w-none">
      <h1>第23章: 時相論理</h1>

      <MotivationSection
        icon="⏱️"
        realWorldExample="「サーバーは常に応答する」「リクエストにはいずれ応答がある」——システム仕様は時間の概念を含む。時相論理はその形式化。"
        nextChapterConnection="確率的推論へ — 不確実性のある世界の論理"
      />

      <h2>なぜ時間を論理に組み込むのか</h2>

      <p>
        これまで学んだ論理体系では、命題は「真」か「偽」のどちらかでした。
        様相論理では「可能世界」を導入して「必然」と「可能」を扱えるようになりました。
        しかし、ソフトウェアやハードウェアの仕様を記述するには、
        さらに<strong>時間</strong>の概念が必要です。
      </p>

      <ComparisonTable
        headers={["仕様の記述", "必要な概念"]}
        rows={[
          ["「エレベーターはいつか必ず1階に戻る」", "いつか（eventually）"],
          ["「デッドロックは絶対に起こらない」", "常に（always）"],
          ["「ボタンを押した次の状態でドアが開く」", "次に（next）"],
          ["「ブレーキを踏んでいる間は加速しない」", "〜まで（until）"],
        ]}
      />

      <p>
        <strong>時相論理（temporal logic）</strong>は、
        様相論理の枠組みを時間的な推論に応用したものです。
        「可能世界」を「時点」に、「到達可能性関係」を「時間の流れ」に
        読み替えることで、システムの振る舞いを形式的に記述できます。
      </p>

      <SectionDivider />

      <h2>LTLの4つの基本演算子</h2>

      <p>
        <strong>線形時相論理（LTL: Linear Temporal Logic）</strong>は、
        時間を一直線に進む列として捉えます。
        現在から未来に向かって無限に続く状態の列の上で、
        命題の真偽を評価します。
      </p>

      <Callout variant="definition" label="LTLの4つの演算子">
        <strong>□P（Always / Globally）</strong>: 「常にPが成り立つ」— 現在以降のすべての時点でPが真{"\n\n"}
        <strong>◇P（Eventually / Finally）</strong>: 「いつかPが成り立つ」— 現在以降のある時点でPが真{"\n\n"}
        <strong>○P（Next）</strong>: 「次の時点でPが成り立つ」— 直後の時点でPが真{"\n\n"}
        <strong>P U Q（Until）</strong>: 「QになるまでPが成り立つ」— Qが真になるまでの間、Pがずっと真
      </Callout>

      <FormulaBlock caption="LTL演算子の直感的意味">
        □P: 今後ずっとP（永遠にP）{"\n"}
        ◇P: いつかP（少なくとも一度はP）{"\n"}
        ○P: 次にP（1ステップ後にP）{"\n"}
        P U Q: QになるまでP（Pが続いた後にQが来る）
      </FormulaBlock>

      <ComparisonTable
        headers={["様相論理", "LTL", "解釈の違い"]}
        rows={[
          ["□P（すべての可能世界でP）", "□P（すべての未来時点でP）", "世界 → 時点"],
          ["◇P（ある可能世界でP）", "◇P（ある未来時点でP）", "世界 → 時点"],
          ["（なし）", "○P（次の時点でP）", "時間の離散性"],
          ["（なし）", "P U Q（QまでP）", "時間的持続"],
        ]}
      />

      <ExampleMapping
        formula="□(request → ◇response)"
        example="すべてのリクエストにはいつか応答がある（応答性の保証）"
        variables={{ "□": "常に", "request": "リクエストが来た", "◇": "いつか", "response": "応答がある" }}
      />

      <InlineMiniQuiz
        question="「サーバーが停止した後、必ず再起動する」をLTLで表すと？"
        options={[
          "□(停止 → ◇再起動)",
          "◇(停止 → 再起動)",
          "□停止 → □再起動",
          "○再起動"
        ]}
        correctIndex={0}
        explanation="「常に（□）、停止したなら（→）いつか（◇）再起動する」です。□が「どの時点でも」を保証し、◇が「いずれ」を表します。"
      />

      <KeyPoint>
        LTLの4演算子——□（常に）、◇（いつか）、○（次に）、U（まで）——で、
        システムの時間的な仕様を正確に記述できる。
        □と◇は様相論理の時間版であり、○とUは時間特有の概念。
      </KeyPoint>

      <SectionDivider />

      <h2>パス意味論: 無限の状態列上での評価</h2>

      <p>
        LTLの式は、<strong>パス（path）</strong>と呼ばれる
        無限の状態列の上で評価されます。
        パスとは、状態 s₀, s₁, s₂, s₃, ... が時間に沿って並んだものです。
      </p>

      <Callout variant="definition" label="パス意味論">
        パス π = s₀, s₁, s₂, ... に対して:{"\n\n"}
        π, i ⊨ P ⟺ 状態 sᵢ で命題Pが真{"\n"}
        π, i ⊨ □P ⟺ すべての j ≥ i で π, j ⊨ P{"\n"}
        π, i ⊨ ◇P ⟺ ある j ≥ i で π, j ⊨ P{"\n"}
        π, i ⊨ ○P ⟺ π, i+1 ⊨ P{"\n"}
        π, i ⊨ P U Q ⟺ ある j ≥ i で π, j ⊨ Q かつ すべての i ≤ k &lt; j で π, k ⊨ P
      </Callout>

      <p>
        ポイントは、□と◇の関係が様相論理と同じ双対性を持つことです。
      </p>

      <FormulaBlock caption="LTLにおける双対性">
        □P ⟺ ¬◇¬P （常にP ⟺ Pが偽になる時点がない）{"\n"}
        ◇P ⟺ ¬□¬P （いつかP ⟺ Pが常に偽ではない）
      </FormulaBlock>

      <Callout variant="example" label="パス上での評価例">
        パス: s₀(P,Q), s₁(P,¬Q), s₂(¬P,Q), s₃(P,Q), ...{"\n\n"}
        s₀での評価:{"\n"}
        ・○P は s₁ で P=真 なので真{"\n"}
        ・○Q は s₁ で Q=偽 なので偽{"\n"}
        ・◇Q は s₂ で Q=真 なので真{"\n"}
        ・□P は s₂ で P=偽 なので偽
      </Callout>

      <InlineMiniQuiz
        question="パス上で□◇Pが成り立つとはどういう意味ですか？"
        options={[
          "どの時点から見ても、その先のいつかの時点でPが真になる（Pが無限回真になる）",
          "ある時点以降ずっとPが真になる",
          "次の時点でPが真になる",
          "Pが少なくとも1回真になる"
        ]}
        correctIndex={0}
        explanation="□◇P =「常に、いつかP」= どの時点から見ても将来にPが真の時点がある = Pは無限回真になります。これは公平性（fairness）の表現としてよく使われます。"
      />

      <SectionDivider />

      <h2>LTL式の実用的な例</h2>

      <p>
        LTLを使うことで、ソフトウェアやプロトコルの重要な性質を
        正確に記述できます。
      </p>

      <ComparisonTable
        headers={["性質", "LTL式", "意味"]}
        rows={[
          ["安全性", "□¬error", "エラーは絶対に起こらない"],
          ["応答性", "□(request → ◇response)", "リクエストにはいつか応答がある"],
          ["公平性", "□◇granted", "アクセス権はいつかは必ず付与される"],
          ["相互排除", "□¬(cs₁ ∧ cs₂)", "2プロセスが同時にクリティカルセクションに入らない"],
          ["先行関係", "¬Q U P", "Pが起こるまでQは起こらない"],
          ["活性", "□(try → ◇cs)", "アクセスを試みればいつかクリティカルセクションに入れる"],
        ]}
      />

      <ExampleMapping
        formula="□(送金要求 → ○認証確認)"
        example="送金が要求されたら、次のステップで必ず認証確認が行われる"
        variables={{ "□": "常に", "○": "次のステップで", "→": "ならば" }}
      />

      <KeyPoint>
        LTL式の2大カテゴリ: 安全性（□¬bad: 悪いことが起きない）と
        活性（□(request → ◇response): 良いことがいつか起きる）。
        ほとんどのシステム仕様はこの2つの組み合わせで表現できる。
      </KeyPoint>

      <SectionDivider />

      <h2>CTLの紹介: 分岐する未来</h2>

      <p>
        LTLは時間を一本の線（パス）として扱いますが、
        非決定的なシステムでは、ある状態から複数の未来がありえます。
        <strong>計算木論理（CTL: Computation Tree Logic）</strong>は、
        この「分岐する未来」を扱う論理です。
      </p>

      <Callout variant="definition" label="CTLのパス量化子">
        <strong>A（All paths）</strong>: すべてのパスにおいて{"\n"}
        <strong>E（Exists a path）</strong>: あるパスにおいて{"\n\n"}
        CTLではパス量化子と時相演算子を組み合わせる:{"\n"}
        AF P: すべてのパスでいつかP{"\n"}
        EF P: あるパスでいつかP{"\n"}
        AG P: すべてのパスで常にP{"\n"}
        EG P: あるパスで常にP
      </Callout>

      <ComparisonTable
        headers={["LTL", "CTL", "違い"]}
        rows={[
          ["◇P（このパスでいつかP）", "AF P（すべてのパスでいつかP）", "CTLはパスの量化が明示的"],
          ["◇P", "EF P（あるパスでいつかP）", "LTLには「ある/すべて」の区別がない"],
          ["□P（このパスで常にP）", "AG P（すべてのパスで常にP）", "CTLの方が表現が精密"],
          ["（表現不可）", "AG EF restart", "どの状態からも再起動可能なパスが存在する"],
        ]}
      />

      <Callout variant="example" label="LTLとCTLの使い分け">
        <strong>リセット可能性</strong>: AG EF init{"\n"}
        「どの状態（AG）からでも、初期状態に戻れるパスが存在する（EF init）」{"\n"}
        → これはCTLでしか表現できないLTLにない性質。{"\n\n"}
        <strong>応答性</strong>: □(req → ◇ack)（LTL） vs AG(req → AF ack)（CTL）{"\n"}
        → 似た意味だが微妙に異なる。LTLは特定のパス上で、CTLは全パスで。
      </Callout>

      <InlineMiniQuiz
        question="CTLの AG EF P の意味は？"
        options={[
          "すべてのパスのすべての状態から、Pに到達できるパスが存在する",
          "あるパスで常にPが成り立つ",
          "すべてのパスでいつかPが成り立つ",
          "次の状態でPが成り立つ"
        ]}
        correctIndex={0}
        explanation="AG =「すべてのパスのすべての状態で」、EF =「あるパスでいつか」。組み合わせると「どの到達可能な状態からも、Pに至るパスが存在する」という意味になります。"
      />

      <SectionDivider />

      <h2>モデル検査の直感的説明</h2>

      <p>
        <strong>モデル検査（model checking）</strong>とは、
        システムのモデル（状態遷移図）が時相論理の仕様を満たすかどうかを
        自動的に検証する技術です。
      </p>

      <Callout variant="definition" label="モデル検査">
        入力: システムのモデル M + 時相論理の仕様 φ{"\n"}
        出力: M ⊨ φ（仕様を満たす）or 反例（仕様に違反するパス）{"\n\n"}
        特長: 全自動。人間による証明が不要。反例が具体的に得られる。
      </Callout>

      <p>
        モデル検査の画期的な点は、仕様の検証が<strong>完全に自動化</strong>できることです。
        状態空間を網羅的に探索し、仕様に違反する実行パスがあればそれを反例として出力します。
        反例がなければ、仕様は正しいと保証されます。
      </p>

      <ComparisonTable
        headers={["テスト", "モデル検査"]}
        rows={[
          ["有限個のケースを実行", "全状態空間を網羅的に探索"],
          ["バグがないことは保証できない", "仕様違反がないことを数学的に保証"],
          ["反例は偶然の発見", "最小の反例を自動で生成"],
          ["仕様は暗黙的（テストケース）", "仕様は明示的（時相論理式）"],
          ["大規模システムに適用可能", "状態爆発問題（状態数の指数的増大）"],
        ]}
      />

      <Callout variant="warning" label="状態爆発問題">
        モデル検査の最大の課題は<strong>状態爆発</strong>です。
        n個の変数を持つシステムの状態数は最大2ⁿになります。
        10個のプロセスが各10状態を持てば、全体の状態数は10¹⁰に達します。
        シンボリックモデル検査（BDD）や抽象化などの技術でこの問題を緩和しますが、
        根本的な限界は残ります。
      </Callout>

      <InlineMiniQuiz
        question="モデル検査がテストより優れている点は？"
        options={[
          "全状態空間を網羅的に探索し、仕様違反がないことを数学的に保証できる",
          "大規模システムに常に適用可能である",
          "テストよりも高速である",
          "仕様が不要である"
        ]}
        correctIndex={0}
        explanation="モデル検査の最大の利点は網羅性です。テストは有限個のケースしか検証できませんが、モデル検査は全状態を探索します。ただし状態爆発問題により、大規模システムへの適用には工夫が必要です。"
      />

      <SectionDivider />

      <h2>応用: デッドロック検出とプロトコル検証</h2>

      <p>
        時相論理とモデル検査は、実際のソフトウェア・ハードウェアの検証で
        広く使われています。以下は代表的な応用例です。
      </p>

      <ComparisonTable
        headers={["応用分野", "検証する性質", "LTL/CTL式の例"]}
        rows={[
          ["デッドロック検出", "デッドロックが起こらない", "AG EF progress（CTL）"],
          ["通信プロトコル", "送信メッセージはいつか受信される", "□(send → ◇receive)（LTL）"],
          ["相互排除", "2プロセスが同時にCSに入らない", "□¬(cs₁ ∧ cs₂)（LTL）"],
          ["キャッシュ整合性", "キャッシュは常に一貫している", "AG coherent（CTL）"],
          ["飢餓回避", "アクセス要求は無限に無視されない", "□(req → ◇grant)（LTL）"],
        ]}
      />

      <Callout variant="example" label="デッドロック検出の例">
        2つのプロセスが2つのリソースをそれぞれ逆順にロックする場合:{"\n\n"}
        プロセス1: lock(A) → lock(B) → 処理 → unlock(B) → unlock(A){"\n"}
        プロセス2: lock(B) → lock(A) → 処理 → unlock(A) → unlock(B){"\n\n"}
        モデル検査で AG EF progress を検証すると、反例として:{"\n"}
        「P1がAをロック → P2がBをロック → P1がBを待つ → P2がAを待つ → デッドロック」{"\n"}
        という実行パスが自動的に発見される。
      </Callout>

      <ExampleMapping
        formula="□(alarm → ○shutdown)"
        example="アラームが鳴ったら、次のステップで必ずシステムを停止する"
        variables={{ "□": "常に", "alarm": "アラーム発生", "○": "次のステップ", "shutdown": "システム停止" }}
      />

      <KeyPoint>
        時相論理とモデル検査は、並行システム・通信プロトコル・ハードウェア回路の
        正しさを数学的に保証する強力なツール。
        Intelのチップ設計、NASAの宇宙探査プログラムなど、
        高信頼性が要求される分野で実際に活用されている。
      </KeyPoint>

      <SectionDivider />
      <div className="not-prose my-8">
        <h2 className="text-xl font-serif mb-4">インタラクティブ: 論理サンドボックス</h2>
        <LogicSandbox
          variables={["request", "response", "waiting"]}
          formulas={[
            { label: "□(request → ◇response)", evaluate: (v) => !v.request || v.response },
            { label: "request U response", evaluate: (v) => v.request && !v.response || v.response },
            { label: "○response", evaluate: (v) => v.response },
          ]}
          caption="時相論理の基本演算子を試してみましょう"
        />
      </div>
    </article>
    <div className="not-prose my-8">
      <StudyNotes chapterSlug="20-temporal-logic" />
    </div>
    </>
  )
}
