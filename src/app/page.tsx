"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getAllChapters } from "@/lib/content"
import { useProgress } from "@/hooks/use-progress"
import { EMPTY_CHAPTER_PROGRESS } from "@/types/progress"

export default function HomePage() {
  const chapters = getAllChapters()
  const { progress, getDueItems } = useProgress()
  const dueCount = getDueItems().length

  function getChapterCompletion(slug: string): number {
    const cp = progress.chapters[slug] ?? EMPTY_CHAPTER_PROGRESS
    let completed = 0
    if (cp.theory.attempts.length > 0) completed++
    if (cp.practice.attempts.length > 0) completed++
    if (cp.philosophy.read) completed++
    return Math.round((completed / 3) * 100)
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Logos</h1>
        <p className="text-muted-foreground mt-2">
          論理学の基礎を学び、実務に活かす
        </p>
      </div>

      {progress.streak.currentDays > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-orange-500 font-bold">🔥</span>
          <span>{progress.streak.currentDays}日連続学習中</span>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">復習</CardTitle>
          <Badge variant={dueCount > 0 ? "default" : "secondary"}>
            {dueCount}件
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {dueCount > 0
              ? `${dueCount}件の復習アイテムが期限を迎えています。`
              : "現在、復習が必要なアイテムはありません。"}
          </p>
          <Link href="/review">
            <Button disabled={dueCount === 0} className="w-full">
              復習を開始する
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">チャプター</h2>
        {chapters.map((chapter) => {
          const completion = getChapterCompletion(chapter.slug)
          return (
            <Link key={chapter.slug} href={`/chapters/${chapter.slug}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{chapter.title}</CardTitle>
                  <Badge variant={completion === 100 ? "default" : "secondary"}>
                    {completion}%
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {chapter.description}
                  </p>
                  <Progress value={completion} className="h-2" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
