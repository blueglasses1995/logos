"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getChapterMeta } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"

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

  function getSectionStatus(key: "theory" | "practice" | "philosophy") {
    if (key === "philosophy") {
      return chapterProgress.philosophy.read ? "完了" : "未読"
    }
    const section = chapterProgress[key]
    if (section.attempts.length === 0) return "未着手"
    return "進行中"
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        {chapter.title}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
        <p className="text-muted-foreground mt-2">{chapter.description}</p>
      </div>

      <div className="grid gap-4">
        {SECTIONS.map((section) => {
          const status = getSectionStatus(section.key)
          return (
            <Link key={section.key} href={`/chapters/${slug}/${section.path}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {section.title}
                  </CardTitle>
                  <Badge
                    variant={status === "完了" ? "default" : "secondary"}
                  >
                    {status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Link href="/" className="block">
        <p className="text-sm text-muted-foreground hover:underline">
          ← ダッシュボードに戻る
        </p>
      </Link>
    </div>
  )
}
