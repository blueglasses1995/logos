import { cn } from "@/lib/utils"

interface SectionDotsProps {
  readonly theory: "done" | "started" | "none"
  readonly practice: "done" | "started" | "none"
  readonly philosophy: "done" | "started" | "none"
}

const STATUS_STYLES = {
  done: "bg-primary",
  started: "bg-primary/40",
  none: "bg-border",
} as const

const LABELS = ["学問", "実践", "哲学"] as const

export function SectionDots({ theory, practice, philosophy }: SectionDotsProps) {
  const statuses = [theory, practice, philosophy]

  return (
    <div className="flex items-center gap-1.5" aria-label="セクション進捗">
      {statuses.map((status, i) => (
        <span
          key={LABELS[i]}
          className={cn("size-2 rounded-full", STATUS_STYLES[status])}
          title={`${LABELS[i]}: ${status === "done" ? "完了" : status === "started" ? "進行中" : "未着手"}`}
        />
      ))}
    </div>
  )
}
