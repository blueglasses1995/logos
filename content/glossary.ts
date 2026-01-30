export interface GlossaryEntry {
  readonly term: string
  readonly reading?: string
  readonly description: string
  readonly relatedChapters: readonly {
    readonly slug: string
    readonly label: string
  }[]
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  // 第1章: 命題論理
  {
    term: "命題",
    description:
      "真か偽のいずれか一方の値を持つ文のこと。「東京は日本の首都である」は真の命題、「2+2=5」は偽の命題。疑問文や命令文は命題ではない。命題論理の最も基本的な構成要素。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 命題と論理結合子" },
    ],
  },
  {
    term: "論理結合子",
    description:
      "命題を結合して複合命題を作る演算子の総称。¬（否定）、∧（連言）、∨（選言）、→（条件法）、↔（双条件法）の5つが基本。ブール代数ではAND・OR・NOTに対応し、デジタル回路の設計原理でもある。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 命題と論理結合子" },
      { slug: "02-truth-tables", label: "第2章: 真理値表" },
    ],
  },
  {
    term: "アリストテレス",
    description:
      "紀元前384-322年。プラトンの弟子で、西洋論理学の創始者。著作群『オルガノン（道具）』で三段論法を体系化し、約2000年間にわたって論理学の標準的体系を確立した。論理学を哲学の一部門ではなく、あらゆる学問に先立つ「道具」と位置づけた。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 哲学コラム" },
    ],
  },
  {
    term: "三段論法",
    description:
      "アリストテレスが定式化した推論形式。2つの前提から1つの結論を導く。例:「すべての人間は死すべきものである。ソクラテスは人間である。ゆえにソクラテスは死すべきものである。」約2000年間、論理学の中核として使われた。",
    relatedChapters: [
      { slug: "01-propositions", label: "第1章: 哲学コラム" },
      { slug: "04-predicate-logic", label: "第4章: 述語論理" },
    ],
  },

  // 第2章: 真理値表
  {
    term: "真理値表",
    description:
      "複合命題のすべての可能な真偽の組み合わせを一覧にした表。命題変数がn個あれば2^n行になる。トートロジーや論理的同値の判定に使われる。ライプニッツの「計算しましょう（calculemus）」の夢の部分的実現。",
    relatedChapters: [
      { slug: "02-truth-tables", label: "第2章: 真理値表とトートロジー" },
    ],
  },
  {
    term: "トートロジー",
    description:
      "命題変数にどのような真偽値を代入しても常に真になる論理式。例: P ∨ ¬P（排中律）。トートロジーは論理法則であり、世界についての情報を含まないが、推論の妥当性を保証する基盤となる。",
    relatedChapters: [
      { slug: "02-truth-tables", label: "第2章: 真理値表とトートロジー" },
    ],
  },
  {
    term: "ライプニッツ",
    reading: "ゴットフリート・ヴィルヘルム・ライプニッツ",
    description:
      "1646-1716年。ドイツの哲学者・数学者。30年戦争の記憶から「争いを計算で解決する」という普遍的記号法（characteristica universalis）を構想した。「計算しましょう（calculemus）」の宣言は有名。微積分をニュートンと独立に発見した人物でもある。",
    relatedChapters: [
      { slug: "02-truth-tables", label: "第2章: 哲学コラム" },
    ],
  },

  // 第3章: 妥当性と健全性
  {
    term: "妥当性",
    description:
      "推論の形式的な正しさ。前提がすべて真であると仮定した場合に、結論も必ず真になる推論形式を「妥当」と呼ぶ。前提の内容が実際に真かどうかは問わない。妥当かつ前提が実際に真である推論は「健全」と呼ばれる。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
    ],
  },
  {
    term: "健全性",
    description:
      "推論が妥当であり、かつすべての前提が実際に真であること。健全な推論の結論は必ず真である。論理学において最も信頼できる推論の形式。「妥当だが不健全」な推論は形式は正しいが前提が偽。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
    ],
  },
  {
    term: "モーダスポネンス",
    description:
      "最も基本的な妥当な推論形式の一つ。「PならばQ」と「P」から「Q」を導く。前件肯定（modus ponens）とも呼ばれる。日常の推論でも頻繁に使われる形式。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
    ],
  },
  {
    term: "モーダストレンス",
    description:
      "「PならばQ」と「Qでない」から「Pでない」を導く妥当な推論形式。後件否定（modus tollens）とも呼ばれる。ポパーの反証主義の論理構造そのもの——仮説Hから予測Oを導き、Oが観察されなければHは偽。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 妥当性と健全性" },
      { slug: "03-validity", label: "第3章: 哲学コラム（ポパー）" },
    ],
  },
  {
    term: "反証可能性",
    description:
      "カール・ポパーが提唱した科学と非科学の区別基準。科学的理論は、どのような観察がなされたら理論が間違っていると結論できるかを明確に述べられなければならない。反証不可能な理論（どのような結果でも説明できる理論）は科学ではない。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 哲学コラム（ポパー）" },
    ],
  },
  {
    term: "ポパー",
    reading: "カール・ポパー",
    description:
      "1902-1994年。オーストリア出身の科学哲学者。1919年のウィーンでアドラー心理学の「何でも説明できる」性質に疑問を持ち、反証可能性を科学の基準として提唱。アインシュタインの理論がリスクのある予測を出すことと対比した。著書『開かれた社会とその敵』で全体主義を批判。",
    relatedChapters: [
      { slug: "03-validity", label: "第3章: 哲学コラム" },
    ],
  },

  // 第4章: 述語論理
  {
    term: "述語論理",
    description:
      "命題論理を拡張し、個体・述語・量化子を導入した論理体系。「すべてのxについてP(x)」（∀x P(x)）や「あるxが存在してP(x)」（∃x P(x)）を形式的に表現できる。フレーゲが1879年の『概念記法』で創始した。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 述語論理の基礎" },
    ],
  },
  {
    term: "量化子",
    description:
      "変数の範囲を指定する記号。全称量化子∀（すべての）と存在量化子∃（ある...が存在する）の2つがある。フレーゲが『概念記法』で導入し、ワイエルシュトラスのε-δ論法のような数学的推論を形式化することを可能にした。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 述語論理の基礎" },
    ],
  },
  {
    term: "フレーゲ",
    reading: "ゴットロープ・フレーゲ",
    description:
      "1848-1925年。ドイツの数学者・論理学者。イエナ大学教授。算術を純粋な論理から導出する「論理主義」を目指し、1879年に述語論理を創始する革命的著作『概念記法』を出版。しかし1902年、ラッセルのパラドックスにより主著の体系が崩壊する悲劇を経験した。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 哲学コラム" },
    ],
  },
  {
    term: "ラッセル",
    reading: "バートランド・ラッセル",
    description:
      "1872-1970年。イギリスの哲学者・数学者・論理学者。1902年にフレーゲの体系に致命的な矛盾（ラッセルのパラドックス）を発見。その対処として「型理論」を考案した。ホワイトヘッドとの共著『プリンキピア・マテマティカ』は論理学の金字塔。ノーベル文学賞受賞者でもある。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 哲学コラム" },
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
  {
    term: "型理論",
    description:
      "ラッセルがパラドックスへの対処として考案した理論。集合を「型（レベル）」に分類し、自分自身を要素として含むことを禁止する。現代のプログラミング言語の型システム（TypeScript、Haskell、Rust）は型理論の直系の子孫である。",
    relatedChapters: [
      { slug: "04-predicate-logic", label: "第4章: 哲学コラム" },
    ],
  },

  // 第5章: 誤謬
  {
    term: "誤謬",
    description:
      "論理的に不正な推論。もっともらしく聞こえるが、前提から結論を正当に導いていない議論のこと。形式的誤謬（推論形式自体が不正）と非形式的誤謬（内容や文脈の問題）に大別される。アリストテレスが『詭弁論駁論』で初めて体系的に分類した。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 非形式的誤謬" },
    ],
  },
  {
    term: "後件肯定",
    description:
      "形式的誤謬の一つ。「PならばQ」と「Q」から「P」を結論する誤った推論。例:「雨が降れば地面が濡れる。地面が濡れている。ゆえに雨が降った」——スプリンクラーの可能性を無視している。科学における「検証」の論理的不完全性の根拠。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 非形式的誤謬" },
      { slug: "03-validity", label: "第3章: 哲学コラム（ポパー）" },
    ],
  },
  {
    term: "人身攻撃",
    description:
      "非形式的誤謬の一つ。議論の内容ではなく、主張者の人格・動機・属性を攻撃することで反論に代える論法。ラテン語でad hominem。SNSで最も頻繁に見られる誤謬の一つ。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 非形式的誤謬" },
    ],
  },
  {
    term: "ソフィスト",
    description:
      "紀元前5世紀のギリシャで弁論術を教えた職業教師たち。アテネの民主制が生んだ「弁論の技術」への需要に応えた。プロタゴラスが最も有名で「人間は万物の尺度」と宣言した。プラトンから激しく批判されたが、民主制という政治体制が彼らを必要としていた。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 哲学コラム" },
      { slug: "01-propositions", label: "第1章: 哲学コラム" },
    ],
  },
  {
    term: "プラトン",
    description:
      "紀元前427-347年。ソクラテスの弟子、アリストテレスの師。対話篇『ゴルギアス』でソフィストの弁論術を「料理術」に喩え、真理の追求なき説得を批判した。アカデメイアを創設し、「哲学は真理を追求するが、弁論術は見かけの真理を追求する」と論じた。",
    relatedChapters: [
      { slug: "05-fallacies", label: "第5章: 哲学コラム" },
    ],
  },

  // 第6章: 総合
  {
    term: "ウィトゲンシュタイン",
    reading: "ルートヴィヒ・ウィトゲンシュタイン",
    description:
      "1889-1951年。オーストリア出身の哲学者。前期の『論理哲学論考』で論理によって世界を完全に記述しようとし、後期の『哲学探究』でその理論を自ら否定した。「語りえぬものについては沈黙しなければならない」は最も有名な一文。",
    relatedChapters: [
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
  {
    term: "論理哲学論考",
    reading: "Tractatus Logico-Philosophicus",
    description:
      "ウィトゲンシュタインの前期主著（1921年出版）。第一次世界大戦中の塹壕と捕虜収容所で書かれた。「世界は事実の総体である」から始まり、命題は現実の像（写像）であるとする。フレーゲとラッセルの論理学を極限まで推し進めた論理的世界観の表現。",
    relatedChapters: [
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
  {
    term: "言語ゲーム",
    description:
      "後期ウィトゲンシュタインの中心概念。言葉の意味は固定的な対象への対応ではなく、その言葉がどのように使われるかによって決まるとする。「ゲーム」という語自体に共通の本質はなく、「家族的類似性」で結ばれた多様な活動がある。",
    relatedChapters: [
      { slug: "06-synthesis", label: "第6章: 哲学コラム" },
    ],
  },
]

const termIndex = new Map<string, GlossaryEntry>(
  GLOSSARY.map((entry) => [entry.term, entry])
)

export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return termIndex.get(term)
}

export function getMatchableTerms(): readonly string[] {
  return [...termIndex.keys()].sort((a, b) => b.length - a.length)
}
