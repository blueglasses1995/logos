"use client"

import Link from "next/link"
import { Flame, BookOpen, BarChart3 } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  const { progress } = useProgress()
  const streak = progress.streak.currentDays

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-14">
        <Link
          href="/"
          className="text-xl font-serif tracking-tight text-foreground hover:text-primary transition-colors duration-150"
        >
          Logos
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/glossary"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <BookOpen className="size-4" />
            <span className="hidden sm:inline">用語集</span>
          </Link>
          <Link
            href="/stats"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">統計</span>
          </Link>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame className="size-4 text-primary" />
              <span>{streak}日</span>
            </div>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
