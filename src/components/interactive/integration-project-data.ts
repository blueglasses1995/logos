/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StepTask {
  readonly id: string
  readonly instruction: string
  readonly chapterRef: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly hint: string
  readonly successMessage: string
}

export interface Project {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly scenario: string
  readonly steps: readonly StepTask[]
}

export interface StepState {
  readonly selectedIndex: number | null
  readonly completed: boolean
  readonly attempts: number
}

export type ProjectState = readonly StepState[]

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                    */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "logos-integration-projects"

export function loadProjectState(projectId: string): ProjectState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Record<string, ProjectState>
    return data[projectId] ?? null
  } catch {
    return null
  }
}

export function saveProjectState(projectId: string, state: ProjectState): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? (JSON.parse(raw) as Record<string, ProjectState>) : {}
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, [projectId]: state })
    )
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/*  Project data                                                       */
/* ------------------------------------------------------------------ */

export const PROJECTS: readonly Project[] = [
  {
    id: "contract-analysis",
    title: "論理的契約分析",
    description: "利用規約の論理構造を分析し、隠れた論理的問題を見つけ出す",
    scenario:
      "あるソフトウェアの利用規約に次の条項があります：「本サービスを利用する場合、利用者はすべての規約に同意したものとみなす。規約に同意しない場合、本サービスを利用できない。不正利用が発覚した場合、アカウントは即座に停止される。」",
    steps: [
      {
        id: "c1",
        instruction:
          "まず、「本サービスを利用する場合、すべての規約に同意したものとみなす」を命題論理で表現してください。P=「サービスを利用する」、Q=「規約に同意する」とします。",
        chapterRef: "第1章 命題と論理結合子",
        options: ["P ∧ Q", "P → Q", "P ∨ Q", "Q → P"],
        correctIndex: 1,
        hint: "「〜する場合、〜する」は条件文（IF-THEN）です。",
        successMessage:
          "正解！「利用するならば同意したとみなす」は P → Q の条件文です。",
      },
      {
        id: "c2",
        instruction:
          "次に、「規約に同意しない場合、サービスを利用できない」は P → Q の何にあたりますか？",
        chapterRef: "第2章 真理値表と恒真式",
        options: ["逆 (Q → P)", "裏 (¬P → ¬Q)", "対偶 (¬Q → ¬P)", "元の命題と同じ"],
        correctIndex: 2,
        hint: "「同意しない→利用できない」は ¬Q → ¬P の形です。対偶は元の命題と論理的に同値です。",
        successMessage:
          "正解！これは対偶（¬Q → ¬P）であり、元の P → Q と論理的に同値です。冗長な条項と言えます。",
      },
      {
        id: "c3",
        instruction:
          "「不正利用が発覚した場合、アカウントは即座に停止される」について。R=「不正利用が発覚」、S=「アカウント停止」とすると、この条項は論証として妥当ですか？",
        chapterRef: "第3章 論証の妥当性と健全性",
        options: [
          "妥当かつ健全",
          "妥当だが健全とは限らない",
          "妥当性を判断するには情報不足",
          "妥当でない",
        ],
        correctIndex: 2,
        hint: "「不正利用」の定義が曖昧なまま、妥当性の判断は可能でしょうか？",
        successMessage:
          "正解！「不正利用」が厳密に定義されていないため、R の真偽が確定せず、論証の妥当性を完全には評価できません。",
      },
      {
        id: "c4",
        instruction:
          "この規約を述語論理で一般化します。「すべての利用者 x について、x が不正利用をしたならば、x のアカウントは停止される」を形式化してください。",
        chapterRef: "第4章 述語と量化子",
        options: [
          "∃x (利用者(x) → (不正利用(x) → 停止(x)))",
          "∀x (利用者(x) ∧ 不正利用(x) → 停止(x))",
          "∀x (不正利用(x) → 利用者(x))",
          "∀x (利用者(x) → 不正利用(x))",
        ],
        correctIndex: 1,
        hint: "「すべての利用者 x が不正利用するなら停止」は ∀x (前提の連言 → 結論) の形です。",
        successMessage:
          "正解！∀x (利用者(x) ∧ 不正利用(x) → 停止(x)) が正しい形式化です。",
      },
      {
        id: "c5",
        instruction:
          "契約書で「サービスを利用しているのだから規約に同意しているはずだ」と主張された場合、これはどの誤謬に該当しますか？",
        chapterRef: "第5章 非形式的誤謬",
        options: [
          "人身攻撃（Ad Hominem）",
          "循環論法（Begging the Question）",
          "偽の二択（False Dilemma）",
          "論点先取 — みなし同意の押し付け",
        ],
        correctIndex: 3,
        hint: "利用と同意を同一視することで、実質的に同意を前提に同意を主張しています。",
        successMessage:
          "正解！「利用=同意」と定義した上で「利用しているから同意している」と主張するのは、論点先取の一種です。",
      },
    ],
  },
  {
    id: "scientific-verification",
    title: "科学論文の論理検証",
    description: "科学的主張の論理構造を分解・検証し、推論の妥当性を評価する",
    scenario:
      "ある論文の要旨：「実験群のマウス100匹すべてに薬Xを投与したところ、80匹で腫瘍が縮小した。したがって、薬Xは癌の治療に効果がある。対照群との比較でも統計的に有意な差が出た。」",
    steps: [
      {
        id: "s1",
        instruction:
          "「薬Xを投与したところ腫瘍が縮小した」を命題論理で表現します。D=「薬X投与」、R=「腫瘍縮小」。データが示しているのはどれですか？",
        chapterRef: "第1章 命題と論理結合子",
        options: ["D → R", "D ∧ R", "D ↔ R", "R → D"],
        correctIndex: 1,
        hint: "データは「投与した、かつ縮小した」という事実の観察です。因果関係ではなく共起です。",
        successMessage:
          "正解！観察データは D ∧ R（投与と縮小の共起）であり、D → R（因果）とは異なります。",
      },
      {
        id: "s2",
        instruction:
          "80/100 = 80%の成功率をもって「薬Xは効果がある」と結論づけています。「D → R が常に成り立つ」はこのデータから言えますか？真理値表の観点で考えてください。",
        chapterRef: "第2章 真理値表と恒真式",
        options: [
          "恒真式であるため常に成り立つ",
          "20匹で偽になるので恒真式ではない",
          "真理値表は適用できない",
          "80%以上なので実質的に恒真",
        ],
        correctIndex: 1,
        hint: "D=T, R=F のケース（投与したが縮小しなかった）が20件存在します。",
        successMessage:
          "正解！D → R は20匹で偽になります。つまり「薬X投与 → 必ず腫瘍縮小」は恒真ではありません。",
      },
      {
        id: "s3",
        instruction:
          "「全マウスに薬Xを投与し、80%で腫瘍が縮小した。ゆえに薬Xは癌に有効」— この論証の形式的妥当性を評価してください。",
        chapterRef: "第3章 論証の妥当性と健全性",
        options: [
          "妥当 — 前提が真なら結論も必ず真",
          "不妥当 — 80%の成功は100%を保証しない",
          "健全だが妥当でない",
          "前提が偽なので判断不能",
        ],
        correctIndex: 1,
        hint: "妥当性とは「前提が真なら結論が必ず真」です。統計的傾向は演繹的な必然性を与えません。",
        successMessage:
          "正解！帰納的推論では演繹的妥当性は成立しません。80%の成功は「必ず効く」を論理的に保証しません。",
      },
      {
        id: "s4",
        instruction:
          "この論文の主張を述語論理で精密に表現します。正しい形式化はどれですか？",
        chapterRef: "第4章 述語と量化子",
        options: [
          "∀x (マウス(x) ∧ 投与(x) → 縮小(x))",
          "∃x (マウス(x) ∧ 投与(x) ∧ ¬縮小(x))",
          "データ: ∃x(¬縮小(x)) より、¬∀x(投与(x) → 縮小(x))",
          "∀x (縮小(x) → 投与(x))",
        ],
        correctIndex: 2,
        hint: "20匹が縮小しなかった事実 ∃x(¬縮小(x)) から、全称命題の否定が導けます。",
        successMessage:
          "正解！反例が存在するため ¬∀x(投与(x) → 縮小(x)) が成立します。全称的な有効性は主張できません。",
      },
      {
        id: "s5",
        instruction:
          "この論文が「薬Xは効果がある」と断定する際に犯しうる誤謬を特定してください。",
        chapterRef: "第5章 非形式的誤謬",
        options: [
          "藁人形論法（Straw Man）",
          "性急な一般化（Hasty Generalization）",
          "権威への訴え（Appeal to Authority）",
          "後件肯定の誤り（Affirming the Consequent）",
        ],
        correctIndex: 1,
        hint: "100匹のマウスの結果を、癌全般の治療効果に一般化しています。",
        successMessage:
          "正解！限られたサンプルから「癌に効果がある」と断定するのは性急な一般化です。",
      },
    ],
  },
  {
    id: "business-proposal",
    title: "ビジネス提案の論理構築",
    description: "ビジネス提案を論理的に構築し、反論に対して堅牢な議論を作る",
    scenario:
      "あなたはスタートアップのCEOで、投資家にリモートワーク支援ツールを提案します：「リモートワーカーは増加している。コミュニケーション不足が生産性低下の原因だ。我々のツールはこの問題を解決する。」",
    steps: [
      {
        id: "b1",
        instruction:
          "提案の骨子を命題に分解します。P=「リモートワーカー増加」、Q=「コミュニケーション不足」、R=「生産性低下」、S=「ツールで解決」。全体の論理構造はどれですか？",
        chapterRef: "第1章 命題と論理結合子",
        options: [
          "P ∧ (Q → R) ∧ (S → ¬Q)",
          "(P ∧ Q ∧ R) → S",
          "P → (Q → (R → S))",
          "P ∨ Q ∨ R → S",
        ],
        correctIndex: 0,
        hint: "「増加している」は事実P、「不足→低下」は因果Q→R、「ツール→不足解消」はS→¬Qです。",
        successMessage:
          "正解！P ∧ (Q → R) ∧ (S → ¬Q) — 事実の提示、因果の主張、解決策の提案が論理的に組み合わさっています。",
      },
      {
        id: "b2",
        instruction:
          "投資家が「コミュニケーション不足がなくても生産性は低下する」と反論しました。これは真理値表の観点でどういう意味ですか？",
        chapterRef: "第2章 真理値表と恒真式",
        options: [
          "Q → R は恒真式だという主張",
          "Q = F かつ R = T のケースを指摘 — Q → R の反例ではない",
          "Q = F かつ R = T のケースを指摘 — 「Q が R の唯一の原因」の反例",
          "Q → R が矛盾であるという主張",
        ],
        correctIndex: 2,
        hint: "Q→R は「不足なら低下」であり、「不足でなくても低下」はQ→Rの真偽に影響しませんが、因果の唯一性には影響します。",
        successMessage:
          "正解！Q=F, R=Tのケースは Q→R の真偽には影響しませんが、「Q が R の唯一の原因」という主張の反例です。",
      },
      {
        id: "b3",
        instruction:
          "提案全体を論証として再構成します。「P, Q→R, S→¬Q ∴ S→¬R」。この論証は妥当ですか？",
        chapterRef: "第3章 論証の妥当性と健全性",
        options: [
          "妥当 — 三段論法により成立",
          "不妥当 — Q→R から ¬Q→¬R は導けない（裏の誤り）",
          "妥当 — 対偶により成立",
          "健全だが妥当でない",
        ],
        correctIndex: 1,
        hint: "Q→R の裏は ¬Q→¬R ですが、裏は元の命題と論理的に同値ではありません。",
        successMessage:
          "正解！Q→R から ¬Q→¬R を導くのは「裏の誤り」です。コミュニケーション不足を解消しても、他の原因で生産性が低下する可能性があります。",
      },
      {
        id: "b4",
        instruction:
          "論証を修正します。「すべての企業xについて、xがツールSを導入し、かつコミュニケーション不足が主因であるならば、生産性が改善する」。正しい形式化は？",
        chapterRef: "第4章 述語と量化子",
        options: [
          "∀x (企業(x) → 改善(x))",
          "∀x (企業(x) ∧ 導入(x,S) ∧ 主因(x,Q) → 改善(x))",
          "∃x (企業(x) ∧ 導入(x,S) → 改善(x))",
          "∀x (導入(x,S) ↔ 改善(x))",
        ],
        correctIndex: 1,
        hint: "条件を十分に限定する全称命題が求められます。",
        successMessage:
          "正解！条件を「ツール導入 ∧ 主因がコミュニケーション不足」に限定することで、裏の誤りを回避できます。",
      },
      {
        id: "b5",
        instruction:
          "投資家が「競合他社も同じことを言っていた」と反論しました。この反論はどの誤謬ですか？",
        chapterRef: "第5章 非形式的誤謬",
        options: [
          "論点のすり替え（Red Herring）",
          "連座の誤謬（Guilt by Association）",
          "権威への訴え（Appeal to Authority）",
          "人身攻撃（Ad Hominem）",
        ],
        correctIndex: 1,
        hint: "競合の失敗を根拠に提案の論理的妥当性を否定するのは、内容ではなく関連を攻撃しています。",
        successMessage:
          "正解！競合の結果と提案の論理的妥当性は独立です。これは連座の誤謬（関連による有罪推定）にあたります。",
      },
    ],
  },
]
