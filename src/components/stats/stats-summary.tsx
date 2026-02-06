import type { UserProgress } from "@/types/progress"

interface StatsSummaryProps {
  readonly progress: UserProgress
}

export function StatsSummary({ progress }: StatsSummaryProps) {
  const allAttempts = Object.values(progress.chapters).flatMap((ch) => [
    ...ch.theory.attempts,
    ...ch.practice.attempts,
  ])
  const totalAnswers = allAttempts.length
  const correctAnswers = allAttempts.filter((a) => a.correct).length
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  const stats = [
    { label: "総回答数", value: totalAnswers },
    { label: "正答数", value: correctAnswers },
    { label: "正答率", value: `${accuracy}%` },
    { label: "最長ストリーク", value: `${progress.streak.longestStreak ?? 0}日` },
    { label: "復習キュー", value: progress.reviewQueue.length },
    { label: "実績", value: `${progress.achievements.length}/7` },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-serif text-primary">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
