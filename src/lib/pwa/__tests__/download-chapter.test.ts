import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  downloadChapterForOffline,
  isChapterDownloaded,
  removeChapterCache,
  getDownloadedChapters,
  downloadMultipleChapters,
  estimateChapterSize,
  hasStorageQuota,
} from "../download-chapter"

// Mock fetch
global.fetch = vi.fn()

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

// Mock window.location
delete (global as { location?: Location }).location
global.location = {
  origin: "https://example.com",
} as Location

beforeEach(() => {
  vi.clearAllMocks()
  global.caches = mockCaches as unknown as CacheStorage
})

describe("downloadChapterForOffline", () => {
  it("should download all chapter pages successfully", async () => {
    const mockResponse = new Response("test content", { status: 200 })
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

    const result = await downloadChapterForOffline("01-propositions")

    expect(result.success).toBe(true)
    expect(result.cachedUrls).toHaveLength(4)
    expect(result.cachedUrls).toContain(
      "https://example.com/chapters/01-propositions/theory"
    )
    expect(result.cachedUrls).toContain(
      "https://example.com/chapters/01-propositions/practice"
    )
    expect(result.cachedUrls).toContain(
      "https://example.com/chapters/01-propositions/philosophy"
    )
    expect(mockCache.put).toHaveBeenCalledTimes(4)
  })

  it("should handle fetch errors gracefully", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(null, { status: 404 })
    )

    const result = await downloadChapterForOffline("99-nonexistent")

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it("should return error when cache API is not supported", async () => {
    const originalCaches = global.caches
    delete (global as { caches?: CacheStorage }).caches

    const result = await downloadChapterForOffline("01-propositions")

    expect(result.success).toBe(false)
    expect(result.error).toContain("not supported")

    global.caches = originalCaches
  })

  it("should handle partial success", async () => {
    let callCount = 0
    ;(global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
      callCount++
      if (callCount <= 2) {
        return Promise.resolve(new Response("content", { status: 200 }))
      } else {
        return Promise.resolve(new Response(null, { status: 500 }))
      }
    })

    const result = await downloadChapterForOffline("01-propositions")

    expect(result.success).toBe(true)
    expect(result.cachedUrls).toHaveLength(2)
    expect(result.error).toBeDefined()
    expect(result.error).toContain("Some pages failed")
  })
})

describe("isChapterDownloaded", () => {
  it("should return true when chapter is cached", async () => {
    const mockResponse = new Response("cached content")
    mockCache.match.mockResolvedValue(mockResponse)

    const result = await isChapterDownloaded("01-propositions")

    expect(result).toBe(true)
    expect(mockCache.match).toHaveBeenCalledWith(
      "https://example.com/chapters/01-propositions/theory"
    )
  })

  it("should return false when chapter is not cached", async () => {
    mockCache.match.mockResolvedValue(undefined)

    const result = await isChapterDownloaded("01-propositions")

    expect(result).toBe(false)
  })

  it("should return false when cache API is not supported", async () => {
    const originalCaches = global.caches
    delete (global as { caches?: CacheStorage }).caches

    const result = await isChapterDownloaded("01-propositions")

    expect(result).toBe(false)

    global.caches = originalCaches
  })
})

describe("removeChapterCache", () => {
  it("should remove all chapter pages from cache", async () => {
    mockCache.delete.mockResolvedValue(true)

    const result = await removeChapterCache("01-propositions")

    expect(result.success).toBe(true)
    expect(result.removedUrls).toHaveLength(4)
    expect(mockCache.delete).toHaveBeenCalledTimes(4)
  })

  it("should return error when no content found", async () => {
    mockCache.delete.mockResolvedValue(false)

    const result = await removeChapterCache("99-nonexistent")

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})

describe("getDownloadedChapters", () => {
  it("should return list of downloaded chapter slugs", async () => {
    const mockRequests = [
      new Request("https://example.com/chapters/01-propositions/theory"),
      new Request("https://example.com/chapters/01-propositions/practice"),
      new Request("https://example.com/chapters/02-truth-tables/theory"),
    ]

    mockCache.keys.mockResolvedValue(mockRequests)

    const result = await getDownloadedChapters()

    expect(result).toHaveLength(2)
    expect(result).toContain("01-propositions")
    expect(result).toContain("02-truth-tables")
  })

  it("should return empty array when no chapters cached", async () => {
    mockCache.keys.mockResolvedValue([])

    const result = await getDownloadedChapters()

    expect(result).toHaveLength(0)
  })
})

describe("downloadMultipleChapters", () => {
  it("should download multiple chapters in sequence", async () => {
    const mockResponse = new Response("content", { status: 200 })
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

    const progressCallback = vi.fn()
    const result = await downloadMultipleChapters(
      ["01-propositions", "02-truth-tables"],
      progressCallback
    )

    expect(result.success).toBe(true)
    expect(result.results).toHaveLength(2)
    expect(progressCallback).toHaveBeenCalledTimes(2)
  })

  it("should report partial failure", async () => {
    let callCount = 0
    ;(global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
      callCount++
      if (callCount <= 4) {
        return Promise.resolve(new Response("content", { status: 200 }))
      } else {
        return Promise.resolve(new Response(null, { status: 500 }))
      }
    })

    const result = await downloadMultipleChapters([
      "01-propositions",
      "02-truth-tables",
    ])

    expect(result.success).toBe(false)
    expect(result.results[0].result.success).toBe(true)
    expect(result.results[1].result.success).toBe(false)
  })
})

describe("estimateChapterSize", () => {
  it("should return consistent size estimate", () => {
    const size = estimateChapterSize()

    expect(size).toBe(200 * 1024 * 3)
    expect(size).toBeGreaterThan(0)
  })
})

describe("hasStorageQuota", () => {
  it("should check quota using StorageManager API", async () => {
    const mockEstimate = {
      usage: 1000000,
      quota: 10000000,
    }

    Object.defineProperty(global.navigator, "storage", {
      writable: true,
      value: {
        estimate: vi.fn(() => Promise.resolve(mockEstimate)),
      },
    })

    const result = await hasStorageQuota(5)

    expect(result.hasQuota).toBe(true)
    expect(result.available).toBe(9000000)
    expect(result.required).toBeGreaterThan(0)
  })

  it("should return hasQuota true when API not available", async () => {
    Object.defineProperty(global.navigator, "storage", {
      writable: true,
      value: undefined,
    })

    const result = await hasStorageQuota(5)

    expect(result.hasQuota).toBe(true)
    expect(result.available).toBeNull()
  })

  it("should detect insufficient quota", async () => {
    const mockEstimate = {
      usage: 9500000,
      quota: 10000000,
    }

    Object.defineProperty(global.navigator, "storage", {
      writable: true,
      value: {
        estimate: vi.fn(() => Promise.resolve(mockEstimate)),
      },
    })

    const result = await hasStorageQuota(10)

    expect(result.hasQuota).toBe(false)
    expect(result.available).toBe(500000)
  })
})
