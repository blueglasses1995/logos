import Link from "next/link"
import { Check, ArrowRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionListItemProps {
  readonly title: string
  readonly description: string
  readonly href: string
  readonly status: "done" | "started" | "none"
  readonly isRecommended: boolean
}

export function SectionListItem({
  title,
  description,
  href,
  status,
  isRecommended,
}: SectionListItemProps) {
  return (
    <Link href={href} className="group block">
      <div
        className={cn(
          "flex items-center gap-4 rounded-lg border px-5 py-4 transition-all duration-150",
          isRecommended
            ? "border-l-4 border-l-primary bg-primary/3 border-border"
            : "border-border",
          "group-hover:border-primary/40 group-hover:shadow-sm"
        )}
      >
        <div className="shrink-0">
          {status === "done" ? (
            <Check className="size-5 text-primary" />
          ) : status === "started" ? (
            <ArrowRight className="size-5 text-primary/60" />
          ) : (
            <Circle className="size-5 text-border" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </Link>
  )
}
