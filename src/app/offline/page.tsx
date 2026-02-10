"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { WifiOff } from "lucide-react"
import { getCachedChapters, type ChapterCache } from "@/lib/offline-manager"
import { getAllChapters } from "@/lib/content"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  const [cachedChapters, setCachedChapters] = useState<ChapterCache[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCachedChapters()
  }, [])

  const loadCachedChapters = async () => {
    try {
      const cached = await getCachedChapters()
      setCachedChapters(cached)
    } catch (error) {
      console.error("Failed to load cached chapters:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const allChapters = getAllChapters()
  const cachedChapterMetas = cachedChapters
    .map((cache) => ({
      ...cache,
      meta: allChapters.find((c) => c.slug === cache.slug),
    }))
    .filter((c) => c.meta !== undefined)

  return (
    <>
      <SiteHeader />
      <PageShell variant="dashboard">
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-6">
                <WifiOff className="size-12 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif tracking-tight text-foreground">
                オフラインモード
              </h1>
              <p className="text-muted-foreground">
                インターネットに接続していないため、このページを表示できません
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">
              読み込み中...
            </div>
          ) : cachedChapterMetas.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">
                  利用可能なコンテンツ
                </h2>
                <p className="text-sm text-muted-foreground">
                  以下のチャプターはオフラインで利用できます
                </p>
              </div>
              <div className="space-y-2">
                {cachedChapterMetas.map((item) => (
                  <div
                    key={item.slug}
                    className="border border-border rounded-lg p-4 bg-card"
                  >
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.meta!.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.meta!.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {item.sections.theory && (
                          <Link href={`/chapters/${item.slug}/theory`}>
                            <Button variant="outline" size="sm">
                              理論
                            </Button>
                          </Link>
                        )}
                        {item.sections.practice && (
                          <Link href={`/chapters/${item.slug}/practice`}>
                            <Button variant="outline" size="sm">
                              演習
                            </Button>
                          </Link>
                        )}
                        {item.sections.philosophy && (
                          <Link href={`/chapters/${item.slug}/philosophy`}>
                            <Button variant="outline" size="sm">
                              哲学
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                オフラインで利用できるコンテンツがありません
              </p>
              <p className="text-sm text-muted-foreground">
                オンライン時にチャプターをダウンロードすると、オフラインでも閲覧できます
              </p>
            </div>
          )}

          <div className="text-center">
            <Link href="/">
              <Button variant="outline">ホームに戻る</Button>
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  )
}
