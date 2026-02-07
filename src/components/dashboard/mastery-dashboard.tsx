"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { getAllChapters } from "@/lib/content"
import type { UserProgress } from "@/types/progress"
import {
  computeMasteryData,
  getMasteryLevel,
  MASTERY_CONFIG,
  type ChapterMastery,
  type WeakArea,
  type StudyRecommendation,
} from "@/lib/mastery"
import {
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

// --- Sub-components ---

function OverallStats({
  overallAccuracy,
  totalChapters,
  masteredCount,
}: {
  readonly overallAccuracy: number
  readonly totalChapters: number
  readonly masteredCount: number
}) {
  const level = getMasteryLevel(overallAccuracy)
  const config = MASTERY_CONFIG[level]

  return (
    <div className="border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-serif text-foreground">総合マスタリー</h2>
        <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", config.bgClass, config.colorClass)}>
          {config.label}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-serif text-foreground tabular-nums">
          {overallAccuracy}%
        </span>
        <span className="text-sm text-muted-foreground mb-1">正答率</span>
      </div>
      <div className="h-3 rounded-full bg-border overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", config.barClass)}
          style={{ width: `${overallAccuracy}%` }}
        />
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{masteredCount}/{totalChapters} チャプター習得</span>
      </div>
    </div>
  )
}

function ChapterMasteryCard({ mastery }: { readonly mastery: ChapterMastery }) {
  const config = MASTERY_CONFIG[mastery.level]

  return (
    <Link href={`/chapters/${mastery.slug}`} className="group block">
      <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-3 transition-all duration-150 group-hover:border-primary/40">
        <span className="font-serif text-lg text-primary/60 tabular-nums shrink-0">
          {String(mastery.order).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {mastery.title}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {mastery.reviewItemCount > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  復習{mastery.reviewItemCount}件
                </span>
              )}
              <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", config.bgClass, config.colorClass)}>
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", config.barClass)}
                style={{ width: `${mastery.accuracy}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0">
              {mastery.totalAttempts > 0 ? `${mastery.accuracy}%` : "---"}
            </span>
          </div>
        </div>
        <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}

function WeakAreasCard({ weakAreas }: { readonly weakAreas: readonly WeakArea[] }) {
  if (weakAreas.length === 0) return null

  return (
    <div className="border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-5 text-destructive" />
        <h2 className="text-lg font-serif text-foreground">弱点エリア</h2>
      </div>
      <div className="space-y-2">
        {weakAreas.map((wa) => (
          <div
            key={`${wa.chapterSlug}-${wa.section}`}
            className="flex items-center justify-between rounded-lg bg-destructive/5 px-4 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {wa.chapterTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {wa.section === "theory" ? "理論" : "実践"} / {wa.totalAttempts}回試行
              </p>
            </div>
            <span className="text-sm font-mono text-destructive tabular-nums shrink-0">
              {wa.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecommendationsCard({
  recommendations,
}: {
  readonly recommendations: readonly StudyRecommendation[]
}) {
  if (recommendations.length === 0) return null

  const typeIcons: Readonly<Record<string, typeof TrendingUp>> = {
    review: Calendar,
    practice: Target,
    new: BookOpen,
  }

  const typeLabels: Readonly<Record<string, string>> = {
    review: "復習",
    practice: "練習",
    new: "新規",
  }

  return (
    <div className="border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-5 text-primary" />
        <h2 className="text-lg font-serif text-foreground">学習レコメンド</h2>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec) => {
          const Icon = typeIcons[rec.type] ?? BookOpen
          return (
            <Link
              key={`${rec.type}-${rec.chapterSlug}`}
              href={rec.type === "review" ? "/review" : `/chapters/${rec.chapterSlug}`}
              className="group block"
            >
              <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-all duration-150 group-hover:border-primary/40">
                <Icon className="size-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {typeLabels[rec.type]}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {rec.chapterTitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {rec.reason}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ReviewScheduleCard({
  upcomingReviews,
}: {
  readonly upcomingReviews: readonly { readonly date: string; readonly count: number }[]
}) {
  if (upcomingReviews.length === 0) return null

  const today = new Date().toISOString().slice(0, 10)

  function formatDate(dateStr: string): string {
    if (dateStr === today) return "今日"
    const date = new Date(dateStr)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (dateStr === tomorrow.toISOString().slice(0, 10)) return "明日"
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className="border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="size-5 text-primary" />
        <h2 className="text-lg font-serif text-foreground">復習スケジュール</h2>
      </div>
      <div className="flex items-end gap-1">
        {upcomingReviews.map(({ date, count }) => {
          const maxCount = Math.max(...upcomingReviews.map((r) => r.count))
          const height = maxCount > 0 ? Math.max(8, (count / maxCount) * 60) : 8

          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {count}
              </span>
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all duration-300",
                  date === today ? "bg-primary" : "bg-primary/40"
                )}
                style={{ height: `${height}px` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {formatDate(date)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Main Component ---

interface MasteryDashboardProps {
  readonly progress: UserProgress
}

export function MasteryDashboard({ progress }: MasteryDashboardProps) {
  const chapters = useMemo(() => getAllChapters(), [])

  const masteryData = useMemo(
    () => computeMasteryData(progress, chapters),
    [progress, chapters]
  )

  const masteredCount = masteryData.chapters.filter(
    (c) => c.level === "master"
  ).length

  return (
    <div className="space-y-6">
      <OverallStats
        overallAccuracy={masteryData.overallAccuracy}
        totalChapters={chapters.length}
        masteredCount={masteredCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecommendationsCard recommendations={masteryData.recommendations} />
        <ReviewScheduleCard upcomingReviews={masteryData.upcomingReviews} />
      </div>

      <WeakAreasCard weakAreas={masteryData.weakAreas} />

      <div className="space-y-3">
        <h2 className="text-lg font-serif text-foreground">チャプター別マスタリー</h2>
        <div className="space-y-2">
          {masteryData.chapters.map((mastery) => (
            <ChapterMasteryCard key={mastery.slug} mastery={mastery} />
          ))}
        </div>
      </div>
    </div>
  )
}
