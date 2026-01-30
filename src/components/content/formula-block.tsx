import type { ReactNode } from "react"

interface FormulaBlockProps {
  readonly children: ReactNode
  readonly caption?: string
}

export function FormulaBlock({ children, caption }: FormulaBlockProps) {
  return (
    <figure className="not-prose my-6">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-6 py-4 text-center">
        <code className="text-base font-mono text-zinc-800 dark:text-zinc-200">
          {children}
        </code>
      </div>
      {caption && (
        <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
