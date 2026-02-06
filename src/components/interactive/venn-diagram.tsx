"use client"

import { useState, useCallback } from "react"

type Region = "a-only" | "intersection" | "b-only" | "outside"

interface VennDiagramProps {
  readonly labelA: string
  readonly labelB: string
  readonly highlight?: readonly Region[]
  readonly interactive?: boolean
  readonly formulaLabel?: string
  readonly caption?: string
}

export function VennDiagram({
  labelA,
  labelB,
  highlight: initialHighlight,
  interactive = false,
  formulaLabel,
  caption,
}: VennDiagramProps) {
  const [highlighted, setHighlighted] = useState<ReadonlySet<Region>>(
    new Set(initialHighlight ?? [])
  )

  const toggleRegion = useCallback((region: Region) => {
    setHighlighted((prev) => {
      const next = new Set(prev)
      if (next.has(region)) {
        next.delete(region)
      } else {
        next.add(region)
      }
      return next
    })
  }, [])

  const regionFill = (region: Region) =>
    highlighted.has(region) ? "fill-primary/30" : "fill-transparent"

  const CX_A = 115
  const CX_B = 195
  const CY = 110
  const R = 70

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-4 py-4 flex flex-col items-center">
        {formulaLabel && (
          <div className="text-sm font-mono text-foreground mb-3">
            {formulaLabel}
          </div>
        )}
        <svg viewBox="0 0 310 220" className="w-full max-w-sm" role="img" aria-label={`ベン図: ${labelA} と ${labelB}`}>
          <defs>
            <clipPath id="clip-a">
              <circle cx={CX_A} cy={CY} r={R} />
            </clipPath>
            <clipPath id="clip-b">
              <circle cx={CX_B} cy={CY} r={R} />
            </clipPath>
          </defs>

          {/* Circle A background */}
          <circle
            cx={CX_A} cy={CY} r={R}
            className={`${regionFill("a-only")} stroke-primary transition-all duration-300`}
            strokeWidth={2}
          />

          {/* Circle B background */}
          <circle
            cx={CX_B} cy={CY} r={R}
            className={`${regionFill("b-only")} stroke-emerald-600 dark:stroke-emerald-400 transition-all duration-300`}
            strokeWidth={2}
          />

          {/* Intersection: circle B clipped to circle A */}
          <circle
            cx={CX_B} cy={CY} r={R}
            clipPath="url(#clip-a)"
            className={`${regionFill("intersection")} transition-all duration-300`}
          />

          {/* Circle outlines (on top) */}
          <circle cx={CX_A} cy={CY} r={R} fill="none" className="stroke-primary" strokeWidth={2} />
          <circle cx={CX_B} cy={CY} r={R} fill="none" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth={2} />

          {/* Labels */}
          <text x={CX_A - 30} y={CY - 5} className="text-sm fill-primary font-medium" textAnchor="middle">{labelA}</text>
          <text x={CX_B + 30} y={CY - 5} className="text-sm fill-emerald-700 dark:fill-emerald-300 font-medium" textAnchor="middle">{labelB}</text>

          {/* Interactive overlay buttons */}
          {interactive && (
            <>
              <foreignObject x={CX_A - 40} y={CY + 10} width={40} height={30}>
                <button
                  type="button"
                  aria-label={`${labelA} のみ`}
                  aria-pressed={highlighted.has("a-only")}
                  onClick={() => toggleRegion("a-only")}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </foreignObject>
              <foreignObject x={(CX_A + CX_B) / 2 - 20} y={CY + 10} width={40} height={30}>
                <button
                  type="button"
                  aria-label={`${labelA} ∩ ${labelB}`}
                  aria-pressed={highlighted.has("intersection")}
                  onClick={() => toggleRegion("intersection")}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </foreignObject>
              <foreignObject x={CX_B} y={CY + 10} width={40} height={30}>
                <button
                  type="button"
                  aria-label={`${labelB} のみ`}
                  aria-pressed={highlighted.has("b-only")}
                  onClick={() => toggleRegion("b-only")}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </foreignObject>
            </>
          )}
        </svg>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
