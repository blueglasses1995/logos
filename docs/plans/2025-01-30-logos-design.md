# Logos - 論理学学習Webアプリ 設計書

## 概要

**Logos**（ギリシャ語で「理性・論理・言葉」）は、形式論理学を学問的基礎から学び、ビジネス・日常・コードリーディングに活かすための学習Webアプリ。

### ターゲットユーザー

エンジニア・経営者など、実務で論理力を使う社会人。哲学にも知的好奇心がある人。

### 解決する課題

- 論理の基礎が抜けている感覚がある
- 議論（税務署、営業、ビジネス交渉）で論理的に話せるようになりたい
- コードリーディングの論理力を底上げしたい
- 学問としての論理学を体系的に学びたい

## チャプター構成

### カリキュラム

| # | タイトル | 内容 |
|---|---------|------|
| 1 | 命題と論理結合子 | AND, OR, NOT, IF-THEN, IFF |
| 2 | 真理値表と恒真式 | 真理値の計算、トートロジー |
| 3 | 論証の妥当性と健全性 | 演繹的妥当性、前提と結論 |
| 4 | 述語論理の基礎 | 全称量化子、存在量化子 |
| 5 | 非形式的誤謬 | 詭弁の検出と分類 |
| 6 | 実践総合演習 | 日常の議論を論理的に分析 |

### 各チャプターの3層構造

各チャプターは以下の3つのセクションで構成される：

#### 1. 学問編（Theory）

- 形式論理学のトピック解説
- インタラクティブな例（真理値表を操作する等）
- 確認クイズ（選択式・穴埋め）

#### 2. 実践編（Practice）

- そのトピックをビジネス・日常生活に適用
- シナリオベースの問題（営業トークの論理構造分析、契約書の論理分析等）
- 例：「もしAならばB」を学んだ後 → 税務署との会話で前件否定の誤謬に気づける

#### 3. 哲学コラム（Philosophy）

- そのトピックの哲学的背景・歴史
- 例：命題論理 → ストア派の論理学、述語論理 → フレーゲとラッセル
- 読み物として楽しめる内容。クイズは任意。

## 教育設計

教育工学の知見に基づく設計原則：

### 間隔反復（Spaced Repetition）

- SM-2アルゴリズムベース
- 過去のチャプターの問題が定期的に再出題
- 間違えた問題は短い間隔で、正解した問題は長い間隔で再出題

### 望ましい困難（Desirable Difficulties）

- 簡単すぎず難しすぎない適度な負荷
- 問題の難易度を段階的に上げる
- 脳に適度な負荷をかけつつ、挫折を防ぐ

### インターリーブ学習

- 学問・実践・哲学の切り替え自体が記憶定着を助ける
- 異なるタイプの問題を混ぜて出題

### テスト効果

- 読むだけでなくクイズで積極的に想起させる
- 各セクションにクイズを組み込み

## 技術アーキテクチャ

### テックスタック

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **MDX** でレッスンコンテンツ管理
- **localStorage** で進捗保存（初期版、後でバックエンド追加可能）

### ディレクトリ構成

```
logos/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # ダッシュボード
│   │   ├── chapters/
│   │   │   └── [slug]/
│   │   │       ├── theory/page.tsx  # 学問編
│   │   │       ├── practice/page.tsx # 実践編
│   │   │       └── philosophy/page.tsx # 哲学コラム
│   │   └── review/page.tsx          # 間隔反復の復習
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── MultipleChoiceQuiz.tsx
│   │   │   ├── TruthTableQuiz.tsx
│   │   │   ├── ArgumentValidityQuiz.tsx
│   │   │   └── FallacyDetectionQuiz.tsx
│   │   ├── lesson/
│   │   │   └── LessonRenderer.tsx
│   │   └── progress/
│   │       └── ProgressDashboard.tsx
│   ├── lib/
│   │   ├── progress.ts              # localStorage進捗管理
│   │   └── spaced-repetition.ts     # SM-2アルゴリズム
│   └── types/
│       └── content.ts               # 型定義
├── content/
│   └── chapters/
│       └── 01-propositions/
│           ├── theory.mdx
│           ├── practice.json
│           └── philosophy.mdx
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## データモデル

### コンテンツ型

```typescript
interface Chapter {
  slug: string
  title: string
  order: number
  sections: {
    theory: TheoryLesson
    practice: PracticeQuiz[]
    philosophy: PhilosophyColumn
  }
}

interface TheoryLesson {
  content: string        // MDXコンテンツ
  quizzes: Quiz[]        // 確認クイズ
}

interface PhilosophyColumn {
  content: string        // MDXコンテンツ
  quiz?: Quiz            // 任意のクイズ
}
```

### クイズ型

```typescript
type Quiz =
  | MultipleChoiceQuiz
  | TruthTableQuiz
  | ArgumentValidityQuiz
  | FallacyDetectionQuiz

