# Philosophy Column Rewrite — Deep Focus Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite all 6 philosophy columns to focus deeply on ONE figure/topic per column, exploring motivations, social context, and consequences — not just surface facts.

**Architecture:** Replace each `philosophy.tsx` content file. No structural changes — same component signature, same CSS classes.

**Tech Stack:** TSX content components (no logic changes)

**Design Principle:** 歴史はその事象だけではなく、背後の部分を徹底的に深掘りする。1コラム1人物/1テーマに集中。「何をしたか」だけでなく「なぜそうせざるを得なかったのか」「それは何を変えたのか」を書く。

---

### Current Problems

| Chapter | Current Focus | Problem |
|---------|--------------|---------|
| 1 | アリストテレス + ストア派 + 「なぜ学ぶか」 | 3トピック詰め込み。ストア派が中途半端 |
| 2 | ライプニッツ + ブール + シャノン + チューリング/ゲーデル | 4人物。全員が浅い |
| 3 | アリストテレス(再) + スコラ学 + ポパー + 日常応用 | 4トピック。アリストテレスが第1章と重複 |
| 4 | フレーゲ + ラッセル + ゲーデル + 計算機科学 | 4人物。フレーゲの動機が不明 |
| 5 | ソフィスト + アリストテレス(3回目) + クリティカルシンキング + 認知バイアス | 4トピック。散漫 |
| 6 | アインシュタイン + ウィトゲンシュタイン + プラグマティズム + まとめ | 4トピック。どれも浅い |

### Rewrite Plan

| Chapter | New Focus (1人物/1テーマ) | 深掘りの軸 |
|---------|--------------------------|-----------|
| 1 | **アリストテレス — 論理学の誕生** | なぜアテネで論理学が必要だったのか（民主制・法廷弁論・ソフィストへの対抗）、オルガノンの構造、2000年支配した理由 |
| 2 | **ライプニッツ — 「計算しましょう」の夢** | 30年戦争後の知的統一への渇望、普遍的記号法の具体的構想、なぜ実現できなかったか、300年後にブール→シャノンが実現した経緯 |
| 3 | **カール・ポパー — 反証可能性と科学の論理** | ウィーン学団との対立、マルクス主義・精神分析への疑問が出発点、反証主義がなぜ「妥当だが不健全」の区別から生まれたか、科学哲学への影響 |
| 4 | **フレーゲ — 述語論理はなぜ必要だったのか** | 19世紀数学の基礎の危機（微積分の厳密化、非ユークリッド幾何学）、フレーゲの目的（算術の論理的基礎づけ）、概念記法の革命性、ラッセルの手紙による挫折、それでも残った遺産 |
| 5 | **プラトン vs ソフィスト — 真理と説得の2500年戦争** | なぜソフィストが必要とされたか（民主制と法廷）、プラトンの怒り、ゴルギアス対話篇の論点、この対立が現代のフェイクニュース問題まで続いている理由 |
| 6 | **ウィトゲンシュタイン — 論理の限界を見た男** | 前期（論理哲学論考：論理で世界を完全に記述しようとした）、第一次世界大戦の体験、後期（哲学探究：言語ゲーム）、なぜ「語りえぬもの」が論理学を学んだ者にとって重要なのか |

---

### Task 1: Rewrite Chapter 1 Philosophy — アリストテレス

**Files:**
- Modify: `content/chapters/01-propositions/philosophy.tsx`

**Step 1: Replace content**

