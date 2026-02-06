import type { ReactNode } from "react"

interface KeyPointProps {
  readonly children: ReactNode
}

export function KeyPoint({ children }: KeyPointProps) {
  return (
    <div className="not-prose my-6 border-y border-border py-4 px-1">
      <p className="text-sm font-medium text-foreground leading-relaxed">
        {children}
      </p>
    </div>
  )
}
