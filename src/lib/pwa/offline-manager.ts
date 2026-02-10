"use client"

import { useState, useEffect } from "react"

export interface CacheStatus {
  hasCachedContent: boolean
  cacheCount: number
  estimatedSize: number
  lastUpdated: number | null
}

export interface OnlineStatus {
  isOnline: boolean
  wasOffline: boolean
}

/**
 * React hook to detect online/offline state
 * Returns current online status and whether user was recently offline
 */
export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [wasOffline, setWasOffline] = useState<boolean>(false)

  useEffect(() => {
    // Initialize with actual navigator status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      // Reset wasOffline flag after 3 seconds
      setTimeout(() => setWasOffline(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}

/**
 * Get status of what's currently cached
 * @param cacheName - Name of the cache to check (default: 'manual-downloads')
 */
export async function getCacheStatus(
  cacheName = "manual-downloads"
): Promise<CacheStatus> {
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()

    let estimatedSize = 0
    let lastUpdated: number | null = null

    // Estimate size by checking response headers
    for (const request of keys) {
      try {
        const response = await cache.match(request)
        if (response) {
          const contentLength = response.headers.get("content-length")
          if (contentLength) {
            estimatedSize += parseInt(contentLength, 10)
          }

          // Try to get last modified date
          const lastModified = response.headers.get("last-modified")
          if (lastModified) {
            const date = new Date(lastModified).getTime()
            if (!lastUpdated || date > lastUpdated) {
              lastUpdated = date
            }
          }
        }
      } catch (error) {
        // Skip this entry on error
        continue
      }
    }

    return {
      hasCachedContent: keys.length > 0,
      cacheCount: keys.length,
      estimatedSize,
      lastUpdated: lastUpdated || (keys.length > 0 ? Date.now() : null),
    }
  } catch (error) {
    console.error("Failed to get cache status:", error)
    return {
      hasCachedContent: false,
      cacheCount: 0,
      estimatedSize: 0,
      lastUpdated: null,
    }
  }
}

/**
 * Clear specific cache by name
 * @param cacheName - Name of the cache to clear (default: 'manual-downloads')
 */
export async function clearCache(cacheName = "manual-downloads"): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const deleted = await caches.delete(cacheName)
    if (deleted) {
      return { success: true }
    } else {
      return {
        success: false,
        error: "Cache not found or already deleted",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get estimated total cache size across all caches
 * Uses StorageManager API if available, falls back to manual calculation
 */
export async function getCacheSize(): Promise<{
  estimate: number
  quota: number | null
  usage: number | null
  percentage: number | null
}> {
  try {
    // Try to use StorageManager API (modern browsers)
    if (
      "storage" in navigator &&
      navigator.storage &&
      "estimate" in navigator.storage
    ) {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const quota = estimate.quota || null

      return {
        estimate: usage,
        quota,
        usage,
        percentage: quota ? (usage / quota) * 100 : null,
      }
    }

    // Fallback: manually calculate from all caches
    const cacheNames = await caches.keys()
    let totalSize = 0

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()

      for (const request of keys) {
        try {
          const response = await cache.match(request)
          if (response) {
            const contentLength = response.headers.get("content-length")
            if (contentLength) {
              totalSize += parseInt(contentLength, 10)
            }
          }
        } catch {
          continue
        }
      }
    }

    return {
      estimate: totalSize,
      quota: null,
      usage: totalSize,
      percentage: null,
    }
  } catch (error) {
    console.error("Failed to get cache size:", error)
    return {
      estimate: 0,
      quota: null,
      usage: null,
      percentage: null,
    }
  }
}

/**
 * Check if Cache API is supported
 */
export function isCacheSupported(): boolean {
  return typeof caches !== "undefined"
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
