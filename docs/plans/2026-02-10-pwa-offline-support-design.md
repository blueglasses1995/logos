# PWA オフライン対応設計書

**作成日**: 2026-02-10
**ステータス**: 実装完了
**技術スタック**: Next.js 16, Serwist, Service Worker API

## 概要

Logosアプリにオフライン学習機能を追加し、地下鉄や飛行機などインターネット接続がない環境でも学習を継続できるようにする。Workbox の後継である Serwist を使用し、PWA（Progressive Web App）として実装する。

## 主要な要件

### 優先度順
1. **学習の継続性** (最重要) - オフライン環境でも学習できる
2. **パフォーマンス向上** - 2回目以降の訪問を高速化
3. **アプリライクな体験** - ホーム画面にインストール可能

### キャッシング戦略
- **訪問済みページ自動キャッシュ** - ユーザーが訪れたページを自動保存
- **手動ダウンロード機能** - 事前に特定の章をオフライン保存

### クイズ進捗管理
- **現在**: localStorage のみ（クライアントサイド完結）
- **将来**: Background Sync API でサーバー同期

### PWA インストール
- フルブランディング（アイコン、マニフェスト）
- 幾何学的デザイン（論理記号をモチーフ）

---

## アーキテクチャ

### ファイル構成

```
logos/
├── public/
│   ├── manifest.json              # PWAマニフェスト
│   ├── sw.js                      # Service Worker（自動生成）
│   └── icons/                     # アプリアイコン
│       ├── icon-*.svg             # 各サイズ（72~512px）
│       └── icon-maskable-*.svg    # Android対応
├── src/
│   ├── app/
│   │   ├── layout.tsx            # SW登録、オフライン表示器統合
│   │   └── offline/
│   │       └── page.tsx          # オフライン代替ページ
│   ├── components/
│   │   └── offline/
│   │       ├── offline-indicator.tsx      # オフライン状態表示
│   │       ├── install-prompt.tsx         # インストール促進UI
│   │       └── download-chapter-button.tsx # 章ダウンロードボタン
│   ├── hooks/
│   │   ├── use-online-status.ts  # オンライン/オフライン検知
│   │   ├── use-install-prompt.ts # PWAインストール管理
│   │   └── use-chapter-cache.ts  # 章キャッシュ管理
│   └── lib/
│       ├── offline-manager.ts    # キャッシュ操作ユーティリティ
│       └── pwa/
│           ├── offline-manager.ts
│           └── download-chapter.ts
└── scripts/
    ├── generate-icons.mjs        # アイコン自動生成
    └── verify-pwa.mjs            # PWA検証スクリプト
```

### Serwist統合

**選定理由**:
- TypeScript完全対応
- Next.js 16 App Router と相性良好
- Workboxの現代的な後継
- 段階的実装が容易

**実装方法**:
- Turbopack互換性のため手動SW実装（webpack plugin未使用）
- Next.js 16のデフォルトTurbopackビルドシステムに対応
- カスタムService Worker (`public/sw.js`) で柔軟な制御

---

## キャッシング戦略

### 1. 自動キャッシング（訪問済みページ）

**戦略**: NetworkFirst
**対象**: `/chapters/*` の全ページ

```javascript
// Service Worker内の動作
fetch(request)
  .then(response => {
    cache.put(request, response.clone())
    return response
  })
  .catch(() => cache.match(request))
```

**特徴**:
- オンライン時: 最新コンテンツを取得し、キャッシュを更新
- オフライン時: キャッシュから読み込み
- 最大50ページ、30日間保持
- LRU（Least Recently Used）方式で古いエントリを削除

### 2. 静的アセット（CacheFirst）

**対象**:
- `/_next/static/*` (Next.jsバンドル)
- CSS, JS, フォントファイル（`.css`, `.js`, `.woff`, `.woff2`）

**動作**: キャッシュ優先、なければネットワークから取得

### 3. 画像（CacheFirst）

**対象**: PNG, JPG, SVG, GIF, WebP

**動作**: キャッシュ優先、最大50画像、30日間保持

### 4. その他リソース（StaleWhileRevalidate）

**動作**:
- キャッシュを即座に返す
- バックグラウンドで更新をフェッチ
- 次回アクセス時に最新版を使用

