# Logos カリキュラム拡張計画: 11章 → 30章

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 現行11章の論理学カリキュラムを30章に拡張し、命題論理から計算論理まで包括的にカバーする通年コース相当のコンテンツを作成する。

**Architecture:** 各章は既存パターン踏襲: `theory.tsx` + `philosophy.tsx` + `theory-quizzes.json` + `practice-quizzes.json`。コンテンツコンポーネント（Callout, FormulaBlock, ComparisonTable, KeyPoint）とインタラクティブコンポーネント（TruthValueAnimator, ArgumentTree, VennDiagram, ExampleMapping, InlineMiniQuiz, LogicSandbox）を活用。

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS 4, Radix UI

---

## 章番号リマッピング

### 変更方針
- 既存11章のslugは**変更しない**（URL互換性維持）
- 新規19章はslugに連番を使用
- `order`フィールドで表示順序を制御
- 既存の`06-synthesis`は最終章（order: 30）に移動

### 全30章の構成

| order | slug | タイトル | Part | 状態 |
|-------|------|---------|------|------|
| 1 | `01-propositions` | 命題と論理結合子 | Part 1 | 既存 |
| 2 | `02-truth-tables` | 真理値表と恒真式 | Part 1 | 既存 |
| 3 | `03-validity` | 論証の妥当性と健全性 | Part 1 | 既存 |
| 4 | `07-natural-deduction-prop` | 自然演繹（命題論理） | Part 1 | **新規** |
| 5 | `08-propositional-semantics` | 命題論理の意味論と完全性 | Part 1 | **新規** |
| 6 | `04a-predicates` | 述語と項 | Part 2 | 既存 |
| 7 | `04b-universal` | 全称量化子（∀） | Part 2 | 既存 |
| 8 | `04c-existential` | 存在量化子（∃） | Part 2 | 既存 |
| 9 | `04d-negation` | 量化子の否定 | Part 2 | 既存 |
| 10 | `04e-multiple-quantifiers` | 多重量化 | Part 2 | 既存 |
| 11 | `04f-sql-connection` | 述語論理とSQL | Part 2 | 既存 |
| 12 | `09-natural-deduction-pred` | 自然演繹（述語論理） | Part 2 | **新規** |
| 13 | `10-identity-uniqueness` | 等号と一意性 | Part 2 | **新規** |
| 14 | `11-sets` | 集合の基礎 | Part 3 | **新規** |
| 15 | `12-relations` | 関係 | Part 3 | **新規** |
| 16 | `13-functions` | 関数 | Part 3 | **新規** |
| 17 | `14-infinity` | 無限と対角線論法 | Part 3 | **新規** |
| 18 | `15-mathematical-induction` | 数学的帰納法 | Part 4 | **新規** |
| 19 | `16-strong-structural-induction` | 強帰納法と構造帰納法 | Part 4 | **新規** |
| 20 | `17-recursion-induction` | 再帰と帰納 | Part 4 | **新規** |
| 21 | `18-modal-logic` | 様相論理入門 | Part 5 | **新規** |
| 22 | `19-modal-applications` | 様相論理の応用 | Part 5 | **新規** |
| 23 | `20-temporal-logic` | 時相論理 | Part 5 | **新規** |
| 24 | `05-fallacies` | 非形式的誤謬 | Part 6 | 既存 |
| 25 | `21-probabilistic-reasoning` | 確率的推論とベイズ | Part 6 | **新規** |
| 26 | `22-intuitionistic-logic` | 直観主義論理 | Part 6 | **新規** |
| 27 | `23-boolean-circuits` | ブール代数と回路 | Part 7 | **新規** |
| 28 | `24-curry-howard` | Curry-Howard対応 | Part 7 | **新規** |
| 29 | `25-metalogic` | メタ論理：限界と可能性 | Part 8 | **新規** |
| 30 | `06-synthesis` | 総合演習 | Part 8 | 既存（拡張） |

---

## 各新規章の詳細設計

### Ch07: 自然演繹（命題論理）— `07-natural-deduction-prop`

**前提知識:** Ch01-03（命題論理の基礎、妥当性）

