export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第1章: 命題と論理結合子</h1>

      <h2>命題とは何か</h2>
      <p>
        <strong>命題（proposition）</strong>とは、真か偽のいずれか一方の値を持つ文のことです。
      </p>
      <ul>
        <li>「東京は日本の首都である」→ 命題（真）</li>
        <li>「2 + 3 = 6」→ 命題（偽）</li>
        <li>「今日は良い天気ですね」→ 命題ではない（真偽が不確定）</li>
      </ul>

      <h2>論理結合子（Logical Connectives）</h2>
      <p>
        複数の命題を組み合わせるための記号を<strong>論理結合子</strong>と呼びます。
      </p>

      <h3>否定（NOT）: ¬P</h3>
      <p>
        命題Pの真偽を反転させます。Pが真なら¬Pは偽、Pが偽なら¬Pは真です。
      </p>

      <h3>論理積（AND）: P ∧ Q</h3>
      <p>
        PとQの<strong>両方が真</strong>のときだけ真になります。
        日常語では「PかつQ」「PでありQ」に対応します。
      </p>

      <h3>論理和（OR）: P ∨ Q</h3>
      <p>
        PとQの<strong>少なくとも一方が真</strong>なら真になります。
        注意：論理学のORは「包含的OR」です。両方真でも真です。
      </p>

      <h3>条件文（IF-THEN）: P → Q</h3>
      <p>
        「PならばQ」を表します。<strong>Pが真でQが偽のときだけ偽</strong>になります。
        直感に反するかもしれませんが、Pが偽のとき、P → Qは常に真です（空真、vacuous truth）。
      </p>

      <h3>双条件文（IFF）: P ↔ Q</h3>
      <p>
        「PならばQであり、かつQならばP」を表します。
        PとQの真偽が<strong>一致するとき</strong>に真になります。
      </p>
    </article>
  )
}
