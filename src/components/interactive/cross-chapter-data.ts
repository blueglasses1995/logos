export interface ExerciseStep {
  readonly id: string
  readonly instruction: string
  readonly chapterRef: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly hint: string
}

export interface Exercise {
  readonly id: string
  readonly title: string
  readonly chapters: readonly string[]
  readonly context: string
  readonly steps: readonly ExerciseStep[]
  readonly summary: string
}

export const CROSS_CHAPTER_EXERCISES: readonly Exercise[] = [
  {
    id: "prop-pred",
    title: "命題論理から述語論理への変換",
    chapters: ["第1章 命題論理", "第3章 述語論理"],
    context:
      "次の複合命題を考えます：「すべての学生が試験に合格し、かつ少なくとも一人の学生が満点を取った。」",
    steps: [
      {
        id: "pp-1",
        instruction: "まず命題論理の観点から、この文の論理構造を特定してください。",
        chapterRef: "第1章",
        options: ["P \u2192 Q", "P \u2227 Q", "P \u2228 Q", "\u00acP \u2227 Q"],
        correctIndex: 1,
        hint: "「...し、かつ...」は連言（AND）を表します。",
      },
      {
        id: "pp-2",
        instruction:
          "次に P の部分「すべての学生が試験に合格」を述語論理で表現してください。",
        chapterRef: "第3章",
        options: [
          "\u2200x(S(x) \u2192 P(x))",
          "\u2203x(S(x) \u2227 P(x))",
          "\u2200x(P(x))",
          "S(x) \u2192 P(x)",
        ],
        correctIndex: 0,
        hint: "「すべての〜が...」は全称量化子 \u2200 と条件文で表します。",
      },
      {
        id: "pp-3",
        instruction:
          "Q の部分「少なくとも一人の学生が満点を取った」を述語論理で表現してください。",
        chapterRef: "第3章",
        options: [
          "\u2200x(S(x) \u2192 M(x))",
          "\u2203x(S(x) \u2227 M(x))",
          "\u2203x(M(x))",
          "\u00ac\u2200x(\u00acM(x))",
        ],
        correctIndex: 1,
        hint: "「少なくとも一人の〜が...」は存在量化子 \u2203 と連言で表します。",
      },
      {
        id: "pp-4",
        instruction: "最終的な述語論理の式を選んでください。",
        chapterRef: "第1章 + 第3章",
        options: [
          "\u2200x(S(x) \u2192 P(x)) \u2227 \u2203x(S(x) \u2227 M(x))",
          "\u2200x(S(x) \u2192 P(x)) \u2228 \u2203x(S(x) \u2227 M(x))",
          "\u2203x(S(x) \u2227 P(x)) \u2227 \u2200x(S(x) \u2192 M(x))",
          "\u2200x(S(x) \u2227 P(x) \u2227 M(x))",
        ],
        correctIndex: 0,
        hint: "P \u2227 Q の構造を維持しながら、各部分を述語論理に置き換えます。",
      },
    ],
    summary:
      "命題論理で全体構造（P \u2227 Q）を把握し、各命題を述語論理で精密に表現することで、自然言語の論理構造を形式化できました。",
  },
  {
    id: "tt-validity",
    title: "真理値表による妥当性検証",
    chapters: ["第2章 真理値表", "第5章 妥当性"],
    context:
      "次の論証を検証します：前提1「雨が降れば地面が濡れる (P \u2192 Q)」、前提2「地面が濡れている (Q)」、結論「雨が降った (P)」。",
    steps: [
      {
        id: "tv-1",
        instruction: "この論証の形式は何と呼ばれますか？",
        chapterRef: "第5章",
        options: [
          "モーダスポネンス（肯定式）",
          "モーダストレンス（否定式）",
          "後件肯定の誤謬",
          "前件否定の誤謬",
        ],
        correctIndex: 2,
        hint: "Q が真であることから P を導くのは妥当な推論でしょうか？",
      },
      {
        id: "tv-2",
        instruction: "真理値表で、P=F, Q=T のとき「P \u2192 Q」の値は？",
        chapterRef: "第2章",
        options: ["T（真）", "F（偽）"],
        correctIndex: 0,
        hint: "条件文は前件が偽のとき常に真です。",
      },
      {
        id: "tv-3",
        instruction:
          "P=F, Q=T の行で、前提はすべて真ですが結論 P は偽です。これは何を意味しますか？",
        chapterRef: "第5章",
        options: [
          "論証は妥当である",
          "論証は妥当でない（反例が存在する）",
          "前提が矛盾している",
          "結論は常に真である",
        ],
        correctIndex: 1,
        hint: "すべての前提が真で結論が偽になるケースがあれば、論証は妥当ではありません。",
      },
    ],
    summary:
      "真理値表を使って具体的な真理値の組み合わせを検査することで、後件肯定の誤謬が妥当でないことを体系的に証明できました。",
  },
  {
    id: "quant-fallacy",
    title: "量化子規則と誤謬の関係",
    chapters: ["第3章 述語論理", "第6章 誤謬"],
    context:
      "ある政治家が主張します：「ある専門家がこの政策を支持している。したがって、すべての専門家がこの政策を支持している。」",
    steps: [
      {
        id: "qf-1",
        instruction:
          "前提を述語論理で形式化してください。E(x):専門家、S(x):支持する",
        chapterRef: "第3章",
        options: [
          "\u2200x(E(x) \u2192 S(x))",
          "\u2203x(E(x) \u2227 S(x))",
          "E(a) \u2192 S(a)",
          "\u00ac\u2203x(E(x) \u2227 S(x))",
        ],
        correctIndex: 1,
        hint: "「ある〜が...」は存在量化子で表します。",
      },
      {
        id: "qf-2",
        instruction: "結論を述語論理で形式化してください。",
        chapterRef: "第3章",
        options: [
          "\u2203x(E(x) \u2227 S(x))",
          "\u2200x(E(x) \u2192 S(x))",
          "\u2200x(S(x))",
          "E(a) \u2227 S(a)",
        ],
        correctIndex: 1,
        hint: "「すべての〜が...」は全称量化子で表します。",
      },
      {
        id: "qf-3",
        instruction:
          "\u2203x(...) から \u2200x(...) への推論は、どの量化子規則に違反していますか？",
        chapterRef: "第3章",
        options: [
          "全称例化の規則",
          "存在汎化の規則",
          "存在から全称への不正な一般化",
          "全称から存在への推論規則",
        ],
        correctIndex: 2,
        hint: "「ある」から「すべて」を導くことはできません。",
      },
      {
        id: "qf-4",
        instruction: "この論証に含まれる誤謬はどれですか？",
        chapterRef: "第6章",
        options: [
          "人身攻撃（ad hominem）",
          "早まった一般化（hasty generalization）",
          "権威への訴え（appeal to authority）",
          "藁人形論法（straw man）",
        ],
        correctIndex: 1,
        hint: "一部の事例からすべてに一般化する誤謬です。",
      },
    ],
    summary:
      "述語論理の量化子規則から見ると \u2203 から \u2200 への推論は不正であり、これは非形式論理では「早まった一般化」という誤謬に対応します。形式論理と非形式論理は同じ誤りを異なる角度から分析できます。",
  },
  {
    id: "pred-sql",
    title: "述語論理とSQLの対応",
    chapters: ["第3章 述語論理", "第4章 SQL"],
    context:
      "データベースに「students」テーブルがあります。条件：「20歳以上で、かつ成績がAの学生をすべて取得する」をクエリにします。",
    steps: [
      {
        id: "ps-1",
        instruction:
          "この条件を述語論理で形式化してください。S(x):学生、A(x):20歳以上、G(x):成績A",
        chapterRef: "第3章",
        options: [
          "\u2200x(S(x) \u2192 (A(x) \u2227 G(x)))",
          "{x | S(x) \u2227 A(x) \u2227 G(x)}",
          "\u2203x(S(x) \u2227 A(x) \u2227 G(x))",
          "S(x) \u2228 A(x) \u2228 G(x)",
        ],
        correctIndex: 1,
        hint: "集合を定義する条件として、すべての述語を連言で結びます。",
      },
      {
        id: "ps-2",
        instruction: "述語 A(x) は SQL の WHERE 句でどのように書きますか？",
        chapterRef: "第4章",
        options: [
          "WHERE age >= 20",
          "WHERE age > 20",
          "WHERE age = 20",
          "HAVING age >= 20",
        ],
        correctIndex: 0,
        hint: "「20歳以上」は「age が 20 以上」を意味します。",
      },
      {
        id: "ps-3",
        instruction:
          "述語論理の連言 \u2227 は SQL ではどの演算子に対応しますか？",
        chapterRef: "第3章 + 第4章",
        options: ["OR", "AND", "NOT", "IN"],
        correctIndex: 1,
        hint: "連言（\u2227）は両方の条件がともに成り立つことを要求します。",
      },
      {
        id: "ps-4",
        instruction: "完成した SQL クエリを選んでください。",
        chapterRef: "第4章",
        options: [
          "SELECT * FROM students WHERE age >= 20 AND grade = 'A'",
          "SELECT * FROM students WHERE age >= 20 OR grade = 'A'",
          "SELECT * FROM students HAVING age >= 20 AND grade = 'A'",
          "SELECT grade FROM students WHERE age >= 20",
        ],
        correctIndex: 0,
        hint: "述語論理の集合定義 {x | ...} は SELECT ... WHERE ... に対応します。",
      },
    ],
    summary:
      "述語論理の集合記法 {x | P(x) \u2227 Q(x)} は SQL の SELECT ... WHERE P AND Q に直接対応します。論理演算子と SQL 演算子のマッピングを理解すると、クエリの設計が明確になります。",
  },
  {
    id: "integrated",
    title: "総合分析：論証の完全検証",
    chapters: [
      "第1章 命題論理",
      "第2章 真理値表",
      "第5章 妥当性",
      "第6章 誤謬",
    ],
    context:
      "友人が主張します：「環境に良い製品は高い。この製品は高い。だからこの製品は環境に良い。」(P \u2192 Q, Q \u22a2 P)",
    steps: [
      {
        id: "int-1",
        instruction:
          "この論証を命題論理で形式化してください。P=環境に良い、Q=高い",
        chapterRef: "第1章",
        options: [
          "前提: P \u2192 Q, Q  結論: P",
          "前提: P \u2192 Q, P  結論: Q",
          "前提: P \u2227 Q  結論: P",
          "前提: Q \u2192 P, Q  結論: P",
        ],
        correctIndex: 0,
        hint: "前提と結論をそのまま記号化します。",
      },
      {
        id: "int-2",
        instruction: "P=F, Q=T のとき (P \u2192 Q) \u2227 Q の真理値は？",
        chapterRef: "第2章",
        options: ["T（真）", "F（偽）"],
        correctIndex: 0,
        hint: "F \u2192 T = T、かつ Q = T なので、連言は T です。",
      },
      {
        id: "int-3",
        instruction:
          "上の行で結論 P は偽です。これにより論証の妥当性についてどう判断しますか？",
        chapterRef: "第5章",
        options: [
          "妥当：すべての場合で結論は真",
          "妥当でない：前提が真で結論が偽の反例がある",
          "判断不能：情報が不足",
          "妥当：前提の一つが偽だから",
        ],
        correctIndex: 1,
        hint: "反例（前提がすべて真で結論が偽）が一つでもあれば妥当ではありません。",
      },
      {
        id: "int-4",
        instruction: "この誤った推論パターンの名前は何ですか？",
        chapterRef: "第6章",
        options: [
          "前件否定の誤謬",
          "後件肯定の誤謬",
          "循環論法",
          "誤った二分法",
        ],
        correctIndex: 1,
        hint: "後件（Q）を肯定して前件（P）を導こうとする誤謬です。",
      },
      {
        id: "int-5",
        instruction:
          "この誤謬を避けるために、どのような追加情報が必要ですか？",
        chapterRef: "第5章 + 第6章",
        options: [
          "Q \u2192 P（逆も成立すること）の証拠",
          "P の具体例をもう一つ",
          "Q が偽であること",
          "別の専門家の意見",
        ],
        correctIndex: 0,
        hint: "P \u2192 Q だけでなく Q \u2192 P（逆）も成り立てば、P \u2194 Q となり妥当な推論になります。",
      },
    ],
    summary:
      "一つの論証を命題論理で形式化し、真理値表で反例を見つけ、妥当性を判定し、誤謬の種類を特定しました。複数の分析ツールを組み合わせることで、誤った推論を多角的に理解できます。",
  },
]
