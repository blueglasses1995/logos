"use client"

import { useState, useEffect, useCallback } from "react"
import {
  isChapterCached,
  cacheChapter,
  removeCachedChapter,
} from "@/lib/offline-manager"

export function useChapterCache(slug: string) {
  const [isCached, setIsCached] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkCache()
  }, [slug])

  const checkCache = async () => {
    try {
      const cached = await isChapterCached(slug)
      setIsCached(cached)
    } catch (err) {
      console.error("Failed to check cache:", err)
    }
  }

  const download = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      await cacheChapter(slug, (p) => setProgress(p))
      setIsCached(true)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "ダウンロードに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  const remove = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await removeCachedChapter(slug)
      setIsCached(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  return {
    isCached,
    isLoading,
    progress,
    error,
    download,
    remove,
  }
}
