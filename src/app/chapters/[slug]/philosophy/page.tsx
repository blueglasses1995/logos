"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ReadingProgressBar } from "@/components/layout/reading-progress-bar"
import { getChapterMeta, getAllChapters } from "@/lib/content"
import { getChapterContent } from "@/lib/content-registry"
import { useProgress } from "@/hooks/use-progress"
import Link from "next/link"
import { AutoLinkedArticle } from "@/components/glossary/auto-linked-article"

export default function PhilosophyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const chapter = getChapterMeta(slug)
  if (!chapter) notFound()

  const content = getChapterContent(slug)
  if (!content) notFound()
  const { PhilosophyContent } = content

  const chapters = getAllChapters()
  const currentIndex = chapters.findIndex((c) => c.slug === slug)
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  const { progress, markPhilosophy } = useProgress()
  const isRead = progress.chapters[slug]?.philosophy.read ?? false

  return (
    <>
      <ReadingProgressBar />
      <SiteHeader />
      <PageShell variant="reading">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: chapter.title, href: `/chapters/${slug}` },
            { label: "哲学コラム" },
          ]}
        />

        <div className="philosophy-prose">
          <AutoLinkedArticle>
            <PhilosophyContent />
          </AutoLinkedArticle>
        </div>

        <div className="flex justify-center pt-8">
          <Button
            onClick={() => markPhilosophy(slug)}
            disabled={isRead}
          >
            {isRead ? "読了済み" : "読了する"}
          </Button>
        </div>

        <div className="flex justify-between pt-4">
          <Link href={`/chapters/${slug}/practice`}>
            <Button variant="outline">← 実践編に戻る</Button>
          </Link>
          {nextChapter ? (
            <Link href={`/chapters/${nextChapter.slug}`}>
              <Button>次のチャプターへ →</Button>
            </Link>
          ) : (
            <Link href="/">
              <Button>ダッシュボードへ →</Button>
            </Link>
          )}
        </div>
      </PageShell>
    </>
  )
}