**theory.tsx 内容:**
1. 形式的証明とは何か — 推論規則の連鎖として証明を構築する考え方
2. 導入・除去規則の体系:
   - ∧I (Conjunction Introduction): P, Q ⊢ P ∧ Q
   - ∧E (Conjunction Elimination): P ∧ Q ⊢ P / P ∧ Q ⊢ Q
   - ∨I (Disjunction Introduction): P ⊢ P ∨ Q
   - ∨E (Disjunction Elimination / Case Analysis)
   - →I (Conditional Introduction / Conditional Proof): 仮定Pから結論Qを導く
   - →E (Modus Ponens): P, P → Q ⊢ Q
   - ¬I (Negation Introduction / Proof by Contradiction): 仮定Pから矛盾を導く
   - ¬E (Double Negation Elimination): ¬¬P ⊢ P
   - RAA (Reductio Ad Absurdum)
3. 仮定の導入と解除（サブ証明のスコープ）
4. 完全な証明の例: 3-4個の段階的な例

**philosophy.tsx:** フレーゲとゲンツェン — 形式的証明の誕生、自然演繹の「自然さ」とは

**quiz設計:**
- theory: multiple-choice×3（規則の識別）, proof-builder×2（簡単な証明の構築）
- practice: proof-builder×3（中程度の証明）, gap-fill-proof×2（ステップの穴埋め）

**インタラクティブ:** ArgumentTree（証明木の可視化）, InlineMiniQuiz

---

### Ch08: 命題論理の意味論と完全性 — `08-propositional-semantics`

**前提知識:** Ch01-03, Ch07

**theory.tsx 内容:**
1. 構文（syntax）と意味論（semantics）の区別
2. 意味的帰結（⊨）: 全ての付値でP→Qが成り立つ
3. 統語的帰結（⊢）: 証明体系で導出可能
4. 充足可能性（satisfiability）と恒真式（tautology）の形式的定義
5. 健全性定理: ⊢ ならば ⊨（証明できるなら真）
6. 完全性定理: ⊨ ならば ⊢（真なら証明できる）— 直感的説明
7. 決定可能性: 命題論理は機械的に判定できる

**philosophy.tsx:** ゲーデルと完全性定理 — 「正しいこと」と「証明できること」

**quiz設計:**
- theory: multiple-choice×4（概念の理解）, truth-table×1
- practice: multiple-choice×3, counterexample×2（意味的帰結の反例）

**インタラクティブ:** TruthValueAnimator, InlineMiniQuiz, ExampleMapping

---

### Ch09: 自然演繹（述語論理）— `09-natural-deduction-pred`

**前提知識:** Ch04a-e, Ch07

**theory.tsx 内容:**
1. 述語論理の推論規則（命題論理の拡張）
2. ∀I (Universal Introduction): 任意のaについてP(a)を示す（固有変数条件）
3. ∀E (Universal Elimination / Instantiation): ∀x P(x) ⊢ P(a)
4. ∃I (Existential Introduction): P(a) ⊢ ∃x P(x)
5. ∃E (Existential Elimination): ∃x P(x)から仮定P(a)で推論（固有変数条件）
6. 固有変数条件の重要性 — 間違いやすいポイント
7. 述語論理での完全な証明例

**philosophy.tsx:** ライプニッツと普遍記号法 — 全てを計算で解決する夢

**quiz設計:**
- theory: multiple-choice×3, proof-builder×2
- practice: proof-builder×3, gap-fill-proof×2

**インタラクティブ:** ArgumentTree, VennDiagram, InlineMiniQuiz

---

### Ch10: 等号と一意性 — `10-identity-uniqueness`

**前提知識:** Ch04a-e, Ch09

**theory.tsx 内容:**
1. 等号（=）の公理: 反射性、対称性、推移性、代入原理
2. 等号を含む推論: =I, =E（ライプニッツの法則）
3. 一意的存在（∃!x P(x)）: ∃x(P(x) ∧ ∀y(P(y) → y=x))
4. 定記述（the x such that P(x)）
5. ラッセルのパラドックス入門 — 「自分自身を含まない集合の集合」
6. 等号の実用例: 関数の一意性、最大値の存在と一意性

**philosophy.tsx:** ラッセルとパラドックス — 論理学の危機と型理論の誕生

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, gap-fill-proof×2

