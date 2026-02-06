import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <span className="text-6xl font-serif text-primary/40">404</span>
      <p className="text-lg text-muted-foreground">ページが見つかりませんでした</p>
      <Link href="/">
        <Button>ダッシュボードに戻る</Button>
      </Link>
    </div>
  )
}