Replace the entire component body with deep-focus content on Aristotle:
- なぜアテネで論理学が生まれたのか: 紀元前5世紀アテネの民主制では市民が法廷で自分を弁護する必要があった。ソフィストたちが弁論術を教えたが、論理的に不正な説得も横行した。
- プラトンとアリストテレスの応答: プラトンはソフィストを批判したが体系的な論理学は作らなかった。弟子アリストテレスが『オルガノン』で初めて推論の形式を体系化した。
- オルガノン（道具）の意味: 論理学は哲学の一部ではなく「道具」。特定の内容に依存しない、形式的な推論の枠組み。
- 2000年支配した理由: アリストテレスの三段論法があまりに完成されていたため、カントですら「論理学はアリストテレス以来一歩も前進していない」と述べた。
- 現代への接続: あなたが第1章で学んだP→Qは、アリストテレスが民主制の法廷で「正しく議論する」ために生み出した道具の子孫。

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add content/chapters/01-propositions/philosophy.tsx
git commit -m "content: rewrite Ch1 philosophy — deep focus on Aristotle"
```

---

### Task 2: Rewrite Chapter 2 Philosophy — ライプニッツ

**Files:**
- Modify: `content/chapters/02-truth-tables/philosophy.tsx`

**Step 1: Replace content**

Deep-focus on Leibniz:
- 30年戦争（1618-1648）の惨禍: ヨーロッパの人口の1/3が失われた。宗教対立が原因。ライプニッツは「議論を理性的に解決する方法」を切望した。
- 普遍的記号法の具体的構想: すべての概念を素数の積で表現するという野心的計画。「2 = 動物、3 = 理性的、6 = 人間（2×3）」のように。争いが起きたら「計算しましょう（calculemus）」。
- なぜ実現できなかったか: 概念の分解が無限に複雑であること、当時の数学では命題間の関係を扱う道具がなかった。
- 300年後の実現: ブール（1854）が論理を代数にし、シャノン（1937）が電気回路と対応させ、ライプニッツの夢はコンピュータとして実現した。
- 真理値表はライプニッツの夢の部分的実現: 命題論理の範囲では機械的に真偽を判定できる。

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add content/chapters/02-truth-tables/philosophy.tsx
git commit -m "content: rewrite Ch2 philosophy — deep focus on Leibniz"
```

---

### Task 3: Rewrite Chapter 3 Philosophy — ポパー

**Files:**
- Modify: `content/chapters/03-validity/philosophy.tsx`

**Step 1: Replace content**

Deep-focus on Karl Popper:
- 1919年ウィーンの知的状況: マルクス主義、フロイトの精神分析、アドラーの個人心理学が流行。ポパーはアドラーの下で働いた経験から「何でも説明できる理論」への疑問を持つ。
- アインシュタインの一般相対性理論: 1919年の日食観測で予測が検証された。ポパーはこれと対比して「反証可能性」こそが科学の基準だと考えた。
- 「妥当だが不健全」との接続: 科学理論は妥当な推論の体系（前提が真なら結論も真）だが、前提（仮説）が真かは実験で確認するしかない。反証は「前提が偽であること」を示すモーダストレンスの応用。
- ウィーン学団との対立: 論理実証主義は「検証可能性」を基準にしたが、ポパーは「反証可能性」を主張。全称命題は有限回の観察では検証できないが、一つの反例で反証できる。
- 開かれた社会への影響: ポパーの科学哲学は政治哲学にも発展。批判的合理主義——常に反証に開かれた態度——が民主主義の基盤。

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add content/chapters/03-validity/philosophy.tsx
git commit -m "content: rewrite Ch3 philosophy — deep focus on Popper"
```

---

### Task 4: Rewrite Chapter 4 Philosophy — フレーゲ

**Files:**
- Modify: `content/chapters/04-predicate-logic/philosophy.tsx`

**Step 1: Replace content**

Deep-focus on Frege:
- 19世紀数学の「基礎の危機」: ワイエルシュトラスが微積分を厳密化（ε-δ論法）、非ユークリッド幾何学の発見で「直感的に明らかな公理」が崩壊。数学の基盤そのものが問い直された。
- フレーゲの目的: 算術（自然数の理論）を純粋な論理から導出すること（論理主義）。「2+3=5」が論理的真理であることを証明したかった。
- なぜ述語論理が必要だったか: アリストテレスの三段論法では「すべてのxについてP(x)ならばQ(x)」のような構造を扱えなかった。数学の証明に必要な「任意のε>0に対して、あるδ>0が存在して...」を形式化するには量化子が不可欠だった。
- 『概念記法』（1879）の革命性: 2次元の記法で量化子・関数・論理結合子を統一的に表現。同時代の人にはほぼ理解されなかった。
- ラッセルの手紙（1902）: 『算術の基本法則』第2巻の印刷直前に、ラッセルから「あなたの体系は矛盾を含んでいます」という手紙が届いた。フレーゲは後書きで「科学者にとってこれ以上不幸なことは考えにくい」と書いた。
- 挫折の先にある遺産: フレーゲの体系自体は矛盾を含んでいたが、述語論理と量化子の概念は生き残り、現代論理学・計算機科学・データベース理論の基盤となった。

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add content/chapters/04-predicate-logic/philosophy.tsx
git commit -m "content: rewrite Ch4 philosophy — deep focus on Frege"
```