**インタラクティブ:** ExampleMapping, InlineMiniQuiz, LogicSandbox

---

### Ch11: 集合の基礎 — `11-sets`

**前提知識:** Ch04a-e（述語論理の基礎）

**theory.tsx 内容:**
1. 集合の直感的定義と外延的・内包的記法
2. 要素、部分集合（⊆）、真部分集合（⊊）
3. べき集合 P(A)、空集合 ∅
4. 集合演算: 和集合（∪）、共通部分（∩）、差集合（\）、対称差（△）、補集合
5. ド・モルガンの法則（集合版）— 命題論理との対応
6. 集合の等しさの証明: A=B ⟺ A⊆B ∧ B⊆A
7. 述語論理と集合の対応: {x | P(x)} の記法

**philosophy.tsx:** カントール — 無限への挑戦、集合論の創始者

**quiz設計:**
- theory: multiple-choice×3, truth-table×1（集合演算の真理値）
- practice: multiple-choice×3, counterexample×2（部分集合関係の反例）

**インタラクティブ:** VennDiagram（集合演算の可視化）, InlineMiniQuiz, ExampleMapping

---

### Ch12: 関係 — `12-relations`

**前提知識:** Ch11

**theory.tsx 内容:**
1. 二項関係の定義: R ⊆ A × B
2. 関係の性質: 反射性、対称性、反対称性、推移性
3. 同値関係と同値類 — 「同じとみなす」を形式化
4. 順序関係: 半順序（poset）、全順序（線形順序）
5. ハッセ図による順序の可視化
6. 実用例: データベースの関係、グラフ理論との接続

**philosophy.tsx:** デデキントと関係の抽象化 — 数学の基礎としての関係

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, counterexample×2（関係の性質の反例）

**インタラクティブ:** ExampleMapping, InlineMiniQuiz, VennDiagram

---

### Ch13: 関数 — `13-functions`

**前提知識:** Ch12

**theory.tsx 内容:**
1. 関数の定義: 特殊な関係 f ⊆ A × B
2. 定義域、値域、全域性
3. 単射（injective）、全射（surjective）、全単射（bijective）
4. 合成関数と逆関数
5. 関数としてのプログラム: 純粋関数、参照透過性
6. 集合の濃度: |A| = |B| ⟺ 全単射が存在

**philosophy.tsx:** ディリクレと関数概念の変遷 — 「対応」としての関数

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, gap-fill-proof×2

**インタラクティブ:** ExampleMapping, InlineMiniQuiz

---

### Ch14: 無限と対角線論法 — `14-infinity`

**前提知識:** Ch11-13

**theory.tsx 内容:**
1. 有限集合と無限集合
2. 可算無限: ℕとℤの全単射、ℚの可算性（対角線列挙法）
3. カントールの対角線論法: ℝの非可算性
4. べき集合定理: |P(A)| > |A|
5. 連続体仮説（紹介のみ）
6. ラッセルのパラドックスとの関連（Ch10から接続）

**philosophy.tsx:** ヒルベルトの無限ホテル — 無限の直感に反する性質

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1（対角線論法のステップ）
- practice: multiple-choice×3, gap-fill-proof×2

**インタラクティブ:** ExampleMapping, InlineMiniQuiz

---

### Ch15: 数学的帰納法 — `15-mathematical-induction`

**前提知識:** Ch04a-e（量化子）, Ch11（集合）

**theory.tsx 内容:**
1. ドミノ原理としての帰納法 — 直感的導入
2. 形式的定義: P(0) ∧ ∀n(P(n) → P(n+1)) → ∀n P(n)
3. 基底ケースと帰納ステップ
4. 弱い帰納法（通常の帰納法）
5. 実践例: 和の公式（1+2+...+n = n(n+1)/2）、不等式の証明
6. よくある間違い: 基底ケースの省略、帰納仮定の誤用

**philosophy.tsx:** パスカルとペアノ — 帰納法の二つの顔（発見と基礎付け）

**quiz設計:**
- theory: multiple-choice×3, gap-fill-proof×2（帰納法のステップ穴埋め）
- practice: proof-builder×3, gap-fill-proof×2

