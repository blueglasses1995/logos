"use client"

import { useState, useCallback } from "react"

interface TruthValueAnimatorProps {
  readonly variables: readonly string[]
  readonly formula: string
  readonly evaluate: (values: Readonly<Record<string, boolean>>) => boolean
  readonly caption?: string
}

export function TruthValueAnimator({
  variables,
  formula,
  evaluate,
  caption,
}: TruthValueAnimatorProps) {
  const [values, setValues] = useState<Readonly<Record<string, boolean>>>(() =>
    Object.fromEntries(variables.map((v) => [v, true]))
  )

  const result = evaluate(values)

  const toggle = useCallback((variable: string) => {
    setValues((prev) => ({ ...prev, [variable]: !prev[variable] }))
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-6 py-5">
        <div className="flex items-center justify-center gap-4 mb-4">
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              aria-label={`${v}: ${values[v] ? "True" : "False"} — クリックで切替`}
              onClick={() => toggle(v)}
              className={`
                px-4 py-2 rounded-md font-mono text-base font-semibold
                transition-all duration-300 ease-out
                border-2 cursor-pointer select-none
                ${
                  values[v]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-300"
                    : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300"
                }
              `}
            >
              {v} = {values[v] ? "T" : "F"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <code className="text-base font-mono text-foreground">{formula}</code>
          <span className="text-muted-foreground">=</span>
          <span
            data-testid="result-value"
            className={`
              text-xl font-mono font-bold
              transition-all duration-300 ease-out
              ${
                result
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }
            `}
          >
            {result ? "T" : "F"}
          </span>
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
