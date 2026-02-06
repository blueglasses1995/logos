"use client"

import { Search } from "lucide-react"

interface GlossarySearchProps {
  readonly value: string
  readonly onChange: (value: string) => void
}

export function GlossarySearch({ value, onChange }: GlossarySearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="用語を検索…"
        className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-150"
      />
    </div>
  )
}