**インタラクティブ:** ArgumentTree（帰納法のステップを木で表示）, InlineMiniQuiz

---

### Ch16: 強帰納法と構造帰納法 — `16-strong-structural-induction`

**前提知識:** Ch15

**theory.tsx 内容:**
1. 強帰納法: P(0),...,P(n-1)全てを仮定してP(n)を示す
2. 弱帰納法との比較: いつ強帰納法が必要か
3. 構造帰納法: 帰納法をリスト・木などのデータ構造に拡張
4. リストの構造帰納法: 基底ケース（空リスト）、帰納ステップ（cons）
5. 木の構造帰納法: 基底ケース（葉）、帰納ステップ（ノード）
6. プログラミングとの対応: 再帰関数の正しさ証明

**philosophy.tsx:** ノイマンと構造帰納法 — データ構造と論理の融合

**quiz設計:**
- theory: multiple-choice×3, gap-fill-proof×2
- practice: proof-builder×3, gap-fill-proof×2

**インタラクティブ:** ArgumentTree, InlineMiniQuiz

---

### Ch17: 再帰と帰納 — `17-recursion-induction`

**前提知識:** Ch15-16

**theory.tsx 内容:**
1. 再帰的定義: 基底ケース + 帰納ステップ
2. 再帰的定義 ↔ 帰納的証明の対応
3. 整礎関係と停止性: なぜ再帰が終了するか
4. プログラムの部分正当性と全正当性
5. ループ不変条件
6. 実例: フィボナッチ数列、ユークリッドの互除法の正しさ

**philosophy.tsx:** チャーチとチューリング — 計算可能性の概念

**quiz設計:**
- theory: multiple-choice×4, gap-fill-proof×1
- practice: multiple-choice×3, proof-builder×2

**インタラクティブ:** LogicSandbox, InlineMiniQuiz

---

### Ch18: 様相論理入門 — `18-modal-logic`

**前提知識:** Ch01-03（命題論理）

**theory.tsx 内容:**
1. 「必然的に」(□) と「可能的に」(◇) — 日常言語での例
2. 可能世界意味論: 世界の集合 W、到達可能性関係 R、付値 V
3. クリプキフレーム: (W, R) の構造
4. □P の意味: 到達可能な全ての世界でPが真
5. ◇P の意味: 到達可能なある世界でPが真
6. □と◇の関係: □P ⟺ ¬◇¬P（ド・モルガン的双対）
7. 様相論理の公理系: K, T, S4, S5 の直感的説明

**philosophy.tsx:** ライプニッツと可能世界 — 「最善の世界」の論理

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, counterexample×2（可能世界での反例）

**インタラクティブ:** VennDiagram（可能世界の可視化）, ExampleMapping, InlineMiniQuiz

---

### Ch19: 様相論理の応用 — `19-modal-applications`

**前提知識:** Ch18

**theory.tsx 内容:**
1. 認識論理（Epistemic Logic）: K_a P（エージェントaはPを知っている）
2. 共有知識と共通知識の違い
3. 義務論理（Deontic Logic）: O(P)（Pすべき）、P(P)（Pしてよい）
4. 認識論理のパズル: マディ・チルドレン問題
5. 日常推論での様相: 法的議論、倫理的議論の形式化
6. 様相論理とAI: 知識表現、信念改訂

**philosophy.tsx:** ヒンティッカと認識論理 — 「知る」を形式化する

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, fallacy-spotter×2（様相的誤謬の識別）

**インタラクティブ:** ExampleMapping, InlineMiniQuiz

---

### Ch20: 時相論理 — `20-temporal-logic`

**前提知識:** Ch18

**theory.tsx 内容:**
1. 線形時相論理（LTL）の4つの基本演算子:
   - □ (always/globally): 今後常にP
   - ◇ (eventually): いつかPになる
   - ○ (next): 次の状態でP
   - U (until): QになるまでP
2. パス意味論: 無限の状態列上での評価
3. LTL式の例: □(request → ◇response)（要求には必ず応答する）
4. 計算木論理（CTL）の紹介: 分岐する未来
5. モデル検査の直感的説明: システムが仕様を満たすか自動検証
6. 応用: 並行プログラムのデッドロック検出、プロトコル検証

