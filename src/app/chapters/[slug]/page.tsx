"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { SectionListItem } from "@/components/chapter/section-list-item"
import { getChapterMeta, getChapterQuizzes } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"
import { DownloadChapterButton } from "@/components/offline/download-chapter-button"

const SECTIONS = [
  {
    key: "theory" as const,
    title: "学問編",
    description: "形式論理学の基礎概念と確認クイズ",
    path: "theory",
  },
  {
    key: "practice" as const,
    title: "実践編",
    description: "ビジネス・日常生活での応用シナリオ",
    path: "practice",
  },
  {
    key: "philosophy" as const,
    title: "哲学コラム",
    description: "論理学の哲学的背景と歴史",
    path: "philosophy",
  },
]

export default function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const { progress } = useProgress()
  const chapterProgress =
    progress.chapters[slug] ?? EMPTY_CHAPTER_PROGRESS

  function getSectionStatus(key: "theory" | "practice" | "philosophy"): "done" | "started" | "none" {
    if (key === "philosophy") {
      return chapterProgress.philosophy.read ? "done" : "none"
    }
    const section = chapterProgress[key]
    const totalQuizCount = getChapterQuizzes(slug, key).length
    const uniqueQuizIds = new Set(section.attempts.map((a) => a.quizId)).size
    if (uniqueQuizIds >= totalQuizCount && totalQuizCount > 0) return "done"
    if (section.attempts.length > 0) return "started"
    return "none"
  }

  const statuses = SECTIONS.map((s) => getSectionStatus(s.key))
  const firstIncompleteIdx = statuses.findIndex((s) => s !== "done")

  return (
    <>
      <SiteHeader />
      <PageShell variant="quiz">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: chapter.title },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="font-serif text-5xl text-primary/40 leading-none">
                {String(chapter.order).padStart(2, "0")}
              </span>
              <h1 className="text-3xl font-serif mt-2">{chapter.title}</h1>
              <p className="text-muted-foreground mt-2">{chapter.description}</p>
            </div>
            <div className="pt-8">
              <DownloadChapterButton slug={slug} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {SECTIONS.map((section, i) => (
            <SectionListItem
              key={section.key}
              title={section.title}
              description={section.description}
              href={`/chapters/${slug}/${section.path}`}
              status={statuses[i]}
              isRecommended={i === firstIncompleteIdx}
            />
          ))}
        </div>
      </PageShell>
    </>
  )
}