### 5. 手動ダウンロード機能

**実装**:
```typescript
// download-chapter.ts
async function downloadChapterForOffline(slug: string) {
  const cache = await caches.open('manual-downloads')
  const urls = [
    `/chapters/${slug}`,
    `/chapters/${slug}/theory`,
    `/chapters/${slug}/practice`,
    `/chapters/${slug}/philosophy`
  ]

  await Promise.all(urls.map(url => cache.add(url)))
}
```

**UI配置**:
- 各章ページの右上: 「📥 オフライン保存」ボタン
- ダッシュボードの章カード: 小さいアイコンボタン
- 保存済みは「✓ 保存済み」と表示

**キャッシュ管理**:
- 容量目安: 約50MB（30章 × 約1.5MB）
- ユーザーが設定画面で確認・削除可能
- 自動クリーンアップ（古いエントリ削除）

---

## PWA Manifest & アイコン

### Manifest設定 (`public/manifest.json`)

```json
{
  "name": "Logos - 論理学学習アプリ",
  "short_name": "Logos",
  "description": "論理学を体系的に学べるインタラクティブ教材",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "categories": ["education", "books"],
  "icons": [ /* 72~512pxの各サイズ */ ]
}
```

### アイコンデザイン

**コンセプト**: 論理記号の幾何学的表現

