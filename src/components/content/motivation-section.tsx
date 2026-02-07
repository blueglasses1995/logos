"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MotivationSectionProps {
  readonly icon: string
  readonly realWorldExample: string
  readonly nextChapterConnection: string
}

export function MotivationSection({
  icon,
  realWorldExample,
  nextChapterConnection,
}: MotivationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-muted/30">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-primary/5"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2.5">
          <span className="text-2xl leading-none" role="img" aria-hidden>
            {icon}
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            なぜこれが必要か？
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 px-5 pb-5">
            <div className="rounded-lg bg-primary/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
                実世界での活用
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {realWorldExample}
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-4 py-3">
              <span className="mt-0.5 text-sm text-primary" aria-hidden>
                →
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  次の章への接続
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {nextChapterConnection}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
