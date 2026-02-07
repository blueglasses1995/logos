"use client"

import { useMemo } from "react"
import type { Achievement, AchievementId } from "@/types/progress"
import { getAllAchievementIds, getAchievementMeta } from "@/lib/achievements"

interface AchievementDisplayProps {
  readonly achievements: readonly Achievement[]
}

interface BadgeCardProps {
  readonly id: AchievementId
  readonly unlocked: boolean
  readonly unlockedAt: string | null
}

function BadgeCard({ id, unlocked, unlockedAt }: BadgeCardProps) {
  const meta = getAchievementMeta(id)

  const formattedDate = useMemo(() => {
    if (!unlockedAt) return null
    try {
      const date = new Date(unlockedAt)
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
    } catch {
      return null
    }
  }, [unlockedAt])

  return (
    <div
      className={`
        relative border rounded-xl p-6 transition-all duration-300
        ${
          unlocked
            ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_-4px] shadow-primary/20"
            : "border-border bg-muted/30 opacity-60"
        }
      `}
    >
      {/* Glow overlay for unlocked badges */}
      {unlocked && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      )}

      <div className="relative flex flex-col items-center text-center space-y-3">
        {/* Icon */}
        <div
          className={`
            text-4xl leading-none transition-transform duration-300
            ${unlocked ? "scale-110" : "grayscale"}
          `}
          role="img"
          aria-label={meta.title}
        >
          {meta.icon}
        </div>

        {/* Title */}
        <div
          className={`
            text-sm font-semibold leading-tight
            ${unlocked ? "text-foreground" : "text-muted-foreground"}
          `}
        >
          {meta.title}
        </div>

        {/* Description */}
        <div className="text-xs text-muted-foreground leading-relaxed">
          {meta.description}
        </div>

        {/* Unlock date or lock indicator */}
        {unlocked && formattedDate ? (
          <div className="text-xs text-primary/70 font-mono">
            {formattedDate}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground/50">🔒 未解除</div>
        )}
      </div>
    </div>
  )
}

export function AchievementDisplay({ achievements }: AchievementDisplayProps) {
  const allIds = getAllAchievementIds()

  const unlockedMap = useMemo(() => {
    const map = new Map<AchievementId, string>()
    for (const achievement of achievements) {
      map.set(achievement.id, achievement.unlockedAt)
    }
    return map
  }, [achievements])

  const unlockedCount = achievements.length
  const totalCount = allIds.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            実績バッジ
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            学習の節目に獲得できるバッジ
          </p>
        </div>
        <div className="text-sm font-mono text-muted-foreground">
          <span className="text-primary font-semibold">{unlockedCount}</span>
          {" / "}
          {totalCount}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{
            width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allIds.map((id) => {
          const unlockedAt = unlockedMap.get(id) ?? null
          return (
            <BadgeCard
              key={id}
              id={id}
              unlocked={unlockedAt !== null}
              unlockedAt={unlockedAt}
            />
          )
        })}
      </div>

      {/* All unlocked message */}
      {unlockedCount === totalCount && totalCount > 0 && (
        <div className="text-center py-4 border border-primary/30 rounded-xl bg-primary/5">
          <div className="text-lg font-semibold text-primary">
            🎉 全バッジ獲得！
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            すべての実績を解除しました
          </div>
        </div>
      )}
    </div>
  )
}
