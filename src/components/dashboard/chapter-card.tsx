"use client"

import Link from "next/link"
import { SectionDots } from "./section-dots"
import type { ChapterMeta } from "@/types/content"
import { DownloadChapterButton } from "@/components/offline/download-chapter-button"

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
    <div className="group relative rounded-lg border border-border transition-all duration-150 hover:border-primary/40 hover:shadow-md hover:border-l-primary hover:border-l-4">
      <Link href={`/chapters/${chapter.slug}`} className="block px-5 py-4">
        <div className="flex items-start gap-4">
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
      <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <DownloadChapterButton slug={chapter.slug} size="sm" showLabel={false} />
      </div>
    </div>
  )
}
