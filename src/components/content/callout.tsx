import type { ReactNode } from "react"

const VARIANT_STYLES = {
  definition: {
    border: "border-l-primary",
    bg: "bg-primary/5",
    labelColor: "text-primary",
  },
  warning: {
    border: "border-l-destructive/60",
    bg: "bg-destructive/5",
    labelColor: "text-destructive",
  },
  tip: {
    border: "border-l-[oklch(0.550_0.100_230)]",
    bg: "bg-[oklch(0.550_0.100_230)]/5",
    labelColor: "text-[oklch(0.550_0.100_230)]",
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
      <div className="text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </div>
  )
}
