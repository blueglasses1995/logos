"use client"

import { useMemo } from "react"
import type { UserProgress, DailyLog, ChapterProgress } from "@/types/progress"
import { getAllChapters } from "@/lib/content"

interface LearningPortfolioProps {
  readonly progress: UserProgress
}

interface ChapterStat {
  readonly slug: string
  readonly title: string
  readonly totalAttempts: number
  readonly correctAttempts: number
  readonly accuracy: number
}

function computeChapterStats(
  progress: UserProgress
): readonly ChapterStat[] {
  const chapters = getAllChapters()
  return chapters.map((ch) => {
    const cp: ChapterProgress | undefined = progress.chapters[ch.slug]
    if (!cp) {
      return {
        slug: ch.slug,
        title: ch.title,
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
      }
    }
    const theoryAttempts = cp.theory.attempts
    const practiceAttempts = cp.practice.attempts
    const all = [...theoryAttempts, ...practiceAttempts]
    const total = all.length
    const correct = all.filter((a) => a.correct).length
    return {
      slug: ch.slug,
      title: ch.title,
      totalAttempts: total,
      correctAttempts: correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  })
}

function computeTotals(stats: readonly ChapterStat[]) {
  const totalQuizzes = stats.reduce((sum, s) => sum + s.totalAttempts, 0)
  const totalCorrect = stats.reduce((sum, s) => sum + s.correctAttempts, 0)
  const accuracy = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuizzes) * 100) : 0
  const chaptersWithAttempts = stats.filter((s) => s.totalAttempts > 0).length
  return { totalQuizzes, totalCorrect, accuracy, chaptersWithAttempts }
}

// --- Summary Section ---

interface SummaryCardProps {
  readonly label: string
  readonly value: string | number
  readonly sub?: string
}

function SummaryCard({ label, value, sub }: SummaryCardProps) {
  return (
    <div className="border border-border rounded-xl p-6 text-center">
      <div className="text-3xl font-bold text-primary tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>}
    </div>
  )
}

function SummarySection({
  totalQuizzes,
  accuracy,
  chaptersWithAttempts,
  totalChapters,
}: {
  readonly totalQuizzes: number
  readonly accuracy: number
  readonly chaptersWithAttempts: number
  readonly totalChapters: number
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-foreground mb-4">学習サマリー</h3>
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="総回答数" value={totalQuizzes} />
        <SummaryCard label="正答率" value={`${accuracy}%`} />
        <SummaryCard
          label="学習済みチャプター"
          value={`${chaptersWithAttempts} / ${totalChapters}`}
        />
      </div>
    </section>
  )
}

// --- Activity Heatmap ---

