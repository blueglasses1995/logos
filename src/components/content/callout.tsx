import type { ReactNode } from "react"

const VARIANT_STYLES = {
  definition: {
    border: "border-l-zinc-400",
    bg: "bg-zinc-50 dark:bg-zinc-900/50",
    labelColor: "text-zinc-600 dark:text-zinc-400",
  },
  warning: {
    border: "border-l-amber-400 dark:border-l-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    labelColor: "text-amber-700 dark:text-amber-400",
  },
  tip: {
    border: "border-l-blue-400 dark:border-l-blue-500",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    labelColor: "text-blue-700 dark:text-blue-400",
  },
} as const

interface CalloutProps {
  readonly variant: keyof typeof VARIANT_STYLES
  readonly label?: string
  readonly children: ReactNode
}

export function Callout({ variant, label, children }: CalloutProps) {
  const styles = VARIANT_STYLES[variant]
  return (
    <div
      className={`not-prose my-6 border-l-4 ${styles.border} ${styles.bg} rounded-r-md px-5 py-4`}
    >
      {label && (
        <div
          className={`text-xs font-semibold uppercase tracking-wider mb-2 ${styles.labelColor}`}
        >
          {label}
        </div>
      )}
      <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </div>
  )
}
