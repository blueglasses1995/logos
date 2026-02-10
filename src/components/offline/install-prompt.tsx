"use client"

import { useInstallPrompt } from "@/hooks/use-install-prompt"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { useState } from "react"

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!canInstall || isDismissed) return null

  const handleInstall = async () => {
    const accepted = await promptInstall()
    if (!accepted) {
      setIsDismissed(true)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-card border border-border rounded-lg shadow-lg p-4 z-50">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="閉じる"
      >
        <X className="size-4" />
      </button>
      <div className="space-y-3 pr-6">
        <div>
          <h3 className="font-medium text-foreground">
            アプリをインストール
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            オフラインでも使えるように、Logosをホーム画面に追加しましょう
          </p>
        </div>
        <Button onClick={handleInstall} size="sm" className="w-full">
          <Download className="size-4" />
          インストール
        </Button>
      </div>
    </div>
  )
}
