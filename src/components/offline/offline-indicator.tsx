"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="bg-[oklch(0.828_0.150_84)] text-foreground border-b border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <WifiOff className="size-4" />
          <span className="font-medium">オフラインモード</span>
          <span className="text-muted-foreground hidden sm:inline">
            — キャッシュされたコンテンツのみ利用可能
          </span>
        </div>
      </div>
    </div>
  )
}
