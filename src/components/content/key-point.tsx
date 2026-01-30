import type { ReactNode } from "react"

interface KeyPointProps {
  readonly children: ReactNode
}

export function KeyPoint({ children }: KeyPointProps) {
  return (
    <div className="not-prose my-6 border-y border-zinc-200 dark:border-zinc-700 py-4 px-1">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
        {children}
      </p>
    </div>
  )
}
