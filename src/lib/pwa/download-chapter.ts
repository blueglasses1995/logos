"use client"

const CACHE_NAME = "manual-downloads"

export interface DownloadResult {
  success: boolean
  error?: string
  cachedUrls?: string[]
}

/**
 * Download all chapter pages (theory, practice, philosophy) for offline access
 * @param slug - Chapter slug (e.g., "01-propositions")
 */
export async function downloadChapterForOffline(
  slug: string
): Promise<DownloadResult> {
  if (!("caches" in window)) {
    return {
      success: false,
      error: "Cache API not supported in this browser",
    }
  }

  try {
    const cache = await caches.open(CACHE_NAME)

    // Construct URLs for all three chapter pages
    const baseUrl = window.location.origin
    const urls = [
      `${baseUrl}/chapters/${slug}/theory`,
      `${baseUrl}/chapters/${slug}/practice`,
      `${baseUrl}/chapters/${slug}/philosophy`,
      // Also cache the chapter index page
      `${baseUrl}/chapters/${slug}`,
    ]

    const cachedUrls: string[] = []
    const errors: string[] = []

    // Download and cache each URL
    for (const url of urls) {
      try {
        // Fetch the page
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "text/html",
          },
        })

        if (!response.ok) {
          errors.push(`${url}: HTTP ${response.status}`)
          continue
        }

        // Clone the response before caching (response can only be read once)
        const responseToCache = response.clone()

        // Add to cache
        await cache.put(url, responseToCache)
        cachedUrls.push(url)
      } catch (error) {
        errors.push(
          `${url}: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      }
    }

    // Check if we cached at least some URLs
    if (cachedUrls.length > 0) {
      return {
        success: true,
        cachedUrls,
        error:
          errors.length > 0
            ? `Some pages failed: ${errors.join(", ")}`
            : undefined,
      }
    } else {
      return {
        success: false,
        error: `Failed to cache any pages: ${errors.join(", ")}`,
      }
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during download",
    }
  }
}

/**
 * Check if a chapter is downloaded for offline use
 * @param slug - Chapter slug (e.g., "01-propositions")
 */
export async function isChapterDownloaded(slug: string): Promise<boolean> {
  if (!("caches" in window)) {
    return false
  }

  try {
    const cache = await caches.open(CACHE_NAME)

    // Check if at least the theory page is cached
    const baseUrl = window.location.origin
    const theoryUrl = `${baseUrl}/chapters/${slug}/theory`

    const cachedResponse = await cache.match(theoryUrl)
    return cachedResponse !== undefined
  } catch (error) {
    console.error("Error checking if chapter is downloaded:", error)
    return false
  }
}

/**
 * Remove cached chapter data
 * @param slug - Chapter slug (e.g., "01-propositions")
 */
export async function removeChapterCache(slug: string): Promise<{
  success: boolean
  error?: string
  removedUrls?: string[]
}> {
  if (!("caches" in window)) {
    return {
      success: false,
      error: "Cache API not supported in this browser",
    }
  }

  try {
    const cache = await caches.open(CACHE_NAME)

    // Construct URLs for all chapter pages
    const baseUrl = window.location.origin
    const urls = [
      `${baseUrl}/chapters/${slug}/theory`,
      `${baseUrl}/chapters/${slug}/practice`,
      `${baseUrl}/chapters/${slug}/philosophy`,
      `${baseUrl}/chapters/${slug}`,
    ]

    const removedUrls: string[] = []

    // Remove each URL from cache
    for (const url of urls) {
      try {
        const deleted = await cache.delete(url)
        if (deleted) {
          removedUrls.push(url)
        }
      } catch (error) {
        console.error(`Failed to remove ${url} from cache:`, error)
      }
    }

    return {
      success: removedUrls.length > 0,
      removedUrls,
      error:
        removedUrls.length === 0
          ? "No cached content found for this chapter"
          : undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get all downloaded chapter slugs
 */
export async function getDownloadedChapters(): Promise<string[]> {
  if (!("caches" in window)) {
    return []
  }

  try {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()

    // Extract unique chapter slugs from cached URLs
    const slugs = new Set<string>()
    const baseUrl = window.location.origin

    for (const request of keys) {
      const url = request.url

      // Match pattern: /chapters/{slug}/...
      const match = url.match(
        new RegExp(`${baseUrl}/chapters/([^/]+)/(theory|practice|philosophy)`)
      )

      if (match && match[1]) {
        slugs.add(match[1])
      }
    }

    return Array.from(slugs)
  } catch (error) {
    console.error("Error getting downloaded chapters:", error)
    return []
  }
}

/**
 * Download multiple chapters in sequence
 * @param slugs - Array of chapter slugs to download
 * @param onProgress - Optional callback for progress updates
 */
export async function downloadMultipleChapters(
  slugs: string[],
  onProgress?: (current: number, total: number, slug: string) => void
): Promise<{
  success: boolean
  results: Array<{ slug: string; result: DownloadResult }>
}> {
  const results: Array<{ slug: string; result: DownloadResult }> = []

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i]

    if (onProgress) {
      onProgress(i + 1, slugs.length, slug)
    }

    const result = await downloadChapterForOffline(slug)
    results.push({ slug, result })

    // Add a small delay between downloads to avoid overwhelming the server
    if (i < slugs.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const allSucceeded = results.every((r) => r.result.success)

  return {
    success: allSucceeded,
    results,
  }
}

/**
 * Estimate download size for a chapter (approximate)
 * This is a rough estimate based on typical chapter sizes
 */
export function estimateChapterSize(): number {
  // Rough estimate: ~200KB per page, 3 pages per chapter
  return 200 * 1024 * 3 // ~600KB per chapter
}

/**
 * Check if there's enough storage quota for downloads
 * @param chaptersCount - Number of chapters to download
 */
export async function hasStorageQuota(chaptersCount: number): Promise<{
  hasQuota: boolean
  available: number | null
  required: number
}> {
  const required = estimateChapterSize() * chaptersCount

  try {
    if (
      "storage" in navigator &&
      navigator.storage &&
      "estimate" in navigator.storage
    ) {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const quota = estimate.quota || 0

      const available = quota - usage

      return {
        hasQuota: available >= required,
        available,
        required,
      }
    }

    // If StorageManager API not available, assume enough quota
    return {
      hasQuota: true,
      available: null,
      required,
    }
  } catch (error) {
    console.error("Failed to check storage quota:", error)
    return {
      hasQuota: true, // Assume we have quota
      available: null,
      required,
    }
  }
}