---

### Task 5: Rewrite Chapter 5 Philosophy — プラトン vs ソフィスト

**Files:**
- Modify: `content/chapters/05-fallacies/philosophy.tsx`

**Step 1: Replace content**

Deep-focus on the Plato vs Sophist conflict:
- なぜソフィストが現れたか: 紀元前5世紀アテネの民主制。市民が法廷で弁論し、民会で政策を提案する必要があった。弁論の技術は「生存スキル」だった。
- ソフィストの思想: プロタゴラスの「人間は万物の尺度」——客観的真理は存在せず、説得力こそが「真理」。ゴルギアスは「存在は認識できず、認識できても伝達できない」と主張。
- プラトンの反撃: 『ゴルギアス』対話篇でソクラテスはゴルギアスに問う——「弁論家は正義を知らずに正義について語れるのか？」。プラトンは修辞学を「料理術」に喩えた——健康（真理）ではなく快楽（説得）を追求するものだと。
- この対立の本質: 「真理は存在するか、それとも説得力だけが存在するか」。これは現代のフェイクニュース、ポスト真実時代の核心的問題と同じ構造。
- アリストテレスの「第三の道」: アリストテレスは『詭弁論駁論』で誤謬を体系的に分類した。修辞学を否定せず、しかし論理的な議論の基準を設けた。
- 2500年続く戦い: ソフィスト的な手法（人身攻撃、感情への訴え、偽の二択）は現代のSNS・広告・政治弁論で依然として有効。誤謬を識別する力は、古代アテネの市民と同じ理由で現代人にも必要。

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add content/chapters/05-fallacies/philosophy.tsx
git commit -m "content: rewrite Ch5 philosophy — deep focus on Plato vs Sophists"
```

---

### Task 6: Rewrite Chapter 6 Philosophy — ウィトゲンシュタイン

**Files:**
- Modify: `content/chapters/06-synthesis/philosophy.tsx`

**Step 1: Replace content**

Deep-focus on Wittgenstein:
- 出自と背景: ウィーンの大富豪の家庭。兄弟のうち3人が自殺。航空工学を学んだ後、フレーゲとラッセルの論理学に傾倒。
- 前期: 『論理哲学論考』（1921）: 論理によって世界の構造を完全に記述しようとした。「世界は事実の総体である」——命題は現実の像であり、論理はその像の形式を規定する。フレーゲ・ラッセルの延長線上の極致。
- 第一次世界大戦: 志願して前線に赴き、捕虜収容所で『論考』を完成させた。戦争体験が「論理で語れないもの」への感性を鋭くした。
- 「語りえぬものについては沈黙しなければならない」: 倫理・美学・人生の意味——これらは命題として真偽を判定できない。しかしウィトゲンシュタインにとって「語りえぬもの」こそが最も重要だった。
- 後期: 『哲学探究』: 言語の意味は「使用」によって決まる（言語ゲーム）。論理的に完璧な言語という前期の夢を自ら否定。
- 論理学を学んだ者への問いかけ: 論理の力と限界の両方を知ることが、6章の学びの完成。論理は「正しく考える道具」だが、何を考えるべきかは論理の外にある。

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add content/chapters/06-synthesis/philosophy.tsx
git commit -m "content: rewrite Ch6 philosophy — deep focus on Wittgenstein"
```

---

### Task 7: Final verification

**Step 1: Run all tests**

```bash
pnpm test:run
```

**Step 2: Run build**

```bash
pnpm build
```

**Step 3: Verify git log**

```bash
git log --oneline -7
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Ch1: アリストテレス — 論理学の誕生（民主制・法廷・オルガノン） |
| 2 | Ch2: ライプニッツ — 「計算しましょう」の夢（30年戦争・普遍的記号法） |
| 3 | Ch3: ポパー — 反証可能性（ウィーン学団・科学の基準） |
| 4 | Ch4: フレーゲ — 述語論理の必要性（数学の危機・ラッセルの手紙） |
| 5 | Ch5: プラトン vs ソフィスト — 真理と説得の戦い（民主制・フェイクニュース） |
| 6 | Ch6: ウィトゲンシュタイン — 論理の限界（前期/後期・語りえぬもの） |
| 7 | Final verification |
