"use client"

import type { DailyLog } from "@/types/progress"
import { cn } from "@/lib/utils"

interface ActivityHeatmapProps {
  readonly logs: readonly DailyLog[]
  readonly weeks?: number
}

function getIntensity(count: number): string {
  if (count === 0) return "bg-border"
  if (count <= 2) return "bg-primary/20"
  if (count <= 5) return "bg-primary/40"
  if (count <= 10) return "bg-primary/60"
  return "bg-primary"
}

export function ActivityHeatmap({ logs, weeks = 12 }: ActivityHeatmapProps) {
  const logMap = new Map(logs.map((l) => [l.date, l]))
  const today = new Date()

  const days: { date: string; count: number }[] = []
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    const log = logMap.get(key)
    days.push({ date: key, count: log?.quizCount ?? 0 })
  }

  // Group into weeks (columns)
  const columns: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7))
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">学習アクティビティ</h3>
      <div className="flex gap-1 overflow-x-auto">
        {columns.map((week, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "size-3 rounded-[2px] transition-colors duration-150",
                  getIntensity(day.count)
                )}
                title={`${day.date}: ${day.count}問`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>少</span>
        <div className="size-3 rounded-[2px] bg-border" />
        <div className="size-3 rounded-[2px] bg-primary/20" />
        <div className="size-3 rounded-[2px] bg-primary/40" />
        <div className="size-3 rounded-[2px] bg-primary/60" />
        <div className="size-3 rounded-[2px] bg-primary" />
        <span>多</span>
      </div>
    </div>
  )
}
