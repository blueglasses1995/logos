export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第4章: 述語論理の基礎</h1>

      <h2>命題論理の限界</h2>
      <p>
        命題論理では「すべての人間は死すべきものである」のような文を
        一つの命題Pとして扱うしかありません。
        <strong>述語論理（predicate logic）</strong>は、
        命題の内部構造——主語と述語——を分析できるようにする拡張です。
      </p>

      <h2>述語と項</h2>
      <p>
        <strong>述語（predicate）</strong>は、対象の性質や関係を表す表現です。
      </p>
      <ul>
        <li>「xは人間である」→ H(x)（一項述語）</li>
        <li>「xはyより大きい」→ G(x, y)（二項述語）</li>
        <li>「xはyにzを送った」→ S(x, y, z)（三項述語）</li>
      </ul>

      <h2>全称量化子（∀）</h2>
      <p>
        <strong>∀x P(x)</strong> は「すべてのxについてP(x)が成り立つ」を意味します。
      </p>
      <p>日本語例: 「すべての社員は研修を受講済みである」→ ∀x (Employee(x) → Trained(x))</p>

      <h2>存在量化子（∃）</h2>
      <p>
        <strong>∃x P(x)</strong> は「P(x)が成り立つxが少なくとも一つ存在する」を意味します。
      </p>
      <p>日本語例: 「バグが存在する」→ ∃x Bug(x)</p>

      <h2>量化子の否定</h2>
      <p>量化子の否定には重要な等価関係があります:</p>
      <ul>
        <li>¬∀x P(x) ≡ ∃x ¬P(x)（「すべてがPではない」＝「Pでないものが存在する」）</li>
        <li>¬∃x P(x) ≡ ∀x ¬P(x)（「Pなものが存在しない」＝「すべてがPでない」）</li>
      </ul>
      <p>
        これは命題論理のド・モルガンの法則の一般化です。
        ∀は「巨大な∧」、∃は「巨大な∨」と考えると理解しやすくなります。
      </p>

      <h2>多重量化</h2>
      <p>
        量化子を複数組み合わせることができます。順序に注意が必要です:
      </p>
      <ul>
        <li>∀x ∃y Loves(x, y) — 「すべての人は誰かを愛している」</li>
        <li>∃y ∀x Loves(x, y) — 「すべての人に愛されている人が存在する」</li>
      </ul>
      <p>量化子の順序を変えると意味が変わります。</p>

      <h2>SQLとの対応</h2>
      <p>
        プログラマにとって、述語論理はSQLと密接に関連しています:
      </p>
      <ul>
        <li>∀ — <code>NOT EXISTS (... WHERE NOT ...)</code></li>
        <li>∃ — <code>EXISTS (... WHERE ...)</code></li>
        <li>WHERE句の条件 — 述語の適用</li>
      </ul>
    </article>
  )
}
