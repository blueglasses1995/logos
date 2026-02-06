import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface QuizCompletionCardProps {
  readonly correctCount: number
  readonly totalCount: number
  readonly nextHref?: string
  readonly nextLabel?: string
}

export function QuizCompletionCard({
  correctCount,
  totalCount,
  nextHref,
  nextLabel = "次のセクションへ",
}: QuizCompletionCardProps) {
  const ratio = totalCount > 0 ? correctCount / totalCount : 0
  const message =
    ratio === 1
      ? "完璧です！全問正解です。"
      : ratio >= 0.8
        ? "よくできました！"
        : ratio >= 0.5
          ? "半分以上正解しました。復習で定着させましょう。"
          : "もう一度理論を確認してみましょう。"

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center space-y-4">
      <CheckCircle2 className="size-10 text-primary mx-auto" />
      <div>
        <p className="text-2xl font-serif text-foreground">
          {correctCount} / {totalCount}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {nextHref && (
        <Link href={nextHref}>
          <Button>{nextLabel}</Button>
        </Link>
      )}
    </div>
  )
}
