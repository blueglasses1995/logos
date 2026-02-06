import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface ReviewPromptProps {
  readonly dueCount: number
}

export function ReviewPrompt({ dueCount }: ReviewPromptProps) {
  if (dueCount === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <RotateCcw className="size-4" />
        <span>復習が必要なアイテムはありません</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <RotateCcw className="size-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {dueCount}件の復習アイテム
          </p>
          <p className="text-xs text-muted-foreground">
            期限を迎えた問題があります
          </p>
        </div>
      </div>
      <Link href="/review">
        <Button size="sm">復習を開始</Button>
      </Link>
    </div>
  )
}
