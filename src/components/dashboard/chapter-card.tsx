import Link from "next/link"
import { SectionDots } from "./section-dots"
import type { ChapterMeta } from "@/types/content"

interface ChapterCardProps {
  readonly chapter: ChapterMeta
  readonly sectionStatus: {
    readonly theory: "done" | "started" | "none"
    readonly practice: "done" | "started" | "none"
    readonly philosophy: "done" | "started" | "none"
  }
}

export function ChapterCard({ chapter, sectionStatus }: ChapterCardProps) {
  return (
    <Link href={`/chapters/${chapter.slug}`} className="group block">
      <div className="flex items-start gap-4 rounded-lg border border-border px-5 py-4 transition-all duration-150 group-hover:border-primary/40 group-hover:shadow-md group-hover:border-l-primary group-hover:border-l-4">
        <span className="font-serif text-2xl text-primary/60 leading-none pt-0.5 tabular-nums">
          {String(chapter.order).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-medium text-foreground leading-tight">
              {chapter.title}
            </h3>
            <SectionDots {...sectionStatus} />
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {chapter.description}
          </p>
        </div>
      </div>
    </Link>
  )
}
