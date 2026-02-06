import Link from "next/link"
import type { GlossaryEntry } from "../../../content/glossary"

interface GlossaryListProps {
  readonly entries: readonly GlossaryEntry[]
}

export function GlossaryList({ entries }: GlossaryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        該当する用語が見つかりません
      </p>
    )
  }

  return (
    <div className="divide-y divide-border">
      {entries.map((entry) => (
        <div key={entry.term} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-medium text-foreground">
              {entry.term}
            </h3>
            {entry.reading && (
              <span className="text-sm text-muted-foreground">
                （{entry.reading}）
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {entry.description}
          </p>
          {entry.relatedChapters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {entry.relatedChapters.map((ch) => (
                <Link
                  key={`${ch.slug}-${ch.label}`}
                  href={`/chapters/${ch.slug}`}
                  className="text-xs text-primary hover:underline underline-offset-2"
                >
                  {ch.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
