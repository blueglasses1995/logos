// Offline manager utilities
export {
  useOnlineStatus,
  getCacheStatus,
  clearCache,
  getCacheSize,
  isCacheSupported,
  formatBytes,
  type CacheStatus,
  type OnlineStatus,
} from "./offline-manager"

// Chapter download utilities
export {
  downloadChapterForOffline,
  isChapterDownloaded,
  removeChapterCache,
  getDownloadedChapters,
  downloadMultipleChapters,
  estimateChapterSize,
  hasStorageQuota,
  type DownloadResult,
} from "./download-chapter"