**philosophy.tsx:** プヌエリとエマーソン — 時間の論理でバグを見つける

**quiz設計:**
- theory: multiple-choice×4, gap-fill-proof×1（LTL式の構築）
- practice: multiple-choice×3, proof-builder×2

**インタラクティブ:** LogicSandbox, InlineMiniQuiz, ExampleMapping

---

### Ch21: 確率的推論とベイズ — `21-probabilistic-reasoning`

**前提知識:** Ch01-03, Ch05

**theory.tsx 内容:**
1. 演繹と帰納の違い（復習）
2. 条件付き確率: P(A|B) = P(A∩B)/P(B)
3. ベイズの定理: P(H|E) = P(E|H)P(H)/P(E)
4. 事前確率と事後確率
5. 基準率錯誤（Base Rate Fallacy）: 検査の偽陽性問題
6. 確率的論証の評価: 帰納的強さ
7. 頻度主義 vs ベイズ主義（紹介）

**philosophy.tsx:** ベイズ牧師とラプラス — 「信念の確率」の哲学

**quiz設計:**
- theory: multiple-choice×4, gap-fill-proof×1（ベイズ計算のステップ）
- practice: multiple-choice×3, fallacy-spotter×2（確率的誤謬）

**インタラクティブ:** TruthValueAnimator（確率のアニメーション）, ExampleMapping, InlineMiniQuiz

---

### Ch22: 直観主義論理 — `22-intuitionistic-logic`

**前提知識:** Ch01-03, Ch07-08

**theory.tsx 内容:**
1. 排中律の否定: ¬(P ∨ ¬P) の哲学的動機
2. 構成的証明: 存在を示すには具体例を構成する
3. BHK解釈（Brouwer-Heyting-Kolmogorov）: 証明＝構成
4. 二重否定除去の不採用: ¬¬P ⊬ P
5. 直観主義と古典論理の比較: 何が成り立ち、何が成り立たないか
6. プログラミングとの関連: 型理論、構成的数学、Curry-Howard への布石

**philosophy.tsx:** ブラウワーと直観主義 — 数学の存在は心の中に

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, counterexample×2（古典論理との違いの反例）

**インタラクティブ:** LogicSandbox, InlineMiniQuiz, ExampleMapping

---

### Ch23: ブール代数と回路 — `23-boolean-circuits`

**前提知識:** Ch01-02

**theory.tsx 内容:**
1. ブール代数の公理: 交換律・結合律・分配律・ド・モルガン・補元律
2. 命題論理とブール代数の対応
3. 論理ゲート: AND, OR, NOT, NAND, NOR, XOR
4. 組み合わせ回路: 半加算器、全加算器
5. 論理式の回路表現と最適化（カルノー図の紹介）
6. デジタル回路とコンピュータの基礎

**philosophy.tsx:** ブールとシャノン — 思考の法則から情報理論へ

**quiz設計:**
- theory: multiple-choice×3, truth-table×2（ゲートの真理値表）
- practice: multiple-choice×3, gap-fill-proof×2（回路の構築ステップ）

**インタラクティブ:** TruthValueAnimator, LogicSandbox, InlineMiniQuiz

---

### Ch24: Curry-Howard対応 — `24-curry-howard`

**前提知識:** Ch07, Ch22

**theory.tsx 内容:**
1. 命題 = 型、証明 = プログラム
2. →I (仮定からの証明) = 関数抽象 (x => ...)
3. →E (モーダスポネンス) = 関数適用 f(x)
4. ∧ = 積型 (タプル/レコード)
5. ∨ = 直和型 (ユニオン)
6. TypeScriptの型システムを通じた直感的理解
7. 依存型の紹介: 値に依存する型（Agda, Coqの世界）

**philosophy.tsx:** カリーとハワード — 論理学とコンピュータ科学の驚くべき統一

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1（型の構築＝証明の構築）
- practice: multiple-choice×3, gap-fill-proof×2

**インタラクティブ:** ExampleMapping（命題↔型の対応表）, LogicSandbox, InlineMiniQuiz

---

### Ch25: メタ論理：限界と可能性 — `25-metalogic`

