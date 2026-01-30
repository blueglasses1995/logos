"use client"

import { use, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getChapterMeta } from "@/lib/content"
import { getChapterContent } from "@/lib/content-registry"
import { useProgress } from "@/hooks/use-progress"
import Link from "next/link"

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

  const { markPhilosophy } = useProgress()

  useEffect(() => {
    markPhilosophy(slug)
  }, [slug, markPhilosophy])

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" / "}
        <Link href={`/chapters/${slug}`} className="hover:underline">{chapter.title}</Link>
        {" / "}
        哲学コラム
      </div>

      <PhilosophyContent />

      <div className="flex justify-between pt-4">
        <Link href={`/chapters/${slug}/practice`}>
          <Button variant="outline">← 実践編に戻る</Button>
        </Link>
        <Link href="/">
          <Button>ダッシュボードへ</Button>
        </Link>
      </div>
    </div>
  )
}
