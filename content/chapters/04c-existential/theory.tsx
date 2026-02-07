import {
  Callout,
  FormulaBlock,
  ComparisonTable,
  KeyPoint,
  SectionDivider,
} from "@/components/content"
import { VennDiagram, ExampleMapping, InlineMiniQuiz } from "@/components/interactive"

export function TheoryContent() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>第4c章: 存在量化子（∃） — 「存在する」を厳密に表現する</h1>

      <h2>定義: 存在量化子とは何か</h2>

      <Callout variant="definition" label="定義">
        <p>
          <strong>存在量化子（existential quantifier）∃</strong>は、
          「ある性質を持つ対象が<strong>少なくとも一つ存在する</strong>」ことを主張する記号です。
        </p>
      </Callout>

      <FormulaBlock caption="存在量化子の読み方">
        ∃x P(x) — 「P(x)が成り立つxが少なくとも一つ存在する」
      </FormulaBlock>

      <p>
        全称量化子∀が「すべてのxについてP(x)が成り立つ」と主張するのに対し、
        存在量化子∃は「P(x)を満たすxが<strong>たった一つでもあれば十分</strong>」です。
      </p>

      <p>
        ∃xP(x)を証明するには、P(a)が真となる具体的なaを<strong>一つ見つければ十分</strong>です。
        これを<strong>存在証明（existential proof）</strong>と呼びます。
      </p>

      <p>
        一方、∃xP(x)を否定するには、すべてのxについてP(x)が偽であることを示す必要があります。
        つまり、∀x¬P(x)を証明しなければなりません。
      </p>

      <KeyPoint>
        ∃xP(x)の証明 = 具体例を一つ提示する。否定 = ∀x¬P(x)を証明する（すべてのxでP(x)が偽）。
      </KeyPoint>

      <VennDiagram
        labelA="P(x)"
        labelB="Q(x)"
        highlight={["intersection"]}
        formulaLabel="∃x (P(x) ∧ Q(x)): P と Q を同時に満たす個体がある"
      />

      <SectionDivider />

      <h2>形式化パターン: なぜ∧であって→ではないのか</h2>

      <p>
        存在量化子を使った形式化で<strong>最も重要なポイント</strong>が、結合子の選択です。
        標準的な形式化パターンは以下です。
      </p>

      <FormulaBlock caption="存在量化子の標準パターン">
        ∃x (P(x) ∧ Q(x)) — 「P(x)かつQ(x)であるxが存在する」
      </FormulaBlock>

      <p>
        ここで<strong>∧（かつ）</strong>を使うのには深い理由があります。
        もし→（ならば）を使って <code>∃x (P(x) → Q(x))</code> と書いたらどうなるでしょうか？
      </p>

      <h3>∃x(P(x)→Q(x))の罠</h3>

      <p>
        具体例で考えましょう。
        「ある学生はプログラマーである」を形式化したいとします。
      </p>
      <ul>
        <li><code>S(x)</code>: xは学生である</li>
        <li><code>P(x)</code>: xはプログラマーである</li>
      </ul>

      <ComparisonTable
        headers={["正しい形式化（∧）", "誤った形式化（→）"]}
        rows={[
          [
            "∃x (S(x) ∧ P(x))",
            "∃x (S(x) → P(x))",
          ],
          [
            "「学生であり、かつプログラマーであるxが存在する」",
            "「学生ならばプログラマーである、そういうxが存在する」",
          ],
          [
            "学生かつプログラマーの実在を要求する",
            "学生でないもの（石ころ等）が一つでもあれば空虚に真になる",
          ],
        ]}
      />

      <p>
        含意（→）の真理値表を思い出してください。
        <code>S(x) → P(x)</code> は、S(x)が偽のとき<strong>自動的に真</strong>になります。
      </p>

      <p>
        つまり、学生でない対象（例えば石ころ、猫、東京タワーなど）が一つでも世界に存在すれば、
        その対象についてS(x)→P(x)は真になります。
      </p>

      <Callout variant="warning" label="よくある誤解">
        <p>
          <code>∃x (S(x) → P(x))</code> は
          「学生でないものが一つでも存在する」だけで真になってしまいます。
          これは「ある学生はプログラマーである」という元の意味とはまったく異なります。
          世界に学生以外の何かが存在するだけで、この文は<strong>空虚に真（vacuously true）</strong>になるのです。
        </p>
      </Callout>

      <p>
        <strong>∧を使う理由</strong>: 存在量化子で何かの存在を主張するとき、
        私たちは「P(x)でありQ(x)でもある、そういうxが実際にいる」と言いたいのです。
        ∧は「xが両方の性質を同時に持つ」ことを要求します。
      </p>

      <p>
        →は「xがPならQである」という条件しか課さず、Pでないxでも条件を満たしてしまいます。
      </p>

      <KeyPoint>
        存在量化子∃の形式化には∧を使う。→を使うと空虚な真の罠に陥る。
      </KeyPoint>

      <SectionDivider />

      <h2>∀との対比: →と∧の使い分け</h2>

      <p>
        全称量化子∀と存在量化子∃で結合子が異なることは、
        述語論理を学ぶ上で<strong>最も混乱しやすいポイント</strong>です。
        ここで明確に整理しましょう。
      </p>

      <h3>パターン比較</h3>

      <ComparisonTable
        headers={["全称量化子 ∀（→を使う）", "存在量化子 ∃（∧を使う）"]}
        rows={[
          [
            "∀x (P(x) → Q(x))",
            "∃x (P(x) ∧ Q(x))",
          ],
          [
            "「Pであるものはすべて、Qでもある」",
            "「PでありかつQであるものが存在する」",
          ],
          [
            "→はドメインの制限として機能する",
            "∧は存在の断言として機能する",
          ],
          [
            "Pでないものについては何も主張しない",
            "xがP・Q両方を持つことを要求する",
          ],
        ]}
      />

      <h3>直感的な理解</h3>

      <p>
        <strong>∀が→を使う理由</strong>:
        「すべての学生は勤勉である」= <code>∀x(S(x) → D(x))</code>。
        ∀は「Sという条件を満たすものに限定して、その中でDが成り立つ」と主張します。
      </p>

      <p>
        →は<strong>ドメインの制限</strong>として機能します。
        学生でないもの（石ころなど）については何も主張しません（→は前件が偽なら真）。
        これは意図通りです。石ころが勤勉かどうかは無関係だからです。
      </p>

      <p>
        <strong>∃が∧を使う理由</strong>:
        「ある学生は勤勉である」= <code>∃x(S(x) ∧ D(x))</code>。
        ∃は「SでありかつDでもある、そういうものが実際に存在する」と主張します。
      </p>

      <p>
        ∧は<strong>存在の断言</strong>として機能します。
        「学生であること」と「勤勉であること」の両方を満たすxの実在を要求します。
      </p>

      <h3>間違えたらどうなるか</h3>
      <ul>
        <li>
          <strong>∀x(P(x) ∧ Q(x))</strong> と書くと
          「すべてのものがPでありかつQである」になり、強すぎる主張になります。
          「すべての学生が勤勉」ではなく「すべてのもの（石ころも含む）が学生で勤勉」になってしまいます。
        </li>
        <li>
          <strong>∃x(P(x) → Q(x))</strong> と書くと
          前述の通り、Pでないものが一つでもあれば空虚に真になり、弱すぎる主張になります。
        </li>
      </ul>

      <Callout variant="tip">
        <p><strong>覚え方:</strong></p>
        <ul>
          <li><strong>∀ = 条件付け（→）</strong>: 「もしPなら、Qである」をすべてに適用</li>
          <li><strong>∃ = 同時成立（∧）</strong>: 「PかつQであるもの」の実在を主張</li>
        </ul>
      </Callout>

      <KeyPoint>
        ∀には→（ドメイン制限）、∃には∧（存在の断言）。逆にすると強すぎるか弱すぎる主張になる。
      </KeyPoint>

      <SectionDivider />

      <h2>具体例</h2>

      <h3>日常: バグが存在する</h3>

      <p>
        ソフトウェア開発で最も頻繁に使う存在文です。
      </p>

      <FormulaBlock caption="バグの存在を形式化する">
        ∃x Bug(x) — 「バグが存在する」{"\n"}
        ∃x (Bug(x) ∧ Critical(x)) — 「致命的なバグが存在する」{"\n"}
        ∃x (Bug(x) ∧ InModule(x, auth)) — 「認証モジュールにバグが存在する」
      </FormulaBlock>

      <p>
        バグ報告とは本質的に「∃x Bug(x)」の存在証明です。
        具体的な再現手順を示すことで、バグの存在を証明します。
      </p>

      <h3>数学: ある素数は偶数である</h3>

      <FormulaBlock caption="偶数の素数の存在">
        ∃x (Prime(x) ∧ Even(x)) — 「素数であり、かつ偶数であるxが存在する」
      </FormulaBlock>

      <p>
        これは真です。x = 2がその証拠です。
        2は素数であり、偶数でもあります。
      </p>

      <p>
        存在証明では、条件を満たす具体例を一つ提示すれば十分です。
        なお、∃は「少なくとも一つ」を意味するだけであり、偶数の素数が2だけでも∃の主張としては十分です。
      </p>

      <h3>プログラミング: Array.some()</h3>

      <p>
        JavaScriptやTypeScriptの <code>Array.some()</code> は、
        存在量化子∃のプログラミング的実装です。
      </p>

      <FormulaBlock caption="Array.some() = ∃の判定">
        users.some(u =&gt; u.isAdmin){"\n"}
        ≡ ∃x (User(x) ∧ Admin(x))
      </FormulaBlock>

      <p>
        同様に、<code>Array.find()</code> は存在量化子の「証拠」を返す関数です。
        <code>users.find(u =&gt; u.isAdmin)</code> は「Admin(x)を満たす具体的なxを一つ見つけて返す」操作です。
      </p>

      <h3>SQL: EXISTS句</h3>

      <p>
        SQLの <code>EXISTS</code> は、存在量化子∃そのものです。
      </p>

      <FormulaBlock caption="SQL EXISTS = ∃">
        SELECT * FROM departments d{"\n"}
        WHERE EXISTS ({"\n"}
        {"  "}SELECT 1 FROM employees e{"\n"}
        {"  "}WHERE e.dept_id = d.id AND e.salary &gt; 100000{"\n"}
        )
      </FormulaBlock>

      <p>
        これは「年収が10万を超える社員が<strong>少なくとも一人存在する</strong>部署」を返します。
        EXISTS内のサブクエリが一行でも返せば、その部署は結果に含まれます。
        まさに∃の意味です。
      </p>

      <h3>科学: 反例が存在する</h3>

      <p>
        科学的方法において、理論を反証するとは
        <code>∃x ¬Theory(x)</code> を証明することです。
        つまり、理論が予測する結果と矛盾する事例を一つ見つけることです。
      </p>

      <p>
        カール・ポパーの反証主義では、科学理論は「反証可能」であることが条件です。
        「すべての白鳥は白い」（∀x(Swan(x) → White(x))）という理論は、
        黒い白鳥を一羽見つける（∃x(Swan(x) ∧ ¬White(x))）だけで反証されます。
      </p>

      <KeyPoint>
        一つの反例が理論全体を覆す、これが∃の力。Array.some()、SQL EXISTS、科学的反証はすべて∃の応用。
      </KeyPoint>

      <ExampleMapping
        formula="∃x (Cat(x) ∧ Black(x))"
        example="黒い猫が存在する"
        variables={{ "∃x": "あるxが存在して", "Cat(x)": "xは猫", "Black(x)": "xは黒い" }}
      />

      <SectionDivider />

      <h2>反例: ∃x(P(x)→Q(x))の罠を深堀りする</h2>

      <p>
        この落とし穴は非常に重要なので、別の角度からもう一度確認しましょう。
      </p>

      <FormulaBlock caption="空虚な真の例">
        ∃x (Student(x) → Fly(x)) — 「学生ならば空を飛べる、そういうxが存在する」
      </FormulaBlock>

      <p>
        一見すると「空を飛べる学生がいる」という意味に見えます。
        しかし実際には、この文は<strong>ほぼ確実に真</strong>です。
      </p>

      <Callout variant="warning" label="よくある誤解">
        <p>なぜ空虚に真になるのか：</p>
        <ul>
          <li>石ころはStudent(x)が偽です</li>
          <li>Student(石ころ) → Fly(石ころ) は「偽→偽」なので真です</li>
          <li>よって「石ころ」がこの条件を満たすxとして存在します</li>
          <li>したがって ∃x(Student(x) → Fly(x)) は真です</li>
        </ul>
        <p>
          学生が空を飛べるかどうかとは無関係に、
          学生でないものが一つでも存在するだけで真になります。
          これが<strong>空虚な真（vacuous truth）</strong>の罠です。
        </p>
      </Callout>

      <p>
        正しく「空を飛べる学生が存在する」と言いたければ：
      </p>

      <FormulaBlock caption="正しい形式化">
        ∃x (Student(x) ∧ Fly(x))
      </FormulaBlock>

      <p>
        これなら「学生であり、かつ空を飛べるxが実在する」と明確に主張します。
        ∧を使えば、xが両方の性質を持つことを要求するので、空虚な真の問題は起きません。
      </p>

      <SectionDivider />

      <h2>どこで使われるか</h2>

      <h3>バグレポートと品質保証</h3>

      <p>
        バグ報告は「∃x Bug(x)」の存在証明です。
        再現手順は、バグの存在を実証する<strong>具体的な証拠（witness）</strong>です。
      </p>

      <p>
        「バグがある」と主張するなら、一つの具体例を示せば十分です。
        逆に「バグがない」と主張するには、すべてのケースをテストする必要があります（∀x ¬Bug(x)）。
        これが網羅的テストの難しさの本質です。
      </p>

      <h3>科学的発見</h3>

      <p>
        科学における反証は ∃x¬P(x)（反例の存在証明）です。
        一つの反例が「すべてのxについてP(x)」という全称命題を覆します。
      </p>

      <p>
        ブラックスワンの発見、超伝導体の発見、新種の発見、
        すべて存在量化子による主張です。
      </p>

      <h3>SQLのEXISTSサブクエリ</h3>

      <p>
        データベースで「条件を満たすレコードが存在するか」を問うのは日常的です。
        EXISTS、IN、ANYなどのSQL構文は存在量化子の実装です。
      </p>

      <p>
        パフォーマンス最適化でもEXISTSの理解は重要です。
        データベースエンジンは「一つ見つかれば探索を打ち切る」最適化を行います。
      </p>

      <h3>TypeScriptのArray.find()とArray.some()</h3>

      <p>
        <code>Array.some(predicate)</code> は ∃x P(x) の判定、
        <code>Array.find(predicate)</code> は ∃x P(x) の証拠（witness）の取得です。
      </p>

      <p>
        これらの関数は、条件を満たす要素が一つ見つかった時点で走査を停止します。
        これは存在量化子の意味論と一致しています。一つあれば十分だからです。
      </p>

      <KeyPoint>
        存在量化子∃はバグ報告、科学的反証、SQL EXISTS、Array.some()/find()として日常的に使われている。
      </KeyPoint>

      <InlineMiniQuiz
        question="∃x P(x) が偽になるのはどんなとき？"
        options={["P(x)を満たすxが一つも存在しないとき", "P(x)を満たすxが一つだけのとき", "P(x)を満たさないxが存在するとき", "常に偽にはならない"]}
        correctIndex={0}
        explanation="存在量化は「少なくとも一つ」の存在を主張するため、一つも存在しないときに偽になります。"
      />

      <SectionDivider />

      <h2>ないと困ること</h2>

      <h3>「バグがある」と「全モジュールにバグがある」の区別ができない</h3>

      <p>
        存在量化子がなければ、「バグが存在する」（∃x Bug(x)）と
        「すべてのモジュールにバグがある」（∀x Bug(x)）を区別できません。
      </p>

      <p>
        前者はバグが一つあれば真、後者はすべてのモジュールがバグだらけでないと真になりません。
        この区別は品質保証の議論で不可欠です。
      </p>

      <h3>科学的方法が成り立たない</h3>

      <p>
        科学は理論を∀x P(x)の形で提唱し、∃x ¬P(x)（反例の存在）で反証します。
        存在量化子なしでは「反例が見つかった」を厳密に表現できず、科学的方法の論理的基盤が崩れます。
      </p>

      <h3>データベースクエリが書けない</h3>

      <p>
        「条件を満たすレコードが存在するか？」はデータベース操作の基本です。
        EXISTS句の意味が分からなければ、サブクエリの設計が曖昧になります。
        期待と異なる結果を返すクエリを書いてしまいます。
      </p>

      <SectionDivider />

      <h2>よくある誤解</h2>

      <h3>誤解1: ∃は「ちょうど一つ」を意味する</h3>

      <Callout variant="warning" label="よくある誤解">
        <p>
          ∃x P(x) は「P(x)を満たすxが<strong>少なくとも一つ</strong>存在する」を意味します。
          100個あっても、1万個あっても、∃x P(x) は真です。
        </p>
      </Callout>

      <p>
        「ちょうど一つ」を表現したい場合は以下のように書きます。
      </p>

      <FormulaBlock caption="唯一存在量化子（∃!）">
        ∃x (P(x) ∧ ∀y (P(y) → y = x))
      </FormulaBlock>

      <p>
        これは「P(x)を満たすxが存在し、かつP(y)を満たすyはすべてそのxと同一である」
        という意味で、<strong>唯一存在量化子（∃!）</strong>と呼ばれます。
      </p>

      <h3>誤解2: ∃x(P(x)→Q(x))が正しい形式化だ</h3>

      <Callout variant="warning" label="よくある誤解">
        <p>
          これは空虚な真の罠に陥ります。
          存在量化子には∧を使うのが標準パターンです。
        </p>
        <ul>
          <li><strong>∀には→</strong>: 「Pであるものはすべて、Qでもある」</li>
          <li><strong>∃には∧</strong>: 「PでありかつQであるものが存在する」</li>
        </ul>
      </Callout>

      <p>
        この使い分けを間違えると、意図と異なる論理式を書いてしまいます。
        特に∃x(P(x)→Q(x))は、世界にP(x)が偽のものが一つでもあれば真になります。
        ほとんど何も主張しない空虚な文になります。
      </p>

      <h3>誤解3: ¬∃xP(x) は ∃x¬P(x) を意味する</h3>

      <Callout variant="warning" label="よくある誤解">
        <p>
          これは全く異なる主張です。混同してはいけません。
        </p>
      </Callout>

      <ComparisonTable
        headers={["¬∃xP(x)", "∃x¬P(x)"]}
        rows={[
          [
            "P(x)を満たすxは一つも存在しない",
            "P(x)を満たさないxが少なくとも一つ存在する",
          ],
          [
            "= ∀x ¬P(x)（すべてのxでP(x)が偽）",
            "P(x)が真のxも存在するかもしれない",
          ],
          [
            "例: 「合格者は一人もいない」（全員不合格）",
            "例: 「不合格者が少なくとも一人いる」（合格者もいるかもしれない）",
          ],
        ]}
      />

      <p>
        ¬∃xP(x) は ∀x¬P(x) と同値であり、∃x¬P(x)とは全く異なります。
        この量化子の否定の関係は、次の第4d章で詳しく学びます。
      </p>

      <KeyPoint>
        ∃は「少なくとも一つ」。∃には∧を使う。¬∃xP(x) = ∀x¬P(x) であり ∃x¬P(x) とは別物。
      </KeyPoint>
    </article>
  )
}
