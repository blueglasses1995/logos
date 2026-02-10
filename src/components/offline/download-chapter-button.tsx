"use client"

import { useChapterCache } from "@/hooks/use-chapter-cache"
import { Button } from "@/components/ui/button"
import { Download, Check, Loader2, AlertCircle } from "lucide-react"

interface DownloadChapterButtonProps {
  slug: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function DownloadChapterButton({
  slug,
  variant = "outline",
  size = "sm",
  showLabel = true,
}: DownloadChapterButtonProps) {
  const { isCached, isLoading, progress, error, download } =
    useChapterCache(slug)

  const handleClick = async () => {
    if (!isCached && !isLoading) {
      await download()
    }
  }

  if (error) {
    return (
      <Button variant="outline" size={size} disabled>
        <AlertCircle className="size-4 text-destructive" />
        {showLabel && <span className="text-xs">エラー</span>}
      </Button>
    )
  }

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="size-4 animate-spin" />
        {showLabel && (
          <span className="text-xs">
            {progress > 0 ? `${Math.round(progress)}%` : "処理中..."}
          </span>
        )}
      </Button>
    )
  }

  if (isCached) {
    return (
      <Button variant="ghost" size={size} disabled>
        <Check className="size-4 text-primary" />
        {showLabel && <span className="text-xs">保存済み</span>}
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick}>
      <Download className="size-4" />
      {showLabel && <span className="text-xs">オフライン保存</span>}
    </Button>
  )
}
