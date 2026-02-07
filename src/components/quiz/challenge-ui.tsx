"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Lock, Flame, Trophy, Timer, Zap } from "lucide-react"

// --- Types ---

export type TimeLimit = 30 | 60 | 90

export const TIME_OPTIONS: readonly { readonly value: TimeLimit; readonly label: string }[] = [
  { value: 30, label: "30秒" },
  { value: 60, label: "60秒" },
  { value: 90, label: "90秒" },
]

// --- Streak multiplier ---

const STREAK_MULTIPLIERS: Readonly<Record<number, number>> = {
  0: 1,
  1: 1,
  2: 1.5,
  3: 2,
  4: 2.5,
  5: 3,
}

export function getMultiplier(streak: number): number {
  if (streak >= 5) return 3
  return STREAK_MULTIPLIERS[streak] ?? 1
}

// --- Helpers ---

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

// --- Timer Bar ---

export function TimerBar({
  remainingMs,
  totalMs,
}: {
  readonly remainingMs: number
  readonly totalMs: number
}) {
  const fraction = Math.max(0, Math.min(1, remainingMs / totalMs))
  const isLow = fraction < 0.2
  const isCritical = fraction < 0.1

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Timer className="size-3" />
          <span>残り時間</span>
        </div>
        <span
          className={cn(
            "font-mono font-medium tabular-nums",
            isCritical && "text-destructive animate-pulse",
            isLow && !isCritical && "text-destructive",
            !isLow && "text-foreground"
          )}
        >
          {formatTime(remainingMs)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-200",
            isCritical && "bg-destructive",
            isLow && !isCritical && "bg-destructive/70",
            !isLow && "bg-primary"
          )}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}

// --- Streak Display ---

export function StreakDisplay({
  streak,
  multiplier,
  score,
}: {
  readonly streak: number
  readonly multiplier: number
  readonly score: number
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Flame
            className={cn(
              "size-5 transition-all duration-300",
              streak >= 3 && "text-destructive",
              streak >= 1 && streak < 3 && "text-primary",
              streak === 0 && "text-muted-foreground"
            )}
          />
          <span className="text-sm font-medium tabular-nums">
            {streak}連続
          </span>
        </div>
        {multiplier > 1 && (
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            x{multiplier}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Zap className="size-4 text-primary" />
        <span className="text-sm font-medium tabular-nums">{score}点</span>
      </div>
    </div>
  )
}

// --- Locked State ---

export function LockedOverlay() {
  return (
    <div className="border border-border rounded-xl p-6 text-center space-y-4">
      <Lock className="size-10 text-muted-foreground mx-auto" />
      <h2 className="text-xl font-serif text-foreground">
        チャレンジモード
      </h2>
      <p className="text-sm text-muted-foreground">
        通常モードでこのチャプターのクイズを完了すると、チャレンジモードが解除されます。
      </p>
    </div>
  )
}

// --- Config Screen ---

export function ConfigScreen({
  selectedTime,
  onSelectTime,
  onStart,
  quizCount,
}: {
  readonly selectedTime: TimeLimit
  readonly onSelectTime: (t: TimeLimit) => void
  readonly onStart: () => void
  readonly quizCount: number
}) {
  return (
    <div className="border border-border rounded-xl p-6 space-y-6">
      <div className="text-center space-y-2">
        <Trophy className="size-10 text-primary mx-auto" />
        <h2 className="text-xl font-serif text-foreground">
          チャレンジモード
        </h2>
        <p className="text-sm text-muted-foreground">
          時間制限付き・ヒントなしで{quizCount}問に挑戦します。
          連続正解でスコア倍率がアップ！
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          1問あたりの制限時間
        </p>
        <div className="flex gap-2">
          {TIME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onSelectTime(value)}
              className={cn(
                "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200",
                selectedTime === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>- 解説はチャレンジ完了後に確認できます</p>
        <p>- 連続正解で倍率アップ（最大x3）</p>
        <p>- 時間切れは不正解扱いになります</p>
      </div>

      <Button onClick={onStart} className="w-full">
        チャレンジ開始
      </Button>
    </div>
  )
}

// --- Countdown ---

export function CountdownOverlay({
  count,
}: {
  readonly count: number
}) {
  return (
    <div className="border border-border rounded-xl p-6 flex items-center justify-center min-h-[200px]">
      <span className="text-6xl font-serif text-primary animate-pulse">
        {count}
      </span>
    </div>
  )
}
