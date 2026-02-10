import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import {
  useOnlineStatus,
  getCacheStatus,
  clearCache,
  getCacheSize,
  isCacheSupported,
  formatBytes,
} from "../offline-manager"

// Mock caches API
const mockCache = {
  keys: vi.fn(),
  match: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

const mockCaches = {
  open: vi.fn(() => Promise.resolve(mockCache)),
  delete: vi.fn(),
  keys: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  global.caches = mockCaches as unknown as CacheStorage
})

describe("useOnlineStatus", () => {
  it("should return initial online status", () => {
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current.isOnline).toBe(navigator.onLine)
    expect(result.current.wasOffline).toBe(false)
  })

  it("should update status when going offline", () => {
    const { result } = renderHook(() => useOnlineStatus())

    act(() => {
      window.dispatchEvent(new Event("offline"))
    })

    expect(result.current.isOnline).toBe(false)
    expect(result.current.wasOffline).toBe(false)
  })

  it("should update status when coming back online", () => {
    const { result } = renderHook(() => useOnlineStatus())

    act(() => {
      window.dispatchEvent(new Event("online"))
    })

    expect(result.current.isOnline).toBe(true)
    expect(result.current.wasOffline).toBe(true)
  })
})

describe("getCacheStatus", () => {
  it("should return cache status with no cached items", async () => {
    mockCache.keys.mockResolvedValue([])

    const status = await getCacheStatus()

    expect(status.hasCachedContent).toBe(false)
    expect(status.cacheCount).toBe(0)
    expect(status.estimatedSize).toBe(0)
  })

  it("should return cache status with cached items", async () => {
    const mockRequest = new Request("https://example.com/test")
    const mockResponse = new Response("test content", {
      headers: {
        "content-length": "1000",
        "last-modified": "Mon, 01 Jan 2024 00:00:00 GMT",
      },
    })

    mockCache.keys.mockResolvedValue([mockRequest])
    mockCache.match.mockResolvedValue(mockResponse)

    const status = await getCacheStatus()

    expect(status.hasCachedContent).toBe(true)
    expect(status.cacheCount).toBe(1)
    expect(status.estimatedSize).toBe(1000)
    expect(status.lastUpdated).toBeGreaterThan(0)
  })

  it("should handle errors gracefully", async () => {
    mockCaches.open.mockRejectedValue(new Error("Cache error"))

    const status = await getCacheStatus()

    expect(status.hasCachedContent).toBe(false)
    expect(status.cacheCount).toBe(0)
  })
})

describe("clearCache", () => {
  it("should successfully clear cache", async () => {
    mockCaches.delete.mockResolvedValue(true)

    const result = await clearCache()

    expect(result.success).toBe(true)
    expect(mockCaches.delete).toHaveBeenCalledWith("manual-downloads")
  })

  it("should return error if cache not found", async () => {
    mockCaches.delete.mockResolvedValue(false)

    const result = await clearCache()

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})

describe("getCacheSize", () => {
  it("should use StorageManager API if available", async () => {
    const mockEstimate = {
      usage: 1000000,
      quota: 5000000,
    }

    Object.defineProperty(global.navigator, "storage", {
      writable: true,
      value: {
        estimate: vi.fn(() => Promise.resolve(mockEstimate)),
      },
    })

    const result = await getCacheSize()

    expect(result.estimate).toBe(1000000)
    expect(result.quota).toBe(5000000)
    expect(result.percentage).toBeCloseTo(20)
  })

  it("should fallback to manual calculation", async () => {
    // Remove storage API
    Object.defineProperty(global.navigator, "storage", {
      writable: true,
      value: undefined,
    })

    // Reset mockCaches.open to return valid cache
    mockCaches.open.mockResolvedValue(mockCache)

    const mockRequest = new Request("https://example.com/test")
    const mockResponse = new Response("test", {
      headers: { "content-length": "500" },
    })

    mockCaches.keys.mockResolvedValue(["cache1"])
    mockCache.keys.mockResolvedValue([mockRequest])
    mockCache.match.mockResolvedValue(mockResponse)

    const result = await getCacheSize()

    expect(result.estimate).toBeGreaterThan(0)
    expect(result.quota).toBeNull()
  })
})

describe("isCacheSupported", () => {
  it("should return true when caches is defined", () => {
    expect(isCacheSupported()).toBe(true)
  })

  it("should return false when caches is undefined", () => {
    const originalCaches = global.caches
    delete (global as { caches?: CacheStorage }).caches

    expect(isCacheSupported()).toBe(false)

    global.caches = originalCaches
  })
})

describe("formatBytes", () => {
  it("should format bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 Bytes")
    expect(formatBytes(1024)).toBe("1 KB")
    expect(formatBytes(1048576)).toBe("1 MB")
    expect(formatBytes(1073741824)).toBe("1 GB")
    expect(formatBytes(1536)).toBe("1.5 KB")
  })
})
