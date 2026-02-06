"use client"

import { useState, useCallback } from "react"

interface SandboxFormula {
  readonly label: string
  readonly evaluate: (values: Readonly<Record<string, boolean>>) => boolean
}

interface LogicSandboxProps {
  readonly variables: readonly string[]
  readonly formulas: readonly SandboxFormula[]
  readonly caption?: string
}

export function LogicSandbox({
  variables,
  formulas,
  caption,
}: LogicSandboxProps) {
  const [values, setValues] = useState<Readonly<Record<string, boolean>>>(() =>
    Object.fromEntries(variables.map((v) => [v, true]))
  )

  const toggle = useCallback((variable: string) => {
    setValues((prev) => ({ ...prev, [variable]: !prev[variable] }))
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-5 py-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
          ロジック・サンドボックス
        </div>

        {/* Variable toggles */}
        <div className="flex items-center gap-3 mb-4">
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              aria-label={`${v}: ${values[v] ? "True" : "False"} — クリックで切替`}
              onClick={() => toggle(v)}
              className={`
                px-3 py-1.5 rounded-md font-mono text-sm font-semibold
                transition-all duration-300 border-2 cursor-pointer select-none
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

        {/* Formula results */}
        <div className="space-y-2">
          {formulas.map((f) => {
            const result = f.evaluate(values)
            return (
              <div
                key={f.label}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-background/50 border border-border/50"
              >
                <code className="text-sm font-mono text-foreground">
                  {f.label}
                </code>
                <span
                  data-testid="sandbox-result"
                  className={`
                    font-mono font-bold text-sm
                    transition-all duration-300
                    ${result ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                  `}
                >
                  {result ? "T" : "F"}
                </span>
              </div>
            )
          })}
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