**前提知識:** Ch07-08, Ch17

**theory.tsx 内容:**
1. 対象言語とメタ言語の区別
2. ゲーデルの第一不完全性定理: 十分に強い体系には証明も反証もできない文が存在する
3. ゲーデル文の直感的構成: 「この文は証明できない」
4. ゲーデルの第二不完全性定理: 体系は自身の無矛盾性を証明できない
5. 決定可能性と半決定可能性
6. 停止問題: チューリングの証明（対角線論法との接続）
7. 論理学の限界と可能性: 何が計算できて何ができないか

**philosophy.tsx:** ゲーデル — 数学の限界を証明した男

**quiz設計:**
- theory: multiple-choice×4, proof-builder×1
- practice: multiple-choice×3, counterexample×2

**インタラクティブ:** ExampleMapping, InlineMiniQuiz, ArgumentTree

---

### Ch06 (拡張): 総合演習 — `06-synthesis`

**変更内容:**
- 既存の総合演習コンテンツを維持
- 新規章の内容をカバーする演習問題を追加
- Part 3-8の知識を統合した横断的問題
- 現実世界の議論分析（法律、科学、プログラミング）

**追加quiz:**
- 各新パートから1-2問ずつ、合計10-15問の追加

---

## 実装計画

### フェーズ1: インフラ整備

**Task 1: content.ts にチャプター定義を追加**
- 19個の新規チャプターエントリを CHAPTERS 配列に追加
- order フィールドを全30章に再割り当て
- 既存の slug は変更しない

**Task 2: content-registry.ts にレジストリエントリを追加**
- 19個の新規 import 文を追加
- CONTENT_REGISTRY に19個のエントリを追加

**Task 3: 19個の新規チャプターディレクトリ作成**
- 各ディレクトリに空の theory.tsx, philosophy.tsx, theory-quizzes.json, practice-quizzes.json を作成

### フェーズ2: コンテンツ作成（並列実行可能）

各章のコンテンツ作成は独立しているため、並列エージェントで実行可能。

**Task 4-22: 各新規章のコンテンツ作成（19章分）**
各タスクで以下を作成:
1. theory.tsx — 理論コンテンツ（コンテンツコンポーネント + インタラクティブコンポーネント使用）
2. philosophy.tsx — 哲学コラム
3. theory-quizzes.json — 理論クイズ（5問前後）
4. practice-quizzes.json — 実践クイズ（5問前後）

並列化の推奨グループ:
- Group A: Ch07, Ch08（命題論理拡張 — 2章）
- Group B: Ch09, Ch10（述語論理拡張 — 2章）
- Group C: Ch11, Ch12, Ch13, Ch14（集合論 — 4章）
- Group D: Ch15, Ch16, Ch17（帰納法 — 3章）
- Group E: Ch18, Ch19, Ch20（様相・時相論理 — 3章）
- Group F: Ch21, Ch22（非古典論理 — 2章）
- Group G: Ch23, Ch24（計算と論理 — 2章）
- Group H: Ch25 + Ch06拡張（メタ論理・総合 — 2章）

### フェーズ3: 検証と統合

**Task 23: TypeScript型チェック + ビルド検証**
**Task 24: テスト実行 + 新規テスト追加**
**Task 25: ブラウザでの全章表示確認**

### フェーズ4: 品質保証

**Task 26: コードレビュー**
**Task 27: コンテンツレビュー（論理的正確性の確認）**

---

## 見積もり

- 新規チャプター: 19章
- 各章の制作物: theory.tsx (~200-400行), philosophy.tsx (~80-150行), quizzes.json×2 (~50-100行×2)
- 合計追加行数: 約10,000-15,000行
- 並列エージェント活用で効率的に実装可能

---

## リスク

1. **コンテンツ品質**: 数学的正確性の担保が必要。特に証明関連の章
2. **クイズ難易度**: 新しいトピックのクイズが既存パターンで表現できるか
3. **ビルドサイズ**: 30章分のコンテンツでバンドルサイズが増加 → 動的インポートの検討
4. **ナビゲーション**: 30章のUIがモバイルで破綻しないか → パート別グルーピングUI

---

*Generated: 2026-02-07*
