"use client"

import { useState, useCallback } from "react"

// --- Types ---

interface ArgumentOption {
  readonly id: string
  readonly text: string
  readonly type: "valid" | "weakness" | "fallacy" | "irrelevant"
  readonly score: number
  readonly feedback: string
}

interface DebateRound {
  readonly opponentArgument: string
  readonly opponentFallacy?: string
  readonly options: readonly ArgumentOption[]
}

interface DebateTopic {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly proPosition: string
  readonly conPosition: string
  readonly rounds: readonly DebateRound[]
}

type Position = "pro" | "con"

interface RoundResult {
  readonly round: number
  readonly score: number
  readonly feedback: string
  readonly type: ArgumentOption["type"]
}

// --- Score config ---

const SCORE_MAP: Readonly<Record<ArgumentOption["type"], { readonly label: string; readonly className: string }>> = {
  valid: {
    label: "+10 正当な推論",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  weakness: {
    label: "+5 弱点の指摘",
    className: "text-blue-600 dark:text-blue-400",
  },
  fallacy: {
    label: "-5 誤謬を犯した",
    className: "text-red-600 dark:text-red-400",
  },
  irrelevant: {
    label: "-10 無関係な応答",
    className: "text-red-700 dark:text-red-300",
  },
}

// --- Debate data ---

const DEBATES: readonly DebateTopic[] = [
  {
    id: "uniform",
    title: "学校の制服は必要か",
    description: "学校教育における制服の義務化について議論します。",
    proPosition: "制服は必要である",
    conPosition: "制服は不要である",
    rounds: [
      {
        opponentArgument:
          "制服は生徒の個性を奪います。自己表現は基本的な権利であり、服装の自由は創造性を育みます。",
        options: [
          { id: "u1a", text: "制服は経済的格差を見えにくくし、いじめの原因を一つ減らします。教育環境の平等性は個性より優先される場合があります。", type: "valid", score: 10, feedback: "具体的な根拠（経済的格差の緩和）を示し、別の価値（平等性）を提示する正当な反論です。" },
          { id: "u1b", text: "個性は服装だけで表現されるものではありません。相手の「自己表現＝服装の自由」という前提は過度の単純化です。", type: "weakness", score: 5, feedback: "相手の暗黙の前提（個性≒服装）を指摘した良い反論です。" },
          { id: "u1c", text: "制服に反対する人は、学校の秩序を乱したいだけでしょう。", type: "fallacy", score: -5, feedback: "人身攻撃（Ad Hominem）の誤謬です。相手の動機を推測して攻撃しています。" },
          { id: "u1d", text: "日本の学校給食は栄養バランスが優れていますね。", type: "irrelevant", score: -10, feedback: "論点（制服の是非）と無関係な話題です。" },
        ],
      },
      {
        opponentArgument:
          "制服を義務化している国の方が学業成績が高いという因果関係は証明されていません。制服推進派はこのデータを根拠にしますが、相関と因果を混同しています。",
        opponentFallacy: "藁人形論法（制服推進派の主張を歪曲している可能性）",
        options: [
          {
            id: "u2a",
            text: "学業成績との因果関係は確かに未証明です。しかし制服の利点はそこではなく、毎朝の服装選択にかかる意思決定コストの削減にあります。",
            type: "valid",
            score: 10,
            feedback:
              "相手の正当な批判を認めた上で（知的誠実さ）、別の根拠を提示するのは優れた議論術です。",
          },
          {
            id: "u2b",
            text: "相手は「制服推進派は学業成績を根拠にする」と述べましたが、これは藁人形論法の可能性があります。すべての推進派がその主張をしているわけではありません。",
            type: "weakness",
            score: 5,
            feedback:
              "相手の議論の構造的弱点（藁人形論法の可能性）を正確に指摘しています。",
          },
          {
            id: "u3c",
            text: "みんな制服を着ていた時代の方が日本は良い国でした。昔に戻るべきです。",
            type: "fallacy",
            score: -5,
            feedback:
              "懐古主義的誤謬（Appeal to Tradition）です。「昔が良かった」は論理的根拠にはなりません。",
          },
          {
            id: "u2d",
            text: "統計データがなければ何も証明できません。すべてのデータは操作されている可能性があります。",
            type: "irrelevant",
            score: -10,
            feedback:
              "極端な懐疑論は建設的な議論を不可能にします。ディベートでは合理的な根拠に基づいて議論する必要があります。",
          },
        ],
      },
      {
        opponentArgument:
          "世界の多くの先進国では制服を義務化していません。フィンランドやカナダなど教育先進国は私服です。もし制服が本当に有益なら、これらの国も採用しているはずです。",
        options: [
          {
            id: "u3a",
            text: "文化的背景が異なる国の教育制度を直接比較することには限界があります。日本の集団文化における制服の機能は、個人主義的な文化圏とは異なる役割を持ちます。",
            type: "valid",
            score: 10,
            feedback:
              "文脈の違いを指摘する正当な反論です。比較の前提条件を問い直すのは論理的に有効です。",
          },
          {
            id: "u3b",
            text: "「有益なら採用しているはず」という論理は、ある制度が採用されていない＝価値がないという誤った推論です。採用されない理由は他にもあり得ます。",
            type: "weakness",
            score: 5,
            feedback:
              "相手の推論の飛躍（非採用＝無価値）を正確に指摘しています。論理構造への批判として的確です。",
          },
          {
            id: "u3c2",
            text: "フィンランドの教育が成功しているのは制服がないからではなく、教師の質が高いからです。だから制服は必要です。",
            type: "fallacy",
            score: -5,
            feedback:
              "論点先取（前提に結論を含めている）と不十分な根拠です。教師の質と制服の必要性は直接つながりません。",
          },
          {
            id: "u3d",
            text: "外国の事例を持ち出す人は愛国心が足りないのでは？",
            type: "irrelevant",
            score: -10,
            feedback:
              "論点のすり替え（Red Herring）と人身攻撃です。議論の内容ではなく、相手の姿勢を攻撃しています。",
          },
        ],
      },
    ],
  },
  {
    id: "sns",
    title: "SNSは社会に有益か",
    description: "ソーシャルメディアが社会に与える影響について議論します。",
    proPosition: "SNSは社会に有益である",
    conPosition: "SNSは社会に有害である",
    rounds: [
      {
        opponentArgument:
          "SNSはフィルターバブルを作り、人々は自分の意見を強化する情報ばかりに触れるようになります。これは民主主義にとって危険です。",
        options: [
          {
            id: "s1a",
            text: "フィルターバブルの問題は認めますが、SNS以前のメディア環境でも人々は自分の好む新聞やTV局を選んでいました。SNSはむしろ多様な意見に偶然触れる機会を増やしています。",
            type: "valid",
            score: 10,
            feedback:
              "歴史的文脈を踏まえた反論で、相手の問題提起を相対化しています。「以前も同じ問題があった」は正当な比較論法です。",
          },
          {
            id: "s1b",
            text: "「フィルターバブルが民主主義に危険」という主張は、フィルターバブルの程度と影響を過大評価している可能性があります。具体的な因果関係の証拠が必要です。",
            type: "weakness",
            score: 5,
            feedback:
              "相手の主張の根拠の強さを問う良い指摘です。主張の飛躍を指摘しています。",
          },
          {
            id: "s1c",
            text: "SNSを批判する人は、テクノロジーについていけない世代でしょう。",
            type: "fallacy",
            score: -5,
            feedback:
              "人身攻撃と世代による偏見です。相手の議論の内容ではなく、属性を攻撃しています。",
          },
          {
            id: "s1d",
            text: "そういえばインターネットの速度は年々向上していますね。",
            type: "irrelevant",
            score: -10,
            feedback:
              "論点（SNSの社会的影響）と無関係な技術的事実です。",
          },
        ],
      },
      {
        opponentArgument:
          "SNSの普及と若者のメンタルヘルス悪化は同時期に起きています。特に10代の不安障害やうつ病が増加しているデータがあります。SNSが原因です。",
        opponentFallacy: "相関と因果の混同",
        options: [
          {
            id: "s2a",
            text: "相関関係があることは認めますが、同時期には経済的不安定さや受験競争の激化など他の要因もあります。SNSだけを原因とするのは因果の過度な単純化です。",
            type: "valid",
            score: 10,
            feedback:
              "相関と因果の混同を正確に指摘し、他の変数の可能性を提示する論理的な反論です。",
          },
          {
            id: "s2b",
            text: "「SNSの普及とメンタルヘルス悪化が同時期」→「SNSが原因」という推論は、相関と因果の混同（Cum Hoc）という論理的誤謬です。",
            type: "weakness",
            score: 5,
            feedback:
              "相手の推論の論理的誤りを正確に名指しで指摘しています。",
          },
          {
            id: "s2c",
            text: "メンタルヘルスが弱い人はそもそもSNSを使うべきではありません。自己責任です。",
            type: "fallacy",
            score: -5,
            feedback:
              "論点のすり替えと被害者非難です。社会全体への影響について議論しているのに、個人の責任に矮小化しています。",
          },
          {
            id: "s2d",
            text: "SNSにはかわいい動物の動画がたくさんあって癒されます。",
            type: "irrelevant",
            score: -10,
            feedback:
              "個人的な体験であり、メンタルヘルスへの構造的影響についての議論に対する反論になっていません。",
          },
        ],
      },
      {
        opponentArgument:
          "SNS企業は利益のためにユーザーの注意を搾取しています。通知やスクロールの設計は依存性を意図的に作っています。このようなビジネスモデルは倫理的に問題です。",
        options: [
          {
            id: "s3a",
            text: "ビジネスモデルの問題点は規制によって改善可能です。EU のデジタルサービス法のように、ルールを整備することでSNS自体の情報共有機能は維持しつつ弊害を減らせます。",
            type: "valid",
            score: 10,
            feedback:
              "問題を認めつつ解決策を提示し、SNSの価値と問題を区別する建設的な反論です。",
          },
          {
            id: "s3b",
            text: "この論理では、テレビ・新聞・ゲームなど注意を引くすべてのメディアが「倫理的に問題」になります。SNSだけを特別視する根拠は何ですか？",
            type: "weakness",
            score: 5,
            feedback:
              "相手の基準を他の対象に適用することで、その基準の一貫性を問う優れた反論です。",
          },
          {
            id: "s3c",
            text: "利益を追求するのは企業として当然です。資本主義に文句を言うのは社会主義者です。",
            type: "fallacy",
            score: -5,
            feedback:
              "レッテル貼りとレッドヘリングです。倫理的問題の指摘を政治的立場の問題にすり替えています。",
          },
          {
            id: "s3d",
            text: "スマートフォンの画面は目に悪いと思います。",
            type: "irrelevant",
            score: -10,
            feedback:
              "ビジネスモデルの倫理性についての議論とは無関係です。",
          },
        ],
      },
    ],
  },
  {
    id: "autonomous",
    title: "自動運転車は安全か",
    description: "自動運転技術の安全性と社会導入について議論します。",
    proPosition: "自動運転車は安全である",
    conPosition: "自動運転車は危険である",
    rounds: [
      {
        opponentArgument:
          "自動運転車の事故がニュースで報道されるたびに、技術の未熟さが明らかになります。完璧でない技術を公道で使うべきではありません。",
        options: [
          {
            id: "a1a",
            text: "人間のドライバーによる事故は年間何万件も発生していますが、ニュースにならないだけです。自動運転は完璧でなくても、人間より事故率が低ければ社会全体の安全性は向上します。",
            type: "valid",
            score: 10,
            feedback:
              "可用性バイアス（報道される事例に引きずられる）を指摘し、統計的な比較を提示する正当な反論です。",
          },
          {
            id: "a1b",
            text: "「完璧でない技術を使うべきではない」という基準を適用すると、飛行機も医薬品も使えなくなります。相手の基準は非現実的です。",
            type: "weakness",
            score: 5,
            feedback:
              "相手の基準（完璧性の要求）の非現実性を、他の例との比較で指摘しています。",
          },
          {
            id: "a1c",
            text: "自動運転に反対する人は、技術の進歩を恐れる保守的な人々です。",
            type: "fallacy",
            score: -5,
            feedback:
              "人身攻撃です。相手の懸念に対して議論の内容で反論すべきです。",
          },
          {
            id: "a1d",
            text: "電気自動車のバッテリー技術は急速に進化していますね。",
            type: "irrelevant",
            score: -10,
            feedback:
              "自動運転の安全性とバッテリー技術は別の話題です。",
          },
        ],
      },
      {
        opponentArgument:
          "自動運転車がトロッコ問題のような倫理的判断を求められたとき、AIに人の生死を決める権限を与えるべきではありません。これは人間にしかできない判断です。",
        opponentFallacy: "誤った二分法（AIか人間かの二択に限定）",
        options: [
          {
            id: "a2a",
            text: "現実の交通事故では、人間ドライバーも「倫理的判断」をする余裕はなく、反射的に対応するだけです。むしろAIは事故を未然に防ぐ予防能力が高く、そもそもトロッコ問題的状況の発生頻度を大幅に減らせます。",
            type: "valid",
            score: 10,
            feedback:
              "前提（人間が倫理的判断をしている）を疑い、問題の枠組み自体を再構成する優れた反論です。",
          },
          {
            id: "a2b",
            text: "「AIか人間か」という二者択一ではなく、人間の監視のもとでAIが運転する協調モデルも可能です。相手は誤った二分法に陥っています。",
            type: "weakness",
            score: 5,
            feedback:
              "偽の二分法を指摘し、第三の選択肢を提示しています。",
          },
          {
            id: "a2c",
            text: "トロッコ問題はただの思考実験で、現実には起きません。哲学者の空論です。",
            type: "fallacy",
            score: -5,
            feedback:
              "権威への攻撃と過度の単純化です。倫理的ジレンマの本質を dismissするのは不誠実です。",
          },
          {
            id: "a2d",
            text: "日本の道路は狭くて運転しにくいですよね。",
            type: "irrelevant",
            score: -10,
            feedback:
              "倫理的判断の問題とは無関係な個人的感想です。",
          },
        ],
      },
      {
        opponentArgument:
          "自動運転車がハッキングされたら大惨事になります。サイバーセキュリティのリスクを考えると、命を預ける技術としては危険すぎます。",
        options: [
          {
            id: "a3a",
            text: "サイバーセキュリティのリスクは実在しますが、これは技術全般の課題であり自動運転固有の問題ではありません。航空機や原子力発電所も同様のリスクを管理しています。リスクを理由に技術自体を否定するのではなく、適切なセキュリティ対策を議論すべきです。",
            type: "valid",
            score: 10,
            feedback:
              "リスクを認めつつ、そのリスクが技術否定の根拠にならないことを、他の先例と共に論じています。",
          },
          {
            id: "a3b",
            text: "「ハッキングされたら大惨事」は最悪のシナリオだけを強調する恐怖訴求（Appeal to Fear）です。実際のリスク評価には発生確率と対策の有効性も考慮すべきです。",
            type: "weakness",
            score: 5,
            feedback:
              "相手の論証法の弱点（恐怖訴求）を構造的に指摘しています。",
          },
          {
            id: "a3c",
            text: "ハッカーなんて映画の中だけの話です。現実にはそんなことは起きません。",
            type: "fallacy",
            score: -5,
            feedback:
              "事実の否定です。サイバー攻撃は現実の脅威であり、これを否定するのは議論の信頼性を損ないます。",
          },
          {
            id: "a3d",
            text: "テスラの株価は最近上がっていますね。",
            type: "irrelevant",
            score: -10,
            feedback:
              "安全性の議論に株価は無関係です。",
          },
        ],
      },
    ],
  },
]

// --- Component ---

export function DebateSimulator() {
  const [selectedDebateId, setSelectedDebateId] = useState<string | null>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [results, setResults] = useState<readonly RoundResult[]>([])

  const debate = DEBATES.find((d) => d.id === selectedDebateId)
  const round = debate?.rounds[currentRound]
  const isComplete = debate !== undefined && currentRound >= debate.rounds.length && results.length > 0
  const totalScore = results.reduce((sum, r) => sum + r.score, 0)

  const handleSelectDebate = useCallback((id: string) => {
    setSelectedDebateId(id)
    setPosition(null)
    setCurrentRound(0)
    setSelectedOptionId(null)
    setIsRevealed(false)
    setResults([])
  }, [])

  const handleSelectPosition = useCallback((pos: Position) => {
    setPosition(pos)
  }, [])

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (isRevealed) return
      setSelectedOptionId(optionId)
    },
    [isRevealed],
  )

  const handleSubmit = useCallback(() => {
    if (selectedOptionId === null || !round) return
    setIsRevealed(true)
    const option = round.options.find((o) => o.id === selectedOptionId)
    if (option) {
      setResults((prev) => [
        ...prev,
        {
          round: currentRound + 1,
          score: option.score,
          feedback: option.feedback,
          type: option.type,
        },
      ])
    }
  }, [selectedOptionId, round, currentRound])

  const handleNextRound = useCallback(() => {
    if (!debate) return
    setCurrentRound((prev) => prev + 1)
    setSelectedOptionId(null)
    setIsRevealed(false)
  }, [debate])

  const handleBackToList = useCallback(() => {
    setSelectedDebateId(null)
    setPosition(null)
    setCurrentRound(0)
    setSelectedOptionId(null)
    setIsRevealed(false)
    setResults([])
  }, [])

  const handleReset = useCallback(() => {
    setPosition(null)
    setCurrentRound(0)
    setSelectedOptionId(null)
    setIsRevealed(false)
    setResults([])
  }, [])

  return (
    <div className="not-prose my-6">
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          ディベートシミュレーション
        </div>

        {/* Debate selection */}
        {!debate && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-3">
              論題を選んでディベートに挑戦しましょう。論理的な議論力が試されます。
            </div>
            {DEBATES.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDebate(d.id)}
                className="w-full text-left px-4 py-3 rounded-md border border-border bg-background hover:border-primary/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    #{i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {d.rounds.length}ラウンド
                  </span>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {d.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {d.description}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Position selection */}
        {debate && !position && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleBackToList}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              &larr; 論題一覧に戻る
            </button>
            <div className="text-base font-medium text-foreground">
              {debate.title}
            </div>
            <div className="text-sm text-muted-foreground">
              立場を選択してください。あなたが選んだ立場の側として議論します。
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectPosition("pro")}
                className="px-4 py-3 rounded-md border border-border bg-background hover:border-primary/50 transition-all duration-200 text-center cursor-pointer"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  賛成
                </div>
                <div className="text-sm text-foreground">
                  {debate.proPosition}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPosition("con")}
                className="px-4 py-3 rounded-md border border-border bg-background hover:border-primary/50 transition-all duration-200 text-center cursor-pointer"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
                  反対
                </div>
                <div className="text-sm text-foreground">
                  {debate.conPosition}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Active debate round */}
        {debate && position && !isComplete && round && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  position === "pro"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {position === "pro" ? "賛成" : "反対"}側
                </span>
                <span className="text-xs text-muted-foreground">
                  {debate.title}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                ラウンド {currentRound + 1} / {debate.rounds.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-1.5">
              {debate.rounds.map((_, i) => (
                <div
                  key={`round-${debate.id}-${i}`}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i < results.length
                      ? results[i].score > 0
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-red-500 dark:bg-red-400"
                      : i === currentRound
                        ? "bg-primary/50"
                        : "bg-border"
                  }`}
                />
              ))}
            </div>

            {/* Score display */}
            <div className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary border border-border">
              <span className="text-xs text-muted-foreground">現在のスコア</span>
              <span className={`text-sm font-bold font-mono ${
                totalScore > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : totalScore < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
              }`}>
                {totalScore > 0 ? "+" : ""}{totalScore}点
              </span>
            </div>

            {/* Opponent argument */}
            <div className="px-4 py-3 rounded-md bg-falsehood/10 border border-falsehood/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-falsehood mb-2">
                相手の主張
              </div>
              <div className="text-sm text-foreground leading-relaxed">
                {round.opponentArgument}
              </div>
            </div>

            {/* Response options */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                あなたの応答を選択
              </div>
              <div className="space-y-2">
                {round.options.map((option) => {
                  const isSelected = selectedOptionId === option.id
                  const showResult = isRevealed
                  const optionScore = SCORE_MAP[option.type]

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option.id)}
                      disabled={isRevealed}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm border transition-all duration-200 ${
                        showResult && isSelected && option.score > 0
                          ? "bg-truth/10 border-truth text-foreground"
                          : showResult && isSelected && option.score <= 0
                            ? "bg-falsehood/10 border-falsehood text-foreground"
                            : showResult && option.score > 0
                              ? "bg-truth/5 border-truth/30 text-foreground"
                              : isSelected
                                ? "bg-primary/10 border-primary"
                                : "bg-background border-border hover:border-primary/50"
                      } ${isRevealed ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="text-foreground">{option.text}</div>
                      {showResult && (
                        <div className={`text-xs font-semibold mt-2 ${optionScore.className}`}>
                          {optionScore.label}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            {!isRevealed && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedOptionId === null}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  selectedOptionId !== null
                    ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                }`}
              >
                この応答で反論する
              </button>
            )}

            {/* Feedback */}
            {isRevealed && (
              <div className="space-y-3">
                {(() => {
                  const selected = round.options.find((o) => o.id === selectedOptionId)
                  if (!selected) return null
                  return (
                    <div className={`px-4 py-3 rounded-md text-sm ${
                      selected.score > 0
                        ? "bg-truth/10 border border-truth/30"
                        : "bg-falsehood/10 border border-falsehood/30"
                    }`}>
                      <div className={`font-medium mb-1 ${
                        selected.score > 0 ? "text-truth" : "text-falsehood"
                      }`}>
                        {selected.score > 0 ? "良い反論です" : "論理的に問題があります"}
                      </div>
                      <div className="text-sm text-foreground">{selected.feedback}</div>
                    </div>
                  )
                })()}

                {round.opponentFallacy && (
                  <div className="px-4 py-3 rounded-md bg-secondary border border-border">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      相手の議論に含まれる弱点
                    </div>
                    <div className="text-sm text-foreground font-mono">
                      {round.opponentFallacy}
                    </div>
                  </div>
                )}

                {currentRound < debate.rounds.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
                  >
                    次のラウンドへ
                  </button>
                )}

                {currentRound === debate.rounds.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
                  >
                    最終結果を見る
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Final results */}
        {isComplete && debate && (
          <div className="space-y-4">
            <div className="text-center space-y-2 py-2">
              <div className="text-base font-medium text-foreground">
                {debate.title} — 最終結果
              </div>
              <div className={`text-3xl font-bold font-mono ${
                totalScore > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : totalScore < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
              }`}>
                {totalScore > 0 ? "+" : ""}{totalScore}点
              </div>
              <div className="text-sm text-muted-foreground">
                {totalScore >= 25
                  ? "優秀な論理的議論力です。誤謬を避け、正当な推論で議論を展開できました。"
                  : totalScore >= 10
                    ? "良い議論でした。さらに相手の弱点を見抜く力を磨きましょう。"
                    : totalScore >= 0
                      ? "基本的な議論はできていますが、論理的な精度を高める余地があります。"
                      : "論理的誤謬に注意しましょう。相手の主張の内容に焦点を当てて反論することが重要です。"}
              </div>
            </div>

            {/* Round-by-round breakdown */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                ラウンド別結果
              </div>
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={`result-${result.round}`}
                    className="flex items-center justify-between px-3 py-2 rounded-md bg-background border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        R{result.round}
                      </span>
                      <span className="text-sm text-foreground">
                        {SCORE_MAP[result.type].label}
                      </span>
                    </div>
                    <span className={`text-sm font-bold font-mono ${
                      result.score > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {result.score > 0 ? "+" : ""}{result.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 cursor-pointer"
              >
                もう一度挑戦する
              </button>
              <button
                type="button"
                onClick={handleBackToList}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                他の論題を選ぶ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
