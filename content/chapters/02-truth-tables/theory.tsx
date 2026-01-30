export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第2章: 真理値表と恒真式</h1>

      <h2>真理値表とは</h2>
      <p>
        <strong>真理値表（truth table）</strong>は、命題の全ての可能な真偽の組み合わせに対して、
        複合命題の真偽値を体系的に列挙する表です。
        第1章で学んだ論理結合子の意味を正確に把握する基本ツールです。
      </p>
      <p>
        変数がn個あるとき、真理値表の行数は2<sup>n</sup>行になります。
        2変数なら4行、3変数なら8行です。
      </p>

      <h2>真理値表の構築手順</h2>
      <ol>
        <li>含まれる命題変数を列挙する（P, Q, R, ...）</li>
        <li>全ての真偽の組み合わせを行として並べる</li>
        <li>部分式ごとに列を追加し、最終的な複合命題の値を求める</li>
      </ol>

      <h3>例: ¬(P ∧ Q) の真理値表</h3>
      <table>
        <thead>
          <tr><th>P</th><th>Q</th><th>P ∧ Q</th><th>¬(P ∧ Q)</th></tr>
        </thead>
        <tbody>
          <tr><td>T</td><td>T</td><td>T</td><td>F</td></tr>
          <tr><td>T</td><td>F</td><td>F</td><td>T</td></tr>
          <tr><td>F</td><td>T</td><td>F</td><td>T</td></tr>
          <tr><td>F</td><td>F</td><td>F</td><td>T</td></tr>
        </tbody>
      </table>

      <h2>恒真式（トートロジー）</h2>
      <p>
        <strong>恒真式（tautology）</strong>とは、命題変数にどのような真偽値を代入しても
        常に真になる論理式のことです。
      </p>
      <p>例: P ∨ ¬P（排中律）は常に真です。</p>

      <h2>矛盾式と充足可能式</h2>
      <p>
        <strong>矛盾式（contradiction）</strong>は、常に偽になる論理式です（例: P ∧ ¬P）。
      </p>
      <p>
        <strong>充足可能式（contingency）</strong>は、真になる場合も偽になる場合もある論理式です。
        多くの日常的な命題はこれに該当します。
      </p>

      <h2>重要な恒真式</h2>

      <h3>ド・モルガンの法則</h3>
      <ul>
        <li>¬(P ∧ Q) ≡ ¬P ∨ ¬Q（「PかつQでない」＝「PでないまたはQでない」）</li>
        <li>¬(P ∨ Q) ≡ ¬P ∧ ¬Q（「PまたはQでない」＝「PでないかつQでない」）</li>
      </ul>
      <p>
        プログラミングでは条件分岐の簡略化に頻繁に使います。
        例えば <code>!(a &amp;&amp; b)</code> は <code>!a || !b</code> と同値です。
      </p>

      <h3>二重否定除去</h3>
      <p>¬¬P ≡ P — 否定の否定は元に戻ります。</p>

      <h3>対偶</h3>
      <p>
        (P → Q) ≡ (¬Q → ¬P) — 「PならばQ」と「QでないならばPでない」は論理的に同値です。
        これは証明や議論で非常に強力なツールです。
      </p>

      <h3>含意の定義</h3>
      <p>
        (P → Q) ≡ (¬P ∨ Q) — 条件文は否定と論理和で表せます。
        これは直感に反するかもしれませんが、真理値表で確認できます。
      </p>
    </article>
  )
}
