import type { AchievementId, Achievement } from "@/types/progress"
import { cn } from "@/lib/utils"

interface AchievementDef {
  readonly id: AchievementId
  readonly title: string
  readonly description: string
}

const ACHIEVEMENT_DEFS: readonly AchievementDef[] = [
  { id: "first-chapter", title: "第一歩", description: "最初のチャプターを完了した" },
  { id: "first-review", title: "復習の始まり", description: "初めて復習セッションを完了した" },
  { id: "streak-7", title: "一週間の習慣", description: "7日連続で学習した" },
  { id: "streak-30", title: "論理の達人", description: "30日連続で学習した" },
  { id: "all-chapters", title: "全章制覇", description: "すべてのチャプターを完了した" },
  { id: "100-answers", title: "百問修行", description: "合計100問に回答した" },
  { id: "perfect-quiz", title: "完全無欠", description: "クイズで満点を取った" },
]

interface AchievementListProps {
  readonly achievements: readonly Achievement[]
}

export function AchievementList({ achievements }: AchievementListProps) {
  const unlockedIds = new Set(achievements.map((a) => a.id))

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">実績</h3>
      <div className="grid gap-2">
        {ACHIEVEMENT_DEFS.map((def) => {
          const unlocked = unlockedIds.has(def.id)
          return (
            <div
              key={def.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                unlocked
                  ? "border-primary/20 bg-primary/5"
                  : "border-border opacity-50"
              )}
            >
              <span className="text-lg">{unlocked ? "★" : "☆"}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{def.title}</p>
                <p className="text-xs text-muted-foreground">{def.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
