import type { ReactNode } from "react"

interface FormulaBlockProps {
  readonly children: ReactNode
  readonly caption?: string
}

export function FormulaBlock({ children, caption }: FormulaBlockProps) {
  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-6 py-4 text-center">
        <code className="text-base font-mono text-foreground">
          {children}
        </code>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