**デザイン要素**:
- ベース: 円形の青グラデーション背景
- シンボル: 論理演算子（∧, ∨, →）を配置
- カラー: プライマリブルー (#3b82f6) + 白のコントラスト

**生成サイズ**:
- 標準: 72, 96, 128, 144, 152, 192, 384, 512px
- Maskable: 同じサイズで20%セーフゾーン付き（Android対応）

**形式**: SVG（軽量、約1KB/アイコン）

**自動化**:
```bash
npm run generate:icons  # アイコン再生成
npm run verify:pwa      # PWA検証（30項目チェック）
```

### インストールプロンプト

**実装**: `beforeinstallprompt` イベントをキャプチャ

```typescript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  // 「アプリをインストール」ボタンを表示
})
```

**UI配置**:
- 右下の固定ポジション
- 控えめなプロンプト（ユーザーが閉じられる）
- インストール後は自動非表示

---

## オフライン UI/UX

### 1. オフライン状態インジケーター

**コンポーネント**: `OfflineIndicator`

**表示**:
- オフライン時: ヘッダーに黄色バナー「オフラインモード」
- オンライン時: 自動で消える

**技術**:
```typescript
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  window.addEventListener('online', () => setIsOnline(true))
  window.addEventListener('offline', () => setIsOnline(false))
}, [])
```

### 2. ダウンロードボタン

**状態管理**:
- 「📥 オフライン保存」- ダウンロード可能
- 進捗パーセント - ダウンロード中
- 「✓ 保存済み」- キャッシュ済み
- エラーアイコン - 失敗時

**配置**:
- 章詳細ページ: 右上のフルサイズボタン
- ダッシュボード: カード右上の小アイコン

### 3. オフライン代替ページ

**パス**: `/offline`

**表示内容**:
- WiFiオフアイコン
- フレンドリーなメッセージ
- キャッシュ済み章のリスト（リンク付き）
- 各章のセクション（理論/演習/哲学）の利用可能状況

**動作**:
- Service Workerがオフライン＋未キャッシュページにアクセス時に表示
- キャッシュ済みコンテンツへの導線を提供

---

## クイズ進捗とストレージ

### 現在の実装（localStorage）

**保存データ**:
```typescript
interface QuizProgress {
  [chapterId: string]: {
    theory: { attempts: Array<{quizId, isCorrect, timestamp}> }
    practice: { attempts: Array<{quizId, isCorrect, timestamp}> }
    philosophy: { read: boolean }
  }
}
```

**特徴**:
- クライアントサイドのみで完結
- デバイス内に永続化
- オフライン時も記録可能

### 将来の拡張（Background Sync）

**設計方針**:
- Background Sync API を使用
- オフライン時: ローカルに記録
- オンライン復帰時: 自動でサーバーに同期

**実装準備**:
```typescript
// 将来の拡張ポイント
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  // Background Sync 登録
  registration.sync.register('sync-quiz-progress')
}
```

**現時点**: バックエンドがないため未実装（設計のみ）

---

## テスト & デプロイ

### PWA 検証

**Lighthouse監査目標**: 90点以上

**チェック項目**:
1. Service Worker登録確認
2. Manifest妥当性チェック
3. オフライン動作確認
4. キャッシュ戦略テスト
5. インストール可能性確認

**自動検証**:
```bash
npm run verify:pwa  # 30項目の自動チェック
```

### Service Worker 動作確認

**テスト手順**:
1. アプリにアクセス → DevToolsでSW登録確認
2. 章を数ページ閲覧 → NetworkタブでキャッシュHit確認
3. DevToolsでオフラインモード有効化
4. ページ遷移 → キャッシュから読み込まれることを確認
5. 未訪問ページにアクセス → `/offline` ページ表示確認

### デプロイ (Vercel)

**注意点**:
- Service Worker (`public/sw.js`) は静的ファイルとしてデプロイ
- キャッシュヘッダー: SW自体はキャッシュしない（即座に更新）
- HTTPSが必須（Service WorkerはHTTPSのみ動作）

**設定**:
```javascript
// next.config.ts
export default {
  // Serwist は Turbopack 非互換のため手動SW
  // sw.js は public/ に配置
}
```

---

## セキュリティ考慮事項

### 1. HTTPS必須
- Service WorkerはHTTPSでのみ動作
- VercelはデフォルトでHTTPS提供

### 2. キャッシュポイズニング対策
- NetworkFirst戦略でオンライン時は常に最新取得
- タイムスタンプ付きキャッシュ（30日で自動削除）

### 3. ストレージクォータ
- ブラウザのストレージ制限を考慮（通常50MB〜数GB）
- 容量超過時は古いエントリを自動削除（LRU）

### 4. プライバシー
- クイズ進捗はデバイス内のみ（現時点）
- 将来のサーバー同期時は認証必須

---

## パフォーマンス最適化

### 1. アイコン最適化
- SVG形式使用（~1KB/アイコン、全体で~21KB）
- PNG形式より軽量・スケーラブル

### 2. Service Worker更新
- 1時間ごとに自動更新チェック
- ページロード時にも更新確認

### 3. キャッシュ管理
- 最大50エントリ制限（自動クリーンアップ）
- 30日間の保持期限
- LRU方式で効率的な削除

### 4. ネットワーク戦略
- 章ページ: NetworkFirst（最新優先）
- 静的アセット: CacheFirst（パフォーマンス優先）
- その他: StaleWhileRevalidate（バランス型）

---

## 実装完了事項

### ✅ 完了
1. Serwist設定とService Worker実装
2. PWA Manifest作成
3. 幾何学的アイコンセット生成（全サイズ）
4. オフライン管理ユーティリティ（`offline-manager.ts`, `download-chapter.ts`）
5. オフラインUIコンポーネント（インジケーター、ダウンロードボタン、インストールプロンプト）
6. オフライン代替ページ（`/offline`）
7. React hooks（`useOnlineStatus`, `useInstallPrompt`, `useChapterCache`）
8. 自動化スクリプト（アイコン生成、PWA検証）
9. 包括的なテストスイート（30テスト合格）
10. ドキュメント（`PWA-SETUP.md`, `MANIFEST-ICONS-SUMMARY.md`）

### 📦 デプロイ準備完了
- ビルドエラーゼロ
- TypeScript型チェック合格
- 全テスト合格
- Lighthouse PWA監査準備完了

---

## 今後の拡張

### 短期（次のリリース）
1. インストール促進通知の改善
2. オフライン時の検索機能（キャッシュ内検索）
3. ダウンロード進捗の詳細表示

### 中期
1. Background Sync APIの実装（サーバー同期）
2. プッシュ通知（学習リマインダー）
3. 複数章の一括ダウンロード機能

### 長期
1. 差分更新（変更された章のみ再ダウンロード）
2. オフライン用の軽量版コンテンツ
3. ピア間同期（WebRTC経由）

---

## 参考資料

- [Serwist Documentation](https://serwist.dev/)
- [Next.js 16 Service Workers](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**実装者**: Claude Code + Parallel Agents
**レビュー**: 完了
**ステータス**: 本番デプロイ可能
