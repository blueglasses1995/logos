const CACHE_NAME = "logos-chapters-v1"

export interface ChapterCache {
  slug: string
  cachedAt: string
  sections: {
    theory: boolean
    practice: boolean
    philosophy: boolean
  }
}

export async function getCachedChapters(): Promise<ChapterCache[]> {
  if (typeof window === "undefined" || !("caches" in window)) return []

  try {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()
    const chapterMap = new Map<string, ChapterCache>()

    for (const request of keys) {
      const url = new URL(request.url)
      const pathMatch = url.pathname.match(/\/chapters\/([^/]+)\/(theory|practice|philosophy)/)

      if (pathMatch) {
        const [, slug, section] = pathMatch

        if (!chapterMap.has(slug)) {
          chapterMap.set(slug, {
            slug,
            cachedAt: new Date().toISOString(),
            sections: {
              theory: false,
              practice: false,
              philosophy: false,
            },
          })
        }

        const cache = chapterMap.get(slug)!
        cache.sections[section as keyof typeof cache.sections] = true
      }
    }

    return Array.from(chapterMap.values())
  } catch (error) {
    console.error("Failed to get cached chapters:", error)
    return []
  }
}

export async function isChapterCached(slug: string): Promise<boolean> {
  const cached = await getCachedChapters()
  return cached.some((c) => c.slug === slug)
}

export async function cacheChapter(
  slug: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) {
    throw new Error("Cache API not available")
  }

  try {
    const cache = await caches.open(CACHE_NAME)
    const sections = ["theory", "practice", "philosophy"]
    const totalSteps = sections.length

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const url = `/chapters/${slug}/${section}`

      try {
        const response = await fetch(url)
        if (response.ok) {
          await cache.put(url, response)
        }
      } catch (error) {
        console.warn(`Failed to cache ${url}:`, error)
      }

      if (onProgress) {
        onProgress(((i + 1) / totalSteps) * 100)
      }
    }
  } catch (error) {
    console.error("Failed to cache chapter:", error)
    throw error
  }
}

export async function removeCachedChapter(slug: string): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) return

  try {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()

    for (const request of keys) {
      const url = new URL(request.url)
      if (url.pathname.includes(`/chapters/${slug}/`)) {
        await cache.delete(request)
      }
    }
  } catch (error) {
    console.error("Failed to remove cached chapter:", error)
    throw error
  }
}

export async function clearAllCachedChapters(): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) return

  try {
    await caches.delete(CACHE_NAME)
  } catch (error) {
    console.error("Failed to clear cache:", error)
    throw error
  }
}