interface MultipleChoiceQuiz {
  type: "multiple-choice"
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface TruthTableQuiz {
  type: "truth-table"
  expression: string     // "P → (Q ∧ R)"
  variables: string[]
  blanks: number[]
  answers: boolean[]
}

interface ArgumentValidityQuiz {
  type: "argument-validity"
  premises: string[]
  conclusion: string
  isValid: boolean
  explanation: string
}

interface FallacyDetectionQuiz {
  type: "fallacy-detection"
  argument: string
  options: string[]      // 誤謬の種類リスト
  correctIndex: number
  explanation: string
}
```

### 進捗データ

```typescript
interface UserProgress {
  chapters: Record<string, ChapterProgress>
  reviewQueue: ReviewItem[]
}

interface ChapterProgress {
  theory: { completed: boolean; quizScores: number[] }
  practice: { completed: boolean; quizScores: number[] }
  philosophy: { read: boolean }
}

interface ReviewItem {
  quizId: string
  nextReview: string     // ISO date
  interval: number       // days
  easeFactor: number     // SM-2 ease factor
  repetitions: number
}
```

## 主要コンポーネント

| コンポーネント | 役割 |
|---------------|------|
| `TruthTableBuilder` | インタラクティブに真理値表を作成・操作 |
| `QuizCard` | 各種クイズの統一的なUIラッパー |
| `ArgumentAnalyzer` | 論証の構造を視覚的に表示 |
| `ProgressDashboard` | チャプター進捗・正答率の一覧 |
| `LessonRenderer` | MDXコンテンツの表示 |

## MVP スコープ

初期リリースに含めるもの：

- [x] Chapter 1（命題と論理結合子）の全3層
- [x] 選択式クイズ
- [x] 真理値表クイズ
- [x] localStorage進捗保存
- [x] ダッシュボード（進捗表示）

後で追加：

- [ ] Chapter 2-6
- [ ] 間隔反復システム
- [ ] ArgumentValidityQuiz / FallacyDetectionQuiz
- [ ] バックエンド（ユーザー認証・クラウド同期）
- [ ] 教育工学に基づく詳細な調査・最適化

## 教育工学リサーチ結果

### 1. 間隔反復（Spaced Repetition）

- **SM-2アルゴリズム**（Wozniak, 1987）をMVPで採用。各クイズに容易度係数（EF）を持たせ、回答品質で更新
- **FSRS**（Free Spaced Repetition Scheduler）は将来の移行先。SM-2比で復習回数約20-30%削減
- 回答の4段階評価: Again / Hard / Good / Easy

### 2. 望ましい困難（Desirable Difficulties）— Bjork (1994)

- **正答率70-85%**を目標帯域として難易度調整
- **段階的ヒント**: ヒントなし → 方針ヒント → 具体的ヒント → 解答
- **問題形式の多様化**: 選択式 → 穴埋め → 自由記述 → 証明構成
- **認知負荷理論**（Sweller, 1988）: 外在的負荷を最小化し、本質的負荷を適度に高める

### 3. テスト効果 / 検索練習 — Roediger & Karpicke (2006)

- **読解30% : クイズ70%**の比率を目標
- 即時フィードバック + 「なぜ正しいか/間違いか」の解説
- 想起の行為自体が記憶を強化する

### 4. インターリービング — Rohrer & Taylor (2007)

- 異なるタイプの問題を混ぜて出題（ブロック練習比で約43%改善）
- セッション構成: ブロック練習（新概念、20%） → インターリービング（既習混合、50%） → 応用統合（30%）
- ただし完全に新しい概念の最初の数問はブロック練習を許容

### 5. マスタリー学習 — Bloom (1968, 1984)

- **ハイブリッドアプローチ**:
  - コア概念: 厳格なマスタリー（85%以上の正答率）
  - 応用トピック: 柔軟なマスタリー（65%以上で先に進めるが、復習が自動スケジュール）
- 前提知識グラフを定義し、未達成トピックの先はロック

### 6. モチベーション — Deci & Ryan (2000), Csikszentmihalyi (1990)

- **自律性**: 学習パスの選択肢、セッション長設定（5分/15分/30分）
- **有能感**: 進捗バー、マスタリーマップ、セッション終了サマリー
- **離脱防止**: 最初の5分で成功体験を提供、ストリーク機能
- **ゲーミフィケーション**: 進捗自体を主要報酬に。外的報酬は控えめに

### MVP優先度

| 優先度 | 機能 |
|--------|------|
| P0 | SM-2間隔反復、検索練習中心フロー（読解30%/クイズ70%）、即時FB+解説、前提知識グラフ+マスタリー判定 |
| P1 | 進捗バー+マスタリーマップ、ストリーク表示、段階的ヒント、セッション終了サマリー |
| P2 | 復習ミックスモード、3段階難易度、達成バッジ、セッション長選択 |
| P3（将来） | FSRS移行、動的難易度調整、ベイズ知識追跡、コミュニティ機能 |

### 参考文献

- Bjork & Bjork (2011) "Making things hard on yourself, but in a good way"
- Bloom (1984) "The 2 Sigma Problem"
- Cepeda et al. (2008) "Spacing effects in learning"
- Roediger & Karpicke (2006) "Test-Enhanced Learning"
- Rohrer & Taylor (2007) Interleaving effects
- Sweller (1988) Cognitive Load Theory
- Deci & Ryan (2000) Self-Determination Theory

## 残りの調査事項

1. **論理学カリキュラム**: 大学初年度の論理学教科書の構成を参考に
2. **既存アプリ**: 類似アプリのUX調査
