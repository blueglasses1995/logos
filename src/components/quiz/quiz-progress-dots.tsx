import { cn } from "@/lib/utils"

interface QuizProgressDotsProps {
  readonly total: number
  readonly current: number
  readonly answered: number
}

export function QuizProgressDots({ total, current, answered }: QuizProgressDotsProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`問題 ${current + 1} / ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-2 rounded-full transition-all duration-300",
            i < answered && "bg-primary",
            i === current && i >= answered && "bg-primary animate-pulse",
            i > current && i >= answered && "bg-border"
          )}
        />
      ))}
    </div>
  )
}
