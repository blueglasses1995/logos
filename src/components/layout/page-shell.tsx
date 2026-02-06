import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageShellProps {
  readonly variant?: "dashboard" | "reading" | "quiz"
  readonly children: ReactNode
  readonly className?: string
}

const VARIANT_STYLES = {
  dashboard: "max-w-5xl",
  reading: "max-w-2xl",
  quiz: "max-w-3xl",
} as const

export function PageShell({
  variant = "dashboard",
  children,
  className,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto py-8 px-4 sm:px-6",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