function buildHeatmapWeeks(logs: readonly DailyLog[]): readonly (DailyLog | null)[][] {
  if (logs.length === 0) return []

  const logMap = new Map<string, DailyLog>()
  for (const log of logs) {
    logMap.set(log.date, log)
  }

  const today = new Date()
  const weeks: (DailyLog | null)[][] = []
  const totalDays = 84 // 12 weeks

  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - totalDays + 1)
  // Align to Monday
  const dayOfWeek = startDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startDate.setDate(startDate.getDate() + mondayOffset)

  let current = new Date(startDate)
  while (current <= today) {
    const week: (DailyLog | null)[] = []
    for (let d = 0; d < 7; d++) {
      if (current > today) {
        week.push(null)
      } else {
        const dateStr = current.toISOString().split("T")[0]
        week.push(logMap.get(dateStr) ?? null)
      }
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
}

function getHeatColor(log: DailyLog | null): string {
  if (!log) return "bg-muted/40"
  if (log.quizCount >= 10) return "bg-primary"
  if (log.quizCount >= 5) return "bg-primary/70"
  if (log.quizCount >= 2) return "bg-primary/40"
  return "bg-primary/20"
}

function ActivityHeatmap({ logs }: { readonly logs: readonly DailyLog[] }) {
  const weeks = useMemo(() => buildHeatmapWeeks(logs), [logs])
  const dayLabels = ["月", "", "水", "", "金", "", ""]

  return (
    <section>
      <h3 className="text-base font-semibold text-foreground mb-4">成長グラフ</h3>
      <div className="border border-border rounded-xl p-6 overflow-x-auto">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {dayLabels.map((label, i) => (
              <div
                key={`label-${i}`}
                className="w-6 h-4 text-[10px] text-muted-foreground flex items-center justify-end pr-1"
              >
                {label}
              </div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={`w-${wi}`} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={`d-${wi}-${di}`}
                  className={`w-4 h-4 rounded-sm ${getHeatColor(day)} transition-colors`}
                  title={
                    day
                      ? `${day.date}: ${day.quizCount}問 (${day.correctCount}正解)`
                      : undefined
                  }
                />
              ))}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>少ない</span>
          <div className="w-3 h-3 rounded-sm bg-primary/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/70" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span>多い</span>
        </div>
      </div>
    </section>
  )
}

// --- Chapter Accuracy Bar Chart ---

function AccuracyBar({ stat }: { readonly stat: ChapterStat }) {
  const barColor = stat.accuracy >= 70 ? "bg-truth" : stat.accuracy >= 40 ? "bg-primary" : "bg-falsehood"
  const textColor =
    stat.accuracy >= 70
      ? "text-truth"
      : stat.accuracy >= 40
        ? "text-primary"
        : "text-falsehood"

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-muted-foreground truncate shrink-0" title={stat.title}>
        {stat.title}
      </div>
      <div className="flex-1 h-5 bg-muted/40 rounded-full overflow-hidden">
        {stat.totalAttempts > 0 && (
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${stat.accuracy}%` }}
          />
        )}
      </div>
      <div className={`w-10 text-xs font-mono text-right ${stat.totalAttempts > 0 ? textColor : "text-muted-foreground/50"}`}>
        {stat.totalAttempts > 0 ? `${stat.accuracy}%` : "---"}
      </div>
    </div>
  )
}

function StrengthsAndWeaknesses({ stats }: { readonly stats: readonly ChapterStat[] }) {
  const attempted = stats.filter((s) => s.totalAttempts > 0)
  const strengths = [...attempted].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3)
  const weaknesses = [...attempted].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3)

  return (
    <section>
      <h3 className="text-base font-semibold text-foreground mb-4">強みと弱み</h3>

      {/* Bar chart */}
      <div className="border border-border rounded-xl p-6 space-y-2 mb-4">
        {stats.map((stat) => (
          <AccuracyBar key={stat.slug} stat={stat} />
        ))}
      </div>

      {/* Strength / Weakness cards */}
      {attempted.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl p-4 bg-truth/10">
            <div className="text-sm font-semibold text-truth mb-2">得意な分野</div>
            {strengths.map((s) => (
              <div key={s.slug} className="flex items-center justify-between text-sm py-1">
                <span className="text-foreground truncate">{s.title}</span>
                <span className="text-truth font-mono ml-2">{s.accuracy}%</span>
              </div>
            ))}
          </div>
          <div className="border border-border rounded-xl p-4 bg-falsehood/10">
            <div className="text-sm font-semibold text-falsehood mb-2">改善が必要な分野</div>
            {weaknesses.map((s) => (
              <div key={s.slug} className="flex items-center justify-between text-sm py-1">
                <span className="text-foreground truncate">{s.title}</span>
                <span className="text-falsehood font-mono ml-2">{s.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// --- Streak Section ---

function StreakSection({
  currentDays,
  longestStreak,
}: {
  readonly currentDays: number
  readonly longestStreak: number
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-foreground mb-4">連続学習</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-primary tabular-nums">{currentDays}</div>
          <div className="text-sm text-muted-foreground mt-1">現在の連続日数</div>
        </div>
        <div className="border border-border rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-primary/60 tabular-nums">{longestStreak}</div>
          <div className="text-sm text-muted-foreground mt-1">最長記録</div>
        </div>
      </div>
    </section>
  )
}

// --- Achievements Section ---

function AchievementsSection({
  achievementCount,
}: {
  readonly achievementCount: number
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-foreground mb-4">実績一覧</h3>
      <div className="border border-border rounded-xl p-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-primary tabular-nums">
            {achievementCount}
          </div>
          <div className="text-sm text-muted-foreground mt-1">獲得した実績</div>
        </div>
        <div className="text-sm text-muted-foreground">
          ダッシュボードの実績バッジセクションで詳細を確認
        </div>
      </div>
    </section>
  )
}

// --- Main Component ---

export function LearningPortfolio({ progress }: LearningPortfolioProps) {
  const stats = useMemo(() => computeChapterStats(progress), [progress])
  const totals = useMemo(() => computeTotals(stats), [stats])
  const totalChapters = getAllChapters().length

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">学習ポートフォリオ</h2>
        <p className="text-sm text-muted-foreground mt-1">
          あなたの学習の軌跡と成長を可視化します
        </p>
      </div>

      <SummarySection
        totalQuizzes={totals.totalQuizzes}
        accuracy={totals.accuracy}
        chaptersWithAttempts={totals.chaptersWithAttempts}
        totalChapters={totalChapters}
      />

      <ActivityHeatmap logs={progress.dailyLogs} />

      <StrengthsAndWeaknesses stats={stats} />

      <StreakSection
        currentDays={progress.streak.currentDays}
        longestStreak={progress.streak.longestStreak}
      />

      <AchievementsSection achievementCount={progress.achievements.length} />
    </div>
  )
}
