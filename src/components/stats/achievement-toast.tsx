"use client"

import { useEffect, useState } from "react"

interface AchievementToastProps {
  readonly title: string
  readonly onDismiss: () => void
}

export function AchievementToast({ title, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-primary/20 bg-card px-5 py-3 shadow-lg transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <p className="text-sm font-medium text-foreground">
        ★ 実績解除: {title}
      </p>
    </div>
  )
}
