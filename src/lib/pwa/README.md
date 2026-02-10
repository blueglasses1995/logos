# PWA Offline Utilities

TypeScript utilities for implementing Progressive Web App offline functionality.

## Files

### `offline-manager.ts`

Provides hooks and utilities for managing offline state and cache.

**Exports:**

- `useOnlineStatus()` - React hook to detect online/offline state
- `getCacheStatus(cacheName?)` - Check what's currently cached
- `clearCache(cacheName?)` - Clear specific cache
- `getCacheSize()` - Estimate total cache storage size
- `isCacheSupported()` - Check if Cache API is available
- `formatBytes(bytes)` - Format bytes to human-readable string

**Example:**

```tsx
import { useOnlineStatus, getCacheSize, formatBytes } from '@/lib/pwa'

function MyComponent() {
  const { isOnline, wasOffline } = useOnlineStatus()

  const checkStorage = async () => {
    const size = await getCacheSize()
    console.log(`Cache: ${formatBytes(size.estimate)}`)
  }

  return (
    <div>
      {!isOnline && <div>You are offline</div>}
      {wasOffline && <div>Connection restored!</div>}
    </div>
  )
}
```

### `download-chapter.ts`

Utilities for downloading chapter content for offline access.

**Exports:**

- `downloadChapterForOffline(slug)` - Download all chapter pages
- `isChapterDownloaded(slug)` - Check if chapter is cached
- `removeChapterCache(slug)` - Delete chapter cache
- `getDownloadedChapters()` - Get list of all downloaded chapters
- `downloadMultipleChapters(slugs, onProgress?)` - Download multiple chapters
- `estimateChapterSize()` - Get estimated size per chapter
- `hasStorageQuota(chaptersCount)` - Check if enough storage available

**Example:**

```tsx
import {
  downloadChapterForOffline,
  isChapterDownloaded,
  getDownloadedChapters
} from '@/lib/pwa'

async function downloadChapter(slug: string) {
  const result = await downloadChapterForOffline(slug)

  if (result.success) {
    console.log(`Downloaded: ${result.cachedUrls?.join(', ')}`)
  } else {
    console.error(`Failed: ${result.error}`)
  }
}

async function checkDownloads() {
  const downloaded = await getDownloadedChapters()
  console.log(`Downloaded chapters: ${downloaded.join(', ')}`)
}
```

## Cache Storage

All manually downloaded content is stored in the `'manual-downloads'` cache. This is separate from any service worker caches to allow independent management.

### Cache Structure

Each chapter download caches 4 URLs:
- `/chapters/{slug}` - Chapter index
- `/chapters/{slug}/theory` - Theory page
- `/chapters/{slug}/practice` - Practice page
- `/chapters/{slug}/philosophy` - Philosophy page

## Error Handling

All functions handle errors gracefully:
- Network failures during download
- Storage quota exceeded
- Cache API not supported
- Missing or invalid content

Functions return structured results with `success` boolean and optional `error` messages.

## Browser Compatibility

Requires modern browsers with:
- Cache API support
- Fetch API support
- StorageManager API (optional, fallback available)

## Testing

Comprehensive test coverage (30 tests) in `__tests__/`:
- `offline-manager.test.ts` - 13 tests
- `download-chapter.test.ts` - 17 tests

Run tests:
```bash
npx vitest run src/lib/pwa/__tests__/
```
